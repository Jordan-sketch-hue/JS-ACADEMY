"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { tutorFaceUrl } from "@/lib/curriculum/tutor-roster";

interface SimliAvatarProps {
  tutorId: string;
  name: string;
  size?: number;
  speaking: boolean;
  /** The live Audio element from useTts — used to read src + currentTime for PCM sync. */
  audioRef: React.RefObject<HTMLAudioElement | null>;
  simliFaceId?: string;
  gender?: "male" | "female";
}

type SimliState = "idle" | "connecting" | "live" | "error";

const SIMLI_WSS = "wss://api.simli.ai/compose/webrtc/p2p";
const PCM_SAMPLE_RATE = 16000;
const CHUNK_SAMPLES   = 320; // 20 ms at 16 kHz

export function SimliAvatar({
  tutorId,
  name,
  size = 92,
  speaking,
  audioRef,
  simliFaceId,
  gender = "female",
}: SimliAvatarProps) {
  const [state, setState] = useState<SimliState>("idle");
  const videoRef       = useRef<HTMLVideoElement>(null);
  const pcRef          = useRef<RTCPeerConnection | null>(null);
  const wsRef          = useRef<WebSocket | null>(null);
  const audioCtxRef    = useRef<AudioContext | null>(null);
  const sendIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const teardown = useCallback(() => {
    if (sendIntervalRef.current) {
      clearInterval(sendIntervalRef.current);
      sendIntervalRef.current = null;
    }
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    wsRef.current?.close();
    wsRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    setState("idle");
  }, []);

  /**
   * Fetch the audio file already playing in `audioEl`, decode it to 16-kHz PCM16,
   * and stream chunks to Simli over the open WebSocket.
   * Starts from the audio's current playback position so the lip-sync stays in sync
   * even if Simli takes a few seconds to connect.
   */
  const streamPcmToSimli = useCallback(async (audioEl: HTMLAudioElement) => {
    const src = audioEl.src;
    if (!src) { console.warn("[simli] audio.src is empty — cannot stream PCM"); return; }

    console.log("[simli] fetching audio for PCM decode:", src.slice(0, 80));
    try {
      const resp = await fetch(src);
      if (!resp.ok) throw new Error(`fetch ${resp.status}`);
      const rawBuf = await resp.arrayBuffer();

      // Decode at 16 kHz so the output matches Simli's expected sample rate.
      const ctx = new AudioContext({ sampleRate: PCM_SAMPLE_RATE });
      await ctx.resume(); // ensure context is running (Chrome suspends by default)
      audioCtxRef.current = ctx;

      const decoded = await ctx.decodeAudioData(rawBuf);

      // Down-mix to mono; use channel 0
      const f32 = decoded.getChannelData(0);
      const pcm = new Int16Array(f32.length);
      for (let i = 0; i < f32.length; i++) {
        pcm[i] = Math.max(-32768, Math.min(32767, Math.round(f32[i] * 32767)));
      }

      // Skip samples that have already played so the lip-sync lines up
      const alreadyPlayed = Math.round(audioEl.currentTime * PCM_SAMPLE_RATE);
      let offset = Math.max(0, alreadyPlayed);
      console.log(`[simli] PCM ready: ${pcm.length} samples, starting at ${offset} (${audioEl.currentTime.toFixed(2)}s elapsed)`);

      sendIntervalRef.current = setInterval(() => {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) {
          clearInterval(sendIntervalRef.current!);
          sendIntervalRef.current = null;
          return;
        }
        if (offset >= pcm.length) {
          clearInterval(sendIntervalRef.current!);
          sendIntervalRef.current = null;
          return;
        }
        const end   = Math.min(offset + CHUNK_SAMPLES, pcm.length);
        const chunk = pcm.subarray(offset, end);
        ws.send(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength));
        offset += CHUNK_SAMPLES;
      }, 20); // 20 ms per 320-sample chunk = exact 16 kHz real-time rate

    } catch (err) {
      console.warn("[simli] PCM stream failed:", err);
    }
  }, []);

  const connectSimli = useCallback(async () => {
    if (!speaking || state === "connecting" || state === "live") return;
    if (!simliFaceId) return;

    setState("connecting");

    // Wait for useTts to create the Audio element
    let audio = audioRef.current;
    if (!audio) {
      await new Promise<void>((resolve) => {
        const check = setInterval(() => {
          if (audioRef.current) { clearInterval(check); resolve(); }
        }, 50);
        setTimeout(() => { clearInterval(check); resolve(); }, 3000);
      });
      audio = audioRef.current;
      if (!audio) { console.warn("[simli] audio never appeared"); setState("error"); return; }
    }
    console.log("[simli] audio ready, fetching token for face", simliFaceId);

    // 1. Get session token + ICE servers
    let token: string;
    let iceServers: RTCIceServer[] = [{ urls: "stun:stun.l.google.com:19302" }];
    try {
      const res = await fetch("/api/ai/simli/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ face_id: simliFaceId, gender }),
      });
      const data = await res.json();
      if (!res.ok || data.fallback) { setState("error"); return; }
      token = data.session_token;
      if (Array.isArray(data.ice_servers) && data.ice_servers.length > 0) {
        iceServers = data.ice_servers;
      }
      console.log("[simli] token ok, ICE servers:", iceServers.length);
    } catch {
      console.error("[simli] token fetch threw");
      setState("error");
      return;
    }

    // 2. Create RTCPeerConnection
    const pc = new RTCPeerConnection({ sdpSemantics: "unified-plan", iceServers } as RTCConfiguration);
    pcRef.current = pc;

    pc.addTransceiver("video", { direction: "recvonly" });
    pc.addTransceiver("audio", { direction: "recvonly" });

    pc.ontrack = (e) => {
      console.log("[simli] ontrack", e.track.kind, "streams:", e.streams.length);
      const vid = videoRef.current;
      if (vid && e.streams[0]) {
        vid.srcObject = e.streams[0];
        if (e.track.kind === "video") setState("live");
      }
    };
    pc.oniceconnectionstatechange = () => console.log("[simli] ICE:", pc.iceConnectionState);
    pc.onconnectionstatechange = () => console.log("[simli] PC:", pc.connectionState);

    // 3. Gather ICE then open WebSocket
    let iceCandidateCount = 0;
    pc.onicecandidate = (e) => { if (e.candidate) iceCandidateCount++; };

    await pc.createOffer().then((offer) => pc.setLocalDescription(offer));

    await new Promise<void>((resolve) => {
      let prev = -1;
      const check = () => {
        if (pc.iceGatheringState === "complete" || iceCandidateCount === prev) { resolve(); return; }
        prev = iceCandidateCount;
        setTimeout(check, 150);
      };
      setTimeout(check, 150);
    });

    console.log("[simli] ICE done — sdp lines:", pc.localDescription?.sdp.split("\n").length);

    const wsUrl = new URL(SIMLI_WSS);
    wsUrl.searchParams.set("session_token", token);
    wsUrl.searchParams.set("enableSFU", "true");
    const ws = new WebSocket(wsUrl.toString());
    wsRef.current = ws;
    ws.binaryType = "arraybuffer";

    const wsReady = new Promise<void>((resolve, reject) => {
      ws.onopen  = () => { console.log("[simli] ws open"); resolve(); };
      ws.onerror = (e) => { console.error("[simli] ws error", e); reject(new Error("ws-error")); };
      ws.onclose = (e) => { console.log("[simli] ws closed", e.code, e.reason); reject(new Error(`ws-closed-${e.code}`)); };
    });

    ws.onmessage = async (evt) => {
      const preview = typeof evt.data === "string" ? evt.data.slice(0, 200) : `binary ${(evt.data as ArrayBuffer).byteLength}b`;
      console.log("[simli] msg:", preview);
      if (typeof evt.data !== "string") return;
      let msg: { type?: string; sdp?: string; error?: string };
      try { msg = JSON.parse(evt.data); } catch { return; }
      if (msg.sdp && msg.type === "answer") {
        console.log("[simli] applying answer");
        await pc.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp: msg.sdp }));
      } else if (msg.error) {
        console.error("[simli] server error:", msg.error);
        setState("error");
        teardown();
      }
    };

    try {
      await wsReady;
    } catch (err) {
      console.error("[simli] ws failed to open:", err);
      setState("error");
      return;
    }

    ws.onerror = (e) => { console.error("[simli] ws runtime error", e); teardown(); };
    ws.onclose = (e) => { console.log("[simli] ws runtime close", e.code); if (state !== "idle") setState("idle"); };

    // Send the offer
    console.log("[simli] sending offer");
    ws.send(JSON.stringify(pc.localDescription));

    // 4. Stream PCM audio to Simli (decode the file directly — no Web Audio tap)
    await streamPcmToSimli(audio);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speaking, state, audioRef, simliFaceId, gender, teardown, streamPcmToSimli]);

  useEffect(() => {
    if (speaking) {
      connectSimli();
    } else {
      teardown();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speaking]);

  useEffect(() => () => teardown(), [teardown]);

  const isLive = state === "live";
  const { url, isPhoto } = tutorFaceUrl(tutorId);

  return (
    <div
      className="relative shrink-0"
      style={{
        width: size,
        height: size,
        transition: "width 0.35s ease, height 0.35s ease",
        animation: speaking && !isLive ? "lcBob 0.6s ease-in-out infinite" : speaking ? "none" : "lcBreathe 3.5s ease-in-out infinite",
      }}
    >
      {/* Simli live video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width={size}
        height={size}
        className="rounded-full object-cover absolute inset-0"
        style={{
          opacity: isLive ? 1 : 0,
          transition: "opacity 0.3s",
          boxShadow: "0 0 0 3px rgba(201,164,74,0.35), 0 12px 30px rgba(0,0,0,0.5)",
        }}
      />

      {/* Static portrait — shown when idle or connecting */}
      <Image
        src={url}
        alt={`${name} avatar`}
        width={size}
        height={size}
        unoptimized={isPhoto}
        className="rounded-full object-cover"
        style={{
          width: size,
          height: size,
          opacity: isLive ? 0 : 1,
          transition: "opacity 0.3s",
          boxShadow: "0 0 0 3px rgba(201,164,74,0.35), 0 12px 30px rgba(0,0,0,0.5)",
        }}
      />

      {/* Connecting pulse ring */}
      {state === "connecting" && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: "0 0 0 4px rgba(201,164,74,0.5)", animation: "lcBreathe 1s ease-in-out infinite" }}
        />
      )}

      {/* Fallback CSS mouth bob if Simli errors */}
      {isPhoto && state === "error" && speaking && (
        <span
          aria-hidden
          className="absolute rounded-full"
          style={{
            width: size * 0.16,
            height: size * 0.064,
            left: (size - size * 0.16) / 2,
            top: size * 0.74,
            background: "rgba(20,12,4,0.55)",
            animation: "lcMouth 0.28s ease-in-out infinite",
          }}
        />
      )}

      <style jsx>{`
        @keyframes lcMouth   { 0%,100%{transform:scaleY(0.35)} 50%{transform:scaleY(1.1)} }
        @keyframes lcBob     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
        @keyframes lcBreathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.015)} }
      `}</style>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { tutorFaceUrl } from "@/lib/curriculum/tutor-roster";

interface SimliAvatarProps {
  tutorId: string;
  name: string;
  size?: number;
  speaking: boolean;
  /** The live Audio element from useTts — tapped for PCM to feed Simli. */
  audioRef: React.RefObject<HTMLAudioElement | null>;
  simliFaceId?: string;
  gender?: "male" | "female";
}

type SimliState = "idle" | "connecting" | "live" | "error";

const SIMLI_WSS = "wss://api.simli.ai/compose/webrtc/p2p";
const PCM_SAMPLE_RATE = 16000;
const SCRIPT_PROC_BUFFER = 1024;

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
  const videoRef      = useRef<HTMLVideoElement>(null);
  const pcRef         = useRef<RTCPeerConnection | null>(null);
  const wsRef         = useRef<WebSocket | null>(null);
  const audioCtxRef   = useRef<AudioContext | null>(null);
  const processorRef  = useRef<ScriptProcessorNode | null>(null);
  const sourceRef     = useRef<MediaElementAudioSourceNode | null>(null);

  const teardown = useCallback(() => {
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    processorRef.current = null;
    sourceRef.current    = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current  = null;
    wsRef.current?.close();
    wsRef.current        = null;
    pcRef.current?.close();
    pcRef.current        = null;
    setState("idle");
  }, []);

  const connectSimli = useCallback(async () => {
    if (!speaking || state === "connecting" || state === "live") return;
    if (!simliFaceId) return;

    setState("connecting");

    /* Wait for useTts to create the Audio element (setSpeaking(true) fires before async fetch → playAudioUrl sets audioRef). */
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

    /* 1. Get session token via our server route (keeps API key secret). */
    let token: string;
    try {
      const res = await fetch("/api/ai/simli/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ face_id: simliFaceId, gender }),
      });
      const data = await res.json();
      if (!res.ok || data.fallback) {
        setState("error");
        return;
      }
      token = data.session_token;
      console.log("[simli] token ok, opening WebSocket");
    } catch {
      console.error("[simli] token fetch threw");
      setState("error");
      return;
    }

    /* 2. Create RTCPeerConnection with recvonly transceivers so offer SDP includes m=video + m=audio. */
    const pc = new RTCPeerConnection({
      sdpSemantics: "unified-plan",
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    } as RTCConfiguration);
    pcRef.current = pc;

    pc.addTransceiver("video", { direction: "recvonly" });
    pc.addTransceiver("audio", { direction: "recvonly" });

    /* Video/audio tracks from Simli → render in <video>. */
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

    /* 3. Gather ICE candidates, then open WebSocket and do signalling. */

    /* ICE gathering — must happen before we open the WS so the offer is complete. */
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

    /* Open WebSocket and set ALL handlers before any events can fire. */
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
      if (msg.sdp) {
        console.log("[simli] applying answer");
        await pc.setRemoteDescription(new RTCSessionDescription({
          type: (msg.type as RTCSdpType) ?? "answer",
          sdp: msg.sdp,
        }));
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

    /* Post-open: replace open/close handlers with runtime ones. */
    ws.onerror = (e) => { console.error("[simli] ws runtime error", e); teardown(); };
    ws.onclose = (e) => { console.log("[simli] ws runtime close", e.code); if (state !== "idle") setState("idle"); };

    /* Send the offer. */
    console.log("[simli] sending offer");
    ws.send(JSON.stringify(pc.localDescription));

    /* 4. Tap TTS audio with Web Audio API → send PCM16 to Simli over WebSocket. */
    try {
      const ctx = new AudioContext({ sampleRate: PCM_SAMPLE_RATE });
      audioCtxRef.current = ctx;

      const source = ctx.createMediaElementSource(audio);
      sourceRef.current = source;

      // eslint-disable-next-line @typescript-eslint/no-deprecated
      const proc = ctx.createScriptProcessor(SCRIPT_PROC_BUFFER, 1, 1);
      processorRef.current = proc;

      proc.onaudioprocess = (e) => {
        const ws2 = wsRef.current;
        if (!ws2 || ws2.readyState !== WebSocket.OPEN) return;
        const f32 = e.inputBuffer.getChannelData(0);
        const i16 = new Int16Array(f32.length);
        for (let i = 0; i < f32.length; i++) {
          i16[i] = Math.max(-32768, Math.min(32767, Math.round(f32[i] * 32767)));
        }
        ws2.send(new Uint8Array(i16.buffer));
      };

      source.connect(proc);
      proc.connect(ctx.destination); // audio still plays normally for the student
    } catch {
      // Web Audio tap failed — avatar stays as static portrait, audio still plays
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speaking, state, audioRef, simliFaceId, gender, teardown]);

  /* Start Simli when speaking begins, tear down when it stops. */
  useEffect(() => {
    if (speaking) {
      connectSimli();
    } else {
      teardown();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speaking]);

  /* Cleanup on unmount. */
  useEffect(() => () => teardown(), [teardown]);

  const isLive = state === "live";
  const { url, isPhoto } = tutorFaceUrl(tutorId);

  return (
    <div
      className="relative shrink-0"
      style={{
        width: size,
        height: size,
        animation: speaking && !isLive ? "lcBob 0.6s ease-in-out infinite" : speaking ? "none" : "lcBreathe 3.5s ease-in-out infinite",
      }}
    >
      {/* Simli live video — shown while WebRTC is connected */}
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

      {/* Static portrait — shown when idle or during connect */}
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

      {/* Fallback CSS mouth bob when Simli is unavailable */}
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

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
  const simliRef      = useRef<unknown>(null);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sc = simliRef.current as any;
    if (sc?.stop) sc.stop().catch(() => {});
    simliRef.current = null;
    setState("idle");
  }, []);

  const connectSimli = useCallback(async () => {
    if (!speaking || state === "connecting" || state === "live") return;
    const audio = audioRef.current;
    if (!audio || !simliFaceId) return;

    setState("connecting");

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
    } catch {
      setState("error");
      return;
    }

    /* 2. Dynamically import SimliClient (avoids SSR issues). */
    let SimliClient: unknown;
    let LogLevel: unknown;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod = await import("simli-client") as any;
      SimliClient = mod.SimliClient;
      LogLevel    = mod.LogLevel;
    } catch {
      setState("error");
      return;
    }

    /* 3. Initialize SimliClient with LiveKit transport (no P2P ICE needed). */
    try {
      const vid = videoRef.current;
      if (!vid) { setState("error"); return; }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sc = new (SimliClient as any)(
        token,
        vid,
        null,      // audioElement — Simli streams video only; we provide audio ourselves
        null,      // iceServers — null for LiveKit mode
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (LogLevel as any).ERROR,
        "livekit",
      );
      simliRef.current = sc;

      sc.on("start",  () => setState("live"));
      sc.on("stop",   () => { if (state !== "idle") setState("idle"); });
      sc.on("error",  () => setState("error"));
      sc.on("startup_error", () => setState("error"));

      await sc.start();
    } catch {
      setState("error");
      return;
    }

    /* 4. Tap TTS audio with Web Audio API → send PCM16 to SimliClient. */
    try {
      const ctx = new AudioContext({ sampleRate: PCM_SAMPLE_RATE });
      audioCtxRef.current = ctx;

      const source = ctx.createMediaElementSource(audio);
      sourceRef.current = source;

      // eslint-disable-next-line @typescript-eslint/no-deprecated
      const proc = ctx.createScriptProcessor(SCRIPT_PROC_BUFFER, 1, 1);
      processorRef.current = proc;

      proc.onaudioprocess = (e) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sc = simliRef.current as any;
        if (!sc?.sendAudioData) return;
        const f32 = e.inputBuffer.getChannelData(0);
        const i16 = new Int16Array(f32.length);
        for (let i = 0; i < f32.length; i++) {
          i16[i] = Math.max(-32768, Math.min(32767, Math.round(f32[i] * 32767)));
        }
        sc.sendAudioData(new Uint8Array(i16.buffer));
      };

      source.connect(proc);
      proc.connect(ctx.destination); // audio still plays normally for the student
    } catch {
      // Web Audio tap failed — avatar stays as static portrait, audio still plays
    }
  }, [speaking, state, audioRef, simliFaceId, gender]);

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
      {/* Simli live video — shown while connected */}
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

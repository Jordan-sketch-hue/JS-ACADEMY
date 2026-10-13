"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTts } from "@/lib/use-tts";
import { trackModuleVisit, type AssignmentMeta } from "@/lib/progress";
import { tutorFromInstructor } from "@/lib/curriculum/instructors";
import { useTutorChoice } from "@/lib/use-tutor";
import { SimliAvatar } from "@/components/simli-avatar";
import { Volume2, ChevronRight, X, Play, Pause } from "lucide-react";

interface LessonModule { id: string; title: string; order: number; hours: number; }

interface LessonShellProps {
  courseId: string;
  courseTitle: string;
  moduleOrder: number;
  moduleTitle: string;
  moduleSubtitle?: string;
  totalModules: number;
  allModules: LessonModule[];
  currentModuleId: string;
  instructor: string;
  voiceNote: string;
  children: React.ReactNode;
  /** Homework metadata for smart assignment tracking. */
  homework?: {
    title: string;
    type: string;
    instructions?: string;
    rubric?: { criterion: string; weight: number }[];
  };
}

function buildSentenceMap(text: string) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  let cursor = 0;
  return sentences.map((s) => {
    const start = cursor;
    cursor += s.length;
    return { start, end: cursor };
  });
}

export function LessonShell({
  courseId,
  courseTitle,
  moduleOrder,
  moduleTitle,
  moduleSubtitle,
  totalModules,
  allModules,
  currentModuleId,
  instructor,
  voiceNote,
  children,
  homework,
}: LessonShellProps) {
  const { speak, stop, speaking, audioRef } = useTts();
  const lastSentenceRef = useRef(-1);

  /* Assorted tutor roster: Dr. Gooden teaches the English / Jamaica material
     (she has real on-camera clips); the other languages have their own
     tutors, male and female, rendered as a branded tutor panel. */
  const tutor  = tutorFromInstructor(instructor);

  /* Student-selectable tutor: each language offers several native voices.
     Lang is the first 2 letters of the (Azure) voice id (es-MX-… → es). */
  const lang = tutor.voiceId.slice(0, 2) || "en";
  const choice = useTutorChoice(lang, tutor.voiceId, tutor.gender);
  const activeTutor = choice.current;
  /* Smart tracking: stamp visit + auto-enroll in Supabase on first open. */
  useEffect(() => {
    const meta: AssignmentMeta | undefined = homework
      ? {
          courseId,
          courseTitle,
          moduleTitle,
          homeworkTitle:  homework.title,
          homeworkType:   homework.type,
          instructions:   homework.instructions,
          rubric:         homework.rubric,
        }
      : undefined;
    trackModuleVisit(currentModuleId, meta);
    // Auto-enroll (idempotent upsert — safe to call on every lesson visit)
    fetch("/api/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    }).catch(() => {});
  // Only re-run when the module actually changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentModuleId]);

  /* Read + reactively refresh completed modules from localStorage. */
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  useEffect(() => {
    function refresh() {
      try {
        const raw = localStorage.getItem("lc-progress-v1");
        if (raw) {
          const p = JSON.parse(raw) as { modulesDone?: Record<string, string[]> };
          setCompletedIds(p.modulesDone?.[courseId] ?? []);
        }
      } catch { /* ignore */ }
    }
    refresh();
    window.addEventListener("lc-progress", refresh);
    return () => window.removeEventListener("lc-progress", refresh);
  }, [courseId]);

  const sentenceMap = useMemo(() => buildSentenceMap(voiceNote), [voiceNote]);

  const onBoundary = useCallback(
    (charIdx: number) => {
      const idx = sentenceMap.findIndex((s) => charIdx < s.end);
      const sentenceIdx = idx === -1 ? sentenceMap.length - 1 : idx;
      if (sentenceIdx === lastSentenceRef.current) return;
      lastSentenceRef.current = sentenceIdx;
    },
    [sentenceMap],
  );

  /* Nothing auto-plays — stop any narration when leaving a module. */
  useEffect(() => {
    return () => { stop(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleOrder]);

  function handleVoiceNote() {
    if (speaking) { stop(); return; }
    lastSentenceRef.current = -1;
    // voiceNote (moduleIntro) is always generic English instructional copy —
    // "Let's begin X. Listen through with me..." — even on the Spanish/German/
    // Chinese/Japanese/French courses. Read it with an English voice always;
    // only target-language content (vocabulary, cultural notes) should use
    // the student's chosen foreign-language tutor voice.
    speak(voiceNote, { onBoundary, gender: "female", voiceId: "en-GB-SoniaNeural" });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* ── TOP BAR ── */}
      <div
        className="flex items-center shrink-0"
        style={{
          height: 52,
          background: "var(--bg-sidebar)",
          borderBottom: "1px solid rgba(245,239,228,.10)",
        }}
      >
        {/* Logo — hide text on small screens to save space */}
        <div
          className="flex items-center gap-2.5 px-3 sm:px-5 h-full shrink-0"
          style={{ borderRight: "1px solid rgba(245,239,228,.10)" }}
        >
          <Image src="/iblc-logo.jpg" width={28} height={28} alt="IBLC" className="rounded-full" />
          <span className="hidden sm:inline font-display text-[15px]" style={{ color: "#f5efe4" }}>
            IBLC <span style={{ color: "#c9a44a" }}>·</span> Language Cradle
          </span>
        </div>

        {/* Breadcrumb — hide course title on small screens */}
        <div
          className="flex-1 flex items-center gap-2 px-3 sm:px-5 text-[11px] min-w-0"
          style={{ color: "rgba(245,239,228,.45)" }}
        >
          <Link href="/dashboard/student/courses" className="hover:opacity-80 transition shrink-0" style={{ color: "rgba(245,239,228,.45)" }}>
            Courses
          </Link>
          <ChevronRight className="hidden sm:block w-3 h-3 shrink-0" />
          <Link href={`/dashboard/student/courses/${courseId}`} className="hidden sm:block hover:opacity-80 transition truncate" style={{ color: "rgba(245,239,228,.45)", maxWidth: 160 }}>
            {courseTitle}
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <strong className="truncate" style={{ color: "rgba(245,239,228,.85)" }}>
            <span className="hidden sm:inline">Module {moduleOrder} · </span>{moduleTitle}
          </strong>
        </div>

        {/* Progress — compact counter on small/medium, full dots on xl+ */}
        <div
          className="flex items-center shrink-0 px-3 sm:px-5"
          style={{ borderLeft: "1px solid rgba(245,239,228,.10)" }}
        >
          {/* Compact pill: visible below xl */}
          <span
            className="xl:hidden text-[11px] font-bold tabular-nums px-2 py-0.5 rounded-full"
            style={{ background: "rgba(201,164,74,.18)", color: "#c9a44a" }}
          >
            {moduleOrder}/{totalModules}
          </span>
          {/* Full dot trail: visible on xl+ */}
          <div className="hidden xl:flex items-center gap-1.5">
            {Array.from({ length: totalModules }).map((_, i) => {
              const mod  = allModules[i];
              const done   = mod ? completedIds.includes(mod.id) : false;
              const active = mod ? mod.id === currentModuleId : false;
              return (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: done ? "var(--green)" : active ? "#c9a44a" : "rgba(245,239,228,.18)",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Exit — hide label on small screens */}
        <Link
          href={`/dashboard/student/courses/${courseId}`}
          className="flex items-center gap-1.5 px-3 sm:px-4 h-full text-[11px] hover:opacity-70 transition shrink-0"
          style={{ borderLeft: "1px solid rgba(245,239,228,.10)", color: "rgba(245,239,228,.45)" }}
        >
          <X className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Exit lesson</span>
        </Link>
      </div>

      {/* ── BODY ── */}
      <div className="flex flex-1 min-h-0">

        {/* ── MODULE NAV SIDEBAR (nav only — video moved to main content) ── */}
        <aside
          className="w-52 shrink-0 flex flex-col overflow-y-auto"
          style={{
            background: "var(--bg-sidebar)",
            borderRight: "1px solid rgba(245,239,228,.08)",
          }}
        >
          {/* RYG accent rail */}
          <div className="flex shrink-0" style={{ height: 3 }}>
            <div className="flex-1" style={{ background: "var(--red)" }} />
            <div className="flex-1" style={{ background: "var(--yellow)" }} />
            <div className="flex-1" style={{ background: "var(--green)" }} />
          </div>

          {/* Module nav label */}
          <div
            className="px-4 pt-3 pb-1 text-[9px] font-bold tracking-[.2em] uppercase shrink-0"
            style={{ color: "rgba(245,239,228,.35)" }}
          >
            Course Modules
          </div>

          {/* Module list */}
          <nav className="flex flex-col pb-4 flex-1">
            {allModules.map((mod) => {
              const done   = completedIds.includes(mod.id);
              const active = mod.id === currentModuleId;
              const locked = !done && !active && mod.order > moduleOrder;
              return (
                <Link
                  key={mod.id}
                  href={locked ? "#" : `/dashboard/student/courses/${courseId}/${mod.id}`}
                  onClick={locked ? (e) => e.preventDefault() : undefined}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[12px] transition-colors"
                  style={{
                    background: active ? "rgba(139,106,30,.18)" : "transparent",
                    color: active
                      ? "#f5efe4"
                      : done
                      ? "rgba(245,239,228,.65)"
                      : "rgba(245,239,228,.4)",
                    boxShadow: active ? "inset 2px 0 0 #c9a44a" : "none",
                    cursor: locked ? "default" : "pointer",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                    style={{
                      background: done
                        ? "var(--green)"
                        : active
                        ? "#c9a44a"
                        : "rgba(245,239,228,.1)",
                      color: done || active ? "var(--bg-sidebar)" : "rgba(245,239,228,.4)",
                    }}
                  >
                    {done ? "✓" : mod.order}
                  </div>
                  <div className="flex-1 min-w-0 leading-snug">
                    <div className="truncate">{mod.title}</div>
                    <div className="text-[10px]" style={{ color: "rgba(245,239,228,.3)" }}>
                      {mod.hours}h
                    </div>
                  </div>
                  {active && (
                    <span
                      className="text-[9px] font-bold tracking-[.1em] uppercase px-1.5 py-0.5 rounded shrink-0"
                      style={{ background: "rgba(139,106,30,.3)", color: "#c9a44a" }}
                    >
                      Now
                    </span>
                  )}
                  {locked && (
                    <span className="text-[10px] shrink-0" style={{ color: "rgba(245,239,228,.2)" }}>
                      🔒
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* ── MAIN LESSON CONTENT ── */}
        <main
          className="flex-1 overflow-y-auto flex flex-col"
          style={{ background: "var(--bg-base)" }}
        >
          {/* ── LANDSCAPE INSTRUCTOR PANEL ── Simli real-time lip-sync for all tutors. */}
          <div className="relative shrink-0" style={{ background: "#000" }}>
            <div
              className="w-full flex items-center justify-center"
              style={{
                aspectRatio: "16/9",
                maxHeight: 320,
                background:
                  "radial-gradient(80% 110% at 50% 0%, rgba(201,164,74,0.22), transparent 60%)," +
                  "linear-gradient(135deg, #14100a 0%, #1d1407 55%, #0e0a04 100%)",
              }}
            >
              <div className="flex flex-col items-center gap-3 pb-8">
                <SimliAvatar
                  tutorId={activeTutor.id}
                  name={activeTutor.name}
                  size={speaking ? 240 : 92}
                  speaking={speaking}
                  audioRef={audioRef}
                  simliFaceId={activeTutor.simliFaceId}
                  gender={activeTutor.gender}
                />
                <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "rgba(245,239,228,0.6)" }}>
                  {activeTutor.accent}
                </div>
              </div>
            </div>

            {/* Gradient overlay: strong at bottom for text legibility, subtle at top */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(14,10,4,.92) 0%, rgba(14,10,4,.12) 55%, transparent 100%)",
              }}
            />

            {/* Play overlay — shown until the voice note is playing. Click to begin. */}
            {!speaking && (
              <button
                type="button"
                onClick={handleVoiceNote}
                aria-label={`Play ${activeTutor.name}'s voice note`}
                className="absolute inset-0 flex items-center justify-center group"
                style={{ background: "rgba(0,0,0,.32)" }}
              >
                <span
                  className="flex items-center justify-center rounded-full transition-transform group-hover:scale-105"
                  style={{ width: 60, height: 60, background: "rgba(245,239,228,.92)", boxShadow: "0 6px 24px rgba(0,0,0,.4)" }}
                >
                  <Play className="w-6 h-6 ml-1" style={{ color: "#1a1208", fill: "#1a1208" }} />
                </span>
              </button>
            )}

            {/* LIVE badge — only while actually playing */}
            {speaking && (
              <div
                className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1"
                style={{ background: "rgba(0,0,0,.6)" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--red)", animation: "lcPulse 2s infinite" }}
                />
                <span className="text-[9px] font-bold tracking-[.12em] text-white">LIVE LESSON</span>
              </div>
            )}

            {/* Module counter badge */}
            <div
              className="absolute top-3 right-3 text-[9px] font-bold tracking-[.1em] uppercase rounded-full px-2.5 py-1"
              style={{ background: "rgba(0,0,0,.6)", color: "#c9a44a" }}
            >
              Module {moduleOrder} / {totalModules}
            </div>

            {/* Bottom row: instructor info + voice note button */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-4 pt-2 flex items-end justify-between">
              <div className="pointer-events-none">
                <div className="font-display text-[15px] leading-tight" style={{ color: "#f5efe4" }}>
                  {activeTutor.name}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: "rgba(245,239,228,.55)" }}>
                  Course Instructor · The Language Cradle
                </div>
              </div>

              <button
                onClick={handleVoiceNote}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors"
                style={{
                  background: speaking ? "rgba(139,106,30,.55)" : "rgba(0,0,0,.65)",
                  border: "1px solid rgba(139,106,30,.45)",
                  color: "#c9a44a",
                  animation: speaking ? "lcGlow 1.5s ease-in-out infinite" : "none",
                }}
              >
                {speaking ? <Pause className="w-3.5 h-3.5 shrink-0" /> : <Volume2 className="w-3.5 h-3.5 shrink-0" />}
                {speaking ? "Stop voice note" : `${activeTutor.name}'s Voice Note`}
              </button>
            </div>
          </div>

          {/* Lesson header */}
          <div className="px-8 pt-8 shrink-0">
            <div
              className="text-[10px] font-bold tracking-[.22em] uppercase mb-2"
              style={{ color: "var(--gold)" }}
            >
              Module {moduleOrder} · {courseTitle}
            </div>
            <h1
              className="font-display leading-tight"
              style={{ fontSize: 32, color: "var(--text-primary)" }}
            >
              {moduleTitle}
            </h1>
            {moduleSubtitle && (
              <p
                className="mt-2 leading-relaxed"
                style={{ fontSize: 14, color: "var(--text-secondary)" }}
              >
                {moduleSubtitle}
              </p>
            )}
            <div className="flex rounded overflow-hidden mt-4" style={{ height: 3, width: 48 }}>
              <div className="flex-1" style={{ background: "var(--red)" }} />
              <div className="flex-1" style={{ background: "var(--yellow)" }} />
              <div className="flex-1" style={{ background: "var(--green)" }} />
            </div>

            {/* Tutor picker — choose which native tutor teaches this lesson */}
            {choice.tutors.length > 1 && (
              <div className="mt-5 flex items-center gap-2.5 flex-wrap">
                <span className="text-[10px] font-bold tracking-[.18em] uppercase" style={{ color: "var(--text-secondary)" }}>
                  Your tutor
                </span>
                <select
                  value={choice.tutorId}
                  onChange={(e) => { stop(); choice.setTutor(e.target.value); }}
                  aria-label="Choose your tutor"
                  className="text-xs rounded-lg px-3 py-1.5 cursor-pointer outline-none"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text-primary)" }}
                >
                  {choice.tutors.map((t) => (
                    <option key={t.id} value={t.id} disabled={t.comingSoon}>
                      {t.name} · {t.accent}{t.comingSoon ? " (coming soon)" : ""}
                    </option>
                  ))}
                </select>
                <span className="text-[11px]" style={{ color: "var(--text-secondary)", opacity: 0.7 }}>
                  native voices — pick the one that teaches you
                </span>
              </div>
            )}
          </div>

          {/* Content sections */}
          <div className="px-8 pb-12 pt-6 space-y-6 flex-1">
            {children}
          </div>
        </main>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes lcPulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes lcGlow  { 0%,100%{box-shadow:0 0 0 0 rgba(201,164,74,0)} 50%{box-shadow:0 0 0 6px rgba(201,164,74,.14)} }
      `}</style>
    </div>
  );
}

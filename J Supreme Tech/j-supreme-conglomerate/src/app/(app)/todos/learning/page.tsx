"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

type Item = { label: string };
type Group = { label: string; items: Item[] };
type Section = {
  id: string;
  label: string;
  dot: string;
  items?: Item[];
  groups?: Group[];
};

const SECTIONS: Section[] = [
  {
    id: "s1",
    label: "Foundation",
    dot: "#3B6FE8",
    items: [
      { label: "Google Project Management Professional Certificate" },
      { label: "Google Data Analytics Professional Certificate" },
      { label: "Google Digital Marketing & E-commerce Professional Certificate" },
      { label: "Microsoft Excel Professional Certificate" },
      { label: "Microsoft AI Business Professional Certificate" },
      { label: "Google IT Support Professional Certificate" },
      { label: "Microsoft Power BI Data Analyst Professional Certificate" },
      { label: "Google Cybersecurity Professional Certificate" },
      { label: "IBM Data Analyst Professional Certificate" },
      { label: "ASU TESOL Professional Certificate" },
    ],
  },
  {
    id: "s2",
    label: "Coding & Software Development",
    dot: "#7C3AED",
    items: [
      { label: "Meta Front-End Developer Professional Certificate" },
      { label: "Meta Back-End Developer Professional Certificate" },
      { label: "IBM Full Stack Software Developer Professional Certificate" },
      { label: "Google IT Automation with Python Professional Certificate" },
    ],
  },
  {
    id: "s3",
    label: "QA / Software Testing",
    dot: "#EA580C",
    items: [
      { label: "Software Testing / QA Certification" },
      { label: "API Testing with Postman" },
      { label: "Selenium / Web Automation" },
      { label: "QA Automation / Test Automation" },
    ],
  },
  {
    id: "s4",
    label: "Databases",
    dot: "#0891B2",
    items: [
      { label: "SQL Certification / Specialization" },
      { label: "PostgreSQL" },
      { label: "Database Design / Relational Databases" },
    ],
  },
  {
    id: "s5",
    label: "Cloud & DevOps",
    dot: "#059669",
    items: [
      { label: "Microsoft Azure Fundamentals (AZ-900)" },
      { label: "AWS Cloud Practitioner" },
      { label: "Google Cloud Fundamentals" },
      { label: "Cloud Engineering Fundamentals" },
      { label: "DevOps Fundamentals" },
    ],
  },
  {
    id: "s6",
    label: "AI & Machine Learning",
    dot: "#DB2777",
    items: [
      { label: "Generative AI Specialization" },
      { label: "Prompt Engineering" },
      { label: "Python for AI" },
      { label: "Machine Learning Fundamentals" },
      { label: "AI Automation / AI Agents" },
    ],
  },
  {
    id: "s7",
    label: "Portfolio & Experience Builds",
    dot: "#D97706",
    items: [
      { label: "Build Project Management portfolio project" },
      { label: "Build Data Analytics portfolio project" },
      { label: "Build Power BI dashboard" },
      { label: "Build Marketing portfolio" },
      { label: "Build AI automation project" },
      { label: "Build IT Support lab" },
      { label: "Build Cybersecurity lab" },
      { label: "Build QA testing portfolio" },
      { label: "Build API testing project" },
      { label: "Build Selenium automation project" },
      { label: "Build Front-End website" },
      { label: "Build Back-End API" },
      { label: "Build Full-Stack application" },
      { label: "Build Python automation project" },
      { label: "Build SQL/database project" },
      { label: "Build cloud deployment project" },
    ],
  },
  {
    id: "s8",
    label: "Career Targets",
    dot: "#6366F1",
    groups: [
      {
        label: "Operations & Admin",
        items: [
          { label: "Project Coordinator" },
          { label: "Project Assistant" },
          { label: "Project Administrator" },
          { label: "Operations Coordinator" },
          { label: "Operations Assistant" },
          { label: "Administrative Assistant" },
          { label: "Executive Assistant" },
          { label: "Virtual Assistant" },
          { label: "Customer Success Specialist" },
        ],
      },
      {
        label: "Data & Analytics",
        items: [
          { label: "Data Entry Specialist" },
          { label: "Data Processing Clerk" },
          { label: "Data Quality Specialist" },
          { label: "Data Operations Assistant" },
          { label: "Reporting Analyst" },
          { label: "Junior Data Analyst" },
          { label: "Data Analyst" },
          { label: "Junior Business Analyst" },
          { label: "Junior BI Analyst" },
          { label: "Power BI Analyst" },
        ],
      },
      {
        label: "Marketing & Digital",
        items: [
          { label: "Marketing Assistant" },
          { label: "Marketing Coordinator" },
          { label: "Digital Marketing Specialist" },
          { label: "SEO Specialist" },
          { label: "Social Media Specialist" },
          { label: "E-commerce Specialist" },
          { label: "Marketing Operations Assistant" },
        ],
      },
      {
        label: "AI & Automation",
        items: [
          { label: "AI Administrative Assistant" },
          { label: "AI Business Operations Assistant" },
          { label: "AI Automation Specialist" },
          { label: "AI Workflow Specialist" },
        ],
      },
      {
        label: "IT & Support",
        items: [
          { label: "IT Support Technician" },
          { label: "Help Desk Technician" },
          { label: "Service Desk Analyst" },
          { label: "Technical Support Representative" },
          { label: "Desktop Support Technician" },
          { label: "Application Support Specialist" },
          { label: "Systems Support Technician" },
        ],
      },
      {
        label: "Cybersecurity",
        items: [
          { label: "Junior Cybersecurity Analyst" },
          { label: "SOC Analyst — Tier 1" },
          { label: "Cybersecurity Support Technician" },
          { label: "GRC Analyst — Junior" },
        ],
      },
      {
        label: "QA & Testing",
        items: [
          { label: "QA Tester" },
          { label: "Manual QA Tester" },
          { label: "Software Tester" },
          { label: "Junior QA Analyst" },
          { label: "QA Analyst" },
          { label: "Test Analyst" },
          { label: "Junior Software Test Engineer" },
          { label: "QA Automation Engineer" },
          { label: "Test Automation Developer" },
          { label: "SDET — Junior" },
        ],
      },
      {
        label: "Software Development",
        items: [
          { label: "Junior Web Developer" },
          { label: "Junior Front-End Developer" },
          { label: "Junior Back-End Developer" },
          { label: "Junior Full-Stack Developer" },
          { label: "JavaScript Developer" },
          { label: "TypeScript Developer" },
          { label: "React Developer" },
          { label: "Node.js Developer" },
          { label: "Python Developer" },
          { label: "API Developer" },
          { label: "Web Application Developer" },
          { label: "Junior Software Developer" },
          { label: "Junior Software Engineer" },
        ],
      },
      {
        label: "Cloud & Infrastructure",
        items: [
          { label: "Cloud Support Associate" },
          { label: "Cloud Support Technician" },
          { label: "Junior Cloud Engineer" },
          { label: "Cloud Engineer" },
          { label: "DevOps Assistant" },
          { label: "Junior DevOps Engineer" },
          { label: "Infrastructure Support Technician" },
        ],
      },
      {
        label: "Databases & Systems",
        items: [
          { label: "Junior SQL Developer" },
          { label: "Database Support Specialist" },
          { label: "Junior Database Administrator" },
          { label: "Junior Systems Analyst" },
          { label: "Junior Systems Administrator" },
          { label: "Database Analyst" },
        ],
      },
      {
        label: "Teaching & Education",
        items: [
          { label: "ESL Teacher" },
          { label: "Online English Teacher" },
          { label: "Online English Tutor" },
          { label: "ESL Teaching Assistant" },
        ],
      },
    ],
  },
  {
    id: "s9",
    label: "Long-Term Career Path",
    dot: "#0F766E",
    items: [
      { label: "QA Tester" },
      { label: "QA Automation Engineer" },
      { label: "Junior Developer" },
      { label: "Software Developer" },
      { label: "Software Engineer" },
      { label: "Senior Software Engineer" },
      { label: "Tech Lead" },
      { label: "Software Architect" },
      { label: "Cloud Engineer" },
      { label: "DevOps Engineer" },
      { label: "Senior DevOps Engineer" },
      { label: "Solutions Architect" },
      { label: "Cloud Architect" },
    ],
  },
];

const STORAGE_KEY = "learning-roadmap-v1";

function itemKey(sectionId: string, groupIdx: number, itemIdx: number) {
  return `${sectionId}-${groupIdx}-${itemIdx}`;
}

function getSectionItems(sec: Section): string[] {
  const keys: string[] = [];
  if (sec.items) sec.items.forEach((_, i) => keys.push(itemKey(sec.id, 0, i)));
  if (sec.groups)
    sec.groups.forEach((g, gi) =>
      g.items.forEach((_, ii) => keys.push(itemKey(sec.id, gi + 1, ii)))
    );
  return keys;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function LearningRoadmapPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      setChecked(stored);
    } catch {}
    // Start all sections open
    const initial: Record<string, boolean> = {};
    SECTIONS.forEach((s) => (initial[s.id] = true));
    setOpen(initial);
    setMounted(true);
  }, []);

  const toggle = useCallback((key: string, val: boolean) => {
    setChecked((prev) => {
      const next = { ...prev, [key]: val };
      if (!val) delete next[key];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const toggleSection = (id: string) =>
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    SECTIONS.forEach((s) => (next[s.id] = true));
    setOpen(next);
  };

  const collapseAll = () => setOpen({});

  const clearAll = () => {
    if (!confirm("Reset all checkboxes?")) return;
    setChecked({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  // Progress
  const allKeys = SECTIONS.flatMap(getSectionItems);
  const total = allKeys.length;
  const done = allKeys.filter((k) => checked[k]).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[--bg,#F7F8FC] dark:bg-[#10131A] pb-16">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-[#191D28] border-b border-[#E2E6F0] dark:border-[#2A3048] shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h1 className="font-bold text-base tracking-tight text-gray-900 dark:text-gray-100">
              Learning <span className="text-blue-600 dark:text-blue-400">Roadmap</span>
            </h1>
            <span className="text-xs font-semibold text-gray-400 tabular-nums">
              {done} / {total} done &nbsp;·&nbsp; {pct}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-4">
        {/* Controls */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={expandAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Expand all
          </button>
          <button
            onClick={collapseAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Collapse all
          </button>
          <div className="flex-1" />
          <button
            onClick={clearAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
          >
            Reset checks
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {SECTIONS.map((sec) => {
            const keys = getSectionItems(sec);
            const secTotal = keys.length;
            const secDone = keys.filter((k) => checked[k]).length;
            const isOpen = open[sec.id];

            return (
              <div
                key={sec.id}
                className="bg-white dark:bg-[#191D28] border border-[#E2E6F0] dark:border-[#2A3048] rounded-xl overflow-hidden shadow-sm"
              >
                {/* Section header */}
                <button
                  onClick={() => toggleSection(sec.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-[#1F2433] transition-colors border-b border-transparent data-[open]:border-[#E2E6F0] dark:data-[open]:border-[#2A3048]"
                  data-open={isOpen ? "" : undefined}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: sec.dot }}
                  />
                  <span className="font-bold text-sm text-gray-900 dark:text-gray-100 flex-1 text-left">
                    {sec.label}
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
                    {secDone}/{secTotal}
                  </span>
                  <span className={`text-gray-400 text-xs transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                {/* Section body */}
                {isOpen && (
                  <div className="px-4 py-3">
                    {sec.groups ? (
                      <div className="space-y-4">
                        {sec.groups.map((g, gi) => (
                          <div key={gi}>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 pb-1.5 border-b border-gray-100 dark:border-gray-800">
                              {g.label}
                            </div>
                            <ItemGrid
                              items={g.items}
                              sectionId={sec.id}
                              groupIdx={gi + 1}
                              checked={checked}
                              onToggle={toggle}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ItemGrid
                        items={sec.items!}
                        sectionId={sec.id}
                        groupIdx={0}
                        checked={checked}
                        onToggle={toggle}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Item grid ───────────────────────────────────────────────────────────────

function ItemGrid({
  items,
  sectionId,
  groupIdx,
  checked,
  onToggle,
}: {
  items: Item[];
  sectionId: string;
  groupIdx: number;
  checked: Record<string, boolean>;
  onToggle: (key: string, val: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
      {items.map((item, ii) => {
        const k = itemKey(sectionId, groupIdx, ii);
        const isDone = !!checked[k];
        return (
          <label
            key={ii}
            className="flex items-start gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1F2433] transition-colors group"
          >
            <input
              type="checkbox"
              checked={isDone}
              onChange={(e) => onToggle(k, e.target.checked)}
              className="mt-0.5 shrink-0 w-3.5 h-3.5 rounded accent-blue-600 cursor-pointer"
            />
            <span
              className={`text-[13px] leading-snug transition-colors ${
                isDone
                  ? "line-through text-gray-300 dark:text-gray-600"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {item.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}

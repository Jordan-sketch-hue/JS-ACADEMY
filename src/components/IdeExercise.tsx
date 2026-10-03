'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import type { IdeExercise } from '@/lib/courses'
import { Play, RotateCcw, ChevronRight, Check, Lightbulb, X, Loader2 } from 'lucide-react'

declare global {
  interface Window {
    monaco: any
    require: any
  }
}

interface Props {
  exercise: IdeExercise
  onComplete?: () => void
}

// ─── Language groups ────────────────────────────────────────────────────────
const WEB_LANGS    = new Set(['javascript', 'typescript', 'html', 'css'])
const SERVER_LANGS = new Set(['go', 'rust', 'cpp', 'java', 'kotlin', 'swift', 'r', 'c'])

// Monaco language name map
const MONACO_LANG: Record<string, string> = {
  javascript: 'javascript', typescript: 'typescript',
  html: 'html', css: 'css', sql: 'sql',
  python: 'python',
  go: 'go', rust: 'rust', cpp: 'cpp', java: 'java',
  kotlin: 'kotlin', swift: 'swift', r: 'r', c: 'c',
}

// ─── Web sandbox (JS/TS/HTML/CSS) ───────────────────────────────────────────
function buildWebSandbox(code: string, language: string): string {
  if (language === 'html') return code
  if (language === 'css') {
    return `<!doctype html><html><head><style>${code}</style></head><body>
<div id="demo" style="padding:16px;font-family:sans-serif">
  <h2>Heading</h2><p>Paragraph text.</p><button>Button</button>
  <ul><li>Item one</li><li>Item two</li></ul>
</div></body></html>`
  }
  return `<!doctype html><html><head><meta charset="utf-8"/></head><body>
<pre id="out" style="margin:0;padding:12px 16px;font-family:'JetBrains Mono',monospace;font-size:13px;white-space:pre-wrap;word-break:break-all;color:#d4d4d4;background:#1e1e1e;min-height:100vh"></pre>
<script>
const out=document.getElementById('out');
const _log=(...a)=>{out.textContent+=a.map(x=>typeof x==='object'?JSON.stringify(x,null,2):String(x)).join(' ')+'\\n'};
const _err=(...a)=>{out.textContent+='\\x1b[31mError: '+a.map(String).join(' ')+'\\x1b[0m\\n'};
console.log=_log;console.info=_log;console.warn=_log;console.error=_err;
window.onerror=(m)=>{out.textContent+='Uncaught: '+m+'\\n';return true};
try{${code}}catch(e){_err(e.message)}
</script></body></html>`
}

// ─── Python sandbox via Pyodide ──────────────────────────────────────────────
function buildPythonSandbox(code: string): string {
  const escaped = code.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${')
  return `<!doctype html><html><head><meta charset="utf-8">
<script src="https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js"></script>
</head><body>
<pre id="out" style="margin:0;padding:12px 16px;font-family:'JetBrains Mono',monospace;font-size:13px;white-space:pre-wrap;word-break:break-all;color:#d4d4d4;background:#1e1e1e;min-height:100vh"></pre>
<div id="load" style="padding:16px;color:#888;font-family:monospace;font-size:12px;">Loading Python runtime…</div>
<script>
async function run(){
  const out=document.getElementById('out');
  const load=document.getElementById('load');
  try{
    const pyodide=await loadPyodide();
    load.remove();
    pyodide.setStdout({batched:(s)=>{out.textContent+=s+'\\n'}});
    pyodide.setStderr({batched:(s)=>{out.textContent+='Error: '+s+'\\n'}});
    await pyodide.runPythonAsync(\`${escaped}\`);
  }catch(e){
    document.getElementById('load')?.remove();
    out.textContent+='Error: '+e.message+'\\n';
  }
}
run();
</script></body></html>`
}

// ─── Monaco loader ───────────────────────────────────────────────────────────
let monacoLoaded = false
let monacoCallbacks: Array<() => void> = []

function loadMonaco(cb: () => void) {
  if (monacoLoaded) { cb(); return }
  monacoCallbacks.push(cb)
  if (monacoCallbacks.length > 1) return
  const script = document.createElement('script')
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js'
  script.onload = () => {
    window.require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } })
    window.require(['vs/editor/editor.main'], () => {
      monacoLoaded = true
      monacoCallbacks.forEach(fn => fn())
      monacoCallbacks = []
    })
  }
  document.head.appendChild(script)
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function IdeExercise({ exercise, onComplete }: Props) {
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const editorRef          = useRef<any>(null)
  const iframeRef          = useRef<HTMLIFrameElement>(null)

  const [output, setOutput]       = useState('')
  const [hasRun, setHasRun]       = useState(false)
  const [running, setRunning]     = useState(false)
  const [showHint, setShowHint]   = useState(false)
  const [hintIdx, setHintIdx]     = useState(0)
  const [completed, setCompleted] = useState(false)
  const [activeFile, setActiveFile] = useState(0)

  const files = exercise.files ?? [{
    name: exercise.language === 'html' ? 'index.html'
        : exercise.language === 'css'  ? 'styles.css'
        : exercise.language === 'python' ? 'main.py'
        : exercise.language === 'go'   ? 'main.go'
        : exercise.language === 'rust' ? 'main.rs'
        : exercise.language === 'cpp'  ? 'main.cpp'
        : exercise.language === 'java' ? 'Main.java'
        : exercise.language === 'kotlin' ? 'main.kt'
        : exercise.language === 'swift' ? 'main.swift'
        : exercise.language === 'r'    ? 'main.r'
        : 'main.js',
    code: exercise.starterCode ?? '',
    language: exercise.language,
  }]

  const [codes, setCodes] = useState<string[]>(files.map(f => f.code))

  // Init Monaco
  useEffect(() => {
    loadMonaco(() => {
      if (!editorContainerRef.current || editorRef.current) return
      const lang = MONACO_LANG[files[activeFile].language] ?? 'plaintext'
      editorRef.current = window.monaco.editor.create(editorContainerRef.current, {
        value: codes[activeFile],
        language: lang,
        theme: 'vs-dark',
        fontSize: 13,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 12, bottom: 12 },
        lineNumbers: 'on',
        folding: false,
        automaticLayout: true,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        wordWrap: 'on',
        tabSize: 2,
        renderLineHighlight: 'gutter',
      })
      editorRef.current.onDidChangeModelContent(() => {
        const val = editorRef.current.getValue()
        setCodes(prev => { const n = [...prev]; n[activeFile] = val; return n })
      })
    })
    return () => { if (editorRef.current) { editorRef.current.dispose(); editorRef.current = null } }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Switch file
  useEffect(() => {
    if (!editorRef.current || !monacoLoaded) return
    const lang = MONACO_LANG[files[activeFile].language] ?? 'plaintext'
    const model = window.monaco.editor.createModel(codes[activeFile], lang)
    editorRef.current.setModel(model)
    editorRef.current.onDidChangeModelContent(() => {
      const val = editorRef.current.getValue()
      setCodes(prev => { const n = [...prev]; n[activeFile] = val; return n })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFile])

  const runCode = useCallback(async () => {
    const code = codes[activeFile]
    const lang = files[activeFile].language

    setRunning(true)
    setHasRun(true)

    if (WEB_LANGS.has(lang)) {
      const srcdoc = buildWebSandbox(code, lang)
      if (iframeRef.current) iframeRef.current.srcdoc = srcdoc
      setOutput('')
      setRunning(false)
      return
    }

    if (lang === 'python') {
      const srcdoc = buildPythonSandbox(code)
      if (iframeRef.current) iframeRef.current.srcdoc = srcdoc
      setOutput('')
      setRunning(false)
      return
    }

    if (lang === 'sql') {
      setOutput('-- SQL preview mode\n' + code)
      setRunning(false)
      return
    }

    // Server-compiled languages via Wandbox
    if (SERVER_LANGS.has(lang)) {
      try {
        const res = await fetch('/api/run-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: lang, code }),
        })
        const data = await res.json() as { stdout?: string; stderr?: string; cerr?: string; error?: string; exitCode?: number }
        const parts: string[] = []
        if (data.cerr)   parts.push('Compiler:\n' + data.cerr)
        if (data.stdout) parts.push(data.stdout)
        if (data.stderr) parts.push('stderr:\n' + data.stderr)
        if (data.error)  parts.push('Error: ' + data.error)
        setOutput(parts.join('\n') || '(no output)')
      } catch {
        setOutput('Network error — check your connection and try again.')
      } finally {
        setRunning(false)
      }
      return
    }

    setOutput('Runner not available for this language yet.')
    setRunning(false)
  }, [codes, activeFile, files])

  function resetCode() {
    const fresh = files.map(f => f.code)
    setCodes(fresh)
    if (editorRef.current) editorRef.current.setValue(fresh[activeFile])
    setOutput('')
    setHasRun(false)
    setCompleted(false)
    if (iframeRef.current) iframeRef.current.srcdoc = ''
  }

  const lang = files[activeFile].language
  const isWebOrPython = WEB_LANGS.has(lang) || lang === 'python'
  const isServerLang  = SERVER_LANGS.has(lang)
  const showIframe    = hasRun && isWebOrPython
  const showTerminal  = hasRun && (isServerLang || lang === 'sql')

  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden bg-[#1e1e1e] flex flex-col" style={{ minHeight: 480 }}>
      {/* Mac-style header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#252526] border-b border-[#3c3c3c]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex gap-1 ml-2 overflow-x-auto">
          {files.map((f, i) => (
            <button
              key={i}
              onClick={() => setActiveFile(i)}
              className={`text-[11px] px-3 py-1 rounded-t border-b-2 transition-colors whitespace-nowrap ${
                activeFile === i
                  ? 'text-white border-[#007acc] bg-[#1e1e1e]'
                  : 'text-neutral-400 border-transparent hover:text-neutral-200'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={resetCode}
            className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white px-2 py-1 rounded hover:bg-[#3c3c3c] transition-colors"
          >
            <RotateCcw size={11} />
            Reset
          </button>
          <button
            onClick={runCode}
            disabled={running}
            className="flex items-center gap-1.5 text-[12px] font-medium text-white bg-[#007acc] hover:bg-[#0066b8] disabled:opacity-60 px-3 py-1.5 rounded transition-colors"
          >
            {running ? <Loader2 size={11} className="animate-spin" /> : <Play size={11} fill="currentColor" />}
            {running ? 'Running…' : 'Run'}
          </button>
        </div>
      </div>

      {/* Task bar */}
      <div className="px-4 py-2.5 bg-[#252526] border-b border-[#3c3c3c] text-[12px] text-neutral-300 leading-relaxed">
        <span className="text-[#569cd6] font-medium mr-2">Task:</span>
        {exercise.task}
      </div>

      {/* Editor + Output */}
      <div className="flex flex-1 min-h-0" style={{ height: 340 }}>
        <div className={`flex flex-col ${(showIframe || showTerminal) ? 'w-1/2 border-r border-[#3c3c3c]' : 'w-full'}`}>
          <div ref={editorContainerRef} className="flex-1 w-full h-full" />
        </div>

        {showIframe && (
          <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
            <div className="text-[10px] text-neutral-500 px-3 py-1.5 border-b border-[#3c3c3c] uppercase tracking-wider">Output</div>
            <iframe
              ref={iframeRef}
              sandbox="allow-scripts"
              className="flex-1 w-full bg-white"
              title="code-output"
            />
          </div>
        )}

        {showTerminal && (
          <div className="w-1/2 flex flex-col bg-[#0d1117]">
            <div className="text-[10px] text-neutral-500 px-3 py-1.5 border-b border-[#3c3c3c] uppercase tracking-wider flex items-center gap-2">
              Terminal
              {running && <Loader2 size={10} className="animate-spin text-[#007acc]" />}
            </div>
            <pre className="flex-1 p-3 text-[12px] text-green-400 font-mono overflow-auto whitespace-pre-wrap leading-relaxed">
              {running ? 'Compiling…' : output}
            </pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#252526] border-t border-[#3c3c3c]">
        <div className="flex items-center gap-3">
          {exercise.hints && exercise.hints.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1.5 text-[11px] text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <Lightbulb size={12} />
                Hint {hintIdx + 1}/{exercise.hints.length}
              </button>
              {showHint && (
                <div className="absolute bottom-8 left-0 w-72 bg-[#252526] border border-[#3c3c3c] rounded-lg p-3 text-[12px] text-neutral-300 z-10 shadow-xl">
                  <button onClick={() => setShowHint(false)} className="absolute top-2 right-2 text-neutral-500 hover:text-white">
                    <X size={12} />
                  </button>
                  <div className="text-yellow-400 font-medium mb-1 text-[11px]">Hint</div>
                  {exercise.hints![hintIdx]}
                  {exercise.hints!.length > 1 && (
                    <button
                      onClick={() => setHintIdx(i => Math.min(i + 1, exercise.hints!.length - 1))}
                      className="mt-2 text-[10px] text-neutral-500 hover:text-neutral-300"
                      disabled={hintIdx >= exercise.hints!.length - 1}
                    >
                      Next hint →
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!completed ? (
            <button
              onClick={() => { setCompleted(true); onComplete?.() }}
              disabled={!hasRun}
              className={`flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded transition-colors ${
                hasRun
                  ? 'text-white bg-green-600 hover:bg-green-500'
                  : 'text-neutral-500 bg-[#3c3c3c] cursor-not-allowed'
              }`}
            >
              <Check size={12} />
              Mark Complete
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-green-400">
              <Check size={14} />
              Completed — continue below
              <ChevronRight size={12} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

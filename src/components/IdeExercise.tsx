'use client'
import { useEffect, useRef, useState } from 'react'
import type { IdeExercise } from '@/lib/courses'
import { Play, RotateCcw, ChevronRight, Check, Lightbulb, X } from 'lucide-react'

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

// Build the srcdoc for the sandbox iframe
function buildSandboxDoc(code: string, language: string): string {
  if (language === 'html') {
    return code
  }
  if (language === 'css') {
    return `<!doctype html><html><head><style>${code}</style></head><body><div id="demo" style="padding:16px;font-family:sans-serif"><h2>Heading</h2><p>Paragraph text.</p><button>Button</button></div></body></html>`
  }
  // javascript / typescript
  return `<!doctype html><html><head><meta charset="utf-8"/></head><body>
<pre id="output" style="margin:0;padding:12px 16px;font-family:monospace;font-size:13px;white-space:pre-wrap;word-break:break-all;"></pre>
<script>
const out=document.getElementById('output');
const log=(...args)=>{out.textContent+=args.map(a=>typeof a==='object'?JSON.stringify(a,null,2):String(a)).join(' ')+'\\n';};
const error=(...args)=>{out.textContent+='ERROR: '+args.map(String).join(' ')+'\\n';};
const originalLog=console.log,originalError=console.error,originalWarn=console.warn;
console.log=log;console.error=error;console.warn=log;
window.onerror=(msg,src,line,col,err)=>{out.textContent+='Uncaught Error: '+msg+'\\n';return true;};
try{
${code}
}catch(e){error(e.message);}
</script></body></html>`
}

// Load Monaco from CDN once globally
let monacoLoaded = false
let monacoCallbacks: (() => void)[] = []

function loadMonaco(cb: () => void) {
  if (monacoLoaded) { cb(); return }
  monacoCallbacks.push(cb)
  if (monacoCallbacks.length > 1) return // already loading
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

export default function IdeExercise({ exercise, onComplete }: Props) {
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<any>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [output, setOutput] = useState<string>('')
  const [hasRun, setHasRun] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [hintIdx, setHintIdx] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState<'editor' | 'output'>('editor')
  const [activeFile, setActiveFile] = useState(0)

  const files = exercise.files ?? [{ name: exercise.language === 'html' ? 'index.html' : exercise.language === 'css' ? 'styles.css' : 'main.js', code: exercise.starterCode ?? '', language: exercise.language }]

  const [codes, setCodes] = useState<string[]>(files.map(f => f.code))

  // Initialize Monaco
  useEffect(() => {
    loadMonaco(() => {
      if (!editorContainerRef.current || editorRef.current) return
      const lang = files[activeFile].language === 'typescript' ? 'typescript' : files[activeFile].language === 'css' ? 'css' : files[activeFile].language === 'html' ? 'html' : files[activeFile].language === 'sql' ? 'sql' : 'javascript'
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
        setCodes(prev => { const next = [...prev]; next[activeFile] = val; return next })
      })
    })
    return () => {
      if (editorRef.current) { editorRef.current.dispose(); editorRef.current = null }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Switch file in editor
  useEffect(() => {
    if (!editorRef.current) return
    const lang = files[activeFile].language === 'typescript' ? 'typescript' : files[activeFile].language === 'css' ? 'css' : files[activeFile].language === 'html' ? 'html' : files[activeFile].language === 'sql' ? 'sql' : 'javascript'
    const model = window.monaco.editor.createModel(codes[activeFile], lang)
    editorRef.current.setModel(model)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFile])

  function runCode() {
    const currentCode = codes[activeFile]
    const lang = files[activeFile].language
    if (lang === 'javascript' || lang === 'typescript' || lang === 'html' || lang === 'css') {
      const srcdoc = buildSandboxDoc(currentCode, lang)
      if (iframeRef.current) {
        iframeRef.current.srcdoc = srcdoc
      }
      setOutput('')
    } else if (lang === 'sql') {
      setOutput('SQL preview mode — output shown below\n' + currentCode)
    } else {
      setOutput('Run output will appear here.')
    }
    setHasRun(true)
    setActiveTab('output')
  }

  function resetCode() {
    const fresh = files.map(f => f.code)
    setCodes(fresh)
    if (editorRef.current) editorRef.current.setValue(fresh[activeFile])
    setOutput('')
    setHasRun(false)
    setCompleted(false)
    setActiveTab('editor')
  }

  function markComplete() {
    setCompleted(true)
    onComplete?.()
  }

  const isWebLanguage = ['javascript', 'typescript', 'html', 'css'].includes(files[activeFile].language)

  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden bg-[#1e1e1e] flex flex-col" style={{ minHeight: 480 }}>
      {/* Header */}
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
              className={`text-[11px] px-3 py-1 rounded-t border-b-2 transition-colors whitespace-nowrap ${activeFile === i ? 'text-white border-[#007acc] bg-[#1e1e1e]' : 'text-neutral-400 border-transparent hover:text-neutral-200'}`}
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
            className="flex items-center gap-1.5 text-[12px] font-medium text-white bg-[#007acc] hover:bg-[#0066b8] px-3 py-1.5 rounded transition-colors"
          >
            <Play size={11} fill="currentColor" />
            Run
          </button>
        </div>
      </div>

      {/* Task bar */}
      <div className="px-4 py-2.5 bg-[#252526] border-b border-[#3c3c3c] text-[12px] text-neutral-300 leading-relaxed">
        <span className="text-[#569cd6] font-medium mr-2">Task:</span>
        {exercise.task}
      </div>

      {/* Main area: editor + output */}
      <div className="flex flex-1 min-h-0" style={{ height: 340 }}>
        {/* Editor pane */}
        <div className={`flex flex-col ${hasRun && isWebLanguage ? 'w-1/2 border-r border-[#3c3c3c]' : 'w-full'}`}>
          <div ref={editorContainerRef} className="flex-1 w-full h-full" />
        </div>

        {/* Output pane — only shown after Run */}
        {hasRun && (
          <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
            <div className="text-[10px] text-neutral-500 px-3 py-1.5 border-b border-[#3c3c3c] uppercase tracking-wider">Output</div>
            {isWebLanguage ? (
              <iframe
                ref={iframeRef}
                sandbox="allow-scripts"
                className="flex-1 w-full bg-white"
                title="code-output"
              />
            ) : (
              <pre className="flex-1 p-3 text-[12px] text-green-400 font-mono overflow-auto whitespace-pre-wrap">
                {output}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Footer actions */}
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
                  <button onClick={() => setShowHint(false)} className="absolute top-2 right-2 text-neutral-500 hover:text-white"><X size={12} /></button>
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
              onClick={markComplete}
              disabled={!hasRun}
              className={`flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded transition-colors ${hasRun ? 'text-white bg-green-600 hover:bg-green-500' : 'text-neutral-500 bg-[#3c3c3c] cursor-not-allowed'}`}
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

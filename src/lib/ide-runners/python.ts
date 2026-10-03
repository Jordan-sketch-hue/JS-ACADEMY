'use client'

declare global {
  interface Window {
    loadPyodide: (opts?: { indexURL?: string }) => Promise<any>
    _pyodideInstance: any
  }
}

let loading = false
let callbacks: Array<(py: any) => void> = []

export function loadPyodide(cb: (py: any) => void) {
  if (typeof window === 'undefined') return
  if (window._pyodideInstance) { cb(window._pyodideInstance); return }
  callbacks.push(cb)
  if (loading) return
  loading = true
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js'
  script.onload = async () => {
    try {
      window._pyodideInstance = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
      })
      callbacks.forEach(fn => fn(window._pyodideInstance))
      callbacks = []
    } catch (e: any) {
      callbacks.forEach(fn => fn(null))
      callbacks = []
    }
  }
  document.head.appendChild(script)
}

export function runPython(code: string): Promise<string> {
  return new Promise(resolve => {
    loadPyodide(async py => {
      if (!py) { resolve('Failed to load Python runtime.'); return }
      const lines: string[] = []
      py.setStdout({ batched: (t: string) => lines.push(t) })
      py.setStderr({ batched: (t: string) => lines.push('Error: ' + t) })
      try {
        await py.runPythonAsync(code)
        resolve(lines.join('\n') || '(no output)')
      } catch (e: any) {
        resolve('RuntimeError: ' + e.message)
      }
    })
  })
}

export function isPyodideReady(): boolean {
  return typeof window !== 'undefined' && !!window._pyodideInstance
}

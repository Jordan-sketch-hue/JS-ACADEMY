// Wandbox API — real compiler execution for C++, Rust, Go, Java, Kotlin, Swift, R
// https://wandbox.org

export type ApiLanguage = 'cpp' | 'rust' | 'go' | 'java' | 'kotlin' | 'swift' | 'r'

interface WandboxConfig {
  compiler: string
  options?: string
}

const COMPILERS: Record<ApiLanguage, WandboxConfig> = {
  cpp:    { compiler: 'gcc-head',     options: '-std=c++20 -Wall' },
  rust:   { compiler: 'rust-head' },
  go:     { compiler: 'go-head' },
  java:   { compiler: 'openjdk-head' },
  kotlin: { compiler: 'kotlin-head' },
  swift:  { compiler: 'swift-6.0.3' },
  r:      { compiler: 'r-head' },
}

export async function runViaApi(code: string, language: ApiLanguage): Promise<string> {
  const cfg = COMPILERS[language]
  if (!cfg) return `Language "${language}" is not configured.`

  try {
    const resp = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        compiler: cfg.compiler,
        options: cfg.options ?? '',
        stdin: '',
        'compiler-option-raw': '',
        'runtime-option-raw': '',
      }),
    })

    if (!resp.ok) {
      return `Compiler API returned HTTP ${resp.status}. Try again in a moment.`
    }

    const data = await resp.json()
    const parts: string[] = []
    if (data.compiler_error) parts.push(data.compiler_error)
    if (data.program_output) parts.push(data.program_output)
    if (data.program_error)  parts.push(data.program_error)
    return parts.join('\n').trim() || '(no output)'
  } catch (e: any) {
    return `Network error: ${e.message}. Check your connection and try again.`
  }
}

export function isApiLanguage(lang: string): lang is ApiLanguage {
  return lang in COMPILERS
}

import { NextRequest, NextResponse } from 'next/server'

const WANDBOX_COMPILERS: Record<string, string> = {
  go:     'go-head',
  rust:   'rust-head',
  cpp:    'gcc-head',
  java:   'openjdk-head',
  kotlin: 'kotlin-head',
  swift:  'swift-head',
  r:      'r-head',
  c:      'gcc-head',
}

export async function POST(req: NextRequest) {
  try {
    const { language, code } = await req.json() as { language: string; code: string }

    const compiler = WANDBOX_COMPILERS[language]
    if (!compiler) {
      return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 })
    }

    const options: Record<string, string> = {}
    if (language === 'cpp') options['compiler-option-raw'] = '-std=c++17'
    if (language === 'c')   options['compiler-option-raw'] = '-std=c17'

    const body = {
      compiler,
      code,
      save: false,
      'compiler-option-raw': options['compiler-option-raw'] ?? '',
    }

    const res = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Wandbox error: ${res.status}` }, { status: 502 })
    }

    const data = await res.json() as {
      status?: string
      program_output?: string
      program_error?: string
      compiler_output?: string
      compiler_error?: string
    }

    const stdout  = data.program_output  ?? ''
    const stderr  = data.program_error   ?? ''
    const cerr    = data.compiler_error  ?? data.compiler_output ?? ''
    const exitCode = data.status ? parseInt(data.status) : 0

    return NextResponse.json({ stdout, stderr, cerr, exitCode })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

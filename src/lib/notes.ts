export interface CourseOutline {
  overview: string
  sections: string[]
}

interface BriefingCourse {
  title: string
  subtitle: string
  keyTerms: { term: string; definition: string }[]
}

// Composes a short narratable script for the Notes tab's audio briefing —
// the objective, what the module covers, and its key terms — reusing the
// same markdown-to-SSML pipeline as full lesson narration (headings and
// bold key terms render with the same emphasis/pacing rules).
export function buildBriefingScript(course: BriefingCourse, outline: CourseOutline): string {
  const parts: string[] = [`## ${course.title}`, course.subtitle]

  if (outline.overview) parts.push(outline.overview)

  if (outline.sections.length) {
    parts.push('### What you will learn')
    parts.push(outline.sections.map(s => `- ${s}`).join('\n'))
  }

  if (course.keyTerms.length) {
    parts.push('### Key terms')
    parts.push(course.keyTerms.map(t => `- **${t.term}** — ${t.definition}`).join('\n'))
  }

  return parts.join('\n\n')
}

export function getCourseOutline(content: string): CourseOutline {
  if (!content || content === 'LANGUAGE_LAB_REDIRECT') return { overview: '', sections: [] }
  const lines = content.split('\n')
  const sections: string[] = []
  let overview = ''

  for (const raw of lines) {
    const line = raw.trim()
    if (line.startsWith('### ')) { sections.push(line.slice(4)); continue }
    if (line.startsWith('## ')) { sections.push(line.slice(3)); continue }
    if (!overview && line && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('*') &&
        !line.startsWith('|') && !line.startsWith('```') && !/^\d+\.\s/.test(line)) {
      overview = line.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').replace(/`(.+?)`/g, '$1')
    }
  }

  return { overview, sections }
}

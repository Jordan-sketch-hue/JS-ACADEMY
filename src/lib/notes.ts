export interface CourseOutline {
  overview: string
  sections: string[]
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

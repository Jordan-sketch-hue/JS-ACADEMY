// AI cover letter generator using Claude API
import Anthropic from '@anthropic-ai/sdk'
import { RESUME } from './resume'
import type { Job } from './supabase'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateCoverLetter(job: Job): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: `Write a concise, honest cover letter (max 250 words) for this job application.

APPLICANT:
Name: ${RESUME.name}
Title: ${RESUME.title}
Tech Stack: ${RESUME.techStack.join(', ')}
Human Languages: ${RESUME.humanLanguages.map(l => `${l.name} (${l.level})`).join(', ')}
Summary: ${RESUME.summary}

JOB:
Title: ${job.title}
Company: ${job.company}
Description: ${job.description.slice(0, 1500)}

Rules:
- Do not use filler phrases ("I am excited to...", "I am passionate about...")
- Lead with the most relevant skills for THIS specific role
- Mention multilingual ability only if the role involves international work or localization
- Keep it professional but direct — no fluff
- End with a clear ask for an interview
- Do not add [Your Name] or signature lines — just the letter body`
    }],
  })

  const block = message.content[0]
  return block.type === 'text' ? block.text : ''
}

export async function explainMatchScore(job: Job): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 200,
    messages: [{
      role: 'user',
      content: `In 2-3 sentences, explain why this job (score: ${job.match_score}/100) is or isn't a good match for this candidate.

Candidate skills: ${RESUME.techStack.slice(0, 8).join(', ')}
Job title: ${job.title} at ${job.company}
Match reasons: ${job.match_reasons.join(', ')}
Job description excerpt: ${job.description.slice(0, 500)}

Be direct and specific.`
    }],
  })
  const block = message.content[0]
  return block.type === 'text' ? block.text : ''
}

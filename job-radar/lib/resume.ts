// Jordan Morris — full skill profile and target job list for AI matching
export const RESUME = {
  name: 'Jordan Morris',
  email: 'jordanroad631@gmail.com',
  title: 'Full Stack Developer | Multilingual Tech Professional',

  techStack: [
    'Next.js', 'React', 'TypeScript', 'JavaScript', 'Tailwind CSS',
    'Supabase', 'PostgreSQL', 'REST APIs', 'Payload CMS',
    'Python', 'R', 'Java', 'Go', 'Swift', 'Rust', 'C++',
    'Node.js', 'HTML', 'CSS', 'Git', 'Vercel', 'SQL',
  ],

  humanLanguages: [
    { name: 'English', level: 'Native' },
    { name: 'Mandarin Chinese', level: 'A1' },
    { name: 'Spanish', level: 'A1' },
    { name: 'French', level: 'A1' },
    { name: 'German', level: 'A1' },
    { name: 'Russian', level: 'A1' },
    { name: 'Dutch', level: 'A1' },
    { name: 'Japanese', level: 'A1' },
    { name: 'Arabic', level: 'A1' },
    { name: 'Portuguese', level: 'A1' },
    { name: 'Italian', level: 'A1' },
    { name: 'Korean', level: 'A1' },
    { name: 'Hindi', level: 'A1' },
    { name: 'Swahili', level: 'A1' },
  ],

  // All target roles — from entry-level up to senior progression
  jobRoles: [
    // Operations & Admin
    'Project Coordinator', 'Project Assistant', 'Project Administrator',
    'Operations Coordinator', 'Operations Assistant', 'Administrative Assistant',
    'Executive Assistant', 'Virtual Assistant', 'Customer Success Specialist',

    // Data & Analytics
    'Data Entry Specialist', 'Data Processing Clerk', 'Data Quality Specialist',
    'Data Operations Assistant', 'Reporting Analyst', 'Junior Data Analyst',
    'Data Analyst', 'Junior Business Analyst', 'Junior BI Analyst', 'Power BI Analyst',

    // Marketing & Digital
    'Marketing Assistant', 'Marketing Coordinator', 'Digital Marketing Specialist',
    'SEO Specialist', 'Social Media Specialist', 'E-commerce Specialist',
    'Marketing Operations Assistant',

    // AI & Automation
    'AI Administrative Assistant', 'AI Business Operations Assistant',
    'AI Automation Specialist', 'AI Workflow Specialist',

    // IT & Support
    'IT Support Technician', 'Help Desk Technician', 'Service Desk Analyst',
    'Technical Support Representative', 'Desktop Support Technician',
    'Application Support Specialist', 'Systems Support Technician',

    // Cybersecurity
    'Junior Cybersecurity Analyst', 'SOC Analyst Tier 1',
    'Cybersecurity Support Technician', 'GRC Analyst Junior',

    // QA & Testing
    'QA Tester', 'Manual QA Tester', 'Software Tester', 'Junior QA Analyst',
    'QA Analyst', 'Test Analyst', 'Junior Software Test Engineer',
    'QA Automation Engineer', 'Test Automation Developer', 'SDET Junior',

    // Software Development
    'Junior Web Developer', 'Junior Front-End Developer', 'Junior Back-End Developer',
    'Junior Full-Stack Developer', 'JavaScript Developer', 'TypeScript Developer',
    'React Developer', 'Node.js Developer', 'Python Developer', 'API Developer',
    'Web Application Developer', 'Junior Software Developer', 'Junior Software Engineer',
    'Software Developer', 'Software Engineer', 'Senior Software Engineer',
    'Tech Lead', 'Software Architect',

    // Cloud & Infrastructure
    'Cloud Support Associate', 'Cloud Support Technician', 'Junior Cloud Engineer',
    'Cloud Engineer', 'DevOps Assistant', 'Junior DevOps Engineer',
    'Infrastructure Support Technician', 'DevOps Engineer', 'Senior DevOps Engineer',

    // Databases & Systems
    'Junior SQL Developer', 'Database Support Specialist',
    'Junior Database Administrator', 'Junior Systems Analyst',
    'Junior Systems Administrator', 'Database Analyst',
  ],

  // Keywords for scoring job descriptions (all categories)
  matchKeywords: [
    // Tech stack
    'next.js', 'nextjs', 'react', 'typescript', 'javascript', 'tailwind',
    'supabase', 'postgresql', 'postgres', 'sql', 'rest api', 'python',
    'node', 'node.js', 'html', 'css', 'git', 'vercel', 'api',
    // Programming languages
    'go', 'golang', 'rust', 'java', 'kotlin', 'swift', 'c++', 'cpp', 'r language',
    // Job categories
    'full stack', 'fullstack', 'frontend', 'front-end', 'backend', 'back-end',
    'junior developer', 'junior engineer', 'software developer', 'software engineer',
    'web developer', 'web development',
    // QA
    'qa', 'quality assurance', 'testing', 'test engineer', 'sdet', 'automation testing',
    'manual testing', 'selenium', 'cypress', 'playwright',
    // Data
    'data analyst', 'data analysis', 'business analyst', 'reporting', 'dashboard',
    'power bi', 'tableau', 'excel', 'data entry', 'data quality',
    // Cloud/DevOps
    'cloud', 'aws', 'azure', 'gcp', 'devops', 'ci/cd', 'docker', 'kubernetes',
    // IT Support
    'it support', 'help desk', 'helpdesk', 'service desk', 'technical support',
    'troubleshoot', 'ticketing',
    // Security
    'cybersecurity', 'security analyst', 'soc analyst', 'grc', 'compliance',
    // AI/Automation
    'ai', 'automation', 'workflow', 'n8n', 'zapier', 'make.com',
    // Admin/Ops
    'project coordinator', 'operations', 'virtual assistant', 'administrative',
    'customer success', 'project management',
    // Marketing
    'marketing', 'seo', 'digital marketing', 'social media', 'e-commerce',
    // International
    'multilingual', 'localization', 'l10n', 'i18n', 'international', 'global',
    // Remote
    'remote', 'work from home', 'wfh', 'distributed team',
  ],

  summary: `Full Stack Developer with hands-on experience building production web applications using Next.js, React, TypeScript, and Supabase. Created and deployed an interactive learning academy platform with embedded IDE runners, AI integration, and multi-language support. Multilingual communicator with beginner-conversational knowledge of 14 languages (English native). Basic coding fundamentals in 7 programming languages (Python, Go, Rust, Java, C++, Swift, R). Background in marketing, operations, and customer-facing environments. Open to roles across software development, QA, data, IT support, DevOps, and AI/automation — especially remote-first positions.`,
}

// Category labels for filtering
export const JOB_CATEGORIES = [
  'All',
  'Software Development',
  'QA & Testing',
  'Data & Analytics',
  'Cloud & DevOps',
  'IT Support',
  'Cybersecurity',
  'AI & Automation',
  'Marketing & Digital',
  'Operations & Admin',
] as const

export type JobCategory = typeof JOB_CATEGORIES[number]

export function scoreJob(title: string, description: string): { score: number; reasons: string[] } {
  const text = `${title} ${description}`.toLowerCase()
  const reasons: string[] = []
  let score = 0

  // Score keyword matches
  for (const kw of RESUME.matchKeywords) {
    if (text.includes(kw)) {
      score += 6
      if (reasons.length < 5) reasons.push(kw)
    }
  }

  // Strong bonus if title matches a target role
  const titleLower = title.toLowerCase()
  for (const role of RESUME.jobRoles) {
    if (titleLower.includes(role.toLowerCase())) {
      score += 20
      break
    }
  }

  // Bonus for remote
  if (text.includes('remote')) { score += 8; if (!reasons.includes('remote')) reasons.push('remote') }

  // Bonus for LATAM / Caribbean / worldwide hiring
  if (text.match(/latam|latin america|caribbean|jamaica|trinidad|barbados|worldwide|global|anywhere/i)) {
    score += 15
    reasons.push('LATAM/Caribbean friendly')
  }

  // Bonus for multilingual/international
  if (text.match(/multilin|locali|international|i18n|l10n/)) {
    score += 12
    reasons.push('multilingual fit')
  }

  // Slight penalty for high seniority (10+ years, principal, staff) without matching skills
  if (text.match(/10\+ years|principal engineer|staff engineer|vp of eng/)) score -= 15

  return { score: Math.min(100, Math.max(0, score)), reasons: [...new Set(reasons)] }
}

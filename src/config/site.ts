export const site = {
  name: 'Nguyen Le Quoc Dat',
  nickname: 'w0rkd4tt',
  terminalIdentity: 'w0rkd4tt@portfolio:~$',
  summary: 'Offensive security and security tooling. Evidence before claims.',
  cvHref: null,
  socialLinks: [
    { label: 'Email', href: 'mailto:datnguyenlequoc2001@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/w0rkd4tt' }
  ],
  giscus: null
} as const;

export const portfolioNavigation = [
  { label: 'Home', href: '#home' },
  { label: 'Skills', href: '#skills' },
  { label: 'Research', href: '#research' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Projects', href: '#projects' },
  { label: 'Write-Ups', href: '/writeups' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#contact' }
] as const;

// Keep repeatable profile content in one place so replacing placeholders is painless.
export const portfolio = {
  roles: 'Pentest / Security Tooling / AI-assisted Offensive Security',
  introduction: 'I build the tools I wish I had during the engagement.',
  skillGroups: [
    { title: 'Programming Languages', items: ['Python', 'Java', 'TypeScript', 'Shell'] },
    { title: 'Technical Skills', items: ['Web Application Pentest', 'Recon & Attack Surface Automation', 'MCP / AI-assisted Tooling', 'Machine Learning for Security'] },
    { title: 'Others', items: ['Vietnamese (native)', 'English (working proficiency)'] }
  ],
  certifications: [
    { title: 'OffSec Web Expert (OSWE)', issuer: 'OffSec' },
    { title: 'Burp Suite Certified Practitioner', issuer: 'PortSwigger' },
    { title: 'Certified Network Security Practitioner (CNSP)', issuer: 'The SecOps Group' },
    { title: 'Certified AppSec Practitioner (CAP)', issuer: 'The SecOps Group' },
    // TODO: confirm the issuer before publishing this one.
    { title: 'Certified Web Security Expert (CWSE)', issuer: '' },
    { title: 'Google Cybersecurity Certificate', issuer: 'Google' }
  ] as readonly { title: string; issuer: string }[],
  projects: [
    { title: 'Sharingan', description: 'Automated web security scanner chaining recon tooling with Burp Suite scanning and Telegram vulnerability alerts.', language: 'Python', url: 'https://github.com/w0rkd4tt/Sharingan' },
    { title: 'burp-plugin', description: 'Burp Suite extension for automated SQL injection detection with context-aware payload generation and optional AI-assisted analysis.', language: 'Java', url: 'https://github.com/w0rkd4tt/burp-plugin' },
    { title: 'dirsearch-mcp', description: 'Multi-threaded directory and file enumeration with recursive scanning, wildcard detection, and MCP integration for AI agents.', language: 'Python', url: 'https://github.com/w0rkd4tt/dirsearch-mcp' },
    { title: 'nmap-mcp', description: 'Model Context Protocol server exposing controlled NMAP scanning to AI assistants for network analysis and security assessment.', language: 'Python', url: 'https://github.com/w0rkd4tt/nmap-mcp' },
    { title: 'mcp-splunk', description: 'IoT security monitoring on Splunk Enterprise, bridged to an MCP server so an AI assistant can query and triage anomalous device behaviour.', language: 'Python', url: 'https://github.com/w0rkd4tt/mcp-splunk' },
    { title: 'MalConv', description: 'Malware analysis tooling around the MalConv model, including evasion experiments against static byte-level classifiers.', language: 'Python', url: 'https://github.com/w0rkd4tt/MalConv' },
    { title: 'Totolink X6000R', description: 'Command injection analysis of CVE-2025-52284 in the Totolink X6000R router firmware, from firmware unpacking to unauthenticated RCE.', language: 'Research', url: 'https://github.com/w0rkd4tt/Totolink' },
    { title: 'note-pentest', description: 'Reference wiki for penetration testing: service and protocol enumeration, web vulnerability analysis, tooling, hardening, and CPTS kill-chain notes.', language: 'Markdown', url: 'https://github.com/w0rkd4tt/note-pentest' }
  ],
  publications: [
    {
      venue: 'Journal of Science and Technology on Information Security · No. 3.CS (26), 2025',
      title: 'AI-Enhanced SQL Injection Detection Framework: A Novel Approach Combines LLMs with Traditional Fuzzing to Improve Web Application Vulnerability Detection',
      description: 'AESIDF pairs an LLM with parallel fuzzing for semantic SQL injection analysis. Across 26 PortSwigger, DVWA, and OWASP Juice Shop scenarios it reaches a 92.3% detection rate against SQLMap\'s 76.9%, using roughly 68.8% fewer requests. With Nguyen Le Quoc Anh and Nguyen Manh Thang.',
      url: 'https://isj.vn/index.php/journal_STIS/article/view/1179',
      linkLabel: 'Read on ISJ'
    }
  ] as readonly { venue: string; title: string; description: string; url: string; linkLabel: string }[],
  contact: {
    email: 'mailto:datnguyenlequoc2001@gmail.com',
    label: 'datnguyenlequoc2001@gmail.com',
    github: 'https://github.com/w0rkd4tt',
    githubLabel: 'github.com/w0rkd4tt',
    // Set to a profile URL to show the row; null hides it.
    linkedin: null as string | null,
    linkedinLabel: ''
  }
} as const;

// Kept for legacy routes while the homepage now owns the primary navigation.
export const navigation = portfolioNavigation;

export type Severity = 'Critical' | 'High' | 'Moderate' | 'Low';

export type CveRecord = {
  cve: string;
  program: string;
  severity: Severity;
  score: number;
  /** NVD entry — always shown as the fallback link when no write-up exists yet. */
  reference: string;
  /** Slug of a post in src/content/posts/ with `type: writeup`. Omit until the write-up is published. */
  writeup?: string;
};

// Ordered oldest to newest: a smaller CVE number was assigned earlier.
// Scores and severities follow the CVSS v3.1 base score published on NVD.
export const cveRecords: CveRecord[] = [
  { cve: 'CVE-2023-30177', program: 'Craft CMS 3.7.59', severity: 'Moderate', score: 6.1, reference: 'https://nvd.nist.gov/vuln/detail/CVE-2023-30177' },
  { cve: 'CVE-2025-52039', program: 'Frappe ERPNext 15.57.5', severity: 'High', score: 8.2, reference: 'https://nvd.nist.gov/vuln/detail/CVE-2025-52039' },
  { cve: 'CVE-2025-52040', program: 'Frappe ERPNext 15.57.5', severity: 'High', score: 8.2, reference: 'https://nvd.nist.gov/vuln/detail/CVE-2025-52040' },
  { cve: 'CVE-2025-52041', program: 'Frappe ERPNext 15.57.5', severity: 'High', score: 8.2, reference: 'https://nvd.nist.gov/vuln/detail/CVE-2025-52041' },
  { cve: 'CVE-2025-52042', program: 'Frappe ERPNext 15.57.5', severity: 'High', score: 8.2, reference: 'https://nvd.nist.gov/vuln/detail/CVE-2025-52042' },
  { cve: 'CVE-2025-52284', program: 'Totolink X6000R firmware', severity: 'Moderate', score: 6.5, reference: 'https://nvd.nist.gov/vuln/detail/CVE-2025-52284' }
];

export const severityRank: Record<Severity, number> = { Low: 1, Moderate: 2, High: 3, Critical: 4 };

// Numeric suffix of a CVE id, e.g. CVE-2026-61663 -> 61663. Smaller means older.
export function cveNumber(cve: string): number {
  const match = cve.match(/-(\d+)$/);
  return match ? Number(match[1]) : 0;
}

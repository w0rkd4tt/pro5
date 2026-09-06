export type Severity = 'Critical' | 'High' | 'Moderate' | 'Low';

export type CveRecord = {
  cve: string;
  program: string;
  severity: Severity;
  score: number;
  /** Public advisory (NVD, Vulners, ...) — shown as the fallback link when no write-up exists yet. */
  reference: string;
  /** Slug of a post in src/content/posts/ with `type: writeup`. Omit until the write-up is published. */
  writeup?: string;
};

// Stored oldest to newest. The homepage renders newest first by default.
// Scores and severities follow the CVSS v3.1 base score published on NVD.
export const cveRecords: CveRecord[] = [
  { cve: 'CVE-2021-42624', program: 'Miniftpd', severity: 'High', score: 7.8, reference: 'https://nvd.nist.gov/vuln/detail/CVE-2021-42624' },
  { cve: 'CVE-2023-30177', program: 'Craft CMS 3.7.59', severity: 'Moderate', score: 6.1, reference: 'https://nvd.nist.gov/vuln/detail/CVE-2023-30177' },
  { cve: 'CVE-2025-52039', program: 'Frappe ERPNext 15.57.5', severity: 'High', score: 8.2, reference: 'https://nvd.nist.gov/vuln/detail/CVE-2025-52039' },
  { cve: 'CVE-2025-52040', program: 'Frappe ERPNext 15.57.5', severity: 'High', score: 8.2, reference: 'https://nvd.nist.gov/vuln/detail/CVE-2025-52040' },
  { cve: 'CVE-2025-52041', program: 'Frappe ERPNext 15.57.5', severity: 'High', score: 8.2, reference: 'https://nvd.nist.gov/vuln/detail/CVE-2025-52041' },
  { cve: 'CVE-2025-52042', program: 'Frappe ERPNext 15.57.5', severity: 'High', score: 8.2, reference: 'https://nvd.nist.gov/vuln/detail/CVE-2025-52042' },
  { cve: 'CVE-2025-52284', program: 'Totolink X6000R firmware', severity: 'Moderate', score: 6.5, reference: 'https://vulners.com/cve/CVE-2025-52284' }
];

export const severityRank: Record<Severity, number> = { Low: 1, Moderate: 2, High: 3, Critical: 4 };

// Numeric suffix of a CVE id, e.g. CVE-2026-61663 -> 61663.
export function cveNumber(cve: string): number {
  const match = cve.match(/-(\d+)$/);
  return match ? Number(match[1]) : 0;
}

// Assignment year of a CVE id, e.g. CVE-2021-42624 -> 2021.
export function cveYear(cve: string): number {
  const match = cve.match(/^CVE-(\d{4})-/);
  return match ? Number(match[1]) : 0;
}

// Chronological sort key: year first, then the sequence number. Sorting on the
// suffix alone is wrong across years (CVE-2021-42624 predates CVE-2023-30177).
export function cveOrder(cve: string): number {
  return cveYear(cve) * 10_000_000 + cveNumber(cve);
}

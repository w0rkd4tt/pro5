import { expect, it } from 'vitest';
import { cveRecords, cveNumber, severityRank } from '../src/data/cves';

it('keeps CVE records ordered oldest to newest by CVE number', () => {
  const numbers = cveRecords.map((record) => cveNumber(record.cve));
  expect([...numbers].sort((a, b) => a - b)).toEqual(numbers);
});

it('lists my published CVEs with a score and an NVD reference', () => {
  expect(cveRecords.map((record) => record.cve)).toEqual([
    'CVE-2023-30177',
    'CVE-2025-52039',
    'CVE-2025-52040',
    'CVE-2025-52041',
    'CVE-2025-52042',
    'CVE-2025-52284'
  ]);
  expect(cveRecords.every((record) => record.score > 0)).toBe(true);
  expect(cveRecords.every((record) => record.reference.startsWith('https://nvd.nist.gov/vuln/detail/'))).toBe(true);
  expect(cveRecords.every((record) => record.reference.endsWith(record.cve))).toBe(true);
});

it('parses the numeric part of a CVE id for ordering', () => {
  expect(cveNumber('CVE-2025-52284')).toBe(52284);
  expect(cveNumber('not-a-cve')).toBe(0);
});

it('ranks severity so Moderate < High < Critical', () => {
  expect(severityRank.Moderate).toBeLessThan(severityRank.High);
  expect(severityRank.High).toBeLessThan(severityRank.Critical);
});

import { expect, it } from 'vitest';
import { cveRecords, cveNumber, cveOrder, cveYear, severityRank } from '../src/data/cves';

it('stores CVE records oldest to newest, by year then sequence number', () => {
  const keys = cveRecords.map((record) => cveOrder(record.cve));
  expect([...keys].sort((a, b) => a - b)).toEqual(keys);
});

it('lists my published CVEs with a score and a public advisory link', () => {
  expect(cveRecords.map((record) => record.cve)).toEqual([
    'CVE-2021-42624',
    'CVE-2023-30177',
    'CVE-2025-52039',
    'CVE-2025-52040',
    'CVE-2025-52041',
    'CVE-2025-52042',
    'CVE-2025-52284'
  ]);
  expect(cveRecords.every((record) => record.score > 0)).toBe(true);
  expect(cveRecords.every((record) => record.reference.startsWith('https://'))).toBe(true);
  expect(cveRecords.every((record) => record.reference.endsWith(record.cve))).toBe(true);
});

it('parses the year and the sequence number of a CVE id', () => {
  expect(cveNumber('CVE-2025-52284')).toBe(52284);
  expect(cveYear('CVE-2021-42624')).toBe(2021);
  expect(cveNumber('not-a-cve')).toBe(0);
  expect(cveYear('not-a-cve')).toBe(0);
});

it('orders an older CVE below a newer one even when its number is larger', () => {
  expect(cveOrder('CVE-2021-42624')).toBeLessThan(cveOrder('CVE-2023-30177'));
  expect(cveOrder('CVE-2025-52039')).toBeLessThan(cveOrder('CVE-2025-52284'));
});

it('ranks severity so Moderate < High < Critical', () => {
  expect(severityRank.Moderate).toBeLessThan(severityRank.High);
  expect(severityRank.High).toBeLessThan(severityRank.Critical);
});

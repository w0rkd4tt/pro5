import { describe, expect, it } from 'vitest';
import { filterResearchEntries, getRelatedResearch } from '../src/lib/research';

const entries = [
  { id: 'a', data: { type: 'CVE Analysis', tags: ['web', 'auth'], publishedAt: new Date('2026-07-01') } },
  { id: 'b', data: { type: 'Paper Notes', tags: ['web'], publishedAt: new Date('2026-05-01') } },
  { id: 'c', data: { type: 'Disclosure', tags: ['cloud'], publishedAt: new Date('2026-03-01') } }
] as any[];

describe('research helpers', () => {
  it('filters by type and tag', () => {
    expect(filterResearchEntries(entries, 'CVE Analysis', 'web').map((entry) => entry.id)).toEqual(['a']);
  });

  it('ranks shared tags and excludes the current entry', () => {
    expect(getRelatedResearch(entries, 'a', 2).map((entry) => entry.id)).toEqual(['b']);
  });
});

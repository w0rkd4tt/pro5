import { expect, it } from 'vitest';
// @ts-ignore Vitest supplies Node's runtime module without project-wide Node typings.
import { readFileSync } from 'node:fs';

const homepage = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');

it('collapses the CVE table and the certification list behind a toggle', () => {
  expect(homepage).toContain('data-collapse-toggle="#cve-list"');
  expect(homepage).toContain('data-collapse-toggle="#cert-list"');
  expect(homepage).toContain('const visibleCount = 2;');
});

it('keeps every row visible without JavaScript', () => {
  // The collapsed class and the toggle button are only applied by the script.
  expect(homepage).not.toContain('class="cve-table-wrap is-collapsed"');
  expect(homepage).toContain('aria-controls="cve-list" hidden');
  expect(homepage).toContain('aria-controls="cert-list" hidden');
});

it('renders the CVE table newest first by default', () => {
  expect(homepage).toContain('cveOrder(b.cve) - cveOrder(a.cve)');
  expect(homepage).toContain('<option value="newest-first">Newest → Oldest</option>');
});

it('hides only the items past the second one while collapsed', () => {
  const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'latin1');
  expect(css).toContain('.cve-table-wrap.is-collapsed tbody tr:nth-child(n+3),.cert-list.is-collapsed li:nth-child(n+3){display:none}');
});

import { expect, it } from 'vitest';
import { portfolio } from '../src/config/site';

it('lists my own repositories and contact links', () => {
  expect(portfolio.projects.length).toBeGreaterThan(0);
  expect(portfolio.projects.every((project) => project.url.startsWith('https://github.com/w0rkd4tt/'))).toBe(true);
  expect(portfolio.contact.github).toBe('https://github.com/w0rkd4tt');
});

it('lists the published paper with a resolvable link', () => {
  expect(portfolio.publications).toHaveLength(1);
  expect(portfolio.publications[0].url).toBe('https://isj.vn/index.php/journal_STIS/article/view/1179');
  expect(portfolio.publications[0].title).toMatch(/SQL Injection Detection Framework/);
});

it('never ships the upstream author identity', () => {
  const serialised = JSON.stringify(portfolio);
  expect(serialised).not.toMatch(/doanmanhducz|dokja/i);
});

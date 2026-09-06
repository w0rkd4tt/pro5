import { expect, it } from 'vitest';
import { portfolio } from '../src/config/site';

it('lists my own repositories and contact links', () => {
  expect(portfolio.projects.length).toBeGreaterThan(0);
  expect(portfolio.projects.every((project) => project.url.startsWith('https://github.com/w0rkd4tt/'))).toBe(true);
  expect(portfolio.contact.github).toBe('https://github.com/w0rkd4tt');
});

it('never ships the upstream author identity', () => {
  const serialised = JSON.stringify(portfolio);
  expect(serialised).not.toMatch(/doanmanhducz|dokja/i);
});

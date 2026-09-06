import { expect, it } from 'vitest';
import { portfolio, portfolioNavigation } from '../src/config/site';

it('defines the approved one-page navigation in visual order', () => {
  expect(portfolioNavigation.map((item) => item.href)).toEqual([
    '#home',
    '#skills',
    '#research',
    '#certifications',
    '#projects',
    '/writeups',
    '/blog',
    '#contact'
  ]);
});

it('lists my certifications and exposes contact', () => {
  expect(portfolio.certifications.length).toBeGreaterThan(0);
  expect(portfolio.certifications.map((certification) => certification.title)).toContain('OffSec Web Expert (OSWE)');
  expect(portfolio.contact.email).toMatch(/^mailto:/);
});

import { expect, it } from 'vitest';
// @ts-ignore Vitest supplies Node's runtime module without project-wide Node typings.
import { readFileSync } from 'node:fs';

it('defines base-path-safe browser branding in the shared layout', () => {
  const layout = readFileSync(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
  expect(layout).toContain('<title>Portfolio w0rkd4tt</title>');
  expect(layout).toContain('name="theme-color" content="#050807"');
  expect(layout).toContain("sitePath('/favicon-32x32.png')");
});

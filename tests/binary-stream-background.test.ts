import { expect, it } from 'vitest';
// @ts-ignore Vitest supplies Node's runtime module without project-wide Node typings.
import { readFileSync } from 'node:fs';

it('mounts the binary stream canvas with the same motion safeguards', () => {
  const layout = readFileSync(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
  const component = readFileSync(new URL('../src/components/BinaryStreamBackground.astro', import.meta.url), 'utf8');

  expect(layout).toContain('<BinaryStreamBackground />');
  expect(component).toContain('prefers-reduced-motion');
  expect(component).toContain('visibilitychange');
  expect(component).toContain('devicePixelRatio');
  expect(component).toContain("astro:before-swap");
});

it('keeps the binary stream behind readable content', () => {
  const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'latin1');

  expect(css).toContain('.binary-canvas{position:fixed;inset:0;pointer-events:none;z-index:0');
  expect(css).toContain('body>main,body>.site-footer{position:relative;z-index:2}');
});

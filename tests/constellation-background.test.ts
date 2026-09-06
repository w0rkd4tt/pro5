import { expect, it } from 'vitest';
// @ts-ignore Vitest supplies Node's runtime module without project-wide Node typings.
import { readFileSync } from 'node:fs';

it('mounts one shared constellation canvas with motion safeguards', () => {
  const layout = readFileSync(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
  const component = readFileSync(new URL('../src/components/ConstellationBackground.astro', import.meta.url), 'utf8');

  expect(layout).toContain('<ConstellationBackground />');
  expect(component).toContain('prefers-reduced-motion');
  expect(component).toContain('visibilitychange');
  expect(component).toContain('devicePixelRatio');
  expect(component).toContain('const connectionDistance = () => 200');
  expect(component).toContain('* 0.32');
});

it('keeps the constellation and scanlines behind readable content', () => {
  const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'latin1');

  expect(css).toContain('.constellation-canvas,.scanlines{position:fixed;inset:0');
  expect(css).toContain('.scanlines{z-index:1');
  expect(css).toContain('rgba(0,255,127,.016)');
});

it('does not override fixed controls while placing content above the canvas', () => {
  const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'latin1');

  expect(css).toContain('body>main,body>.site-footer{position:relative;z-index:2}');
  expect(css).not.toContain('body> :not(.constellation-canvas):not(.scanlines){position:relative;z-index:2}');
  expect(css).toContain('.back-to-top{z-index:7}');
});

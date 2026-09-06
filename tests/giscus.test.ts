import { expect, it } from 'vitest';
import { giscusScriptAttributes } from '../src/components/giscus-config';

it('does not emit a Giscus script without configuration', () => {
  expect(giscusScriptAttributes(null)).toBeNull();
});

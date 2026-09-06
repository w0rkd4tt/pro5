import { expect, it } from 'vitest';
import { site } from '../src/config/site';

it('does not publish a CV that still contains a phone number', () => {
  expect(site.cvHref).toBeNull();
});

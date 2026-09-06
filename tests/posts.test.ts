import { expect, it } from 'vitest';
import { getPostsByType, getPublishedPosts, postPath } from '../src/lib/posts';

const posts = [
  { id: 'older', data: { type: 'blog', slug: 'older', date: '2026-01-01', draft: false } },
  { id: 'draft', data: { type: 'blog', slug: 'private-note', date: '2026-03-01', draft: true } },
  { id: 'newer', data: { type: 'writeup', slug: 'newer', date: '2026-02-01', draft: false } }
] as any[];

it('omits drafts and sorts published posts newest first', () => {
  expect(getPublishedPosts(posts).map((post) => post.id)).toEqual(['newer', 'older']);
});

it('filters post types and builds trailing-slash static routes', () => {
  expect(getPostsByType(posts, 'blog').map((post) => post.id)).toEqual(['older']);
  expect(postPath('writeup', 'newer')).toBe('/writeups/newer/');
  expect(postPath('blog', 'older')).toBe('/blog/older/');
});

type Post = { id: string; data: { type: 'writeup' | 'blog'; slug: string; date: Date | string; draft: boolean } };
export function getPublishedPosts<T extends Post>(posts: T[]) { return posts.filter((post) => !post.data.draft).sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf()); }
export function getPostsByType<T extends Post>(posts: T[], type: Post['data']['type']) { return getPublishedPosts(posts).filter((post) => post.data.type === type); }
export function postPath(type: Post['data']['type'], slug: string) { return type === 'writeup' ? `/writeups/${slug}/` : `/blog/${slug}/`; }

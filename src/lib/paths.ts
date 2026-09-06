const base = '/pro5';

export function sitePath(path: string): string {
  return path === '/' ? `${base}/` : `${base}${path}`;
}

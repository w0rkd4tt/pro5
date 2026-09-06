export type GiscusConfig = { repo: string; repoId: string; category: string; categoryId: string };

export function giscusScriptAttributes(config: GiscusConfig | null) {
  if (!config) return null;
  return { src: 'https://giscus.app/client.js', 'data-repo': config.repo, 'data-repo-id': config.repoId, 'data-category': config.category, 'data-category-id': config.categoryId, 'data-mapping': 'pathname', 'data-theme': 'noborder_light', crossorigin: 'anonymous', async: true };
}

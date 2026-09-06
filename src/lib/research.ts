type ResearchEntry = {
  id: string;
  data: {
    type: string;
    tags: string[];
    publishedAt: Date;
  };
};

export function filterResearchEntries<T extends ResearchEntry>(entries: T[], type = 'All', tag = 'All'): T[] {
  return entries.filter((entry) =>
    (type === 'All' || entry.data.type === type) &&
    (tag === 'All' || entry.data.tags.includes(tag))
  );
}

export function getRelatedResearch<T extends ResearchEntry>(entries: T[], currentId: string, max = 3): T[] {
  const current = entries.find((entry) => entry.id === currentId);
  if (!current) return [];

  return entries
    .filter((entry) => entry.id !== currentId)
    .map((entry) => ({
      entry,
      score: entry.data.tags.filter((tag) => current.data.tags.includes(tag)).length
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.entry.data.publishedAt.valueOf() - a.entry.data.publishedAt.valueOf())
    .slice(0, max)
    .map(({ entry }) => entry);
}

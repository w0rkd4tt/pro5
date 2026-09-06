export type AchievementKind = 'paper' | 'cve' | 'certification' | 'acknowledgement' | 'career';
export type Achievement = { kind: AchievementKind; title: string; date: string; organization: string; summary: string; url?: string };

// Add career steps, papers, CVEs, credentials, and acknowledgements here.
// Empty groups are skipped automatically on /hall-of-fame.
export const achievements: Achievement[] = [];

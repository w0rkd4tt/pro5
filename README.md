# pro5 — personal security portfolio

A static, terminal-styled portfolio for security work: tooling, research notes, CVE write-ups, and blog posts.
Built with [Astro](https://astro.build), deployed to GitHub Pages at `https://w0rkd4tt.github.io/pro5`.

Forked and reworked from [doanmanhducz/LOCKIN](https://github.com/doanmanhducz/LOCKIN) — the layout and terminal
theme come from there; identity, content, branding, and data are my own.

## Local development

```bash
npm install
npm run dev        # http://localhost:4321/pro5
npm run check      # astro check (types + templates)
npm test -- --run  # vitest
npm run build      # static output in dist/
```

## Publishing content

- **Identity, skills, projects, certifications, contact** — `src/config/site.ts`. Set `contact.linkedin` to a URL to
  show that row; leave it `null` to hide it.
- **CVE table on the homepage** — `src/data/cves.ts`. Every record needs an NVD `reference`; add `writeup` once a post
  with that `slug` exists in `src/content/posts/`, and the table links there instead of NVD.
- **Career, papers, credentials** — `src/data/hall-of-fame.ts` (rendered on `/hall-of-fame`, empty groups are skipped).
- **Write-ups and blog posts** — Markdown in `src/content/posts/`. Set `type` to `writeup` or `blog`, keep a unique
  `slug`, and leave `draft: true` until it is ready. Templates: `example-writeup.md`, `example-blog.md`.
- **Research notes** — Markdown in `src/content/research/`. Template: `example-note.md`.
- **Cover images** — `public/images/posts/`, referenced as `coverImage: /images/posts/your-file.png`.
- **Comments** — off by default. Create a GitHub Discussions category and put the Giscus IDs in `site.giscus`.

Every internal link must go through `sitePath()` from `src/lib/paths.ts` so the `/pro5` base path stays correct.

## Deploy

Push to `main`; `.github/workflows/deploy.yml` runs check, tests, and build, then publishes to GitHub Pages.
Enable Pages for the repo with source **GitHub Actions**.

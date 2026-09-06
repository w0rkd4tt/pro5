# AGENTS.md

## Workflow rules

- Sau khi thay đổi code hoặc nội dung, chạy `npm run check` và `npm test -- --run`, đảm bảo không lỗi trước khi commit.
- Commit với message mô tả rõ thay đổi. Chỉ push khi chủ repo yêu cầu.
- Không commit file tạm, file lớn không liên quan (CV, ảnh raw, dump...) trừ khi được yêu cầu rõ ràng.

## Project

- Astro static site, deploy GitHub Pages qua GitHub Actions (`.github/workflows/deploy.yml`).
- Base path: `/pro5` — mọi route nội bộ phải đi qua `sitePath()` trong `src/lib/paths.ts`.
  Đổi base path thì phải sửa cả `astro.config.mjs`, `src/lib/paths.ts` và `tests/site-shell.test.ts`.
- Nội dung bài viết: Markdown trong `src/content/posts/` (writeup + blog) và `src/content/research/`.
- CVE tracking: `src/data/cves.ts`. Career / papers / credentials: `src/data/hall-of-fame.ts`.
- Config cá nhân: `src/config/site.ts`.
- Fork từ `doanmanhducz/LOCKIN`. Không thêm lại nội dung, thành tích, hay branding của tác giả gốc —
  có test chặn việc này trong `tests/homepage-content.test.ts`.

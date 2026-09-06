<h1 align="center">w0rkd4tt — security portfolio</h1>

<p align="center">
  <a href="https://w0rkd4tt.github.io/pro5/"><b>w0rkd4tt.github.io/pro5</b></a><br/>
  <sub>Offensive security · vulnerability research · security tooling</sub>
</p>

---

## Giới thiệu

Đây là portfolio cá nhân của **Nguyen Le Quoc Dat** (`w0rkd4tt`) — một trang tĩnh, giao diện terminal, dùng để
tập hợp lại những thứ đã làm thay vì để chúng nằm rải rác trên GitHub và trong ổ cứng:

- **Research** — các CVE đã công bố, kèm link NVD và write-up khi có.
- **Publications** — bài báo khoa học đã đăng.
- **Projects** — công cụ tự viết: scanner, Burp extension, MCP server cho AI agent, ML cho malware.
- **Certifications** — chứng chỉ bảo mật.
- **Write-Ups / Blog** — bài phân tích lỗ hổng và ghi chép nghề.

Trang được build bằng [Astro](https://astro.build) (static, không backend, không tracker), deploy tự động lên
GitHub Pages mỗi lần push `main`.

## Tại sao trông như cái terminal

Vì đó là nơi phần lớn công việc thật sự diễn ra. Layout và theme kế thừa từ
[doanmanhducz/LOCKIN](https://github.com/doanmanhducz/LOCKIN) — cảm ơn tác giả gốc.
Toàn bộ danh tính, nội dung, dữ liệu, branding và phần nền binary stream là của riêng repo này.

## Tech stack

| Thành phần | Lựa chọn |
|---|---|
| Framework | Astro 5, `output: 'static'` |
| Nội dung | Markdown qua Astro Content Collections (có schema Zod) |
| Style | Một file CSS thuần, không framework |
| Nền động | 2 canvas: constellation + binary stream (tôn trọng `prefers-reduced-motion`) |
| Test | Vitest |
| Deploy | GitHub Actions → GitHub Pages, base path `/pro5` |

## Cấu trúc

```
src/
  config/site.ts        # danh tính, skills, projects, certifications, publications, contact
  data/cves.ts          # bảng CVE trên trang chủ
  data/hall-of-fame.ts  # career path, papers, credentials cho /hall-of-fame
  content/posts/        # write-ups + blog (Markdown)
  content/research/     # research notes (Markdown)
  components/           # card, filter, nền canvas, giscus
  layouts/BaseLayout.astro
  pages/                # /, /about, /research, /writeups, /blog, /hall-of-fame, 404
  lib/paths.ts          # sitePath() — mọi link nội bộ phải đi qua đây
tests/                  # vitest: config, nội dung, path, nền
```

## Chạy local

```bash
npm install
npm run dev        # http://localhost:4321/pro5
npm run check      # astro check (types + templates)
npm test -- --run  # vitest
npm run build      # output tĩnh trong dist/
```

## Thêm nội dung

- **Danh tính, skills, projects, certifications, publications, contact** → `src/config/site.ts`
  (đặt `contact.linkedin` thành URL để hiện dòng LinkedIn, để `null` là ẩn).
- **CVE** → `src/data/cves.ts`. Mỗi record cần `reference` (link NVD); thêm `writeup: '<slug>'` khi đã có bài
  trong `src/content/posts/` thì bảng sẽ trỏ vào bài đó thay vì NVD.
- **Career / papers / credentials cho `/hall-of-fame`** → `src/data/hall-of-fame.ts` (nhóm rỗng tự ẩn).
- **Write-up / blog** → Markdown trong `src/content/posts/`, `type` là `writeup` hoặc `blog`, `slug` duy nhất,
  để `draft: true` cho tới khi sẵn sàng. Template: `example-writeup.md`, `example-blog.md`.
- **Research note** → `src/content/research/`. Template: `example-note.md`.
- **Ảnh cover** → `public/images/posts/`, khai báo `coverImage: /images/posts/ten-file.png`.
- **Comment** → mặc định tắt. Tạo category trong GitHub Discussions rồi điền Giscus IDs vào `site.giscus`.

> Mọi link nội bộ phải gọi `sitePath()` trong `src/lib/paths.ts` để base path `/pro5` không bị vỡ.

## Publish một lệnh

```bash
./publish.sh                 # check -> test -> build -> commit -> push -> theo dõi deploy
./publish.sh "commit msg"    # tự đặt commit message
./publish.sh -n              # chỉ chạy check/test/build, không commit/push
./publish.sh -f              # không có thay đổi vẫn chạy lại workflow deploy
```

Script dừng ngay khi có bước fail, liệt kê file sắp publish, cảnh báo bài còn `draft: true`, và in link live
khi GitHub Actions xong. Tương đương `npm run deploy`.

## Deploy

Push lên `main` là xong: `.github/workflows/deploy.yml` chạy `check` → `test` → `build` rồi publish lên
GitHub Pages (Settings → Pages → Source: **GitHub Actions**).

## License

Nội dung (bài viết, dữ liệu CVE, thông tin cá nhân) thuộc về tác giả. Phần code kế thừa từ upstream giữ
nguyên điều khoản của repo gốc.

#!/usr/bin/env bash
# One-click publish: check -> test -> build -> commit -> push -> watch deploy.
# Usage:
#   ./publish.sh                 # tự sinh commit message từ các file đã đổi
#   ./publish.sh "message"       # commit message tự đặt
#   ./publish.sh -f              # không có thay đổi vẫn chạy lại workflow (redeploy)
#   ./publish.sh -n              # chạy hết check/test/build nhưng KHÔNG commit/push
set -euo pipefail
cd "$(dirname "$0")"

REPO="w0rkd4tt/pro5"
LIVE="https://w0rkd4tt.github.io/pro5/"
BRANCH="main"

if [ -t 1 ]; then G=$'\033[32m'; Y=$'\033[33m'; R=$'\033[31m'; B=$'\033[1m'; N=$'\033[0m'; else G=""; Y=""; R=""; B=""; N=""; fi
step() { printf '%s\n' "${G}==>${N} ${B}$1${N}"; }
warn() { printf '%s\n' "${Y}  ! $1${N}"; }
die()  { printf '%s\n' "${R}==> $1${N}" >&2; exit 1; }

MESSAGE=""
FORCE=0
DRY=0
while [ $# -gt 0 ]; do
  case "$1" in
    -f|--force)  FORCE=1 ;;
    -n|--dry-run) DRY=1 ;;
    -h|--help)   sed -n '2,7p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    -*)          die "Tham số lạ: $1 (dùng -h để xem)" ;;
    *)           MESSAGE="$1" ;;
  esac
  shift
done

[ -d .git ] || die "Không phải git repo."
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
[ "$CURRENT_BRANCH" = "$BRANCH" ] || warn "Đang ở nhánh '$CURRENT_BRANCH', không phải '$BRANCH' — deploy chỉ chạy trên '$BRANCH'."

# 0. Dependencies
if [ ! -d node_modules ]; then
  step "Cài dependencies (node_modules chưa có)"
  npm install
fi

# 1. Có gì để publish không?
CHANGES="$(git status --porcelain)"
UNPUSHED="$(git log --oneline "origin/$BRANCH..HEAD" 2>/dev/null || true)"
if [ -z "$CHANGES" ] && [ -z "$UNPUSHED" ] && [ "$FORCE" -eq 0 ]; then
  step "Không có thay đổi nào để publish"
  echo "  Dùng ./publish.sh -f nếu muốn chạy lại workflow deploy."
  exit 0
fi
if [ -n "$CHANGES" ]; then
  step "Thay đổi sẽ được publish"
  git status --short | sed 's/^/  /'
fi

# 2. Cảnh báo bài còn draft
DRAFTS="$(grep -rl '^draft: true' src/content 2>/dev/null || true)"
if [ -n "$DRAFTS" ]; then
  warn "Các bài đang draft (sẽ KHÔNG lên site):"
  printf '%s\n' "$DRAFTS" | sed 's/^/    /'
fi

# 3. Kiểm tra
step "astro check"
npm run check
step "vitest"
npm test -- --run
step "build"
npm run build

if [ "$DRY" -eq 1 ]; then
  step "Dry run — dừng trước khi commit/push"
  exit 0
fi

# 4. Commit
if [ -n "$CHANGES" ]; then
  if [ -z "$MESSAGE" ]; then
    NEW_POSTS="$(git status --porcelain src/content 2>/dev/null | awk '$1=="??"||$1=="A"{print $2}' | xargs -n1 basename 2>/dev/null | sed 's/\.md$//' | paste -sd', ' - || true)"
    if [ -n "$NEW_POSTS" ]; then
      MESSAGE="Publish $NEW_POSTS"
    else
      MESSAGE="Update site content ($(git status --porcelain | wc -l | tr -d ' ') file(s))"
    fi
  fi
  step "Commit: $MESSAGE"
  git add -A
  git commit -q -m "$MESSAGE"
fi

# 5. Push
step "Push lên origin/$BRANCH"
git push -q origin "$CURRENT_BRANCH"

# 6. Theo dõi deploy
if ! command -v gh >/dev/null 2>&1; then
  step "Đã push. Không có gh CLI nên không theo dõi được workflow."
  echo "  Xem tại: https://github.com/$REPO/actions"
  exit 0
fi

if [ "$FORCE" -eq 1 ] && [ -z "$CHANGES" ]; then
  step "Kích hoạt lại workflow (workflow_dispatch)"
  gh workflow run deploy.yml --repo "$REPO" --ref "$BRANCH" >/dev/null
  sleep 5
fi

step "Chờ GitHub Actions"
RUN_ID="$(gh run list --repo "$REPO" --branch "$BRANCH" --limit 1 --json databaseId --jq '.[0].databaseId')"
if [ -z "$RUN_ID" ]; then
  warn "Chưa thấy workflow run nào — xem https://github.com/$REPO/actions"
  exit 0
fi
if gh run watch "$RUN_ID" --repo "$REPO" --exit-status --interval 10 >/dev/null 2>&1; then
  step "Deploy xong ✔"
  echo "  Live: $LIVE"
else
  die "Workflow fail. Log: gh run view $RUN_ID --repo $REPO --log-failed"
fi

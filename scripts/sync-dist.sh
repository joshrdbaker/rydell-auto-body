#!/usr/bin/env sh
# Keep dist/ in sync with src/ for CSS and HTML. Run after edits: npm run sync
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

cp src/style.css dist/style.css

for f in src/*.html; do
  [ -f "$f" ] || continue
  cp "$f" "dist/$(basename "$f")"
done

if [ -d src/images ] && [ -d dist/images ]; then
  cp -f src/images/* dist/images/ 2>/dev/null || true
fi

echo "sync-dist: copied style.css, HTML from src/ to dist/ (and images if present)."

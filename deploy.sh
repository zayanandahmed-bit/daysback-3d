#!/usr/bin/env bash
# Build the site and publish it to the gh-pages branch.
#
# GitHub Pages serves the built output, not this source tree, so `main` holds
# the React source and `gh-pages` holds only what Vite produces. Run this after
# any change you want live:  npm run deploy
set -euo pipefail

cd "$(dirname "$0")"

npm run build

# Put each page's rendered text into its HTML so crawlers that don't run
# JavaScript (ChatGPT, Claude, Perplexity) can read the site. Needs Python with
# Playwright; set PRERENDER_PY to override the interpreter.
PY="${PRERENDER_PY:-../Google-Maps-Scrapper/venv/bin/python}"
if [ -x "$PY" ]; then
  npx vite preview --port 5190 --strictPort >/dev/null 2>&1 &
  PREVIEW=$!
  trap 'kill $PREVIEW 2>/dev/null || true' EXIT
  for _ in $(seq 1 40); do curl -s -o /dev/null http://localhost:5190/ && break; sleep 0.25; done
  "$PY" scripts/prerender.py dist http://localhost:5190
  kill $PREVIEW 2>/dev/null || true
else
  echo "Skipping prerender: no Python with Playwright at $PY"
fi

WORKTREE=".gh-pages"
rm -rf "$WORKTREE"
git worktree prune

# Start from the existing gh-pages branch if there is one, otherwise create it.
if git show-ref --quiet refs/remotes/origin/gh-pages; then
  git worktree add -B gh-pages "$WORKTREE" origin/gh-pages >/dev/null
else
  git worktree add -B gh-pages "$WORKTREE" >/dev/null
fi

# Wipe the old build (keeping .git) so deleted files don't linger on the site.
find "$WORKTREE" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +

cp -R dist/. "$WORKTREE"/
# Without this, Pages runs the output through Jekyll, which drops any file or
# folder whose name starts with an underscore.
touch "$WORKTREE/.nojekyll"

cd "$WORKTREE"
git add -A
if git diff --cached --quiet; then
  echo "No change in build output, nothing to deploy."
else
  git commit -q -m "Deploy site from $(git -C .. rev-parse --short HEAD)"
  git push -q --force origin gh-pages
  echo "Deployed to gh-pages."
fi

cd ..
git worktree remove --force "$WORKTREE"

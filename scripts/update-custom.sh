#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
cd "$ROOT_DIR"

TARGET_BRANCH="aeyeops/custom-main"

if ! git show-ref --quiet refs/heads/"$TARGET_BRANCH"; then
  echo "Branch $TARGET_BRANCH does not exist locally" >&2
  exit 1
fi

echo "Ensuring origin/main is current..."
git fetch origin

# optional ensure local main up to date
if git show-ref --quiet refs/heads/main; then
  git checkout main
  git pull origin main
else
  git checkout -b main origin/main
fi

echo "Merging origin/main into $TARGET_BRANCH..."
git checkout "$TARGET_BRANCH"
git pull origin "$TARGET_BRANCH"
git merge origin/main

git push origin "$TARGET_BRANCH"

echo "$TARGET_BRANCH now includes the latest origin/main changes."

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
cd "$ROOT_DIR"

echo "Updating main from upstream..."

git fetch upstream

git checkout main

git pull --rebase upstream main

git push origin main

echo "main is now up to date with upstream/main."

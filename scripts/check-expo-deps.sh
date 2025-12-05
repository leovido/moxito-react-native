#!/usr/bin/env bash
set -euo pipefail

output=$(npx expo install --check --non-interactive 2>&1 || true)
echo "$output"

if ! grep -q "All dependencies are compatible" <<<"$output"; then
  echo "Expo dependencies are out of sync. Run 'npx expo install' locally."
  exit 1
fi
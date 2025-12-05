#!/usr/bin/env bash
set -euo pipefail

output=$(CI=1 npx expo install --check 2>&1 || true)
echo "$output"

if ! grep -Eq "All dependencies are compatible|Dependencies are up to date" <<<"$output"; then
  echo "Expo dependencies are out of sync. Run 'npx expo install' locally."
  exit 1
fi
#!/usr/bin/env bash
# Create GitHub issues from sprint-issues.json using gh CLI.
# Requirements: gh CLI authenticated, repo checked out.

set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
JSON_FILE="$ROOT_DIR/sprint-issues.json"

if ! command -v gh >/dev/null; then
  echo "gh CLI not found. Install and authenticate first: https://cli.github.com/"
  exit 1
fi

echo "Reading issues from $JSON_FILE"
jq -c '.[]' "$JSON_FILE" | while read -r item; do
  title=$(echo "$item" | jq -r '.title')
  body=$(echo "$item" | jq -r '.body')
  labels=$(echo "$item" | jq -r '.labels | join(",")')

  # Check if title exists already
  exists=$(gh issue list --limit 100 --search "\"$title\"" --json title --jq '.[].title' || true)
  if echo "$exists" | grep -Fxq "$title"; then
    echo "Skipping existing issue: $title"
    continue
  fi

  echo "Creating issue: $title"
  if ! gh issue create --title "$title" --body "$body" --label "$labels"; then
    echo "Warning: could not add labels ($labels). Creating issue without labels."
    gh issue create --title "$title" --body "$body"
  fi
done

echo "Done creating issues."

#!/usr/bin/env bash
# SessionStart hook: print today's devlog entry if it exists, else the most
# recent entry. Reads devlog_path from _bmad/devlog/config.yaml.
#
# Bound by Claude Code's SessionStart event via hooks/hooks.json. Exits 0
# silently when there's nothing useful to surface.

set -eu

config="${PWD}/_bmad/devlog/config.yaml"
[ -f "$config" ] || exit 0

devlog_path=$(awk -F': *' '/^devlog_path:/ {print $2; exit}' "$config" | tr -d '"')
[ -n "$devlog_path" ] && [ -d "$devlog_path" ] || exit 0

today="$(date +%F)"
today_file="${devlog_path}/${today}.md"

if [ -f "$today_file" ]; then
  echo "=== Devlog — ${today} ==="
  cat "$today_file"
  exit 0
fi

# Fall back to the most recent .md by mtime. Glob + `-nt` instead of parsing
# `ls` so filenames with spaces/newlines are handled safely (and ShellCheck
# stays happy).
latest=""
for f in "${devlog_path}"/*.md; do
  [ -e "$f" ] || continue
  if [ -z "$latest" ] || [ "$f" -nt "$latest" ]; then
    latest="$f"
  fi
done
if [ -n "$latest" ]; then
  echo "=== Most recent devlog ($(basename "$latest" .md)) ==="
  cat "$latest"
fi

exit 0

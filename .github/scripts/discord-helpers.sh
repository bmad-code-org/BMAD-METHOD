#!/bin/bash
# Discord notification helper functions

# Escape markdown special chars and @mentions for safe Discord display
# Skips content inside <URL> wrappers to preserve URLs intact
esc() {
  awk '{
    result = ""; in_url = 0; n = length($0)
    for (i = 1; i <= n; i++) {
      c = substr($0, i, 1)
      if (c == "<" && substr($0, i, 8) ~ /^<https?:/) in_url = 1
      if (in_url) { result = result c; if (c == ">") in_url = 0 }
      else if (c == "@") result = result "@ "
      else if (index("[]\\*_()~`", c) > 0) result = result "\\" c
      else result = result c
    }
    print result
  }'
}

# Truncate to $1 chars (or 80 if wall-of-text with <3 spaces)
trunc() {
  local max=$1
  local txt=$(tr '\n\r' '  ' | cut -c1-"$max")
  local spaces=$(printf '%s' "$txt" | tr -cd ' ' | wc -c)
  [ "$spaces" -lt 3 ] && [ ${#txt} -gt 80 ] && txt=$(printf '%s' "$txt" | cut -c1-80)
  printf '%s' "$txt"
}

# Remove incomplete URL at end of truncated text (incomplete URLs are useless)
strip_trailing_url() { sed -E 's~<?https?://[^[:space:]]*$~~'; }

# Wrap URLs in <> to suppress Discord embeds (keeps links clickable)
wrap_urls() { sed -E 's~https?://[^[:space:]<>]+~<&>~g'; }

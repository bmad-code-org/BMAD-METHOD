#!/bin/bash
# Discord notification helper functions

# Escape markdown special chars for safe Discord display
esc() { sed 's/[\\*_[\]()~`>]/\\&/g'; }

# Smart truncate: limit to $1 chars, but if wall-of-text (< 3 spaces), limit to 80
trunc() {
  local max=$1
  local txt=$(tr '\n\r' '  ' | head -c "$max")
  local spaces=$(echo "$txt" | tr -cd ' ' | wc -c)
  [ "$spaces" -lt 3 ] && [ ${#txt} -gt 80 ] && txt="${txt:0:80}"
  echo -n "$txt"
}

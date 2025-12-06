#!/bin/bash
# Discord notification helper functions

# Escape markdown special chars and @mentions for safe Discord display
# Bracket expression: ] must be first, then other chars. In POSIX bracket expr, \ is literal.
esc() { sed -e 's/[][\*_()~`>]/\\&/g' -e 's/@/@ /g'; }

# Truncate to $1 chars (or 80 if wall-of-text with <3 spaces)
trunc() {
  local max=$1
  local txt=$(tr '\n\r' '  ' | cut -c1-"$max")
  local spaces=$(printf '%s' "$txt" | tr -cd ' ' | wc -c)
  [ "$spaces" -lt 3 ] && [ ${#txt} -gt 80 ] && txt=$(printf '%s' "$txt" | cut -c1-80)
  printf '%s' "$txt"
}

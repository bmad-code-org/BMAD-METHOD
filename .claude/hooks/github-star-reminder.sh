#!/bin/bash
#
# File: .claude/hooks/github-star-reminder.sh
#
# AgentVibes - Finally, your AI Agents can Talk Back! Text-to-Speech WITH personality for AI Assistants!
# Website: https://agentvibes.org
# Repository: https://github.com/paulpreibisch/AgentVibes
#
# Co-created by Paul Preibisch with Claude AI
# Copyright (c) 2025 Paul Preibisch
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# DISCLAIMER: This software is provided "AS IS", WITHOUT WARRANTY OF ANY KIND,
# express or implied, including but not limited to the warranties of
# merchantability, fitness for a particular purpose and noninfringement.
# In no event shall the authors or copyright holders be liable for any claim,
# damages or other liability, whether in an action of contract, tort or
# otherwise, arising from, out of or in connection with the software or the
# use or other dealings in the software.
#
# ---
#
# @fileoverview GitHub Star Reminder System - Gentle daily reminder to star repository
# @context Shows a once-per-day reminder to encourage users to support the project without being annoying
# @architecture Timestamp-based tracking using daily date comparison in a state file
# @dependencies date command for timestamp generation
# @entrypoints Called by play-tts.sh router on every TTS execution, sourced or executed directly
# @patterns Rate-limiting via file-based state, graceful degradation, user-opt-out support
# @related .claude/github-star-reminder.txt (state file), .claude/github-star-reminder-disabled.flag (opt-out)

# Determine config directory (project-local or global)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$(dirname "$SCRIPT_DIR")"

# Check if we have a project-local .claude directory
if [[ -d "$CLAUDE_DIR" ]] && [[ "$CLAUDE_DIR" != "$HOME/.claude" ]]; then
  REMINDER_FILE="$CLAUDE_DIR/github-star-reminder.txt"
else
  REMINDER_FILE="$HOME/.claude/github-star-reminder.txt"
  mkdir -p "$HOME/.claude"
fi

GITHUB_REPO="https://github.com/paulpreibisch/AgentVibes"

# @function is_reminder_disabled
# @intent Check if GitHub star reminders have been disabled by the user
# @why Respect user preferences and provide opt-out mechanism for reminders
# @param None
# @returns None
# @exitcode 0=reminders disabled, 1=reminders enabled
# @sideeffects Reads flag files from local/global .claude directories
# @edgecases Checks both flag file and "disabled" text in reminder file for backward compatibility
# @calledby should_show_reminder
# @calls cat for reading reminder file content
is_reminder_disabled() {
  # Check for disable flag file
  local disable_file_local="$CLAUDE_DIR/github-star-reminder-disabled.flag"
  local disable_file_global="$HOME/.claude/github-star-reminder-disabled.flag"

  if [[ -f "$disable_file_local" ]] || [[ -f "$disable_file_global" ]]; then
    return 0  # Disabled
  fi

  # Check if reminder file contains "disabled"
  if [[ -f "$REMINDER_FILE" ]]; then
    local content=$(cat "$REMINDER_FILE" 2>/dev/null)
    if [[ "$content" == "disabled" ]]; then
      return 0  # Disabled
    fi
  fi

  return 1  # Not disabled
}

# @function should_show_reminder
# @intent Determine if reminder should be displayed based on date and disable status
# @why Implement once-per-day rate limiting to avoid annoying users
# @param None
# @returns None
# @exitcode 0=should show, 1=should not show
# @sideeffects Reads .claude/github-star-reminder.txt for last reminder date
# @edgecases Shows reminder if file doesn't exist (first run), compares YYYYMMDD format dates
# @calledby Main execution block
# @calls is_reminder_disabled, cat, date
should_show_reminder() {
  # Check if disabled first
  if is_reminder_disabled; then
    return 1
  fi

  # If no reminder file exists, show it
  if [[ ! -f "$REMINDER_FILE" ]]; then
    return 0
  fi

  # Read last reminder date
  LAST_REMINDER=$(cat "$REMINDER_FILE" 2>/dev/null || echo "0")
  CURRENT_DATE=$(date +%Y%m%d)

  # Show reminder if it's a new day
  if [[ "$LAST_REMINDER" != "$CURRENT_DATE" ]]; then
    return 0
  fi

  return 1
}

# @function show_reminder
# @intent Display friendly GitHub star reminder with opt-out instructions
# @why Encourage community support while being respectful and non-intrusive
# @param None
# @returns None
# @exitcode Always 0
# @sideeffects Updates reminder file with current date, writes to stdout
# @edgecases None
# @calledby Main execution block when should_show_reminder returns true
# @calls date, echo
show_reminder() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "⭐ Enjoying AgentVibes?"
  echo ""
  echo "   If you find this project helpful, please consider giving us"
  echo "   a star on GitHub! It helps others discover AgentVibes and"
  echo "   motivates us to keep improving it."
  echo ""
  echo "   👉 $GITHUB_REPO"
  echo ""
  echo "   Thank you for your support! 🙏"
  echo ""
  echo "   💡 To disable these reminders, run:"
  echo "   echo \"disabled\" > $REMINDER_FILE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  # Update the reminder file with today's date
  date +%Y%m%d > "$REMINDER_FILE"
}

# Main execution
if should_show_reminder; then
  show_reminder
fi

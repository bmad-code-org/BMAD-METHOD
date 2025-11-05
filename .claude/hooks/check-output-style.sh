#!/bin/bash
#
# File: .claude/hooks/check-output-style.sh
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
# @fileoverview Output Style Detection - Detects if Agent Vibes output style is active in Claude Code
# @context Voice commands require the Agent Vibes output style to work properly with automatic TTS
# @architecture Heuristic detection using environment variables and file system checks
# @dependencies CLAUDECODE environment variable, .claude/output-styles/agent-vibes.md file
# @entrypoints Called by slash commands to warn users if output style is incorrect
# @patterns Environment-based detection, graceful degradation with helpful error messages
# @related .claude/output-styles/agent-vibes.md, Claude Code output style system

# AI NOTE: Output style detection is heuristic-based because Claude Code does not expose
# the active output style via environment variables. We check for CLAUDECODE env var and
# the presence of the agent-vibes.md output style file as indicators.

# @function check_output_style
# @intent Detect if Agent Vibes output style is likely active in Claude Code session
# @why Voice commands depend on output style hooks that automatically invoke TTS
# @param None
# @returns None
# @exitcode 0=likely using agent-vibes style, 1=not using or cannot detect
# @sideeffects None (read-only checks)
# @edgecases Cannot directly detect output style, relies on CLAUDECODE env var and file presence
# @calledby Main execution block, slash command validation
# @calls None (direct environment and file checks)
check_output_style() {
  # Strategy: Check if this script is being called from within a Claude response
  # If CLAUDECODE env var is set, we're in Claude Code
  # If not, we're running standalone (not in a Claude Code session)

  if [[ -z "$CLAUDECODE" ]]; then
    # Not in Claude Code at all
    return 1
  fi

  # We're in Claude Code, but we can't directly detect output style
  # The agent-vibes output style calls our TTS hooks automatically
  # So if this function is called, it means a slash command was invoked

  # Check if we have the necessary TTS setup
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

  # Check if agent-vibes output style is installed
  if [[ ! -f "$SCRIPT_DIR/../output-styles/agent-vibes.md" ]]; then
    return 1
  fi

  # All checks passed - likely using agent-vibes output style
  return 0
}

# @function show_output_style_warning
# @intent Display helpful warning about enabling Agent Vibes output style
# @why Users need guidance on how to enable automatic TTS narration
# @param None
# @returns None
# @exitcode Always 0
# @sideeffects Writes warning message to stdout
# @edgecases None
# @calledby Main execution block when check_output_style fails
# @calls echo
show_output_style_warning() {
  echo ""
  echo "⚠️  Voice commands require the Agent Vibes output style"
  echo ""
  echo "To enable voice narration, run:"
  echo "  /output-style Agent Vibes"
  echo ""
  echo "This will make Claude speak with TTS for all responses."
  echo "You can still use voice commands manually with agent-vibes disabled,"
  echo "but you won't hear automatic TTS narration."
  echo ""
}

# Main execution when called directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  if ! check_output_style; then
    show_output_style_warning
    exit 1
  fi
  exit 0
fi

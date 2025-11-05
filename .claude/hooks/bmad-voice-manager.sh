#!/bin/bash
#
# File: .claude/hooks/bmad-voice-manager.sh
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
# @fileoverview BMAD Voice Plugin Manager - Maps BMAD agents to unique TTS voices
# @context Enables each BMAD agent to have its own distinct voice for multi-agent sessions
# @architecture Markdown table-based voice mapping with enable/disable flag, auto-detection of BMAD
# @dependencies .claude/plugins/bmad-voices.md (voice mappings), bmad-tts-injector.sh, .bmad-core/ (BMAD installation)
# @entrypoints Called by /agent-vibes:bmad commands, auto-enabled on BMAD detection
# @patterns Plugin architecture, auto-enable on dependency detection, state backup/restore on toggle
# @related bmad-tts-injector.sh, .claude/plugins/bmad-voices.md, .bmad-agent-context file

PLUGIN_DIR=".claude/plugins"
PLUGIN_FILE="$PLUGIN_DIR/bmad-voices.md"
ENABLED_FLAG="$PLUGIN_DIR/bmad-voices-enabled.flag"

# AI NOTE: Auto-enable pattern - When BMAD is detected via .bmad-core/install-manifest.yaml,
# automatically enable the voice plugin to provide seamless multi-agent voice support.
# This avoids requiring manual plugin activation after BMAD installation.

# @function auto_enable_if_bmad_detected
# @intent Automatically enable BMAD voice plugin when BMAD framework is detected
# @why Provide seamless integration - users shouldn't need to manually enable voice mapping
# @param None
# @returns None
# @exitcode 0=auto-enabled, 1=not enabled (already enabled or BMAD not detected)
# @sideeffects Creates enabled flag file, creates plugin directory
# @edgecases Only auto-enables if plugin not already enabled, silent operation
# @calledby get_agent_voice
# @calls mkdir, touch
auto_enable_if_bmad_detected() {
    # Check if BMAD is installed
    if [[ -f ".bmad-core/install-manifest.yaml" ]] && [[ ! -f "$ENABLED_FLAG" ]]; then
        # BMAD detected but plugin not enabled - enable it silently
        mkdir -p "$PLUGIN_DIR"
        touch "$ENABLED_FLAG"
        return 0
    fi
    return 1
}

# @function get_agent_voice
# @intent Retrieve TTS voice assigned to specific BMAD agent
# @why Each BMAD agent needs unique voice for multi-agent conversation differentiation
# @param $1 {string} agent_id - BMAD agent identifier (pm, dev, qa, architect, etc.)
# @returns Echoes voice name to stdout, empty string if plugin disabled or agent not found
# @exitcode Always 0
# @sideeffects May auto-enable plugin if BMAD detected
# @edgecases Returns empty string if plugin disabled/missing, parses markdown table syntax
# @calledby bmad-tts-injector.sh, play-tts.sh when BMAD agent is active
# @calls auto_enable_if_bmad_detected, grep, awk, sed
get_agent_voice() {
    local agent_id="$1"

    # Auto-enable if BMAD is detected
    auto_enable_if_bmad_detected

    if [[ ! -f "$ENABLED_FLAG" ]]; then
        echo ""  # Plugin disabled
        return
    fi

    if [[ ! -f "$PLUGIN_FILE" ]]; then
        echo ""  # Plugin file missing
        return
    fi

    # Extract voice from markdown table
    local voice=$(grep "^| $agent_id " "$PLUGIN_FILE" | \
                  awk -F'|' '{print $4}' | \
                  sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

    echo "$voice"
}

# @function get_agent_personality
# @intent Retrieve TTS personality assigned to specific BMAD agent
# @why Agents may have distinct speaking styles (friendly, professional, energetic, etc.)
# @param $1 {string} agent_id - BMAD agent identifier
# @returns Echoes personality name to stdout, empty string if not found
# @exitcode Always 0
# @sideeffects None
# @edgecases Returns empty string if plugin file missing, parses column 5 of markdown table
# @calledby bmad-tts-injector.sh for personality-aware voice synthesis
# @calls grep, awk, sed
get_agent_personality() {
    local agent_id="$1"

    if [[ ! -f "$PLUGIN_FILE" ]]; then
        echo ""
        return
    fi

    local personality=$(grep "^| $agent_id " "$PLUGIN_FILE" | \
                       awk -F'|' '{print $5}' | \
                       sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

    echo "$personality"
}

# @function is_plugin_enabled
# @intent Check if BMAD voice plugin is currently enabled
# @why Allow conditional logic based on plugin state
# @param None
# @returns Echoes "true" or "false" to stdout
# @exitcode Always 0
# @sideeffects None
# @edgecases None
# @calledby show_status, enable_plugin, disable_plugin
# @calls None (file existence check)
is_plugin_enabled() {
    [[ -f "$ENABLED_FLAG" ]] && echo "true" || echo "false"
}

# @function enable_plugin
# @intent Enable BMAD voice plugin and backup current voice settings
# @why Allow users to switch to per-agent voices while preserving original configuration
# @param None
# @returns None
# @exitcode Always 0
# @sideeffects Creates flag file, backs up current voice/personality/sentiment to .bmad-previous-settings
# @sideeffects Creates activation-instructions file for BMAD agents, calls bmad-tts-injector.sh
# @edgecases Handles missing settings files gracefully with defaults
# @calledby Main command dispatcher with "enable" argument
# @calls mkdir, cat, source, list_mappings, bmad-tts-injector.sh
enable_plugin() {
    mkdir -p "$PLUGIN_DIR"

    # Save current settings before enabling
    BACKUP_FILE="$PLUGIN_DIR/.bmad-previous-settings"

    # Save current voice
    if [[ -f ".claude/tts-voice.txt" ]]; then
        CURRENT_VOICE=$(cat .claude/tts-voice.txt 2>/dev/null)
    elif [[ -f "$HOME/.claude/tts-voice.txt" ]]; then
        CURRENT_VOICE=$(cat "$HOME/.claude/tts-voice.txt" 2>/dev/null)
    else
        CURRENT_VOICE="Aria"
    fi

    # Save current personality
    if [[ -f ".claude/tts-personality.txt" ]]; then
        CURRENT_PERSONALITY=$(cat .claude/tts-personality.txt 2>/dev/null)
    elif [[ -f "$HOME/.claude/tts-personality.txt" ]]; then
        CURRENT_PERSONALITY=$(cat "$HOME/.claude/tts-personality.txt" 2>/dev/null)
    else
        CURRENT_PERSONALITY="normal"
    fi

    # Save current sentiment
    if [[ -f ".claude/tts-sentiment.txt" ]]; then
        CURRENT_SENTIMENT=$(cat .claude/tts-sentiment.txt 2>/dev/null)
    elif [[ -f "$HOME/.claude/tts-sentiment.txt" ]]; then
        CURRENT_SENTIMENT=$(cat "$HOME/.claude/tts-sentiment.txt" 2>/dev/null)
    else
        CURRENT_SENTIMENT=""
    fi

    # Write backup
    cat > "$BACKUP_FILE" <<EOF
VOICE=$CURRENT_VOICE
PERSONALITY=$CURRENT_PERSONALITY
SENTIMENT=$CURRENT_SENTIMENT
EOF

    touch "$ENABLED_FLAG"

    # Create activation-instructions file for BMAD agents
    ACTIVATION_FILE=".claude/activation-instructions"
    if [[ ! -f "$ACTIVATION_FILE" ]]; then
        cat > "$ACTIVATION_FILE" <<'ACTIVATION_EOF'
# BMAD Agent Activation Instructions

When a BMAD agent activates, follow these steps EXACTLY:

## STEP 3.5a: Create BMAD Context File (CRITICAL)

**IMMEDIATELY after agent identification, create the context file:**

```bash
echo "$AGENT_ID" > .bmad-agent-context
```

Where `$AGENT_ID` is one of:
- `pm` (Product Manager)
- `dev` (Developer)
- `qa` (QA)
- `architect` (Architect)
- `po` (Product Owner)
- `analyst` (Analyst)
- `sm` (Scrum Master)
- `ux-expert` (UX Expert)
- `bmad-master` (BMAD Master)
- `bmad-orchestrator` (Orchestrator)

**Example:**
```bash
# For Product Manager agent
echo "pm" > .bmad-agent-context
```

This file allows AgentVibes to:
1. Detect which BMAD agent is active
2. Look up the correct voice mapping
3. Automatically speak questions using the agent's assigned voice

## STEP 10: Clean Up on Exit

**Before exiting the agent, remove the context file:**

```bash
rm -f .bmad-agent-context
```

This ensures voice switching only happens when an agent is active.

## Why This Matters

Without the `.bmad-agent-context` file:
- AgentVibes cannot detect which agent is active
- Questions won't be spoken automatically
- Voice switching won't work
- The BMAD voice plugin becomes non-functional

**This is MANDATORY for BMAD voice integration to work!**
ACTIVATION_EOF
        echo "📝 Created activation instructions: $ACTIVATION_FILE"
    fi

    echo "✅ BMAD voice plugin enabled"
    echo "💾 Previous settings backed up:"
    echo "   Voice: $CURRENT_VOICE"
    echo "   Personality: $CURRENT_PERSONALITY"
    [[ -n "$CURRENT_SENTIMENT" ]] && echo "   Sentiment: $CURRENT_SENTIMENT"
    echo ""
    list_mappings

    # Automatically inject TTS into BMAD agents
    echo ""
    echo "🎤 Automatically enabling TTS for BMAD agents..."
    echo ""

    # Get the directory where this script is located
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

    # Check if bmad-tts-injector.sh exists
    if [[ -f "$SCRIPT_DIR/bmad-tts-injector.sh" ]]; then
        # Run the TTS injector
        "$SCRIPT_DIR/bmad-tts-injector.sh" enable
    else
        echo "⚠️  TTS injector not found at: $SCRIPT_DIR/bmad-tts-injector.sh"
        echo "   You can manually enable TTS with: /agent-vibes:bmad-tts enable"
    fi
}

# @function disable_plugin
# @intent Disable BMAD voice plugin and restore previous voice settings
# @why Allow users to return to single-voice mode with their original configuration
# @param None
# @returns None
# @exitcode Always 0
# @sideeffects Removes flag file, restores settings from backup, calls bmad-tts-injector.sh disable
# @edgecases Handles missing backup file gracefully, warns user if no backup exists
# @calledby Main command dispatcher with "disable" argument
# @calls source, rm, echo, bmad-tts-injector.sh
disable_plugin() {
    BACKUP_FILE="$PLUGIN_DIR/.bmad-previous-settings"

    # Check if we have a backup to restore
    if [[ -f "$BACKUP_FILE" ]]; then
        source "$BACKUP_FILE"

        echo "❌ BMAD voice plugin disabled"
        echo "🔄 Restoring previous settings:"
        echo "   Voice: $VOICE"
        echo "   Personality: $PERSONALITY"
        [[ -n "$SENTIMENT" ]] && echo "   Sentiment: $SENTIMENT"

        # Restore voice
        if [[ -n "$VOICE" ]]; then
            echo "$VOICE" > .claude/tts-voice.txt 2>/dev/null || echo "$VOICE" > "$HOME/.claude/tts-voice.txt"
        fi

        # Restore personality
        if [[ -n "$PERSONALITY" ]] && [[ "$PERSONALITY" != "normal" ]]; then
            echo "$PERSONALITY" > .claude/tts-personality.txt 2>/dev/null || echo "$PERSONALITY" > "$HOME/.claude/tts-personality.txt"
        fi

        # Restore sentiment
        if [[ -n "$SENTIMENT" ]]; then
            echo "$SENTIMENT" > .claude/tts-sentiment.txt 2>/dev/null || echo "$SENTIMENT" > "$HOME/.claude/tts-sentiment.txt"
        fi

        # Clean up backup
        rm -f "$BACKUP_FILE"
    else
        echo "❌ BMAD voice plugin disabled"
        echo "⚠️  No previous settings found to restore"
        echo "AgentVibes will use current voice/personality settings"
    fi

    rm -f "$ENABLED_FLAG"

    # Automatically remove TTS from BMAD agents
    echo ""
    echo "🔇 Automatically disabling TTS for BMAD agents..."
    echo ""

    # Get the directory where this script is located
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

    # Check if bmad-tts-injector.sh exists
    if [[ -f "$SCRIPT_DIR/bmad-tts-injector.sh" ]]; then
        # Run the TTS injector disable
        "$SCRIPT_DIR/bmad-tts-injector.sh" disable
    else
        echo "⚠️  TTS injector not found"
        echo "   You can manually disable TTS with: /agent-vibes:bmad-tts disable"
    fi
}

# @function list_mappings
# @intent Display all BMAD agent-to-voice mappings in readable format
# @why Help users see which voice is assigned to each agent
# @param None
# @returns None
# @exitcode 0=success, 1=plugin file not found
# @sideeffects Writes formatted output to stdout
# @edgecases Parses markdown table format, skips header and separator rows
# @calledby enable_plugin, show_status, main command dispatcher with "list"
# @calls grep, sed, echo
list_mappings() {
    if [[ ! -f "$PLUGIN_FILE" ]]; then
        echo "❌ Plugin file not found: $PLUGIN_FILE"
        return 1
    fi

    echo "📊 BMAD Agent Voice Mappings:"
    echo ""

    grep "^| " "$PLUGIN_FILE" | grep -v "Agent ID" | grep -v "^|---" | \
    while IFS='|' read -r _ agent_id name voice personality _; do
        agent_id=$(echo "$agent_id" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        name=$(echo "$name" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        voice=$(echo "$voice" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        personality=$(echo "$personality" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

        [[ -n "$agent_id" ]] && echo "   $agent_id → $voice [$personality]"
    done
}

# @function set_agent_voice
# @intent Update voice and personality mapping for specific BMAD agent
# @why Allow customization of agent voices to user preferences
# @param $1 {string} agent_id - BMAD agent identifier
# @param $2 {string} voice - New voice name
# @param $3 {string} personality - New personality (optional, defaults to "normal")
# @returns None
# @exitcode 0=success, 1=plugin file not found or agent not found
# @sideeffects Modifies plugin file, creates .bak backup
# @edgecases Validates agent exists before updating
# @calledby Main command dispatcher with "set" argument
# @calls grep, sed
set_agent_voice() {
    local agent_id="$1"
    local voice="$2"
    local personality="${3:-normal}"

    if [[ ! -f "$PLUGIN_FILE" ]]; then
        echo "❌ Plugin file not found: $PLUGIN_FILE"
        return 1
    fi

    # Check if agent exists
    if ! grep -q "^| $agent_id " "$PLUGIN_FILE"; then
        echo "❌ Agent '$agent_id' not found in plugin"
        return 1
    fi

    # Update the voice and personality in the table
    sed -i.bak "s/^| $agent_id |.*| .* | .* |$/| $agent_id | $(grep "^| $agent_id " "$PLUGIN_FILE" | awk -F'|' '{print $3}') | $voice | $personality |/" "$PLUGIN_FILE"

    echo "✅ Updated $agent_id → $voice [$personality]"
}

# @function show_status
# @intent Display plugin status, BMAD detection, and current voice mappings
# @why Provide comprehensive overview of plugin state for troubleshooting
# @param None
# @returns None
# @exitcode Always 0
# @sideeffects Writes status information to stdout
# @edgecases Checks for BMAD installation via manifest file
# @calledby Main command dispatcher with "status" argument
# @calls is_plugin_enabled, list_mappings
show_status() {
    # Check for BMAD installation
    local bmad_installed="false"
    if [[ -f ".bmad-core/install-manifest.yaml" ]]; then
        bmad_installed="true"
    fi

    if [[ $(is_plugin_enabled) == "true" ]]; then
        echo "✅ BMAD voice plugin: ENABLED"
        if [[ "$bmad_installed" == "true" ]]; then
            echo "🔍 BMAD detected: Auto-enabled"
        fi
    else
        echo "❌ BMAD voice plugin: DISABLED"
        if [[ "$bmad_installed" == "true" ]]; then
            echo "⚠️  BMAD detected but plugin disabled (enable with: /agent-vibes-bmad enable)"
        fi
    fi
    echo ""
    list_mappings
}

# @function edit_plugin
# @intent Open plugin configuration file for manual editing
# @why Allow advanced users to modify voice mappings directly
# @param None
# @returns None
# @exitcode 0=success, 1=plugin file not found
# @sideeffects Displays file path and instructions
# @edgecases Does not actually open editor, just provides guidance
# @calledby Main command dispatcher with "edit" argument
# @calls echo
edit_plugin() {
    if [[ ! -f "$PLUGIN_FILE" ]]; then
        echo "❌ Plugin file not found: $PLUGIN_FILE"
        return 1
    fi

    echo "Opening $PLUGIN_FILE for editing..."
    echo "Edit the markdown table to change voice mappings"
}

# Main command dispatcher
case "${1:-help}" in
    enable)
        enable_plugin
        ;;
    disable)
        disable_plugin
        ;;
    status)
        show_status
        ;;
    list)
        list_mappings
        ;;
    set)
        if [[ -z "$2" ]] || [[ -z "$3" ]]; then
            echo "Usage: bmad-voice-manager.sh set <agent-id> <voice> [personality]"
            exit 1
        fi
        set_agent_voice "$2" "$3" "$4"
        ;;
    get-voice)
        get_agent_voice "$2"
        ;;
    get-personality)
        get_agent_personality "$2"
        ;;
    edit)
        edit_plugin
        ;;
    *)
        echo "Usage: bmad-voice-manager.sh {enable|disable|status|list|set|get-voice|get-personality|edit}"
        echo ""
        echo "Commands:"
        echo "  enable              Enable BMAD voice plugin"
        echo "  disable             Disable BMAD voice plugin"
        echo "  status              Show plugin status and mappings"
        echo "  list                List all agent voice mappings"
        echo "  set <id> <voice>    Set voice for agent"
        echo "  get-voice <id>      Get voice for agent"
        echo "  get-personality <id> Get personality for agent"
        echo "  edit                Edit plugin configuration"
        exit 1
        ;;
esac

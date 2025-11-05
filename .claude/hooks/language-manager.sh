#!/bin/bash
#
# File: .claude/hooks/language-manager.sh
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
# express or implied. Use at your own risk. See the Apache License for details.
#
# ---
#
# @fileoverview Language Manager - Manages multilingual TTS with 30+ language support
# @context Enables TTS in multiple languages with provider-specific voice recommendations (ElevenLabs multilingual vs Piper native)
# @architecture Dual-map system: ELEVENLABS_VOICES and PIPER_VOICES for provider-aware voice selection
# @dependencies provider-manager.sh for active provider detection, .claude/tts-language.txt for state
# @entrypoints Called by /agent-vibes:language commands, play-tts-*.sh for voice resolution
# @patterns Provider abstraction, language-to-voice mapping, backward compatibility with legacy LANGUAGE_VOICES
# @related play-tts-elevenlabs.sh, play-tts-piper.sh, provider-manager.sh, learn-manager.sh

# Determine target .claude directory based on context
# Priority:
# 1. CLAUDE_PROJECT_DIR env var (set by MCP for project-specific settings)
# 2. Script location (for direct slash command usage)
# 3. Global ~/.claude (fallback)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -n "$CLAUDE_PROJECT_DIR" ]] && [[ -d "$CLAUDE_PROJECT_DIR/.claude" ]]; then
  # MCP context: Use the project directory where MCP was invoked
  CLAUDE_DIR="$CLAUDE_PROJECT_DIR/.claude"
else
  # Direct usage context: Use script location
  CLAUDE_DIR="$(cd "$SCRIPT_DIR/.." 2>/dev/null && pwd)"

  # If script is in global ~/.claude, use that
  if [[ "$CLAUDE_DIR" == "$HOME/.claude" ]]; then
    CLAUDE_DIR="$HOME/.claude"
  elif [[ ! -d "$CLAUDE_DIR" ]]; then
    # Fallback to global if directory doesn't exist
    CLAUDE_DIR="$HOME/.claude"
  fi
fi

LANGUAGE_FILE="$CLAUDE_DIR/tts-language.txt"
mkdir -p "$CLAUDE_DIR"

# Source provider manager to detect active provider
source "$SCRIPT_DIR/provider-manager.sh" 2>/dev/null || true

# Language to ElevenLabs multilingual voice mapping
declare -A ELEVENLABS_VOICES=(
    ["spanish"]="Antoni"
    ["french"]="Rachel"
    ["german"]="Domi"
    ["italian"]="Bella"
    ["portuguese"]="Matilda"
    ["chinese"]="Antoni"
    ["japanese"]="Antoni"
    ["korean"]="Antoni"
    ["russian"]="Domi"
    ["polish"]="Antoni"
    ["dutch"]="Rachel"
    ["turkish"]="Antoni"
    ["arabic"]="Antoni"
    ["hindi"]="Antoni"
    ["swedish"]="Rachel"
    ["danish"]="Rachel"
    ["norwegian"]="Rachel"
    ["finnish"]="Rachel"
    ["czech"]="Domi"
    ["romanian"]="Rachel"
    ["ukrainian"]="Domi"
    ["greek"]="Antoni"
    ["bulgarian"]="Domi"
    ["croatian"]="Domi"
    ["slovak"]="Domi"
)

# Language to Piper voice model mapping
declare -A PIPER_VOICES=(
    ["spanish"]="es_ES-davefx-medium"
    ["french"]="fr_FR-siwis-medium"
    ["german"]="de_DE-thorsten-medium"
    ["italian"]="it_IT-riccardo-x_low"
    ["portuguese"]="pt_BR-faber-medium"
    ["chinese"]="zh_CN-huayan-medium"
    ["japanese"]="ja_JP-hikari-medium"
    ["korean"]="ko_KR-eunyoung-medium"
    ["russian"]="ru_RU-dmitri-medium"
    ["polish"]="pl_PL-darkman-medium"
    ["dutch"]="nl_NL-rdh-medium"
    ["turkish"]="tr_TR-dfki-medium"
    ["arabic"]="ar_JO-kareem-medium"
    ["hindi"]="hi_IN-amitabh-medium"
    ["swedish"]="sv_SE-nst-medium"
    ["danish"]="da_DK-talesyntese-medium"
    ["norwegian"]="no_NO-talesyntese-medium"
    ["finnish"]="fi_FI-harri-medium"
    ["czech"]="cs_CZ-jirka-medium"
    ["romanian"]="ro_RO-mihai-medium"
    ["ukrainian"]="uk_UA-lada-x_low"
    ["greek"]="el_GR-rapunzelina-low"
    ["bulgarian"]="bg_BG-valentin-medium"
    ["croatian"]="hr_HR-gorana-medium"
    ["slovak"]="sk_SK-lili-medium"
)

# Backward compatibility: Keep LANGUAGE_VOICES for existing code
declare -A LANGUAGE_VOICES=(
    ["spanish"]="Antoni"
    ["french"]="Rachel"
    ["german"]="Domi"
    ["italian"]="Bella"
    ["portuguese"]="Matilda"
    ["chinese"]="Antoni"
    ["japanese"]="Antoni"
    ["korean"]="Antoni"
    ["russian"]="Domi"
    ["polish"]="Antoni"
    ["dutch"]="Rachel"
    ["turkish"]="Antoni"
    ["arabic"]="Antoni"
    ["hindi"]="Antoni"
    ["swedish"]="Rachel"
    ["danish"]="Rachel"
    ["norwegian"]="Rachel"
    ["finnish"]="Rachel"
    ["czech"]="Domi"
    ["romanian"]="Rachel"
    ["ukrainian"]="Domi"
    ["greek"]="Antoni"
    ["bulgarian"]="Domi"
    ["croatian"]="Domi"
    ["slovak"]="Domi"
)

# Supported languages list
SUPPORTED_LANGUAGES="spanish, french, german, italian, portuguese, chinese, japanese, korean, polish, dutch, turkish, russian, arabic, hindi, swedish, danish, norwegian, finnish, czech, romanian, ukrainian, greek, bulgarian, croatian, slovak"

# Function to set language
set_language() {
    local lang="$1"

    # Convert to lowercase
    lang=$(echo "$lang" | tr '[:upper:]' '[:lower:]')

    # Handle reset/english
    if [[ "$lang" == "reset" ]] || [[ "$lang" == "english" ]] || [[ "$lang" == "en" ]]; then
        if [[ -f "$LANGUAGE_FILE" ]]; then
            rm "$LANGUAGE_FILE"
            echo "✓ Language reset to English (default)"
        else
            echo "Already using English (default)"
        fi
        return 0
    fi

    # Check if language is supported
    if [[ ! " ${!LANGUAGE_VOICES[@]} " =~ " ${lang} " ]]; then
        echo "❌ Language '$lang' not supported"
        echo ""
        echo "Supported languages:"
        echo "$SUPPORTED_LANGUAGES"
        return 1
    fi

    # Save language
    echo "$lang" > "$LANGUAGE_FILE"

    # Detect active provider and get recommended voice
    local provider=""
    if [[ -f "$CLAUDE_DIR/tts-provider.txt" ]]; then
        provider=$(cat "$CLAUDE_DIR/tts-provider.txt")
    elif [[ -f "$HOME/.claude/tts-provider.txt" ]]; then
        provider=$(cat "$HOME/.claude/tts-provider.txt")
    else
        provider="elevenlabs"
    fi

    local recommended_voice=$(get_voice_for_language "$lang" "$provider")

    # Fallback to old mapping if provider-aware function returns empty
    if [[ -z "$recommended_voice" ]]; then
        recommended_voice="${LANGUAGE_VOICES[$lang]}"
    fi

    echo "✓ Language set to: $lang"
    echo "📢 Recommended voice for $provider TTS: $recommended_voice"
    echo ""
    echo "TTS will now speak in $lang."
    echo "Switch voice with: /agent-vibes:switch \"$recommended_voice\""
}

# Function to get current language
get_language() {
    if [[ -f "$LANGUAGE_FILE" ]]; then
        local lang=$(cat "$LANGUAGE_FILE")

        # Detect active provider
        local provider=""
        if [[ -f "$CLAUDE_DIR/tts-provider.txt" ]]; then
            provider=$(cat "$CLAUDE_DIR/tts-provider.txt")
        elif [[ -f "$HOME/.claude/tts-provider.txt" ]]; then
            provider=$(cat "$HOME/.claude/tts-provider.txt")
        else
            provider="elevenlabs"
        fi

        local recommended_voice=$(get_voice_for_language "$lang" "$provider")

        # Fallback to old mapping
        if [[ -z "$recommended_voice" ]]; then
            recommended_voice="${LANGUAGE_VOICES[$lang]}"
        fi

        echo "Current language: $lang"
        echo "Recommended voice ($provider): $recommended_voice"
    else
        echo "Current language: english (default)"
        echo "No multilingual voice required"
    fi
}

# Function to get language for use in other scripts
get_language_code() {
    if [[ -f "$LANGUAGE_FILE" ]]; then
        cat "$LANGUAGE_FILE"
    else
        echo "english"
    fi
}

# Function to check if current voice supports language
is_voice_multilingual() {
    local voice="$1"

    # List of multilingual voices
    local multilingual_voices=("Antoni" "Rachel" "Domi" "Bella" "Charlotte" "Matilda")

    for mv in "${multilingual_voices[@]}"; do
        if [[ "$voice" == "$mv" ]]; then
            return 0
        fi
    done

    return 1
}

# Function to get best voice for current language
get_best_voice_for_language() {
    local lang=$(get_language_code)

    if [[ "$lang" == "english" ]]; then
        # No specific multilingual voice needed for English
        echo ""
        return
    fi

    # Return recommended voice for language
    echo "${LANGUAGE_VOICES[$lang]}"
}

# Function to get voice for a specific language and provider
# Usage: get_voice_for_language <language> [provider]
# Provider: "elevenlabs" or "piper" (auto-detected if not provided)
get_voice_for_language() {
    local language="$1"
    local provider="${2:-}"

    # Convert to lowercase
    language=$(echo "$language" | tr '[:upper:]' '[:lower:]')

    # Auto-detect provider if not specified
    if [[ -z "$provider" ]]; then
        if command -v get_active_provider &>/dev/null; then
            provider=$(get_active_provider 2>/dev/null)
        else
            # Fallback to checking provider file directly
            # Try current directory first, then search up the tree
            local search_dir="$PWD"
            local found=false

            while [[ "$search_dir" != "/" ]]; do
                if [[ -f "$search_dir/.claude/tts-provider.txt" ]]; then
                    provider=$(cat "$search_dir/.claude/tts-provider.txt")
                    found=true
                    break
                fi
                search_dir=$(dirname "$search_dir")
            done

            # If not found in project tree, check global
            if [[ "$found" = false ]]; then
                if [[ -f "$HOME/.claude/tts-provider.txt" ]]; then
                    provider=$(cat "$HOME/.claude/tts-provider.txt")
                else
                    provider="elevenlabs"  # Default
                fi
            fi
        fi
    fi

    # Return appropriate voice based on provider
    case "$provider" in
        piper)
            echo "${PIPER_VOICES[$language]:-}"
            ;;
        elevenlabs)
            echo "${ELEVENLABS_VOICES[$language]:-}"
            ;;
        *)
            echo "${ELEVENLABS_VOICES[$language]:-}"
            ;;
    esac
}

# Main command handler - only run if script is executed directly, not sourced
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-}" in
        set)
            if [[ -z "$2" ]]; then
                echo "Usage: language-manager.sh set <language>"
                exit 1
            fi
            set_language "$2"
            ;;
        get)
            get_language
            ;;
        code)
            get_language_code
            ;;
        check-voice)
            if [[ -z "$2" ]]; then
                echo "Usage: language-manager.sh check-voice <voice-name>"
                exit 1
            fi
            if is_voice_multilingual "$2"; then
                echo "yes"
            else
                echo "no"
            fi
            ;;
        best-voice)
            get_best_voice_for_language
            ;;
        voice-for-language)
            if [[ -z "$2" ]]; then
                echo "Usage: language-manager.sh voice-for-language <language> [provider]"
                exit 1
            fi
            get_voice_for_language "$2" "$3"
            ;;
        list)
            echo "Supported languages and recommended voices:"
            echo ""
            for lang in "${!LANGUAGE_VOICES[@]}"; do
                printf "%-15s → %s\n" "$lang" "${LANGUAGE_VOICES[$lang]}"
            done | sort
            ;;
        *)
            echo "AgentVibes Language Manager"
            echo ""
            echo "Usage:"
            echo "  language-manager.sh set <language>                    Set language"
            echo "  language-manager.sh get                               Get current language"
            echo "  language-manager.sh code                              Get language code only"
            echo "  language-manager.sh check-voice <name>                Check if voice is multilingual"
            echo "  language-manager.sh best-voice                        Get best voice for current language"
            echo "  language-manager.sh voice-for-language <lang> [prov] Get voice for language & provider"
            echo "  language-manager.sh list                              List all supported languages"
            exit 1
            ;;
    esac
fi

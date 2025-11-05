#!/bin/bash
#
# File: .claude/hooks/learn-manager.sh
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
# @fileoverview Language Learning Mode Manager - Enables dual-language TTS for immersive learning
# @context Speaks responses in both main language (English) and target language (Spanish, French, etc.) for language practice
# @architecture Manages main/target language pairs with voice mappings, auto-configures recommended voices per language
# @dependencies play-tts.sh (dual invocation), language-manager.sh (voice recommendations), .claude/tts-*.txt state files
# @entrypoints Called by /agent-vibes:learn commands to enable/disable learning mode
# @patterns Dual-voice orchestration, auto-configuration, greeting on activation, provider-aware voice selection
# @related language-manager.sh, play-tts.sh, .claude/tts-learn-mode.txt, .claude/tts-target-language.txt

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/../.."

# Configuration files (project-local first, then global fallback)
MAIN_LANG_FILE="$PROJECT_DIR/.claude/tts-main-language.txt"
TARGET_LANG_FILE="$PROJECT_DIR/.claude/tts-target-language.txt"
TARGET_VOICE_FILE="$PROJECT_DIR/.claude/tts-target-voice.txt"
LEARN_MODE_FILE="$PROJECT_DIR/.claude/tts-learn-mode.txt"

GLOBAL_MAIN_LANG_FILE="$HOME/.claude/tts-main-language.txt"
GLOBAL_TARGET_LANG_FILE="$HOME/.claude/tts-target-language.txt"
GLOBAL_TARGET_VOICE_FILE="$HOME/.claude/tts-target-voice.txt"
GLOBAL_LEARN_MODE_FILE="$HOME/.claude/tts-learn-mode.txt"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get main language
get_main_language() {
    if [[ -f "$MAIN_LANG_FILE" ]]; then
        cat "$MAIN_LANG_FILE"
    elif [[ -f "$GLOBAL_MAIN_LANG_FILE" ]]; then
        cat "$GLOBAL_MAIN_LANG_FILE"
    else
        echo "english"
    fi
}

# Set main language
set_main_language() {
    local language="$1"
    if [[ -z "$language" ]]; then
        echo -e "${YELLOW}Usage: learn-manager.sh set-main-language <language>${NC}"
        exit 1
    fi

    mkdir -p "$PROJECT_DIR/.claude"
    echo "$language" > "$MAIN_LANG_FILE"
    echo -e "${GREEN}✓${NC} Main language set to: $language"
}

# Get target language
get_target_language() {
    if [[ -f "$TARGET_LANG_FILE" ]]; then
        cat "$TARGET_LANG_FILE"
    elif [[ -f "$GLOBAL_TARGET_LANG_FILE" ]]; then
        cat "$GLOBAL_TARGET_LANG_FILE"
    else
        echo ""
    fi
}

# Get greeting message for a language
get_greeting_for_language() {
    local language="$1"

    case "${language,,}" in
        spanish|español)
            echo "¡Hola! Soy tu profesor de español. ¡Vamos a aprender juntos!"
            ;;
        french|français)
            echo "Bonjour! Je suis votre professeur de français. Apprenons ensemble!"
            ;;
        german|deutsch)
            echo "Hallo! Ich bin dein Deutschlehrer. Lass uns zusammen lernen!"
            ;;
        italian|italiano)
            echo "Ciao! Sono il tuo insegnante di italiano. Impariamo insieme!"
            ;;
        portuguese|português)
            echo "Olá! Sou seu professor de português. Vamos aprender juntos!"
            ;;
        chinese|中文|mandarin)
            echo "你好！我是你的中文老师。让我们一起学习吧！"
            ;;
        japanese|日本語)
            echo "こんにちは！私はあなたの日本語の先生です。一緒に勉強しましょう！"
            ;;
        korean|한국어)
            echo "안녕하세요! 저는 당신의 한국어 선생님입니다. 함께 배워봅시다!"
            ;;
        russian|русский)
            echo "Здравствуйте! Я ваш учитель русского языка. Давайте учиться вместе!"
            ;;
        arabic|العربية)
            echo "مرحبا! أنا معلمك للغة العربية. دعونا نتعلم معا!"
            ;;
        hindi|हिन्दी)
            echo "नमस्ते! मैं आपका हिंदी शिक्षक हूं। आइए साथ में सीखें!"
            ;;
        dutch|nederlands)
            echo "Hallo! Ik ben je Nederlandse leraar. Laten we samen leren!"
            ;;
        polish|polski)
            echo "Cześć! Jestem twoim nauczycielem polskiego. Uczmy się razem!"
            ;;
        turkish|türkçe)
            echo "Merhaba! Ben Türkçe öğretmeninizim. Birlikte öğrenelim!"
            ;;
        swedish|svenska)
            echo "Hej! Jag är din svenskalärare. Låt oss lära tillsammans!"
            ;;
        *)
            echo "Hello! I am your language teacher. Let's learn together!"
            ;;
    esac
}

# Set target language
set_target_language() {
    local language="$1"
    if [[ -z "$language" ]]; then
        echo -e "${YELLOW}Usage: learn-manager.sh set-target-language <language>${NC}"
        exit 1
    fi

    mkdir -p "$PROJECT_DIR/.claude"
    echo "$language" > "$TARGET_LANG_FILE"
    echo -e "${GREEN}✓${NC} Target language set to: $language"

    # Automatically set the recommended voice for this language
    local recommended_voice=$(get_recommended_voice_for_language "$language")
    if [[ -n "$recommended_voice" ]]; then
        echo "$recommended_voice" > "$TARGET_VOICE_FILE"
        echo -e "${GREEN}✓${NC} Target voice automatically set to: ${YELLOW}$recommended_voice${NC}"

        # Detect provider for display
        local provider=""
        if [[ -f "$PROJECT_DIR/.claude/tts-provider.txt" ]]; then
            provider=$(cat "$PROJECT_DIR/.claude/tts-provider.txt")
        elif [[ -f "$HOME/.claude/tts-provider.txt" ]]; then
            provider=$(cat "$HOME/.claude/tts-provider.txt")
        else
            provider="elevenlabs"
        fi
        echo -e "   (for ${GREEN}$provider${NC} TTS)"
        echo ""

        # Greet user in the target language with the target voice
        local greeting=$(get_greeting_for_language "$language")
        echo -e "${BLUE}🎓${NC} Your language teacher says:"

        # Check if we're using Piper and if the voice is available
        if [[ "$provider" == "piper" ]]; then
            # Quick check: does the voice file exist?
            local voice_dir="${HOME}/.claude/piper-voices"
            if [[ -f "${voice_dir}/${recommended_voice}.onnx" ]]; then
                # Voice exists, play greeting in background
                nohup "$SCRIPT_DIR/play-tts.sh" "$greeting" "$recommended_voice" >/dev/null 2>&1 &
            else
                echo -e "${YELLOW}   (Voice not yet downloaded - greeting will play after first download)${NC}"
            fi
        else
            # ElevenLabs - just play it in background
            nohup "$SCRIPT_DIR/play-tts.sh" "$greeting" "$recommended_voice" >/dev/null 2>&1 &
        fi
    else
        # Fallback to suggestion if auto-set failed
        suggest_voice_for_language "$language"
    fi
}

# Get recommended voice for a language (returns voice string, no output)
get_recommended_voice_for_language() {
    local language="$1"
    local recommended_voice=""
    local provider=""

    # Detect active provider
    if [[ -f "$PROJECT_DIR/.claude/tts-provider.txt" ]]; then
        provider=$(cat "$PROJECT_DIR/.claude/tts-provider.txt")
    elif [[ -f "$HOME/.claude/tts-provider.txt" ]]; then
        provider=$(cat "$HOME/.claude/tts-provider.txt")
    else
        provider="elevenlabs"  # Default
    fi

    # Source language manager and get provider-specific voice
    if [[ -f "$SCRIPT_DIR/language-manager.sh" ]]; then
        source "$SCRIPT_DIR/language-manager.sh" 2>/dev/null
        recommended_voice=$(get_voice_for_language "$language" "$provider" 2>/dev/null)
    fi

    # Fallback to hardcoded suggestions if function failed
    if [[ -z "$recommended_voice" ]]; then
        case "${language,,}" in
            spanish|español)
                recommended_voice=$([ "$provider" = "piper" ] && echo "es_ES-davefx-medium" || echo "Antoni")
                ;;
            french|français)
                recommended_voice=$([ "$provider" = "piper" ] && echo "fr_FR-siwis-medium" || echo "Rachel")
                ;;
            german|deutsch)
                recommended_voice=$([ "$provider" = "piper" ] && echo "de_DE-thorsten-medium" || echo "Domi")
                ;;
            italian|italiano)
                recommended_voice=$([ "$provider" = "piper" ] && echo "it_IT-riccardo-x_low" || echo "Bella")
                ;;
            portuguese|português)
                recommended_voice=$([ "$provider" = "piper" ] && echo "pt_BR-faber-medium" || echo "Matilda")
                ;;
            chinese|中文|mandarin)
                recommended_voice=$([ "$provider" = "piper" ] && echo "zh_CN-huayan-medium" || echo "Amy")
                ;;
            *)
                recommended_voice=$([ "$provider" = "piper" ] && echo "en_US-lessac-medium" || echo "Antoni")
                ;;
        esac
    fi

    echo "$recommended_voice"
}

# Suggest voice based on target language (displays suggestion message)
suggest_voice_for_language() {
    local language="$1"
    local suggested_voice=$(get_recommended_voice_for_language "$language")

    # Detect provider for display
    local provider=""
    if [[ -f "$PROJECT_DIR/.claude/tts-provider.txt" ]]; then
        provider=$(cat "$PROJECT_DIR/.claude/tts-provider.txt")
    elif [[ -f "$HOME/.claude/tts-provider.txt" ]]; then
        provider=$(cat "$HOME/.claude/tts-provider.txt")
    else
        provider="elevenlabs"
    fi

    echo ""
    echo -e "${BLUE}💡 Tip:${NC} For $language (using ${GREEN}$provider${NC} TTS), we recommend: ${YELLOW}$suggested_voice${NC}"
    echo -e "   Set it with: ${YELLOW}/agent-vibes:target-voice $suggested_voice${NC}"
}

# Get target voice
get_target_voice() {
    if [[ -f "$TARGET_VOICE_FILE" ]]; then
        cat "$TARGET_VOICE_FILE"
    elif [[ -f "$GLOBAL_TARGET_VOICE_FILE" ]]; then
        cat "$GLOBAL_TARGET_VOICE_FILE"
    else
        echo ""
    fi
}

# Set target voice
set_target_voice() {
    local voice="$1"
    if [[ -z "$voice" ]]; then
        echo -e "${YELLOW}Usage: learn-manager.sh set-target-voice <voice>${NC}"
        exit 1
    fi

    mkdir -p "$PROJECT_DIR/.claude"
    echo "$voice" > "$TARGET_VOICE_FILE"
    echo -e "${GREEN}✓${NC} Target voice set to: $voice"
}

# Check if learning mode is enabled
is_learn_mode_enabled() {
    if [[ -f "$LEARN_MODE_FILE" ]]; then
        local mode=$(cat "$LEARN_MODE_FILE")
        [[ "$mode" == "ON" ]]
    elif [[ -f "$GLOBAL_LEARN_MODE_FILE" ]]; then
        local mode=$(cat "$GLOBAL_LEARN_MODE_FILE")
        [[ "$mode" == "ON" ]]
    else
        return 1
    fi
}

# Enable learning mode
enable_learn_mode() {
    mkdir -p "$PROJECT_DIR/.claude"
    echo "ON" > "$LEARN_MODE_FILE"
    echo -e "${GREEN}✓${NC} Language learning mode: ${GREEN}ENABLED${NC}"
    echo ""

    # Auto-set target voice if target language is set but voice is not
    local target_lang=$(get_target_language)
    local target_voice=$(get_target_voice)
    local voice_was_set=false

    if [[ -n "$target_lang" ]] && [[ -z "$target_voice" ]]; then
        echo -e "${BLUE}ℹ${NC}  Auto-configuring voice for $target_lang..."
        local recommended_voice=$(get_recommended_voice_for_language "$target_lang")
        if [[ -n "$recommended_voice" ]]; then
            echo "$recommended_voice" > "$TARGET_VOICE_FILE"
            target_voice="$recommended_voice"
            echo -e "${GREEN}✓${NC} Target voice automatically set to: ${YELLOW}$recommended_voice${NC}"

            # Detect provider for display
            local provider=""
            if [[ -f "$PROJECT_DIR/.claude/tts-provider.txt" ]]; then
                provider=$(cat "$PROJECT_DIR/.claude/tts-provider.txt")
            elif [[ -f "$HOME/.claude/tts-provider.txt" ]]; then
                provider=$(cat "$HOME/.claude/tts-provider.txt")
            else
                provider="elevenlabs"
            fi
            echo -e "   (for ${GREEN}$provider${NC} TTS)"
            echo ""
            voice_was_set=true
        fi
    fi

    show_status

    # Greet user with language teacher if everything is configured
    if [[ -n "$target_lang" ]] && [[ -n "$target_voice" ]]; then
        echo ""
        local greeting=$(get_greeting_for_language "$target_lang")
        echo -e "${BLUE}🎓${NC} Your language teacher says:"

        # Detect provider
        local provider=""
        if [[ -f "$PROJECT_DIR/.claude/tts-provider.txt" ]]; then
            provider=$(cat "$PROJECT_DIR/.claude/tts-provider.txt")
        elif [[ -f "$HOME/.claude/tts-provider.txt" ]]; then
            provider=$(cat "$HOME/.claude/tts-provider.txt")
        else
            provider="elevenlabs"
        fi

        # Check if we're using Piper and if the voice is available
        if [[ "$provider" == "piper" ]]; then
            # Quick check: does the voice file exist?
            local voice_dir="${HOME}/.claude/piper-voices"
            if [[ -f "${voice_dir}/${target_voice}.onnx" ]]; then
                # Voice exists, play greeting in background
                nohup "$SCRIPT_DIR/play-tts.sh" "$greeting" "$target_voice" >/dev/null 2>&1 &
            else
                echo -e "${YELLOW}   (Voice not yet downloaded - greeting will play after first download)${NC}"
            fi
        else
            # ElevenLabs - just play it in background
            nohup "$SCRIPT_DIR/play-tts.sh" "$greeting" "$target_voice" >/dev/null 2>&1 &
        fi
    fi
}

# Disable learning mode
disable_learn_mode() {
    mkdir -p "$PROJECT_DIR/.claude"
    echo "OFF" > "$LEARN_MODE_FILE"
    echo -e "${GREEN}✓${NC} Language learning mode: ${YELLOW}DISABLED${NC}"
}

# Show learning mode status
show_status() {
    local main_lang=$(get_main_language)
    local target_lang=$(get_target_language)
    local target_voice=$(get_target_voice)
    local learn_mode="OFF"

    if is_learn_mode_enabled; then
        learn_mode="ON"
    fi

    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}   Language Learning Mode Status${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "  ${BLUE}Learning Mode:${NC}    $(if [[ "$learn_mode" == "ON" ]]; then echo -e "${GREEN}ENABLED${NC}"; else echo -e "${YELLOW}DISABLED${NC}"; fi)"
    echo -e "  ${BLUE}Main Language:${NC}    $main_lang"
    echo -e "  ${BLUE}Target Language:${NC}  ${target_lang:-"(not set)"}"
    echo -e "  ${BLUE}Target Voice:${NC}     ${target_voice:-"(not set)"}"
    echo ""

    if [[ "$learn_mode" == "ON" ]]; then
        if [[ -z "$target_lang" ]]; then
            echo -e "  ${YELLOW}⚠${NC}  Please set a target language: ${YELLOW}/agent-vibes:target <language>${NC}"
        fi
        if [[ -z "$target_voice" ]]; then
            echo -e "  ${YELLOW}⚠${NC}  Please set a target voice: ${YELLOW}/agent-vibes:target-voice <voice>${NC}"
        fi

        if [[ -n "$target_lang" ]] && [[ -n "$target_voice" ]]; then
            echo -e "  ${GREEN}✓${NC}  All set! TTS will speak in both languages."
            echo ""
            echo -e "  ${BLUE}How it works:${NC}"
            echo -e "    1. First: Speak in ${BLUE}$main_lang${NC} (your current voice)"
            echo -e "    2. Then: Speak in ${BLUE}$target_lang${NC} ($target_voice voice)"
        fi
    else
        echo -e "  ${BLUE}💡 Tip:${NC} Enable learning mode with: ${YELLOW}/agent-vibes:learn${NC}"
    fi

    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Main command handler
case "${1:-}" in
    get-main-language)
        get_main_language
        ;;
    set-main-language)
        set_main_language "$2"
        ;;
    get-target-language)
        get_target_language
        ;;
    set-target-language)
        set_target_language "$2"
        ;;
    get-target-voice)
        get_target_voice
        ;;
    set-target-voice)
        set_target_voice "$2"
        ;;
    is-enabled)
        if is_learn_mode_enabled; then
            echo "ON"
            exit 0
        else
            echo "OFF"
            exit 1
        fi
        ;;
    enable)
        enable_learn_mode
        ;;
    disable)
        disable_learn_mode
        ;;
    status)
        show_status
        ;;
    *)
        echo "Usage: learn-manager.sh {get-main-language|set-main-language|get-target-language|set-target-language|get-target-voice|set-target-voice|is-enabled|enable|disable|status}"
        exit 1
        ;;
esac

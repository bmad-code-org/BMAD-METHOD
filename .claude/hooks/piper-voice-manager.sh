#!/bin/bash
#
# File: .claude/hooks/piper-voice-manager.sh
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
# @fileoverview Piper Voice Model Management - Downloads, caches, and validates Piper ONNX voice models
# @context Voice model lifecycle management for free offline Piper TTS provider
# @architecture HuggingFace repository integration with local caching, global storage for voice models
# @dependencies curl (downloads), piper binary (TTS synthesis)
# @entrypoints Sourced by play-tts-piper.sh, piper-download-voices.sh, and provider management commands
# @patterns HuggingFace model repository integration, file-based caching (~25MB per voice), global storage
# @related play-tts-piper.sh, piper-download-voices.sh, provider-manager.sh, GitHub Issue #25
#

# Base URL for Piper voice models on HuggingFace
PIPER_VOICES_BASE_URL="https://huggingface.co/rhasspy/piper-voices/resolve/main"

# AI NOTE: Voice storage precedence order:
# 1. PIPER_VOICES_DIR environment variable (highest priority)
# 2. Project-local .claude/piper-voices-dir.txt
# 3. Directory tree search for .claude/piper-voices-dir.txt
# 4. Global ~/.claude/piper-voices-dir.txt
# 5. Default ~/.claude/piper-voices (fallback)
# This allows per-project voice isolation while defaulting to shared global storage.

# @function get_voice_storage_dir
# @intent Determine directory for storing Piper voice models with precedence chain
# @why Voice models are large (~25MB each) and should be shared globally by default, but allow per-project overrides
# @param None
# @returns Echoes path to voice storage directory
# @exitcode Always 0
# @sideeffects Creates directory if it doesn't exist
# @edgecases Searches up directory tree for .claude/ folder, supports custom paths via env var or config files
# @calledby All voice management functions (verify_voice, get_voice_path, download_voice, list_downloaded_voices)
# @calls mkdir, cat, dirname
get_voice_storage_dir() {
  local voice_dir

  # Check for custom path in environment or config file
  if [[ -n "$PIPER_VOICES_DIR" ]]; then
    voice_dir="$PIPER_VOICES_DIR"
  else
    # Check for config file (project-local first, then global)
    local config_file
    if [[ -n "$CLAUDE_PROJECT_DIR" ]] && [[ -f "$CLAUDE_PROJECT_DIR/.claude/piper-voices-dir.txt" ]]; then
      config_file="$CLAUDE_PROJECT_DIR/.claude/piper-voices-dir.txt"
    else
      # Search up directory tree for .claude/
      local current_dir="$PWD"
      while [[ "$current_dir" != "/" ]]; do
        if [[ -f "$current_dir/.claude/piper-voices-dir.txt" ]]; then
          config_file="$current_dir/.claude/piper-voices-dir.txt"
          break
        fi
        current_dir=$(dirname "$current_dir")
      done

      # Check global config
      if [[ -z "$config_file" ]] && [[ -f "$HOME/.claude/piper-voices-dir.txt" ]]; then
        config_file="$HOME/.claude/piper-voices-dir.txt"
      fi
    fi

    if [[ -n "$config_file" ]]; then
      voice_dir=$(cat "$config_file" | tr -d '[:space:]')
    fi
  fi

  # Fallback to default global storage
  if [[ -z "$voice_dir" ]]; then
    voice_dir="$HOME/.claude/piper-voices"
  fi

  mkdir -p "$voice_dir"
  echo "$voice_dir"
}

# @function verify_voice
# @intent Check if voice model files exist locally (both .onnx and .onnx.json)
# @why Avoid redundant downloads, detect missing models, ensure model integrity
# @param $1 {string} voice_name - Voice model name (e.g., en_US-lessac-medium)
# @returns None
# @exitcode 0=voice exists and complete, 1=voice missing or incomplete
# @sideeffects None (read-only check)
# @edgecases Requires both ONNX model and JSON config to return success
# @calledby download_voice, piper-download-voices.sh
# @calls get_voice_storage_dir
verify_voice() {
  local voice_name="$1"
  local voice_dir
  voice_dir=$(get_voice_storage_dir)

  local onnx_file="$voice_dir/${voice_name}.onnx"
  local json_file="$voice_dir/${voice_name}.onnx.json"

  [[ -f "$onnx_file" ]] && [[ -f "$json_file" ]]
}

# @function get_voice_path
# @intent Get absolute path to voice model ONNX file for Piper binary
# @why Piper binary requires full absolute path to model file, not just voice name
# @param $1 {string} voice_name - Voice model name
# @returns Echoes absolute path to .onnx file to stdout
# @exitcode 0=success, 1=voice not found
# @sideeffects Writes error message to stderr if voice not found
# @edgecases Returns error if voice not downloaded yet
# @calledby play-tts-piper.sh for TTS synthesis
# @calls get_voice_storage_dir
get_voice_path() {
  local voice_name="$1"
  local voice_dir
  voice_dir=$(get_voice_storage_dir)

  local onnx_file="$voice_dir/${voice_name}.onnx"

  if [[ ! -f "$onnx_file" ]]; then
    echo "❌ Voice model not found: $voice_name" >&2
    return 1
  fi

  echo "$onnx_file"
}

# AI NOTE: Voice name format is: lang_LOCALE-speaker-quality
# Example: en_US-lessac-medium
#   - lang: en (language code)
#   - LOCALE: US (locale/country code)
#   - speaker: lessac (speaker/voice name)
#   - quality: medium (model quality: low/medium/high)
# HuggingFace repository structure: {lang}/{lang}_{LOCALE}/{speaker}/{quality}/

# @function parse_voice_components
# @intent Extract language, locale, speaker, quality components from voice name
# @why HuggingFace uses structured directory paths based on these components
# @param $1 {string} voice_name - Voice name (e.g., en_US-lessac-medium)
# @returns None (sets global variables)
# @exitcode Always 0
# @sideeffects Sets global variables: LANG, LOCALE, SPEAKER, QUALITY
# @edgecases Expects specific format: lang_LOCALE-speaker-quality
# @calledby download_voice
# @calls None (pure string manipulation)
parse_voice_components() {
  local voice_name="$1"

  # Extract components from voice name
  # Format: en_US-lessac-medium
  #         lang_LOCALE-speaker-quality

  local lang_locale="${voice_name%%-*}"  # en_US
  local speaker_quality="${voice_name#*-}"  # lessac-medium

  LANG="${lang_locale%%_*}"  # en
  LOCALE="${lang_locale#*_}"  # US
  SPEAKER="${speaker_quality%%-*}"  # lessac
  QUALITY="${speaker_quality#*-}"  # medium
}

# @function download_voice
# @intent Download Piper voice model from HuggingFace repository
# @why Provide free offline TTS voices without requiring API keys
# @param $1 {string} voice_name - Voice model name (e.g., en_US-lessac-medium)
# @param $2 {string} lang_code - Language code (optional, inferred from voice_name, unused)
# @returns None
# @exitcode 0=success (already downloaded or newly downloaded), 1=download failed
# @sideeffects Downloads .onnx and .onnx.json files (~25MB total), removes partial downloads on failure
# @edgecases Handles network failures, validates file integrity (non-zero size), skips if already downloaded
# @calledby piper-download-voices.sh, manual voice download commands
# @calls parse_voice_components, verify_voice, get_voice_storage_dir, curl, rm
download_voice() {
  local voice_name="$1"
  local lang_code="${2:-}"

  local voice_dir
  voice_dir=$(get_voice_storage_dir)

  # Check if already downloaded
  if verify_voice "$voice_name"; then
    echo "✅ Voice already downloaded: $voice_name"
    return 0
  fi

  # Parse voice components
  parse_voice_components "$voice_name"

  # Construct download URLs
  # Path format: {language}/{language}_{locale}/{speaker}/{quality}/{speaker}-{quality}.onnx
  local model_path="${LANG}/${LANG}_${LOCALE}/${SPEAKER}/${QUALITY}/${voice_name}"
  local onnx_url="${PIPER_VOICES_BASE_URL}/${model_path}.onnx"
  local json_url="${PIPER_VOICES_BASE_URL}/${model_path}.onnx.json"

  echo "📥 Downloading Piper voice: $voice_name"
  echo "   Source: HuggingFace (rhasspy/piper-voices)"
  echo "   Size: ~25MB"
  echo ""

  # Download ONNX model
  echo "   Downloading model file..."
  if ! curl -L --progress-bar -o "$voice_dir/${voice_name}.onnx" "$onnx_url"; then
    echo "❌ Failed to download voice model"
    rm -f "$voice_dir/${voice_name}.onnx"
    return 1
  fi

  # Download JSON config
  echo "   Downloading config file..."
  if ! curl -L -s -o "$voice_dir/${voice_name}.onnx.json" "$json_url"; then
    echo "❌ Failed to download voice config"
    rm -f "$voice_dir/${voice_name}.onnx" "$voice_dir/${voice_name}.onnx.json"
    return 1
  fi

  # Verify file integrity (basic check - file size > 0)
  if [[ ! -s "$voice_dir/${voice_name}.onnx" ]]; then
    echo "❌ Downloaded file is empty or corrupt"
    rm -f "$voice_dir/${voice_name}.onnx" "$voice_dir/${voice_name}.onnx.json"
    return 1
  fi

  echo "✅ Voice downloaded successfully: $voice_name"
  echo "   Location: $voice_dir/${voice_name}.onnx"
}

# @function list_downloaded_voices
# @intent Display all locally cached voice models with file sizes
# @why Help users see what voices they have available and storage usage
# @param None
# @returns None
# @exitcode Always 0
# @sideeffects Writes formatted list to stdout
# @edgecases Handles empty voice directory gracefully, uses nullglob to avoid literal *.onnx
# @calledby Voice management commands, /agent-vibes:list
# @calls get_voice_storage_dir, basename, du
list_downloaded_voices() {
  local voice_dir
  voice_dir=$(get_voice_storage_dir)

  echo "📦 Downloaded Piper Voices:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  local count=0
  shopt -s nullglob
  for onnx_file in "$voice_dir"/*.onnx; do
    if [[ -f "$onnx_file" ]]; then
      local voice_name
      voice_name=$(basename "$onnx_file" .onnx)
      local file_size
      file_size=$(du -h "$onnx_file" | cut -f1)
      echo "  • $voice_name ($file_size)"
      ((count++))
    fi
  done
  shopt -u nullglob

  if [[ $count -eq 0 ]]; then
    echo "  (No voices downloaded yet)"
  fi

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Total: $count voices"
}

# AI NOTE: This file manages the lifecycle of Piper voice models
# Voice models are ONNX files (~20-30MB each) downloaded from HuggingFace
# Files are cached locally to avoid repeated downloads
# Project-local storage preferred over global for isolation

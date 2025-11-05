#!/bin/bash
#
# File: .claude/hooks/piper-download-voices.sh
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
# @fileoverview Piper Voice Model Downloader - Batch downloads popular Piper TTS voices from HuggingFace
# @context Post-installation utility to download commonly used voices (~25MB each)
# @architecture Wrapper around piper-voice-manager.sh download functions with progress tracking
# @dependencies piper-voice-manager.sh (download logic), piper binary (for validation)
# @entrypoints Called by piper-installer.sh or manually via ./piper-download-voices.sh [--yes|-y]
# @patterns Batch operations, skip-existing logic, auto-yes flag for non-interactive use
# @related piper-voice-manager.sh, piper-installer.sh
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/piper-voice-manager.sh"

# Parse command line arguments
AUTO_YES=false
if [[ "$1" == "--yes" ]] || [[ "$1" == "-y" ]]; then
  AUTO_YES=true
fi

# Common voice models to download
COMMON_VOICES=(
  "en_US-lessac-medium"      # Default, clear male
  "en_US-amy-medium"         # Warm female
  "en_US-joe-medium"         # Professional male
  "en_US-ryan-high"          # Expressive male
  "en_US-libritts-high"      # Premium quality
)

echo "🎙️  Piper Voice Model Downloader"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This will download the most commonly used Piper voice models."
echo "Each voice is approximately 25MB."
echo ""

# Check if piper is installed
if ! command -v piper &> /dev/null; then
  echo "❌ Error: Piper TTS not installed"
  echo "Install with: pipx install piper-tts"
  exit 1
fi

# Get storage directory
VOICE_DIR=$(get_voice_storage_dir)

echo "📂 Storage location: $VOICE_DIR"
echo ""

# Count already downloaded
ALREADY_DOWNLOADED=0
ALREADY_DOWNLOADED_LIST=()
NEED_DOWNLOAD=()

for voice in "${COMMON_VOICES[@]}"; do
  if verify_voice "$voice" 2>/dev/null; then
    ((ALREADY_DOWNLOADED++))
    ALREADY_DOWNLOADED_LIST+=("$voice")
  else
    NEED_DOWNLOAD+=("$voice")
  fi
done

echo "📊 Status:"
echo "   Already downloaded: $ALREADY_DOWNLOADED voice(s)"
echo "   Need to download: ${#NEED_DOWNLOAD[@]} voice(s)"
echo ""

# Show already downloaded voices
if [[ $ALREADY_DOWNLOADED -gt 0 ]]; then
  echo "✅ Already downloaded (skipped):"
  for voice in "${ALREADY_DOWNLOADED_LIST[@]}"; do
    echo "   ✓ $voice"
  done
  echo ""
fi

if [[ ${#NEED_DOWNLOAD[@]} -eq 0 ]]; then
  echo "🎉 All common voices ready to use!"
  exit 0
fi

echo "Voices to download:"
for voice in "${NEED_DOWNLOAD[@]}"; do
  echo "  • $voice (~25MB)"
done
echo ""

# Ask for confirmation (skip if --yes flag provided)
if [[ "$AUTO_YES" == "false" ]]; then
  read -p "Download ${#NEED_DOWNLOAD[@]} voice model(s)? [Y/n]: " -n 1 -r
  echo

  if [[ ! $REPLY =~ ^[Yy]$ ]] && [[ -n $REPLY ]]; then
    echo "❌ Download cancelled"
    exit 0
  fi
else
  echo "Auto-downloading ${#NEED_DOWNLOAD[@]} voice model(s)..."
  echo ""
fi

# Download each voice
DOWNLOADED=0
FAILED=0

for voice in "${NEED_DOWNLOAD[@]}"; do
  echo ""
  echo "📥 Downloading: $voice..."

  if download_voice "$voice"; then
    ((DOWNLOADED++))
    echo "✅ Downloaded: $voice"
  else
    ((FAILED++))
    echo "❌ Failed: $voice"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Download Summary:"
echo "   ✅ Successfully downloaded: $DOWNLOADED"
echo "   ❌ Failed: $FAILED"
echo "   📦 Total voices available: $((ALREADY_DOWNLOADED + DOWNLOADED))"
echo ""

if [[ $DOWNLOADED -gt 0 ]]; then
  echo "✨ Ready to use Piper TTS with downloaded voices!"
  echo ""
  echo "Try it:"
  echo "  /agent-vibes:provider switch piper"
  echo "  /agent-vibes:preview"
fi

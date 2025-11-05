#!/bin/bash
#
# File: .claude/hooks/download-extra-voices.sh
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
# @fileoverview Extra Piper Voice Downloader - Downloads custom high-quality voices from HuggingFace
# @context Post-installation utility to download premium custom voices (Kristin, Jenny, Tracy/16Speakers)
# @architecture Downloads ONNX voice models from agentvibes/piper-custom-voices HuggingFace repository
# @dependencies curl (downloads), piper-voice-manager.sh (storage dir logic)
# @entrypoints Called by MCP server download_extra_voices tool or manually
# @patterns Batch downloads, skip-existing logic, auto-yes flag for non-interactive use
# @related piper-voice-manager.sh, mcp-server/server.py, docs/huggingface-setup-guide.md
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/piper-voice-manager.sh"

# Parse command line arguments
AUTO_YES=false
if [[ "$1" == "--yes" ]] || [[ "$1" == "-y" ]]; then
  AUTO_YES=true
fi

# HuggingFace repository for custom voices
HUGGINGFACE_REPO="agentvibes/piper-custom-voices"
HUGGINGFACE_BASE_URL="https://huggingface.co/${HUGGINGFACE_REPO}/resolve/main"

# Extra custom voices to download
EXTRA_VOICES=(
  "kristin:Kristin (US English female, Public Domain, 64MB)"
  "jenny:Jenny (UK English female with Irish accent, CC BY, 64MB)"
  "16Speakers:Tracy/16Speakers (Multi-speaker: 12 US + 4 UK voices, Public Domain, 77MB)"
)

echo "🎙️  AgentVibes Extra Voice Downloader"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This will download high-quality custom Piper voices from HuggingFace."
echo ""
echo "📦 Voices available:"
for voice_info in "${EXTRA_VOICES[@]}"; do
  voice_name="${voice_info%%:*}"
  voice_desc="${voice_info#*:}"
  echo "  • $voice_desc"
done
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

for voice_info in "${EXTRA_VOICES[@]}"; do
  voice_name="${voice_info%%:*}"
  voice_desc="${voice_info#*:}"

  # Check if both .onnx and .onnx.json exist
  if [[ -f "$VOICE_DIR/${voice_name}.onnx" ]] && [[ -f "$VOICE_DIR/${voice_name}.onnx.json" ]]; then
    ((ALREADY_DOWNLOADED++))
    ALREADY_DOWNLOADED_LIST+=("$voice_desc")
  else
    NEED_DOWNLOAD+=("$voice_info")
  fi
done

echo "📊 Status:"
echo "   Already downloaded: $ALREADY_DOWNLOADED voice(s)"
echo "   Need to download: ${#NEED_DOWNLOAD[@]} voice(s)"
echo ""

# Show already downloaded voices
if [[ $ALREADY_DOWNLOADED -gt 0 ]]; then
  echo "✅ Already downloaded (skipped):"
  for voice_desc in "${ALREADY_DOWNLOADED_LIST[@]}"; do
    echo "   ✓ $voice_desc"
  done
  echo ""
fi

if [[ ${#NEED_DOWNLOAD[@]} -eq 0 ]]; then
  echo "🎉 All extra voices already downloaded!"
  exit 0
fi

echo "Voices to download:"
for voice_info in "${NEED_DOWNLOAD[@]}"; do
  voice_desc="${voice_info#*:}"
  echo "  • $voice_desc"
done
echo ""

# Calculate total size
TOTAL_SIZE_MB=0
for voice_info in "${NEED_DOWNLOAD[@]}"; do
  voice_desc="${voice_info#*:}"
  if [[ "$voice_desc" =~ ([0-9]+)MB ]]; then
    TOTAL_SIZE_MB=$((TOTAL_SIZE_MB + ${BASH_REMATCH[1]}))
  fi
done

echo "💾 Total download size: ~${TOTAL_SIZE_MB}MB"
echo ""

# Ask for confirmation (skip if --yes flag provided)
if [[ "$AUTO_YES" == "false" ]]; then
  read -p "Download ${#NEED_DOWNLOAD[@]} extra voice(s)? [Y/n]: " -n 1 -r
  echo

  if [[ ! $REPLY =~ ^[Yy]$ ]] && [[ -n $REPLY ]]; then
    echo "❌ Download cancelled"
    exit 0
  fi
else
  echo "Auto-downloading ${#NEED_DOWNLOAD[@]} extra voice(s)..."
  echo ""
fi

# Create voice directory if it doesn't exist
mkdir -p "$VOICE_DIR"

# Download function
download_voice_file() {
  local url="$1"
  local output_path="$2"
  local file_name="$3"

  echo "  📥 Downloading $file_name..."

  if curl -L --progress-bar "$url" -o "$output_path" 2>&1; then
    echo "  ✅ Downloaded: $file_name"
    return 0
  else
    echo "  ❌ Failed to download: $file_name"
    return 1
  fi
}

# Download each voice
DOWNLOADED=0
FAILED=0

for voice_info in "${NEED_DOWNLOAD[@]}"; do
  voice_name="${voice_info%%:*}"
  voice_desc="${voice_info#*:}"

  echo ""
  echo "📥 Downloading: ${voice_desc%%,*}..."
  echo ""

  # Download .onnx file
  onnx_url="${HUGGINGFACE_BASE_URL}/${voice_name}.onnx"
  onnx_path="${VOICE_DIR}/${voice_name}.onnx"

  # Download .onnx.json file
  json_url="${HUGGINGFACE_BASE_URL}/${voice_name}.onnx.json"
  json_path="${VOICE_DIR}/${voice_name}.onnx.json"

  success=true

  if ! download_voice_file "$onnx_url" "$onnx_path" "${voice_name}.onnx"; then
    success=false
  fi

  if ! download_voice_file "$json_url" "$json_path" "${voice_name}.onnx.json"; then
    success=false
  fi

  if [[ "$success" == "true" ]]; then
    ((DOWNLOADED++))
    echo ""
    echo "✅ Successfully downloaded: ${voice_desc%%,*}"
  else
    ((FAILED++))
    echo ""
    echo "❌ Failed to download: ${voice_desc%%,*}"
    # Clean up partial downloads
    rm -f "$onnx_path" "$json_path"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Download Summary:"
echo "   ✅ Successfully downloaded: $DOWNLOADED"
echo "   ❌ Failed: $FAILED"
echo "   📦 Total extra voices available: $((ALREADY_DOWNLOADED + DOWNLOADED))"
echo ""

if [[ $DOWNLOADED -gt 0 ]]; then
  echo "✨ Extra voices ready to use!"
  echo ""
  echo "Try them:"
  echo "  /agent-vibes:provider switch piper"
  echo "  /agent-vibes:switch kristin"
  echo "  /agent-vibes:switch jenny"
  echo "  /agent-vibes:switch 16Speakers"
fi

# Return success if at least one voice was downloaded or all were already present
if [[ $DOWNLOADED -gt 0 ]] || [[ $ALREADY_DOWNLOADED -gt 0 ]]; then
  exit 0
else
  exit 1
fi

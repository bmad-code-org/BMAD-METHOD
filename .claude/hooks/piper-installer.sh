#!/bin/bash
#
# File: .claude/hooks/piper-installer.sh
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
# @fileoverview Piper TTS Installer - Installs Piper TTS via pipx and downloads initial voice models
# @context Automated installation script for free offline Piper TTS on WSL/Linux systems
# @architecture Helper script for AgentVibes installer, invoked manually or from provider switcher
# @dependencies pipx (Python package installer), apt-get/brew/dnf/pacman (for pipx installation)
# @entrypoints Called by src/installer.js or manually by users during setup
# @patterns Platform detection (WSL/Linux only), package manager abstraction, guided voice download
# @related piper-download-voices.sh, provider-manager.sh, src/installer.js
#

set -e  # Exit on error

echo "🎤 Piper TTS Installer"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if running on WSL or Linux
if ! grep -qi microsoft /proc/version 2>/dev/null && [[ "$(uname -s)" != "Linux" ]]; then
  echo "❌ Piper TTS is only supported on WSL and Linux"
  echo "   Your platform: $(uname -s)"
  echo ""
  echo "   For macOS/Windows, use ElevenLabs instead:"
  echo "   /agent-vibes:provider switch elevenlabs"
  exit 1
fi

# Check if Piper is already installed
if command -v piper &> /dev/null; then
  # Piper doesn't have a --version flag, just check if it exists
  echo "✅ Piper TTS is already installed!"
  echo "   Location: $(which piper)"
  echo ""
  echo "   Download voices with: .claude/hooks/piper-download-voices.sh"
  exit 0
fi

echo "📦 Installing Piper TTS..."
echo ""

# Check if pipx is installed
if ! command -v pipx &> /dev/null; then
  echo "⚠️  pipx not found. Installing pipx first..."
  echo ""

  # Try to install pipx
  if command -v apt-get &> /dev/null; then
    # Debian/Ubuntu
    sudo apt-get update
    sudo apt-get install -y pipx
  elif command -v brew &> /dev/null; then
    # macOS (though Piper doesn't run on macOS)
    brew install pipx
  elif command -v dnf &> /dev/null; then
    # Fedora
    sudo dnf install -y pipx
  elif command -v pacman &> /dev/null; then
    # Arch Linux
    sudo pacman -S python-pipx
  else
    echo "❌ Unable to install pipx automatically."
    echo ""
    echo "   Please install pipx manually:"
    echo "   https://pipx.pypa.io/stable/installation/"
    exit 1
  fi

  # Ensure pipx is in PATH
  pipx ensurepath
  echo ""
fi

# Install Piper TTS
echo "📥 Installing Piper TTS via pipx..."
pipx install piper-tts

if ! command -v piper &> /dev/null; then
  echo ""
  echo "❌ Installation completed but piper command not found in PATH"
  echo ""
  echo "   Try running: pipx ensurepath"
  echo "   Then restart your terminal"
  exit 1
fi

echo ""
echo "✅ Piper TTS installed successfully!"
echo ""

PIPER_VERSION=$(piper --version 2>&1 || echo "unknown")
echo "   Version: $PIPER_VERSION"
echo ""

# Determine voices directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$(dirname "$SCRIPT_DIR")"

# Check for configured voices directory
VOICES_DIR=""
if [[ -f "$CLAUDE_DIR/piper-voices-dir.txt" ]]; then
  VOICES_DIR=$(cat "$CLAUDE_DIR/piper-voices-dir.txt")
elif [[ -f "$HOME/.claude/piper-voices-dir.txt" ]]; then
  VOICES_DIR=$(cat "$HOME/.claude/piper-voices-dir.txt")
else
  VOICES_DIR="$HOME/.claude/piper-voices"
fi

echo "📁 Voice storage location: $VOICES_DIR"
echo ""

# Ask if user wants to download voices now
read -p "Would you like to download voice models now? [Y/n] " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
  echo ""
  echo "📥 Downloading recommended voices..."
  echo ""

  # Use the piper-download-voices.sh script if available
  if [[ -f "$SCRIPT_DIR/piper-download-voices.sh" ]]; then
    "$SCRIPT_DIR/piper-download-voices.sh"
  else
    # Manual download of a basic voice
    mkdir -p "$VOICES_DIR"

    echo "Downloading en_US-lessac-medium (recommended)..."
    curl -L "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx" \
      -o "$VOICES_DIR/en_US-lessac-medium.onnx"
    curl -L "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json" \
      -o "$VOICES_DIR/en_US-lessac-medium.onnx.json"

    echo "✅ Voice downloaded!"
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Piper TTS Setup Complete!"
echo ""
echo "Next steps:"
echo "  1. Download more voices: .claude/hooks/piper-download-voices.sh"
echo "  2. List available voices: /agent-vibes:list"
echo "  3. Test it out: /agent-vibes:preview"
echo ""
echo "Enjoy your free, offline TTS! 🎤"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

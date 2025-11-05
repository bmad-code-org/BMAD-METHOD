#!/bin/bash
#
# File: .claude/hooks/piper-multispeaker-registry.sh
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
# @fileoverview Multi-Speaker Voice Registry - Maps speaker names to ONNX models and speaker IDs
# @context Enables individual speaker selection from multi-speaker Piper models (e.g., 16Speakers)
# @architecture Static registry mapping speaker names to model files and numeric speaker IDs
# @dependencies piper-voice-manager.sh (voice storage), play-tts-piper.sh (TTS with speaker ID)
# @entrypoints Sourced by voice-manager.sh for multi-speaker voice switching
# @patterns Registry pattern, speaker ID mapping, model-to-speaker association
# @related voice-manager.sh, play-tts-piper.sh, 16Speakers.onnx.json (speaker_id_map)
#

# Registry of multi-speaker models and their speaker names
# Format: "SpeakerName:model_file:speaker_id:description"
#
# 16Speakers Model (12 US + 4 UK voices):
# Source: LibriVox Public Domain recordings
# Model: 16Speakers.onnx (77MB)
#
MULTISPEAKER_VOICES=(
  # US English Speakers (0-11)
  "Cori_Samuel:16Speakers:0:US English Female"
  "Kara_Shallenberg:16Speakers:1:US English Female"
  "Kristin_Hughes:16Speakers:2:US English Female"
  "Maria_Kasper:16Speakers:3:US English Female"
  "Mike_Pelton:16Speakers:4:US English Male"
  "Mark_Nelson:16Speakers:5:US English Male"
  "Michael_Scherer:16Speakers:6:US English Male"
  "James_K_White:16Speakers:7:US English Male"
  "Rose_Ibex:16Speakers:8:US English Female"
  "progressingamerica:16Speakers:9:US English Male"
  "Steve_C:16Speakers:10:US English Male"
  "Owlivia:16Speakers:11:US English Female"

  # UK English Speakers (12-15)
  "Paul_Hampton:16Speakers:12:UK English Male"
  "Jennifer_Dorr:16Speakers:13:UK English Female"
  "Emily_Cripps:16Speakers:14:UK English Female"
  "Martin_Clifton:16Speakers:15:UK English Male"
)

# @function get_multispeaker_info
# @intent Get model and speaker ID for a speaker name
# @why Enables users to select individual speakers from multi-speaker models by name
# @param $1 {string} speaker_name - Speaker name (e.g., "Cori_Samuel", "Rose_Ibex")
# @returns Echoes "model:speaker_id" (e.g., "16Speakers:0") to stdout
# @exitcode 0=speaker found, 1=speaker not found
# @sideeffects None (read-only lookup)
# @edgecases Case-insensitive matching
# @calledby voice-manager.sh switch command
# @calls None (pure bash array iteration)
get_multispeaker_info() {
  local speaker_name="$1"
  for entry in "${MULTISPEAKER_VOICES[@]}"; do
    name="${entry%%:*}"
    rest="${entry#*:}"
    model="${rest%%:*}"
    rest="${rest#*:}"
    speaker_id="${rest%%:*}"

    if [[ "${name,,}" == "${speaker_name,,}" ]]; then
      echo "$model:$speaker_id"
      return 0
    fi
  done
  return 1
}

# @function list_multispeaker_voices
# @intent Display all available multi-speaker voices with descriptions
# @why Help users discover individual speakers within multi-speaker models
# @param None
# @returns None
# @exitcode Always 0
# @sideeffects Writes formatted list to stdout
# @edgecases None
# @calledby voice-manager.sh list command, /agent-vibes:list
# @calls None (pure bash array iteration)
list_multispeaker_voices() {
  echo "🎭 Multi-Speaker Voices (16Speakers Model):"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  local current_model=""
  for entry in "${MULTISPEAKER_VOICES[@]}"; do
    name="${entry%%:*}"
    rest="${entry#*:}"
    model="${rest%%:*}"
    rest="${rest#*:}"
    speaker_id="${rest%%:*}"
    description="${rest#*:}"

    # Print section header when model changes
    if [[ "$model" != "$current_model" ]]; then
      if [[ -n "$current_model" ]]; then
        echo ""
      fi
      echo "  Model: $model.onnx"
      current_model="$model"
    fi

    echo "    • $name (ID: $speaker_id) - $description"
  done

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Usage: /agent-vibes:switch Cori_Samuel"
  echo "       /agent-vibes:switch Rose_Ibex"
}

# @function get_multispeaker_description
# @intent Get description for a speaker name
# @why Provide user-friendly info about speaker characteristics
# @param $1 {string} speaker_name - Speaker name
# @returns Echoes description (e.g., "US English Female") to stdout
# @exitcode 0=speaker found, 1=speaker not found
# @sideeffects None (read-only lookup)
# @edgecases Case-insensitive matching
# @calledby voice-manager.sh switch command (for confirmation message)
# @calls None (pure bash array iteration)
get_multispeaker_description() {
  local speaker_name="$1"
  for entry in "${MULTISPEAKER_VOICES[@]}"; do
    name="${entry%%:*}"
    rest="${entry#*:}"
    rest="${rest#*:}"
    rest="${rest#*:}"
    description="${rest}"

    if [[ "${name,,}" == "${speaker_name,,}" ]]; then
      echo "$description"
      return 0
    fi
  done
  return 1
}

#!/bin/bash
#
# File: .claude/hooks/voices-config.sh
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
# @fileoverview ElevenLabs Voice Configuration - Single source of truth for voice ID mappings
# @context Maps human-readable voice names to ElevenLabs API voice IDs for consistency
# @architecture Associative array (bash hash map) sourced by multiple scripts
# @dependencies None (pure data structure)
# @entrypoints Sourced by voice-manager.sh, play-tts-elevenlabs.sh, and personality managers
# @patterns Centralized configuration, DRY principle for voice mappings
# @related voice-manager.sh, play-tts-elevenlabs.sh, personality/*.md files

declare -A VOICES=(
  ["Amy"]="bhJUNIXWQQ94l8eI2VUf"
  ["Antoni"]="ErXwobaYiN019PkySvjV"
  ["Archer"]="L0Dsvb3SLTyegXwtm47J"
  ["Aria"]="TC0Zp7WVFzhA8zpTlRqV"
  ["Bella"]="EXAVITQu4vr4xnSDxMaL"
  ["Burt Reynolds"]="4YYIPFl9wE5c4L2eu2Gb"
  ["Charlotte"]="XB0fDUnXU5powFXDhCwa"
  ["Cowboy Bob"]="KTPVrSVAEUSJRClDzBw7"
  ["Demon Monster"]="vfaqCOvlrKi4Zp7C2IAm"
  ["Domi"]="AZnzlk1XvdvUeBnXmlld"
  ["Dr. Von Fusion"]="yjJ45q8TVCrtMhEKurxY"
  ["Drill Sergeant"]="vfaqCOvlrKi4Zp7C2IAm"
  ["Grandpa Spuds Oxley"]="NOpBlnGInO9m6vDvFkFC"
  ["Grandpa Werthers"]="MKlLqCItoCkvdhrxgtLv"
  ["Jessica Anne Bogart"]="flHkNRp1BlvT73UL6gyz"
  ["Juniper"]="aMSt68OGf4xUZAnLpTU8"
  ["Lutz Laugh"]="9yzdeviXkFddZ4Oz8Mok"
  ["Matilda"]="XrExE9yKIg1WjnnlVkGX"
  ["Matthew Schmitz"]="0SpgpJ4D3MpHCiWdyTg3"
  ["Michael"]="U1Vk2oyatMdYs096Ety7"
  ["Ms. Walker"]="DLsHlh26Ugcm6ELvS0qi"
  ["Northern Terry"]="wo6udizrrtpIxWGp2qJk"
  ["Pirate Marshal"]="PPzYpIqttlTYA83688JI"
  ["Rachel"]="21m00Tcm4TlvDq8ikWAM"
  ["Ralf Eisend"]="A9evEp8yGjv4c3WsIKuY"
  ["Tiffany"]="6aDn1KB0hjpdcocrUkmq"
  ["Tom"]="DYkrAHD8iwork3YSUBbs"
)
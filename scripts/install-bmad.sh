#!/bin/bash

# BMAD Method Install Script
# Changes to the BMAD-METHOD directory and runs the install command

BMAD_DIR="/home/sallvain/dev/tools/BMAD-METHOD"

cd "$BMAD_DIR" || {
    echo "Error: Could not change to directory $BMAD_DIR"
    exit 1
}

echo "Pulling latest changes..."
git pull || {
    echo "Warning: Git pull failed, continuing with install anyway..."
}

echo "Running BMAD install from $BMAD_DIR..."
npm run install:bmad

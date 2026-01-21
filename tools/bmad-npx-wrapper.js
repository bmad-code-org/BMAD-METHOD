#!/usr/bin/env node

/**
 * BMad Method CLI - Direct execution wrapper for npx
 * This file ensures proper execution when run via npx from GitHub or npm registry
 */

const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

// Check if we're running in an npx temporary directory
const isNpxExecution = __dirname.includes('_npx') || __dirname.includes('.npm');

if (isNpxExecution) {
  // Running via npx - spawn child process to preserve user's working directory
  const args = process.argv.slice(2);
  const bmadCliPath = path.join(__dirname, 'cli', 'bmad-cli.js');

  if (!fs.existsSync(bmadCliPath)) {
    console.error('Error: Could not find bmad-cli.js at', bmadCliPath);
    console.error('Current directory:', __dirname);
    process.exit(1);
  }

  try {
    // Execute CLI from user's working directory (process.cwd()), not npm cache
    // Use spawnSync with array args to preserve argument boundaries
    // (args.join(' ') would break arguments containing spaces)
    const result = spawnSync('node', [bmadCliPath, ...args], {
      stdio: 'inherit',
      cwd: process.cwd(), // This preserves the user's working directory
    });

    if (result.error) {
      throw result.error;
    }

    if (result.status !== 0) {
      process.exit(result.status || 1);
    }
  } catch (error) {
    process.exit(error.status || 1);
  }
} else {
  // Local execution - use require
  require('./cli/bmad-cli.js');
}

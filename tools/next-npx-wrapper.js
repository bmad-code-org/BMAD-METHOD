#!/usr/bin/env node

/**
 * Next Method CLI - Direct execution wrapper for npx
 * This file ensures proper execution when run via npx from GitHub
 */

const { execSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

// Check if we're running in an npx temporary directory
const isNpxExecution = __dirname.includes('_npx') || __dirname.includes('.npm');

// If running via npx, we need to handle things differently
if (isNpxExecution) {
  const arguments_ = process.argv.slice(2);

  // Use the installer for all commands
  const nextScriptPath = path.join(__dirname, 'installer', 'bin', 'next.js');

  if (!fs.existsSync(nextScriptPath)) {
    console.error('Error: Could not find next.js at', nextScriptPath);
    console.error('Current directory:', __dirname);
    process.exit(1);
  }

  try {
    execSync(`node "${nextScriptPath}" ${arguments_.join(' ')}`, {
      stdio: 'inherit',
      cwd: path.dirname(__dirname),
    });
  } catch (error) {
    process.exit(error.status || 1);
  }
} else {
  // Local execution - use installer for all commands
  require('./installer/bin/next.js');
}

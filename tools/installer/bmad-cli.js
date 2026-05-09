#!/usr/bin/env node

const { program } = require('commander');
const path = require('node:path');
const fs = require('node:fs');
const { execSync } = require('node:child_process');
const semver = require('semver');
const prompts = require('./prompts');

// The installer flow uses many sequential @clack/prompts, each adding keypress
// listeners to stdin. Raise the limit to avoid spurious EventEmitter warnings.
if (process.stdin?.setMaxListeners) {
  const currentLimit = process.stdin.getMaxListeners();
  process.stdin.setMaxListeners(Math.max(currentLimit, 50));
}

// Check for updates - do this asynchronously so it doesn't block startup
const packageJson = require('../../package.json');
const packageName = 'bmad-method';
checkForUpdate().catch(() => {
  // Silently ignore errors - version check is best-effort
});

async function checkForUpdate() {
  try {
    // Prereleases (e.g. 6.5.1-next.0) live on the `next` dist-tag; stable
    // releases live on `latest`. semver.prerelease() returns null for stable,
    // so this correctly routes pre-1.0-next/rc/etc. without string matching.
    const tag = semver.prerelease(packageJson.version) ? 'next' : 'latest';

    const result = execSync(`npm view ${packageName}@${tag} version`, {
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 5000,
    }).trim();

    if (result && semver.gt(result, packageJson.version)) {
      const color = await prompts.getColor();
      const updateMsg = [
        `You are using version ${packageJson.version} but ${result} is available.`,
        '',
        'To update, exit and first run:',
        `  npm cache clean --force && npx bmad-method@${tag} install`,
      ].join('\n');
      await prompts.box(updateMsg, 'Update Available', {
        rounded: true,
        formatBorder: color.yellow,
      });
    }
  } catch {
    // Silently fail - network issues or npm not available
  }
}

// Fix for stdin issues when running through npm on Windows
// Ensures keyboard interaction works properly with CLI prompts
if (process.stdin.isTTY) {
  try {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    // On Windows, explicitly reference the stdin stream to ensure it's properly initialized
    if (process.platform === 'win32') {
      process.stdin.on('error', () => {
        // Ignore stdin errors - they can occur when the terminal is closing
      });
    }
  } catch {
    // Silently ignore - some environments may not support these operations
  }
}

// Load all command modules
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

const commands = {};
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  commands[command.command] = command;
}

// Set up main program
program.version(packageJson.version).description('BMAD Core CLI - Universal AI agent framework');

// Register all commands
for (const [name, cmd] of Object.entries(commands)) {
  const command = program.command(name).description(cmd.description);

  // Add options
  for (const option of cmd.options || []) {
    command.option(...option);
  }

  // Set action
  command.action(cmd.action);
}

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (process.argv.slice(2).length === 0) {
  program.outputHelp();
}

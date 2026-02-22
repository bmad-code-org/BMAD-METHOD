const { program } = require('commander');
const path = require('node:path');
const fs = require('node:fs');

// Fix for stdin issues when running through npm on Windows
if (process.stdin.isTTY) {
  try {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    if (process.platform === 'win32') {
      process.stdin.on('error', () => {});
    }
  } catch {
    // Silently ignore - some environments may not support these operations
  }
}

// Load package.json for version info
const packageJson = require('../../package.json');

// Load install command
const installCommand = require('./commands/install');

// Set up program
program.version(packageJson.version).description('Whiteport Design Studio - Strategic design methodology for AI-powered workflows');

// Register install command
const cmd = program.command(installCommand.command).description(installCommand.description);
for (const option of installCommand.options || []) {
  cmd.option(...option);
}
cmd.action(installCommand.action);

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (process.argv.slice(2).length === 0) {
  program.outputHelp();
}

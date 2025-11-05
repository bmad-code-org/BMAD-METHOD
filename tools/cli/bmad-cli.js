const { program } = require('commander');
const path = require('node:path');
const fs = require('node:fs');

// Load package.json from root for version info
const packageJson = require('../../package.json');

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

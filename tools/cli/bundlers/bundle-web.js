const { Command } = require('commander');
const { WebBundler } = require('./web-bundler');

const program = new Command();
const bundler = new WebBundler();

program.name('bundle-web').description('Generate BMAD web bundles').version('1.0.0');

program
  .command('list')
  .description('List available modules and agents')
  .action(async () => {
    await bundler.list();
  });

program
  .command('clean')
  .description('Remove all generated web bundles')
  .action(async () => {
    await bundler.clean();
  });

program
  .command('all')
  .description('Bundle all modules')
  .action(async () => {
    await bundler.bundleAll();
  });

program
  .command('rebundle')
  .description('Clean and bundle all modules')
  .action(async () => {
    await bundler.clean();
    await bundler.bundleAll();
  });

program
  .command('module')
  .description('Bundle a specific module')
  .argument('<name>', 'module name')
  .action(async (name) => {
    await bundler.bundleModule(name);
  });

program
  .command('agent')
  .description('Bundle a specific agent')
  .argument('<module>', 'module name')
  .argument('<agent>', 'agent name')
  .action(async (moduleName, agentName) => {
    await bundler.bundleAgentByName(moduleName, agentName);
  });

program
  .command('team')
  .description('Bundle a specific team (not currently implemented)')
  .argument('<module>', 'module name')
  .argument('<team>', 'team name')
  .action(async (moduleName, teamName) => {
    throw new Error(`Team bundling is not implemented: ${moduleName}/${teamName}`);
  });

program.parseAsync(process.argv).catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});

const { WebBundler } = require('./web-bundler');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('node:path');

async function testWebBundler() {
  console.log(chalk.cyan.bold('\n🧪 Testing Web Bundler\n'));

  const bundler = new WebBundler();
  let passedTests = 0;
  let failedTests = 0;

  // Test 1: Load web activation
  try {
    await bundler.loadWebActivation();
    console.log(chalk.green('✓ Web activation loaded successfully'));
    passedTests++;
  } catch (error) {
    console.error(chalk.red('✗ Failed to load web activation:'), error.message);
    failedTests++;
  }

  // Test 2: Discover modules
  try {
    const modules = await bundler.discoverModules();
    console.log(chalk.green(`✓ Discovered ${modules.length} modules:`, modules.join(', ')));
    passedTests++;
  } catch (error) {
    console.error(chalk.red('✗ Failed to discover modules:'), error.message);
    failedTests++;
  }

  // Test 3: Bundle analyst agent
  try {
    const result = await bundler.bundleAgent('bmm', 'analyst.md');

    // Check if bundle was created
    const bundlePath = path.join(bundler.outputDir, 'bmm', 'agents', 'analyst.xml');
    if (await fs.pathExists(bundlePath)) {
      const content = await fs.readFile(bundlePath, 'utf8');

      // Validate bundle structure
      const hasAgent = content.includes('<agent');
      const hasActivation = content.includes('<activation');
      const hasPersona = content.includes('<persona>');
      const activationBeforePersona = content.indexOf('<activation') < content.indexOf('<persona>');
      const hasManifests =
        content.includes('<agent-party id="bmad/_cfg/agent-manifest.csv">') && content.includes('<manifest id="bmad/web-manifest.xml">');
      const hasDependencies = content.includes('<dependencies>');

      console.log(chalk.green('✓ Analyst bundle created successfully'));
      console.log(chalk.gray(`  - Has agent tag: ${hasAgent ? '✓' : '✗'}`));
      console.log(chalk.gray(`  - Has activation: ${hasActivation ? '✓' : '✗'}`));
      console.log(chalk.gray(`  - Has persona: ${hasPersona ? '✓' : '✗'}`));
      console.log(chalk.gray(`  - Activation before persona: ${activationBeforePersona ? '✓' : '✗'}`));
      console.log(chalk.gray(`  - Has manifests: ${hasManifests ? '✓' : '✗'}`));
      console.log(chalk.gray(`  - Has dependencies: ${hasDependencies ? '✓' : '✗'}`));

      if (hasAgent && hasActivation && hasPersona && activationBeforePersona && hasManifests && hasDependencies) {
        passedTests++;
      } else {
        console.error(chalk.red('✗ Bundle structure validation failed'));
        failedTests++;
      }
    } else {
      console.error(chalk.red('✗ Bundle file not created'));
      failedTests++;
    }
  } catch (error) {
    console.error(chalk.red('✗ Failed to bundle analyst agent:'), error.message);
    failedTests++;
  }

  // Test 4: Bundle a different agent (architect which exists)
  try {
    const result = await bundler.bundleAgent('bmm', 'architect.md');
    const bundlePath = path.join(bundler.outputDir, 'bmm', 'agents', 'architect.xml');

    if (await fs.pathExists(bundlePath)) {
      console.log(chalk.green('✓ Architect bundle created successfully'));
      passedTests++;
    } else {
      console.error(chalk.red('✗ Architect bundle file not created'));
      failedTests++;
    }
  } catch (error) {
    console.error(chalk.red('✗ Failed to bundle architect agent:'), error.message);
    failedTests++;
  }

  // Test 5: Bundle all agents in a module
  try {
    const results = await bundler.bundleModule('bmm');
    console.log(chalk.green(`✓ Bundled ${results.agents.length} agents from bmm module`));
    passedTests++;
  } catch (error) {
    console.error(chalk.red('✗ Failed to bundle bmm module:'), error.message);
    failedTests++;
  }

  // Summary
  console.log(chalk.bold('\n📊 Test Results:'));
  console.log(chalk.green(`  Passed: ${passedTests}`));
  console.log(chalk.red(`  Failed: ${failedTests}`));

  if (failedTests === 0) {
    console.log(chalk.green.bold('\n✅ All tests passed!\n'));
  } else {
    console.log(chalk.red.bold(`\n❌ ${failedTests} test(s) failed\n`));
    process.exit(1);
  }
}

// Run tests
testWebBundler().catch((error) => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});

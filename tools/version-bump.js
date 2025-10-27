const fs = require('node:fs');
const { execSync } = require('node:child_process');
const path = require('node:path');

// Dynamic import for ES module
let chalk;

// Initialize ES modules
async function initializeModules() {
  if (!chalk) {
    chalk = (await import('chalk')).default;
  }
}

/**
 * Simple version bumping script for BMad-Method
 * Usage: node tools/version-bump.js [patch|minor|major]
 */

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

async function bumpVersion(type = 'patch') {
  await initializeModules();

  const validTypes = ['patch', 'minor', 'major'];
  if (!validTypes.includes(type)) {
    console.error(chalk.red(`Invalid version type: ${type}. Use: ${validTypes.join(', ')}`));
    process.exit(1);
  }

  const currentVersion = getCurrentVersion();
  const versionParts = currentVersion.split('.').map(Number);
  let newVersion;

  switch (type) {
    case 'major': {
      newVersion = `${versionParts[0] + 1}.0.0`;
      break;
    }
    case 'minor': {
      newVersion = `${versionParts[0]}.${versionParts[1] + 1}.0`;
      break;
    }
    case 'patch': {
      newVersion = `${versionParts[0]}.${versionParts[1]}.${versionParts[2] + 1}`;
      break;
    }
  }

  console.log(chalk.blue(`Bumping version: ${currentVersion} → ${newVersion}`));

  // Update package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  packageJson.version = newVersion;
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');

  console.log(chalk.green(`✓ Updated package.json to ${newVersion}`));

  return newVersion;
}

async function main() {
  await initializeModules();

  const type = process.argv[2] || 'patch';
  const currentVersion = getCurrentVersion();

  console.log(chalk.blue(`Current version: ${currentVersion}`));

  // Check if working directory is clean
  try {
    execSync('git diff-index --quiet HEAD --');
  } catch {
    console.error(chalk.red('❌ Working directory is not clean. Commit your changes first.'));
    process.exit(1);
  }

  const newVersion = await bumpVersion(type);

  console.log(chalk.green(`\n🎉 Version bump complete!`));
  console.log(chalk.blue(`📦 ${currentVersion} → ${newVersion}`));
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}

module.exports = { bumpVersion, getCurrentVersion };

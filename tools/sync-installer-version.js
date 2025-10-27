/**
 * Sync installer package.json version with main package.json
 * Used by semantic-release to keep versions in sync
 */

const fs = require('node:fs');
const path = require('node:path');

function syncInstallerVersion() {
  // Read main package.json
  const mainPackagePath = path.join(__dirname, '..', 'package.json');
  const mainPackage = JSON.parse(fs.readFileSync(mainPackagePath, 'utf8'));

  // Read installer package.json
  const installerPackagePath = path.join(__dirname, 'installer', 'package.json');
  const installerPackage = JSON.parse(fs.readFileSync(installerPackagePath, 'utf8'));

  // Update installer version to match main version
  installerPackage.version = mainPackage.version;

  // Write back installer package.json
  fs.writeFileSync(installerPackagePath, JSON.stringify(installerPackage, null, 2) + '\n');

  console.log(`Synced installer version to ${mainPackage.version}`);
}

// Run if called directly
if (require.main === module) {
  syncInstallerVersion();
}

module.exports = { syncInstallerVersion };

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const arguments_ = process.argv.slice(2);

if (arguments_.length < 2) {
  console.log('Usage: node update-expansion-version.js <expansion-pack-id> <new-version>');
  console.log('Example: node update-expansion-version.js bmad-creator-tools 1.1.0');
  process.exit(1);
}

const [packId, newVersion] = arguments_;

// Validate version format
if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
  console.error('Error: Version must be in format X.Y.Z (e.g., 1.2.3)');
  process.exit(1);
}

async function updateVersion() {
  try {
    // Update in config.yaml
    const configPath = path.join(__dirname, '..', 'expansion-packs', packId, 'config.yaml');

    if (!fs.existsSync(configPath)) {
      console.error(`Error: Expansion pack '${packId}' not found`);
      process.exit(1);
    }

    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(configContent);
    const oldVersion = config.version || 'unknown';

    config.version = newVersion;

    const updatedYaml = yaml.dump(config, { indent: 2 });
    fs.writeFileSync(configPath, updatedYaml);

    console.log(`✓ Updated ${packId}/config.yaml: ${oldVersion} → ${newVersion}`);
    console.log(`\n✓ Successfully updated ${packId} to version ${newVersion}`);
    console.log('\nNext steps:');
    console.log('1. Test the changes');
    console.log(
      '2. Commit: git add -A && git commit -m "chore: bump ' + packId + ' to v' + newVersion + '"',
    );
  } catch (error) {
    console.error('Error updating version:', error.message);
    process.exit(1);
  }
}

updateVersion();

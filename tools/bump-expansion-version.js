// Load required modules
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

// Parse CLI arguments
const arguments_ = process.argv.slice(2);
const packId = arguments_[0];
const bumpType = arguments_[1] || 'minor';

// Validate arguments
if (!packId || arguments_.length > 2) {
  console.log('Usage: node bump-expansion-version.js <expansion-pack-id> [major|minor|patch]');
  console.log('Default: minor');
  console.log('Example: node bump-expansion-version.js bmad-creator-tools patch');
  process.exit(1);
}

if (!['major', 'minor', 'patch'].includes(bumpType)) {
  console.error('Error: Bump type must be major, minor, or patch');
  process.exit(1);
}

// Version bump logic
function bumpVersion(currentVersion, type) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  switch (type) {
    case 'major': {
      return `${major + 1}.0.0`;
    }
    case 'minor': {
      return `${major}.${minor + 1}.0`;
    }
    case 'patch': {
      return `${major}.${minor}.${patch + 1}`;
    }
    default: {
      return currentVersion;
    }
  }
}

// Main function to bump version
async function updateVersion() {
  const configPath = path.join(__dirname, '..', 'expansion-packs', packId, 'config.yaml');

  // Check if config exists
  if (!fs.existsSync(configPath)) {
    console.error(`Error: Expansion pack '${packId}' not found`);
    console.log('\nAvailable expansion packs:');

    const packsDir = path.join(__dirname, '..', 'expansion-packs');
    const entries = fs.readdirSync(packsDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        console.log(`  - ${entry.name}`);
      }
    }

    process.exit(1);
  }

  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(configContent);

    const oldVersion = config.version || '1.0.0';
    const newVersion = bumpVersion(oldVersion, bumpType);

    config.version = newVersion;

    const updatedYaml = yaml.dump(config, { indent: 2 });
    fs.writeFileSync(configPath, updatedYaml);

    console.log(`✓ ${packId}: ${oldVersion} → ${newVersion}`);
    console.log(`\n✓ Successfully bumped ${packId} with ${bumpType} version bump`);
    console.log('\nNext steps:');
    console.log(`1. Test the changes`);
    console.log(
      `2. Commit: git add -A && git commit -m "chore: bump ${packId} version (${bumpType})"`,
    );
  } catch (error) {
    console.error('Error updating version:', error.message);
    process.exit(1);
  }
}

updateVersion();

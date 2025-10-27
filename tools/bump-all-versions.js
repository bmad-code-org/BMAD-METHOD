const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const arguments_ = process.argv.slice(2);
const bumpType = arguments_[0] || 'minor'; // default to minor

if (!['major', 'minor', 'patch'].includes(bumpType)) {
  console.log('Usage: node bump-all-versions.js [major|minor|patch]');
  console.log('Default: minor');
  process.exit(1);
}

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

async function bumpAllVersions() {
  const updatedItems = [];

  // First, bump the core version (package.json)
  const packagePath = path.join(__dirname, '..', 'package.json');
  try {
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    const oldCoreVersion = packageJson.version || '1.0.0';
    const newCoreVersion = bumpVersion(oldCoreVersion, bumpType);

    packageJson.version = newCoreVersion;

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

    updatedItems.push({
      type: 'core',
      name: 'BMad Core',
      oldVersion: oldCoreVersion,
      newVersion: newCoreVersion,
    });
    console.log(`✓ BMad Core (package.json): ${oldCoreVersion} → ${newCoreVersion}`);
  } catch (error) {
    console.error(`✗ Failed to update BMad Core: ${error.message}`);
  }

  // Then, bump all expansion packs
  const expansionPacksDir = path.join(__dirname, '..', 'expansion-packs');

  try {
    const entries = fs.readdirSync(expansionPacksDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'README.md') {
        const packId = entry.name;
        const configPath = path.join(expansionPacksDir, packId, 'config.yaml');

        if (fs.existsSync(configPath)) {
          try {
            const configContent = fs.readFileSync(configPath, 'utf8');
            const config = yaml.load(configContent);
            const oldVersion = config.version || '1.0.0';
            const newVersion = bumpVersion(oldVersion, bumpType);

            config.version = newVersion;

            const updatedYaml = yaml.dump(config, { indent: 2 });
            fs.writeFileSync(configPath, updatedYaml);

            updatedItems.push({ type: 'expansion', name: packId, oldVersion, newVersion });
            console.log(`✓ ${packId}: ${oldVersion} → ${newVersion}`);
          } catch (error) {
            console.error(`✗ Failed to update ${packId}: ${error.message}`);
          }
        }
      }
    }

    if (updatedItems.length > 0) {
      const coreCount = updatedItems.filter((index) => index.type === 'core').length;
      const expansionCount = updatedItems.filter((index) => index.type === 'expansion').length;

      console.log(
        `\n✓ Successfully bumped ${updatedItems.length} item(s) with ${bumpType} version bump`,
      );
      if (coreCount > 0) console.log(`  - ${coreCount} core`);
      if (expansionCount > 0) console.log(`  - ${expansionCount} expansion pack(s)`);

      console.log('\nNext steps:');
      console.log('1. Test the changes');
      console.log(
        '2. Commit: git add -A && git commit -m "chore: bump all versions (' + bumpType + ')"',
      );
    } else {
      console.log('No items found to update');
    }
  } catch (error) {
    console.error('Error reading expansion packs directory:', error.message);
    process.exit(1);
  }
}

bumpAllVersions();

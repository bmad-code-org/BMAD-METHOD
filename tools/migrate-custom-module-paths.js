/**
 * Migration script to convert relative paths to absolute paths in custom module manifests
 * This should be run once to update existing installations
 */

const fs = require('fs-extra');
const path = require('node:path');
const yaml = require('yaml');
const chalk = require('chalk');

/**
 * Find BMAD directory in project
 */
function findBmadDir(projectDir = process.cwd()) {
  const possibleNames = ['_bmad'];

  for (const name of possibleNames) {
    const bmadDir = path.join(projectDir, name);
    if (fs.existsSync(bmadDir)) {
      return bmadDir;
    }
  }

  return null;
}

/**
 * Update manifest to use absolute paths
 */
async function updateManifest(manifestPath, projectRoot) {
  console.log(chalk.cyan(`\nUpdating manifest: ${manifestPath}`));

  const content = await fs.readFile(manifestPath, 'utf8');
  const manifest = yaml.parse(content);

  if (!manifest.customModules || manifest.customModules.length === 0) {
    console.log(chalk.dim('  No custom modules found'));
    return false;
  }

  let updated = false;

  for (const customModule of manifest.customModules) {
    if (customModule.relativePath && !customModule.sourcePath) {
      // Convert relative path to absolute
      const absolutePath = path.resolve(projectRoot, customModule.relativePath);
      customModule.sourcePath = absolutePath;

      // Remove the old relativePath
      delete customModule.relativePath;

      console.log(chalk.green(`  ✓ Updated ${customModule.id}: ${customModule.relativePath} → ${absolutePath}`));
      updated = true;
    } else if (customModule.sourcePath && !path.isAbsolute(customModule.sourcePath)) {
      // Source path exists but is not absolute
      const absolutePath = path.resolve(customModule.sourcePath);
      customModule.sourcePath = absolutePath;

      console.log(chalk.green(`  ✓ Updated ${customModule.id}: ${customModule.sourcePath} → ${absolutePath}`));
      updated = true;
    }
  }

  if (updated) {
    // Write back the updated manifest
    const yamlStr = yaml.dump(manifest, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      sortKeys: false,
    });

    await fs.writeFile(manifestPath, yamlStr);
    console.log(chalk.green('  Manifest updated successfully'));
  } else {
    console.log(chalk.dim('  All paths already absolute'));
  }

  return updated;
}

/**
 * Main migration function
 */
async function migrate(directory) {
  const projectRoot = path.resolve(directory || process.cwd());
  const bmadDir = findBmadDir(projectRoot);

  if (!bmadDir) {
    console.error(chalk.red('✗ No BMAD installation found in directory'));
    process.exit(1);
  }

  console.log(chalk.blue.bold('🔄 BMAD Custom Module Path Migration'));
  console.log(chalk.dim(`Project: ${projectRoot}`));
  console.log(chalk.dim(`BMAD Directory: ${bmadDir}`));

  const manifestPath = path.join(bmadDir, '_config', 'manifest.yaml');

  if (!fs.existsSync(manifestPath)) {
    console.error(chalk.red('✗ No manifest.yaml found'));
    process.exit(1);
  }

  const updated = await updateManifest(manifestPath, projectRoot);

  if (updated) {
    console.log(chalk.green.bold('\n✨ Migration completed successfully!'));
    console.log(chalk.dim('Custom modules now use absolute source paths.'));
  } else {
    console.log(chalk.yellow('\n⚠ No migration needed - paths already absolute'));
  }
}

// Run migration if called directly
if (require.main === module) {
  const directory = process.argv[2];
  migrate(directory).catch((error) => {
    console.error(chalk.red('\n✗ Migration failed:'), error.message);
    process.exit(1);
  });
}

module.exports = { migrate };

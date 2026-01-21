const chalk = require('chalk');
const path = require('node:path');
const fs = require('fs-extra');
const { select, text, confirm, isCancel } = require('../lib/prompts');

// Import scope management classes from core lib
// Note: These will be available after installation in _bmad/core/lib/scope/
// For CLI, we use them from src during development
const { ScopeManager } = require('../../../src/core/lib/scope/scope-manager');
const { ScopeInitializer } = require('../../../src/core/lib/scope/scope-initializer');
const { ScopeValidator } = require('../../../src/core/lib/scope/scope-validator');
const { ScopeSync } = require('../../../src/core/lib/scope/scope-sync');

/**
 * Format a date string for display
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Display scope list in a formatted table
 * @param {object[]} scopes - Array of scope objects
 */
function displayScopeList(scopes) {
  if (scopes.length === 0) {
    console.log(chalk.yellow('\nNo scopes found. Create one with: npx bmad-fh scope create <id>\n'));
    return;
  }

  console.log(chalk.bold('\n  Scopes:\n'));

  // Calculate column widths
  const idWidth = Math.max(10, ...scopes.map((s) => s.id.length)) + 2;
  const nameWidth = Math.max(15, ...scopes.map((s) => (s.name || '').length)) + 2;

  // Header
  console.log(
    chalk.dim('  ') +
      chalk.bold('ID'.padEnd(idWidth)) +
      chalk.bold('Name'.padEnd(nameWidth)) +
      chalk.bold('Status'.padEnd(10)) +
      chalk.bold('Created'),
  );
  console.log(chalk.dim('  ' + '─'.repeat(idWidth + nameWidth + 10 + 20)));

  // Rows
  for (const scope of scopes) {
    const statusColor = scope.status === 'active' ? chalk.green : chalk.dim;
    console.log(
      '  ' +
        chalk.cyan(scope.id.padEnd(idWidth)) +
        (scope.name || scope.id).padEnd(nameWidth) +
        statusColor(scope.status.padEnd(10)) +
        chalk.dim(formatDate(scope.created).split(' ')[0]),
    );
  }
  console.log();
}

/**
 * Display detailed scope info
 * @param {object} scope - Scope object
 * @param {object} paths - Scope paths
 * @param {object} tree - Dependency tree
 */
function displayScopeInfo(scope, paths, tree) {
  console.log(chalk.bold(`\n  Scope: ${scope.name || scope.id}\n`));

  console.log(chalk.dim('  ─────────────────────────────────────'));
  console.log(`  ${chalk.bold('ID:')}           ${chalk.cyan(scope.id)}`);
  console.log(`  ${chalk.bold('Name:')}         ${scope.name || 'N/A'}`);
  console.log(`  ${chalk.bold('Description:')}  ${scope.description || 'No description'}`);
  console.log(`  ${chalk.bold('Status:')}       ${scope.status === 'active' ? chalk.green('active') : chalk.dim('archived')}`);
  console.log(`  ${chalk.bold('Created:')}      ${formatDate(scope.created)}`);
  console.log(`  ${chalk.bold('Last Active:')}  ${formatDate(scope._meta?.last_activity)}`);
  console.log(`  ${chalk.bold('Artifacts:')}    ${scope._meta?.artifact_count || 0}`);

  console.log(chalk.dim('\n  ─────────────────────────────────────'));
  console.log(chalk.bold('  Paths:'));
  console.log(`    Planning:       ${chalk.dim(paths.planning)}`);
  console.log(`    Implementation: ${chalk.dim(paths.implementation)}`);
  console.log(`    Tests:          ${chalk.dim(paths.tests)}`);

  console.log(chalk.dim('\n  ─────────────────────────────────────'));
  console.log(chalk.bold('  Dependencies:'));
  if (tree.dependencies.length > 0) {
    for (const dep of tree.dependencies) {
      const statusIcon = dep.status === 'active' ? chalk.green('●') : chalk.dim('○');
      console.log(`    ${statusIcon} ${dep.scope} (${dep.name})`);
    }
  } else {
    console.log(chalk.dim('    None'));
  }

  console.log(chalk.bold('\n  Dependents (scopes that depend on this):'));
  if (tree.dependents.length > 0) {
    for (const dep of tree.dependents) {
      console.log(`    ← ${chalk.cyan(dep)}`);
    }
  } else {
    console.log(chalk.dim('    None'));
  }

  console.log();
}

/**
 * Handle 'list' subcommand
 */
async function handleList(projectRoot, options) {
  const manager = new ScopeManager({ projectRoot });
  const initializer = new ScopeInitializer({ projectRoot });

  // Check if system is initialized before trying to list
  const isInitialized = await initializer.isSystemInitialized();
  const configExists = await fs.pathExists(path.join(projectRoot, '_bmad', '_config', 'scopes.yaml'));

  if (!isInitialized || !configExists) {
    console.log(chalk.yellow('\nScope system not initialized. Run: npx bmad-fh scope init\n'));
    return;
  }

  try {
    await manager.initialize();
    const scopes = await manager.listScopes(options.status ? { status: options.status } : {});
    displayScopeList(scopes);
  } catch (error) {
    if (error.message.includes('does not exist')) {
      console.log(chalk.yellow('\nScope system not initialized. Run: npx bmad-fh scope init\n'));
    } else {
      throw error;
    }
  }
}

/**
 * Handle 'create' subcommand
 */
async function handleCreate(projectRoot, scopeId, options) {
  const manager = new ScopeManager({ projectRoot });
  const initializer = new ScopeInitializer({ projectRoot });
  const validator = new ScopeValidator();

  // If no scopeId provided, prompt for it
  if (!scopeId) {
    const inputId = await text({
      message: 'Enter scope ID (lowercase, letters/numbers/hyphens):',
      placeholder: 'e.g., auth, payments, user-service',
      validate: (value) => {
        const result = validator.validateScopeId(value);
        return result.valid ? undefined : result.error;
      },
    });

    if (isCancel(inputId)) {
      console.log(chalk.yellow('Cancelled.'));
      return;
    }
    scopeId = inputId;
  }

  // Validate scope ID
  const idValidation = validator.validateScopeId(scopeId);
  if (!idValidation.valid) {
    console.error(chalk.red(`Error: ${idValidation.error}`));
    process.exit(1);
  }

  // Get scope name if not provided
  let name = options.name;
  if (!name) {
    const inputName = await text({
      message: 'Enter scope name (human-readable):',
      placeholder: `e.g., Authentication Service`,
      initialValue: scopeId.charAt(0).toUpperCase() + scopeId.slice(1).replaceAll('-', ' '),
    });

    if (isCancel(inputName)) {
      console.log(chalk.yellow('Cancelled.'));
      return;
    }
    name = inputName;
  }

  // Get description if not provided (check for undefined specifically since empty string is valid)
  let description = options.description;
  if (description === undefined) {
    const inputDesc = await text({
      message: 'Enter scope description (optional):',
      placeholder: 'Brief description of this scope',
    });

    if (isCancel(inputDesc)) {
      console.log(chalk.yellow('Cancelled.'));
      return;
    }
    description = inputDesc || '';
  }

  console.log(chalk.blue('\nCreating scope...'));

  // Initialize scope system if needed
  await manager.initialize();

  // Check if system is initialized
  const systemInit = await initializer.isSystemInitialized();
  if (!systemInit) {
    console.log(chalk.blue('Initializing scope system...'));
    await initializer.initializeScopeSystem();
  }

  // Create scope in configuration and directory structure
  // Note: manager.createScope() now also calls initializer.initializeScope() internally
  const scope = await manager.createScope(scopeId, {
    name,
    description,
    dependencies: options.dependencies ? options.dependencies.split(',').map((d) => d.trim()) : [],
    createContext: options.context,
  });

  // Get paths for display
  const paths = initializer.getScopePaths(scopeId);

  console.log(chalk.green(`\n✓ Scope '${scopeId}' created successfully!\n`));
  console.log(chalk.dim('  Directories created:'));
  console.log(`    ${paths.planning}`);
  console.log(`    ${paths.implementation}`);
  console.log(`    ${paths.tests}`);
  console.log();

  // Prompt to set as active scope (critical UX improvement)
  const setActive = await confirm({
    message: `Set '${scopeId}' as your active scope for this session?`,
    initialValue: true,
  });

  if (!isCancel(setActive) && setActive) {
    const scopeFilePath = path.join(projectRoot, '.bmad-scope');
    const scopeContent = `# BMAD Active Scope Configuration
# This file is auto-generated. Do not edit manually.
# To change: npx bmad-fh scope set <scope-id>

active_scope: ${scopeId}
set_at: "${new Date().toISOString()}"
`;
    await fs.writeFile(scopeFilePath, scopeContent, 'utf8');
    console.log(chalk.green(`\n✓ Active scope set to '${scopeId}'`));
    console.log(chalk.dim('  Workflows will now use this scope automatically.\n'));
  } else {
    console.log(chalk.dim(`\n  To activate later, run: npx bmad-fh scope set ${scopeId}\n`));
  }
}

/**
 * Handle 'info' subcommand
 */
async function handleInfo(projectRoot, scopeId) {
  if (!scopeId) {
    console.error(chalk.red('Error: Scope ID is required. Usage: npx bmad-fh scope info <scope-id>'));
    process.exit(1);
  }

  const manager = new ScopeManager({ projectRoot });

  await manager.initialize();
  const scope = await manager.getScope(scopeId);

  if (!scope) {
    console.error(chalk.red(`Error: Scope '${scopeId}' not found.`));
    process.exit(1);
  }

  const paths = await manager.getScopePaths(scopeId);
  const tree = await manager.getDependencyTree(scopeId);

  displayScopeInfo(scope, paths, tree);
}

/**
 * Handle 'remove' subcommand
 */
async function handleRemove(projectRoot, scopeId, options) {
  if (!scopeId) {
    console.error(chalk.red('Error: Scope ID is required. Usage: npx bmad-fh scope remove <scope-id>'));
    process.exit(1);
  }

  const manager = new ScopeManager({ projectRoot });
  const initializer = new ScopeInitializer({ projectRoot });

  await manager.initialize();

  const scope = await manager.getScope(scopeId);
  if (!scope) {
    console.error(chalk.red(`Error: Scope '${scopeId}' not found.`));
    process.exit(1);
  }

  // Confirm removal unless --force
  if (!options.force) {
    const confirmed = await confirm({
      message: `Are you sure you want to remove scope '${scopeId}'? This will delete all scope artifacts!`,
      initialValue: false,
    });

    if (isCancel(confirmed) || !confirmed) {
      console.log(chalk.yellow('Cancelled.'));
      return;
    }
  }

  console.log(chalk.blue('\nRemoving scope...'));

  // Remove scope directory (with backup)
  // Note: Commander.js sets options.backup to false when --no-backup is passed
  const shouldBackup = options.backup !== false;
  await initializer.removeScope(scopeId, { backup: shouldBackup });

  // Remove from configuration
  await manager.removeScope(scopeId, { force: true });

  // Clean up .bmad-scope if this was the active scope
  const scopeFilePath = path.join(projectRoot, '.bmad-scope');
  if (await fs.pathExists(scopeFilePath)) {
    try {
      const content = await fs.readFile(scopeFilePath, 'utf8');
      const match = content.match(/active_scope:\s*(\S+)/);
      if (match && match[1] === scopeId) {
        await fs.remove(scopeFilePath);
        console.log(chalk.yellow(`\n  Note: Cleared active scope (was set to '${scopeId}')`));
      }
    } catch {
      // Ignore errors reading .bmad-scope
    }
  }

  console.log(chalk.green(`\n✓ Scope '${scopeId}' removed successfully!`));
  if (shouldBackup) {
    console.log(chalk.dim('  A backup was created in _bmad-output/'));
  }
  console.log();
}

/**
 * Handle 'init' subcommand - Initialize scope system
 */
async function handleInit(projectRoot) {
  const manager = new ScopeManager({ projectRoot });
  const initializer = new ScopeInitializer({ projectRoot });

  console.log(chalk.blue('\nInitializing scope system...'));

  await manager.initialize();
  await initializer.initializeScopeSystem();

  console.log(chalk.green('\n✓ Scope system initialized successfully!\n'));
  console.log(chalk.dim('  Created:'));
  console.log(`    ${chalk.cyan('_bmad/_config/scopes.yaml')} - Scope configuration`);
  console.log(`    ${chalk.cyan('_bmad-output/_shared/')} - Shared knowledge layer`);
  console.log(`    ${chalk.cyan('_bmad/_events/')} - Event system`);
  console.log();
  console.log(chalk.cyan('  Next: npx bmad-fh scope create <scope-id>'));
  console.log();
}

/**
 * Handle 'archive' subcommand
 */
async function handleArchive(projectRoot, scopeId) {
  if (!scopeId) {
    console.error(chalk.red('Error: Scope ID is required. Usage: npx bmad-fh scope archive <scope-id>'));
    process.exit(1);
  }

  const manager = new ScopeManager({ projectRoot });

  await manager.initialize();
  await manager.archiveScope(scopeId);

  console.log(chalk.green(`\n✓ Scope '${scopeId}' archived.\n`));
}

/**
 * Handle 'activate' subcommand
 */
async function handleActivate(projectRoot, scopeId) {
  if (!scopeId) {
    console.error(chalk.red('Error: Scope ID is required. Usage: npx bmad-fh scope activate <scope-id>'));
    process.exit(1);
  }

  const manager = new ScopeManager({ projectRoot });

  await manager.initialize();
  await manager.activateScope(scopeId);

  console.log(chalk.green(`\n✓ Scope '${scopeId}' activated.\n`));
}

/**
 * Handle 'sync-up' subcommand - Promote scope artifacts to shared layer
 */
async function handleSyncUp(projectRoot, scopeId, options) {
  if (!scopeId) {
    console.error(chalk.red('Error: Scope ID is required. Usage: npx bmad-fh scope sync-up <scope-id>'));
    process.exit(1);
  }

  const manager = new ScopeManager({ projectRoot });
  const sync = new ScopeSync({ projectRoot });

  await manager.initialize();

  // Verify scope exists
  const scope = await manager.getScope(scopeId);
  if (!scope) {
    console.error(chalk.red(`Error: Scope '${scopeId}' not found.`));
    process.exit(1);
  }

  // Handle dry-run mode
  if (options.dryRun) {
    console.log(chalk.blue(`\n[Dry Run] Analyzing artifacts in '${scopeId}' for promotion...`));

    // Get sync status to show what would be promoted
    const scopePath = path.join(projectRoot, '_bmad-output', scopeId);
    const promotablePatterns = ['architecture/*.md', 'contracts/*.md', 'principles/*.md', 'project-context.md'];

    console.log(chalk.yellow('\n  Would promote files matching these patterns:\n'));
    for (const pattern of promotablePatterns) {
      console.log(`    ${chalk.cyan('•')} ${pattern}`);
    }

    try {
      const status = await sync.getSyncStatus(scopeId);
      if (status.promotedCount > 0) {
        console.log(chalk.dim(`\n  Previously promoted: ${status.promotedCount} files`));
        for (const file of status.promotedFiles) {
          console.log(`    ${chalk.dim('✓')} ${file}`);
        }
      }
    } catch {
      // Ignore errors getting status
    }

    console.log(chalk.dim('\n  Run without --dry-run to execute.\n'));
    return;
  }

  console.log(chalk.blue(`\nPromoting artifacts from '${scopeId}' to shared layer...`));

  try {
    // syncUp signature: syncUp(scopeId, files = null, options = {})
    const syncOptions = {
      force: options.resolution === 'keep-local' ? false : true,
    };
    const result = await sync.syncUp(scopeId, null, syncOptions);

    if (result.success) {
      console.log(chalk.green('\n✓ Sync-up complete!\n'));
    } else {
      console.log(chalk.yellow('\n⚠ Sync-up completed with issues.\n'));
    }

    // Handle promoted files - result.promoted is array of { file, target }
    if (result.promoted && result.promoted.length > 0) {
      console.log(chalk.dim('  Promoted files:'));
      for (const item of result.promoted) {
        const displayFile = typeof item === 'string' ? item : item.file;
        console.log(`    ${chalk.cyan('→')} ${displayFile}`);
      }
    } else {
      console.log(chalk.dim('  No files to promote (already in sync or no promotable artifacts).'));
    }

    // Handle skipped files - result.skipped is array of { file, reason }
    if (result.skipped && result.skipped.length > 0) {
      console.log(chalk.dim('\n  Skipped files:'));
      for (const item of result.skipped) {
        const file = typeof item === 'string' ? item : item.file;
        const reason = typeof item === 'object' ? item.reason : 'unknown';
        console.log(`    ${chalk.yellow('○')} ${file} - ${reason}`);
      }
    }

    // Handle conflicts - result.conflicts is array of { file, source, target, resolution }
    if (result.conflicts && result.conflicts.length > 0) {
      console.log(chalk.yellow('\n  Conflicts detected:'));
      for (const conflict of result.conflicts) {
        const file = typeof conflict === 'string' ? conflict : conflict.file;
        console.log(`    ${chalk.yellow('!')} ${file}`);

        // Attempt to resolve conflict if resolution strategy provided
        if (options.resolution && options.resolution !== 'prompt') {
          const resolveResult = await sync.resolveConflict(conflict, options.resolution);
          if (resolveResult.success) {
            console.log(`      ${chalk.green('✓')} Resolved: ${resolveResult.action}`);
          } else {
            console.log(`      ${chalk.red('✗')} Failed: ${resolveResult.error}`);
          }
        } else {
          console.log(`      ${chalk.dim('Use --resolution to auto-resolve')}`);
        }
      }
    }

    // Handle errors - result.errors is array of { file, error } or { error }
    if (result.errors && result.errors.length > 0) {
      console.log(chalk.red('\n  Errors:'));
      for (const err of result.errors) {
        if (err.file) {
          console.log(`    ${chalk.red('✗')} ${err.file}: ${err.error}`);
        } else {
          console.log(`    ${chalk.red('✗')} ${err.error}`);
        }
      }
    }

    console.log();
  } catch (error) {
    console.error(chalk.red(`\nSync-up failed: ${error.message}`));
    if (process.env.DEBUG) {
      console.error(chalk.dim(error.stack));
    }
    process.exit(1);
  }
}

/**
 * Handle 'sync-down' subcommand - Pull shared layer updates into scope
 */
async function handleSyncDown(projectRoot, scopeId, options) {
  if (!scopeId) {
    console.error(chalk.red('Error: Scope ID is required. Usage: npx bmad-fh scope sync-down <scope-id>'));
    process.exit(1);
  }

  const manager = new ScopeManager({ projectRoot });
  const sync = new ScopeSync({ projectRoot });

  await manager.initialize();

  // Verify scope exists
  const scope = await manager.getScope(scopeId);
  if (!scope) {
    console.error(chalk.red(`Error: Scope '${scopeId}' not found.`));
    process.exit(1);
  }

  // Handle dry-run mode
  if (options.dryRun) {
    console.log(chalk.blue(`\n[Dry Run] Analyzing shared layer for updates to '${scopeId}'...`));

    try {
      const status = await sync.getSyncStatus(scopeId);
      console.log(chalk.dim(`\n  Last sync-down: ${status.lastSyncDown || 'Never'}`));
      if (status.pulledCount > 0) {
        console.log(chalk.dim(`  Previously pulled: ${status.pulledCount} files`));
        for (const file of status.pulledFiles) {
          console.log(`    ${chalk.dim('✓')} ${file}`);
        }
      }
    } catch {
      // Ignore errors getting status
    }

    console.log(chalk.dim('\n  Run without --dry-run to execute.\n'));
    return;
  }

  console.log(chalk.blue(`\nPulling shared layer updates into '${scopeId}'...`));

  try {
    // syncDown signature: syncDown(scopeId, options = {})
    const syncOptions = {
      force: options.resolution === 'keep-shared',
      resolution: options.resolution || 'keep-local',
    };
    const result = await sync.syncDown(scopeId, syncOptions);

    if (result.success) {
      console.log(chalk.green('\n✓ Sync-down complete!\n'));
    } else {
      console.log(chalk.yellow('\n⚠ Sync-down completed with issues.\n'));
    }

    // Handle pulled files - result.pulled is array of { file, scope, target }
    if (result.pulled && result.pulled.length > 0) {
      console.log(chalk.dim('  Pulled files:'));
      for (const item of result.pulled) {
        const displayFile = typeof item === 'string' ? item : `${item.scope}/${item.file}`;
        console.log(`    ${chalk.cyan('←')} ${displayFile}`);
      }
    } else {
      console.log(chalk.dim('  No new files to pull.'));
    }

    // Handle up-to-date files - result.upToDate is array of { file, scope }
    if (result.upToDate && result.upToDate.length > 0) {
      console.log(chalk.dim('\n  Already up-to-date:'));
      for (const item of result.upToDate) {
        const displayFile = typeof item === 'string' ? item : `${item.scope}/${item.file}`;
        console.log(`    ${chalk.green('✓')} ${displayFile}`);
      }
    }

    // Handle conflicts - result.conflicts is array of { file, scope, local, shared, resolution }
    if (result.conflicts && result.conflicts.length > 0) {
      console.log(chalk.yellow('\n  Conflicts detected:'));
      for (const conflict of result.conflicts) {
        const file = typeof conflict === 'string' ? conflict : `${conflict.scope}/${conflict.file}`;
        console.log(`    ${chalk.yellow('!')} ${file}`);

        // Attempt to resolve conflict if resolution strategy provided
        if (options.resolution && options.resolution !== 'prompt') {
          const resolveResult = await sync.resolveConflict(conflict, options.resolution);
          if (resolveResult.success) {
            console.log(`      ${chalk.green('✓')} Resolved: ${resolveResult.action}`);
          } else {
            console.log(`      ${chalk.red('✗')} Failed: ${resolveResult.error}`);
          }
        } else {
          console.log(`      ${chalk.dim('Use --resolution to auto-resolve')}`);
        }
      }
    }

    // Handle errors - result.errors is array of { file, error } or { error }
    if (result.errors && result.errors.length > 0) {
      console.log(chalk.red('\n  Errors:'));
      for (const err of result.errors) {
        if (err.file) {
          console.log(`    ${chalk.red('✗')} ${err.file}: ${err.error}`);
        } else {
          console.log(`    ${chalk.red('✗')} ${err.error}`);
        }
      }
    }

    console.log();
  } catch (error) {
    console.error(chalk.red(`\nSync-down failed: ${error.message}`));
    if (process.env.DEBUG) {
      console.error(chalk.dim(error.stack));
    }
    process.exit(1);
  }
}

/**
 * Handle 'set' subcommand - Set the active scope for the session
 */
async function handleSet(projectRoot, scopeId, options) {
  const manager = new ScopeManager({ projectRoot });
  const scopeFilePath = path.join(projectRoot, '.bmad-scope');

  // If no scopeId provided, show current scope or prompt
  if (!scopeId) {
    // Check if there's a current scope
    try {
      if (await fs.pathExists(scopeFilePath)) {
        const content = await fs.readFile(scopeFilePath, 'utf8');
        const match = content.match(/active_scope:\s*(\S+)/);
        if (match) {
          console.log(chalk.blue(`\nCurrent active scope: ${chalk.cyan(match[1])}\n`));

          // Offer to change
          const scopes = await manager.listScopes({ status: 'active' });
          if (scopes.length === 0) {
            console.log(chalk.yellow('No active scopes available. Create one with: npx bmad-fh scope create <id>\n'));
            return;
          }

          const choices = scopes.map((s) => ({ value: s.id, label: `${s.id} - ${s.name || 'No name'}` }));
          choices.push({ value: '__clear__', label: 'Clear active scope' });

          const selected = await select({
            message: 'Select scope to activate:',
            options: choices,
          });

          if (isCancel(selected)) {
            console.log(chalk.yellow('Cancelled.'));
            return;
          }

          if (selected === '__clear__') {
            await fs.remove(scopeFilePath);
            console.log(chalk.green('\n✓ Active scope cleared.\n'));
            return;
          }

          scopeId = selected;
        }
      } else {
        // No current scope, prompt to select
        await manager.initialize();
        const scopes = await manager.listScopes({ status: 'active' });

        if (scopes.length === 0) {
          console.log(chalk.yellow('\nNo scopes available. Create one first:\n'));
          console.log(`  ${chalk.cyan('npx bmad-fh scope create <id>')}\n`);
          return;
        }

        const choices = scopes.map((s) => ({ value: s.id, label: `${s.id} - ${s.name || 'No name'}` }));

        const selected = await select({
          message: 'Select scope to activate:',
          options: choices,
        });

        if (isCancel(selected)) {
          console.log(chalk.yellow('Cancelled.'));
          return;
        }

        scopeId = selected;
      }
    } catch (error) {
      if (error.message.includes('does not exist')) {
        console.log(chalk.yellow('\nScope system not initialized. Run: npx bmad-fh scope init\n'));
        return;
      }
      throw error;
    }
  }

  // Validate scope exists
  try {
    await manager.initialize();
    const scope = await manager.getScope(scopeId);

    if (!scope) {
      console.error(chalk.red(`\nError: Scope '${scopeId}' not found.`));
      console.log(chalk.dim('Available scopes:'));
      const scopes = await manager.listScopes({ status: 'active' });
      for (const s of scopes) {
        console.log(`  ${chalk.cyan(s.id)} - ${s.name || 'No name'}`);
      }
      console.log();
      process.exit(1);
    }

    if (scope.status === 'archived') {
      console.error(chalk.yellow(`\nWarning: Scope '${scopeId}' is archived. Activate it first with:`));
      console.log(`  ${chalk.cyan(`npx bmad-fh scope activate ${scopeId}`)}\n`);

      const proceed = await confirm({
        message: 'Set as active scope anyway?',
        initialValue: false,
      });

      if (isCancel(proceed) || !proceed) {
        console.log(chalk.yellow('Cancelled.'));
        return;
      }
    }
  } catch (error) {
    if (error.message.includes('does not exist')) {
      console.log(chalk.yellow('\nScope system not initialized. Run: npx bmad-fh scope init\n'));
      return;
    }
    throw error;
  }

  // Write .bmad-scope file
  const scopeContent = `# BMAD Active Scope Configuration
# This file is auto-generated. Do not edit manually.
# To change: npx bmad-fh scope set <scope-id>

active_scope: ${scopeId}
set_at: "${new Date().toISOString()}"
`;

  await fs.writeFile(scopeFilePath, scopeContent, 'utf8');

  console.log(chalk.green(`\n✓ Active scope set to '${scopeId}'`));
  console.log(chalk.dim(`  File: ${scopeFilePath}`));
  console.log(chalk.dim('\n  Workflows will now use this scope automatically.'));
  console.log(chalk.dim('  You can also use BMAD_SCOPE environment variable to override.\n'));
}

/**
 * Handle 'unset' subcommand - Clear the active scope
 */
async function handleUnset(projectRoot) {
  const scopeFilePath = path.join(projectRoot, '.bmad-scope');

  if (await fs.pathExists(scopeFilePath)) {
    await fs.remove(scopeFilePath);
    console.log(chalk.green('\n✓ Active scope cleared.\n'));
    console.log(chalk.dim('  Workflows will now prompt for scope selection.\n'));
  } else {
    console.log(chalk.yellow('\n  No active scope is set.\n'));
  }
}

/**
 * Show comprehensive help for scope command
 */
function showHelp() {
  console.log(chalk.bold('\n  BMAD Scope Management'));
  console.log(chalk.dim('  ═══════════════════════════════════════════════════════════════════════════\n'));

  // Overview
  console.log(chalk.bold('  OVERVIEW\n'));
  console.log('  The scope system enables parallel development by isolating artifacts into');
  console.log('  separate workspaces. Each scope maintains its own planning artifacts,');
  console.log('  implementation artifacts, tests, and optionally a scope-specific context.\n');

  console.log(chalk.dim('  Key Benefits:'));
  console.log('    • Run multiple workflows in parallel across different terminal sessions');
  console.log('    • Isolated artifacts prevent cross-contamination between features/services');
  console.log('    • Shared knowledge layer for cross-cutting concerns and contracts');
  console.log('    • Event system notifies dependent scopes of changes');
  console.log('    • Session-sticky scope context for seamless workflow integration\n');

  console.log(chalk.dim('  ─────────────────────────────────────────────────────────────────────────────\n'));

  // Commands
  console.log(chalk.bold('  COMMANDS\n'));
  console.log(`    ${chalk.cyan('init')}                   Initialize scope system in current project`);
  console.log(`    ${chalk.cyan('list')} ${chalk.dim('[options]')}        List all scopes (aliases: ls)`);
  console.log(`    ${chalk.cyan('create')} ${chalk.dim('[id] [opts]')}    Create a new scope (aliases: new)`);
  console.log(`    ${chalk.cyan('info')} ${chalk.dim('<id>')}             Show detailed scope information (aliases: show)`);
  console.log(`    ${chalk.cyan('remove')} ${chalk.dim('<id> [opts]')}    Remove a scope and its artifacts (aliases: rm, delete)`);
  console.log(`    ${chalk.cyan('archive')} ${chalk.dim('<id>')}          Archive a scope (preserves artifacts, excludes from list)`);
  console.log(`    ${chalk.cyan('activate')} ${chalk.dim('<id>')}         Reactivate an archived scope`);
  console.log(`    ${chalk.cyan('set')} ${chalk.dim('[id]')}              Set active scope for session (alias: use)`);
  console.log(`    ${chalk.cyan('unset')}                    Clear active scope (alias: clear)`);
  console.log(`    ${chalk.cyan('sync-up')} ${chalk.dim('<id> [opts]')}    Promote scope artifacts to shared layer (alias: syncup)`);
  console.log(`    ${chalk.cyan('sync-down')} ${chalk.dim('<id> [opts]')}  Pull shared layer updates into scope (alias: syncdown)`);
  console.log(`    ${chalk.cyan('help')} ${chalk.dim('[command]')}        Show help (add command name for detailed help)`);
  console.log();

  console.log(chalk.dim('  ─────────────────────────────────────────────────────────────────────────────\n'));

  // Options
  console.log(chalk.bold('  OPTIONS\n'));
  console.log(chalk.dim('  Create options:'));
  console.log(`    ${chalk.cyan('-n, --name')} ${chalk.dim('<name>')}          Human-readable scope name`);
  console.log(`    ${chalk.cyan('-d, --description')} ${chalk.dim('<text>')}   Brief description of scope purpose`);
  console.log(`    ${chalk.cyan('--deps')} ${chalk.dim('<ids>')}               Comma-separated dependency scope IDs`);
  console.log(`    ${chalk.cyan('--context')}                   Create scope-specific project-context.md\n`);

  console.log(chalk.dim('  Remove options:'));
  console.log(`    ${chalk.cyan('-f, --force')}                 Skip confirmation prompt`);
  console.log(`    ${chalk.cyan('--no-backup')}                 Don't create backup before removal\n`);

  console.log(chalk.dim('  List options:'));
  console.log(`    ${chalk.cyan('-s, --status')} ${chalk.dim('<status>')}      Filter by status (active|archived)\n`);

  console.log(chalk.dim('  Sync options:'));
  console.log(`    ${chalk.cyan('--dry-run')}                   Show what would be synced without changes`);
  console.log(
    `    ${chalk.cyan('--resolution')} ${chalk.dim('<strategy>')}    Conflict resolution: keep-local|keep-shared|backup-and-update\n`,
  );

  console.log(chalk.dim('  ─────────────────────────────────────────────────────────────────────────────\n'));

  // Quick Start
  console.log(chalk.bold('  QUICK START\n'));
  console.log(chalk.dim('  1. Initialize the scope system:'));
  console.log(`     ${chalk.green('$')} npx bmad-fh scope init\n`);
  console.log(chalk.dim('  2. Create your first scope:'));
  console.log(`     ${chalk.green('$')} npx bmad-fh scope create auth --name "Authentication Service"\n`);
  console.log(chalk.dim('  3. Set the active scope for your session:'));
  console.log(`     ${chalk.green('$')} npx bmad-fh scope set auth\n`);
  console.log(chalk.dim('  4. Run workflows - artifacts go to scope directory:'));
  console.log(`     Workflows automatically detect scope from .bmad-scope`);
  console.log(`     Your PRD, architecture, etc. are isolated in _bmad-output/auth/\n`);
  console.log(chalk.dim('  Alternative: Use BMAD_SCOPE environment variable to override:\n'));
  console.log(`     ${chalk.green('$')} BMAD_SCOPE=auth npx bmad-fh ...\n`);

  console.log(chalk.dim('  ─────────────────────────────────────────────────────────────────────────────\n'));

  // Examples
  console.log(chalk.bold('  EXAMPLES\n'));
  console.log(chalk.dim('  Basic workflow:'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope init`);
  console.log(`    ${chalk.green('$')} npx bmad-fh scope create auth --name "Auth" --description "User authentication"`);
  console.log(`    ${chalk.green('$')} npx bmad-fh scope create payments --name "Payments" --deps auth`);
  console.log(`    ${chalk.green('$')} npx bmad-fh scope list\n`);

  console.log(chalk.dim('  Parallel development (two terminals):'));
  console.log(`    ${chalk.green('# Terminal 1:')}                       ${chalk.green('# Terminal 2:')}`);
  console.log(`    ${chalk.dim('$')} npx bmad-fh scope create auth      ${chalk.dim('$')} npx bmad-fh scope create payments`);
  console.log(`    ${chalk.dim('# Run PRD workflow for auth')}          ${chalk.dim('# Run PRD workflow for payments')}\n`);

  console.log(chalk.dim('  Sharing artifacts between scopes:'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope sync-up auth              ${chalk.dim('# Promote auth artifacts to _shared/')}`);
  console.log(`    ${chalk.green('$')} npx bmad-fh scope sync-down payments        ${chalk.dim('# Pull shared updates into payments')}\n`);

  console.log(chalk.dim('  Lifecycle management:'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope archive auth              ${chalk.dim('# Archive when feature is complete')}`);
  console.log(`    ${chalk.green('$')} npx bmad-fh scope activate auth             ${chalk.dim('# Reactivate if needed later')}`);
  console.log(`    ${chalk.green('$')} npx bmad-fh scope remove auth               ${chalk.dim('# Remove with backup')}`);
  console.log(`    ${chalk.green('$')} npx bmad-fh scope remove auth --force --no-backup  ${chalk.dim('# Force remove')}\n`);

  console.log(chalk.dim('  ─────────────────────────────────────────────────────────────────────────────\n'));

  // Directory Structure
  console.log(chalk.bold('  DIRECTORY STRUCTURE\n'));
  console.log(chalk.dim('  After initialization and scope creation:'));
  console.log();
  console.log('    project-root/');
  console.log('    ├── _bmad/');
  console.log('    │   ├── _config/');
  console.log(`    │   │   └── ${chalk.cyan('scopes.yaml')}          ${chalk.dim('# Scope registry and settings')}`);
  console.log('    │   └── _events/');
  console.log(`    │       ├── ${chalk.cyan('event-log.yaml')}       ${chalk.dim('# Event history')}`);
  console.log(`    │       └── ${chalk.cyan('subscriptions.yaml')}   ${chalk.dim('# Cross-scope subscriptions')}`);
  console.log('    │');
  console.log('    ├── _bmad-output/');
  console.log(`    │   ├── ${chalk.yellow('_shared/')}                ${chalk.dim('# Shared knowledge layer')}`);
  console.log(`    │   │   ├── ${chalk.cyan('project-context.md')}   ${chalk.dim('# Global project context')}`);
  console.log(`    │   │   ├── contracts/            ${chalk.dim('# Integration contracts')}`);
  console.log(`    │   │   └── principles/           ${chalk.dim('# Architecture principles')}`);
  console.log('    │   │');
  console.log(`    │   ├── ${chalk.green('auth/')}                   ${chalk.dim('# Auth scope artifacts')}`);
  console.log('    │   │   ├── planning-artifacts/');
  console.log('    │   │   ├── implementation-artifacts/');
  console.log('    │   │   ├── tests/');
  console.log(`    │   │   └── ${chalk.cyan('project-context.md')}   ${chalk.dim('# Scope-specific context (optional)')}`);
  console.log('    │   │');
  console.log(`    │   └── ${chalk.green('payments/')}               ${chalk.dim('# Payments scope artifacts')}`);
  console.log('    │       └── ...');
  console.log('    │');
  console.log(`    └── ${chalk.cyan('.bmad-scope')}                  ${chalk.dim('# Session-sticky active scope (gitignored)')}`);
  console.log();

  console.log(chalk.dim('  ─────────────────────────────────────────────────────────────────────────────\n'));

  // Access Model
  console.log(chalk.bold('  ACCESS MODEL\n'));
  console.log('  Scopes follow a "read-any, write-own" isolation model:\n');
  console.log('    ┌─────────────┬─────────────────┬─────────────────┬─────────────┐');
  console.log('    │  Operation  │  Own Scope      │  Other Scopes   │  _shared/   │');
  console.log('    ├─────────────┼─────────────────┼─────────────────┼─────────────┤');
  console.log(
    `    │  ${chalk.green('Read')}       │  ${chalk.green('✓ Allowed')}      │  ${chalk.green('✓ Allowed')}      │  ${chalk.green('✓ Allowed')}  │`,
  );
  console.log(
    `    │  ${chalk.red('Write')}      │  ${chalk.green('✓ Allowed')}      │  ${chalk.red('✗ Blocked')}      │  ${chalk.yellow('via sync-up')} │`,
  );
  console.log('    └─────────────┴─────────────────┴─────────────────┴─────────────┘\n');

  console.log(chalk.dim('  Isolation modes (configure in scopes.yaml):'));
  console.log(`    • ${chalk.cyan('strict')}      - Block cross-scope writes (default, recommended)`);
  console.log(`    • ${chalk.cyan('warn')}        - Allow with warnings`);
  console.log(`    • ${chalk.cyan('permissive')}  - Allow all (not recommended)\n`);

  console.log(chalk.dim('  ─────────────────────────────────────────────────────────────────────────────\n'));

  // Workflow Integration
  console.log(chalk.bold('  WORKFLOW INTEGRATION\n'));
  console.log('  Workflows automatically detect and use scope context:\n');
  console.log(chalk.dim('  Resolution order:'));
  console.log('    1. Explicit --scope flag in workflow command');
  console.log('    2. Session context from .bmad-scope file');
  console.log('    3. BMAD_SCOPE environment variable');
  console.log('    4. Prompt user to select or create scope\n');

  console.log(chalk.dim('  Scope-aware path variables in workflows:'));
  console.log(`    • ${chalk.cyan('{scope}')}                 → Scope ID (e.g., "auth")`);
  console.log(`    • ${chalk.cyan('{scope_path}')}            → _bmad-output/auth`);
  console.log(`    • ${chalk.cyan('{scope_planning}')}        → _bmad-output/auth/planning-artifacts`);
  console.log(`    • ${chalk.cyan('{scope_implementation}')}  → _bmad-output/auth/implementation-artifacts`);
  console.log(`    • ${chalk.cyan('{scope_tests}')}           → _bmad-output/auth/tests\n`);

  console.log(chalk.dim('  ─────────────────────────────────────────────────────────────────────────────\n'));

  // Use Cases
  console.log(chalk.bold('  USE CASES\n'));
  console.log(chalk.dim('  Multi-team projects:'));
  console.log('    Each team creates their own scope. Shared contracts and architecture');
  console.log('    principles live in _shared/ and are synced as needed.\n');

  console.log(chalk.dim('  Microservices architecture:'));
  console.log('    One scope per service. Use dependencies to track service relationships.');
  console.log('    Contracts define APIs between services.\n');

  console.log(chalk.dim('  Parallel feature development:'));
  console.log('    Create scope per major feature. Develop PRD, architecture, and stories');
  console.log('    independently, then merge to main codebase.\n');

  console.log(chalk.dim('  Experimentation/Spikes:'));
  console.log('    Create a scope for experiments. Archive or remove when done.\n');

  console.log(chalk.dim('  ─────────────────────────────────────────────────────────────────────────────\n'));

  // Troubleshooting
  console.log(chalk.bold('  TROUBLESHOOTING\n'));
  console.log(chalk.dim('  "Scope system not initialized":'));
  console.log(`    Run: ${chalk.cyan('npx bmad-fh scope init')}\n`);

  console.log(chalk.dim('  "Cannot write to scope X while in scope Y":'));
  console.log('    You are in strict isolation mode. Either:');
  console.log('    • Switch to the correct scope');
  console.log('    • Use sync-up to promote artifacts to _shared/');
  console.log('    • Change isolation_mode in scopes.yaml (not recommended)\n');

  console.log(chalk.dim('  "No scope set" when running workflow:'));
  console.log(`    • Create and use a scope: ${chalk.cyan('npx bmad-fh scope create myfeature')}`);
  console.log('    • Or run workflow with --scope flag\n');

  console.log(chalk.dim('  "Circular dependency detected":'));
  console.log('    Scope A depends on B which depends on A. Remove one dependency.\n');

  console.log(chalk.dim('  Debug mode:'));
  console.log(`    Set ${chalk.cyan('DEBUG=true')} environment variable for verbose output.\n`);

  console.log(chalk.dim('  ─────────────────────────────────────────────────────────────────────────────\n'));

  // More Help
  console.log(chalk.bold('  MORE HELP\n'));
  console.log(`    ${chalk.cyan('npx bmad-fh scope help init')}       ${chalk.dim('# Detailed help for init command')}`);
  console.log(`    ${chalk.cyan('npx bmad-fh scope help create')}     ${chalk.dim('# Detailed help for create command')}`);
  console.log(`    ${chalk.cyan('npx bmad-fh scope help sync-up')}    ${chalk.dim('# Detailed help for sync operations')}\n`);

  console.log(chalk.dim('  Documentation:'));
  console.log(`    • Multi-Scope Guide: ${chalk.cyan('docs/multi-scope-guide.md')}`);
  console.log(`    • Full docs: ${chalk.cyan('http://docs.bmad-method.org')}\n`);
}

/**
 * Show detailed help for 'init' subcommand
 */
function showHelpInit() {
  console.log(chalk.bold('\n  bmad scope init'));
  console.log(chalk.dim('  ═══════════════════════════════════════════════════════════════════════════\n'));

  console.log(chalk.bold('  DESCRIPTION\n'));
  console.log('  Initialize the multi-scope system in your project. This command creates the');
  console.log('  necessary configuration files and directory structure for scope management.\n');

  console.log(chalk.bold('  USAGE\n'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope init\n`);

  console.log(chalk.bold('  WHAT IT CREATES\n'));
  console.log(`    ${chalk.cyan('_bmad/_config/scopes.yaml')}     Configuration file with scope registry`);
  console.log(`    ${chalk.cyan('_bmad/_events/')}                Event system directory`);
  console.log(`    ${chalk.cyan('_bmad-output/_shared/')}         Shared knowledge layer\n`);

  console.log(chalk.bold('  NOTES\n'));
  console.log('  • Safe to run multiple times - will not overwrite existing config');
  console.log('  • Required before creating any scopes');
  console.log('  • Automatically run by "scope create" if not initialized\n');

  console.log(chalk.bold('  EXAMPLE\n'));
  console.log(`    ${chalk.green('$')} cd my-project`);
  console.log(`    ${chalk.green('$')} npx bmad-fh scope init`);
  console.log(`    ${chalk.dim('✓ Scope system initialized successfully!')}\n`);
}

/**
 * Show detailed help for 'create' subcommand
 */
function showHelpCreate() {
  console.log(chalk.bold('\n  bmad scope create'));
  console.log(chalk.dim('  ═══════════════════════════════════════════════════════════════════════════\n'));

  console.log(chalk.bold('  DESCRIPTION\n'));
  console.log('  Create a new isolated scope for parallel development. Each scope has its own');
  console.log('  directory structure for artifacts and can optionally declare dependencies on');
  console.log('  other scopes.\n');

  console.log(chalk.bold('  USAGE\n'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope create [id] [options]\n`);

  console.log(chalk.bold('  ARGUMENTS\n'));
  console.log(`    ${chalk.cyan('id')}    Scope identifier (lowercase letters, numbers, hyphens)`);
  console.log('          If omitted, you will be prompted interactively\n');

  console.log(chalk.bold('  OPTIONS\n'));
  console.log(`    ${chalk.cyan('-n, --name')} ${chalk.dim('<name>')}`);
  console.log('          Human-readable name for the scope');
  console.log('          Example: --name "Authentication Service"\n');

  console.log(`    ${chalk.cyan('-d, --description')} ${chalk.dim('<text>')}`);
  console.log('          Brief description of the scope purpose');
  console.log('          Example: --description "Handles user auth, SSO, and sessions"\n');

  console.log(`    ${chalk.cyan('--deps, --dependencies')} ${chalk.dim('<ids>')}`);
  console.log('          Comma-separated list of scope IDs this scope depends on');
  console.log('          Example: --deps auth,users,notifications\n');

  console.log(`    ${chalk.cyan('--context')}`);
  console.log('          Create a scope-specific project-context.md file');
  console.log('          Useful when scope needs its own context extending global\n');

  console.log(chalk.bold('  SCOPE ID RULES\n'));
  console.log('  • Lowercase letters, numbers, and hyphens only');
  console.log('  • Must start with a letter');
  console.log('  • Cannot use reserved names: _shared, _backup, _config, _events');
  console.log('  • Maximum 50 characters\n');

  console.log(chalk.bold('  EXAMPLES\n'));
  console.log(chalk.dim('  Interactive mode (prompts for all fields):'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope create\n`);

  console.log(chalk.dim('  Quick create with ID only:'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope create auth\n`);

  console.log(chalk.dim('  Full specification:'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope create payments \\`);
  console.log(`         --name "Payment Processing" \\`);
  console.log(`         --description "Stripe integration, invoicing, subscriptions" \\`);
  console.log(`         --deps auth,users \\`);
  console.log(`         --context\n`);

  console.log(chalk.bold('  WHAT IT CREATES\n'));
  console.log('    _bmad-output/{scope-id}/');
  console.log('    ├── planning-artifacts/       # PRDs, architecture docs');
  console.log('    ├── implementation-artifacts/ # Sprint status, stories');
  console.log('    ├── tests/                    # Test artifacts');
  console.log('    └── project-context.md        # If --context specified\n');
}

/**
 * Show detailed help for 'list' subcommand
 */
function showHelpList() {
  console.log(chalk.bold('\n  bmad scope list'));
  console.log(chalk.dim('  ═══════════════════════════════════════════════════════════════════════════\n'));

  console.log(chalk.bold('  DESCRIPTION\n'));
  console.log('  List all scopes in the project with their status and metadata.\n');

  console.log(chalk.bold('  USAGE\n'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope list [options]`);
  console.log(`    ${chalk.green('$')} npx bmad-fh scope ls [options]    ${chalk.dim('# alias')}\n`);

  console.log(chalk.bold('  OPTIONS\n'));
  console.log(`    ${chalk.cyan('-s, --status')} ${chalk.dim('<status>')}`);
  console.log('          Filter by scope status');
  console.log('          Values: active, archived\n');

  console.log(chalk.bold('  OUTPUT COLUMNS\n'));
  console.log(`    ${chalk.cyan('ID')}        Scope identifier`);
  console.log(`    ${chalk.cyan('Name')}      Human-readable name`);
  console.log(`    ${chalk.cyan('Status')}    active or archived`);
  console.log(`    ${chalk.cyan('Created')}   Creation date\n`);

  console.log(chalk.bold('  EXAMPLES\n'));
  console.log(chalk.dim('  List all scopes:'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope list\n`);

  console.log(chalk.dim('  List only active scopes:'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope list --status active\n`);

  console.log(chalk.dim('  List archived scopes:'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope ls -s archived\n`);
}

/**
 * Show detailed help for 'info' subcommand
 */
function showHelpInfo() {
  console.log(chalk.bold('\n  bmad scope info'));
  console.log(chalk.dim('  ═══════════════════════════════════════════════════════════════════════════\n'));

  console.log(chalk.bold('  DESCRIPTION\n'));
  console.log('  Display detailed information about a specific scope including paths,');
  console.log('  dependencies, dependents, and metadata.\n');

  console.log(chalk.bold('  USAGE\n'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope info <id>`);
  console.log(`    ${chalk.green('$')} npx bmad-fh scope show <id>    ${chalk.dim('# alias')}`);
  console.log(`    ${chalk.green('$')} npx bmad-fh scope <id>         ${chalk.dim('# shorthand')}\n`);

  console.log(chalk.bold('  ARGUMENTS\n'));
  console.log(`    ${chalk.cyan('id')}    Scope identifier (required)\n`);

  console.log(chalk.bold('  DISPLAYED INFORMATION\n'));
  console.log('  • Basic info: ID, name, description, status');
  console.log('  • Timestamps: Created, last activity');
  console.log('  • Metrics: Artifact count');
  console.log('  • Paths: Planning, implementation, tests directories');
  console.log('  • Dependencies: Scopes this scope depends on');
  console.log('  • Dependents: Scopes that depend on this scope\n');

  console.log(chalk.bold('  EXAMPLES\n'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope info auth`);
  console.log(`    ${chalk.green('$')} npx bmad-fh scope auth          ${chalk.dim('# shorthand')}\n`);
}

/**
 * Show detailed help for 'remove' subcommand
 */
function showHelpRemove() {
  console.log(chalk.bold('\n  bmad scope remove'));
  console.log(chalk.dim('  ═══════════════════════════════════════════════════════════════════════════\n'));

  console.log(chalk.bold('  DESCRIPTION\n'));
  console.log('  Remove a scope and optionally its artifacts. By default, creates a backup');
  console.log('  before removal and prompts for confirmation.\n');

  console.log(chalk.bold('  USAGE\n'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope remove <id> [options]`);
  console.log(`    ${chalk.green('$')} npx bmad-fh scope rm <id>       ${chalk.dim('# alias')}`);
  console.log(`    ${chalk.green('$')} npx bmad-fh scope delete <id>   ${chalk.dim('# alias')}\n`);

  console.log(chalk.bold('  ARGUMENTS\n'));
  console.log(`    ${chalk.cyan('id')}    Scope identifier to remove (required)\n`);

  console.log(chalk.bold('  OPTIONS\n'));
  console.log(`    ${chalk.cyan('-f, --force')}`);
  console.log('          Skip confirmation prompt\n');

  console.log(`    ${chalk.cyan('--no-backup')}`);
  console.log('          Do not create backup before removal');
  console.log(`          ${chalk.red('Warning: Artifacts will be permanently deleted!')}\n`);

  console.log(chalk.bold('  BACKUP LOCATION\n'));
  console.log('  Backups are created at: _bmad-output/_backup_{id}_{timestamp}/\n');

  console.log(chalk.bold('  EXAMPLES\n'));
  console.log(chalk.dim('  Safe removal (prompts, creates backup):'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope remove auth\n`);

  console.log(chalk.dim('  Force removal without prompt (still creates backup):'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope rm auth --force\n`);

  console.log(chalk.dim('  Permanent removal (no backup, no prompt):'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope delete auth --force --no-backup\n`);

  console.log(chalk.bold('  CONSIDERATIONS\n'));
  console.log('  • Check dependents first: scopes depending on this will have broken deps');
  console.log('  • Consider archiving instead if you might need artifacts later');
  console.log('  • Backup includes all scope artifacts but not _shared/ content\n');
}

/**
 * Show detailed help for 'archive' subcommand
 */
function showHelpArchive() {
  console.log(chalk.bold('\n  bmad scope archive'));
  console.log(chalk.dim('  ═══════════════════════════════════════════════════════════════════════════\n'));

  console.log(chalk.bold('  DESCRIPTION\n'));
  console.log('  Archive a scope. Archived scopes are excluded from default listings but');
  console.log('  retain all artifacts. Use this for completed features or paused work.\n');

  console.log(chalk.bold('  USAGE\n'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope archive <id>\n`);

  console.log(chalk.bold('  ARGUMENTS\n'));
  console.log(`    ${chalk.cyan('id')}    Scope identifier to archive (required)\n`);

  console.log(chalk.bold('  BEHAVIOR\n'));
  console.log('  • Scope status changes to "archived"');
  console.log('  • Artifacts remain intact');
  console.log('  • Excluded from "scope list" (use --status archived to see)');
  console.log('  • Can be reactivated with "scope activate"\n');

  console.log(chalk.bold('  EXAMPLES\n'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope archive auth`);
  console.log(`    ${chalk.dim("✓ Scope 'auth' archived.")}\n`);
  console.log(`    ${chalk.green('$')} npx bmad-fh scope list --status archived`);
  console.log(`    ${chalk.dim('# Shows auth in archived list')}\n`);
}

/**
 * Show detailed help for 'activate' subcommand
 */
function showHelpActivate() {
  console.log(chalk.bold('\n  bmad scope activate'));
  console.log(chalk.dim('  ═══════════════════════════════════════════════════════════════════════════\n'));

  console.log(chalk.bold('  DESCRIPTION\n'));
  console.log('  Reactivate an archived scope. The scope will appear in default listings');
  console.log('  and can be used for workflows again.\n');

  console.log(chalk.bold('  USAGE\n'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope activate <id>\n`);

  console.log(chalk.bold('  ARGUMENTS\n'));
  console.log(`    ${chalk.cyan('id')}    Scope identifier to activate (required)\n`);

  console.log(chalk.bold('  EXAMPLE\n'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope activate auth`);
  console.log(`    ${chalk.dim("✓ Scope 'auth' activated.")}\n`);
}

/**
 * Show detailed help for 'sync-up' subcommand
 */
function showHelpSyncUp() {
  console.log(chalk.bold('\n  bmad scope sync-up'));
  console.log(chalk.dim('  ═══════════════════════════════════════════════════════════════════════════\n'));

  console.log(chalk.bold('  DESCRIPTION\n'));
  console.log('  Promote scope artifacts to the shared knowledge layer (_shared/). Use this');
  console.log('  to share mature artifacts like architecture decisions, contracts, and');
  console.log('  principles with other scopes.\n');

  console.log(chalk.bold('  USAGE\n'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope sync-up <id> [options]\n`);

  console.log(chalk.bold('  ARGUMENTS\n'));
  console.log(`    ${chalk.cyan('id')}    Scope identifier to sync from (required)\n`);

  console.log(chalk.bold('  WHAT GETS PROMOTED\n'));
  console.log('  • architecture/*.md     → _shared/architecture/');
  console.log('  • contracts/*.md        → _shared/contracts/');
  console.log('  • principles/*.md       → _shared/principles/');
  console.log('  • project-context.md    → Merged into _shared/project-context.md\n');

  console.log(chalk.bold('  OPTIONS\n'));
  console.log(`    ${chalk.cyan('--dry-run')}`);
  console.log('          Show what would be promoted without making changes\n');

  console.log(`    ${chalk.cyan('--resolution')} ${chalk.dim('<strategy>')}`);
  console.log('          How to handle conflicts:');
  console.log('          • keep-local    - Keep scope version');
  console.log('          • keep-shared   - Keep shared version');
  console.log('          • backup-and-update - Backup shared, use scope version\n');

  console.log(chalk.bold('  EXAMPLE\n'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope sync-up auth`);
  console.log(`    ${chalk.dim('Promoted 3 files to _shared/')}`);
  console.log(`    ${chalk.dim('  architecture/auth-design.md')}`);
  console.log(`    ${chalk.dim('  contracts/auth-api.md')}`);
  console.log(`    ${chalk.dim('  principles/security.md')}\n`);
}

/**
 * Show detailed help for 'sync-down' subcommand
 */
function showHelpSyncDown() {
  console.log(chalk.bold('\n  bmad scope sync-down'));
  console.log(chalk.dim('  ═══════════════════════════════════════════════════════════════════════════\n'));

  console.log(chalk.bold('  DESCRIPTION\n'));
  console.log('  Pull updates from the shared knowledge layer into a scope. Use this to get');
  console.log('  the latest shared architecture, contracts, and context into your scope.\n');

  console.log(chalk.bold('  USAGE\n'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope sync-down <id> [options]\n`);

  console.log(chalk.bold('  ARGUMENTS\n'));
  console.log(`    ${chalk.cyan('id')}    Scope identifier to sync to (required)\n`);

  console.log(chalk.bold('  OPTIONS\n'));
  console.log(`    ${chalk.cyan('--dry-run')}`);
  console.log('          Show what would be pulled without making changes\n');

  console.log(`    ${chalk.cyan('--resolution')} ${chalk.dim('<strategy>')}`);
  console.log('          How to handle conflicts:');
  console.log('          • keep-local         - Keep scope version (default)');
  console.log('          • keep-shared        - Overwrite with shared version');
  console.log('          • backup-and-update  - Backup scope, use shared version\n');

  console.log(chalk.bold('  EXAMPLE\n'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope sync-down payments`);
  console.log(`    ${chalk.dim('Pulled 2 updates from _shared/')}`);
  console.log(`    ${chalk.dim('  contracts/auth-api.md (new)')}`);
  console.log(`    ${chalk.dim('  project-context.md (merged)')}\n`);
}

/**
 * Show detailed help for 'set' subcommand
 */
function showHelpSet() {
  console.log(chalk.bold('\n  bmad scope set'));
  console.log(chalk.dim('  ═══════════════════════════════════════════════════════════════════════════\n'));

  console.log(chalk.bold('  DESCRIPTION\n'));
  console.log('  Set the active scope for your session. This creates a .bmad-scope file in');
  console.log('  your project root that workflows automatically detect and use.\n');

  console.log(chalk.bold('  USAGE\n'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope set [id]`);
  console.log(`    ${chalk.green('$')} npx bmad-fh scope use [id]    ${chalk.dim('# alias')}\n`);

  console.log(chalk.bold('  ARGUMENTS\n'));
  console.log(`    ${chalk.cyan('id')}    Scope identifier to set as active (optional)`);
  console.log('          If omitted, shows current scope and prompts to select\n');

  console.log(chalk.bold('  BEHAVIOR\n'));
  console.log('  • Creates/updates .bmad-scope file in project root');
  console.log('  • .bmad-scope should be added to .gitignore (session-specific)');
  console.log('  • Workflows automatically detect scope from this file');
  console.log('  • BMAD_SCOPE environment variable can override\n');

  console.log(chalk.bold('  EXAMPLES\n'));
  console.log(chalk.dim('  Set a specific scope:'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope set auth\n`);

  console.log(chalk.dim('  Interactive selection (shows current and prompts):'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope set\n`);

  console.log(chalk.dim('  Override with environment variable:'));
  console.log(`    ${chalk.green('$')} BMAD_SCOPE=payments npx bmad-fh ...\n`);

  console.log(chalk.bold('  FILE FORMAT\n'));
  console.log('  The .bmad-scope file contains:');
  console.log(chalk.dim('    active_scope: auth'));
  console.log(chalk.dim('    set_at: "2026-01-22T10:00:00Z"\n'));
}

/**
 * Show detailed help for 'unset' subcommand
 */
function showHelpUnset() {
  console.log(chalk.bold('\n  bmad scope unset'));
  console.log(chalk.dim('  ═══════════════════════════════════════════════════════════════════════════\n'));

  console.log(chalk.bold('  DESCRIPTION\n'));
  console.log('  Clear the active scope by removing the .bmad-scope file. After this,');
  console.log('  workflows will prompt for scope selection.\n');

  console.log(chalk.bold('  USAGE\n'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope unset`);
  console.log(`    ${chalk.green('$')} npx bmad-fh scope clear    ${chalk.dim('# alias')}\n`);

  console.log(chalk.bold('  BEHAVIOR\n'));
  console.log('  • Removes .bmad-scope file from project root');
  console.log('  • Workflows will prompt for scope selection');
  console.log('  • Does nothing if no scope is currently set\n');

  console.log(chalk.bold('  EXAMPLE\n'));
  console.log(`    ${chalk.green('$')} npx bmad-fh scope unset`);
  console.log(`    ${chalk.dim('✓ Active scope cleared.')}\n`);
}

/**
 * Router for subcommand-specific help
 * @param {string} subcommand - The subcommand to show help for
 */
function showSubcommandHelp(subcommand) {
  const helpFunctions = {
    init: showHelpInit,
    create: showHelpCreate,
    new: showHelpCreate,
    list: showHelpList,
    ls: showHelpList,
    info: showHelpInfo,
    show: showHelpInfo,
    remove: showHelpRemove,
    rm: showHelpRemove,
    delete: showHelpRemove,
    archive: showHelpArchive,
    activate: showHelpActivate,
    set: showHelpSet,
    use: showHelpSet,
    unset: showHelpUnset,
    clear: showHelpUnset,
    'sync-up': showHelpSyncUp,
    syncup: showHelpSyncUp,
    'sync-down': showHelpSyncDown,
    syncdown: showHelpSyncDown,
  };

  if (helpFunctions[subcommand]) {
    helpFunctions[subcommand]();
  } else {
    console.log(chalk.red(`\n  Unknown command: ${subcommand}\n`));
    console.log(`  Run ${chalk.cyan('npx bmad-fh scope help')} to see available commands.\n`);
  }
}

/**
 * Generate help text string for Commander.js
 * This is called when --help is used
 */
function getHelpText() {
  const lines = [
    '',
    chalk.bold('SUBCOMMANDS'),
    '',
    `  ${chalk.cyan('init')}                   Initialize scope system in current project`,
    `  ${chalk.cyan('list')} ${chalk.dim('[options]')}        List all scopes (aliases: ls)`,
    `  ${chalk.cyan('create')} ${chalk.dim('[id] [opts]')}    Create a new scope (aliases: new)`,
    `  ${chalk.cyan('info')} ${chalk.dim('<id>')}             Show detailed scope information (aliases: show)`,
    `  ${chalk.cyan('remove')} ${chalk.dim('<id> [opts]')}    Remove a scope and its artifacts (aliases: rm, delete)`,
    `  ${chalk.cyan('archive')} ${chalk.dim('<id>')}          Archive a scope (preserves artifacts)`,
    `  ${chalk.cyan('activate')} ${chalk.dim('<id>')}         Reactivate an archived scope`,
    `  ${chalk.cyan('set')} ${chalk.dim('[id]')}              Set active scope for session (alias: use)`,
    `  ${chalk.cyan('unset')}                  Clear active scope (alias: clear)`,
    `  ${chalk.cyan('sync-up')} ${chalk.dim('<id> [opts]')}   Promote scope artifacts to shared layer`,
    `  ${chalk.cyan('sync-down')} ${chalk.dim('<id> [opts]')} Pull shared layer updates into scope`,
    `  ${chalk.cyan('help')} ${chalk.dim('[command]')}        Show detailed help for a command`,
    '',
    chalk.bold('QUICK START'),
    '',
    `  ${chalk.green('$')} npx bmad-fh scope init`,
    `  ${chalk.green('$')} npx bmad-fh scope create auth --name "Auth Service"`,
    `  ${chalk.green('$')} npx bmad-fh scope set auth`,
    '',
    chalk.bold('MORE HELP'),
    '',
    `  ${chalk.cyan('npx bmad-fh scope help')}           Show comprehensive documentation`,
    `  ${chalk.cyan('npx bmad-fh scope help <cmd>')}     Show detailed help for a subcommand`,
    '',
  ];

  return lines.join('\n');
}

/**
 * Configure the Commander command with custom help
 * @param {import('commander').Command} command - The Commander command instance
 */
function configureCommand(command) {
  // Add custom help text after the auto-generated options
  command.addHelpText('after', getHelpText);

  // Show help after errors to guide users
  command.showHelpAfterError('(use --help for available subcommands)');
}

module.exports = {
  command: 'scope [subcommand] [id]',
  description: 'Manage scopes for parallel artifact isolation',
  configureCommand,
  options: [
    ['-n, --name <name>', 'Scope name (for create)'],
    ['-d, --description <desc>', 'Scope description'],
    ['--deps, --dependencies <deps>', 'Comma-separated dependency scope IDs'],
    ['-f, --force', 'Force operation without confirmation'],
    ['--no-backup', 'Skip backup on remove'],
    ['--context', 'Create scope-specific project-context.md'],
    ['-s, --status <status>', 'Filter by status (active/archived)'],
    ['--dry-run', 'Show what would be synced without making changes'],
    ['--resolution <strategy>', 'Conflict resolution: keep-local|keep-shared|backup-and-update'],
  ],
  // Export help functions for testing
  showHelp,
  showSubcommandHelp,
  getHelpText,
  action: async (subcommand, id, options) => {
    try {
      // Determine project root
      const projectRoot = process.cwd();

      // Handle subcommands
      switch (subcommand) {
        case 'init': {
          await handleInit(projectRoot);
          break;
        }

        case 'list':
        case 'ls': {
          await handleList(projectRoot, options);
          break;
        }

        case 'create':
        case 'new': {
          await handleCreate(projectRoot, id, options);
          break;
        }

        case 'info':
        case 'show': {
          await handleInfo(projectRoot, id);
          break;
        }

        case 'remove':
        case 'rm':
        case 'delete': {
          await handleRemove(projectRoot, id, options);
          break;
        }

        case 'archive': {
          await handleArchive(projectRoot, id);
          break;
        }

        case 'activate': {
          await handleActivate(projectRoot, id);
          break;
        }

        case 'sync-up':
        case 'syncup': {
          await handleSyncUp(projectRoot, id, options);
          break;
        }

        case 'sync-down':
        case 'syncdown': {
          await handleSyncDown(projectRoot, id, options);
          break;
        }

        case 'set':
        case 'use': {
          await handleSet(projectRoot, id, options);
          break;
        }

        case 'unset':
        case 'clear': {
          await handleUnset(projectRoot);
          break;
        }

        case 'help': {
          // Check if a subcommand was provided for detailed help
          if (id) {
            showSubcommandHelp(id);
          } else {
            showHelp();
          }
          break;
        }

        case undefined: {
          showHelp();
          break;
        }

        default: {
          // If subcommand looks like an ID, show info for it
          if (subcommand && !subcommand.startsWith('-')) {
            await handleInfo(projectRoot, subcommand);
          } else {
            showHelp();
          }
        }
      }

      process.exit(0);
    } catch (error) {
      console.error(chalk.red(`\nError: ${error.message}`));
      if (process.env.DEBUG) {
        console.error(chalk.dim(error.stack));
      }
      process.exit(1);
    }
  },
};

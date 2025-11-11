/**
 * Utility function to replace {project-root} placeholders with actual installation target
 * Used during BMAD installation to set correct paths in agent and task files
 */

const fs = require('node:fs');
const path = require('node:path');

/**
 * Replace {project-root} and {output_folder}/ placeholders in a single file
 * @param {string} filePath - Path to the file to process
 * @param {string} projectRoot - The actual project root path to substitute (must include trailing slash)
 * @param {string} docOut - The document output path (with leading slash)
 * @param {boolean} removeCompletely - If true, removes placeholders entirely instead of replacing
 * @returns {boolean} - True if replacements were made, false otherwise
 */
function replacePlaceholdersInFile(filePath, projectRoot, docOut = '/docs', removeCompletely = false) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    if (removeCompletely) {
      // Remove placeholders entirely (for bundling)
      content = content.replaceAll('{project-root}', '');
      content = content.replaceAll('{output_folder}/', '');
    } else {
      // Handle the combined pattern first to avoid double slashes
      if (projectRoot && docOut) {
        // Replace {project-root}{output_folder}/ combinations first
        // Remove leading slash from docOut since projectRoot has trailing slash
        // Add trailing slash to docOut
        const docOutNoLeadingSlash = docOut.replace(/^\//, '');
        const docOutWithTrailingSlash = docOutNoLeadingSlash.endsWith('/') ? docOutNoLeadingSlash : docOutNoLeadingSlash + '/';
        content = content.replaceAll('{project-root}{output_folder}/', projectRoot + docOutWithTrailingSlash);
      }

      // Then replace remaining individual placeholders
      if (projectRoot) {
        content = content.replaceAll('{project-root}', projectRoot);
      }

      if (docOut) {
        // For standalone {output_folder}/, keep the leading slash and add trailing slash
        const docOutWithTrailingSlash = docOut.endsWith('/') ? docOut : docOut + '/';
        content = content.replaceAll('{output_folder}/', docOutWithTrailingSlash);
      }
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Legacy function name for backward compatibility
 */
function replaceProjectRootInFile(filePath, projectRoot, removeCompletely = false) {
  return replacePlaceholdersInFile(filePath, projectRoot, '/docs', removeCompletely);
}

/**
 * Recursively replace {project-root} and {output_folder}/ in all files in a directory
 * @param {string} dirPath - Directory to process
 * @param {string} projectRoot - The actual project root path to substitute (or null to remove)
 * @param {string} docOut - The document output path (with leading slash)
 * @param {Array<string>} extensions - File extensions to process (default: ['.md', '.xml', '.yaml'])
 * @param {boolean} removeCompletely - If true, removes placeholders entirely instead of replacing
 * @param {boolean} verbose - If true, show detailed output for each file
 * @returns {Object} - Stats object with counts of files processed and modified
 */
function replacePlaceholdersInDirectory(
  dirPath,
  projectRoot,
  docOut = '/docs',
  extensions = ['.md', '.xml', '.yaml'],
  removeCompletely = false,
  verbose = false,
) {
  const stats = {
    processed: 0,
    modified: 0,
    errors: 0,
  };

  function processDirectory(currentPath) {
    try {
      const items = fs.readdirSync(currentPath, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(currentPath, item.name);

        if (item.isDirectory()) {
          // Skip node_modules and .git directories
          if (item.name !== 'node_modules' && item.name !== '.git') {
            processDirectory(fullPath);
          }
        } else if (item.isFile()) {
          // Check if file has one of the target extensions
          const ext = path.extname(item.name).toLowerCase();
          if (extensions.includes(ext)) {
            stats.processed++;
            if (replacePlaceholdersInFile(fullPath, projectRoot, docOut, removeCompletely)) {
              stats.modified++;
              if (verbose) {
                console.log(`✓ Updated: ${fullPath}`);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error processing directory ${currentPath}:`, error.message);
      stats.errors++;
    }
  }

  processDirectory(dirPath);
  return stats;
}

/**
 * Legacy function for backward compatibility
 */
function replaceProjectRootInDirectory(dirPath, projectRoot, extensions = ['.md', '.xml'], removeCompletely = false) {
  return replacePlaceholdersInDirectory(dirPath, projectRoot, '/docs', extensions, removeCompletely);
}

/**
 * Replace placeholders in a list of specific files
 * @param {Array<string>} filePaths - Array of file paths to process
 * @param {string} projectRoot - The actual project root path to substitute (or null to remove)
 * @param {string} docOut - The document output path (with leading slash)
 * @param {boolean} removeCompletely - If true, removes placeholders entirely instead of replacing
 * @returns {Object} - Stats object with counts of files processed and modified
 */
function replacePlaceholdersInFiles(filePaths, projectRoot, docOut = '/docs', removeCompletely = false) {
  const stats = {
    processed: 0,
    modified: 0,
    errors: 0,
  };

  for (const filePath of filePaths) {
    stats.processed++;
    try {
      if (replacePlaceholdersInFile(filePath, projectRoot, docOut, removeCompletely)) {
        stats.modified++;
        console.log(`✓ Updated: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error.message);
      stats.errors++;
    }
  }

  return stats;
}

/**
 * Legacy function for backward compatibility
 */
function replaceProjectRootInFiles(filePaths, projectRoot, removeCompletely = false) {
  return replacePlaceholdersInFiles(filePaths, projectRoot, '/docs', removeCompletely);
}

/**
 * Main installation helper - replaces {project-root} and {output_folder}/ during BMAD installation
 * @param {string} installPath - Path where BMAD is being installed
 * @param {string} targetProjectRoot - The project root to set in the files (slash will be added)
 * @param {string} docsOutputPath - The documentation output path (relative to project root)
 * @param {boolean} verbose - If true, show detailed output
 * @returns {Object} - Installation stats
 */
function processInstallation(installPath, targetProjectRoot, docsOutputPath = 'docs', verbose = false) {
  // Ensure project root has trailing slash since usage is like {bmad_folder}
  const projectRootWithSlash = targetProjectRoot.endsWith('/') ? targetProjectRoot : targetProjectRoot + '/';

  // Ensure docs path has leading slash (for internal use) but will add trailing slash during replacement
  const normalizedDocsPath = docsOutputPath.replaceAll(/^\/+|\/+$/g, '');
  const docOutPath = normalizedDocsPath ? `/${normalizedDocsPath}` : '/docs';

  if (verbose) {
    console.log(`\nReplacing {project-root} with: ${projectRootWithSlash}`);
    console.log(`Replacing {output_folder}/ with: ${docOutPath}/`);
    console.log(`Processing files in: ${installPath}\n`);
  }

  const stats = replacePlaceholdersInDirectory(installPath, projectRootWithSlash, docOutPath, ['.md', '.xml', '.yaml'], false, verbose);

  if (verbose) {
    console.log('\n--- Installation Processing Complete ---');
  }
  console.log(`Files processed: ${stats.processed}`);
  console.log(`Files modified: ${stats.modified}`);
  if (stats.errors > 0) {
    console.log(`Errors encountered: ${stats.errors}`);
  }

  return stats;
}

/**
 * Bundle helper - removes {project-root}/ references for web bundling
 * @param {string} bundlePath - Path where files are being bundled
 * @returns {Object} - Bundle stats
 */
function processBundleRemoval(bundlePath) {
  console.log(`\nRemoving {project-root}/ references for bundling`);
  console.log(`Processing files in: ${bundlePath}\n`);

  const stats = replaceProjectRootInDirectory(bundlePath, null, ['.md', '.xml'], true);

  console.log('\n--- Bundle Processing Complete ---');
  console.log(`Files processed: ${stats.processed}`);
  console.log(`Files modified: ${stats.modified}`);
  if (stats.errors > 0) {
    console.log(`Errors encountered: ${stats.errors}`);
  }

  return stats;
}

module.exports = {
  replacePlaceholdersInFile,
  replacePlaceholdersInDirectory,
  replacePlaceholdersInFiles,
  replaceProjectRootInFile,
  replaceProjectRootInDirectory,
  replaceProjectRootInFiles,
  processInstallation,
  processBundleRemoval,
};

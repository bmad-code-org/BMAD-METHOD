/**
 * File Mover Task
 * Moves processed files to done folder with folder structure preservation
 */

const fs = require('fs-extra');
const path = require('node:path');

/**
 * Move processed file to done folder
 * @param {string} sourcePath - Original file path
 * @param {string} sourceRoot - Source root directory
 * @param {string} doneFolder - Destination folder
 * @param {boolean} preserveStructure - Maintain folder structure
 * @returns {Promise<Object>} Move result
 */
async function moveProcessedFile(sourcePath, sourceRoot, doneFolder, preserveStructure = true) {
  const relativePath = path.relative(sourceRoot, sourcePath);
  const destPath = preserveStructure ? path.join(doneFolder, relativePath) : path.join(doneFolder, path.basename(sourcePath));

  await fs.ensureDir(path.dirname(destPath));
  await fs.move(sourcePath, destPath);

  return {
    originalPath: sourcePath,
    newPath: destPath,
    timestamp: new Date().toISOString(),
  };
}

module.exports = { moveProcessedFile };

const fs = require('fs-extra');
const path = require('node:path');
const os = require('node:os');
const { isBinaryFile } = require('./binary.js');

/**
 * Aggregate file contents with bounded concurrency.
 * Returns text files, binary files (with size), and errors.
 * @param {string[]} files absolute file paths
 * @param {string} rootDir
 * @param {{ text?: string, warn?: (msg: string) => void } | null} spinner
 */
async function aggregateFileContents(files, rootDir, spinner = null) {
  const results = {
    textFiles: [],
    binaryFiles: [],
    errors: [],
    totalFiles: files.length,
    processedFiles: 0,
  };

  // Automatic concurrency selection based on CPU count and workload size.
  // - Base on 2x logical CPUs, clamped to [2, 64]
  // - For very small workloads, avoid excessive parallelism
  const cpuCount = os.cpus && Array.isArray(os.cpus()) ? os.cpus().length : os.cpus?.length || 4;
  let concurrency = Math.min(64, Math.max(2, (Number(cpuCount) || 4) * 2));
  if (files.length > 0 && files.length < concurrency) {
    concurrency = Math.max(1, Math.min(concurrency, Math.ceil(files.length / 2)));
  }

  async function processOne(filePath) {
    try {
      const relativePath = path.relative(rootDir, filePath);
      if (spinner) {
        spinner.text = `Processing: ${relativePath} (${results.processedFiles + 1}/${results.totalFiles})`;
      }

      const binary = await isBinaryFile(filePath);
      if (binary) {
        const { size } = await fs.stat(filePath);
        results.binaryFiles.push({ path: relativePath, absolutePath: filePath, size });
      } else {
        const content = await fs.readFile(filePath, 'utf8');
        results.textFiles.push({
          path: relativePath,
          absolutePath: filePath,
          content,
          size: content.length,
          lines: content.split('\n').length,
        });
      }
    } catch (error) {
      const relativePath = path.relative(rootDir, filePath);
      const errorInfo = { path: relativePath, absolutePath: filePath, error: error.message };
      results.errors.push(errorInfo);
      if (spinner) {
        spinner.warn(`Warning: Could not read file ${relativePath}: ${error.message}`);
      } else {
        console.warn(`Warning: Could not read file ${relativePath}: ${error.message}`);
      }
    } finally {
      results.processedFiles++;
    }
  }

  for (let index = 0; index < files.length; index += concurrency) {
    const slice = files.slice(index, index + concurrency);
    await Promise.all(slice.map(processOne));
  }

  return results;
}

module.exports = {
  aggregateFileContents,
};

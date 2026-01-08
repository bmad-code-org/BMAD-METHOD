import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { randomUUID } from 'node:crypto';

/**
 * Create a temporary directory for testing
 * @param {string} prefix - Prefix for the directory name
 * @returns {Promise<string>} Path to the created temporary directory
 */
export async function createTempDir(prefix = 'bmad-test-') {
  const tmpDir = path.join(os.tmpdir(), `${prefix}${randomUUID()}`);
  await fs.ensureDir(tmpDir);
  return tmpDir;
}

/**
 * Clean up a temporary directory
 * @param {string} tmpDir - Path to the temporary directory
 * @returns {Promise<void>}
 */
export async function cleanupTempDir(tmpDir) {
  if (await fs.pathExists(tmpDir)) {
    await fs.remove(tmpDir);
  }
}

/**
 * Execute a test function with a temporary directory
 * Automatically creates and cleans up the directory
 * @param {Function} testFn - Test function that receives the temp directory path
 * @returns {Promise<void>}
 */
export async function withTempDir(testFn) {
  const tmpDir = await createTempDir();
  try {
    await testFn(tmpDir);
  } finally {
    await cleanupTempDir(tmpDir);
  }
}

/**
 * Create a test file in a temporary directory
 * @param {string} tmpDir - Temporary directory path
 * @param {string} relativePath - Relative path for the file
 * @param {string} content - File content
 * @returns {Promise<string>} Full path to the created file
 */
export async function createTestFile(tmpDir, relativePath, content) {
  const fullPath = path.join(tmpDir, relativePath);
  await fs.ensureDir(path.dirname(fullPath));
  await fs.writeFile(fullPath, content, 'utf8');
  return fullPath;
}

/**
 * Create multiple test files in a temporary directory
 * @param {string} tmpDir - Temporary directory path
 * @param {Object} files - Object mapping relative paths to content
 * @returns {Promise<string[]>} Array of created file paths
 */
export async function createTestFiles(tmpDir, files) {
  const paths = [];
  for (const [relativePath, content] of Object.entries(files)) {
    const fullPath = await createTestFile(tmpDir, relativePath, content);
    paths.push(fullPath);
  }
  return paths;
}

/**
 * Create a test directory structure
 * @param {string} tmpDir - Temporary directory path
 * @param {string[]} dirs - Array of relative directory paths
 * @returns {Promise<void>}
 */
export async function createTestDirs(tmpDir, dirs) {
  for (const dir of dirs) {
    await fs.ensureDir(path.join(tmpDir, dir));
  }
}

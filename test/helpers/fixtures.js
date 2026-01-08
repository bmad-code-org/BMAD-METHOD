import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'yaml';
import xml2js from 'xml2js';

// Get the directory of this module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load a fixture file
 * @param {string} fixturePath - Relative path to fixture from test/fixtures/
 * @returns {Promise<string>} File content
 */
export async function loadFixture(fixturePath) {
  const fullPath = path.join(__dirname, '..', 'fixtures', fixturePath);
  return fs.readFile(fullPath, 'utf8');
}

/**
 * Load a YAML fixture
 * @param {string} fixturePath - Relative path to YAML fixture
 * @returns {Promise<Object>} Parsed YAML object
 */
export async function loadYamlFixture(fixturePath) {
  const content = await loadFixture(fixturePath);
  return yaml.parse(content);
}

/**
 * Load an XML fixture
 * @param {string} fixturePath - Relative path to XML fixture
 * @returns {Promise<Object>} Parsed XML object
 */
export async function loadXmlFixture(fixturePath) {
  const content = await loadFixture(fixturePath);
  return xml2js.parseStringPromise(content);
}

/**
 * Load a JSON fixture
 * @param {string} fixturePath - Relative path to JSON fixture
 * @returns {Promise<Object>} Parsed JSON object
 */
export async function loadJsonFixture(fixturePath) {
  const content = await loadFixture(fixturePath);
  return JSON.parse(content);
}

/**
 * Check if a fixture file exists
 * @param {string} fixturePath - Relative path to fixture
 * @returns {Promise<boolean>} True if fixture exists
 */
export async function fixtureExists(fixturePath) {
  const fullPath = path.join(__dirname, '..', 'fixtures', fixturePath);
  return fs.pathExists(fullPath);
}

/**
 * Get the full path to a fixture
 * @param {string} fixturePath - Relative path to fixture
 * @returns {string} Full path to fixture
 */
export function getFixturePath(fixturePath) {
  return path.join(__dirname, '..', 'fixtures', fixturePath);
}

/**
 * Create a test file in a temporary directory
 * (Re-exported from temp-dir for convenience)
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

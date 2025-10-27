const fsp = require('node:fs/promises');
const path = require('node:path');
const { Buffer } = require('node:buffer');

/**
 * Efficiently determine if a file is binary without reading the whole file.
 * - Fast path by extension for common binaries
 * - Otherwise read a small prefix and check for NUL bytes
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
async function isBinaryFile(filePath) {
  try {
    const stats = await fsp.stat(filePath);
    if (stats.isDirectory()) {
      throw new Error('EISDIR: illegal operation on a directory');
    }

    const binaryExtensions = new Set([
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.bmp',
      '.ico',
      '.svg',
      '.pdf',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.ppt',
      '.pptx',
      '.zip',
      '.tar',
      '.gz',
      '.rar',
      '.7z',
      '.exe',
      '.dll',
      '.so',
      '.dylib',
      '.mp3',
      '.mp4',
      '.avi',
      '.mov',
      '.wav',
      '.ttf',
      '.otf',
      '.woff',
      '.woff2',
      '.bin',
      '.dat',
      '.db',
      '.sqlite',
    ]);

    const extension = path.extname(filePath).toLowerCase();
    if (binaryExtensions.has(extension)) return true;
    if (stats.size === 0) return false;

    const sampleSize = Math.min(4096, stats.size);
    const fd = await fsp.open(filePath, 'r');
    try {
      const buffer = Buffer.allocUnsafe(sampleSize);
      const { bytesRead } = await fd.read(buffer, 0, sampleSize, 0);
      const slice = bytesRead === sampleSize ? buffer : buffer.subarray(0, bytesRead);
      return slice.includes(0);
    } finally {
      await fd.close();
    }
  } catch (error) {
    console.warn(`Warning: Could not determine if file is binary: ${filePath} - ${error.message}`);
    return false;
  }
}

module.exports = {
  isBinaryFile,
};

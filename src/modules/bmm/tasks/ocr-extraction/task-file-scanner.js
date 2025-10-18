/**
 * File Scanner Task
 * Recursively scans folders for supported document types
 * Filters already-processed files and builds processing queue
 */

const fs = require('fs-extra');
const path = require('node:path');
const glob = require('glob');

/**
 * Scan source folder for supported files
 * @param {Object} config - Configuration object
 * @param {string} config.sourcePath - Path to source documents folder
 * @param {string[]} config.fileTypes - Supported file extensions (e.g., ['pdf', 'xlsx'])
 * @param {string} [config.processingLogPath] - Path to processing log (to skip already-processed files)
 * @param {boolean} [config.recursive=true] - Scan subdirectories recursively
 * @returns {Promise<Object>} Scan results with file list and statistics
 */
async function scanFiles(config) {
  const { sourcePath, fileTypes = ['pdf', 'xlsx', 'xls', 'msg'], processingLogPath = null, recursive = true } = config;

  // Validate source path
  if (!sourcePath) {
    throw new Error('Source path is required');
  }

  const absolutePath = path.resolve(sourcePath);

  if (!(await fs.pathExists(absolutePath))) {
    throw new Error(`Source path does not exist: ${absolutePath}`);
  }

  const stats = await fs.stat(absolutePath);
  if (!stats.isDirectory()) {
    throw new Error(`Source path is not a directory: ${absolutePath}`);
  }

  // Build glob patterns for supported file types
  const patterns = fileTypes.map((ext) => {
    const cleanExt = ext.startsWith('.') ? ext.slice(1) : ext;
    return recursive ? `**/*.${cleanExt}` : `*.${cleanExt}`;
  });

  // Load processing log to filter already-processed files
  let processedFiles = new Set();
  if (processingLogPath && (await fs.pathExists(processingLogPath))) {
    try {
      const logData = await fs.readJson(processingLogPath);
      if (logData.processedFiles && Array.isArray(logData.processedFiles)) {
        processedFiles = new Set(logData.processedFiles.map((f) => path.normalize(f.filePath)));
      }
    } catch (error) {
      console.warn(`Warning: Could not load processing log: ${error.message}`);
    }
  }

  // Scan for files
  const allFiles = [];
  const filesByType = {};

  for (const pattern of patterns) {
    const files = await new Promise((resolve, reject) => {
      glob(
        pattern,
        {
          cwd: absolutePath,
          absolute: true,
          nodir: true,
        },
        (err, matches) => {
          if (err) reject(err);
          else resolve(matches);
        },
      );
    });

    allFiles.push(...files);
  }

  // Build file metadata
  const filesWithMetadata = await Promise.all(
    allFiles.map(async (filePath) => {
      const stats = await fs.stat(filePath);
      const ext = path.extname(filePath).slice(1).toLowerCase();
      const relativePath = path.relative(absolutePath, filePath);
      const normalizedPath = path.normalize(filePath);

      // Track files by type
      if (!filesByType[ext]) {
        filesByType[ext] = 0;
      }
      filesByType[ext]++;

      return {
        filePath: normalizedPath,
        relativePath,
        fileName: path.basename(filePath),
        fileType: ext,
        fileSize: stats.size,
        modifiedDate: stats.mtime,
        alreadyProcessed: processedFiles.has(normalizedPath),
      };
    }),
  );

  // Separate processed and unprocessed files
  const unprocessedFiles = filesWithMetadata.filter((f) => !f.alreadyProcessed);
  const alreadyProcessedFiles = filesWithMetadata.filter((f) => f.alreadyProcessed);

  // Calculate statistics
  const statistics = {
    totalFilesFound: filesWithMetadata.length,
    unprocessedCount: unprocessedFiles.length,
    alreadyProcessedCount: alreadyProcessedFiles.length,
    filesByType,
    totalSize: filesWithMetadata.reduce((sum, f) => sum + f.fileSize, 0),
    sourcePath: absolutePath,
    scanDate: new Date().toISOString(),
  };

  return {
    allFiles: filesWithMetadata,
    unprocessedFiles,
    alreadyProcessedFiles,
    statistics,
  };
}

/**
 * Get file count by type
 * @param {Object} scanResults - Results from scanFiles()
 * @returns {Object} Count of files by type
 */
function getFileCountByType(scanResults) {
  return scanResults.statistics.filesByType;
}

/**
 * Sort files by priority (e.g., smallest first for faster feedback)
 * @param {Array} files - Array of file metadata objects
 * @param {string} strategy - Sorting strategy ('size-asc', 'size-desc', 'date-asc', 'date-desc', 'name')
 * @returns {Array} Sorted files
 */
function sortFiles(files, strategy = 'size-asc') {
  const sorted = [...files];

  switch (strategy) {
    case 'size-asc': {
      return sorted.sort((a, b) => a.fileSize - b.fileSize);
    }
    case 'size-desc': {
      return sorted.sort((a, b) => b.fileSize - a.fileSize);
    }
    case 'date-asc': {
      return sorted.sort((a, b) => new Date(a.modifiedDate) - new Date(b.modifiedDate));
    }
    case 'date-desc': {
      return sorted.sort((a, b) => new Date(b.modifiedDate) - new Date(a.modifiedDate));
    }
    case 'name': {
      return sorted.sort((a, b) => a.fileName.localeCompare(b.fileName));
    }
    default: {
      return sorted;
    }
  }
}

/**
 * Create processing queue with optional prioritization
 * @param {Object} scanResults - Results from scanFiles()
 * @param {Object} options - Queue options
 * @param {string} [options.sortStrategy='size-asc'] - How to sort files
 * @param {number} [options.batchSize=null] - Split into batches of this size
 * @returns {Object} Processing queue
 */
function createProcessingQueue(scanResults, options = {}) {
  const { sortStrategy = 'size-asc', batchSize = null } = options;

  let queue = sortFiles(scanResults.unprocessedFiles, sortStrategy);

  const result = {
    files: queue,
    totalFiles: queue.length,
    batches: null,
  };

  // Split into batches if requested
  if (batchSize && batchSize > 0) {
    const batches = [];
    for (let i = 0; i < queue.length; i += batchSize) {
      batches.push({
        batchNumber: Math.floor(i / batchSize) + 1,
        files: queue.slice(i, i + batchSize),
        fileCount: Math.min(batchSize, queue.length - i),
      });
    }
    result.batches = batches;
  }

  return result;
}

module.exports = {
  scanFiles,
  getFileCountByType,
  sortFiles,
  createProcessingQueue,
};

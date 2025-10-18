/**
 * File Converter Task
 * Handles conversion of various file formats to formats suitable for OCR
 * Note: For MVP, most files can be sent directly to Mistral OCR
 * This module provides utilities for format handling
 */

const fs = require('fs-extra');
const path = require('node:path');

/**
 * Check if file needs conversion before OCR
 * @param {string} filePath - Path to file
 * @returns {Promise<Object>} Conversion info
 */
async function checkConversionNeeded(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  // Files that can be sent directly to Mistral OCR
  const directOCRSupport = ['.pdf', '.png', '.jpg', '.jpeg', '.gif', '.webp'];

  // Files that need special handling
  const needsConversion = {
    '.xlsx': 'excel-to-image',
    '.xls': 'excel-to-image',
    '.msg': 'msg-to-text',
  };

  if (directOCRSupport.includes(ext)) {
    return {
      needsConversion: false,
      method: 'direct',
      supportedFormat: true,
    };
  }

  if (needsConversion[ext]) {
    return {
      needsConversion: true,
      method: needsConversion[ext],
      supportedFormat: true,
    };
  }

  return {
    needsConversion: false,
    method: null,
    supportedFormat: false,
    error: `Unsupported file format: ${ext}`,
  };
}

/**
 * Prepare file for OCR processing
 * @param {string} filePath - Path to file
 * @param {Object} [options={}] - Conversion options
 * @returns {Promise<Object>} Prepared file info
 */
async function prepareFileForOCR(filePath, options = {}) {
  const conversionInfo = await checkConversionNeeded(filePath);

  if (!conversionInfo.supportedFormat) {
    throw new Error(conversionInfo.error);
  }

  // For files that don't need conversion, return original
  if (!conversionInfo.needsConversion) {
    return {
      filePath,
      originalPath: filePath,
      converted: false,
      method: conversionInfo.method,
    };
  }

  // Handle conversions
  switch (conversionInfo.method) {
    case 'excel-to-image': {
      return await handleExcelFile(filePath, options);
    }

    case 'msg-to-text': {
      return await handleMsgFile(filePath, options);
    }

    default: {
      throw new Error(`Conversion method not implemented: ${conversionInfo.method}`);
    }
  }
}

/**
 * Handle Excel file (.xlsx, .xls)
 * For MVP: Extract text content and format as readable text
 * Future: Could convert to images for visual OCR
 * @private
 */
async function handleExcelFile(filePath, _options) {
  // Note: This is a placeholder implementation
  // Full implementation would use xlsx library to read and format cell data

  return {
    filePath,
    originalPath: filePath,
    converted: true,
    method: 'excel-direct-read',
    note: 'Excel files sent directly to OCR - structured data extraction may vary',
  };
}

/**
 * Handle Outlook MSG file
 * Extract text content and attachments
 * @private
 */
async function handleMsgFile(filePath, _options) {
  // Note: This is a placeholder implementation
  // Full implementation would use @kenjiuno/msgreader to extract message content

  return {
    filePath,
    originalPath: filePath,
    converted: true,
    method: 'msg-text-extraction',
    note: 'MSG file content will be extracted as text',
  };
}

/**
 * Clean up temporary files created during conversion
 * @param {Object} preparedFile - Result from prepareFileForOCR
 * @returns {Promise<void>}
 */
async function cleanupConversion(preparedFile) {
  if (!preparedFile.converted) {
    return; // Nothing to clean up
  }

  // If we created temporary files, delete them
  if (preparedFile.tempFiles && Array.isArray(preparedFile.tempFiles)) {
    for (const tempFile of preparedFile.tempFiles) {
      try {
        if (await fs.pathExists(tempFile)) {
          await fs.remove(tempFile);
        }
      } catch (error) {
        console.warn(`Warning: Could not delete temp file ${tempFile}: ${error.message}`);
      }
    }
  }
}

/**
 * Get file metadata useful for processing
 * @param {string} filePath - Path to file
 * @returns {Promise<Object>} File metadata
 */
async function getFileMetadata(filePath) {
  const stats = await fs.stat(filePath);
  const ext = path.extname(filePath).toLowerCase();

  return {
    filePath,
    fileName: path.basename(filePath),
    extension: ext,
    size: stats.size,
    sizeHuman: formatBytes(stats.size),
    created: stats.birthtime,
    modified: stats.mtime,
    isDirectory: stats.isDirectory(),
  };
}

/**
 * Format bytes to human-readable string
 * @private
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Validate file is readable and accessible
 * @param {string} filePath - Path to file
 * @returns {Promise<Object>} Validation result
 */
async function validateFile(filePath) {
  try {
    // Check existence
    if (!(await fs.pathExists(filePath))) {
      return {
        valid: false,
        error: 'File does not exist',
      };
    }

    // Check if it's a file (not directory)
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      return {
        valid: false,
        error: 'Path is a directory, not a file',
      };
    }

    // Check if readable
    try {
      await fs.access(filePath, fs.constants.R_OK);
    } catch {
      return {
        valid: false,
        error: 'File is not readable (permission denied)',
      };
    }

    // Check file size (warn if > 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (stats.size > maxSize) {
      return {
        valid: true,
        warning: `File size (${formatBytes(stats.size)}) exceeds 10MB - OCR may be slow`,
      };
    }

    return {
      valid: true,
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
    };
  }
}

module.exports = {
  checkConversionNeeded,
  prepareFileForOCR,
  cleanupConversion,
  getFileMetadata,
  validateFile,
};

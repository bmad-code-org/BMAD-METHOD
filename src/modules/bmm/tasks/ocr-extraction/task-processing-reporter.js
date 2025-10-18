/**
 * Processing Reporter Task
 * Generates comprehensive processing reports and logs
 */

const fs = require('fs-extra');
const path = require('node:path');

/**
 * Generate processing report
 * @param {Object} results - Batch processing results
 * @param {Object} _config - Configuration
 * @returns {Promise<string>} Report content
 */
async function generateReport(results, _config) {
  const report = `# OCR Data Extraction Results

**Date:** ${new Date().toISOString()}
**Total Files Processed:** ${results.processed.length + results.failed.length + results.skipped.length}
**Successful:** ${results.processed.length}
**Failed:** ${results.failed.length}
**Skipped:** ${results.skipped.length}

## Successful Extractions

${results.processed.map((r) => `- ${r.file} (Confidence: ${Math.round(r.confidence * 100)}%)`).join('\n')}

## Failed Extractions

${results.failed.map((r) => `- ${r.file}: ${r.error}`).join('\n')}

## Skipped Files

${results.skipped.map((r) => `- ${r.file}: ${r.reason}`).join('\n')}
`;

  return report;
}

/**
 * Save processing log as JSON
 * @param {Object} results - Batch processing results
 * @param {string} logPath - Path to save log
 * @returns {Promise<void>}
 */
async function saveProcessingLog(results, logPath) {
  await fs.ensureDir(path.dirname(logPath));

  const log = {
    timestamp: new Date().toISOString(),
    processedFiles: results.processed.map((r) => ({
      filePath: r.file,
      confidence: r.confidence,
      data: r.data,
    })),
    failedFiles: results.failed,
    skippedFiles: results.skipped,
  };

  await fs.writeJson(logPath, log, { spaces: 2 });
}

module.exports = { generateReport, saveProcessingLog };

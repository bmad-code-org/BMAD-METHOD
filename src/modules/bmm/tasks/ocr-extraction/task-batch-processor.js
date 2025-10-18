/**
 * Batch Processor Task
 * Orchestrates the complete extraction workflow
 * Manages state, progress, and error recovery
 */

const fileScanner = require('./task-file-scanner');
const ocrProcess = require('./task-ocr-process');
const dataParser = require('./task-data-parser');
const dataValidator = require('./task-data-validator');
// TODO: Integrate excel writing and file moving in future implementation
// const excelWriter = require('./task-excel-writer');
// const fileMover = require('./task-file-mover');

/**
 * Process batch of files end-to-end
 * @param {Object} config - Full workflow configuration
 * @param {Function} [onProgress] - Progress callback
 * @returns {Promise<Object>} Batch processing results
 */
async function processBatch(config, onProgress = null) {
  const results = {
    processed: [],
    failed: [],
    skipped: [],
    statistics: {},
  };

  // Step 1: Scan for files
  const scanResults = await fileScanner.scanFiles({
    sourcePath: config.paths.source_folder,
    fileTypes: config.file_types,
    processingLogPath: config.paths.log_folder + '/processing.json',
  });

  const queue = fileScanner.createProcessingQueue(scanResults);

  // Step 2: Process each file
  for (let i = 0; i < queue.files.length; i++) {
    const file = queue.files[i];

    try {
      if (onProgress) {
        onProgress(i + 1, queue.totalFiles, file);
      }

      // OCR Processing
      const ocrResult = await ocrProcess.processFileWithOCR({
        filePath: file.filePath,
        apiKey: config.api.api_key,
        model: config.api.model,
        extractionPrompt: buildExtractionPrompt(config.extraction_fields),
      });

      // Data Parsing
      const parsed = dataParser.parseOCRText(ocrResult.ocrText, config.extraction_fields);

      // Calculate confidence
      const confidence = dataParser.calculateExtractionConfidence(parsed);

      // Validation (if needed)
      const validated = await dataValidator.validateExtraction(parsed, file, confidence);

      if (validated.approved) {
        results.processed.push({
          file: file.fileName,
          data: validated.data,
          confidence,
        });
      } else {
        results.skipped.push({
          file: file.fileName,
          reason: 'Low confidence - requires manual review',
        });
      }
    } catch (error) {
      results.failed.push({
        file: file.fileName,
        error: error.message,
      });
    }
  }

  return results;
}

/**
 * Build extraction prompt from field definitions
 * @private
 */
function buildExtractionPrompt(fields) {
  const fieldList = fields.map((f) => f.name).join(', ');
  return `Extract the following fields from this document: ${fieldList}. Return the data in a clear, structured format.`;
}

module.exports = { processBatch };

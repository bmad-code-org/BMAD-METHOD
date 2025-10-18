/**
 * OCR Processing Task
 * Sends documents to Mistral OCR API via OpenRouter
 * Handles retry logic, rate limiting, and error recovery
 */

const fs = require('fs-extra');
const path = require('node:path');

/**
 * Process a document with OCR via OpenRouter API
 * @param {Object} config - Configuration object
 * @param {string} config.filePath - Path to file to process
 * @param {string} config.apiKey - OpenRouter API key
 * @param {string} [config.model='mistral/pixtral-large-latest'] - Model to use
 * @param {string} [config.endpoint='https://openrouter.ai/api/v1/chat/completions'] - API endpoint
 * @param {string} config.extractionPrompt - Prompt for data extraction
 * @param {number} [config.timeout=60000] - Request timeout in ms
 * @param {number} [config.maxRetries=3] - Maximum retry attempts
 * @param {number} [config.retryDelay=2000] - Delay between retries in ms
 * @returns {Promise<Object>} OCR result with text and metadata
 */
async function processFileWithOCR(config) {
  const {
    filePath,
    apiKey,
    model = 'mistral/pixtral-large-latest',
    endpoint = 'https://openrouter.ai/api/v1/chat/completions',
    extractionPrompt,
    timeout = 60_000,
    maxRetries = 3,
    retryDelay = 2000,
  } = config;

  // Validation
  if (!filePath || !apiKey || !extractionPrompt) {
    throw new Error('filePath, apiKey, and extractionPrompt are required');
  }

  if (!(await fs.pathExists(filePath))) {
    throw new Error(`File not found: ${filePath}`);
  }

  // Convert file to base64
  const fileBuffer = await fs.readFile(filePath);
  const base64Data = fileBuffer.toString('base64');
  const mimeType = getMimeType(path.extname(filePath));
  const dataUrl = `data:${mimeType};base64,${base64Data}`;

  // Prepare API request
  const requestBody = {
    model,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: dataUrl,
            },
          },
          {
            type: 'text',
            text: extractionPrompt,
          },
        ],
      },
    ],
  };

  // Execute with retry logic
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await makeAPIRequest(endpoint, apiKey, requestBody, timeout);

      // Extract OCR text from response
      const ocrText = result.choices?.[0]?.message?.content || '';

      return {
        success: true,
        ocrText,
        filePath,
        model,
        timestamp: new Date().toISOString(),
        attempt,
        rawResponse: result,
      };
    } catch (error) {
      lastError = error;

      // Don't retry on certain errors
      if (error.message.includes('authentication') || error.message.includes('invalid') || error.message.includes('not supported')) {
        throw error;
      }

      // Wait before retrying
      if (attempt < maxRetries) {
        await sleep(retryDelay * attempt); // Exponential backoff
      }
    }
  }

  // All retries failed
  throw new Error(`OCR processing failed after ${maxRetries} attempts: ${lastError.message}`);
}

/**
 * Make API request to OpenRouter
 * @private
 */
async function makeAPIRequest(endpoint, apiKey, body, timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/bmad-code-org/BMAD-METHOD',
        'X-Title': 'BMAD-METHOD OCR Extraction',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error(`API request timed out after ${timeout}ms`);
    }

    throw error;
  }
}

/**
 * Get MIME type from file extension
 * @private
 */
function getMimeType(extension) {
  const ext = extension.toLowerCase();
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };

  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Sleep utility
 * @private
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Process multiple files in batch with concurrency control
 * @param {Array<Object>} files - Array of file metadata objects
 * @param {Object} config - Configuration for OCR processing
 * @param {number} [concurrency=3] - Number of concurrent API calls
 * @param {Function} [onProgress] - Progress callback (current, total, file)
 * @returns {Promise<Object>} Batch processing results
 */
async function processBatch(files, config, concurrency = 3, onProgress = null) {
  const results = [];
  const errors = [];
  let completed = 0;

  // Process files in chunks to control concurrency
  for (let i = 0; i < files.length; i += concurrency) {
    const chunk = files.slice(i, i + concurrency);

    const chunkResults = await Promise.allSettled(
      chunk.map((file) =>
        processFileWithOCR({
          ...config,
          filePath: file.filePath,
        }),
      ),
    );

    for (const [j, result] of chunkResults.entries()) {
      const file = chunk[j];
      completed++;

      if (result.status === 'fulfilled') {
        results.push({
          ...result.value,
          fileName: file.fileName,
          fileType: file.fileType,
        });
      } else {
        errors.push({
          filePath: file.filePath,
          fileName: file.fileName,
          error: result.reason.message,
          timestamp: new Date().toISOString(),
        });
      }

      // Call progress callback
      if (onProgress) {
        onProgress(completed, files.length, file);
      }
    }
  }

  return {
    successful: results,
    failed: errors,
    totalProcessed: completed,
    successRate: files.length > 0 ? (results.length / files.length) * 100 : 0,
  };
}

/**
 * Calculate confidence score based on OCR response
 * @param {Object} ocrResult - Result from processFileWithOCR
 * @returns {number} Confidence score (0-1)
 */
function calculateConfidence(ocrResult) {
  // Simple heuristic - can be enhanced
  const text = ocrResult.ocrText || '';

  let score = 0.5; // Base score

  // Longer text generally means better extraction
  if (text.length > 100) score += 0.1;
  if (text.length > 500) score += 0.1;

  // Check for common data patterns
  if (/\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/.test(text)) score += 0.1; // Dates
  if (/\$?\d+[.,]\d{2}/.test(text)) score += 0.1; // Currency
  if (/[A-Z][a-z]+\s+[A-Z][a-z]+/.test(text)) score += 0.1; // Names

  // Penalize very short responses
  if (text.length < 50) score -= 0.2;

  return Math.max(0, Math.min(1, score));
}

module.exports = {
  processFileWithOCR,
  processBatch,
  calculateConfidence,
};

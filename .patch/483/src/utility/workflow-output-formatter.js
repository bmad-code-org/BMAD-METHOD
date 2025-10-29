/**
 * BMAD Workflow Output Formatter
 *
 * Integrates markdown formatting into the BMAD workflow execution pipeline.
 * This module provides utilities to automatically format generated markdown
 * files to ensure consistent CRLF line endings, proper whitespace, and GFM compliance.
 *
 * @version 1.0.0
 * @author BMAD
 */

const fs = require('fs-extra');
const path = require('node:path');
const { MarkdownFormatter, formatMarkdown } = require('./markdown-formatter.js');

class WorkflowOutputFormatter {
  constructor(options = {}) {
    this.options = {
      // Auto-format markdown files after workflow completion
      autoFormat: true,

      // File patterns to process
      patterns: ['**/*.md', '!node_modules/**', '!.git/**'],

      // Directories to monitor for new files
      watchDirs: [],

      // Markdown formatter options
      markdownOptions: {
        forceLineEnding: 'crlf', // Windows CRLF for compatibility
        normalizeWhitespace: true,
        enforceGFMCompliance: true,
        fixSmartQuotes: true,
        maxConsecutiveBlankLines: 2,
        debug: false,
      },

      // Logging
      verbose: false,

      ...options,
    };

    this.formatter = new MarkdownFormatter(this.options.markdownOptions);
  }

  /**
   * Format a single markdown file if it matches our patterns
   * @param {string} filePath - Absolute path to the file
   * @returns {Promise<boolean>} - True if file was processed and modified
   */
  async formatFile(filePath) {
    if (!this.isMarkdownFile(filePath)) {
      return false;
    }

    if (this.options.verbose) {
      console.log(`[WorkflowOutputFormatter] Processing: ${filePath}`);
    }

    try {
      const wasModified = await this.formatter.formatFile(filePath);

      if (wasModified && this.options.verbose) {
        console.log(`[WorkflowOutputFormatter] ✓ Formatted: ${filePath}`);
      } else if (this.options.verbose) {
        console.log(`[WorkflowOutputFormatter] - No changes: ${filePath}`);
      }

      return wasModified;
    } catch (error) {
      console.error(`[WorkflowOutputFormatter] Error formatting ${filePath}:`, error.message);
      return false;
    }
  }

  /**
   * Format all markdown files in a directory
   * @param {string} dirPath - Directory to scan
   * @param {boolean} recursive - Whether to scan recursively
   * @returns {Promise<number>} - Number of files processed
   */
  async formatDirectory(dirPath, recursive = true) {
    if (!(await fs.pathExists(dirPath))) {
      if (this.options.verbose) {
        console.log(`[WorkflowOutputFormatter] Directory not found: ${dirPath}`);
      }
      return 0;
    }

    let processedCount = 0;
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory() && recursive) {
        // Skip common ignore patterns
        if (entry.name.startsWith('.') || entry.name === 'node_modules') {
          continue;
        }
        processedCount += await this.formatDirectory(fullPath, recursive);
      } else if (entry.isFile()) {
        const wasProcessed = await this.formatFile(fullPath);
        if (wasProcessed) processedCount++;
      }
    }

    return processedCount;
  }

  /**
   * Post-process workflow output files
   * Called after a workflow completes to format any generated markdown
   * @param {string} outputPath - Path to the output file or directory
   * @returns {Promise<void>}
   */
  async postProcessWorkflowOutput(outputPath) {
    if (!this.options.autoFormat) {
      return;
    }

    if (this.options.verbose) {
      console.log(`[WorkflowOutputFormatter] Post-processing workflow output: ${outputPath}`);
    }

    const stat = await fs.stat(outputPath).catch(() => null);
    if (!stat) {
      if (this.options.verbose) {
        console.log(`[WorkflowOutputFormatter] Output path not found: ${outputPath}`);
      }
      return;
    }

    let processedCount = 0;

    if (stat.isFile()) {
      const wasProcessed = await this.formatFile(outputPath);
      if (wasProcessed) processedCount++;
    } else if (stat.isDirectory()) {
      processedCount = await this.formatDirectory(outputPath);
    }

    if (this.options.verbose && processedCount > 0) {
      console.log(`[WorkflowOutputFormatter] ✓ Processed ${processedCount} markdown files`);
    }
  }

  /**
   * Check if a file is a markdown file we should process
   * @param {string} filePath - File path to check
   * @returns {boolean}
   */
  isMarkdownFile(filePath) {
    return path.extname(filePath).toLowerCase() === '.md';
  }

  /**
   * Format markdown content directly (for in-memory processing)
   * @param {string} content - Markdown content to format
   * @returns {string} - Formatted markdown content
   */
  formatContent(content) {
    return this.formatter.format(content);
  }

  /**
   * Enable verbose logging
   */
  enableVerbose() {
    this.options.verbose = true;
  }

  /**
   * Disable verbose logging
   */
  disableVerbose() {
    this.options.verbose = false;
  }
}

/**
 * Create a default workflow formatter instance
 */
const defaultFormatter = new WorkflowOutputFormatter();

/**
 * Convenience function to format workflow output
 * @param {string} outputPath - Path to format
 * @param {Object} options - Formatter options
 * @returns {Promise<void>}
 */
async function formatWorkflowOutput(outputPath, options = {}) {
  const formatter = new WorkflowOutputFormatter(options);
  await formatter.postProcessWorkflowOutput(outputPath);
}

/**
 * Convenience function to format a directory of markdown files
 * @param {string} dirPath - Directory path
 * @param {Object} options - Formatter options
 * @returns {Promise<number>} - Number of files processed
 */
async function formatMarkdownDirectory(dirPath, options = {}) {
  const formatter = new WorkflowOutputFormatter(options);
  return await formatter.formatDirectory(dirPath);
}

module.exports = {
  WorkflowOutputFormatter,
  formatWorkflowOutput,
  formatMarkdownDirectory,
  // Export for convenience
  formatMarkdown,
  defaultFormatter,
};

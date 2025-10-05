#!/usr/bin/env node

/**
 * Automated Token Counter for BMAD Context Management
 * Estimates token count for files and provides real-time context budget tracking
 *
 * Usage:
 * node token-counter.js <file-or-directory>
 * node token-counter.js --watch <directory>
 * node token-counter.js --budget 5000 <files...>
 */

const fs = require('fs');
const path = require('path');

// Token estimation constants (based on GPT/Claude tokenization patterns)
const TOKENS_PER_WORD = 1.3;
const TOKENS_PER_CODE_LINE = 20;
const TOKENS_PER_MARKDOWN_LINE = 15;

class TokenCounter {
  constructor(options = {}) {
    this.budget = options.budget || null;
    this.verbose = options.verbose || false;
    this.watch = options.watch || false;
    this.totalTokens = 0;
    this.fileStats = [];
  }

  /**
   * Estimate tokens for text content
   */
  estimateTokens(content, filename = '') {
    const ext = path.extname(filename).toLowerCase();

    // Different estimation strategies based on file type
    if (['.js', '.ts', '.jsx', '.tsx', '.py', '.java'].includes(ext)) {
      return this.estimateCodeTokens(content);
    } else if (['.md', '.mdx'].includes(ext)) {
      return this.estimateMarkdownTokens(content);
    } else if (['.json', '.yaml', '.yml'].includes(ext)) {
      return this.estimateStructuredTokens(content);
    } else {
      return this.estimateTextTokens(content);
    }
  }

  /**
   * Estimate tokens for plain text
   */
  estimateTextTokens(content) {
    // Count words (split by whitespace and punctuation)
    const words = content.match(/\b\w+\b/g) || [];
    const wordTokens = words.length * TOKENS_PER_WORD;

    // Add overhead for punctuation and formatting
    const overhead = content.length * 0.05;

    return Math.ceil(wordTokens + overhead);
  }

  /**
   * Estimate tokens for code files
   */
  estimateCodeTokens(content) {
    const lines = content.split('\n');
    let tokens = 0;

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines and single-char lines
      if (trimmed.length <= 1) {
        tokens += 1;
      }
      // Comments get fewer tokens
      else if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
        tokens += trimmed.length * 0.3;
      }
      // Import statements are compact
      else if (trimmed.startsWith('import') || trimmed.startsWith('require')) {
        tokens += 10;
      }
      // Regular code lines
      else {
        tokens += TOKENS_PER_CODE_LINE;
      }
    }

    return Math.ceil(tokens);
  }

  /**
   * Estimate tokens for Markdown files
   */
  estimateMarkdownTokens(content) {
    const lines = content.split('\n');
    let tokens = 0;
    let inCodeBlock = false;

    for (const line of lines) {
      // Code block detection
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        tokens += 3;
        continue;
      }

      if (inCodeBlock) {
        tokens += TOKENS_PER_CODE_LINE;
      } else {
        // Headers are more compact
        if (line.match(/^#+\s/)) {
          tokens += line.length * 0.8;
        }
        // Lists are slightly compact
        else if (line.match(/^[\*\-\+]\s/) || line.match(/^\d+\.\s/)) {
          tokens += line.length * 0.9;
        }
        // Regular markdown text
        else {
          tokens += TOKENS_PER_MARKDOWN_LINE;
        }
      }
    }

    return Math.ceil(tokens);
  }

  /**
   * Estimate tokens for structured data (JSON/YAML)
   */
  estimateStructuredTokens(content) {
    // Structured data is more compact than plain text
    const chars = content.length;
    const lines = content.split('\n').length;

    // Estimate based on character count and structure
    const charTokens = chars * 0.2;
    const lineTokens = lines * 3;

    return Math.ceil(Math.max(charTokens, lineTokens));
  }

  /**
   * Count tokens in a file
   */
  async countFile(filepath) {
    try {
      const content = fs.readFileSync(filepath, 'utf-8');
      const tokens = this.estimateTokens(content, filepath);

      const stats = {
        file: path.basename(filepath),
        path: filepath,
        size: content.length,
        lines: content.split('\n').length,
        tokens: tokens,
        tokensPerLine: Math.round(tokens / content.split('\n').length)
      };

      this.fileStats.push(stats);
      this.totalTokens += tokens;

      return stats;
    } catch (error) {
      console.error(`Error reading ${filepath}:`, error.message);
      return null;
    }
  }

  /**
   * Count tokens in directory recursively
   */
  async countDirectory(dirpath, pattern = '*') {
    const files = this.getFiles(dirpath, pattern);

    for (const file of files) {
      await this.countFile(file);
    }

    return this.fileStats;
  }

  /**
   * Get all files matching pattern
   */
  getFiles(dirpath, pattern = '*') {
    const files = [];

    function walk(dir) {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          walk(fullPath);
        } else if (stat.isFile()) {
          // Simple pattern matching
          if (pattern === '*' || fullPath.includes(pattern)) {
            files.push(fullPath);
          }
        }
      }
    }

    walk(dirpath);
    return files;
  }

  /**
   * Generate budget status with color codes
   */
  getBudgetStatus() {
    if (!this.budget) return '';

    const percentage = (this.totalTokens / this.budget) * 100;
    let status, color, emoji;

    if (percentage < 50) {
      status = 'GREEN';
      color = '\x1b[32m'; // Green
      emoji = '🟢';
    } else if (percentage < 75) {
      status = 'YELLOW';
      color = '\x1b[33m'; // Yellow
      emoji = '🟡';
    } else if (percentage < 90) {
      status = 'ORANGE';
      color = '\x1b[38;5;208m'; // Orange
      emoji = '🟠';
    } else {
      status = 'RED';
      color = '\x1b[31m'; // Red
      emoji = '🔴';
    }

    const reset = '\x1b[0m';
    return `${color}${emoji} ${status} (${percentage.toFixed(1)}% of budget)${reset}`;
  }

  /**
   * Print report
   */
  printReport() {
    console.log('\n' + '='.repeat(80));
    console.log('TOKEN COUNT REPORT');
    console.log('='.repeat(80));

    if (this.verbose) {
      console.log('\nDETAILED FILE ANALYSIS:');
      console.log('-'.repeat(80));

      // Sort by token count
      const sorted = [...this.fileStats].sort((a, b) => b.tokens - a.tokens);

      for (const stat of sorted) {
        console.log(`\n📄 ${stat.file}`);
        console.log(`   Path: ${stat.path}`);
        console.log(`   Lines: ${stat.lines} | Size: ${stat.size} bytes`);
        console.log(`   Tokens: ~${stat.tokens} (${stat.tokensPerLine} per line avg)`);
      }
    } else {
      console.log('\nTOP 10 FILES BY TOKEN COUNT:');
      console.log('-'.repeat(80));

      const top10 = [...this.fileStats]
        .sort((a, b) => b.tokens - a.tokens)
        .slice(0, 10);

      for (const stat of top10) {
        const bar = '█'.repeat(Math.floor(stat.tokens / 100));
        console.log(`${stat.file.padEnd(40)} ${String(stat.tokens).padStart(6)} tokens ${bar}`);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('SUMMARY:');
    console.log('-'.repeat(80));
    console.log(`Total Files: ${this.fileStats.length}`);
    console.log(`Total Tokens: ~${this.totalTokens}`);

    if (this.budget) {
      console.log(`Token Budget: ${this.budget}`);
      console.log(`Budget Status: ${this.getBudgetStatus()}`);
      console.log(`Remaining: ${Math.max(0, this.budget - this.totalTokens)} tokens`);
    }

    console.log('\nRECOMMENDATIONS:');
    if (this.totalTokens > 5000) {
      console.log('⚠️  Consider creating checkpoints to compress context');
    }
    if (this.fileStats.some(f => f.tokens > 1500)) {
      console.log('⚠️  Some files exceed 1500 tokens - consider splitting or section loading');
    }

    console.log('='.repeat(80));
  }

  /**
   * Watch mode - monitor directory for changes
   */
  watchDirectory(dirpath) {
    console.log(`Watching ${dirpath} for changes...`);

    const recalculate = () => {
      this.totalTokens = 0;
      this.fileStats = [];
      this.countDirectory(dirpath).then(() => {
        console.clear();
        this.printReport();
        console.log('\n👁️  Watching for changes... (Ctrl+C to exit)');
      });
    };

    recalculate();

    fs.watch(dirpath, { recursive: true }, (eventType, filename) => {
      if (filename && !filename.includes('node_modules')) {
        console.log(`Change detected in ${filename}`);
        setTimeout(recalculate, 100);
      }
    });
  }
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Token Counter - Estimate token usage for BMAD context management

Usage:
  node token-counter.js <file-or-directory>         Count tokens
  node token-counter.js --budget <N> <files...>     Count with budget
  node token-counter.js --watch <directory>         Watch mode
  node token-counter.js --verbose <file/dir>        Detailed output

Examples:
  node token-counter.js agents/                     Count all agent files
  node token-counter.js --budget 5000 data/         Check data files against budget
  node token-counter.js --watch .                   Monitor current directory

Token Estimation:
  - Plain text: ~1.3 tokens per word
  - Code: ~20 tokens per line
  - Markdown: ~15 tokens per line
  - JSON/YAML: ~0.2 tokens per character
    `);
    return;
  }

  const options = {
    budget: null,
    verbose: args.includes('--verbose'),
    watch: args.includes('--watch')
  };

  // Parse budget
  const budgetIndex = args.indexOf('--budget');
  if (budgetIndex !== -1 && args[budgetIndex + 1]) {
    options.budget = parseInt(args[budgetIndex + 1]);
    args.splice(budgetIndex, 2);
  }

  // Remove flags
  const paths = args.filter(arg => !arg.startsWith('--'));

  const counter = new TokenCounter(options);

  // Process paths
  for (const p of paths) {
    const fullPath = path.resolve(p);

    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);

      if (options.watch && stat.isDirectory()) {
        counter.watchDirectory(fullPath);
        return; // Watch mode runs indefinitely
      } else if (stat.isDirectory()) {
        counter.countDirectory(fullPath).then(() => counter.printReport());
      } else {
        counter.countFile(fullPath).then(() => counter.printReport());
      }
    } else {
      console.error(`Path not found: ${p}`);
    }
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = TokenCounter;
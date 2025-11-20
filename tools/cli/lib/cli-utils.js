const chalk = require('chalk');
const boxen = require('boxen');
const wrapAnsi = require('wrap-ansi');
const figlet = require('figlet');
const path = require('node:path');

const CLIUtils = {
  /**
   * Get version from package.json
   */
  getVersion() {
    try {
      const packageJson = require(path.join(__dirname, '..', '..', '..', 'package.json'));
      return packageJson.version || 'Unknown';
    } catch {
      return 'Unknown';
    }
  },

  /**
   * Display BMAD logo
   * @param {boolean} clearScreen - Whether to clear the screen first (default: true for initial display only)
   */
  displayLogo(clearScreen = true) {
    if (clearScreen) {
      console.clear();
    }

    const version = this.getVersion();

    // ASCII art logo
    const logo = `
    ██████╗ ███╗   ███╗ █████╗ ██████╗ ™
    ██╔══██╗████╗ ████║██╔══██╗██╔══██╗
    ██████╔╝██╔████╔██║███████║██║  ██║
    ██╔══██╗██║╚██╔╝██║██╔══██║██║  ██║
    ██████╔╝██║ ╚═╝ ██║██║  ██║██████╔╝
    ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝`;

    console.log(chalk.cyan(logo));
    console.log(chalk.dim(`    Build More, Architect Dreams`) + chalk.cyan.bold(` v${version}`) + '\n');
  },

  /**
   * Display section header
   * @param {string} title - Section title
   * @param {string} subtitle - Optional subtitle
   */
  displaySection(title, subtitle = null) {
    console.log('\n' + chalk.cyan('═'.repeat(80)));
    console.log(chalk.cyan.bold(` ${title}`));
    if (subtitle) {
      console.log(chalk.dim(` ${subtitle}`));
    }
    console.log(chalk.cyan('═'.repeat(80)) + '\n');
  },

  /**
   * Display info box
   * @param {string|Array} content - Content to display
   * @param {Object} options - Box options
   */
  displayBox(content, options = {}) {
    const defaultOptions = {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      ...options,
    };

    // Handle array content
    let text = content;
    if (Array.isArray(content)) {
      text = content.join('\n\n');
    }

    // Wrap text to prevent overflow
    const wrapped = wrapAnsi(text, 76, { hard: true, wordWrap: true });

    console.log(boxen(wrapped, defaultOptions));
  },

  /**
   * Display module configuration header
   * @param {string} moduleName - Module name (fallback if no custom header)
   * @param {string} header - Custom header from install-config.yaml
   * @param {string} subheader - Custom subheader from install-config.yaml
   */
  displayModuleConfigHeader(moduleName, header = null, subheader = null) {
    // Simple blue banner with custom header/subheader if provided
    console.log('\n' + chalk.cyan('─'.repeat(80)));
    console.log(chalk.cyan(header || `Configuring ${moduleName.toUpperCase()} Module`));
    if (subheader) {
      console.log(chalk.dim(`${subheader}`));
    }
    console.log(chalk.cyan('─'.repeat(80)) + '\n');
  },

  /**
   * Display module with no custom configuration
   * @param {string} moduleName - Module name (fallback if no custom header)
   * @param {string} header - Custom header from install-config.yaml
   * @param {string} subheader - Custom subheader from install-config.yaml
   */
  displayModuleNoConfig(moduleName, header = null, subheader = null) {
    // Show full banner with header/subheader, just like modules with config
    console.log('\n' + chalk.cyan('─'.repeat(80)));
    console.log(chalk.cyan(header || `${moduleName.toUpperCase()} Module - No Custom Configuration`));
    if (subheader) {
      console.log(chalk.dim(`${subheader}`));
    }
    console.log(chalk.cyan('─'.repeat(80)) + '\n');
  },

  /**
   * Display step indicator
   * @param {number} current - Current step
   * @param {number} total - Total steps
   * @param {string} description - Step description
   */
  displayStep(current, total, description) {
    const progress = `[${current}/${total}]`;
    console.log('\n' + chalk.cyan(progress) + ' ' + chalk.bold(description));
    console.log(chalk.dim('─'.repeat(80 - progress.length - 1)) + '\n');
  },

  /**
   * Display completion message
   * @param {string} message - Completion message
   */
  displayComplete(message) {
    console.log(
      '\n' +
        boxen(chalk.green('✨ ' + message), {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'green',
        }),
    );
  },

  /**
   * Display error message
   * @param {string} message - Error message
   */
  displayError(message) {
    console.log(
      '\n' +
        boxen(chalk.red('✗ ' + message), {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'red',
        }),
    );
  },

  /**
   * Format list for display
   * @param {Array} items - Items to display
   * @param {string} prefix - Item prefix
   */
  formatList(items, prefix = '•') {
    return items.map((item) => `  ${prefix} ${item}`).join('\n');
  },

  /**
   * Clear previous lines
   * @param {number} lines - Number of lines to clear
   */
  clearLines(lines) {
    for (let i = 0; i < lines; i++) {
      process.stdout.moveCursor(0, -1);
      process.stdout.clearLine(1);
    }
  },

  /**
   * Display table
   * @param {Array} data - Table data
   * @param {Object} options - Table options
   */
  displayTable(data, options = {}) {
    const Table = require('cli-table3');
    const table = new Table({
      style: {
        head: ['cyan'],
        border: ['dim'],
      },
      ...options,
    });

    for (const row of data) table.push(row);
    console.log(table.toString());
  },

  /**
   * Display module completion message
   * @param {string} moduleName - Name of the completed module
   * @param {boolean} clearScreen - Whether to clear the screen first (deprecated, always false now)
   */
  displayModuleComplete(moduleName, clearScreen = false) {
    // No longer clear screen or show boxes - just a simple completion message
    // This is deprecated but kept for backwards compatibility
  },
};

module.exports = { CLIUtils };

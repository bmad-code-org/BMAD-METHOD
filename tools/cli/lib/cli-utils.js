const path = require('node:path');
const os = require('node:os');
const prompts = require('./prompts');

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
   * Display BMAD logo using @clack intro + box
   * @param {boolean} _clearScreen - Deprecated, ignored (no longer clears screen)
   */
  async displayLogo(_clearScreen = true) {
    const version = this.getVersion();
    const color = await prompts.getColor();

    // ASCII art logo
    const logo = [
      '    ██████╗ ███╗   ███╗ █████╗ ██████╗ ™',
      '    ██╔══██╗████╗ ████║██╔══██╗██╔══██╗',
      '    ██████╔╝██╔████╔██║███████║██║  ██║',
      '    ██╔══██╗██║╚██╔╝██║██╔══██║██║  ██║',
      '    ██████╔╝██║ ╚═╝ ██║██║  ██║██████╔╝',
      '    ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝',
    ]
      .map((line) => color.yellow(line))
      .join('\n');

    const tagline = '    Build More, Architect Dreams';

    await prompts.box(`${logo}\n${tagline}`, `v${version}`, {
      contentAlign: 'center',
      rounded: true,
      formatBorder: color.blue,
    });
  },

  /**
   * Display section header
   * @param {string} title - Section title
   * @param {string} subtitle - Optional subtitle
   */
  async displaySection(title, subtitle = null) {
    await prompts.note(subtitle || '', title);
  },

  /**
   * Display info box
   * @param {string|Array} content - Content to display
   * @param {Object} options - Box options
   */
  async displayBox(content, options = {}) {
    let text = content;
    if (Array.isArray(content)) {
      text = content.join('\n\n');
    }

    const color = await prompts.getColor();
    const borderColor = options.borderColor || 'cyan';
    const colorMap = { green: color.green, red: color.red, yellow: color.yellow, cyan: color.cyan, blue: color.blue };
    const formatBorder = colorMap[borderColor] || color.cyan;

    await prompts.box(text, options.title, {
      rounded: options.borderStyle === 'round' || options.borderStyle === undefined,
      formatBorder,
    });
  },

  /**
   * Display module configuration header
   * @param {string} moduleName - Module name (fallback if no custom header)
   * @param {string} header - Custom header from module.yaml
   * @param {string} subheader - Custom subheader from module.yaml
   */
  async displayModuleConfigHeader(moduleName, header = null, subheader = null) {
    const title = header || `Configuring ${moduleName.toUpperCase()} Module`;
    await prompts.note(subheader || '', title);
  },

  /**
   * Display module with no custom configuration
   * @param {string} moduleName - Module name (fallback if no custom header)
   * @param {string} header - Custom header from module.yaml
   * @param {string} subheader - Custom subheader from module.yaml
   */
  async displayModuleNoConfig(moduleName, header = null, subheader = null) {
    const title = header || `${moduleName.toUpperCase()} Module - No Custom Configuration`;
    await prompts.note(subheader || '', title);
  },

  /**
   * Display step indicator
   * @param {number} current - Current step
   * @param {number} total - Total steps
   * @param {string} description - Step description
   */
  async displayStep(current, total, description) {
    const progress = `[${current}/${total}]`;
    await prompts.log.step(`${progress} ${description}`);
  },

  /**
   * Display completion message
   * @param {string} message - Completion message
   */
  async displayComplete(message) {
    const color = await prompts.getColor();
    await prompts.box(`\u2728 ${message}`, 'Complete', {
      rounded: true,
      formatBorder: color.green,
    });
  },

  /**
   * Display error message
   * @param {string} message - Error message
   */
  async displayError(message) {
    const color = await prompts.getColor();
    await prompts.box(`\u2717 ${message}`, 'Error', {
      rounded: true,
      formatBorder: color.red,
    });
  },

  /**
   * Format list for display
   * @param {Array} items - Items to display
   * @param {string} prefix - Item prefix
   */
  formatList(items, prefix = '\u2022') {
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
   * Display module completion message
   * @param {string} moduleName - Name of the completed module
   * @param {boolean} clearScreen - Whether to clear the screen first (deprecated, always false now)
   */
  displayModuleComplete(moduleName, clearScreen = false) {
    // No longer clear screen or show boxes - just a simple completion message
    // This is deprecated but kept for backwards compatibility
  },

  /**
   * Expand path with ~ expansion
   * @param {string} inputPath - Path to expand
   * @returns {string} Expanded path
   */
  expandPath(inputPath) {
    if (!inputPath) return inputPath;

    // Expand ~ to home directory
    if (inputPath.startsWith('~')) {
      return path.join(os.homedir(), inputPath.slice(1));
    }

    return inputPath;
  },
};

module.exports = { CLIUtils };

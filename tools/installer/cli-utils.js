const prompts = require('./prompts');

const CLIUtils = {
  /**
   * Display BMAD logo and version using @clack intro + box
   */
  async displayLogo() {
    const color = await prompts.getColor();
    const termWidth = process.stdout.columns || 80;

    // Full "BMad Method" logo for wide terminals, "BMad" only for narrow
    const logoWide = [
      ' ██████╗ ███╗   ███╗ █████╗ ██████╗     ███╗   ███╗███████╗████████╗██╗  ██╗ ██████╗ ██████╗ ™',
      '██╔══██╗████╗ ████║██╔══██╗██╔══██╗    ████╗ ████║██╔════╝╚══██╔══╝██║  ██║██╔═══██╗██╔══██╗',
      '██████╔╝██╔████╔██║███████║██║  ██║    ██╔████╔██║█████╗     ██║   ███████║██║   ██║██║  ██║',
      '██╔══██╗██║╚██╔╝██║██╔══██║██║  ██║    ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██║   ██║██║  ██║',
      '██████╔╝██║ ╚═╝ ██║██║  ██║██████╔╝    ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║╚██████╔╝██████╔╝',
      '╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝     ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ',
    ];

    const logoNarrow = [
      '    ██████╗ ███╗   ███╗ █████╗ ██████╗ ™',
      '    ██╔══██╗████╗ ████║██╔══██╗██╔══██╗',
      '    ██████╔╝██╔████╔██║███████║██║  ██║',
      '    ██╔══██╗██║╚██╔╝██║██╔══██║██║  ██║',
      '    ██████╔╝██║ ╚═╝ ██║██║  ██║██████╔╝',
      '    ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝',
    ];

    const logoLines = termWidth >= 95 ? logoWide : logoNarrow;
    const logo = logoLines.map((line) => color.blue(line)).join('\n');
    // The wordmark supplies "BMad Method", so the lines below read as its
    // tagline, then its positioning, then the company credit.
    const tagline = color.white('    Agile Ai Driven Development');
    const slogan = color.dim('    the agile way to do AiDD');
    const credit = color.dim('    Build More, Architect Dreams · © BMad Code');

    await prompts.box(`${logo}\n${tagline}\n${slogan}\n${credit}`, '', {
      contentAlign: 'center',
      rounded: true,
      formatBorder: color.blue,
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
};

module.exports = { CLIUtils };

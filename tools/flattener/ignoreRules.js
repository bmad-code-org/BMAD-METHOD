const fs = require('fs-extra');
const path = require('node:path');
const ignore = require('ignore');

// Central default ignore patterns for discovery and filtering.
// These complement .gitignore and are applied regardless of VCS presence.
const DEFAULT_PATTERNS = [
  // Project/VCS
  '**/.bmad-core/**',
  '**/.git/**',
  '**/.svn/**',
  '**/.hg/**',
  '**/.bzr/**',
  // Package/build outputs
  '**/node_modules/**',
  '**/bower_components/**',
  '**/vendor/**',
  '**/packages/**',
  '**/build/**',
  '**/dist/**',
  '**/out/**',
  '**/target/**',
  '**/bin/**',
  '**/obj/**',
  '**/release/**',
  '**/debug/**',
  // Environments
  '**/.venv/**',
  '**/venv/**',
  '**/.virtualenv/**',
  '**/virtualenv/**',
  '**/env/**',
  // Logs & coverage
  '**/*.log',
  '**/npm-debug.log*',
  '**/yarn-debug.log*',
  '**/yarn-error.log*',
  '**/lerna-debug.log*',
  '**/coverage/**',
  '**/.nyc_output/**',
  '**/.coverage/**',
  '**/test-results/**',
  // Caches & temp
  '**/.cache/**',
  '**/.tmp/**',
  '**/.temp/**',
  '**/tmp/**',
  '**/temp/**',
  '**/.sass-cache/**',
  // IDE/editor
  '**/.vscode/**',
  '**/.idea/**',
  '**/*.swp',
  '**/*.swo',
  '**/*~',
  '**/.project',
  '**/.classpath',
  '**/.settings/**',
  '**/*.sublime-project',
  '**/*.sublime-workspace',
  // Lockfiles
  '**/package-lock.json',
  '**/yarn.lock',
  '**/pnpm-lock.yaml',
  '**/composer.lock',
  '**/Pipfile.lock',
  // Python/Java/compiled artifacts
  '**/*.pyc',
  '**/*.pyo',
  '**/*.pyd',
  '**/__pycache__/**',
  '**/*.class',
  '**/*.jar',
  '**/*.war',
  '**/*.ear',
  '**/*.o',
  '**/*.so',
  '**/*.dll',
  '**/*.exe',
  // System junk
  '**/lib64/**',
  '**/.venv/lib64/**',
  '**/venv/lib64/**',
  '**/_site/**',
  '**/.jekyll-cache/**',
  '**/.jekyll-metadata',
  '**/.DS_Store',
  '**/.DS_Store?',
  '**/._*',
  '**/.Spotlight-V100/**',
  '**/.Trashes/**',
  '**/ehthumbs.db',
  '**/Thumbs.db',
  '**/desktop.ini',
  // XML outputs
  '**/flattened-codebase.xml',
  '**/repomix-output.xml',
  // Images, media, fonts, archives, docs, dylibs
  '**/*.jpg',
  '**/*.jpeg',
  '**/*.png',
  '**/*.gif',
  '**/*.bmp',
  '**/*.ico',
  '**/*.svg',
  '**/*.pdf',
  '**/*.doc',
  '**/*.docx',
  '**/*.xls',
  '**/*.xlsx',
  '**/*.ppt',
  '**/*.pptx',
  '**/*.zip',
  '**/*.tar',
  '**/*.gz',
  '**/*.rar',
  '**/*.7z',
  '**/*.dylib',
  '**/*.mp3',
  '**/*.mp4',
  '**/*.avi',
  '**/*.mov',
  '**/*.wav',
  '**/*.ttf',
  '**/*.otf',
  '**/*.woff',
  '**/*.woff2',
  // Env files
  '**/.env',
  '**/.env.*',
  '**/*.env',
  // Misc
  '**/junit.xml',
];

async function readIgnoreFile(filePath) {
  try {
    if (!(await fs.pathExists(filePath))) return [];
    const content = await fs.readFile(filePath, 'utf8');
    return content
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'));
  } catch {
    return [];
  }
}

// Backward compatible export matching previous signature
async function parseGitignore(gitignorePath) {
  return readIgnoreFile(gitignorePath);
}

async function loadIgnore(rootDir, extraPatterns = []) {
  const ig = ignore();
  const gitignorePath = path.join(rootDir, '.gitignore');
  const flattenIgnorePath = path.join(rootDir, '.bmad-flattenignore');
  const patterns = [
    ...(await readIgnoreFile(gitignorePath)),
    ...DEFAULT_PATTERNS,
    ...(await readIgnoreFile(flattenIgnorePath)),
    ...extraPatterns,
  ];
  // De-duplicate
  const unique = [...new Set(patterns.map(String))];
  ig.add(unique);

  // Include-only filter: return true if path should be included
  const filter = (relativePath) => !ig.ignores(relativePath.replaceAll('\\', '/'));

  return { ig, filter, patterns: unique };
}

module.exports = {
  DEFAULT_PATTERNS,
  parseGitignore,
  loadIgnore,
};

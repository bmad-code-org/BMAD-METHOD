/**
 * Rehype Plugin Tests
 *
 * Tests for rehype-markdown-links and rehype-base-paths plugins:
 * - findFirstDelimiter helper
 * - detectContentDir helper
 * - Transformer skip conditions
 * - Path resolution
 * - Index handling
 * - Query/hash preservation
 * - Base path prefixing
 * - Element rewriting
 * - Raw HTML rewriting
 * - Integration (both plugins together)
 *
 * Usage: node test/test-rehype-plugins.mjs
 */

import rehypeMarkdownLinks, { findFirstDelimiter, detectContentDir } from '../website/src/rehype-markdown-links.js';
import rehypeBasePaths from '../website/src/rehype-base-paths.js';

// ANSI colors
const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  yellow: '\u001B[33m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
};

let passed = 0;
let failed = 0;

/**
 * Test helper: Assert condition
 */
function assert(condition, testName, errorMessage = '') {
  if (condition) {
    console.log(`${colors.green}\u2713${colors.reset} ${testName}`);
    passed++;
  } else {
    console.log(`${colors.red}\u2717${colors.reset} ${testName}`);
    if (errorMessage) {
      console.log(`  ${colors.dim}${errorMessage}${colors.reset}`);
    }
    failed++;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CONTENT_DIR = '/project/src/content/docs';
const STD_FILE = { path: '/project/src/content/docs/guide/intro.md' };
const STD_OPTS = { contentDir: CONTENT_DIR };
const BASE = '/BMAD-METHOD/';

function transform(tree, file, options = {}) {
  const plugin = rehypeMarkdownLinks(options);
  plugin(tree, file);
  return tree;
}

function transformBase(tree, options = {}) {
  const plugin = rehypeBasePaths(options);
  plugin(tree);
  return tree;
}

function makeAnchorTree(href) {
  return {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'a',
        properties: { href },
        children: [{ type: 'text', value: 'link' }],
      },
    ],
  };
}

function makeElementTree(tagName, properties) {
  return {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName,
        properties: { ...properties },
        children: [],
      },
    ],
  };
}

function getHref(tree) {
  return tree.children[0].properties.href;
}

function getSrc(tree) {
  return tree.children[0].properties.src;
}

function getRawValue(tree) {
  return tree.children[0].value;
}

// ---------------------------------------------------------------------------
// Test Suite
// ---------------------------------------------------------------------------

function runTests() {
  console.log(`${colors.cyan}========================================`);
  console.log('Rehype Plugin Tests');
  console.log(`========================================${colors.reset}\n`);

  // ============================================================
  // findFirstDelimiter helper
  // ============================================================
  console.log(`${colors.yellow}findFirstDelimiter helper (8 tests)${colors.reset}\n`);

  assert(findFirstDelimiter('page') === -1, 'No delimiters returns -1', `Expected -1, got ${findFirstDelimiter('page')}`);

  assert(findFirstDelimiter('page.md?v=1') === 7, 'Only ? returns its index (7)', `Expected 7, got ${findFirstDelimiter('page.md?v=1')}`);

  assert(findFirstDelimiter('page.md#sec') === 7, 'Only # returns its index (7)', `Expected 7, got ${findFirstDelimiter('page.md#sec')}`);

  assert(
    findFirstDelimiter('page.md?v=1#sec') === 7,
    '? before # returns index of ?',
    `Expected 7, got ${findFirstDelimiter('page.md?v=1#sec')}`,
  );

  assert(
    findFirstDelimiter('page.md#sec?v=1') === 7,
    '# before ? returns index of #',
    `Expected 7, got ${findFirstDelimiter('page.md#sec?v=1')}`,
  );

  assert(findFirstDelimiter('') === -1, 'Empty string returns -1', `Expected -1, got ${findFirstDelimiter('')}`);

  assert(findFirstDelimiter('#top') === 0, '# at position 0 returns 0', `Expected 0, got ${findFirstDelimiter('#top')}`);

  assert(findFirstDelimiter('?q=1') === 0, '? at position 0 returns 0', `Expected 0, got ${findFirstDelimiter('?q=1')}`);

  console.log('');

  // ============================================================
  // detectContentDir helper
  // ============================================================
  console.log(`${colors.yellow}detectContentDir helper (6 tests)${colors.reset}\n`);

  assert(
    detectContentDir('/project/src/content/docs/guide/intro.md') === '/project/src/content/docs',
    'Standard path finds content dir',
    `Got ${detectContentDir('/project/src/content/docs/guide/intro.md')}`,
  );

  assert(
    detectContentDir('/some/random/path/file.md') === null,
    'No match returns null',
    `Got ${detectContentDir('/some/random/path/file.md')}`,
  );

  assert(detectContentDir('/src/content') === null, 'Too few segments returns null', `Got ${detectContentDir('/src/content')}`);

  assert(
    detectContentDir('/src/content/docs') === '/src/content/docs',
    'Exactly 3 matching segments returns match',
    `Got ${detectContentDir('/src/content/docs')}`,
  );

  assert(
    detectContentDir('/a/src/content/docs/nested/src/content/docs/deep/file.md') === '/a/src/content/docs/nested/src/content/docs',
    'Nested double match finds innermost',
    `Got ${detectContentDir('/a/src/content/docs/nested/src/content/docs/deep/file.md')}`,
  );

  assert(detectContentDir('') === null, 'Empty string returns null', `Got ${detectContentDir('')}`);

  console.log('');

  // ============================================================
  // Transformer skip conditions
  // ============================================================
  console.log(`${colors.yellow}Transformer skip conditions (21 tests)${colors.reset}\n`);

  {
    const tree = makeAnchorTree('https://example.com');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === 'https://example.com', 'External https URL unchanged', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('http://example.com');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === 'http://example.com', 'External http URL unchanged', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('//cdn.example.com/path');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '//cdn.example.com/path', 'Protocol-relative // unchanged', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('mailto:user@example.com');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === 'mailto:user@example.com', 'mailto: unchanged', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('tel:+15551234567');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === 'tel:+15551234567', 'tel: unchanged', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('./page.html');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === './page.html', '.html unchanged', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('./doc.pdf');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === './doc.pdf', '.pdf unchanged', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('./page.mdx');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === './page.mdx', '.mdx unchanged', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('#section');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '#section', '#section unchanged', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('?page=2');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '?page=2', '?page=2 unchanged', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '', 'Empty href unchanged', `Got ${getHref(tree)}`);
  }

  {
    // Non-anchor element (div) unchanged
    const tree = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'div',
          properties: { href: 'page.md' },
          children: [],
        },
      ],
    };
    transform(tree, STD_FILE, STD_OPTS);
    assert(tree.children[0].properties.href === 'page.md', 'Non-anchor element (div) unchanged', `Got ${tree.children[0].properties.href}`);
  }

  {
    // Anchor without properties (no crash)
    const tree = {
      type: 'root',
      children: [{ type: 'element', tagName: 'a', children: [] }],
    };
    let threw = false;
    try {
      transform(tree, STD_FILE, STD_OPTS);
    } catch {
      threw = true;
    }
    assert(!threw, 'Anchor without properties unchanged (no crash)');
  }

  {
    // Anchor with numeric href
    const tree = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'a',
          properties: { href: 42 },
          children: [],
        },
      ],
    };
    transform(tree, STD_FILE, STD_OPTS);
    assert(tree.children[0].properties.href === 42, 'Anchor with numeric href unchanged', `Got ${tree.children[0].properties.href}`);
  }

  {
    // Anchor with null href
    const tree = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'a',
          properties: { href: null },
          children: [],
        },
      ],
    };
    transform(tree, STD_FILE, STD_OPTS);
    assert(tree.children[0].properties.href === null, 'Anchor with null href unchanged', `Got ${tree.children[0].properties.href}`);
  }

  {
    // Anchor with undefined href
    const tree = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'a',
          properties: { href: undefined },
          children: [],
        },
      ],
    };
    transform(tree, STD_FILE, STD_OPTS);
    assert(
      tree.children[0].properties.href === undefined,
      'Anchor with undefined href unchanged',
      `Got ${tree.children[0].properties.href}`,
    );
  }

  {
    // Target outside content root unchanged
    const tree = makeAnchorTree('../../../../../../outside.md');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '../../../../../../outside.md', 'Target outside content root unchanged', `Got ${getHref(tree)}`);
  }

  {
    // No file path -> no processing
    const tree = makeAnchorTree('sibling.md');
    transform(tree, { path: undefined }, STD_OPTS);
    assert(getHref(tree) === 'sibling.md', 'No file path -> no processing', `Got ${getHref(tree)}`);
  }

  {
    // Empty string path -> no processing
    const tree = makeAnchorTree('sibling.md');
    transform(tree, { path: '' }, STD_OPTS);
    assert(getHref(tree) === 'sibling.md', 'Empty string path -> no processing', `Got ${getHref(tree)}`);
  }

  {
    // page.MD (uppercase) unchanged
    const tree = makeAnchorTree('page.MD');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === 'page.MD', 'page.MD (uppercase) unchanged', `Got ${getHref(tree)}`);
  }

  {
    // page.Md (mixed case) unchanged
    const tree = makeAnchorTree('page.Md');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === 'page.Md', 'page.Md (mixed case) unchanged', `Got ${getHref(tree)}`);
  }

  console.log('');

  // ============================================================
  // Error conditions
  // ============================================================
  console.log(`${colors.yellow}Error conditions (1 test)${colors.reset}\n`);

  {
    // No content dir + no contentDir option -> throws
    const tree = makeAnchorTree('sibling.md');
    const file = { path: '/some/random/path/file.md' };
    let threw = false;
    let errorMsg = '';
    try {
      transform(tree, file, {});
    } catch (error) {
      threw = true;
      errorMsg = error.message;
    }
    assert(
      threw && errorMsg.includes('Could not detect content directory'),
      'No content dir + no contentDir option throws',
      `threw=${threw}, msg=${errorMsg}`,
    );
  }

  console.log('');

  // ============================================================
  // Path resolution
  // ============================================================
  console.log(`${colors.yellow}Path resolution (7 tests)${colors.reset}\n`);

  {
    const tree = makeAnchorTree('sibling.md');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '/guide/sibling/', 'Bare relative sibling.md -> /guide/sibling/', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('./sibling.md');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '/guide/sibling/', 'Dot-slash ./sibling.md -> /guide/sibling/', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('../other/page.md');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '/other/page/', 'Parent ../other/page.md -> /other/page/', `Got ${getHref(tree)}`);
  }

  {
    // Use a file two levels deep so ../../ still stays inside content root
    const deepFile = {
      path: '/project/src/content/docs/guide/sub/intro.md',
    };
    const tree = makeAnchorTree('../../root-level.md');
    transform(tree, deepFile, STD_OPTS);
    assert(getHref(tree) === '/root-level/', 'Deep parent ../../root-level.md -> /root-level/', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('./sub/deep/page.md');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '/guide/sub/deep/page/', 'Into subdir ./sub/deep/page.md -> /guide/sub/deep/page/', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('/docs/guide/page.md');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '/guide/page/', 'Absolute /docs/guide/page.md -> /guide/page/', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('/guide/page.md');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '/guide/page/', 'Absolute /guide/page.md -> /guide/page/', `Got ${getHref(tree)}`);
  }

  console.log('');

  // ============================================================
  // Index handling
  // ============================================================
  console.log(`${colors.yellow}Index handling (5 tests)${colors.reset}\n`);

  {
    const tree = makeAnchorTree('index.md');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '/guide/', 'index.md -> /guide/', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('./sub/index.md');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '/guide/sub/', './sub/index.md -> /guide/sub/', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('../index.md');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '/', '../index.md -> /', `Got ${getHref(tree)}`);
  }

  {
    // Root index.md: file at content root
    const rootFile = {
      path: '/project/src/content/docs/intro.md',
    };
    const tree = makeAnchorTree('index.md');
    transform(tree, rootFile, STD_OPTS);
    assert(getHref(tree) === '/', 'Root index.md -> /', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('/docs/index.md');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '/', '/docs/index.md -> /', `Got ${getHref(tree)}`);
  }

  console.log('');

  // ============================================================
  // Query/hash preservation
  // ============================================================
  console.log(`${colors.yellow}Query/hash preservation (5 tests)${colors.reset}\n`);

  {
    const tree = makeAnchorTree('page.md#section');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '/guide/page/#section', 'page.md#section -> /guide/page/#section', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('page.md?foo=bar');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '/guide/page/?foo=bar', 'page.md?foo=bar -> /guide/page/?foo=bar', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('page.md?foo=bar#section');
    transform(tree, STD_FILE, STD_OPTS);
    assert(
      getHref(tree) === '/guide/page/?foo=bar#section',
      'page.md?foo=bar#section -> /guide/page/?foo=bar#section',
      `Got ${getHref(tree)}`,
    );
  }

  {
    const tree = makeAnchorTree('page.md#section?foo=bar');
    transform(tree, STD_FILE, STD_OPTS);
    assert(
      getHref(tree) === '/guide/page/#section?foo=bar',
      'page.md#section?foo=bar -> /guide/page/#section?foo=bar',
      `Got ${getHref(tree)}`,
    );
  }

  {
    const tree = makeAnchorTree('index.md#top');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '/guide/#top', 'index.md#top -> /guide/#top', `Got ${getHref(tree)}`);
  }

  console.log('');

  // ============================================================
  // Base path
  // ============================================================
  console.log(`${colors.yellow}Base path (4 tests)${colors.reset}\n`);

  {
    const tree = makeAnchorTree('page.md');
    transform(tree, STD_FILE, { ...STD_OPTS, base: '/' });
    assert(getHref(tree) === '/guide/page/', 'Base / -> /guide/page/', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('page.md');
    transform(tree, STD_FILE, { ...STD_OPTS, base: '/BMAD-METHOD/' });
    assert(getHref(tree) === '/BMAD-METHOD/guide/page/', 'Base /BMAD-METHOD/ -> /BMAD-METHOD/guide/page/', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('page.md');
    transform(tree, STD_FILE, { ...STD_OPTS, base: '/BMAD-METHOD' });
    assert(getHref(tree) === '/BMAD-METHOD/guide/page/', 'Base /BMAD-METHOD (no trailing slash) -> same result', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('page.md');
    transform(tree, STD_FILE, { ...STD_OPTS, base: '/org/repo/docs/' });
    assert(getHref(tree) === '/org/repo/docs/guide/page/', 'Base /org/repo/docs/ -> /org/repo/docs/guide/page/', `Got ${getHref(tree)}`);
  }

  console.log('');

  // ============================================================
  // Normalization
  // ============================================================
  console.log(`${colors.yellow}Normalization (3 tests)${colors.reset}\n`);

  {
    const tree = makeAnchorTree('page.md');
    transform(tree, STD_FILE, { ...STD_OPTS, base: '/' });
    assert(!getHref(tree).includes('//'), 'No // in output for root base', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('page.md');
    transform(tree, STD_FILE, { ...STD_OPTS, base: '/BMAD-METHOD/' });
    assert(!getHref(tree).includes('//'), 'No // in output for subpath base', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('page.md#section');
    transform(tree, STD_FILE, STD_OPTS);
    const href = getHref(tree);
    const hashIndex = href.indexOf('#');
    assert(href[hashIndex - 1] === '/', 'Trailing slash before suffix', `Got ${href}`);
  }

  console.log('');

  // ============================================================
  // Edge cases
  // ============================================================
  console.log(`${colors.yellow}Edge cases (5 tests)${colors.reset}\n`);

  {
    const tree = makeAnchorTree('v2.0.md');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '/guide/v2.0/', 'v2.0.md -> /guide/v2.0/', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('file.test.md');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '/guide/file.test/', 'file.test.md -> /guide/file.test/', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('markdown-guide/foo.md');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '/guide/markdown-guide/foo/', 'markdown-guide/foo.md -> /guide/markdown-guide/foo/', `Got ${getHref(tree)}`);
  }

  {
    // .md bare -> processes (not left as ".md")
    const tree = makeAnchorTree('.md');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) !== '.md', '.md bare -> processes (not left as ".md")', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('\u00FCber-guide.md');
    transform(tree, STD_FILE, STD_OPTS);
    assert(getHref(tree) === '/guide/\u00FCber-guide/', '\u00FCber-guide.md -> /guide/\u00FCber-guide/', `Got ${getHref(tree)}`);
  }

  console.log('');

  // ============================================================
  // rehype-base-paths: Option handling
  // ============================================================
  console.log(`${colors.yellow}rehype-base-paths: Option handling (5 tests)${colors.reset}\n`);

  {
    const tree = makeAnchorTree('/page/');
    transformBase(tree, {});
    assert(getHref(tree) === '/page/', 'Default no-op for absolute href', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('/page/');
    transformBase(tree, { base: '/BMAD-METHOD/' });
    assert(getHref(tree) === '/BMAD-METHOD/page/', 'Base /BMAD-METHOD/ prefixes', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('/page/');
    transformBase(tree, { base: '/BMAD-METHOD' });
    assert(getHref(tree) === '/BMAD-METHOD/page/', 'Base /BMAD-METHOD normalizes (adds trailing slash)', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('/page/');
    transformBase(tree, { base: '' });
    assert(getHref(tree) === '/page/', 'Empty string falls back to / (no-op)', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('/page/');
    transformBase(tree, { base: '/' });
    assert(getHref(tree) === '/page/', 'Root / is no-op', `Got ${getHref(tree)}`);
  }

  console.log('');

  // ============================================================
  // rehype-base-paths: Element rewriting
  // ============================================================
  console.log(`${colors.yellow}rehype-base-paths: Element rewriting (9 tests)${colors.reset}\n`);

  {
    const tree = makeAnchorTree('/page/');
    transformBase(tree, { base: BASE });
    assert(getHref(tree) === '/BMAD-METHOD/page/', 'a[href] prefixed', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeElementTree('img', { src: '/img/logo.png' });
    transformBase(tree, { base: BASE });
    assert(getSrc(tree) === '/BMAD-METHOD/img/logo.png', 'img[src] prefixed', `Got ${getSrc(tree)}`);
  }

  {
    const tree = makeElementTree('link', { href: '/styles/main.css' });
    transformBase(tree, { base: BASE });
    assert(
      tree.children[0].properties.href === '/BMAD-METHOD/styles/main.css',
      'link[href] prefixed',
      `Got ${tree.children[0].properties.href}`,
    );
  }

  {
    const tree = makeElementTree('script', { src: '/js/app.js' });
    transformBase(tree, { base: BASE });
    assert(getSrc(tree) === '/js/app.js', 'script[src] NOT prefixed (not in tag list)', `Got ${getSrc(tree)}`);
  }

  {
    const tree = makeElementTree('video', { src: '/media/intro.mp4' });
    transformBase(tree, { base: BASE });
    assert(getSrc(tree) === '/BMAD-METHOD/media/intro.mp4', 'video[src] prefixed', `Got ${getSrc(tree)}`);
  }

  {
    const tree = makeElementTree('audio', { src: '/media/clip.mp3' });
    transformBase(tree, { base: BASE });
    assert(getSrc(tree) === '/BMAD-METHOD/media/clip.mp3', 'audio[src] prefixed', `Got ${getSrc(tree)}`);
  }

  {
    const tree = makeElementTree('iframe', { src: '/embed/widget' });
    transformBase(tree, { base: BASE });
    assert(getSrc(tree) === '/BMAD-METHOD/embed/widget', 'iframe[src] prefixed', `Got ${getSrc(tree)}`);
  }

  {
    const tree = makeElementTree('area', { href: '/map/region' });
    transformBase(tree, { base: BASE });
    assert(
      tree.children[0].properties.href === '/map/region',
      'area[href] NOT prefixed (not in tag list)',
      `Got ${tree.children[0].properties.href}`,
    );
  }

  {
    const tree = makeElementTree('source', { src: '/media/alt.mp4' });
    transformBase(tree, { base: BASE });
    assert(getSrc(tree) === '/BMAD-METHOD/media/alt.mp4', 'source[src] prefixed', `Got ${getSrc(tree)}`);
  }

  console.log('');

  // ============================================================
  // rehype-base-paths: No-op base /
  // ============================================================
  console.log(`${colors.yellow}rehype-base-paths: No-op base / (2 tests)${colors.reset}\n`);

  {
    const tree = makeAnchorTree('/page/');
    transformBase(tree, { base: '/' });
    assert(getHref(tree) === '/page/', 'a[href] unchanged with base /', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeElementTree('img', { src: '/img/logo.png' });
    transformBase(tree, { base: '/' });
    assert(getSrc(tree) === '/img/logo.png', 'img[src] unchanged with base /', `Got ${getSrc(tree)}`);
  }

  console.log('');

  // ============================================================
  // rehype-base-paths: Skip conditions
  // ============================================================
  console.log(`${colors.yellow}rehype-base-paths: Skip conditions (10 tests)${colors.reset}\n`);

  {
    const tree = makeAnchorTree('//cdn.example.com/path');
    transformBase(tree, { base: BASE });
    assert(getHref(tree) === '//cdn.example.com/path', 'Protocol-relative skipped', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('https://example.com');
    transformBase(tree, { base: BASE });
    assert(getHref(tree) === 'https://example.com', 'External https skipped', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('http://example.com');
    transformBase(tree, { base: BASE });
    assert(getHref(tree) === 'http://example.com', 'External http skipped', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('data:text/html,hello');
    transformBase(tree, { base: BASE });
    assert(getHref(tree) === 'data:text/html,hello', 'data: URI skipped', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('#section');
    transformBase(tree, { base: BASE });
    assert(getHref(tree) === '#section', '#section skipped', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('');
    transformBase(tree, { base: BASE });
    assert(getHref(tree) === '', 'Empty href skipped', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('/BMAD-METHOD/page/');
    transformBase(tree, { base: BASE });
    assert(getHref(tree) === '/BMAD-METHOD/page/', 'Already prefixed skipped', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('relative/path');
    transformBase(tree, { base: BASE });
    assert(getHref(tree) === 'relative/path', 'Relative path skipped', `Got ${getHref(tree)}`);
  }

  {
    // Non-target element (button with href-like attribute via properties)
    const tree = makeElementTree('button', { href: '/page/' });
    transformBase(tree, { base: BASE });
    assert(tree.children[0].properties.href === '/page/', 'Non-target element skipped', `Got ${tree.children[0].properties.href}`);
  }

  {
    // Non-target attribute (data-url on an img)
    const tree = makeElementTree('img', {
      src: '/img/logo.png',
      'data-url': '/some/path',
    });
    transformBase(tree, { base: BASE });
    assert(
      tree.children[0].properties['data-url'] === '/some/path',
      'Non-target attribute (data-url) skipped',
      `Got ${tree.children[0].properties['data-url']}`,
    );
  }

  console.log('');

  // ============================================================
  // rehype-base-paths: Anchor .md handling
  // ============================================================
  console.log(`${colors.yellow}rehype-base-paths: Anchor .md handling (4 tests)${colors.reset}\n`);

  {
    const tree = makeAnchorTree('/docs/guide/page.md');
    transformBase(tree, { base: BASE });
    assert(getHref(tree) === '/docs/guide/page.md', '.md href skipped', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('/docs/guide/page.md#section');
    transformBase(tree, { base: BASE });
    assert(getHref(tree) === '/docs/guide/page.md#section', '.md#section skipped', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('/docs/guide/page.md?v=1');
    transformBase(tree, { base: BASE });
    assert(getHref(tree) === '/docs/guide/page.md?v=1', '.md?v=1 skipped', `Got ${getHref(tree)}`);
  }

  {
    const tree = makeAnchorTree('/docs/index.md');
    transformBase(tree, { base: BASE });
    assert(getHref(tree) === '/docs/index.md', 'index.md skipped', `Got ${getHref(tree)}`);
  }

  console.log('');

  // ============================================================
  // rehype-base-paths: srcset
  // ============================================================
  console.log(`${colors.yellow}rehype-base-paths: srcset (1 test)${colors.reset}\n`);

  {
    const tree = makeElementTree('img', {
      src: '/img/logo.png',
      srcset: '/img/logo-2x.png 2x',
    });
    transformBase(tree, { base: BASE });
    assert(
      tree.children[0].properties.srcset === '/img/logo-2x.png 2x',
      'srcset not handled by plugin',
      `Got ${tree.children[0].properties.srcset}`,
    );
  }

  console.log('');

  // ============================================================
  // rehype-base-paths: Raw HTML
  // ============================================================
  console.log(`${colors.yellow}rehype-base-paths: Raw HTML (7 tests)${colors.reset}\n`);

  {
    const tree = {
      type: 'root',
      children: [{ type: 'raw', value: '<img src="/img/logo.png">' }],
    };
    transformBase(tree, { base: BASE });
    assert(getRawValue(tree) === '<img src="/BMAD-METHOD/img/logo.png">', 'Raw img src rewritten', `Got ${getRawValue(tree)}`);
  }

  {
    const tree = {
      type: 'root',
      children: [{ type: 'raw', value: '<a href="/page/">link</a>' }],
    };
    transformBase(tree, { base: BASE });
    assert(getRawValue(tree) === '<a href="/BMAD-METHOD/page/">link</a>', 'Raw a href rewritten', `Got ${getRawValue(tree)}`);
  }

  {
    const tree = {
      type: 'root',
      children: [{ type: 'raw', value: '<img src="//cdn.example.com/img.png">' }],
    };
    transformBase(tree, { base: BASE });
    assert(getRawValue(tree) === '<img src="//cdn.example.com/img.png">', 'Raw protocol-relative unchanged', `Got ${getRawValue(tree)}`);
  }

  {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'raw',
          value: '<img src="/BMAD-METHOD/img/logo.png">',
        },
      ],
    };
    transformBase(tree, { base: BASE });
    assert(getRawValue(tree) === '<img src="/BMAD-METHOD/img/logo.png">', 'Raw already prefixed unchanged', `Got ${getRawValue(tree)}`);
  }

  {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'raw',
          value: '<a href="/page/"><img src="/img/logo.png"></a>',
        },
      ],
    };
    transformBase(tree, { base: BASE });
    assert(
      getRawValue(tree) === '<a href="/BMAD-METHOD/page/"><img src="/BMAD-METHOD/img/logo.png"></a>',
      'Raw multiple attributes rewritten',
      `Got ${getRawValue(tree)}`,
    );
  }

  {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'raw',
          value: '<a href="https://example.com">external</a>',
        },
      ],
    };
    transformBase(tree, { base: BASE });
    assert(getRawValue(tree) === '<a href="https://example.com">external</a>', 'Raw external URL unchanged', `Got ${getRawValue(tree)}`);
  }

  {
    // Base / skips raw visit entirely
    const tree = {
      type: 'root',
      children: [{ type: 'raw', value: '<img src="/img/logo.png">' }],
    };
    transformBase(tree, { base: '/' });
    assert(getRawValue(tree) === '<img src="/img/logo.png">', 'Base / skips raw visit', `Got ${getRawValue(tree)}`);
  }

  console.log('');

  // ============================================================
  // Integration: both plugins together
  // ============================================================
  console.log(`${colors.yellow}Integration: both plugins together (4 tests)${colors.reset}\n`);

  {
    // ./sibling.md through both -> no double prefix
    const tree = makeAnchorTree('./sibling.md');
    transform(tree, STD_FILE, { ...STD_OPTS, base: BASE });
    transformBase(tree, { base: BASE });
    const href = getHref(tree);
    assert(href === '/BMAD-METHOD/guide/sibling/', './sibling.md through both -> no double prefix', `Got ${href}`);
  }

  {
    // img /img/logo.png -> only base-paths prefixes
    const tree = makeElementTree('img', { src: '/img/logo.png' });
    // markdown-links doesn't touch img elements, so just run base-paths
    transformBase(tree, { base: BASE });
    assert(getSrc(tree) === '/BMAD-METHOD/img/logo.png', 'img /img/logo.png -> only base-paths prefixes', `Got ${getSrc(tree)}`);
  }

  {
    // External -> both skip
    const tree = makeAnchorTree('https://example.com');
    transform(tree, STD_FILE, { ...STD_OPTS, base: BASE });
    transformBase(tree, { base: BASE });
    assert(getHref(tree) === 'https://example.com', 'External -> both skip', `Got ${getHref(tree)}`);
  }

  {
    // /page/ (non-.md) -> only base-paths prefixes
    const tree = makeAnchorTree('/page/');
    transform(tree, STD_FILE, { ...STD_OPTS, base: BASE });
    transformBase(tree, { base: BASE });
    assert(getHref(tree) === '/BMAD-METHOD/page/', '/page/ (non-.md) -> only base-paths prefixes', `Got ${getHref(tree)}`);
  }

  console.log('');

  // ============================================================
  // Summary
  // ============================================================
  console.log(`${colors.cyan}========================================`);
  console.log('Test Results:');
  console.log(`  Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`  Failed: ${colors.red}${failed}${colors.reset}`);
  console.log(`========================================${colors.reset}\n`);

  if (failed === 0) {
    console.log(`${colors.green}All rehype plugin tests passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}Some rehype plugin tests failed${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
try {
  runTests();
} catch (error) {
  console.error(`${colors.red}Test runner failed:${colors.reset}`, error.message);
  console.error(error.stack);
  process.exit(1);
}

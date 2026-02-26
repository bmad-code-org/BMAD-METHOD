/**
 * Native fs Wrapper Tests
 *
 * Validates that tools/cli/lib/fs.js provides the same API surface
 * as fs-extra but backed entirely by native node:fs. Exercises every
 * exported method the CLI codebase relies on.
 *
 * Usage: node test/test-fs-wrapper.js
 * Exit codes: 0 = all tests pass, 1 = test failures
 */

const nativeFs = require('node:fs');
const path = require('node:path');
const fs = require('../tools/cli/lib/fs');

// ANSI color codes
const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  yellow: '\u001B[33m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
};

let totalTests = 0;
let passedTests = 0;
const failures = [];

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ${colors.green}\u2713${colors.reset} ${name}`);
  } catch (error) {
    console.log(`  ${colors.red}\u2717${colors.reset} ${name} ${colors.red}${error.message}${colors.reset}`);
    failures.push({ name, message: error.message });
  }
}

async function asyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ${colors.green}\u2713${colors.reset} ${name}`);
  } catch (error) {
    console.log(`  ${colors.red}\u2717${colors.reset} ${name} ${colors.red}${error.message}${colors.reset}`);
    failures.push({ name, message: error.message });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// ── Test fixtures ───────────────────────────────────────────────────────────

const TMP = path.join(__dirname, '.tmp-fs-wrapper-test');

function setup() {
  nativeFs.rmSync(TMP, { recursive: true, force: true });
  nativeFs.mkdirSync(TMP, { recursive: true });
}

function teardown() {
  nativeFs.rmSync(TMP, { recursive: true, force: true });
}

// ── Tests ───────────────────────────────────────────────────────────────────

async function runTests() {
  console.log(`${colors.cyan}========================================`);
  console.log('Native fs Wrapper Tests');
  console.log(`========================================${colors.reset}\n`);

  setup();

  // ── Re-exported native members ──────────────────────────────────────────

  console.log(`${colors.yellow}Re-exported native fs members${colors.reset}`);

  test('exports fs.constants', () => {
    assert(fs.constants !== undefined, 'fs.constants is undefined');
    assert(typeof fs.constants.F_OK === 'number', 'fs.constants.F_OK is not a number');
  });

  test('exports fs.existsSync', () => {
    assert(typeof fs.existsSync === 'function', 'fs.existsSync is not a function');
    assert(fs.existsSync(__dirname), 'existsSync returns false for existing dir');
    assert(!fs.existsSync(path.join(TMP, 'nonexistent')), 'existsSync returns true for missing path');
  });

  test('exports fs.readFileSync', () => {
    const content = fs.readFileSync(__filename, 'utf8');
    assert(content.includes('Native fs Wrapper Tests'), 'readFileSync did not return expected content');
  });

  test('exports fs.writeFileSync', () => {
    const p = path.join(TMP, 'write-sync.txt');
    fs.writeFileSync(p, 'hello sync');
    assertEqual(nativeFs.readFileSync(p, 'utf8'), 'hello sync', 'writeFileSync content mismatch');
  });

  test('exports fs.mkdirSync', () => {
    const p = path.join(TMP, 'mkdir-sync');
    fs.mkdirSync(p);
    assert(nativeFs.statSync(p).isDirectory(), 'mkdirSync did not create directory');
  });

  test('exports fs.readdirSync', () => {
    const entries = fs.readdirSync(TMP);
    assert(Array.isArray(entries), 'readdirSync did not return array');
  });

  test('exports fs.statSync', () => {
    const stat = fs.statSync(__dirname);
    assert(stat.isDirectory(), 'statSync did not return directory stat');
  });

  test('exports fs.copyFileSync', () => {
    const src = path.join(TMP, 'copy-src.txt');
    const dest = path.join(TMP, 'copy-dest.txt');
    nativeFs.writeFileSync(src, 'copy me');
    fs.copyFileSync(src, dest);
    assertEqual(nativeFs.readFileSync(dest, 'utf8'), 'copy me', 'copyFileSync content mismatch');
  });

  test('exports fs.accessSync', () => {
    // Should not throw for existing file
    fs.accessSync(__filename);
    let threw = false;
    try {
      fs.accessSync(path.join(TMP, 'nonexistent'));
    } catch {
      threw = true;
    }
    assert(threw, 'accessSync did not throw for missing file');
  });

  test('exports fs.createReadStream', () => {
    assert(typeof fs.createReadStream === 'function', 'createReadStream is not a function');
  });

  console.log('');

  // ── Async promise-based methods ─────────────────────────────────────────

  console.log(`${colors.yellow}Async promise-based methods${colors.reset}`);

  await asyncTest('readFile returns promise with content', async () => {
    const content = await fs.readFile(__filename, 'utf8');
    assert(content.includes('Native fs Wrapper Tests'), 'readFile did not return expected content');
  });

  await asyncTest('writeFile writes content asynchronously', async () => {
    const p = path.join(TMP, 'write-async.txt');
    await fs.writeFile(p, 'hello async');
    assertEqual(nativeFs.readFileSync(p, 'utf8'), 'hello async', 'writeFile content mismatch');
  });

  await asyncTest('readdir returns directory entries', async () => {
    const dir = path.join(TMP, 'readdir-test');
    nativeFs.mkdirSync(dir, { recursive: true });
    nativeFs.writeFileSync(path.join(dir, 'a.txt'), 'a');
    const entries = await fs.readdir(dir);
    assert(Array.isArray(entries), 'readdir did not return array');
    assert(entries.length > 0, 'readdir returned empty array for non-empty dir');
  });

  await asyncTest('readdir with withFileTypes returns Dirent objects', async () => {
    const dir = path.join(TMP, 'dirent-test');
    nativeFs.mkdirSync(dir, { recursive: true });
    nativeFs.writeFileSync(path.join(dir, 'file.txt'), 'content');
    nativeFs.mkdirSync(path.join(dir, 'subdir'));

    const entries = await fs.readdir(dir, { withFileTypes: true });
    assert(Array.isArray(entries), 'should return array');

    const fileEntry = entries.find((e) => e.name === 'file.txt');
    const dirEntry = entries.find((e) => e.name === 'subdir');

    assert(fileEntry && typeof fileEntry.isFile === 'function', 'entry should have isFile method');
    assert(dirEntry && typeof dirEntry.isDirectory === 'function', 'entry should have isDirectory method');
    assert(fileEntry.isFile(), 'file entry should return true for isFile()');
    assert(dirEntry.isDirectory(), 'dir entry should return true for isDirectory()');
  });

  await asyncTest('stat returns file stats', async () => {
    const stat = await fs.stat(__dirname);
    assert(stat.isDirectory(), 'stat did not return directory stat');
  });

  await asyncTest('access resolves for existing file', async () => {
    await fs.access(__filename); // should not throw
  });

  await asyncTest('access rejects for missing file', async () => {
    let threw = false;
    try {
      await fs.access(path.join(TMP, 'nonexistent'));
    } catch {
      threw = true;
    }
    assert(threw, 'access did not reject for missing file');
  });

  await asyncTest('rename moves a file', async () => {
    const src = path.join(TMP, 'rename-src.txt');
    const dest = path.join(TMP, 'rename-dest.txt');
    nativeFs.writeFileSync(src, 'rename me');
    await fs.rename(src, dest);
    assert(!nativeFs.existsSync(src), 'rename did not remove source');
    assertEqual(nativeFs.readFileSync(dest, 'utf8'), 'rename me', 'rename content mismatch');
  });

  await asyncTest('realpath resolves path', async () => {
    const resolved = await fs.realpath(__dirname);
    assert(typeof resolved === 'string', 'realpath did not return string');
    assert(resolved.length > 0, 'realpath returned empty string');
  });

  console.log('');

  // ── fs-extra compatible methods ─────────────────────────────────────────

  console.log(`${colors.yellow}fs-extra compatible methods${colors.reset}`);

  await asyncTest('ensureDir creates nested directories', async () => {
    const p = path.join(TMP, 'ensure', 'deep', 'nested');
    await fs.ensureDir(p);
    assert(nativeFs.statSync(p).isDirectory(), 'ensureDir did not create nested dirs');
  });

  await asyncTest('ensureDir is idempotent on existing directory', async () => {
    const p = path.join(TMP, 'ensure', 'deep', 'nested');
    await fs.ensureDir(p); // should not throw
    assert(nativeFs.statSync(p).isDirectory(), 'ensureDir failed on existing dir');
  });

  await asyncTest('pathExists returns true for existing path', async () => {
    assertEqual(await fs.pathExists(__filename), true, 'pathExists returned false for existing file');
  });

  await asyncTest('pathExists returns false for missing path', async () => {
    assertEqual(await fs.pathExists(path.join(TMP, 'nonexistent')), false, 'pathExists returned true for missing path');
  });

  test('pathExistsSync returns true for existing path', () => {
    assertEqual(fs.pathExistsSync(__filename), true, 'pathExistsSync returned false for existing file');
  });

  test('pathExistsSync returns false for missing path', () => {
    assertEqual(fs.pathExistsSync(path.join(TMP, 'nonexistent')), false, 'pathExistsSync returned true for missing path');
  });

  await asyncTest('copy copies a single file', async () => {
    const src = path.join(TMP, 'copy-file-src.txt');
    const dest = path.join(TMP, 'copy-file-dest.txt');
    nativeFs.writeFileSync(src, 'copy file');
    await fs.copy(src, dest);
    assertEqual(nativeFs.readFileSync(dest, 'utf8'), 'copy file', 'copy file content mismatch');
  });

  await asyncTest('copy creates parent directories for dest', async () => {
    const src = path.join(TMP, 'copy-file-src.txt');
    const dest = path.join(TMP, 'copy-deep', 'nested', 'dest.txt');
    await fs.copy(src, dest);
    assertEqual(nativeFs.readFileSync(dest, 'utf8'), 'copy file', 'copy with mkdir content mismatch');
  });

  await asyncTest('copy copies a directory recursively', async () => {
    const srcDir = path.join(TMP, 'copy-dir-src');
    nativeFs.mkdirSync(path.join(srcDir, 'sub'), { recursive: true });
    nativeFs.writeFileSync(path.join(srcDir, 'a.txt'), 'file a');
    nativeFs.writeFileSync(path.join(srcDir, 'sub', 'b.txt'), 'file b');

    const destDir = path.join(TMP, 'copy-dir-dest');
    await fs.copy(srcDir, destDir);

    assertEqual(nativeFs.readFileSync(path.join(destDir, 'a.txt'), 'utf8'), 'file a', 'copy dir: top-level file mismatch');
    assertEqual(nativeFs.readFileSync(path.join(destDir, 'sub', 'b.txt'), 'utf8'), 'file b', 'copy dir: nested file mismatch');
  });

  await asyncTest('copy respects overwrite: false for files', async () => {
    const src = path.join(TMP, 'overwrite-src.txt');
    const dest = path.join(TMP, 'overwrite-dest.txt');
    nativeFs.writeFileSync(src, 'new content');
    nativeFs.writeFileSync(dest, 'original content');
    await fs.copy(src, dest, { overwrite: false });
    assertEqual(nativeFs.readFileSync(dest, 'utf8'), 'original content', 'copy overwrote file when overwrite: false');
  });

  await asyncTest('copy respects overwrite: false for directories', async () => {
    const srcDir = path.join(TMP, 'ow-dir-src');
    nativeFs.mkdirSync(srcDir, { recursive: true });
    nativeFs.writeFileSync(path.join(srcDir, 'file.txt'), 'new');

    const destDir = path.join(TMP, 'ow-dir-dest');
    nativeFs.mkdirSync(destDir, { recursive: true });
    nativeFs.writeFileSync(path.join(destDir, 'file.txt'), 'original');

    await fs.copy(srcDir, destDir, { overwrite: false });
    assertEqual(nativeFs.readFileSync(path.join(destDir, 'file.txt'), 'utf8'), 'original', 'copy dir overwrote file when overwrite: false');
  });

  await asyncTest('copy respects filter option for files', async () => {
    const srcDir = path.join(TMP, 'filter-src');
    nativeFs.mkdirSync(srcDir, { recursive: true });
    nativeFs.writeFileSync(path.join(srcDir, 'keep.txt'), 'keep me');
    nativeFs.writeFileSync(path.join(srcDir, 'skip.log'), 'skip me');

    const destDir = path.join(TMP, 'filter-dest');
    await fs.copy(srcDir, destDir, {
      filter: (src) => !src.endsWith('.log'),
    });

    assert(nativeFs.existsSync(path.join(destDir, 'keep.txt')), 'filter: kept file is missing');
    assert(!nativeFs.existsSync(path.join(destDir, 'skip.log')), 'filter: skipped file was copied');
  });

  await asyncTest('copy respects filter option for directories', async () => {
    const srcDir = path.join(TMP, 'filter-dir-src');
    nativeFs.mkdirSync(path.join(srcDir, 'include'), { recursive: true });
    nativeFs.mkdirSync(path.join(srcDir, 'node_modules'), { recursive: true });
    nativeFs.writeFileSync(path.join(srcDir, 'include', 'a.txt'), 'included');
    nativeFs.writeFileSync(path.join(srcDir, 'node_modules', 'b.txt'), 'excluded');

    const destDir = path.join(TMP, 'filter-dir-dest');
    await fs.copy(srcDir, destDir, {
      filter: (src) => !src.includes('node_modules'),
    });

    assert(nativeFs.existsSync(path.join(destDir, 'include', 'a.txt')), 'filter: included dir file is missing');
    assert(!nativeFs.existsSync(path.join(destDir, 'node_modules')), 'filter: excluded dir was copied');
  });

  await asyncTest('copy filter skips top-level src when filter returns false', async () => {
    const src = path.join(TMP, 'filter-skip-src.txt');
    const dest = path.join(TMP, 'filter-skip-dest.txt');
    nativeFs.writeFileSync(src, 'should not be copied');
    await fs.copy(src, dest, {
      filter: () => false,
    });
    assert(!nativeFs.existsSync(dest), 'filter: file was copied despite filter returning false');
  });

  await asyncTest('remove deletes a file', async () => {
    const p = path.join(TMP, 'remove-file.txt');
    nativeFs.writeFileSync(p, 'delete me');
    await fs.remove(p);
    assert(!nativeFs.existsSync(p), 'remove did not delete file');
  });

  await asyncTest('remove deletes a directory recursively', async () => {
    const dir = path.join(TMP, 'remove-dir');
    nativeFs.mkdirSync(path.join(dir, 'sub'), { recursive: true });
    nativeFs.writeFileSync(path.join(dir, 'sub', 'file.txt'), 'nested');
    await fs.remove(dir);
    assert(!nativeFs.existsSync(dir), 'remove did not delete directory');
  });

  await asyncTest('remove does not throw for missing path', async () => {
    await fs.remove(path.join(TMP, 'nonexistent-remove-target'));
    // should not throw — force: true
  });

  await asyncTest('move renames a file', async () => {
    const src = path.join(TMP, 'move-src.txt');
    const dest = path.join(TMP, 'move-dest.txt');
    nativeFs.writeFileSync(src, 'move me');
    await fs.move(src, dest);
    assert(!nativeFs.existsSync(src), 'move did not remove source');
    assertEqual(nativeFs.readFileSync(dest, 'utf8'), 'move me', 'move content mismatch');
  });

  await asyncTest('move renames a directory', async () => {
    const srcDir = path.join(TMP, 'move-dir-src');
    nativeFs.mkdirSync(srcDir, { recursive: true });
    nativeFs.writeFileSync(path.join(srcDir, 'file.txt'), 'dir move');

    const destDir = path.join(TMP, 'move-dir-dest');
    await fs.move(srcDir, destDir);
    assert(!nativeFs.existsSync(srcDir), 'move did not remove source dir');
    assertEqual(nativeFs.readFileSync(path.join(destDir, 'file.txt'), 'utf8'), 'dir move', 'move dir content mismatch');
  });

  test('readJsonSync parses JSON file', () => {
    const p = path.join(TMP, 'test.json');
    nativeFs.writeFileSync(p, JSON.stringify({ key: 'value', num: 42 }));
    const result = fs.readJsonSync(p);
    assertEqual(result.key, 'value', 'readJsonSync key mismatch');
    assertEqual(result.num, 42, 'readJsonSync num mismatch');
  });

  test('readJsonSync throws on invalid JSON', () => {
    const p = path.join(TMP, 'bad.json');
    nativeFs.writeFileSync(p, '{ invalid json }');
    let threw = false;
    try {
      fs.readJsonSync(p);
    } catch {
      threw = true;
    }
    assert(threw, 'readJsonSync did not throw on invalid JSON');
  });

  test('readJsonSync strips UTF-8 BOM', () => {
    const p = path.join(TMP, 'bom.json');
    nativeFs.writeFileSync(p, '\uFEFF{"bom": true}');
    const result = fs.readJsonSync(p);
    assertEqual(result.bom, true, 'readJsonSync failed to parse BOM-prefixed JSON');
  });

  console.log('');

  // ── Bulk copy stress test ───────────────────────────────────────────────

  console.log(`${colors.yellow}Bulk copy determinism${colors.reset}`);

  await asyncTest('copy preserves all files in a large directory tree', async () => {
    // Create a tree with 200+ files to verify no silent loss
    const srcDir = path.join(TMP, 'bulk-src');
    const fileCount = 250;

    for (let i = 0; i < fileCount; i++) {
      const subDir = path.join(srcDir, `dir-${String(Math.floor(i / 10)).padStart(2, '0')}`);
      nativeFs.mkdirSync(subDir, { recursive: true });
      nativeFs.writeFileSync(path.join(subDir, `file-${i}.txt`), `content-${i}`);
    }

    const destDir = path.join(TMP, 'bulk-dest');
    await fs.copy(srcDir, destDir);

    // Count all files in destination
    let destCount = 0;
    const countFiles = (dir) => {
      const entries = nativeFs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          countFiles(path.join(dir, entry.name));
        } else {
          destCount++;
        }
      }
    };
    countFiles(destDir);

    assertEqual(destCount, fileCount, `bulk copy lost files: expected ${fileCount}, got ${destCount}`);
  });

  console.log('');

  // ── Cleanup ─────────────────────────────────────────────────────────────

  teardown();

  // ── Summary ─────────────────────────────────────────────────────────────
  console.log(`${colors.cyan}========================================`);
  console.log('Test Results:');
  console.log(`  Total:  ${totalTests}`);
  console.log(`  Passed: ${colors.green}${passedTests}${colors.reset}`);
  console.log(`  Failed: ${colors.red}${totalTests - passedTests}${colors.reset}`);
  console.log(`========================================${colors.reset}\n`);

  if (failures.length === 0) {
    console.log(`${colors.green}\u2728 All fs wrapper tests passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}\u274C Some fs wrapper tests failed${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  teardown();
  console.error(`${colors.red}Test runner failed:${colors.reset}`, error.message);
  console.error(error.stack);
  process.exit(1);
});

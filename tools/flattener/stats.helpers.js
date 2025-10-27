'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');
const crypto = require('node:crypto');
const cp = require('node:child_process');

const KB = 1024;
const MB = 1024 * KB;

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const percentile = (sorted, p) => {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[idx];
};

async function processWithLimit(items, fn, concurrency = 64) {
  for (let i = 0; i < items.length; i += concurrency) {
    await Promise.all(items.slice(i, i + concurrency).map(fn));
  }
}

async function enrichAllFiles(textFiles, binaryFiles) {
  /** @type {Array<{ path: string; absolutePath: string; size: number; lines?: number; isBinary: boolean; ext: string; dir: string; depth: number; hidden: boolean; mtimeMs: number; isSymlink: boolean; }>} */
  const allFiles = [];

  async function enrich(file, isBinary) {
    const ext = (path.extname(file.path) || '').toLowerCase();
    const dir = path.dirname(file.path) || '.';
    const depth = file.path.split(path.sep).filter(Boolean).length;
    const hidden = file.path.split(path.sep).some((seg) => seg.startsWith('.'));
    let mtimeMs = 0;
    let isSymlink = false;
    try {
      const lst = await fs.lstat(file.absolutePath);
      mtimeMs = lst.mtimeMs;
      isSymlink = lst.isSymbolicLink();
    } catch {
      /* ignore lstat errors during enrichment */
    }
    allFiles.push({
      path: file.path,
      absolutePath: file.absolutePath,
      size: file.size || 0,
      lines: file.lines,
      isBinary,
      ext,
      dir,
      depth,
      hidden,
      mtimeMs,
      isSymlink,
    });
  }

  await processWithLimit(textFiles, (f) => enrich(f, false));
  await processWithLimit(binaryFiles, (f) => enrich(f, true));
  return allFiles;
}

function buildHistogram(allFiles) {
  const buckets = [
    [1 * KB, '0–1KB'],
    [10 * KB, '1–10KB'],
    [100 * KB, '10–100KB'],
    [1 * MB, '100KB–1MB'],
    [10 * MB, '1–10MB'],
    [100 * MB, '10–100MB'],
    [Infinity, '>=100MB'],
  ];
  const histogram = buckets.map(([_, label]) => ({ label, count: 0, bytes: 0 }));
  for (const f of allFiles) {
    for (const [i, bucket] of buckets.entries()) {
      if (f.size < bucket[0]) {
        histogram[i].count++;
        histogram[i].bytes += f.size;
        break;
      }
    }
  }
  return histogram;
}

function aggregateByExtension(allFiles) {
  const byExtension = new Map();
  for (const f of allFiles) {
    const key = f.ext || '<none>';
    const v = byExtension.get(key) || { ext: key, count: 0, bytes: 0 };
    v.count++;
    v.bytes += f.size;
    byExtension.set(key, v);
  }
  return [...byExtension.values()].sort((a, b) => b.bytes - a.bytes);
}

function aggregateByDirectory(allFiles) {
  const byDirectory = new Map();
  function addDirBytes(dir, bytes) {
    const v = byDirectory.get(dir) || { dir, count: 0, bytes: 0 };
    v.count++;
    v.bytes += bytes;
    byDirectory.set(dir, v);
  }
  for (const f of allFiles) {
    const parts = f.dir === '.' ? [] : f.dir.split(path.sep);
    let acc = '';
    for (let i = 0; i < parts.length; i++) {
      acc = i === 0 ? parts[0] : acc + path.sep + parts[i];
      addDirBytes(acc, f.size);
    }
    if (parts.length === 0) addDirBytes('.', f.size);
  }
  return [...byDirectory.values()].sort((a, b) => b.bytes - a.bytes);
}

function computeDepthAndLongest(allFiles) {
  const depthDistribution = new Map();
  for (const f of allFiles) {
    depthDistribution.set(f.depth, (depthDistribution.get(f.depth) || 0) + 1);
  }
  const longestPaths = [...allFiles]
    .sort((a, b) => b.path.length - a.path.length)
    .slice(0, 25)
    .map((f) => ({ path: f.path, length: f.path.length, size: f.size }));
  const depthDist = [...depthDistribution.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([depth, count]) => ({ depth, count }));
  return { depthDist, longestPaths };
}

function computeTemporal(allFiles, nowMs) {
  let oldest = null,
    newest = null;
  const ageBuckets = [
    { label: '> 1 year', minDays: 365, maxDays: Infinity, count: 0, bytes: 0 },
    { label: '6–12 months', minDays: 180, maxDays: 365, count: 0, bytes: 0 },
    { label: '1–6 months', minDays: 30, maxDays: 180, count: 0, bytes: 0 },
    { label: '7–30 days', minDays: 7, maxDays: 30, count: 0, bytes: 0 },
    { label: '1–7 days', minDays: 1, maxDays: 7, count: 0, bytes: 0 },
    { label: '< 1 day', minDays: 0, maxDays: 1, count: 0, bytes: 0 },
  ];
  for (const f of allFiles) {
    const ageDays = Math.max(0, (nowMs - (f.mtimeMs || nowMs)) / (24 * 60 * 60 * 1000));
    for (const b of ageBuckets) {
      if (ageDays >= b.minDays && ageDays < b.maxDays) {
        b.count++;
        b.bytes += f.size;
        break;
      }
    }
    if (!oldest || f.mtimeMs < oldest.mtimeMs) oldest = f;
    if (!newest || f.mtimeMs > newest.mtimeMs) newest = f;
  }
  return {
    oldest: oldest
      ? { path: oldest.path, mtime: oldest.mtimeMs ? new Date(oldest.mtimeMs).toISOString() : null }
      : null,
    newest: newest
      ? { path: newest.path, mtime: newest.mtimeMs ? new Date(newest.mtimeMs).toISOString() : null }
      : null,
    ageBuckets,
  };
}

function computeQuality(allFiles, textFiles) {
  const zeroByteFiles = allFiles.filter((f) => f.size === 0).length;
  const emptyTextFiles = textFiles.filter(
    (f) => (f.size || 0) === 0 || (f.lines || 0) === 0,
  ).length;
  const hiddenFiles = allFiles.filter((f) => f.hidden).length;
  const symlinks = allFiles.filter((f) => f.isSymlink).length;
  const largeThreshold = 50 * MB;
  const suspiciousThreshold = 100 * MB;
  const largeFilesCount = allFiles.filter((f) => f.size >= largeThreshold).length;
  const suspiciousLargeFilesCount = allFiles.filter((f) => f.size >= suspiciousThreshold).length;
  return {
    zeroByteFiles,
    emptyTextFiles,
    hiddenFiles,
    symlinks,
    largeFilesCount,
    suspiciousLargeFilesCount,
    largeThreshold,
  };
}

function computeDuplicates(allFiles, textFiles) {
  const duplicatesBySize = new Map();
  for (const f of allFiles) {
    const key = String(f.size);
    const arr = duplicatesBySize.get(key) || [];
    arr.push(f);
    duplicatesBySize.set(key, arr);
  }
  const duplicateCandidates = [];
  for (const [sizeKey, arr] of duplicatesBySize.entries()) {
    if (arr.length < 2) continue;
    const textGroup = arr.filter((f) => !f.isBinary);
    const otherGroup = arr.filter((f) => f.isBinary);
    const contentHashGroups = new Map();
    for (const tf of textGroup) {
      try {
        const src = textFiles.find((x) => x.absolutePath === tf.absolutePath);
        const content = src ? src.content : '';
        const h = crypto.createHash('sha1').update(content).digest('hex');
        const g = contentHashGroups.get(h) || [];
        g.push(tf);
        contentHashGroups.set(h, g);
      } catch {
        /* ignore hashing errors for duplicate detection */
      }
    }
    for (const [_h, g] of contentHashGroups.entries()) {
      if (g.length > 1)
        duplicateCandidates.push({
          reason: 'same-size+text-hash',
          size: Number(sizeKey),
          count: g.length,
          files: g.map((f) => f.path),
        });
    }
    if (otherGroup.length > 1) {
      duplicateCandidates.push({
        reason: 'same-size',
        size: Number(sizeKey),
        count: otherGroup.length,
        files: otherGroup.map((f) => f.path),
      });
    }
  }
  return duplicateCandidates;
}

function estimateCompressibility(textFiles) {
  let compSampleBytes = 0;
  let compCompressedBytes = 0;
  for (const tf of textFiles) {
    try {
      const sampleLen = Math.min(256 * 1024, tf.size || 0);
      if (sampleLen <= 0) continue;
      const sample = tf.content.slice(0, sampleLen);
      const gz = zlib.gzipSync(Buffer.from(sample, 'utf8'));
      compSampleBytes += sampleLen;
      compCompressedBytes += gz.length;
    } catch {
      /* ignore compression errors during sampling */
    }
  }
  return compSampleBytes > 0 ? compCompressedBytes / compSampleBytes : null;
}

function computeGitInfo(allFiles, rootDir, largeThreshold) {
  const info = {
    isRepo: false,
    trackedCount: 0,
    trackedBytes: 0,
    untrackedCount: 0,
    untrackedBytes: 0,
    lfsCandidates: [],
  };
  try {
    if (!rootDir) return info;
    const top = cp
      .execFileSync('git', ['rev-parse', '--show-toplevel'], {
        cwd: rootDir,
        stdio: ['ignore', 'pipe', 'ignore'],
      })
      .toString()
      .trim();
    if (!top) return info;
    info.isRepo = true;
    const out = cp.execFileSync('git', ['ls-files', '-z'], {
      cwd: rootDir,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const tracked = new Set(out.toString().split('\0').filter(Boolean));
    let trackedBytes = 0,
      trackedCount = 0,
      untrackedBytes = 0,
      untrackedCount = 0;
    const lfsCandidates = [];
    for (const f of allFiles) {
      const isTracked = tracked.has(f.path);
      if (isTracked) {
        trackedCount++;
        trackedBytes += f.size;
        if (f.size >= largeThreshold) lfsCandidates.push({ path: f.path, size: f.size });
      } else {
        untrackedCount++;
        untrackedBytes += f.size;
      }
    }
    info.trackedCount = trackedCount;
    info.trackedBytes = trackedBytes;
    info.untrackedCount = untrackedCount;
    info.untrackedBytes = untrackedBytes;
    info.lfsCandidates = lfsCandidates.sort((a, b) => b.size - a.size).slice(0, 50);
  } catch {
    /* git not available or not a repo, ignore */
  }
  return info;
}

function computeLargestFiles(allFiles, totalBytes) {
  const toPct = (num, den) => (den === 0 ? 0 : (num / den) * 100);
  return [...allFiles]
    .sort((a, b) => b.size - a.size)
    .slice(0, 50)
    .map((f) => ({
      path: f.path,
      size: f.size,
      sizeFormatted: formatSize(f.size),
      percentOfTotal: toPct(f.size, totalBytes),
      ext: f.ext || '',
      isBinary: f.isBinary,
      mtime: f.mtimeMs ? new Date(f.mtimeMs).toISOString() : null,
    }));
}

function mdTable(rows, headers) {
  const header = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
  return `${header}\n${sep}\n${body}`;
}

function buildMarkdownReport(largestFiles, byExtensionArr, byDirectoryArr, totalBytes) {
  const toPct = (num, den) => (den === 0 ? 0 : (num / den) * 100);
  const md = [];
  md.push(
    '\n### Top Largest Files (Top 50)\n',
    mdTable(
      largestFiles.map((f) => [
        f.path,
        f.sizeFormatted,
        `${f.percentOfTotal.toFixed(2)}%`,
        f.ext || '',
        f.isBinary ? 'binary' : 'text',
      ]),
      ['Path', 'Size', '% of total', 'Ext', 'Type'],
    ),
    '\n\n### Top Extensions by Bytes (Top 20)\n',
  );
  const topExtRows = byExtensionArr
    .slice(0, 20)
    .map((e) => [
      e.ext,
      String(e.count),
      formatSize(e.bytes),
      `${toPct(e.bytes, totalBytes).toFixed(2)}%`,
    ]);
  md.push(
    mdTable(topExtRows, ['Ext', 'Count', 'Bytes', '% of total']),
    '\n\n### Top Directories by Bytes (Top 20)\n',
  );
  const topDirRows = byDirectoryArr
    .slice(0, 20)
    .map((d) => [
      d.dir,
      String(d.count),
      formatSize(d.bytes),
      `${toPct(d.bytes, totalBytes).toFixed(2)}%`,
    ]);
  md.push(mdTable(topDirRows, ['Directory', 'Files', 'Bytes', '% of total']));
  return md.join('\n');
}

module.exports = {
  KB,
  MB,
  formatSize,
  percentile,
  processWithLimit,
  enrichAllFiles,
  buildHistogram,
  aggregateByExtension,
  aggregateByDirectory,
  computeDepthAndLongest,
  computeTemporal,
  computeQuality,
  computeDuplicates,
  estimateCompressibility,
  computeGitInfo,
  computeLargestFiles,
  buildMarkdownReport,
};

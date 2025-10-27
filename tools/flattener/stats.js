const H = require('./stats.helpers.js');

async function calculateStatistics(aggregatedContent, xmlFileSize, rootDir) {
  const { textFiles, binaryFiles, errors } = aggregatedContent;

  const totalLines = textFiles.reduce((sum, f) => sum + (f.lines || 0), 0);
  const estimatedTokens = Math.ceil(xmlFileSize / 4);

  // Build enriched file list
  const allFiles = await H.enrichAllFiles(textFiles, binaryFiles);
  const totalBytes = allFiles.reduce((s, f) => s + f.size, 0);
  const sizes = allFiles.map((f) => f.size).sort((a, b) => a - b);
  const avgSize = sizes.length > 0 ? totalBytes / sizes.length : 0;
  const medianSize = sizes.length > 0 ? H.percentile(sizes, 50) : 0;
  const p90 = H.percentile(sizes, 90);
  const p95 = H.percentile(sizes, 95);
  const p99 = H.percentile(sizes, 99);

  const histogram = H.buildHistogram(allFiles);
  const byExtensionArr = H.aggregateByExtension(allFiles);
  const byDirectoryArr = H.aggregateByDirectory(allFiles);
  const { depthDist, longestPaths } = H.computeDepthAndLongest(allFiles);
  const temporal = H.computeTemporal(allFiles, Date.now());
  const quality = H.computeQuality(allFiles, textFiles);
  const duplicateCandidates = H.computeDuplicates(allFiles, textFiles);
  const compressibilityRatio = H.estimateCompressibility(textFiles);
  const git = H.computeGitInfo(allFiles, rootDir, quality.largeThreshold);
  const largestFiles = H.computeLargestFiles(allFiles, totalBytes);
  const markdownReport = H.buildMarkdownReport(
    largestFiles,
    byExtensionArr,
    byDirectoryArr,
    totalBytes,
  );

  return {
    // Back-compat summary
    totalFiles: textFiles.length + binaryFiles.length,
    textFiles: textFiles.length,
    binaryFiles: binaryFiles.length,
    errorFiles: errors.length,
    totalSize: H.formatSize(totalBytes),
    totalBytes,
    xmlSize: H.formatSize(xmlFileSize),
    totalLines,
    estimatedTokens: estimatedTokens.toLocaleString(),

    // Distributions and percentiles
    avgFileSize: avgSize,
    medianFileSize: medianSize,
    p90,
    p95,
    p99,
    histogram,

    // Extensions and directories
    byExtension: byExtensionArr,
    byDirectory: byDirectoryArr,
    depthDistribution: depthDist,
    longestPaths,

    // Temporal
    temporal,

    // Quality signals
    quality,

    // Duplicates and compressibility
    duplicateCandidates,
    compressibilityRatio,

    // Git-aware
    git,

    largestFiles,
    markdownReport,
  };
}

module.exports = { calculateStatistics };

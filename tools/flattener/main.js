const { Command } = require('commander');
const fs = require('fs-extra');
const path = require('node:path');
const process = require('node:process');

// Modularized components
const { findProjectRoot } = require('./projectRoot.js');
const { promptYesNo, promptPath } = require('./prompts.js');
const { discoverFiles, filterFiles, aggregateFileContents } = require('./files.js');
const { generateXMLOutput } = require('./xml.js');
const { calculateStatistics } = require('./stats.js');

/**
 * Recursively discover all files in a directory
 * @param {string} rootDir - The root directory to scan
 * @returns {Promise<string[]>} Array of file paths
 */

/**
 * Parse .gitignore file and return ignore patterns
 * @param {string} gitignorePath - Path to .gitignore file
 * @returns {Promise<string[]>} Array of ignore patterns
 */

/**
 * Check if a file is binary using file command and heuristics
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} True if file is binary
 */

/**
 * Read and aggregate content from text files
 * @param {string[]} files - Array of file paths
 * @param {string} rootDir - The root directory
 * @param {Object} spinner - Optional spinner instance for progress display
 * @returns {Promise<Object>} Object containing file contents and metadata
 */

/**
 * Generate XML output with aggregated file contents using streaming
 * @param {Object} aggregatedContent - The aggregated content object
 * @param {string} outputPath - The output file path
 * @returns {Promise<void>} Promise that resolves when writing is complete
 */

/**
 * Calculate statistics for the processed files
 * @param {Object} aggregatedContent - The aggregated content object
 * @param {number} xmlFileSize - The size of the generated XML file in bytes
 * @returns {Object} Statistics object
 */

/**
 * Filter files based on .gitignore patterns
 * @param {string[]} files - Array of file paths
 * @param {string} rootDir - The root directory
 * @returns {Promise<string[]>} Filtered array of file paths
 */

/**
 * Attempt to find the project root by walking up from startDir
 * Looks for common project markers like .git, package.json, pyproject.toml, etc.
 * @param {string} startDir
 * @returns {Promise<string|null>} project root directory or null if not found
 */

const program = new Command();

program
  .name('bmad-flatten')
  .description('BMAD-METHOD™ codebase flattener tool')
  .version('1.0.0')
  .option('-i, --input <path>', 'Input directory to flatten', process.cwd())
  .option('-o, --output <path>', 'Output file path', 'flattened-codebase.xml')
  .action(async (options) => {
    let inputDir = path.resolve(options.input);
    let outputPath = path.resolve(options.output);

    // Detect if user explicitly provided -i/--input or -o/--output
    const argv = process.argv.slice(2);
    const userSpecifiedInput = argv.some(
      (a) => a === '-i' || a === '--input' || a.startsWith('--input='),
    );
    const userSpecifiedOutput = argv.some(
      (a) => a === '-o' || a === '--output' || a.startsWith('--output='),
    );
    const noPathArguments = !userSpecifiedInput && !userSpecifiedOutput;

    if (noPathArguments) {
      const detectedRoot = await findProjectRoot(process.cwd());
      const suggestedOutput = detectedRoot
        ? path.join(detectedRoot, 'flattened-codebase.xml')
        : path.resolve('flattened-codebase.xml');

      if (detectedRoot) {
        const useDefaults = await promptYesNo(
          `Detected project root at "${detectedRoot}". Use it as input and write output to "${suggestedOutput}"?`,
          true,
        );
        if (useDefaults) {
          inputDir = detectedRoot;
          outputPath = suggestedOutput;
        } else {
          inputDir = await promptPath('Enter input directory path', process.cwd());
          outputPath = await promptPath(
            'Enter output file path',
            path.join(inputDir, 'flattened-codebase.xml'),
          );
        }
      } else {
        console.log('Could not auto-detect a project root.');
        inputDir = await promptPath('Enter input directory path', process.cwd());
        outputPath = await promptPath(
          'Enter output file path',
          path.join(inputDir, 'flattened-codebase.xml'),
        );
      }
    }

    // Ensure output directory exists
    await fs.ensureDir(path.dirname(outputPath));

    try {
      // Verify input directory exists
      if (!(await fs.pathExists(inputDir))) {
        console.error(`❌ Error: Input directory does not exist: ${inputDir}`);
        process.exit(1);
      }

      // Import ora dynamically
      const { default: ora } = await import('ora');

      // Start file discovery with spinner
      const discoverySpinner = ora('🔍 Discovering files...').start();
      const files = await discoverFiles(inputDir);
      const filteredFiles = await filterFiles(files, inputDir);
      discoverySpinner.succeed(`📁 Found ${filteredFiles.length} files to include`);

      // Process files with progress tracking
      console.log('Reading file contents');
      const processingSpinner = ora('📄 Processing files...').start();
      const aggregatedContent = await aggregateFileContents(
        filteredFiles,
        inputDir,
        processingSpinner,
      );
      processingSpinner.succeed(
        `✅ Processed ${aggregatedContent.processedFiles}/${filteredFiles.length} files`,
      );
      if (aggregatedContent.errors.length > 0) {
        console.log(`Errors: ${aggregatedContent.errors.length}`);
      }

      // Generate XML output using streaming
      const xmlSpinner = ora('🔧 Generating XML output...').start();
      await generateXMLOutput(aggregatedContent, outputPath);
      xmlSpinner.succeed('📝 XML generation completed');

      // Calculate and display statistics
      const outputStats = await fs.stat(outputPath);
      const stats = await calculateStatistics(aggregatedContent, outputStats.size, inputDir);

      // Display completion summary
      console.log('\n📊 Completion Summary:');
      console.log(
        `✅ Successfully processed ${filteredFiles.length} files into ${path.basename(outputPath)}`,
      );
      console.log(`📁 Output file: ${outputPath}`);
      console.log(`📏 Total source size: ${stats.totalSize}`);
      console.log(`📄 Generated XML size: ${stats.xmlSize}`);
      console.log(`📝 Total lines of code: ${stats.totalLines.toLocaleString()}`);
      console.log(`🔢 Estimated tokens: ${stats.estimatedTokens}`);
      console.log(
        `📊 File breakdown: ${stats.textFiles} text, ${stats.binaryFiles} binary, ${stats.errorFiles} errors\n`,
      );

      // Ask user if they want detailed stats + markdown report
      const generateDetailed = await promptYesNo(
        'Generate detailed stats (console + markdown) now?',
        true,
      );

      if (generateDetailed) {
        // Additional detailed stats
        console.log('\n📈 Size Percentiles:');
        console.log(
          `   Avg: ${Math.round(stats.avgFileSize).toLocaleString()} B, Median: ${Math.round(
            stats.medianFileSize,
          ).toLocaleString()} B, p90: ${stats.p90.toLocaleString()} B, p95: ${stats.p95.toLocaleString()} B, p99: ${stats.p99.toLocaleString()} B`,
        );

        if (Array.isArray(stats.histogram) && stats.histogram.length > 0) {
          console.log('\n🧮 Size Histogram:');
          for (const b of stats.histogram.slice(0, 2)) {
            console.log(`   ${b.label}: ${b.count} files, ${b.bytes.toLocaleString()} bytes`);
          }
          if (stats.histogram.length > 2) {
            console.log(`   … and ${stats.histogram.length - 2} more buckets`);
          }
        }

        if (Array.isArray(stats.byExtension) && stats.byExtension.length > 0) {
          const topExt = stats.byExtension.slice(0, 2);
          console.log('\n📦 Top Extensions:');
          for (const e of topExt) {
            const pct = stats.totalBytes ? (e.bytes / stats.totalBytes) * 100 : 0;
            console.log(
              `   ${e.ext}: ${e.count} files, ${e.bytes.toLocaleString()} bytes (${pct.toFixed(
                2,
              )}%)`,
            );
          }
          if (stats.byExtension.length > 2) {
            console.log(`   … and ${stats.byExtension.length - 2} more extensions`);
          }
        }

        if (Array.isArray(stats.byDirectory) && stats.byDirectory.length > 0) {
          const topDir = stats.byDirectory.slice(0, 2);
          console.log('\n📂 Top Directories:');
          for (const d of topDir) {
            const pct = stats.totalBytes ? (d.bytes / stats.totalBytes) * 100 : 0;
            console.log(
              `   ${d.dir}: ${d.count} files, ${d.bytes.toLocaleString()} bytes (${pct.toFixed(
                2,
              )}%)`,
            );
          }
          if (stats.byDirectory.length > 2) {
            console.log(`   … and ${stats.byDirectory.length - 2} more directories`);
          }
        }

        if (Array.isArray(stats.depthDistribution) && stats.depthDistribution.length > 0) {
          console.log('\n🌳 Depth Distribution:');
          const dd = stats.depthDistribution.slice(0, 2);
          let line = '   ' + dd.map((d) => `${d.depth}:${d.count}`).join('  ');
          if (stats.depthDistribution.length > 2) {
            line += `  … +${stats.depthDistribution.length - 2} more`;
          }
          console.log(line);
        }

        if (Array.isArray(stats.longestPaths) && stats.longestPaths.length > 0) {
          console.log('\n🧵 Longest Paths:');
          for (const p of stats.longestPaths.slice(0, 2)) {
            console.log(`   ${p.path} (${p.length} chars, ${p.size.toLocaleString()} bytes)`);
          }
          if (stats.longestPaths.length > 2) {
            console.log(`   … and ${stats.longestPaths.length - 2} more paths`);
          }
        }

        if (stats.temporal) {
          console.log('\n⏱️ Temporal:');
          if (stats.temporal.oldest) {
            console.log(
              `   Oldest: ${stats.temporal.oldest.path} (${stats.temporal.oldest.mtime})`,
            );
          }
          if (stats.temporal.newest) {
            console.log(
              `   Newest: ${stats.temporal.newest.path} (${stats.temporal.newest.mtime})`,
            );
          }
          if (Array.isArray(stats.temporal.ageBuckets)) {
            console.log('   Age buckets:');
            for (const b of stats.temporal.ageBuckets.slice(0, 2)) {
              console.log(`     ${b.label}: ${b.count} files, ${b.bytes.toLocaleString()} bytes`);
            }
            if (stats.temporal.ageBuckets.length > 2) {
              console.log(`     … and ${stats.temporal.ageBuckets.length - 2} more buckets`);
            }
          }
        }

        if (stats.quality) {
          console.log('\n✅ Quality Signals:');
          console.log(`   Zero-byte files: ${stats.quality.zeroByteFiles}`);
          console.log(`   Empty text files: ${stats.quality.emptyTextFiles}`);
          console.log(`   Hidden files: ${stats.quality.hiddenFiles}`);
          console.log(`   Symlinks: ${stats.quality.symlinks}`);
          console.log(
            `   Large files (>= ${(stats.quality.largeThreshold / (1024 * 1024)).toFixed(
              0,
            )} MB): ${stats.quality.largeFilesCount}`,
          );
          console.log(
            `   Suspiciously large files (>= 100 MB): ${stats.quality.suspiciousLargeFilesCount}`,
          );
        }

        if (Array.isArray(stats.duplicateCandidates) && stats.duplicateCandidates.length > 0) {
          console.log('\n🧬 Duplicate Candidates:');
          for (const d of stats.duplicateCandidates.slice(0, 2)) {
            console.log(`   ${d.reason}: ${d.count} files @ ${d.size.toLocaleString()} bytes`);
          }
          if (stats.duplicateCandidates.length > 2) {
            console.log(`   … and ${stats.duplicateCandidates.length - 2} more groups`);
          }
        }

        if (typeof stats.compressibilityRatio === 'number') {
          console.log(
            `\n🗜️ Compressibility ratio (sampled): ${(stats.compressibilityRatio * 100).toFixed(
              2,
            )}%`,
          );
        }

        if (stats.git && stats.git.isRepo) {
          console.log('\n🔧 Git:');
          console.log(
            `   Tracked: ${stats.git.trackedCount} files, ${stats.git.trackedBytes.toLocaleString()} bytes`,
          );
          console.log(
            `   Untracked: ${stats.git.untrackedCount} files, ${stats.git.untrackedBytes.toLocaleString()} bytes`,
          );
          if (Array.isArray(stats.git.lfsCandidates) && stats.git.lfsCandidates.length > 0) {
            console.log('   LFS candidates (top 2):');
            for (const f of stats.git.lfsCandidates.slice(0, 2)) {
              console.log(`     ${f.path} (${f.size.toLocaleString()} bytes)`);
            }
            if (stats.git.lfsCandidates.length > 2) {
              console.log(`     … and ${stats.git.lfsCandidates.length - 2} more`);
            }
          }
        }

        if (Array.isArray(stats.largestFiles) && stats.largestFiles.length > 0) {
          console.log('\n📚 Largest Files (top 2):');
          for (const f of stats.largestFiles.slice(0, 2)) {
            // Show LOC for text files when available; omit ext and mtime
            let locStr = '';
            if (!f.isBinary && Array.isArray(aggregatedContent?.textFiles)) {
              const tf = aggregatedContent.textFiles.find((t) => t.path === f.path);
              if (tf && typeof tf.lines === 'number') {
                locStr = `, LOC: ${tf.lines.toLocaleString()}`;
              }
            }
            console.log(
              `   ${f.path} – ${f.sizeFormatted} (${f.percentOfTotal.toFixed(2)}%)${locStr}`,
            );
          }
          if (stats.largestFiles.length > 2) {
            console.log(`   … and ${stats.largestFiles.length - 2} more files`);
          }
        }

        // Write a comprehensive markdown report next to the XML
        {
          const mdPath = outputPath.endsWith('.xml')
            ? outputPath.replace(/\.xml$/i, '.stats.md')
            : outputPath + '.stats.md';
          try {
            const pct = (num, den) => (den ? (num / den) * 100 : 0);
            const md = [];
            md.push(
              `# 🧾 Flatten Stats for ${path.basename(outputPath)}`,
              '',
              '## 📊 Summary',
              `- Total source size: ${stats.totalSize}`,
              `- Generated XML size: ${stats.xmlSize}`,
              `- Total lines of code: ${stats.totalLines.toLocaleString()}`,
              `- Estimated tokens: ${stats.estimatedTokens}`,
              `- File breakdown: ${stats.textFiles} text, ${stats.binaryFiles} binary, ${stats.errorFiles} errors`,
              '',
              '## 📈 Size Percentiles',
              `Avg: ${Math.round(stats.avgFileSize).toLocaleString()} B, Median: ${Math.round(
                stats.medianFileSize,
              ).toLocaleString()} B, p90: ${stats.p90.toLocaleString()} B, p95: ${stats.p95.toLocaleString()} B, p99: ${stats.p99.toLocaleString()} B`,
              '',
            );

            // Histogram
            if (Array.isArray(stats.histogram) && stats.histogram.length > 0) {
              md.push(
                '## 🧮 Size Histogram',
                '| Bucket | Files | Bytes |',
                '| --- | ---: | ---: |',
              );
              for (const b of stats.histogram) {
                md.push(`| ${b.label} | ${b.count} | ${b.bytes.toLocaleString()} |`);
              }
              md.push('');
            }

            // Top Extensions
            if (Array.isArray(stats.byExtension) && stats.byExtension.length > 0) {
              md.push(
                '## 📦 Top Extensions by Bytes (Top 20)',
                '| Ext | Files | Bytes | % of total |',
                '| --- | ---: | ---: | ---: |',
              );
              for (const e of stats.byExtension.slice(0, 20)) {
                const p = pct(e.bytes, stats.totalBytes);
                md.push(
                  `| ${e.ext} | ${e.count} | ${e.bytes.toLocaleString()} | ${p.toFixed(2)}% |`,
                );
              }
              md.push('');
            }

            // Top Directories
            if (Array.isArray(stats.byDirectory) && stats.byDirectory.length > 0) {
              md.push(
                '## 📂 Top Directories by Bytes (Top 20)',
                '| Directory | Files | Bytes | % of total |',
                '| --- | ---: | ---: | ---: |',
              );
              for (const d of stats.byDirectory.slice(0, 20)) {
                const p = pct(d.bytes, stats.totalBytes);
                md.push(
                  `| ${d.dir} | ${d.count} | ${d.bytes.toLocaleString()} | ${p.toFixed(2)}% |`,
                );
              }
              md.push('');
            }

            // Depth distribution
            if (Array.isArray(stats.depthDistribution) && stats.depthDistribution.length > 0) {
              md.push('## 🌳 Depth Distribution', '| Depth | Count |', '| ---: | ---: |');
              for (const d of stats.depthDistribution) {
                md.push(`| ${d.depth} | ${d.count} |`);
              }
              md.push('');
            }

            // Longest paths
            if (Array.isArray(stats.longestPaths) && stats.longestPaths.length > 0) {
              md.push(
                '## 🧵 Longest Paths (Top 25)',
                '| Path | Length | Bytes |',
                '| --- | ---: | ---: |',
              );
              for (const pth of stats.longestPaths) {
                md.push(`| ${pth.path} | ${pth.length} | ${pth.size.toLocaleString()} |`);
              }
              md.push('');
            }

            // Temporal
            if (stats.temporal) {
              md.push('## ⏱️ Temporal');
              if (stats.temporal.oldest) {
                md.push(`- Oldest: ${stats.temporal.oldest.path} (${stats.temporal.oldest.mtime})`);
              }
              if (stats.temporal.newest) {
                md.push(`- Newest: ${stats.temporal.newest.path} (${stats.temporal.newest.mtime})`);
              }
              if (Array.isArray(stats.temporal.ageBuckets)) {
                md.push('', '| Age | Files | Bytes |', '| --- | ---: | ---: |');
                for (const b of stats.temporal.ageBuckets) {
                  md.push(`| ${b.label} | ${b.count} | ${b.bytes.toLocaleString()} |`);
                }
              }
              md.push('');
            }

            // Quality signals
            if (stats.quality) {
              md.push(
                '## ✅ Quality Signals',
                `- Zero-byte files: ${stats.quality.zeroByteFiles}`,
                `- Empty text files: ${stats.quality.emptyTextFiles}`,
                `- Hidden files: ${stats.quality.hiddenFiles}`,
                `- Symlinks: ${stats.quality.symlinks}`,
                `- Large files (>= ${(stats.quality.largeThreshold / (1024 * 1024)).toFixed(0)} MB): ${stats.quality.largeFilesCount}`,
                `- Suspiciously large files (>= 100 MB): ${stats.quality.suspiciousLargeFilesCount}`,
                '',
              );
            }

            // Duplicates
            if (Array.isArray(stats.duplicateCandidates) && stats.duplicateCandidates.length > 0) {
              md.push(
                '## 🧬 Duplicate Candidates',
                '| Reason | Files | Size (bytes) |',
                '| --- | ---: | ---: |',
              );
              for (const d of stats.duplicateCandidates) {
                md.push(`| ${d.reason} | ${d.count} | ${d.size.toLocaleString()} |`);
              }
              md.push('', '### 🧬 Duplicate Groups Details');
              let dupIndex = 1;
              for (const d of stats.duplicateCandidates) {
                md.push(
                  `#### Group ${dupIndex}: ${d.count} files @ ${d.size.toLocaleString()} bytes (${d.reason})`,
                );
                if (Array.isArray(d.files) && d.files.length > 0) {
                  for (const fp of d.files) {
                    md.push(`- ${fp}`);
                  }
                } else {
                  md.push('- (file list unavailable)');
                }
                md.push('');
                dupIndex++;
              }
              md.push('');
            }

            // Compressibility
            if (typeof stats.compressibilityRatio === 'number') {
              md.push(
                '## 🗜️ Compressibility',
                `Sampled compressibility ratio: ${(stats.compressibilityRatio * 100).toFixed(2)}%`,
                '',
              );
            }

            // Git
            if (stats.git && stats.git.isRepo) {
              md.push(
                '## 🔧 Git',
                `- Tracked: ${stats.git.trackedCount} files, ${stats.git.trackedBytes.toLocaleString()} bytes`,
                `- Untracked: ${stats.git.untrackedCount} files, ${stats.git.untrackedBytes.toLocaleString()} bytes`,
              );
              if (Array.isArray(stats.git.lfsCandidates) && stats.git.lfsCandidates.length > 0) {
                md.push('', '### 📦 LFS Candidates (Top 20)', '| Path | Bytes |', '| --- | ---: |');
                for (const f of stats.git.lfsCandidates.slice(0, 20)) {
                  md.push(`| ${f.path} | ${f.size.toLocaleString()} |`);
                }
              }
              md.push('');
            }

            // Largest Files
            if (Array.isArray(stats.largestFiles) && stats.largestFiles.length > 0) {
              md.push(
                '## 📚 Largest Files (Top 50)',
                '| Path | Size | % of total | LOC |',
                '| --- | ---: | ---: | ---: |',
              );
              for (const f of stats.largestFiles) {
                let loc = '';
                if (!f.isBinary && Array.isArray(aggregatedContent?.textFiles)) {
                  const tf = aggregatedContent.textFiles.find((t) => t.path === f.path);
                  if (tf && typeof tf.lines === 'number') {
                    loc = tf.lines.toLocaleString();
                  }
                }
                md.push(
                  `| ${f.path} | ${f.sizeFormatted} | ${f.percentOfTotal.toFixed(2)}% | ${loc} |`,
                );
              }
              md.push('');
            }

            await fs.writeFile(mdPath, md.join('\n'));
            console.log(`\n🧾 Detailed stats report written to: ${mdPath}`);
          } catch (error) {
            console.warn(`⚠️ Failed to write stats markdown: ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.error('❌ Critical error:', error.message);
      console.error('An unexpected error occurred.');
      process.exit(1);
    }
  });

if (require.main === module) {
  program.parse();
}

module.exports = program;

#!/usr/bin/env node
/**
 * Fix Fence Languages - Add language identifiers to code fences
 *
 * This script detects fenced code blocks without language identifiers
 * and adds appropriate languages based on content heuristics.
 *
 * Usage:
 *   node tools/markdown/fix-fence-languages.js [--dry-run] <file1> [file2...]
 *
 * Options:
 *   --dry-run    Show what would be fixed without modifying files
 *
 * Exit codes:
 *   0 -> No issues found or all fixed successfully
 *   1 -> Issues found (dry-run mode) or errors during fix
 */

const fs = require('node:fs');
const path = require('node:path');

const DRY_RUN = process.argv.includes('--dry-run');

/**
 * Detect language from fence content using simple heuristics
 */
function detectLanguage(content) {
  const trimmed = content.trim();
  
  // Empty fence
  if (!trimmed) return 'text';
  
  // YAML detection
  if (/^[a-zA-Z_][a-zA-Z0-9_-]*:\s*/.test(trimmed) || 
      /^---\s*$/m.test(trimmed)) {
    return 'yaml';
  }
  
  // JSON detection
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // Not valid JSON, continue
    }
  }
  
  // Shell/Bash detection
  if (/^(npm|yarn|pnpm|git|node|npx|cd|mkdir|rm|cp|mv|ls|cat|echo|export|source|\$)\s/.test(trimmed) ||
      /^\$/.test(trimmed) ||
      /^#!\/bin\/(ba)?sh/.test(trimmed)) {
    return 'bash';
  }
  
  // JavaScript/TypeScript detection
  if (/^(import|export|const|let|var|function|class|async|await)\s/.test(trimmed) ||
      /^\/\//.test(trimmed) ||
      /^\/\*/.test(trimmed)) {
    return 'javascript';
  }
  
  // XML/HTML detection
  if (/^<[a-zA-Z][^>]*>/.test(trimmed)) {
    return 'xml';
  }
  
  // Markdown detection (for nested examples)
  if (/^#{1,6}\s/.test(trimmed) || /^\[.*\]\(.*\)/.test(trimmed)) {
    return 'markdown';
  }
  
  // Flow/diagram detection (arrows, boxes)
  if (/[→↓←↑]/.test(trimmed) || /[┌┐└┘├┤┬┴┼─│]/.test(trimmed)) {
    return 'text';
  }
  
  // Default to text for unknown content
  return 'text';
}

/**
 * Fix a single file
 */
function fixFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  
  const fixes = [];
  let modified = false;
  let inFence = false;
  let fenceStart = -1;
  let fenceContent = [];
  
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect fence start
    if (/^\s*```\s*$/.test(line)) {
      if (!inFence) {
        // Opening fence without language
        inFence = true;
        fenceStart = i;
        fenceContent = [];
        
        // We'll hold this line and potentially modify it
        continue;
      } else {
        // Closing fence
        const language = detectLanguage(fenceContent.join('\n'));
        
        // Add the opening fence with detected language
        const indent = lines[fenceStart].match(/^(\s*)/)[1];
        const fixedOpenLine = `${indent}\`\`\`${language}`;
        newLines.push(fixedOpenLine);
        
        // Add the content
        newLines.push(...fenceContent);
        
        // Add the closing fence
        newLines.push(line);
        
        fixes.push({
          line: fenceStart + 1,
          original: lines[fenceStart],
          fixed: fixedOpenLine,
          detectedLanguage: language,
          contentPreview: fenceContent.slice(0, 2).join('\n').substring(0, 60) + '...'
        });
        
        modified = true;
        inFence = false;
        fenceStart = -1;
        fenceContent = [];
        continue;
      }
    }
    
    if (inFence) {
      // Collecting fence content
      fenceContent.push(line);
    } else {
      // Regular line outside fence
      newLines.push(line);
    }
  }
  
  return {
    filePath,
    fixes,
    modified,
    newContent: newLines.join('\n') + (content.endsWith('\n') ? '\n' : '')
  };
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2).filter(arg => arg !== '--dry-run');
  
  if (args.length === 0) {
    console.error('Usage: node tools/markdown/fix-fence-languages.js [--dry-run] <file1> [file2...]');
    process.exit(2);
  }
  
  const results = [];
  let totalFixes = 0;
  
  for (const filePath of args) {
    const absPath = path.resolve(filePath);
    
    if (!fs.existsSync(absPath)) {
      console.error(`File not found: ${absPath}`);
      continue;
    }
    
    if (!absPath.toLowerCase().endsWith('.md')) {
      console.error(`Skipping non-markdown file: ${absPath}`);
      continue;
    }
    
    const result = fixFile(absPath);
    
    if (result.fixes.length > 0) {
      results.push(result);
      totalFixes += result.fixes.length;
    }
  }
  
  // Print results
  if (results.length === 0) {
    console.log('✓ No fence language issues found');
    process.exit(0);
  }
  
  if (DRY_RUN) {
    console.log(`\n🔍 DRY RUN: Found ${totalFixes} fence(s) without language in ${results.length} file(s)\n`);
  } else {
    console.log(`\n🔧 Fixing ${totalFixes} fence(s) in ${results.length} file(s)\n`);
  }
  
  for (const result of results) {
    console.log(`📄 ${path.relative(process.cwd(), result.filePath)}`);
    
    for (const fix of result.fixes) {
      console.log(`   L${fix.line.toString().padStart(4, ' ')}  ${fix.original.trim() || '```'}`);
      console.log(`        → \`\`\`${fix.detectedLanguage}`);
      console.log(`        Content: ${fix.contentPreview}`);
    }
    
    console.log('');
    
    // Apply fixes if not dry-run
    if (!DRY_RUN) {
      fs.writeFileSync(result.filePath, result.newContent, 'utf8');
      console.log(`   ✓ Fixed and saved\n`);
    }
  }
  
  if (DRY_RUN) {
    console.log('💡 Run without --dry-run to apply these fixes\n');
    process.exit(1);
  } else {
    console.log('✓ All fixes applied successfully\n');
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

module.exports = { detectLanguage, fixFile };

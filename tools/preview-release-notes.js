const { execSync } = require('node:child_process');
const fs = require('node:fs');

// Get the latest stable tag (exclude beta tags)
const allTags = execSync('git tag -l | sort -V', { encoding: 'utf8' }).split('\n').filter(Boolean);
const stableTags = allTags.filter((tag) => !tag.includes('beta'));
const latestTag = stableTags.at(-1) || 'v5.0.0';

// Get commits since last tag
const commits = execSync(`git log ${latestTag}..HEAD --pretty=format:"- %s" --reverse`, {
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean);

// Categorize commits
const features = commits.filter((commit) => /^- (feat|Feature)/.test(commit));
const fixes = commits.filter((commit) => /^- (fix|Fix)/.test(commit));
const chores = commits.filter((commit) => /^- (chore|Chore)/.test(commit));
const others = commits.filter(
  (commit) => !/^- (feat|Feature|fix|Fix|chore|Chore|release:|Release:)/.test(commit),
);

// Get next version (you can modify this logic)
const currentVersion = require('../package.json').version;
const versionParts = currentVersion.split('.').map(Number);
const nextVersion = `${versionParts[0]}.${versionParts[1] + 1}.0`; // Default to minor bump

console.log(`## 🚀 What's New in v${nextVersion}\n`);

if (features.length > 0) {
  console.log('### ✨ New Features');
  for (const feature of features) console.log(feature);
  console.log('');
}

if (fixes.length > 0) {
  console.log('### 🐛 Bug Fixes');
  for (const fix of fixes) console.log(fix);
  console.log('');
}

if (others.length > 0) {
  console.log('### 📦 Other Changes');
  for (const other of others) console.log(other);
  console.log('');
}

if (chores.length > 0) {
  console.log('### 🔧 Maintenance');
  for (const chore of chores) console.log(chore);
  console.log('');
}

console.log('\n## 📦 Installation\n');
console.log('```bash');
console.log('npx bmad-method install');
console.log('```');

console.log(
  `\n**Full Changelog**: https://github.com/bmadcode/BMAD-METHOD/compare/${latestTag}...v${nextVersion}`,
);

console.log(`\n---\n📊 **Summary**: ${commits.length} commits since ${latestTag}`);
console.log(`🏷️ **Previous tag**: ${latestTag}`);
console.log(`🚀 **Next version**: v${nextVersion} (estimated)`);

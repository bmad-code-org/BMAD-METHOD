/**
 * Generate test fixtures that demonstrate markdown formatting issues
 * This simulates the current template processing system's problematic output
 */

const fs = require('fs-extra');
const path = require('node:path');

class MarkdownFixtureGenerator {
  constructor() {
    this.fixturesDir = path.join(__dirname, '..', 'fixtures', 'markdown-issues');
  }

  async generateAllFixtures() {
    console.log('🏗️  Generating markdown test fixtures...\n');

    await fs.ensureDir(this.fixturesDir);

    // Generate different types of problematic output
    await this.generateCRLFIssue();
    await this.generateSpacingIssues();
    await this.generateQAResultsIssue();
    await this.generateSmartQuotesIssue();
    await this.generateHeadingHierarchyIssue();

    console.log('\n✨ All fixtures generated successfully!');
  }

  async generateCRLFIssue() {
    console.log('📄 Generating CRLF line ending issue fixture...');

    const content = `# Story 1.2: User Authentication

Status: drafted

## Story

As a user,
I want to authenticate with email and password,
so that I can access my account securely.

## Acceptance Criteria

1. User can log in with valid credentials
2. Invalid credentials show error message
3. Password is securely hashed

## QA Results

### Review Summary:

The story "User Authentication" is properly implemented with secure password handling.
`;

    // Force CRLF line endings
    const crlfContent = content.replaceAll('\n', '\r\n');

    await fs.writeFile(path.join(this.fixturesDir, 'generated-crlf-issue.md'), crlfContent, 'utf8');
  }

  async generateSpacingIssues() {
    console.log('📄 Generating inconsistent spacing issue fixture...');

    // Intentionally inconsistent spacing
    const content = `# Story 1.3: Data Processing


## Story

As a data analyst,
I want to process large datasets,
so that I can generate insights.


## Acceptance Criteria

1. Process CSV files up to 100MB

2. Generate summary statistics
3. Export results to Excel

## Tasks / Subtasks

- [ ] File upload handling (AC: #1)
  - [ ] Validate file format
  - [ ] Check file size limits
- [ ] Data processing (AC: #2)

  - [ ] Calculate means and medians
  - [ ] Generate charts
- [ ] Export functionality (AC: #3)
   - [ ] Create Excel workbook
   - [ ] Format data tables

## Dev Notes


Technical requirements include:
- Pandas for data processing
- Openpyxl for Excel export


### References

[Source: docs/requirements.md#Data Processing]

## QA Results

### Review Summary:

Data processing implementation meets all requirements.
`;

    await fs.writeFile(path.join(this.fixturesDir, 'generated-spacing-issues.md'), content, 'utf8');
  }

  async generateQAResultsIssue() {
    console.log('📄 Generating QA Results section issue fixture...');

    // This reproduces the exact issue from GitHub #483
    const content = `# Story 1.4: Payment Integration

Status: drafted

## Story

As a customer,
I want to pay for my order with a credit card,
so that I can complete my purchase.

## Acceptance Criteria

1. Accept major credit cards (Visa, MC, Amex)
2. Validate card information
3. Process payment securely
4. Send confirmation email

## QA Results

### Review Summary:

The story "Payment Integration" (Story 1.4) is well-defined and covers the essential requirements for payment processing. The acceptance criter…

### Implementation Notes

Payment gateway integration completed successfully.

### Security Review

- PCI compliance verified ✓
- Data encryption in place ✓
`;

    await fs.writeFile(path.join(this.fixturesDir, 'generated-qa-results-issue.md'), content, 'utf8');
  }

  async generateSmartQuotesIssue() {
    console.log('📄 Generating smart quotes issue fixture...');

    // Include problematic smart quotes and other Unicode characters
    const content = `# Story 1.5: Content Management

Status: drafted

## Story

As a content manager,
I want to publish articles with rich formatting,
so that readers have an engaging experience.

## Dev Notes

The system should handle "smart quotes" and 'curly apostrophes' properly.

Key requirements:
- Support for em-dash — characters
- Handle ellipses… correctly
- Process "quoted text" and 'single quotes'

### Technical Considerations

Content processing must normalize Unicode characters to prevent issues with:
- Search functionality
- Database indexing  
- API responses

## QA Results

### Review Summary:

The "Content Management" story includes proper Unicode handling.
`;

    await fs.writeFile(path.join(this.fixturesDir, 'generated-smart-quotes-issue.md'), content, 'utf8');
  }

  async generateHeadingHierarchyIssue() {
    console.log('📄 Generating heading hierarchy issue fixture...');

    const content = `# Story 1.6: Notification System

Status: drafted

### Skipped H2 - This violates hierarchy

As a user,
I want to receive notifications,
so that I stay informed.

## Proper H2 Now

This section follows the H1.

##### Skipped H3 and H4 - Another violation

This heading jumps from H2 to H5.

#### Back to H4

Normal hierarchy resumed.

## QA Results

##### Wrong level for QA subsection

Should be H3, not H5.
`;

    await fs.writeFile(path.join(this.fixturesDir, 'generated-heading-hierarchy-issue.md'), content, 'utf8');
  }

  async validateGeneratedFixtures() {
    console.log('\n🔍 Validating generated fixtures...\n');

    const fixtureFiles = await fs.readdir(this.fixturesDir);
    const mdFiles = fixtureFiles.filter((file) => file.endsWith('.md') && file.startsWith('generated-'));

    for (const file of mdFiles) {
      console.log(`📋 Validating ${file}:`);
      const filePath = path.join(this.fixturesDir, file);
      const content = await fs.readFile(filePath, 'utf8');

      // Check for issues
      const issues = [];

      // CRLF check
      if (content.includes('\r\n')) {
        issues.push('  ❌ Contains CRLF line endings');
      }

      // Spacing issues
      if (content.includes('\n\n\n')) {
        issues.push('  ❌ Contains excessive blank lines');
      }

      // Smart quotes
      if (content.includes('\u201C') || content.includes('\u2018')) {
        issues.push('  ❌ Contains smart quotes/Unicode characters');
      }

      // Heading hierarchy
      const headings = content.match(/^#{1,6}\s/gm) || [];
      if (headings.some((h) => h.startsWith('#####'))) {
        issues.push('  ❌ Contains H5 headings (potential hierarchy violation)');
      }

      if (issues.length > 0) {
        console.log(issues.join('\n'));
      } else {
        console.log('  ✅ No major formatting issues detected');
      }
    }
  }
}

// Run the generator if called directly
if (require.main === module) {
  const generator = new MarkdownFixtureGenerator();
  generator
    .generateAllFixtures()
    .then(() => generator.validateGeneratedFixtures())
    .catch(console.error);
}

module.exports = MarkdownFixtureGenerator;

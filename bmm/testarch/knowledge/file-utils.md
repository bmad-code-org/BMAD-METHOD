# File Utilities

## Principle

Read and validate files (CSV, XLSX, PDF, ZIP) with automatic parsing, type-safe results, and download handling. Simplify file operations in Playwright tests with built-in format support and validation helpers.

## Rationale

Testing file operations in Playwright requires boilerplate:

- Manual download handling
- External parsing libraries for each format
- No validation helpers
- Type-unsafe results
- Repetitive path handling

The `file-utils` module provides:

- **Auto-parsing**: CSV, XLSX, PDF, ZIP automatically parsed
- **Download handling**: Single function for UI or API-triggered downloads
- **Type-safe**: TypeScript interfaces for parsed results
- **Validation helpers**: Row count, header checks, content validation
- **Format support**: Multiple sheet support (XLSX), text extraction (PDF), archive extraction (ZIP)

## Pattern Examples

### Example 1: UI-Triggered CSV Download

**Context**: User clicks button, CSV downloads, validate contents.

**Implementation**:

```typescript
import { handleDownload, readCSV } from '@seontechnologies/playwright-utils/file-utils';
import path from 'node:path';

const DOWNLOAD_DIR = path.join(__dirname, '../downloads');

test('should download and validate CSV', async ({ page }) => {
  const downloadPath = await handleDownload({
    page,
    downloadDir: DOWNLOAD_DIR,
    trigger: () => page.click('[data-testid="export-csv"]'),
  });

  const { content } = await readCSV({ filePath: downloadPath });

  // Validate headers
  expect(content.headers).toEqual(['ID', 'Name', 'Email', 'Role']);

  // Validate data
  expect(content.data).toHaveLength(10);
  expect(content.data[0]).toMatchObject({
    ID: expect.any(String),
    Name: expect.any(String),
    Email: expect.stringMatching(/@/),
  });
});
```

**Key Points**:

- `handleDownload` waits for download, returns file path
- `readCSV` auto-parses to `{ headers, data }`
- Type-safe access to parsed content
- Clean up downloads in `afterEach`

### Example 2: XLSX with Multiple Sheets

**Context**: Excel file with multiple sheets (e.g., Summary, Details, Errors).

**Implementation**:

```typescript
import { readXLSX } from '@seontechnologies/playwright-utils/file-utils';

test('should read multi-sheet XLSX', async () => {
  const downloadPath = await handleDownload({
    page,
    downloadDir: DOWNLOAD_DIR,
    trigger: () => page.click('[data-testid="export-xlsx"]'),
  });

  const { content } = await readXLSX({ filePath: downloadPath });

  // Access specific sheets
  const summarySheet = content.sheets.find((s) => s.name === 'Summary');
  const detailsSheet = content.sheets.find((s) => s.name === 'Details');

  // Validate summary
  expect(summarySheet.data).toHaveLength(1);
  expect(summarySheet.data[0].TotalRecords).toBe('150');

  // Validate details
  expect(detailsSheet.data).toHaveLength(150);
  expect(detailsSheet.headers).toContain('TransactionID');
});
```

**Key Points**:

- `sheets` array with `name` and `data` properties
- Access sheets by name
- Each sheet has its own headers and data
- Type-safe sheet iteration

### Example 3: PDF Text Extraction

**Context**: Validate PDF report contains expected content.

**Implementation**:

```typescript
import { readPDF } from '@seontechnologies/playwright-utils/file-utils';

test('should validate PDF report', async () => {
  const downloadPath = await handleDownload({
    page,
    downloadDir: DOWNLOAD_DIR,
    trigger: () => page.click('[data-testid="download-report"]'),
  });

  const { content } = await readPDF({ filePath: downloadPath });

  // content.text is extracted text from all pages
  expect(content.text).toContain('Financial Report Q4 2024');
  expect(content.text).toContain('Total Revenue:');

  // Validate page count
  expect(content.numpages).toBeGreaterThan(10);
});
```

**Key Points**:

- `content.text` contains all extracted text
- `content.numpages` for page count
- PDF parsing handles multi-page documents
- Search for specific phrases

### Example 4: ZIP Archive Validation

**Context**: Validate ZIP contains expected files and extract specific file.

**Implementation**:

```typescript
import { readZIP } from '@seontechnologies/playwright-utils/file-utils';

test('should validate ZIP archive', async () => {
  const downloadPath = await handleDownload({
    page,
    downloadDir: DOWNLOAD_DIR,
    trigger: () => page.click('[data-testid="download-backup"]'),
  });

  const { content } = await readZIP({ filePath: downloadPath });

  // Check file list
  expect(content.files).toContain('data.csv');
  expect(content.files).toContain('config.json');
  expect(content.files).toContain('readme.txt');

  // Read specific file from archive
  const configContent = content.zip.readAsText('config.json');
  const config = JSON.parse(configContent);

  expect(config.version).toBe('2.0');
});
```

**Key Points**:

- `content.files` lists all files in archive
- `content.zip.readAsText()` extracts specific files
- Validate archive structure
- Read and parse individual files from ZIP

### Example 5: API-Triggered Download

**Context**: API endpoint returns file download (not UI click).

**Implementation**:

```typescript
test('should download via API', async ({ page, request }) => {
  const downloadPath = await handleDownload({
    page,
    downloadDir: DOWNLOAD_DIR,
    trigger: async () => {
      const response = await request.get('/api/export/csv', {
        headers: { Authorization: 'Bearer token' },
      });

      if (!response.ok()) {
        throw new Error(`Export failed: ${response.status()}`);
      }
    },
  });

  const { content } = await readCSV({ filePath: downloadPath });

  expect(content.data).toHaveLength(100);
});
```

**Key Points**:

- `trigger` can be async API call
- API must return `Content-Disposition` header
- Still need `page` for download events
- Works with authenticated endpoints

## Validation Helpers

```typescript
// CSV validation
const { isValid, errors } = await validateCSV({
  filePath: downloadPath,
  expectedRowCount: 10,
  requiredHeaders: ['ID', 'Name', 'Email'],
});

expect(isValid).toBe(true);
expect(errors).toHaveLength(0);
```

## Download Cleanup Pattern

```typescript
test.afterEach(async () => {
  // Clean up downloaded files
  await fs.remove(DOWNLOAD_DIR);
});
```

## Related Fragments

- `overview.md` - Installation and imports
- `api-request.md` - API-triggered downloads
- `recurse.md` - Poll for file generation completion

## Anti-Patterns

**❌ Not cleaning up downloads:**

```typescript
test('creates file', async () => {
  await handleDownload({ ... })
  // File left in downloads folder
})
```

**✅ Clean up after tests:**

```typescript
test.afterEach(async () => {
  await fs.remove(DOWNLOAD_DIR);
});
```

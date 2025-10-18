# OCR to Excel Workflow - Next Steps for Testing

**Created:** 2025-10-18
**Status:** Ready for testing after PR #764 is merged
**Related PR:** https://github.com/bmad-code-org/BMAD-METHOD/pull/764
**Related Issue:** https://github.com/bmad-code-org/BMAD-METHOD/issues/763

## Current Status

✅ **COMPLETE:**
- Phase 1: Infrastructure (agent, workflow config, templates, docs)
- Phase 2: OCR & File Processing implementation
- Phase 3: Data Parsing & Validation implementation
- Phase 4: Excel Integration (placeholder - needs library)
- Phase 5: Batch Processing implementation
- Code committed and PR created

⏳ **PENDING:**
- Phase 6: Testing & Documentation (this document)
- Real-world testing with actual data

## Prerequisites for Testing

Before starting the test session, ensure:

1. **PR #764 is merged** to v6-alpha branch
2. **OpenRouter API key** is ready
   ```bash
   export OPENROUTER_API_KEY="your-api-key-here"
   ```
3. **Test data available:**
   - Master Excel file: `/Users/baito.kevin/Downloads/dev/BMAD-METHOD/MyTown/TM - Daily Sales Report DSR by Part Timers_260225.xlsx`
   - Source files: `/Users/baito.kevin/Downloads/dev/BMAD-METHOD/MyTown/2021/` (~2400 files)

## Test Plan: Phase 6 Implementation

### Step 1: Install Dependencies (15 minutes)

```bash
# Navigate to project root
cd /Users/baito.kevin/Downloads/dev/BMAD-METHOD/MyTown/BMAD-METHOD

# Install required npm packages
npm install --save xlsx pdf-parse @kenjiuno/msgreader

# Verify installation
npm list xlsx pdf-parse @kenjiuno/msgreader
```

**Expected Output:**
```
├── xlsx@0.18.5
├── pdf-parse@1.1.1
└── @kenjiuno/msgreader@2.0.0
```

### Step 2: Create Test Configuration (10 minutes)

Create `test-config.yaml` based on your real data:

```yaml
# OCR to Excel Test Configuration
name: "Daily Sales Report Extraction - Test"
description: "Test configuration for 2021 sales reports"

# API Configuration
api:
  provider: openrouter
  model: 'mistral/pixtral-large-latest'
  api_key: ${OPENROUTER_API_KEY}

# File Paths
paths:
  source_folder: '/Users/baito.kevin/Downloads/dev/BMAD-METHOD/MyTown/2021'
  master_file: '/Users/baito.kevin/Downloads/dev/BMAD-METHOD/MyTown/TM - Daily Sales Report DSR by Part Timers_260225.xlsx'
  processed_folder: '/Users/baito.kevin/Downloads/dev/BMAD-METHOD/MyTown/processed/done'
  backup_folder: '/Users/baito.kevin/Downloads/dev/BMAD-METHOD/MyTown/backups'
  log_folder: '/Users/baito.kevin/Downloads/dev/BMAD-METHOD/MyTown/logs'

# File Types
file_types:
  - pdf
  - xlsx
  - xls
  - msg

# Extraction Fields (customize based on your actual documents)
extraction_fields:
  - name: date
    type: date
    format: 'YYYY-MM-DD'
    required: true
    description: 'Sales report date'

  - name: store_name
    type: string
    required: true
    description: 'Tenant/store name'

  - name: sales_amount
    type: currency
    required: true
    description: 'Total daily sales'

  - name: part_timer_name
    type: string
    required: false
    description: 'Part timer employee name'

# Processing Configuration
processing:
  batch_size: 10
  parallel_limit: 3
  confidence_threshold: 0.85
  pause_on_low_confidence: true

# Logging
logging:
  level: 'info'
  log_to_console: true
  log_to_file: true
```

### Step 3: Small Batch Test (20 minutes)

Test with a small batch first (5-10 files):

```bash
# Create a test folder with just a few files
mkdir -p /Users/baito.kevin/Downloads/dev/BMAD-METHOD/MyTown/test-batch
cp /Users/baito.kevin/Downloads/dev/BMAD-METHOD/MyTown/2021/01.\ Jan\ 2021/*.pdf /Users/baito.kevin/Downloads/dev/BMAD-METHOD/MyTown/test-batch/ | head -10

# Update test-config.yaml to use test-batch folder
# Then run the workflow
```

**Testing Checklist:**
- [ ] API key loads correctly from environment
- [ ] Files are discovered successfully
- [ ] OCR API calls succeed
- [ ] Data extraction produces reasonable results
- [ ] Confidence scoring works
- [ ] Low-confidence items are flagged
- [ ] Validation UI appears for low-confidence items
- [ ] Excel backup is created before writing
- [ ] Data is written to master Excel file
- [ ] Processed files are moved to done folder
- [ ] Processing log is created
- [ ] Report is generated

**Expected Issues:**
1. **Excel library integration** - Currently placeholder, needs actual xlsx integration
2. **MSG parsing** - Placeholder, needs @kenjiuno/msgreader integration
3. **Field extraction patterns** - May need tuning based on actual document formats

### Step 4: Fix Excel Integration (30 minutes)

Update `task-excel-writer.js` to use actual xlsx library:

**Current (placeholder):**
```javascript
async function appendToExcel(config, dataRows) {
  const backup = await createBackup(masterFile, backupFolder);
  // TODO: Actual Excel writing implementation
  return { success: true, rowsWritten: dataRows.length };
}
```

**Needs to become:**
```javascript
const XLSX = require('xlsx');

async function appendToExcel(config, dataRows) {
  const { masterFile, backupFolder } = config.paths;

  // Create backup first
  const backup = await createBackup(masterFile, backupFolder);

  try {
    // Read existing workbook
    const workbook = XLSX.readFile(masterFile);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert worksheet to JSON
    const existingData = XLSX.utils.sheet_to_json(worksheet);

    // Append new rows
    const updatedData = [...existingData, ...dataRows];

    // Convert back to worksheet
    const newWorksheet = XLSX.utils.json_to_sheet(updatedData);
    workbook.Sheets[sheetName] = newWorksheet;

    // Write to file
    XLSX.writeFile(workbook, masterFile);

    return {
      success: true,
      rowsWritten: dataRows.length,
      totalRows: updatedData.length,
      backupPath: backup
    };
  } catch (error) {
    // Restore from backup on error
    await restoreBackup(backup, masterFile);
    throw error;
  }
}
```

### Step 5: Tune Field Extraction (45 minutes)

Based on test results, you may need to:

1. **Analyze sample OCR output:**
   ```bash
   # Check processing logs to see what OCR actually returns
   cat /Users/baito.kevin/Downloads/dev/BMAD-METHOD/MyTown/logs/processing-log-*.json | jq '.processedFiles[0].data'
   ```

2. **Adjust regex patterns in `task-data-parser.js`:**
   - Date format patterns
   - Currency extraction patterns
   - Store name patterns

3. **Add custom extraction prompts:**
   - Make prompts more specific to your document format
   - Add examples in the prompt for better accuracy

### Step 6: Medium Batch Test (30 minutes)

Test with ~50-100 files:

**Testing Focus:**
- [ ] Parallel processing works correctly
- [ ] Progress tracking is accurate
- [ ] Memory usage stays stable
- [ ] API rate limits are respected
- [ ] Error recovery works (simulate failures)
- [ ] Batch statistics are correct

### Step 7: Full Batch Test (2-3 hours)

Process all ~2400 files:

**Before running:**
- [ ] Ensure sufficient OpenRouter credits
- [ ] Verify disk space for backups and logs
- [ ] Close Excel file if open
- [ ] Set up monitoring (check CPU/memory periodically)

**Monitoring:**
```bash
# Monitor progress
tail -f /Users/baito.kevin/Downloads/dev/BMAD-METHOD/MyTown/logs/processing-log-*.json

# Check memory usage
watch -n 5 'ps aux | grep node'
```

### Step 8: Data Quality Review (1 hour)

After processing:

1. **Spot-check random samples:**
   - Open master Excel file
   - Compare 20-30 random entries with source documents
   - Verify dates, amounts, store names

2. **Check statistics:**
   - Total files processed vs. expected
   - Success rate
   - Average confidence scores
   - Common error patterns

3. **Review low-confidence items:**
   - Check all items flagged for manual review
   - Identify patterns in low-confidence extractions
   - Adjust confidence threshold if needed

### Step 9: Create Unit Tests (2 hours)

Create Jest tests for each task module:

```bash
# Install Jest
npm install --save-dev jest

# Create test directory structure
mkdir -p src/modules/bmm/tasks/ocr-extraction/__tests__
```

**Test files to create:**
- `task-file-scanner.test.js`
- `task-ocr-process.test.js`
- `task-data-parser.test.js`
- `task-excel-writer.test.js`
- `task-batch-processor.test.js`

**Example test:**
```javascript
const { parseOCRText } = require('../task-data-parser');

describe('task-data-parser', () => {
  describe('parseOCRText', () => {
    it('should extract date from OCR text', () => {
      const ocrText = 'Sales Report Date: 01/15/2021 Store: ABC Mart';
      const fields = [{ name: 'date', type: 'date', required: true }];

      const result = parseOCRText(ocrText, fields);

      expect(result.isValid).toBe(true);
      expect(result.data.date).toBe('2021-01-15');
    });
  });
});
```

### Step 10: Integration Tests (1 hour)

Create integration tests with mock API:

```javascript
// Mock OpenRouter API responses
jest.mock('node-fetch', () => jest.fn());

describe('End-to-end workflow', () => {
  it('should process a file from OCR to Excel', async () => {
    // Setup: Create test file, mock API, prepare config
    // Execute: Run batch processor
    // Assert: Verify Excel file updated correctly
  });
});
```

## Success Criteria

✅ **Ready for production when:**
- [ ] All task modules fully implemented (no placeholders)
- [ ] Small batch test (10 files) completes successfully
- [ ] Medium batch test (100 files) with 90%+ success rate
- [ ] Full batch test (2400 files) completes
- [ ] Data quality spot-check shows 95%+ accuracy
- [ ] Unit test coverage >80%
- [ ] Integration tests pass
- [ ] Performance acceptable (<5 sec/file average)
- [ ] Memory usage stable (no leaks)
- [ ] Documentation updated with findings

## Known Issues to Address

1. **Excel Library Integration**
   - Status: Placeholder implementation
   - Priority: High
   - Estimated effort: 30 minutes

2. **MSG File Parsing**
   - Status: Placeholder implementation
   - Priority: Medium
   - Estimated effort: 1 hour

3. **Interactive Validation UI**
   - Status: Placeholder (auto-approves all)
   - Priority: Medium
   - Estimated effort: 1 hour

4. **Field Extraction Tuning**
   - Status: Generic patterns
   - Priority: High
   - Estimated effort: 1-2 hours based on test results

## Resources

- **OpenRouter Docs:** https://openrouter.ai/docs
- **xlsx Library:** https://www.npmjs.com/package/xlsx
- **pdf-parse Library:** https://www.npmjs.com/package/pdf-parse
- **msgreader Library:** https://www.npmjs.com/package/@kenjiuno/msgreader
- **Jest Testing:** https://jestjs.io/docs/getting-started

## Session Checklist

**At the start of next session:**
- [ ] Pull latest changes (if PR merged)
- [ ] Review this document
- [ ] Set OpenRouter API key
- [ ] Check test data is accessible
- [ ] Install dependencies (npm install)
- [ ] Create test configuration file
- [ ] Start with Step 3 (Small Batch Test)

**By end of next session (ideal):**
- [ ] Dependencies installed
- [ ] Excel integration implemented
- [ ] Small batch test passed
- [ ] Medium batch test passed
- [ ] Full batch test started (can run overnight)

**Follow-up session:**
- [ ] Review full batch results
- [ ] Data quality review
- [ ] Unit tests created
- [ ] Integration tests created
- [ ] Documentation updated
- [ ] Mark Phase 6 complete

## Quick Start Commands

```bash
# Navigate to project
cd /Users/baito.kevin/Downloads/dev/BMAD-METHOD/MyTown/BMAD-METHOD

# Set API key
export OPENROUTER_API_KEY="your-key-here"

# Install dependencies
npm install

# Run small batch test (after creating test-config.yaml)
# Use BMAD CLI or agent to trigger workflow
/ocr-to-excel

# Monitor progress
tail -f logs/processing-log-*.json

# Check results
open backups/  # View backups
open processed/done/  # View processed files
open "TM - Daily Sales Report DSR by Part Timers_260225.xlsx"  # View master file
```

## Notes

- Keep this document updated as you progress through testing
- Document any issues found and their resolutions
- Note any performance bottlenecks
- Record API costs for ~2400 files
- Save sample OCR outputs for future reference

---

**Last Updated:** 2025-10-18
**Next Session Goal:** Complete Steps 1-6 (through Medium Batch Test)
**Estimated Time for Next Session:** 3-4 hours

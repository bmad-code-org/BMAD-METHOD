# OCR to Excel Data Extraction Workflow

Automated document processing workflow that uses Mistral OCR via OpenRouter API to extract structured data from PDFs, Excel files, and Outlook messages, consolidating results into a master Excel spreadsheet.

## Overview

This workflow demonstrates BMAD-METHOD's capability for human-AI collaboration in document processing tasks. It intelligently balances automation with human oversight through confidence-based decision making.

**Key Features:**

- Multi-format document support (PDF, XLSX, XLS, MSG)
- Automated OCR using Mistral Vision API via OpenRouter
- Confidence-based extraction validation
- Batch processing with progress tracking
- Automatic Excel backup before writing
- Comprehensive audit trail and logging
- File management with folder structure preservation

## Status: Phase 1 - Foundation Complete

**Current Implementation:**

- ✅ Agent definition and persona
- ✅ Workflow configuration
- ✅ Configuration templates
- ✅ Workflow instructions (14 steps)
- ✅ Output templates
- ✅ Validation checklist
- ✅ Documentation

**Next Phases (Not Yet Implemented):**

- ⏳ Phase 2: OCR & File Processing tasks
- ⏳ Phase 3: Data Parsing & Validation tasks
- ⏳ Phase 4: Excel Integration tasks
- ⏳ Phase 5: Batch Processing & Cleanup tasks
- ⏳ Phase 6: Testing & Documentation

> **Note:** This workflow has a complete design and documentation, but the actual implementation tasks (JavaScript modules for OCR processing, Excel writing, etc.) are planned for future development. See [Implementation Plan](#implementation-plan) below.

## Use Case

Organizations often receive hundreds of documents (sales reports, invoices, forms) in various formats that require manual data entry into spreadsheets. This workflow automates that process:

**Example:** Daily sales reports from multiple tenants:

- **Current Process:** ~40 hours/month manual data entry
- **With This Workflow:** <2 hours/month for validation
- **Time Savings:** 95%+ reduction in manual effort

## Quick Start

### Prerequisites

1. **OpenRouter API Key:** Sign up at https://openrouter.ai and get your API key
2. **Node.js:** Version 20.0.0 or higher
3. **BMAD-METHOD:** v6-alpha or later

### Installation

```bash
# Install the BMM module (if not already installed)
bmad install module bmm

# The OCR workflow is included in the BMM module
# Access via the Data Extraction Specialist agent
```

### Setup

1. **Set your API key:**

   ```bash
   export OPENROUTER_API_KEY="your-api-key-here"
   ```

2. **Prepare your files:**

   ```
   project/
   ├── source-documents/
   │   └── 2021/
   │       ├── 01. Jan 2021/
   │       └── 02. Feb 2021/
   └── master-file.xlsx
   ```

3. **Run the workflow:**
   Trigger via your BMad-enabled IDE using the Data Extraction Specialist agent:
   ```
   /ocr-to-excel
   ```

## Configuration

The workflow uses a YAML configuration file. Copy `config-template.yaml` to your project and customize:

```yaml
# API Configuration
api:
  provider: openrouter
  model: "mistral/pixtral-large-latest"
  api_key: ${OPENROUTER_API_KEY}

# File Paths
paths:
  source_folder: "./source-documents"
  master_file: "./master-file.xlsx"
  processed_folder: "./processed/done"

# Extraction Fields
extraction_fields:
  - name: date
    type: date
    required: true
  - name: store_name
    type: string
    required: true
  - name: sales_amount
    type: number
    required: true
```

See `config-template.yaml` for complete configuration options.

## Workflow Process

The workflow follows a 14-step process:

1. **Environment Validation:** Check API key and dependencies
2. **Configuration Setup:** Load or create extraction configuration
3. **File Discovery:** Scan source folders for supported files
4. **OCR Processing:** Send documents to Mistral OCR API
5. **Data Extraction:** Parse OCR results into structured data
6. **Confidence Scoring:** Calculate extraction confidence (0-100%)
7. **Human Validation:** Review low-confidence extractions
8. **Excel Backup:** Create timestamped backup of master file
9. **Data Writing:** Append validated data to Excel
10. **File Management:** Move processed files to done folder
11. **Audit Logging:** Record all operations with timestamps
12. **Report Generation:** Create comprehensive processing report
13. **Error Handling:** Log failures and provide retry options
14. **Summary:** Display statistics and next steps

## Human-AI Collaboration

The workflow implements confidence-based decision making:

- **High Confidence (≥85%):** Automatically approved
- **Low Confidence (<85%):** Flagged for human review
- **Failed OCR:** User prompted with options (retry/skip/manual)

This ensures efficiency without sacrificing accuracy.

## Output Files

After processing, you'll have:

- **Master Excel File:** Updated with new extracted data
- **Backup:** `backups/master-file-YYYYMMDD-HHMMSS.xlsx`
- **Processing Report:** `output/extraction-results-YYYYMMDD.md`
- **Processing Log:** `logs/processing-log-YYYYMMDD.json`
- **Processed Files:** Moved to `processed/done/` folder

## Examples

### Basic Usage

```bash
# Process all files in source-documents/
/ocr-to-excel

# The workflow will:
# 1. Ask for configuration (use existing or create new)
# 2. Scan for files
# 3. Process each file with OCR
# 4. Present low-confidence items for review
# 5. Write data to Excel
# 6. Move processed files
# 7. Generate report
```

### Batch Processing

For large batches (100+ files):

1. Configure parallel processing limit (default: 3)
2. Set confidence threshold (default: 85%)
3. Enable pause/resume capability
4. Monitor progress bar

### Field Mapping Example

Extract sales data from PDF reports:

```yaml
extraction_fields:
  - name: date
    type: date
    format: "YYYY-MM-DD"
    description: "Sales report date"

  - name: store_name
    type: string
    description: "Tenant/store name"

  - name: sales_amount
    type: number
    format: "currency"
    description: "Total sales"
```

## Implementation Plan

This workflow is part of a larger implementation plan outlined in GitHub Issue #763.

### Phase 1: Core Infrastructure ✅ **COMPLETE**

- Agent definition
- Workflow configuration
- Templates and documentation

### Phase 2: OCR & File Processing ⏳ **PLANNED**

**Tasks:**

- Implement `task-ocr-process.js` - OpenRouter API integration
- Implement `task-file-scanner.js` - Recursive file discovery
- Add support for PDF, XLSX, XLS, MSG formats
- Retry logic and error handling
- Progress tracking

**Estimated Effort:** 1 week

### Phase 3: Data Parsing & Validation ⏳ **PLANNED**

**Tasks:**

- Implement `task-data-parser.js` - Parse OCR to structured data
- Create validation prompts (using inquirer)
- Confidence scoring algorithm
- Data correction UI
- Field mapping logic

**Estimated Effort:** 1 week

### Phase 4: Excel Integration ⏳ **PLANNED**

**Tasks:**

- Implement `task-excel-writer.js` - Write to Excel with xlsx library
- Automatic backup system
- Atomic write operations
- Rollback capability
- Excel structure analyzer

**Estimated Effort:** 1 week

### Phase 5: Batch Processing ⏳ **PLANNED**

**Tasks:**

- Implement `task-file-mover.js` - File management
- Batch orchestration
- Pause/resume functionality
- Processing queue with state persistence
- Summary statistics

**Estimated Effort:** 1 week

### Phase 6: Testing & Documentation ⏳ **PLANNED**

**Tasks:**

- Unit tests (Jest)
- Integration tests with mock API
- Comprehensive README
- Troubleshooting guide
- Real-world validation

**Estimated Effort:** 1 week

## Contributing

This workflow is part of issue #763. Contributions are welcome!

**To contribute:**

1. Check issue #763 for current status
2. Follow BMAD-METHOD contributing guidelines
3. Target the `v6-alpha` branch
4. Keep PRs small (200-400 lines ideal)
5. Include tests for new functionality

## Troubleshooting

### Common Issues

**API Key Not Found:**

```bash
export OPENROUTER_API_KEY="your-api-key"
```

**OCR Quality Poor:**

- Ensure source documents are high quality (not scanned at low DPI)
- Check that PDFs are not password-protected
- Verify file format is supported

**Excel Write Failures:**

- Check file permissions
- Ensure Excel file is not open in another application
- Verify backup folder exists and is writable

**Low Confidence Scores:**

- Review OCR text quality
- Adjust field extraction prompts
- Consider manual extraction for complex layouts

## Technical Details

### Dependencies

- **xlsx:** Excel file reading/writing (to be added in Phase 4)
- **pdf-parse:** PDF text extraction (to be added in Phase 2)
- **node-fetch:** API calls to OpenRouter (to be added in Phase 2)
- **fs-extra:** File operations (already in project)
- **glob:** File discovery (already in project)

### API Usage

The workflow uses OpenRouter's Mistral Pixtral Large model for OCR:

```javascript
// Example API call (implementation in Phase 2)
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "mistral/pixtral-large-latest",
    messages: [
      {
        role: "user",
        content: [
          { type: "image_url", image_url: { url: base64Image } },
          { type: "text", text: "Extract: date, store name, amount..." },
        ],
      },
    ],
  }),
});
```

### Security Considerations

- API keys stored in environment variables (never committed)
- Document contents not logged (only filenames)
- Backups created before any write operations
- User warned about sending documents to external API

## License

MIT - See main BMAD-METHOD repository

## Related Resources

- **Issue #763:** https://github.com/bmad-code-org/BMAD-METHOD/issues/763
- **OpenRouter Docs:** https://openrouter.ai/docs
- **BMAD-METHOD v6:** https://github.com/bmad-code-org/BMAD-METHOD

## Support

- **GitHub Issues:** https://github.com/bmad-code-org/BMAD-METHOD/issues
- **Discord:** Join the BMAD-METHOD community
- **Documentation:** https://github.com/bmad-code-org/BMAD-METHOD/wiki

# OCR to Excel Extraction Validation Checklist

## Pre-Processing Checklist

### Environment Setup

- [ ] OpenRouter API key is set as environment variable (OPENROUTER_API_KEY)
- [ ] API key has sufficient credits for batch processing
- [ ] Node.js version >= 20.0.0 is installed
- [ ] Required npm dependencies are installed (xlsx, pdf-parse, node-fetch, fs-extra, glob)

### Configuration Validation

- [ ] Configuration file exists and is valid YAML
- [ ] Source documents folder path is correct and accessible
- [ ] Master Excel file path is correct (or will be created)
- [ ] Processed files folder path is correct (or will be created)
- [ ] Backup folder path is correct (or will be created)
- [ ] All extraction fields are properly defined with types
- [ ] Required fields are marked correctly
- [ ] File types list matches actual source files

### Source Documents

- [ ] Source folder contains files to process
- [ ] File types match configured supported types (pdf, xlsx, xls, msg)
- [ ] Folder structure is organized (e.g., by year/month)
- [ ] No password-protected or corrupted files (or willing to skip them)
- [ ] Sample files tested manually for OCR quality

## During Processing Checklist

### File Discovery

- [ ] Correct number of files discovered in source folder
- [ ] Already-processed files are filtered out correctly
- [ ] File paths are displayed correctly without encoding issues
- [ ] File metadata (size, type, date) is captured

### OCR Processing

- [ ] API calls are successful (check first 5 files)
- [ ] OCR text quality is acceptable for extraction
- [ ] Retry logic works for failed API calls
- [ ] Error messages are clear and actionable
- [ ] Progress indicator shows accurate file counts

### Data Extraction

- [ ] Extracted data matches expected format
- [ ] Date formats are parsed correctly (YYYY-MM-DD)
- [ ] Number formats are parsed correctly (currency, integers)
- [ ] Store/tenant names are extracted consistently
- [ ] Required fields are present in all extractions
- [ ] Optional fields handle missing data gracefully

### Confidence Scoring

- [ ] Confidence scores are reasonable (not all 0% or 100%)
- [ ] Low-confidence extractions are flagged for review
- [ ] High-confidence threshold (default 85%) is appropriate
- [ ] User is prompted to review low-confidence items

### Human Validation

- [ ] Low-confidence extractions are displayed clearly
- [ ] Raw OCR text is available for reference
- [ ] User can edit/correct extracted values
- [ ] Corrected values are saved properly
- [ ] Skip option works for invalid files

## Excel Integration Checklist

### Backup Operations

- [ ] Master Excel file is backed up before writing
- [ ] Backup filename includes timestamp
- [ ] Backup is saved to correct location
- [ ] Backup file is readable and not corrupted

### Excel Writing

- [ ] Sheet name matches configuration
- [ ] Headers match configured extraction fields
- [ ] New rows are appended (not overwriting existing data)
- [ ] Cell formatting is correct (dates, numbers, text)
- [ ] Metadata fields are populated (source_file, processed_date, confidence)
- [ ] No data loss or corruption in master file
- [ ] Excel file can be opened after writing

### Data Integrity

- [ ] All validated extractions are written to Excel
- [ ] No duplicate entries created
- [ ] Row count increased by expected number
- [ ] No blank rows inserted
- [ ] Special characters handled correctly (no encoding issues)

## File Management Checklist

### File Movement

- [ ] Processed files are moved to correct location
- [ ] Original folder structure is preserved (if configured)
- [ ] Files are moved (not copied) to avoid duplicates
- [ ] File names remain unchanged after moving
- [ ] No files lost during movement operation

### Audit Trail

- [ ] Processing log file is created
- [ ] All operations are logged with timestamps
- [ ] Success and failure statuses are recorded
- [ ] Error messages include actionable details
- [ ] File paths in logs are accurate

## Post-Processing Checklist

### Results Validation

- [ ] Extraction report is generated successfully
- [ ] Report statistics match actual processing results
- [ ] Total files processed count is correct
- [ ] Success/failure counts are accurate
- [ ] Average confidence score is calculated correctly

### Data Quality

- [ ] Spot-check 10 random extracted records in Excel
- [ ] Verify dates are correct and consistent
- [ ] Verify sales amounts match source documents
- [ ] Verify store names are spelled correctly
- [ ] Check for any obviously incorrect data

### Error Handling

- [ ] Failed files list is complete and accurate
- [ ] Error messages are logged with sufficient detail
- [ ] Failed files remain in source folder (not moved)
- [ ] Retry mechanism works for transient failures
- [ ] Critical errors halt processing appropriately

## Final Validation

### Completeness

- [ ] All expected files were discovered
- [ ] All discovered files were processed or logged as failed
- [ ] No files processed more than once
- [ ] Processing queue was fully cleared
- [ ] No unexpected errors occurred

### Output Quality

- [ ] Master Excel file opens without errors
- [ ] Data is readable and formatted correctly
- [ ] No formula errors or #REF! cells
- [ ] Filtering and sorting work correctly
- [ ] File size is reasonable (not corrupted)

### Documentation

- [ ] Processing report is comprehensive and clear
- [ ] Processing log contains all necessary details
- [ ] Failed files are documented with reasons
- [ ] Next steps are clearly stated
- [ ] Audit trail is complete for compliance

## Performance Checklist

### Processing Time

- [ ] Average time per file is reasonable (< 3 seconds excluding API wait)
- [ ] Total processing time meets expectations
- [ ] No unexpected delays or hangs
- [ ] Parallel processing worked correctly (if configured)
- [ ] API rate limits were not exceeded

### Resource Usage

- [ ] Memory usage remained stable (no memory leaks)
- [ ] Disk space is sufficient for processed files and backups
- [ ] CPU usage was reasonable
- [ ] Network usage matches expected API call volume

## Security & Privacy Checklist

### API Security

- [ ] API key is not logged or exposed in reports
- [ ] API key is not committed to git
- [ ] API calls use HTTPS
- [ ] API responses do not contain sensitive keys

### Data Privacy

- [ ] Sensitive document contents are not logged in plain text
- [ ] Only necessary data is sent to external OCR API
- [ ] User was warned about sending documents to external API
- [ ] Audit logs don't expose sensitive information
- [ ] Backup files are stored securely

### File Permissions

- [ ] Master Excel file has appropriate read/write permissions
- [ ] Backup folder is only accessible by authorized users
- [ ] Processing logs are protected from unauthorized access

## Troubleshooting Checklist

If issues occur, verify:

- [ ] Error messages provide actionable guidance
- [ ] Failed files can be retried individually
- [ ] Backup can be restored if needed
- [ ] Processing can be paused and resumed
- [ ] Logs contain sufficient debug information

## Sign-Off

### Pre-Production

- [ ] All checklist items passed
- [ ] Sample batch (10-20 files) processed successfully
- [ ] Data quality spot-checked and verified
- [ ] Error handling tested with intentionally bad files
- [ ] Ready for full batch processing

### Post-Production

- [ ] Full batch processed successfully
- [ ] Master Excel file validated
- [ ] All files accounted for (processed or failed)
- [ ] Backups verified
- [ ] Processing documentation complete

---

**Processed By:** **\*\***\_\_\_**\*\***
**Date:** **\*\***\_\_\_**\*\***
**Batch Size:** **\*\***\_\_\_**\*\***
**Issues Found:** **\*\***\_\_\_**\*\***
**Resolution:** **\*\***\_\_\_**\*\***

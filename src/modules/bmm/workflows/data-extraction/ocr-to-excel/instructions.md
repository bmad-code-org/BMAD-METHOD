# OCR to Excel - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Initialize and validate environment">
<action>Welcome the user to the OCR Data Extraction workflow</action>
<action>Explain that this workflow will process documents using OCR and extract data to Excel</action>

<check if="OPENROUTER_API_KEY environment variable exists">
  <action>Validate API key is set</action>
  <action>Set api_key_configured = true</action>
</check>

<check if="OPENROUTER_API_KEY not set">
  <ask>**⚠️ OpenRouter API Key Required**

This workflow uses the OpenRouter API for Mistral OCR processing.

Please set your API key as an environment variable:

\`\`\`bash
export OPENROUTER_API_KEY="your-api-key-here"
\`\`\`

Options:

1. I've set the API key, continue
2. Exit and set it up first

What would you like to do?</ask>
<action>If user chooses option 1 → Verify key exists, continue</action>
<action>If user chooses option 2 → HALT with setup instructions</action>
</check>
</step>

<step n="1" goal="Configure extraction settings">
<ask>Let's set up your data extraction configuration.

Do you have an existing configuration file, or should we create one?

1. Use existing configuration file
2. Create new configuration with wizard
3. Use default configuration

Which option?</ask>

<action if="option 1">Ask for configuration file path</action>
<action if="option 1">Load and validate configuration</action>

<action if="option 2">Run configuration wizard (steps 2-5)</action>

<action if="option 3">Load default configuration from config-template.yaml</action>

<template-output>extraction_config</template-output>
</step>

<step n="2" goal="Configure source and destination paths" if="create_new_config">
<ask>**File Paths Configuration**

Please provide the following paths:

1. **Source Documents Folder:** Where are your files to process?
   Example: ./source-documents or /path/to/files

2. **Master Excel File:** Where should extracted data be saved?
   Example: ./master-data.xlsx

3. **Processed Files Folder:** Where to move processed files?
   Example: ./processed/done

4. **Backup Folder:** Where to store Excel backups?
   Example: ./backups</ask>

<action>Validate that source folder exists</action>
<action>Validate that master Excel file exists or can be created</action>
<action>Create processed and backup folders if they don't exist</action>

<template-output>source_folder</template-output>
<template-output>master_file</template-output>
<template-output>processed_folder</template-output>
<template-output>backup_folder</template-output>
</step>

<step n="3" goal="Configure extraction fields" if="create_new_config">
<ask>**Data Fields Configuration**

What fields should I extract from your documents?

Here are common fields for sales reports. Select all that apply:

- [ ] Date (sales report date)
- [ ] Store/Tenant Name
- [ ] Sales Amount
- [ ] Part Timer/Employee Name
- [ ] Shift Hours
- [ ] Invoice Number
- [ ] Custom field (specify)

Which fields do you need?</ask>

<action>Create extraction_fields configuration based on selections</action>
<action>For each custom field, ask for name, type, and whether it's required</action>

<template-output>extraction_fields</template-output>
</step>

<step n="4" goal="Configure processing settings" if="create_new_config">
<ask>**Processing Settings**

Configure how files should be processed:

1. **Batch Size:** How many files to process before saving? (default: 10)
2. **Parallel Processing:** Number of concurrent API calls (default: 3, max: 5)
3. **Confidence Threshold:** Auto-approve extractions with confidence >= ? (default: 85%)
4. **File Types:** Which file types to process? (pdf, xlsx, xls, msg)

Use defaults or customize?</ask>

<template-output>batch_size</template-output>
<template-output>parallel_limit</template-output>
<template-output>confidence_threshold</template-output>
<template-output>file_types</template-output>
</step>

<step n="5" goal="Save configuration" if="create_new_config">
<action>Generate complete configuration file</action>
<action>Save to {project-root}/bmad/bmm/workflows/data-extraction/ocr-to-excel/extraction-config.yaml</action>

<output>**✅ Configuration Saved**

Your extraction configuration has been saved and is ready to use.

You can edit it anytime at: extraction-config.yaml</output>

<template-output>config_file_path</template-output>
</step>

<step n="6" goal="Scan source documents">
<action>Scan the source folder recursively for supported file types</action>
<action>Filter out already-processed files (check processing log)</action>
<action>Build processing queue with file metadata</action>

<output>**📁 Document Scan Results**

Found {{total_files_found}} files:

- PDF: {{pdf_count}}
- Excel: {{excel_count}}
- MSG: {{msg_count}}

Already processed: {{already_processed_count}}
Ready to process: {{queue_length}}</output>

<ask>Ready to start processing {{queue_length}} files?

1. Yes, start batch processing
2. Show me the file list first
3. Cancel

What would you like to do?</ask>

<action if="option 2">Display paginated file list with details</action>
<action if="option 3">HALT</action>

<template-output>processing_queue</template-output>
</step>

<step n="7" goal="Process documents with OCR" repeat="for-each-file-in-queue">
<action>Select next file from queue</action>
<action>Display progress: "Processing {{current_file_number}}/{{total_files}}: {{filename}}"</action>

<action>Prepare file for OCR:

- If PDF: Convert pages to images
- If Excel: Read and prepare content
- If MSG: Extract and prepare content</action>

<action>Call Mistral OCR API via OpenRouter</action>
<action>Implement retry logic with exponential backoff (max 3 retries)</action>

<check if="API call successful">
  <action>Extract OCR text from response</action>
  <action>Parse text into structured data using field mappings</action>
  <action>Calculate confidence score for extraction</action>
  <action>Store extracted data with metadata</action>
</check>

<check if="API call failed">
  <action>Log error details</action>
  <action>Add file to failed_files list</action>
  <ask>API call failed for {{filename}}: {{error_message}}

Options:

1. Retry this file
2. Skip and continue
3. Pause processing

What would you like to do?</ask>
</check>

<template-output>extraction_results</template-output>
</step>

<step n="8" goal="Validate extracted data">
<action>Review all extraction results</action>
<action>Separate into high_confidence and low_confidence groups</action>

<output>**🎯 Extraction Complete**

Successfully extracted: {{successful_count}} files

- High confidence (>= {{confidence_threshold}}%): {{high_confidence_count}}
- Low confidence (< {{confidence_threshold}}%): {{low_confidence_count}}
- Failed: {{failed_count}}</output>

<check if="low_confidence_count > 0">
  <ask>**⚠️ Low Confidence Extractions Detected**

{{low_confidence_count}} files have confidence scores below {{confidence_threshold}}%.

These require human review before saving to Excel.

Options:

1. Review and correct each one
2. Auto-approve all (risky)
3. Skip low-confidence files for now

What would you like to do?</ask>

<action if="option 1">Present each low-confidence extraction for review</action>
<action if="option 2">Mark all as approved with warning</action>
<action if="option 3">Move to failed_files list</action>
</check>
</step>

<step n="9" goal="Review and correct low-confidence extractions" if="review_required" repeat="for-each-low-confidence">
<output>**📄 File:** {{filename}}
**Confidence:** {{confidence_score}}%

**Extracted Data:**
{{extracted_fields_display}}

**Raw OCR Text:**
{{ocr_text}}</output>

<ask>Please review and correct if needed:

1. Approve as-is
2. Edit field values
3. Skip this file
4. View raw OCR text

What would you like to do?</ask>

<action if="option 2">Prompt for corrected values for each field</action>
<action if="option 2">Update extraction_results with corrected data</action>
<action if="option 3">Move to skipped_files list</action>

<template-output>validated_extractions</template-output>
</step>

<step n="10" goal="Backup master Excel file">
<action>Check if master Excel file exists</action>

<check if="file exists">
  <action>Create timestamped backup: master-file-YYYYMMDD-HHMMSS.xlsx</action>
  <action>Save backup to backup_folder</action>
  <output>✅ Created backup: {{backup_filename}}</output>
</check>

<check if="file not exists">
  <ask>Master Excel file does not exist: {{master_file}}

Would you like to:

1. Create new Excel file
2. Specify different file
3. Cancel

What would you like to do?</ask>

<action if="option 1">Create new Excel file with proper headers</action>
<action if="option 2">Ask for new file path, validate, continue</action>
<action if="option 3">HALT</action>
</check>

<template-output>backup_file_path</template-output>
</step>

<step n="11" goal="Write data to master Excel file">
<action>Load master Excel file</action>
<action>Validate that sheet exists (create if configured to do so)</action>
<action>Validate that headers match configured fields</action>

<action>For each validated extraction:

- Append new row with extracted data
- Add metadata (source_file, processed_date, confidence)
- Format cells according to field types</action>

<action>Save Excel file with atomic write operation</action>

<check if="write successful">
  <output>✅ Successfully wrote {{row_count}} rows to {{master_file}}</output>
</check>

<check if="write failed">
  <output>⚠️ Failed to write to Excel file: {{error_message}}</output>
  <ask>Options:
1. Restore from backup and retry
2. Save extraction results to JSON file
3. Cancel

What would you like to do?</ask>

<action if="option 1">Restore backup, retry write operation</action>
<action if="option 2">Save results to {{output_folder}}/extraction-results-{{date}}.json</action>
</check>

<template-output>excel_write_log</template-output>
</step>

<step n="12" goal="Move processed files">
<action>For each successfully processed file:
- Determine target path in processed_folder
- Maintain original folder structure if configured
- Move file to processed_folder
- Log file movement</action>

<output>📦 Moved {{moved_file_count}} files to {{processed_folder}}</output>

<template-output>file_movement_log</template-output>
</step>

<step n="13" goal="Generate processing report">
<action>Compile processing statistics</action>
<action>Generate extraction report using template.md</action>
<action>Save report to {{output_folder}}/extraction-results-{{date}}.md</action>

<action>Create processing log with detailed audit trail</action>
<action>Save log to {{log_folder}}/processing-log-{{date}}.json</action>

<template-output>processing_report</template-output>
<template-output>processing_log</template-output>
</step>

<step n="14" goal="Final summary and next steps">
<output>**✅ Batch Processing Complete!**

**Summary:**

- Total files processed: {{total_files_processed}}
- Successfully extracted: {{successful_count}}
- Failed/skipped: {{failed_count}}
- Average confidence: {{average_confidence}}%
- Total processing time: {{total_duration}}

**Files Updated:**

- Master Excel: {{master_file}} ({{row_count}} new rows)
- Backup: {{backup_file_path}}
- Processing Report: {{processing_report}}
- Processing Log: {{processing_log}}

**Next Steps:**

1. Review extraction report: {{processing_report}}
2. Validate data in master Excel file
3. Process failed files manually if needed ({{failed_count}} files)
4. Archive processed files: {{processed_folder}}</output>

<check if="failed_count > 0">
  <output>
**⚠️ Failed Files:**

The following files could not be processed:
{{failed_files_list}}

See processing log for details: {{processing_log}}</output>
</check>

<ask>Would you like to:

1. View the extraction report
2. Process failed files
3. Start another batch
4. Exit

What would you like to do?</ask>

<action if="option 1">Display report content</action>
<action if="option 2">Restart workflow with failed_files as queue</action>
<action if="option 3">Restart workflow from step 6</action>
<action if="option 4">HALT</action>
</step>

</workflow>

# OCR Data Extraction Results: {{project_name}}

**Date:** {{date}}
**Processed By:** {{user_name}}
**Status:** {{processing_status}}

---

## Extraction Summary

**Total Files Processed:** {{total_files_processed}}
**Successfully Extracted:** {{successful_extractions}}
**Failed/Skipped:** {{failed_extractions}}
**Average Confidence Score:** {{average_confidence}}%

---

## Processing Configuration

**Source Folder:** {{source_folder}}
**Master Excel File:** {{master_file}}
**Extraction Fields:** {{extraction_fields_list}}

---

## Extraction Results

### High Confidence Extractions (>= {{confidence_threshold}}%)

{{high_confidence_results}}

### Low Confidence Extractions (Requires Review)

{{low_confidence_results}}

### Failed Extractions

{{failed_extractions_list}}

---

## Extracted Data Sample

| Date | Store Name | Part Timer Name | Shift Hours | Sales Amount | Source File | Confidence |
| ---- | ---------- | --------------- | ----------- | ------------ | ----------- | ---------- |

{{extraction_table_rows}}

---

## Processing Statistics

### Files by Type

- **PDF Files:** {{pdf_count}}
- **Excel Files:** {{excel_count}}
- **MSG Files:** {{msg_count}}

### Processing Time

- **Start Time:** {{start_time}}
- **End Time:** {{end_time}}
- **Total Duration:** {{total_duration}}
- **Average Time per File:** {{avg_time_per_file}}

### API Usage

- **Total API Calls:** {{total_api_calls}}
- **Successful Calls:** {{successful_api_calls}}
- **Failed Calls:** {{failed_api_calls}}
- **Retry Count:** {{retry_count}}

---

## Data Quality Metrics

### Confidence Distribution

- **90-100%:** {{count_90_100}}files
- **80-89%:** {{count_80_89}} files
- **70-79%:** {{count_70_79}} files
- **Below 70%:** {{count_below_70}} files

### Field Extraction Success Rates

- **Date:** {{date_success_rate}}%
- **Store Name:** {{store_name_success_rate}}%
- **Sales Amount:** {{sales_amount_success_rate}}%
- **Part Timer Name:** {{part_timer_name_success_rate}}%
- **Shift Hours:** {{shift_hours_success_rate}}%

---

## Files Requiring Human Review

{{files_needing_review}}

---

## Next Steps

- [ ] Review low-confidence extractions
- [ ] Manually process failed files
- [ ] Validate data in master Excel file
- [ ] Move processed files to archive
- [ ] Update extraction configuration if needed

---

## Audit Trail

### Files Processed

{{audit_trail_files}}

### Excel Write Operations

{{excel_write_log}}

### Errors and Warnings

{{errors_and_warnings}}

---

_This report was generated automatically by the OCR to Excel workflow._
_Master Excel File: {{master_file}}_
_Processing Log: {{processing_log_file}}_

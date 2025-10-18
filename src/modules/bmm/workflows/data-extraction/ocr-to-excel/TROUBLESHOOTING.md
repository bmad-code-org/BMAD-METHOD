# OCR to Excel Workflow - Troubleshooting Guide

## Common Issues and Solutions

### API Key Issues

**Problem:** "API key not found" or authentication errors

**Solutions:**

```bash
# Set API key as environment variable
export OPENROUTER_API_KEY="your-key-here"

# Verify it's set
echo $OPENROUTER_API_KEY

# Add to your shell profile for persistence
echo 'export OPENROUTER_API_KEY="your-key"' >> ~/.zshrc
source ~/.zshrc
```

### OCR Quality Issues

**Problem:** Low confidence scores or poor extraction accuracy

**Solutions:**

1. **Check source document quality**
   - Ensure PDFs are not scanned at low DPI
   - Verify images are clear and readable
   - Check that text is not too small

2. **Adjust extraction prompts**
   - Be more specific about field locations
   - Add examples of expected formats
   - Use field descriptions that match document labels

3. **Review OCR output**
   - Check raw OCR text in processing logs
   - Identify patterns that might need custom extraction logic

### File Processing Errors

**Problem:** "File not found" or permission denied errors

**Solutions:**

```bash
# Check file permissions
ls -la /path/to/files

# Fix permissions if needed
chmod 644 /path/to/files/*

# Ensure directories are readable
chmod 755 /path/to/directories
```

**Problem:** Unsupported file format

**Solutions:**

- Verify file extension matches supported types (pdf, xlsx, xls, msg)
- Check that file is not corrupted
- Try opening file manually to verify it's valid

### Excel Writing Issues

**Problem:** "Failed to write to Excel file"

**Solutions:**

1. **Close Excel file if it's open**
   - Excel must be closed for writing
   - Check for hidden Excel processes

2. **Verify file permissions**

   ```bash
   ls -la master-file.xlsx
   chmod 644 master-file.xlsx
   ```

3. **Check disk space**

   ```bash
   df -h
   ```

4. **Restore from backup if corrupted**
   - Backups are in `./backups/` folder
   - Find most recent backup and restore

### Performance Issues

**Problem:** Processing is very slow

**Solutions:**

1. **Reduce parallel processing**
   - Lower `parallel_limit` in config (try 1 or 2)
   - Some API rate limits may cause slowdowns

2. **Process in smaller batches**
   - Set `batch_size` to 5-10 files
   - Process folders separately

3. **Check network connectivity**
   - OCR requires stable internet
   - Test API endpoint manually

### Low Confidence Extractions

**Problem:** Many files flagged for manual review

**Solutions:**

1. **Lower confidence threshold**
   - Change `confidence_threshold` from 0.85 to 0.70
   - Review more carefully after processing

2. **Improve field definitions**
   - Add custom regex patterns for your data
   - Provide more descriptive field names

3. **Pre-process documents**
   - Standardize document formats when possible
   - Ensure consistent data placement

## Error Messages

### "OpenRouter API request failed: 401"

- **Cause:** Invalid or expired API key
- **Fix:** Check your API key at https://openrouter.ai/keys

### "OpenRouter API request failed: 429"

- **Cause:** Rate limit exceeded
- **Fix:** Reduce `parallel_limit` or add delays between requests

### "File conversion failed"

- **Cause:** Unsupported file format or corrupted file
- **Fix:** Check file integrity, convert manually if needed

### "Excel file locked"

- **Cause:** File is open in another application
- **Fix:** Close Excel and all file viewers

### "Insufficient credits"

- **Cause:** OpenRouter account has no credits
- **Fix:** Add credits at https://openrouter.ai/credits

## Debugging Tips

### Enable Debug Logging

```yaml
# In your config file
logging:
  level: 'debug' # Change from "info"
  log_to_console: true
```

### Check Processing Logs

```bash
# View recent processing logs
cat logs/processing-log-*.json | jq .

# Check for errors
grep -i "error" logs/*.json
```

### Test with Single File

Process one file at a time to isolate issues:

1. Move all but one file out of source folder
2. Run workflow
3. Check results carefully
4. If successful, gradually add more files

### Verify API Connectivity

```bash
# Test OpenRouter API manually
curl -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"mistral/pixtral-large-latest","messages":[{"role":"user","content":"test"}]}'
```

## Getting Help

If you're still experiencing issues:

1. **Check GitHub Issues:** https://github.com/bmad-code-org/BMAD-METHOD/issues/763
2. **Join Discord:** BMAD-METHOD community channel
3. **Review Documentation:** See README.md in this workflow folder
4. **Check Logs:** Always include error messages and log files when reporting issues

## Configuration Examples

### For Scanned PDFs

```yaml
processing:
  confidence_threshold: 0.70 # Lower threshold for scanned docs
  pause_on_low_confidence: true # Always review
```

### For High-Volume Processing

```yaml
processing:
  parallel_limit: 5 # More concurrent requests
  batch_size: 20 # Larger batches
  confidence_threshold: 0.90 # Higher confidence to reduce reviews
```

### For Sensitive Documents

```yaml
api:
  # Use local OCR instead (future feature)
  provider: local
  model: tesseract

logging:
  log_to_file: false # Don't log sensitive data
```

## Best Practices

1. **Always test with sample files first**
2. **Keep regular backups of your master Excel file**
3. **Review low-confidence extractions carefully**
4. **Monitor API costs if processing large volumes**
5. **Use version control for your configuration files**
6. **Document any custom patterns or rules you add**

## Performance Benchmarks

Typical processing speeds (varies by file size and API response time):

- **PDF files (1-5 pages):** 3-5 seconds per file
- **Excel files:** 2-4 seconds per file
- **MSG files:** 4-6 seconds per file

With parallel processing (3 concurrent):

- **100 files:** ~10-15 minutes
- **500 files:** ~50-75 minutes
- **1000 files:** ~2-3 hours

Note: Actual times depend on API rate limits and network speed.

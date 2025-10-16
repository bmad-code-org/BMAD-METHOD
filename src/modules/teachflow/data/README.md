# TeachFlow Data

This directory contains module data files for TeachFlow.

## Purpose

Stores local data used by TeachFlow agents and workflows:

- NGSS standards reference data (if needed for offline caching)
- Student profiles (anonymous, created on-demand)
- Usage analytics (workflow frequency, delegation patterns)
- Lesson history and templates
- User preferences and settings

## Privacy & Storage

**Privacy-First Design:**

- All data stored **locally only** (no cloud storage)
- No PII (Personally Identifiable Information) storage
- Student profiles are anonymous
- Teacher controls all data
- Works completely offline

## Data Structure

Data will be organized by purpose:

- `standards/` - NGSS standards cache (optional - primary source is NGSS MCP server)
- `profiles/` - Anonymous student learning profiles (created on-demand)
- `analytics/` - Usage patterns for optimization
- `cache/` - Temporary workflow data

## NGSS Standards Data

**Primary Source:** NGSS MCP Server (`/dev/personal/ngss-mcp-server/`)

- Standards Aligner agent delegates to MCP server for all lookups
- This directory may cache frequently-used standards for offline use
- Cache is optional - MCP server is the source of truth

**Format:** Dual-index JSON (if cached)

```json
{
  "lookup_indexes": {
    "by_standard_code": {"MS-LS1-6": "lesson_id"},
    "by_driving_question": {"how do plants get energy": "lesson_id"}
  },
  "lessons": {
    "lesson_id": {
      "standard_code": "MS-LS1-6",
      "three_dimensions": { "sep": {...}, "dci": {...}, "ccc": {...} }
    }
  }
}
```

## Development Status

**Phase 0-1** - Standards Aligner will determine caching strategy
Currently empty - data files created as needed during usage.

## Configuration

Data folder path configured in `config.yaml`:

```yaml
data_folder: '{module_root}/data'
```

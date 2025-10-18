/**
 * Data Parser Task
 * Parses OCR text into structured data using field mappings
 * Applies validation rules and type coercion
 */

/**
 * Parse OCR text into structured data
 * @param {string} ocrText - Raw OCR text from Mistral
 * @param {Array<Object>} fieldDefinitions - Field definitions from config
 * @param {Object} [options={}] - Parsing options
 * @returns {Object} Parsed and structured data
 */
function parseOCRText(ocrText, fieldDefinitions, options = {}) {
  const {
    strictMode = false, // If true, fail on missing required fields
    defaultValues = {}, // Default values for optional fields
  } = options;

  const parsed = {};
  const errors = [];
  const warnings = [];

  for (const field of fieldDefinitions) {
    try {
      const value = extractFieldValue(ocrText, field);

      if (value === null || value === undefined) {
        if (field.required) {
          errors.push(`Required field "${field.name}" not found`);
          if (strictMode) {
            continue;
          }
        }

        // Use default value if provided
        parsed[field.name] = defaultValues[field.name] || null;
        if (field.required) {
          warnings.push(`Required field "${field.name}" missing - using null`);
        }
      } else {
        // Type coercion and validation
        const coercedValue = coerceFieldType(value, field);
        const validation = validateFieldValue(coercedValue, field);

        if (validation.valid) {
          parsed[field.name] = coercedValue;

          if (validation.warning) {
            warnings.push(`Field "${field.name}": ${validation.warning}`);
          }
        } else {
          errors.push(`Field "${field.name}" validation failed: ${validation.error}`);
          parsed[field.name] = null;
        }
      }
    } catch (error) {
      errors.push(`Error parsing field "${field.name}": ${error.message}`);
      parsed[field.name] = null;
    }
  }

  return {
    data: parsed,
    errors,
    warnings,
    isValid: errors.length === 0,
    ocrText, // Keep original for reference
  };
}

/**
 * Extract field value from OCR text
 * @private
 */
function extractFieldValue(text, field) {
  const { type, patterns } = field;

  // Try custom patterns first
  if (patterns && Array.isArray(patterns)) {
    for (const pattern of patterns) {
      const regex = new RegExp(pattern, 'i');
      const match = text.match(regex);
      if (match) {
        return match[1] || match[0];
      }
    }
  }

  // Default extraction patterns by type
  switch (type) {
    case 'date': {
      return extractDate(text, field);
    }

    case 'number':
    case 'currency': {
      return extractNumber(text, field);
    }

    case 'string': {
      return extractString(text, field);
    }

    default: {
      return extractGeneric(text, field);
    }
  }
}

/**
 * Extract date from text
 * @private
 */
function extractDate(text, _field) {
  // Common date patterns
  const datePatterns = [
    /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/, //  MM/DD/YYYY or DD-MM-YYYY
    /(\d{4}[-/]\d{1,2}[-/]\d{1,2})/, // YYYY-MM-DD
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}/i, // Jan 15, 2021
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return null;
}

/**
 * Extract number from text
 * @private
 */
function extractNumber(text, _field) {
  // Look for numbers with optional currency symbols and separators
  const numberPatterns = [
    /\$?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/, // Currency with commas
    /(\d+\.\d+)/, // Decimal number
    /(\d+)/, // Integer
  ];

  for (const pattern of numberPatterns) {
    const match = text.match(pattern);
    if (match) {
      // Remove currency symbols and commas
      return match[1].replaceAll(/[,$]/g, '');
    }
  }

  return null;
}

/**
 * Extract string from text
 * @private
 */
function extractString(text, field) {
  // For string fields, look for the field name followed by a colon or similar
  const labelPatterns = [new RegExp(`${field.name}:\\s*([^\\n]+)`, 'i'), new RegExp(`${field.description}:\\s*([^\\n]+)`, 'i')];

  for (const pattern of labelPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  // If no label found, try to extract capitalized words (likely names)
  if (field.name.toLowerCase().includes('name')) {
    const nameMatch = text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
    if (nameMatch) {
      return nameMatch[0];
    }
  }

  return null;
}

/**
 * Extract generic value
 * @private
 */
function extractGeneric(text, field) {
  // Try to find text near field label
  const pattern = new RegExp(`${field.name}[:\\s]+([^\\n]+)`, 'i');
  const match = text.match(pattern);

  return match ? match[1].trim() : null;
}

/**
 * Coerce value to correct type
 * @private
 */
function coerceFieldType(value, field) {
  if (value === null || value === undefined) {
    return null;
  }

  switch (field.type) {
    case 'date': {
      return coerceDate(value, field.format);
    }

    case 'number': {
      return Number.parseFloat(value);
    }

    case 'currency': {
      return Number.parseFloat(value);
    }

    case 'string': {
      return String(value).trim();
    }

    case 'boolean': {
      return Boolean(value);
    }

    default: {
      return value;
    }
  }
}

/**
 * Coerce to date format
 * @private
 */
function coerceDate(value, format = 'YYYY-MM-DD') {
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    // Format according to specified format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (format === 'YYYY-MM-DD') {
      return `${year}-${month}-${day}`;
    }

    return date.toISOString().split('T')[0];
  } catch {
    return null;
  }
}

/**
 * Validate field value
 * @private
 */
function validateFieldValue(value, field) {
  if (value === null || value === undefined) {
    return { valid: !field.required, error: 'Value is null' };
  }

  // Type-specific validation
  switch (field.type) {
    case 'date': {
      return validateDate(value, field);
    }

    case 'number':
    case 'currency': {
      return validateNumber(value, field);
    }

    case 'string': {
      return validateString(value, field);
    }

    default: {
      return { valid: true };
    }
  }
}

/**
 * Validate date value
 * @private
 */
function validateDate(value, _field) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }

  return { valid: true };
}

/**
 * Validate number value
 * @private
 */
function validateNumber(value, field) {
  const num = Number(value);

  if (Number.isNaN(num)) {
    return { valid: false, error: 'Not a valid number' };
  }

  if (field.min !== undefined && num < field.min) {
    return { valid: false, error: `Value ${num} is below minimum ${field.min}` };
  }

  if (field.max !== undefined && num > field.max) {
    return { valid: false, error: `Value ${num} exceeds maximum ${field.max}` };
  }

  return { valid: true };
}

/**
 * Validate string value
 * @private
 */
function validateString(value, field) {
  const str = String(value);

  if (field.minLength && str.length < field.minLength) {
    return {
      valid: false,
      error: `String length ${str.length} is below minimum ${field.minLength}`,
    };
  }

  if (field.maxLength && str.length > field.maxLength) {
    return {
      valid: false,
      error: `String length ${str.length} exceeds maximum ${field.maxLength}`,
    };
  }

  if (field.pattern) {
    const regex = new RegExp(field.pattern);
    if (!regex.test(str)) {
      return { valid: false, error: 'String does not match required pattern' };
    }
  }

  return { valid: true };
}

/**
 * Calculate extraction confidence based on parsing results
 * @param {Object} parseResult - Result from parseOCRText
 * @returns {number} Confidence score (0-1)
 */
function calculateExtractionConfidence(parseResult) {
  if (!parseResult || !parseResult.data) {
    return 0;
  }

  const totalFields = Object.keys(parseResult.data).length;
  if (totalFields === 0) {
    return 0;
  }

  // Count successfully extracted fields
  const extractedFields = Object.values(parseResult.data).filter((v) => v !== null && v !== undefined).length;

  let baseScore = extractedFields / totalFields;

  // Penalty for errors
  if (parseResult.errors && parseResult.errors.length > 0) {
    baseScore -= parseResult.errors.length * 0.1;
  }

  // Small penalty for warnings
  if (parseResult.warnings && parseResult.warnings.length > 0) {
    baseScore -= parseResult.warnings.length * 0.05;
  }

  return Math.max(0, Math.min(1, baseScore));
}

module.exports = {
  parseOCRText,
  calculateExtractionConfidence,
};

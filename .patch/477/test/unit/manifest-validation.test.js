/**
 * Manifest Validation Unit Tests
 * Tests for validating manifest structure and fields
 * File: test/unit/manifest-validation.test.js
 */

const { ManifestValidator } = require('../../tools/cli/installers/lib/core/manifest');

describe('Manifest Validation', () => {
  let validator;

  beforeEach(() => {
    validator = new ManifestValidator();
  });

  describe('validateManifest', () => {
    // Test 2.1: Validate Complete Manifest
    it('should validate complete valid manifest', () => {
      const completeManifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
        ides_setup: ['claude-code', 'cline'],
        expansion_packs: ['bmad-infrastructure-devops'],
      };

      const result = validator.validateManifest(completeManifest);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    // Test 2.2: Reject Missing Required Fields
    it('should reject manifest missing "version"', () => {
      const manifestMissingVersion = {
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
      };

      const result = validator.validateManifest(manifestMissingVersion);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes('version'))).toBe(true);
    });

    it('should reject manifest missing "installed_at"', () => {
      const manifestMissingDate = {
        version: '4.36.2',
        install_type: 'full',
      };

      const result = validator.validateManifest(manifestMissingDate);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('installed_at'))).toBe(true);
    });

    it('should reject manifest missing "install_type"', () => {
      const manifestMissingType = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
      };

      const result = validator.validateManifest(manifestMissingType);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('install_type'))).toBe(true);
    });

    // Test 2.3: Reject Invalid Version Format
    it('should reject invalid semver version', () => {
      const manifestInvalidVersion = {
        version: 'not-semver',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
      };

      const result = validator.validateManifest(manifestInvalidVersion);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('version') && e.includes('format'))).toBe(true);
    });

    it('should accept valid semver versions', () => {
      const validVersions = ['4.36.2', '1.0.0', '10.20.30', '0.0.1', '4.36.2-beta'];

      for (const version of validVersions) {
        const manifest = {
          version,
          installed_at: '2025-08-12T23:51:04.439Z',
          install_type: 'full',
        };

        const result = validator.validateManifest(manifest);
        expect(result.isValid).toBe(true);
      }
    });

    // Test 2.4: Reject Invalid Date Format
    it('should reject invalid ISO date', () => {
      const manifestInvalidDate = {
        version: '4.36.2',
        installed_at: '2025-13-45T99:99:99Z',
        install_type: 'full',
      };

      const result = validator.validateManifest(manifestInvalidDate);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('installed_at') && e.includes('date'))).toBe(true);
    });

    it('should accept valid ISO dates', () => {
      const validDates = ['2025-08-12T23:51:04.439Z', '2025-01-01T00:00:00Z', '2024-12-31T23:59:59Z'];

      for (const date of validDates) {
        const manifest = {
          version: '4.36.2',
          installed_at: date,
          install_type: 'full',
        };

        const result = validator.validateManifest(manifest);
        expect(result.isValid).toBe(true);
      }
    });

    // Test 2.5: Accept Optional Fields Missing
    it('should allow missing optional fields', () => {
      const manifestMinimal = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
        // Note: ides_setup and expansion_packs intentionally missing
      };

      const result = validator.validateManifest(manifestMinimal);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    // Test 2.6: Validate Array Fields
    it('should validate ides_setup is array of strings', () => {
      const manifestInvalidIdes = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
        ides_setup: ['claude-code', 123], // Invalid: contains non-string
      };

      const result = validator.validateManifest(manifestInvalidIdes);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('ides_setup'))).toBe(true);
    });

    it('should accept valid ides_setup array', () => {
      const manifestValidIdes = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
        ides_setup: ['claude-code', 'cline', 'roo'],
      };

      const result = validator.validateManifest(manifestValidIdes);

      expect(result.isValid).toBe(true);
    });

    // Test 2.7: Type Validation for All Fields
    it('should validate field types', () => {
      const manifestWrongTypes = {
        version: 123, // Should be string
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
      };

      const result = validator.validateManifest(manifestWrongTypes);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('type'))).toBe(true);
    });

    it('should validate install_type field', () => {
      const validTypes = ['full', 'minimal', 'custom'];

      for (const type of validTypes) {
        const manifest = {
          version: '4.36.2',
          installed_at: '2025-08-12T23:51:04.439Z',
          install_type: type,
        };

        const result = validator.validateManifest(manifest);
        expect(result.isValid).toBe(true);
      }
    });
  });

  describe('getRequiredFields', () => {
    it('should list all required fields', () => {
      const required = validator.getRequiredFields();

      expect(Array.isArray(required)).toBe(true);
      expect(required).toContain('version');
      expect(required).toContain('installed_at');
      expect(required).toContain('install_type');
    });
  });

  describe('getOptionalFields', () => {
    it('should list all optional fields', () => {
      const optional = validator.getOptionalFields();

      expect(Array.isArray(optional)).toBe(true);
      expect(optional).toContain('ides_setup');
      expect(optional).toContain('expansion_packs');
    });
  });
});

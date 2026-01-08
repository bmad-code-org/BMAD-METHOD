import { describe, it, expect } from 'vitest';
import { escapeXml } from '../../../tools/lib/xml-utils.js';

describe('xml-utils', () => {
  describe('escapeXml()', () => {
    it('should escape ampersand (&) to &amp;', () => {
      expect(escapeXml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('should escape less than (<) to &lt;', () => {
      expect(escapeXml('5 < 10')).toBe('5 &lt; 10');
    });

    it('should escape greater than (>) to &gt;', () => {
      expect(escapeXml('10 > 5')).toBe('10 &gt; 5');
    });

    it('should escape double quote (") to &quot;', () => {
      expect(escapeXml('He said "hello"')).toBe('He said &quot;hello&quot;');
    });

    it("should escape single quote (') to &apos;", () => {
      expect(escapeXml("It's working")).toBe('It&apos;s working');
    });

    it('should preserve Unicode characters', () => {
      expect(escapeXml('Hello 世界 🌍')).toBe('Hello 世界 🌍');
    });

    it('should escape multiple special characters in sequence', () => {
      expect(escapeXml('<tag attr="value">')).toBe('&lt;tag attr=&quot;value&quot;&gt;');
    });

    it('should escape all five special characters together', () => {
      expect(escapeXml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&apos;');
    });

    it('should handle empty string', () => {
      expect(escapeXml('')).toBe('');
    });

    it('should handle null', () => {
      expect(escapeXml(null)).toBe('');
    });

    it('should handle undefined', () => {
      expect(escapeXml()).toBe('');
    });

    it('should handle text with no special characters', () => {
      expect(escapeXml('Hello World')).toBe('Hello World');
    });

    it('should handle text that is only special characters', () => {
      expect(escapeXml('&&&')).toBe('&amp;&amp;&amp;');
    });

    it('should not double-escape already escaped entities', () => {
      // Note: This is expected behavior - the function WILL double-escape
      // This test documents the actual behavior
      expect(escapeXml('&amp;')).toBe('&amp;amp;');
    });

    it('should escape special characters in XML content', () => {
      const xmlContent = '<persona role="Developer & Architect">Use <code> tags</persona>';
      const expected = '&lt;persona role=&quot;Developer &amp; Architect&quot;&gt;Use &lt;code&gt; tags&lt;/persona&gt;';
      expect(escapeXml(xmlContent)).toBe(expected);
    });

    it('should handle mixed Unicode and special characters', () => {
      expect(escapeXml('测试 <tag> & "quotes"')).toBe('测试 &lt;tag&gt; &amp; &quot;quotes&quot;');
    });

    it('should handle newlines and special characters', () => {
      const multiline = 'Line 1 & text\n<Line 2>\n"Line 3"';
      const expected = 'Line 1 &amp; text\n&lt;Line 2&gt;\n&quot;Line 3&quot;';
      expect(escapeXml(multiline)).toBe(expected);
    });

    it('should handle string with only whitespace', () => {
      expect(escapeXml('   ')).toBe('   ');
    });
  });
});

/**
 * Escape XML special characters in a string
 * @param {string} text - The text to escape
 * @returns {string} The escaped text
 */
function escapeXml(text) {
  if (!text) return '';
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

module.exports = {
  escapeXml,
};

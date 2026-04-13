const https = require('node:https');
const yaml = require('yaml');

/**
 * Shared HTTP client for fetching registry data from GitHub.
 * Used by ExternalModuleManager, CommunityModuleManager, and CustomModuleManager.
 */
class RegistryClient {
  constructor(options = {}) {
    this.timeout = options.timeout || 10_000;
  }

  /**
   * Fetch a URL and return the response body as a string.
   * Follows one redirect (GitHub sometimes 301s).
   * @param {string} url - URL to fetch
   * @param {number} [timeout] - Timeout in ms (overrides default)
   * @returns {Promise<string>} Response body
   */
  fetch(url, timeout) {
    const timeoutMs = timeout || this.timeout;
    return new Promise((resolve, reject) => {
      const req = https
        .get(url, { timeout: timeoutMs }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return this.fetch(res.headers.location, timeoutMs).then(resolve, reject);
          }
          if (res.statusCode !== 200) {
            return reject(new Error(`HTTP ${res.statusCode}`));
          }
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(data));
        })
        .on('error', reject)
        .on('timeout', () => {
          req.destroy();
          reject(new Error('Request timed out'));
        });
    });
  }

  /**
   * Fetch a URL and parse the response as YAML.
   * @param {string} url - URL to fetch
   * @param {number} [timeout] - Timeout in ms
   * @returns {Promise<Object>} Parsed YAML content
   */
  async fetchYaml(url, timeout) {
    const content = await this.fetch(url, timeout);
    return yaml.parse(content);
  }
}

module.exports = { RegistryClient };

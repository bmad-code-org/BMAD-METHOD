const https = require('node:https');
const yaml = require('yaml');

/**
 * Build a rich Error from a non-2xx response. Includes the URL, the GitHub
 * JSON error message (or a truncated body snippet), rate-limit reset time,
 * and Retry-After — anything present that would help a user recover.
 */
function buildHttpError(url, res, body) {
  const parts = [`HTTP ${res.statusCode} ${url}`];

  if (body) {
    try {
      const parsed = JSON.parse(body);
      if (parsed.message) parts.push(parsed.message);
      if (parsed.documentation_url) parts.push(`(see ${parsed.documentation_url})`);
    } catch {
      const snippet = body.slice(0, 200).trim();
      if (snippet) parts.push(snippet);
    }
  }

  const remaining = res.headers['x-ratelimit-remaining'];
  const reset = res.headers['x-ratelimit-reset'];
  if (remaining === '0' && reset) {
    parts.push(`rate limit exhausted; resets at ${new Date(Number(reset) * 1000).toISOString()}`);
  }

  const retryAfter = res.headers['retry-after'];
  if (retryAfter) parts.push(`retry after ${retryAfter}`);

  return new Error(parts.join(' — '));
}

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
   * Follows up to 3 redirects (GitHub sometimes 301s).
   * @param {string} url - URL to fetch
   * @param {number} [timeout] - Timeout in ms (overrides default)
   * @param {number} [maxRedirects=3] - Maximum redirects to follow
   * @returns {Promise<string>} Response body
   */
  fetch(url, timeout, maxRedirects = 3) {
    const timeoutMs = timeout || this.timeout;
    return new Promise((resolve, reject) => {
      const req = https
        .get(url, { timeout: timeoutMs }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            if (maxRedirects <= 0) {
              return reject(new Error('Too many redirects'));
            }
            return this.fetch(res.headers.location, timeoutMs, maxRedirects - 1).then(resolve, reject);
          }
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            if (res.statusCode !== 200) {
              return reject(buildHttpError(url, res, data));
            }
            resolve(data);
          });
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

  /**
   * Fetch a file from a GitHub repo using the Contents API first,
   * falling back to raw.githubusercontent.com if the API fails.
   *
   * The API endpoint (`api.github.com`) is tried first because corporate
   * proxies commonly block `raw.githubusercontent.com` while allowing
   * `api.github.com` under the "Software Development" category.
   *
   * @param {string} owner - Repository owner (e.g., 'bmad-code-org')
   * @param {string} repo  - Repository name (e.g., 'bmad-plugins-marketplace')
   * @param {string} filePath - Path within the repo (e.g., 'registry/official.yaml')
   * @param {string} ref   - Git ref (branch, tag, or SHA; e.g., 'main')
   * @param {number} [timeout] - Timeout in ms (overrides default)
   * @returns {Promise<string>} Raw file content
   */
  async fetchGitHubFile(owner, repo, filePath, ref, timeout) {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${ref}`;
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${filePath}`;

    // Try GitHub Contents API first (with raw content accept header)
    try {
      return await this._fetchWithHeaders(apiUrl, { Accept: 'application/vnd.github.raw+json' }, timeout);
    } catch (apiError) {
      // API failed — fall back to raw CDN
      try {
        return await this.fetch(rawUrl, timeout);
      } catch (cdnError) {
        throw new AggregateError([apiError, cdnError], `Both GitHub API and raw CDN failed for ${filePath}`);
      }
    }
  }

  /**
   * Fetch a file from GitHub and parse as YAML.
   * @param {string} owner - Repository owner
   * @param {string} repo  - Repository name
   * @param {string} filePath - Path within the repo
   * @param {string} ref   - Git ref
   * @param {number} [timeout] - Timeout in ms
   * @returns {Promise<Object>} Parsed YAML content
   */
  async fetchGitHubYaml(owner, repo, filePath, ref, timeout) {
    const content = await this.fetchGitHubFile(owner, repo, filePath, ref, timeout);
    return yaml.parse(content);
  }

  /**
   * Fetch a URL with custom headers. Used for GitHub API requests.
   * Follows up to 3 redirects.
   * @param {string} url - URL to fetch
   * @param {Object} headers - Request headers
   * @param {number} [timeout] - Timeout in ms
   * @param {number} [maxRedirects=3] - Maximum redirects to follow
   * @returns {Promise<string>} Response body
   * @private
   */
  _fetchWithHeaders(url, headers, timeout, maxRedirects = 3) {
    const timeoutMs = timeout || this.timeout;
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      timeout: timeoutMs,
      headers: {
        'User-Agent': 'bmad-installer',
        ...headers,
      },
    };

    return new Promise((resolve, reject) => {
      const req = https
        .get(options, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            if (maxRedirects <= 0) {
              return reject(new Error('Too many redirects'));
            }
            return this._fetchWithHeaders(res.headers.location, headers, timeoutMs, maxRedirects - 1).then(resolve, reject);
          }
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            if (res.statusCode !== 200) {
              return reject(buildHttpError(url, res, data));
            }
            resolve(data);
          });
        })
        .on('error', reject)
        .on('timeout', () => {
          req.destroy();
          reject(new Error('Request timed out'));
        });
    });
  }
}

module.exports = { RegistryClient };

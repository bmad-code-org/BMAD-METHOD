/**
 * Resolve the site's base URL using cascading environment defaults.
 *
 * Preference order: use SITE_URL if set; otherwise derive a GitHub Pages URL from GITHUB_REPOSITORY; otherwise use the local development URL.
 * @returns {string} The resolved site URL (SITE_URL override, or `https://{owner}.github.io/{repo}`, or `http://localhost:3000`).
 */
export function getSiteUrl() {
  // Explicit override (works in both local and GitHub Actions)
  if (process.env.SITE_URL) {
    return process.env.SITE_URL;
  }

  // GitHub Actions: compute from repository context
  if (process.env.GITHUB_REPOSITORY) {
    const parts = process.env.GITHUB_REPOSITORY.split('/');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new Error(`Invalid GITHUB_REPOSITORY format: "${process.env.GITHUB_REPOSITORY}". Expected "owner/repo".`);
    }
    const [owner, repo] = parts;
    return `https://${owner}.github.io/${repo}`;
  }

  // Local development: use dev server
  return 'http://localhost:3000';
}

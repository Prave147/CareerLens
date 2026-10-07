/**
 * GitHub API Client
 * Manages rate-limit aware communication with GitHub REST API.
 */

class GithubApiClient {
  constructor() {
    this.token = process.env.GITHUB_TOKEN || '';
    this.baseUrl = 'https://api.github.com';
  }

  getHeaders() {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'CareerLens-Intelligence-Engine/1.0',
    };
    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }
    return headers;
  }

  /**
   * Normalizes URLs or raw handles into a clean GitHub username
   */
  normalizeUsername(input) {
    if (!input || typeof input !== 'string') {
      throw new Error('Please enter a valid GitHub username or profile URL.');
    }

    let clean = input.trim();

    // Remove leading/trailing slashes
    clean = clean.replace(/\/+$/, '');

    // Extract username if URL is provided
    if (clean.includes('github.com/')) {
      const parts = clean.split('github.com/');
      const afterDomain = parts[1]?.split('/')[0]?.split('?')[0]?.split('#')[0];
      clean = afterDomain || '';
    }

    // Strip '@' if user provided @handle
    clean = clean.replace(/^@/, '').trim();

    // Validate GitHub username pattern (1-39 alphanumeric or single hyphens, cannot start/end with hyphen)
    const validPattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
    if (!validPattern.test(clean)) {
      throw new Error(`"${input}" is not a valid GitHub username format.`);
    }

    return clean;
  }

  /**
   * Fetches public GitHub user profile
   */
  async fetchUserProfile(username) {
    const cleanUser = this.normalizeUsername(username);
    const url = `${this.baseUrl}/users/${encodeURIComponent(cleanUser)}`;

    const res = await fetch(url, { headers: this.getHeaders() });

    if (res.status === 404) {
      throw new Error(`GitHub user "${cleanUser}" was not found.`);
    }

    if (res.status === 403) {
      const resetTime = res.headers.get('x-ratelimit-reset');
      const resetDate = resetTime ? new Date(resetTime * 1000).toLocaleTimeString() : 'later';
      throw new Error(`GitHub API rate limit reached. Limit will reset at ${resetDate}.`);
    }

    if (!res.ok) {
      throw new Error(`GitHub API error (${res.status}): ${res.statusText}`);
    }

    return await res.json();
  }

  /**
   * Fetches public repositories of a user
   */
  async fetchUserRepos(username) {
    const cleanUser = this.normalizeUsername(username);
    const url = `${this.baseUrl}/users/${encodeURIComponent(cleanUser)}/repos?per_page=100&sort=pushed`;

    const res = await fetch(url, { headers: this.getHeaders() });

    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error(`Failed to fetch repositories for "${cleanUser}" (${res.status}).`);
    }

    return await res.json();
  }

  /**
   * Fetches language breakdown of a repository
   */
  async fetchRepoLanguages(owner, repo) {
    try {
      const url = `${this.baseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`;
      const res = await fetch(url, { headers: this.getHeaders() });
      if (!res.ok) return {};
      return await res.json();
    } catch (err) {
      return {};
    }
  }

  /**
   * Fetches raw or decoded file content from a repository
   */
  async fetchRepoFile(owner, repo, filePath) {
    try {
      const url = `${this.baseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${filePath}`;
      const res = await fetch(url, { headers: this.getHeaders() });
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.content && data.encoding === 'base64') {
        return Buffer.from(data.content, 'base64').toString('utf8');
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  /**
   * Fetches README content of a repository
   */
  async fetchRepoReadme(owner, repo) {
    try {
      const url = `${this.baseUrl}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`;
      const res = await fetch(url, { headers: this.getHeaders() });
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.content && data.encoding === 'base64') {
        return Buffer.from(data.content, 'base64').toString('utf8');
      }
      return null;
    } catch (err) {
      return null;
    }
  }
}

module.exports = new GithubApiClient();

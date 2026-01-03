/**
 * Rate Limiter for Claude API
 *
 * Implements exponential backoff and respects rate limits:
 * - 50 requests/minute (Claude API limit)
 * - Automatic retry on 429 (rate limit exceeded)
 * - Configurable concurrent request limit
 */

export interface RateLimiterConfig {
	requestsPerMinute: number;
	maxRetries: number;
	initialBackoffMs: number;
	maxConcurrent: number;
}

export class RateLimiter {
	private requestTimestamps: number[] = [];
	private activeRequests = 0;
	private config: RateLimiterConfig;

	constructor(config: Partial<RateLimiterConfig> = {}) {
		this.config = {
			requestsPerMinute: config.requestsPerMinute ?? 50,
			maxRetries: config.maxRetries ?? 3,
			initialBackoffMs: config.initialBackoffMs ?? 1000,
			maxConcurrent: config.maxConcurrent ?? 5,
		};
	}

	/**
	 * Wait until it's safe to make next request
	 */
	async waitForSlot(): Promise<void> {
		// Wait for concurrent slot
		while (this.activeRequests >= this.config.maxConcurrent) {
			await this.sleep(100);
		}

		// Clean old timestamps (older than 1 minute)
		const oneMinuteAgo = Date.now() - 60000;
		this.requestTimestamps = this.requestTimestamps.filter(ts => ts > oneMinuteAgo);

		// Check if we've hit rate limit
		if (this.requestTimestamps.length >= this.config.requestsPerMinute) {
			const oldestRequest = this.requestTimestamps[0];
			const waitTime = 60000 - (Date.now() - oldestRequest);

			if (waitTime > 0) {
				console.log(`[RateLimiter] Rate limit reached. Waiting ${Math.ceil(waitTime / 1000)}s...`);
				await this.sleep(waitTime);
			}
		}

		// Add delay between requests (1.2s for 50 req/min)
		const minDelayMs = Math.ceil(60000 / this.config.requestsPerMinute);
		const lastRequest = this.requestTimestamps[this.requestTimestamps.length - 1];
		if (lastRequest) {
			const timeSinceLastRequest = Date.now() - lastRequest;
			if (timeSinceLastRequest < minDelayMs) {
				await this.sleep(minDelayMs - timeSinceLastRequest);
			}
		}

		this.requestTimestamps.push(Date.now());
		this.activeRequests++;
	}

	/**
	 * Release a concurrent slot
	 */
	releaseSlot(): void {
		this.activeRequests = Math.max(0, this.activeRequests - 1);
	}

	/**
	 * Execute function with exponential backoff retry
	 */
	async withRetry<T>(fn: () => Promise<T>, context: string): Promise<T> {
		let lastError: Error | null = null;

		for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
			try {
				await this.waitForSlot();
				const result = await fn();
				this.releaseSlot();
				return result;
			} catch (error) {
				this.releaseSlot();
				lastError = error instanceof Error ? error : new Error(String(error));

				// Check if it's a rate limit error (429)
				const errorMsg = lastError.message.toLowerCase();
				const isRateLimit = errorMsg.includes('429') || errorMsg.includes('rate limit');

				if (isRateLimit && attempt < this.config.maxRetries - 1) {
					const backoffMs = this.config.initialBackoffMs * Math.pow(2, attempt);
					console.log(
						`[RateLimiter] ${context} - Rate limit hit. Retry ${attempt + 1}/${this.config.maxRetries} in ${backoffMs}ms`
					);
					await this.sleep(backoffMs);
					continue;
				}

				// Non-retryable error or max retries reached
				if (attempt < this.config.maxRetries - 1) {
					const backoffMs = this.config.initialBackoffMs * Math.pow(2, attempt);
					console.log(
						`[RateLimiter] ${context} - Error: ${lastError.message}. Retry ${attempt + 1}/${this.config.maxRetries} in ${backoffMs}ms`
					);
					await this.sleep(backoffMs);
				}
			}
		}

		throw new Error(`${context} - Failed after ${this.config.maxRetries} attempts: ${lastError?.message}`);
	}

	private sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}

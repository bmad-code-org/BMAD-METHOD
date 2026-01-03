/**
 * Claude API Client for Test Generation
 *
 * Handles API communication with proper error handling and rate limiting.
 */

import Anthropic from '@anthropic-ai/sdk';
import { RateLimiter } from './rate-limiter.js';

export interface GenerateTestOptions {
	sourceCode: string;
	sourceFilePath: string;
	testTemplate: string;
	model?: string;
	temperature?: number;
	maxTokens?: number;
}

export interface GenerateTestResult {
	testCode: string;
	tokensUsed: number;
	model: string;
}

export class ClaudeClient {
	private client: Anthropic;
	private rateLimiter: RateLimiter;
	private model: string;

	constructor(apiKey?: string) {
		const key = apiKey ?? process.env.ANTHROPIC_API_KEY;

		if (!key) {
			throw new Error(
				'ANTHROPIC_API_KEY environment variable is required.\n' +
				'Please set it with: export ANTHROPIC_API_KEY=sk-ant-...'
			);
		}

		this.client = new Anthropic({ apiKey: key });
		this.rateLimiter = new RateLimiter({
			requestsPerMinute: 50,
			maxRetries: 3,
			maxConcurrent: 5,
		});
		this.model = 'claude-sonnet-4-5-20250929'; // Sonnet 4.5 for speed + quality balance
	}

	/**
	 * Generate test file from source code
	 */
	async generateTest(options: GenerateTestOptions): Promise<GenerateTestResult> {
		const systemPrompt = this.buildSystemPrompt();
		const userPrompt = this.buildUserPrompt(options);

		const result = await this.rateLimiter.withRetry(async () => {
			const response = await this.client.messages.create({
				model: options.model ?? this.model,
				max_tokens: options.maxTokens ?? 8000,
				temperature: options.temperature ?? 0, // 0 for consistency
				system: systemPrompt,
				messages: [
					{
						role: 'user',
						content: userPrompt,
					},
				],
			});

			const content = response.content[0];
			if (content.type !== 'text') {
				throw new Error('Unexpected response format from Claude API');
			}

			return {
				testCode: this.extractCodeFromResponse(content.text),
				tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
				model: response.model,
			};
		}, `Generate test for ${options.sourceFilePath}`);

		return result;
	}

	/**
	 * Build system prompt with test generation instructions
	 */
	private buildSystemPrompt(): string {
		return `You are an expert TypeScript test engineer specializing in NestJS backend testing.

Your task is to generate comprehensive, production-quality test files that:
- Follow NestJS testing patterns exactly
- Achieve 80%+ code coverage
- Test happy paths AND error scenarios
- Mock all external dependencies properly
- Include multi-tenant isolation tests
- Use proper TypeScript types (ZERO any types)
- Are immediately runnable without modifications

Key Requirements:
1. Test Structure: Use describe/it blocks with clear test names
2. Mocking: Use jest.Mocked<T> for type-safe mocks
3. Coverage: Test all public methods + edge cases
4. Error Handling: Test all error scenarios (NotFound, Conflict, BadRequest, etc.)
5. Multi-Tenant: Verify dealerId isolation in all operations
6. Performance: Include basic performance tests where applicable
7. Type Safety: No any types, proper interfaces, type guards

Code Quality Standards:
- Descriptive test names: "should throw NotFoundException when user not found"
- Clear arrange/act/assert structure
- Minimal but complete mocking (don't mock what you don't need)
- Test behavior, not implementation details

Output Format:
- Return ONLY the complete test file code
- No explanations, no markdown formatting
- Include all necessary imports
- Follow the template structure provided`;
	}

	/**
	 * Build user prompt with source code and template
	 */
	private buildUserPrompt(options: GenerateTestOptions): string {
		return `Generate a comprehensive test file for this TypeScript source file:

File Path: ${options.sourceFilePath}

Source Code:
\`\`\`typescript
${options.sourceCode}
\`\`\`

Template to Follow:
\`\`\`typescript
${options.testTemplate}
\`\`\`

Instructions:
1. Analyze the source code to identify:
   - All public methods that need testing
   - Dependencies that need mocking
   - Error scenarios to test
   - Multi-tenant considerations (dealerId filtering)

2. Generate tests that cover:
   - Initialization (dependency injection)
   - Core functionality (all CRUD operations)
   - Error handling (NotFound, Conflict, validation errors)
   - Multi-tenant isolation (prevent cross-dealer access)
   - Edge cases (null inputs, empty arrays, boundary values)

3. Follow the template structure:
   - Section 1: Initialization
   - Section 2: Core functionality (one describe per method)
   - Section 3: Error handling
   - Section 4: Multi-tenant isolation
   - Section 5: Performance (if applicable)

4. Quality requirements:
   - 80%+ coverage target
   - Type-safe mocks using jest.Mocked<T>
   - Descriptive test names
   - No any types
   - Proper imports

Output the complete test file code now:`;
	}

	/**
	 * Extract code from Claude's response (remove markdown if present)
	 */
	private extractCodeFromResponse(response: string): string {
		// Remove markdown code blocks if present
		let code = response.trim();

		// Remove ```typescript or ```ts at start
		code = code.replace(/^```(?:typescript|ts)?\n/i, '');

		// Remove ``` at end
		code = code.replace(/\n```\s*$/i, '');

		return code;
	}

	/**
	 * Estimate cost for test generation
	 */
	estimateCost(sourceCodeLength: number, numFiles: number): { inputTokens: number; outputTokens: number; estimatedCost: number } {
		// Rough estimates:
		// - Input: Source code + template + prompt (~10k-30k tokens per file)
		// - Output: Test file (~2k-4k tokens)
		const avgInputTokensPerFile = Math.ceil(sourceCodeLength / 4) + 10000; // ~4 chars per token
		const avgOutputTokensPerFile = 3000;

		const totalInputTokens = avgInputTokensPerFile * numFiles;
		const totalOutputTokens = avgOutputTokensPerFile * numFiles;

		// Claude Sonnet 4.5 pricing (as of 2026-01):
		// - Input: $0.003 per 1k tokens
		// - Output: $0.015 per 1k tokens
		const inputCost = (totalInputTokens / 1000) * 0.003;
		const outputCost = (totalOutputTokens / 1000) * 0.015;

		return {
			inputTokens: totalInputTokens,
			outputTokens: totalOutputTokens,
			estimatedCost: inputCost + outputCost,
		};
	}
}

/**
 * AWS Bedrock Client for Test Generation
 *
 * Alternative to Anthropic API - uses AWS Bedrock Runtime
 * Requires: source ~/git/creds-nonprod.sh (or creds-prod.sh)
 */

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
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

export class BedrockClient {
	private client: BedrockRuntimeClient;
	private rateLimiter: RateLimiter;
	private model: string;

	constructor(region: string = 'us-east-1') {
		// AWS SDK will automatically use credentials from environment
		// (set via source ~/git/creds-nonprod.sh)
		this.client = new BedrockRuntimeClient({ region });

		this.rateLimiter = new RateLimiter({
			requestsPerMinute: 50,
			maxRetries: 3,
			maxConcurrent: 5,
		});

		// Use application-specific inference profile ARN (not foundation model ID)
		// Cross-region inference profiles (us.*) are blocked by SCP
		// Pattern from: illuminizer/src/services/coxAi/modelMapping.ts
		this.model = 'arn:aws:bedrock:us-east-1:247721768464:application-inference-profile/pzxu78pafm8x';
	}

	/**
	 * Generate test file from source code using Bedrock
	 */
	async generateTest(options: GenerateTestOptions): Promise<GenerateTestResult> {
		const systemPrompt = this.buildSystemPrompt();
		const userPrompt = this.buildUserPrompt(options);

		const result = await this.rateLimiter.withRetry(async () => {
			// Bedrock request format (different from Anthropic API)
			const payload = {
				anthropic_version: 'bedrock-2023-05-31',
				max_tokens: options.maxTokens ?? 8000,
				temperature: options.temperature ?? 0,
				system: systemPrompt,
				messages: [
					{
						role: 'user',
						content: userPrompt,
					},
				],
			};

			const command = new InvokeModelCommand({
				modelId: options.model ?? this.model,
				contentType: 'application/json',
				accept: 'application/json',
				body: JSON.stringify(payload),
			});

			const response = await this.client.send(command);

			// Parse Bedrock response
			const responseBody = JSON.parse(new TextDecoder().decode(response.body));

			if (!responseBody.content || responseBody.content.length === 0) {
				throw new Error('Empty response from Bedrock');
			}

			const content = responseBody.content[0];
			if (content.type !== 'text') {
				throw new Error('Unexpected response format from Bedrock');
			}

			return {
				testCode: this.extractCodeFromResponse(content.text),
				tokensUsed: responseBody.usage.input_tokens + responseBody.usage.output_tokens,
				model: this.model,
			};
		}, `Generate test for ${options.sourceFilePath}`);

		return result;
	}

	/**
	 * Build system prompt (same as Anthropic client)
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
	 * Build user prompt (same as Anthropic client)
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
	 * Extract code from response (same as Anthropic client)
	 */
	private extractCodeFromResponse(response: string): string {
		let code = response.trim();
		code = code.replace(/^```(?:typescript|ts)?\n/i, '');
		code = code.replace(/\n```\s*$/i, '');
		return code;
	}

	/**
	 * Estimate cost for Bedrock (different pricing than Anthropic API)
	 */
	estimateCost(sourceCodeLength: number, numFiles: number): { inputTokens: number; outputTokens: number; estimatedCost: number } {
		const avgInputTokensPerFile = Math.ceil(sourceCodeLength / 4) + 10000;
		const avgOutputTokensPerFile = 3000;

		const totalInputTokens = avgInputTokensPerFile * numFiles;
		const totalOutputTokens = avgOutputTokensPerFile * numFiles;

		// Bedrock pricing for Claude Sonnet 4 (as of 2026-01):
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

/**
 * File System Utilities for Test Generation
 *
 * Handles reading source files, writing test files, and directory management.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { glob } from 'glob';

export interface SourceFile {
	absolutePath: string;
	relativePath: string;
	content: string;
	serviceName: string;
	fileName: string;
}

export interface TestFile {
	sourcePath: string;
	testPath: string;
	content: string;
	serviceName: string;
}

export class FileUtils {
	private projectRoot: string;

	constructor(projectRoot: string) {
		this.projectRoot = projectRoot;
	}

	/**
	 * Find all source files in a service that need tests
	 */
	async findSourceFiles(serviceName: string): Promise<SourceFile[]> {
		const serviceDir = path.join(this.projectRoot, 'apps/backend', serviceName);

		// Check if service exists
		try {
			await fs.access(serviceDir);
		} catch {
			throw new Error(`Service not found: ${serviceName}`);
		}

		// Find TypeScript files that need tests
		const patterns = [
			`${serviceDir}/src/**/*.service.ts`,
			`${serviceDir}/src/**/*.controller.ts`,
			`${serviceDir}/src/**/*.repository.ts`,
			`${serviceDir}/src/**/*.dto.ts`,
		];

		// Exclude files that shouldn't be tested
		const excludePatterns = [
			'**/*.module.ts',
			'**/main.ts',
			'**/index.ts',
			'**/*.spec.ts',
			'**/*.test.ts',
		];

		const sourceFiles: SourceFile[] = [];

		for (const pattern of patterns) {
			const files = await glob(pattern, {
				ignore: excludePatterns,
				absolute: true,
			});

			for (const filePath of files) {
				try {
					const content = await fs.readFile(filePath, 'utf-8');
					const relativePath = path.relative(this.projectRoot, filePath);
					const fileName = path.basename(filePath);

					sourceFiles.push({
						absolutePath: filePath,
						relativePath,
						content,
						serviceName,
						fileName,
					});
				} catch (error) {
					console.error(`[FileUtils] Failed to read ${filePath}:`, error);
				}
			}
		}

		return sourceFiles;
	}

	/**
	 * Find a specific source file
	 */
	async findSourceFile(filePath: string): Promise<SourceFile> {
		const absolutePath = path.isAbsolute(filePath)
			? filePath
			: path.join(this.projectRoot, filePath);

		try {
			const content = await fs.readFile(absolutePath, 'utf-8');
			const relativePath = path.relative(this.projectRoot, absolutePath);
			const fileName = path.basename(absolutePath);

			// Extract service name from path (apps/backend/SERVICE_NAME/...)
			const serviceMatch = relativePath.match(/apps\/backend\/([^\/]+)/);
			const serviceName = serviceMatch ? serviceMatch[1] : 'unknown';

			return {
				absolutePath,
				relativePath,
				content,
				serviceName,
				fileName,
			};
		} catch (error) {
			throw new Error(`Failed to read source file ${filePath}: ${error}`);
		}
	}

	/**
	 * Get test file path for a source file
	 */
	getTestFilePath(sourceFile: SourceFile): string {
		const { absolutePath, serviceName } = sourceFile;

		// Convert src/ to test/
		// Example: apps/backend/promo-service/src/promos/promo.service.ts
		//       -> apps/backend/promo-service/test/promos/promo.service.spec.ts

		const relativePath = path.relative(
			path.join(this.projectRoot, 'apps/backend', serviceName),
			absolutePath
		);

		// Replace src/ with test/ and .ts with .spec.ts
		const testRelativePath = relativePath
			.replace(/^src\//, 'test/')
			.replace(/\.ts$/, '.spec.ts');

		return path.join(
			this.projectRoot,
			'apps/backend',
			serviceName,
			testRelativePath
		);
	}

	/**
	 * Check if test file already exists
	 */
	async testFileExists(sourceFile: SourceFile): Promise<boolean> {
		const testPath = this.getTestFilePath(sourceFile);
		try {
			await fs.access(testPath);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Write test file with proper directory creation
	 */
	async writeTestFile(testFile: TestFile): Promise<void> {
		const { testPath, content } = testFile;

		// Ensure directory exists
		const dir = path.dirname(testPath);
		await fs.mkdir(dir, { recursive: true });

		// Write file
		await fs.writeFile(testPath, content, 'utf-8');
	}

	/**
	 * Read test template
	 */
	async readTestTemplate(): Promise<string> {
		const templatePath = path.join(this.projectRoot, 'templates/backend-service-test.template.ts');

		try {
			return await fs.readFile(templatePath, 'utf-8');
		} catch {
			throw new Error(
				`Test template not found at ${templatePath}. ` +
				'Please ensure Story 19.3 is complete and template exists.'
			);
		}
	}

	/**
	 * Find all backend services
	 */
	async findAllServices(): Promise<string[]> {
		const backendDir = path.join(this.projectRoot, 'apps/backend');
		const entries = await fs.readdir(backendDir, { withFileTypes: true });

		return entries
			.filter(entry => entry.isDirectory())
			.map(entry => entry.name)
			.filter(name => !name.startsWith('.'));
	}

	/**
	 * Validate service exists
	 */
	async serviceExists(serviceName: string): Promise<boolean> {
		const serviceDir = path.join(this.projectRoot, 'apps/backend', serviceName);
		try {
			await fs.access(serviceDir);
			return true;
		} catch {
			return false;
		}
	}
}

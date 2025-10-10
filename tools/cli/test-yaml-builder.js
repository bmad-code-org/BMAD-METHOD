/**
 * Test script for YAML → XML agent builder
 * Usage: node tools/cli/test-yaml-builder.js
 */

const path = require('node:path');
const { YamlXmlBuilder } = require('./lib/yaml-xml-builder');
const { getProjectRoot } = require('./lib/project-root');

async function test() {
  console.log('Testing YAML → XML Agent Builder\n');

  const builder = new YamlXmlBuilder();
  const projectRoot = getProjectRoot();

  // Paths
  const agentYamlPath = path.join(projectRoot, 'src/modules/bmm/agents/pm.agent.yaml');
  const outputPath = path.join(projectRoot, 'test-output-pm.md');

  console.log(`Source: ${agentYamlPath}`);
  console.log(`Output: ${outputPath}\n`);

  try {
    const result = await builder.buildAgent(
      agentYamlPath,
      null, // No customize file for this test
      outputPath,
      { includeMetadata: true },
    );

    console.log('✓ Build successful!');
    console.log(`  Output: ${result.outputPath}`);
    console.log(`  Source hash: ${result.sourceHash}`);
    console.log('\nGenerated XML file at:', outputPath);
    console.log('Review the output to verify correctness.\n');
  } catch (error) {
    console.error('✗ Build failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

test();

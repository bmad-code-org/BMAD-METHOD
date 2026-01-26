/**
 * Unit Tests for Agent Schema Edge Cases
 *
 * Tests internal functions to achieve 100% branch coverage
 */

const { validateAgentFile } = require('../tools/schema/agent.js');

console.log('Running edge case unit tests...\n');

let passed = 0;
let failed = 0;

// Test 1: Path with malformed module structure (no slash after module name)
// This tests line 213: slashIndex === -1
console.log('Test 1: Malformed module path (no slash after module name)');
try {
  const result = validateAgentFile('src/bmm', {
    agent: {
      metadata: {
        id: 'test',
        name: 'Test',
        title: 'Test',
        icon: '🧪',
      },
      persona: {
        role: 'Test',
        identity: 'Test',
        communication_style: 'Test',
        principles: ['Test'],
      },
      menu: [{ trigger: 'help', description: 'Help', action: 'help' }],
    },
  });

  if (result.success) {
    console.log('✗ Should have failed - missing module field');
    failed++;
  } else {
    console.log('✓ Correctly handled malformed path (treated as core agent)');
    passed++;
  }
} catch (error) {
  console.log('✗ Unexpected error:', error.message);
  failed++;
}
console.log('');

// Test 2: Module option with empty string
// This tests line 222: trimmed.length > 0
console.log('Test 2: Module agent with empty string in module field');
try {
  const result = validateAgentFile('src/bmm/agents/test.agent.yaml', {
    agent: {
      metadata: {
        id: 'test',
        name: 'Test',
        title: 'Test',
        icon: '🧪',
        module: '   ', // Empty after trimming
      },
      persona: {
        role: 'Test',
        identity: 'Test',
        communication_style: 'Test',
        principles: ['Test'],
      },
      menu: [{ trigger: 'help', description: 'Help', action: 'help' }],
    },
  });

  if (result.success) {
    console.log('✗ Should have failed - empty module string');
    failed++;
  } else {
    console.log('✓ Correctly rejected empty module string');
    passed++;
  }
} catch (error) {
  console.log('✗ Unexpected error:', error.message);
  failed++;
}
console.log('');

// Test 3: Core agent path (src/core/agents/...) - tests the !filePath.startsWith(marker) branch
console.log('Test 3: Core agent path returns null for module');
try {
  const result = validateAgentFile('src/core/agents/test.agent.yaml', {
    agent: {
      metadata: {
        id: 'test',
        name: 'Test',
        title: 'Test',
        icon: '🧪',
        // No module field - correct for core agent
      },
      persona: {
        role: 'Test',
        identity: 'Test',
        communication_style: 'Test',
        principles: ['Test'],
      },
      menu: [{ trigger: 'help', description: 'Help', action: 'help' }],
    },
  });

  if (result.success) {
    console.log('✓ Core agent validated correctly (no module required)');
    passed++;
  } else {
    console.log('✗ Core agent should pass without module field');
    failed++;
  }
} catch (error) {
  console.log('✗ Unexpected error:', error.message);
  failed++;
}
console.log('');

// Summary
console.log('═══════════════════════════════════════');
console.log('Edge Case Unit Test Results:');
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
console.log('═══════════════════════════════════════\n');

if (failed === 0) {
  console.log('✨ All edge case tests passed!\n');
  process.exit(0);
} else {
  console.log('❌ Some edge case tests failed\n');
  process.exit(1);
}

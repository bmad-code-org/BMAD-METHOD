/**
 * Simple test runner for markdown formatting tests
 * Since the project uses a custom test setup, this provides basic test execution
 */

const fs = require('fs-extra');
const path = require('node:path');

// Mock Jest functions for basic testing
const describe = (name, fn) => {
  console.log(`\n📋 ${name}`);
  fn();
};

const test = (name, fn) => {
  try {
    fn();
    console.log(`  ✅ ${name}`);
  } catch (error) {
    console.log(`  ❌ ${name}`);
    console.log(`     Error: ${error.message}`);
  }
};

const expect = (actual) => ({
  toBe: (expected) => {
    if (actual !== expected) {
      throw new Error(`Expected ${expected}, got ${actual}`);
    }
  },
  toBeGreaterThan: (expected) => {
    if (actual <= expected) {
      throw new Error(`Expected ${actual} to be greater than ${expected}`);
    }
  },
});

const beforeAll = (fn) => fn();
const afterAll = (fn) => fn();

// Load and run the tests
globalThis.describe = describe;
globalThis.test = test;
globalThis.expect = expect;
globalThis.beforeAll = beforeAll;
globalThis.afterAll = afterAll;

// Set up jest globals
globalThis.jest = {
  globals: { describe, test, expect, beforeAll, afterAll },
};

console.log('🧪 Running Markdown Formatting Detection Tests\n');

// Load the test file
require('./markdown-formatting-tests.js');

console.log('\n✨ Test execution completed');

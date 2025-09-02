/**
 * TDD RED Phase - Calculator Basic Operations Tests
 * Story: 1.1 Calculator Basic Operations
 * 
 * These tests are written BEFORE implementation following TDD methodology.
 * All tests should FAIL initially as no implementation exists yet.
 */

const Calculator = require('../src/calculator');

describe('Calculator Basic Operations', () => {
  let calculator;

  beforeEach(() => {
    // Given: Fresh calculator instance for each test
    calculator = new Calculator();
  });

  describe('Addition operations (CB-001)', () => {
    it('should add two positive numbers correctly', () => {
      // Given: Two positive numbers
      const a = 5;
      const b = 3;
      
      // When: I add them together
      const result = calculator.add(a, b);
      
      // Then: The result should be their sum
      expect(result).toBe(8);
    });

    it('should add negative numbers correctly', () => {
      // Given: Two negative numbers
      const a = -5;
      const b = -3;
      
      // When: I add them together
      const result = calculator.add(a, b);
      
      // Then: The result should be their sum
      expect(result).toBe(-8);
    });

    it('should add positive and negative numbers correctly', () => {
      // Given: One positive and one negative number
      const a = 10;
      const b = -3;
      
      // When: I add them together
      const result = calculator.add(a, b);
      
      // Then: The result should be their sum
      expect(result).toBe(7);
    });

    it('should handle decimal addition correctly', () => {
      // Given: Two decimal numbers
      const a = 0.1;
      const b = 0.2;
      
      // When: I add them together
      const result = calculator.add(a, b);
      
      // Then: The result should be properly rounded
      expect(result).toBeCloseTo(0.3, 10);
    });
  });

  describe('Subtraction operations (CB-002)', () => {
    it('should subtract two positive numbers correctly', () => {
      // Given: Two positive numbers
      const a = 10;
      const b = 3;
      
      // When: I subtract b from a
      const result = calculator.subtract(a, b);
      
      // Then: The result should be their difference
      expect(result).toBe(7);
    });

    it('should handle negative results in subtraction', () => {
      // Given: Larger second number
      const a = 3;
      const b = 10;
      
      // When: I subtract b from a
      const result = calculator.subtract(a, b);
      
      // Then: The result should be negative
      expect(result).toBe(-7);
    });

    it('should handle decimal subtraction correctly', () => {
      // Given: Two decimal numbers
      const a = 0.3;
      const b = 0.1;
      
      // When: I subtract b from a
      const result = calculator.subtract(a, b);
      
      // Then: The result should be properly rounded
      expect(result).toBeCloseTo(0.2, 10);
    });
  });

  describe('Multiplication operations (CB-003)', () => {
    it('should multiply two positive numbers correctly', () => {
      // Given: Two positive numbers
      const a = 4;
      const b = 6;
      
      // When: I multiply them
      const result = calculator.multiply(a, b);
      
      // Then: The result should be their product
      expect(result).toBe(24);
    });

    it('should handle multiplication by zero', () => {
      // Given: A number and zero
      const a = 5;
      const b = 0;
      
      // When: I multiply them
      const result = calculator.multiply(a, b);
      
      // Then: The result should be zero
      expect(result).toBe(0);
    });

    it('should handle negative multiplication', () => {
      // Given: One positive and one negative number
      const a = -3;
      const b = 4;
      
      // When: I multiply them
      const result = calculator.multiply(a, b);
      
      // Then: The result should be negative
      expect(result).toBe(-12);
    });

    it('should handle decimal multiplication correctly', () => {
      // Given: Two decimal numbers
      const a = 0.1;
      const b = 0.3;
      
      // When: I multiply them
      const result = calculator.multiply(a, b);
      
      // Then: The result should be properly rounded
      expect(result).toBeCloseTo(0.03, 10);
    });
  });

  describe('Division operations (CB-004)', () => {
    it('should divide two positive numbers correctly', () => {
      // Given: Two positive numbers
      const a = 15;
      const b = 3;
      
      // When: I divide a by b
      const result = calculator.divide(a, b);
      
      // Then: The result should be their quotient
      expect(result).toBe(5);
    });

    it('should handle decimal division correctly', () => {
      // Given: Two numbers that create decimal result
      const a = 1;
      const b = 3;
      
      // When: I divide a by b
      const result = calculator.divide(a, b);
      
      // Then: The result should be properly rounded
      expect(result).toBeCloseTo(0.3333333333, 10);
    });

    it('should handle negative division', () => {
      // Given: One positive and one negative number
      const a = -15;
      const b = 3;
      
      // When: I divide a by b
      const result = calculator.divide(a, b);
      
      // Then: The result should be negative
      expect(result).toBe(-5);
    });
  });

  describe('Division by zero error handling (CB-005)', () => {
    it('should throw error when dividing by zero', () => {
      // Given: A number and zero as divisor
      const a = 10;
      const b = 0;
      
      // When & Then: Division by zero should throw an error
      expect(() => {
        calculator.divide(a, b);
      }).toThrow('Cannot divide by zero');
    });

    it('should throw error when dividing zero by zero', () => {
      // Given: Zero divided by zero
      const a = 0;
      const b = 0;
      
      // When & Then: Division should throw an error
      expect(() => {
        calculator.divide(a, b);
      }).toThrow('Cannot divide by zero');
    });
  });

  describe('Invalid input handling (CB-006)', () => {
    it('should throw error for non-numeric input in addition', () => {
      // Given: Non-numeric input
      const a = 'not a number';
      const b = 5;
      
      // When & Then: Should throw error for invalid input
      expect(() => {
        calculator.add(a, b);
      }).toThrow('Invalid input: numbers required');
    });

    it('should throw error for undefined input in subtraction', () => {
      // Given: Undefined input
      const a = undefined;
      const b = 5;
      
      // When & Then: Should throw error for invalid input
      expect(() => {
        calculator.subtract(a, b);
      }).toThrow('Invalid input: numbers required');
    });

    it('should throw error for null input in multiplication', () => {
      // Given: Null input
      const a = null;
      const b = 5;
      
      // When & Then: Should throw error for invalid input
      expect(() => {
        calculator.multiply(a, b);
      }).toThrow('Invalid input: numbers required');
    });

    it('should throw error for NaN input in division', () => {
      // Given: NaN input
      const a = NaN;
      const b = 5;
      
      // When & Then: Should throw error for invalid input
      expect(() => {
        calculator.divide(a, b);
      }).toThrow('Invalid input: numbers required');
    });
  });

  describe('Performance requirements (CB-008)', () => {
    it('should complete operations in under 1ms', () => {
      // Given: Performance measurement setup
      const iterations = 1000;
      const startTime = process.hrtime.bigint();
      
      // When: Performing many operations
      for (let i = 0; i < iterations; i++) {
        calculator.add(1, 2);
        calculator.subtract(5, 3);
        calculator.multiply(2, 4);
        calculator.divide(8, 2);
      }
      
      const endTime = process.hrtime.bigint();
      const avgTimeMs = Number(endTime - startTime) / 1000000 / iterations;
      
      // Then: Average time should be under 1ms
      expect(avgTimeMs).toBeLessThan(1);
    });
  });
});

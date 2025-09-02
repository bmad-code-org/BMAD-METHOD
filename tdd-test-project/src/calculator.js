/**
 * TDD REFACTOR Phase - Calculator Implementation
 * Story: 1.1 Calculator Basic Operations
 * 
 * Refactored for better readability and maintainability
 * while keeping all tests green.
 */

class Calculator {
  // Error message constants for consistency
  static INVALID_INPUT_ERROR = 'Invalid input: numbers required';
  static DIVISION_BY_ZERO_ERROR = 'Cannot divide by zero';
  /**
   * Constructor for Calculator class
   */
  constructor() {
    // No initialization needed for basic operations
  }

  /**
   * Validates that inputs are valid numbers
   * @param {*} a - First input
   * @param {*} b - Second input
   * @throws {Error} If inputs are not valid numbers
   */
  _validateInputs(a, b) {
    if (!this._isValidNumber(a) || !this._isValidNumber(b)) {
      throw new Error(Calculator.INVALID_INPUT_ERROR);
    }
  }

  /**
   * Checks if a value is a valid number
   * @param {*} value - Value to check
   * @returns {boolean} True if value is a valid number
   */
  _isValidNumber(value) {
    return typeof value === 'number' && 
           !Number.isNaN(value) && 
           value !== null && 
           value !== undefined;
  }

  /**
   * Validates that divisor is not zero
   * @param {number} divisor - The divisor value
   * @throws {Error} If divisor is zero
   */
  _validateNotZeroDivisor(divisor) {
    if (divisor === 0) {
      throw new Error(Calculator.DIVISION_BY_ZERO_ERROR);
    }
  }

  /**
   * Add two numbers
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Sum of a and b
   * @throws {Error} If inputs are not valid numbers
   */
  add(a, b) {
    this._validateInputs(a, b);
    return a + b;
  }

  /**
   * Subtract second number from first number
   * @param {number} a - First number (minuend)
   * @param {number} b - Second number (subtrahend)
   * @returns {number} Difference of a and b
   * @throws {Error} If inputs are not valid numbers
   */
  subtract(a, b) {
    this._validateInputs(a, b);
    return a - b;
  }

  /**
   * Multiply two numbers
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Product of a and b
   * @throws {Error} If inputs are not valid numbers
   */
  multiply(a, b) {
    this._validateInputs(a, b);
    return a * b;
  }

  /**
   * Divide first number by second number
   * @param {number} a - First number (dividend)
   * @param {number} b - Second number (divisor)
   * @returns {number} Quotient of a and b
   * @throws {Error} If inputs are not valid numbers or b is zero
   */
  divide(a, b) {
    this._validateInputs(a, b);
    this._validateNotZeroDivisor(b);
    
    return a / b;
  }
}

module.exports = Calculator;

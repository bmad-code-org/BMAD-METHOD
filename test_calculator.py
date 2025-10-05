"""
Unit tests for Calculator class - TDD approach
Testing AC-001: Calculator Add Function
"""

import unittest
from calculator import Calculator


class TestCalculatorAdd(unittest.TestCase):
    """Test suite for Calculator.add method"""

    def test_add_positive_integers(self):
        """TC-001: Test add with positive integers"""
        calc = Calculator()
        result = calc.add(2, 3)
        self.assertEqual(result, 5, f"Expected 2 + 3 = 5, but got {result}")

    def test_add_negative_numbers(self):
        """TC-002: Test add with negative numbers"""
        calc = Calculator()
        result = calc.add(-5, 3)
        self.assertEqual(result, -2, f"Expected -5 + 3 = -2, but got {result}")

    def test_add_floats(self):
        """TC-003: Test add with floats"""
        calc = Calculator()
        result = calc.add(1.5, 2.5)
        self.assertEqual(result, 4.0, f"Expected 1.5 + 2.5 = 4.0, but got {result}")

    def test_add_zeros(self):
        """TC-009: Test add with zero"""
        calc = Calculator()
        result = calc.add(0, 0)
        self.assertEqual(result, 0, f"Expected 0 + 0 = 0, but got {result}")

    def test_add_mixed_sign(self):
        """Test add with mixed positive and negative"""
        calc = Calculator()
        result = calc.add(10, -7)
        self.assertEqual(result, 3, f"Expected 10 + (-7) = 3, but got {result}")

    def test_add_large_numbers(self):
        """Test add with large numbers"""
        calc = Calculator()
        result = calc.add(1000000, 2000000)
        self.assertEqual(result, 3000000, f"Expected 1000000 + 2000000 = 3000000, but got {result}")

    def test_add_decimal_precision(self):
        """Test add maintains decimal precision"""
        calc = Calculator()
        result = calc.add(0.1, 0.2)
        self.assertAlmostEqual(result, 0.3, places=4, msg=f"Expected 0.1 + 0.2 ≈ 0.3, but got {result}")


class TestCalculatorSubtract(unittest.TestCase):
    """Test suite for Calculator.subtract method"""

    def test_subtract_positive_integers(self):
        """TC-004: Test subtract with positive integers"""
        calc = Calculator()
        result = calc.subtract(10, 3)
        self.assertEqual(result, 7, f"Expected 10 - 3 = 7, but got {result}")

    def test_subtract_resulting_negative(self):
        """TC-005: Test subtract resulting in negative"""
        calc = Calculator()
        result = calc.subtract(3, 10)
        self.assertEqual(result, -7, f"Expected 3 - 10 = -7, but got {result}")

    def test_subtract_floats(self):
        """TC-006: Test subtract with floats"""
        calc = Calculator()
        result = calc.subtract(5.5, 2.5)
        self.assertEqual(result, 3.0, f"Expected 5.5 - 2.5 = 3.0, but got {result}")

    def test_subtract_same_numbers(self):
        """TC-010: Test subtract with same numbers"""
        calc = Calculator()
        result = calc.subtract(5, 5)
        self.assertEqual(result, 0, f"Expected 5 - 5 = 0, but got {result}")

    def test_subtract_from_zero(self):
        """Test subtract from zero"""
        calc = Calculator()
        result = calc.subtract(0, 10)
        self.assertEqual(result, -10, f"Expected 0 - 10 = -10, but got {result}")

    def test_subtract_zero(self):
        """Test subtract zero from number"""
        calc = Calculator()
        result = calc.subtract(10, 0)
        self.assertEqual(result, 10, f"Expected 10 - 0 = 10, but got {result}")

    def test_subtract_large_numbers(self):
        """Test subtract with large numbers"""
        calc = Calculator()
        result = calc.subtract(1000000, 999999)
        self.assertEqual(result, 1, f"Expected 1000000 - 999999 = 1, but got {result}")


if __name__ == '__main__':
    unittest.main()
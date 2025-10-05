"""
Calculator module for basic arithmetic operations.

This module provides a Calculator class with methods for performing
basic arithmetic operations. Developed using Test-Driven Development (TDD)
methodology with strict RED-GREEN-REFACTOR cycles.
"""


class Calculator:
    """A simple calculator class for basic arithmetic operations."""

    def add(self, a: float, b: float) -> float:
        """
        Add two numbers and return the result.

        Args:
            a: First number
            b: Second number

        Returns:
            The sum of a and b
        """
        return a + b

    def subtract(self, a: float, b: float) -> float:
        """
        Subtract the second number from the first and return the result.

        Args:
            a: First number (minuend)
            b: Second number (subtrahend)

        Returns:
            The difference of a and b (a - b)
        """
        return a - b
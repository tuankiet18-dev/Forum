import math

from sympy import symbols, solve, diff, integrate, simplify
from sympy import Symbol, sin, cos, tan, cot, sec, csc, asin, acos, atan, log, exp, sqrt, Abs, floor, ceiling, pi, E, oo, zoo, I, nan, Integer
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application

import numpy as np
import statistics

import signal


class Calculator:
    def __init__(self, timeout: int = 2):
        self.timeout = timeout
        self.allowed_funcs = {
            "abs": abs,
            "round": round,
            "pow": pow,
            **{k: v for k, v in math.__dict__.items() if not k.startswith("___")}
        }
    
    def evaluate(self, expression: str) -> float:
        """
        Evaluate a numeric math expression safely
        Example: "sqrt(16) + log(10)"
        """
        try:

            result = eval(
                expression,
                {"__builtins__": {}},
                self.allowed_funcs
            )
            if not isinstance(result, (int, float)):
                raise ValueError("Result is not a real number")
            return float(result)
        
        except Exception as e:
            raise ValueError(f"Calculation error: {e}")
        
class EquationSolver:
    def __init__(self):
        self.transformations = (standard_transformations + (implicit_multiplication_application,))
        self.safe_locals = {
            'sin': sin, 'cos': cos, 'tan': tan, 'cot': cot, 'sec': sec, 'csc': csc,
            'asin': asin, 'acos': acos, 'atan': atan,
            'log': log, 'exp': exp, 'sqrt': sqrt, 'abs': Abs, 'floor': floor, 'ceiling': ceiling,
            'pi': pi, 'E': E, 'oo': oo, 'zoo': zoo, 'I': I, 'nan': nan, 'Integer': Integer
            # Additional functions can be added here if needed, ensuring they are safe mathematical operations.
        }
    def _normalize_equation(self, eq: str) -> str:
        """
        Convert 'LHS = RHS' → '(LHS) - (RHS)'
        """
        eq = eq.strip()
        if "=" in eq:
            if eq.count("=") != 1:
                raise ValueError("Equation must contain exactly one '='")
            lhs, rhs = eq.split("=")
            return f"({lhs})-({rhs})"
        return eq
    def solve_equation(self, equation: str, var: str):
        """
        Solve equation like: "x**2 - 4"
        """
        x = symbols(var)
        local_dict = self.safe_locals.copy()
        local_dict[var] = x

        try:
            equation = self._normalize_equation(equation)
            expr = parse_expr(
                equation,
                local_dict=local_dict,
                transformations=self.transformations,
                global_dict={}
            )
            return solve(expr, x)
        except Exception as e:
            raise ValueError(f"Error solving equation: {e}")

    def solve_system(self, equations: list[str], vars: list[str]):
        """
        Solve system of equations
        """
        syms = symbols(' '.join(vars))
        local_dict = self.safe_locals.copy()

        if isinstance(syms, tuple):
            for s in syms:
                local_dict[str(s)] = s
        else:
            local_dict[str(syms)] = syms

        try:
            eqs = [
                parse_expr(
                    self._normalize_equation(eq),
                    local_dict=local_dict,
                    transformations=self.transformations,
                    global_dict={}
                )
                for eq in equations
            ]
            return solve(eqs, syms)
        except Exception as e:
            raise ValueError(f"Error solving system: {e}")
        
class SymbolicMath:
    def __init__(self):
        self.transformations = (standard_transformations + (implicit_multiplication_application,))
        self.safe_locals = {
            'sin': sin, 'cos': cos, 'tan': tan, 'cot': cot, 'sec': sec, 'csc': csc,
            'asin': asin, 'acos': acos, 'atan': atan,
            'log': log, 'exp': exp, 'sqrt': sqrt, 'abs': Abs, 'floor': floor, 'ceiling': ceiling,
            'pi': pi, 'E': E, 'oo': oo, 'zoo': zoo, 'I': I, 'nan': nan, 'Integer': Integer, 'Symbol': Symbol,
            # Additional functions can be added here if needed, ensuring they are safe mathematical operations.
        }

    def derivative(self, expr: str, var: str):
        x = symbols(var)
        local_dict = self.safe_locals.copy()
        local_dict[var] = x
        try:
            parsed_expr = parse_expr(expr, local_dict=local_dict, transformations=self.transformations, global_dict={})
            return diff(parsed_expr, x)
        except Exception as e:
            raise ValueError(f"Error computing derivative: {e}")

    def integral(self, expr: str, var: str):
        x = symbols(var)
        local_dict = self.safe_locals.copy()
        local_dict[var] = x
        try:
            parsed_expr = parse_expr(expr, local_dict=local_dict, transformations=self.transformations, global_dict={})
            return integrate(parsed_expr, x)
        except Exception as e:
            raise ValueError(f"Error computing integral: {e}")

    def simplify_expr(self, expr: str):
        local_dict = self.safe_locals.copy()
        try:
            parsed_expr = parse_expr(expr, local_dict=local_dict, transformations=self.transformations, global_dict={})
            return simplify(parsed_expr)
        except Exception as e:
            raise ValueError(f"Error simplifying expression: {e}")
        
class MatrixTool:
    def add(self, A, B):
        return np.add(A, B)

    def multiply(self, A, B):
        return np.matmul(A, B)

    def determinant(self, A):
        return np.linalg.det(A)

    def inverse(self, A):
        return np.linalg.inv(A)

    def eigen(self, A):
        return np.linalg.eig(A)

class StatisticsTool:
    def mean(self, data):
        return statistics.mean(data)

    def median(self, data):
        return statistics.median(data)

    def variance(self, data):
        return statistics.variance(data)

    def std(self, data):
        return statistics.stdev(data)

    def probability(self, favorable, total):
        return favorable / total

    def normal_pdf(self, x, mu=0, sigma=1):
        return (1 / (sigma * math.sqrt(2 * math.pi))) * \
               math.exp(-0.5 * ((x - mu) / sigma) ** 2)
from .math_tools import Calculator, EquationSolver, SymbolicMath, MatrixTool, StatisticsTool
from .preprocessing_tools import InputProcessing
from abc import ABC, abstractmethod
from crewai.tools import BaseTool
from pydantic import BaseModel, PrivateAttr
from typing import Optional, List

class CalculatorArgs(BaseModel):
    expression: str
    action: Optional[str] = None

class EquationSolverArgs(BaseModel):
    action: str
    equation: Optional[str] = None
    var: Optional[str] = None
    equations: Optional[List[str]] = None
    vars: Optional[List[str]] = None

class InputProcessingArgs(BaseModel):
    raw_input: str
    
# =============================================================================================================
# MATH TOOLS INITIALIZING
# =============================================================================================================

class MathTool(ABC):
    name: str
    description: str

    @abstractmethod
    def run(self, **kwargs):
        pass

class CalculatorTool(BaseTool):
    name: str = "calculator"
    description: str = "Evaluate numeric math expressions (no symbols)"
    args_schema: type[BaseModel] = CalculatorArgs
    _calc: "Calculator" = PrivateAttr()

    def __init__(self):
        super().__init__()
        from .math_tools import Calculator
        self._calc = Calculator()

    def _run(self, expression: str, action: str | None = None):
        return self._calc.evaluate(expression)

class EquationSolverTool(BaseTool):
    name: str = "equation_solver"
    description: str = (
        "Solve algebraic equations. "
        "Actions: solve_equation, solve_system"
    )
    args_schema: type[BaseModel] = EquationSolverArgs

    _solver: "EquationSolver" = PrivateAttr()

    def __init__(self):
        super().__init__()
        from .math_tools import EquationSolver
        self._solver = EquationSolver()

    def _run(
        self,
        action: str,
        equation: Optional[str] = None,
        var: Optional[str] = None,
        equations: Optional[List[str]] = None,
        vars: Optional[List[str]] = None,
    ):
        if action == "solve_equation":
            if equation is None or var is None:
                raise ValueError("solve_equation requires equation and var")
            return self._solver.solve_equation(equation, var)

        elif action == "solve_system":
            if equations is None or vars is None:
                raise ValueError("solve_system requires equations and vars")
            return self._solver.solve_system(equations, vars)

        else:
            raise ValueError(f"Unknown action: {action}")

class SymbolicMathTool(BaseTool):
    name: str = "symbolic_math"
    description: str = (
        "Symbolic math operations: derivative, integral, simplify"
    )
    _sym: "SymbolicMath" = PrivateAttr()

    def __init__(self):
        super().__init__()
        from .math_tools import SymbolicMath
        self._sym = SymbolicMath()

    def _run(self, action: str, expr: str, var: str | None = None):
        if action == "derivative":
            if var is None:
                raise ValueError("Missing variable for derivative")
            return self._sym.derivative(expr, var)

        elif action == "integral":
            if var is None:
                raise ValueError("Missing variable for integral")
            return self._sym.integral(expr, var)

        elif action == "simplify":
            return self._sym.simplify_expr(expr)

        else:
            raise ValueError(f"Unknown action: {action}")
    
class MatrixToolAgent(BaseTool):
    name: str = "matrix"
    description: str = (
        "Matrix operations: add, multiply, determinant, inverse, eigen"
    )
    _m: "MatrixTool" = PrivateAttr()

    def __init__(self):
        super().__init__()
        from .math_tools import MatrixTool
        self._m = MatrixTool()

    def _run(self, action: str, A: list | None = None, B: list | None = None):
        if action == "add":
            return self._m.add(A, B)
        elif action == "multiply":
            return self._m.multiply(A, B)
        elif action == "determinant":
            return self._m.determinant(A)
        elif action == "inverse":
            return self._m.inverse(A)
        elif action == "eigen":
            return self._m.eigen(A)
        else:
            raise ValueError("Unknown matrix action")

class StatisticsToolAgent(BaseTool):
    name: str = "statistics"
    description: str = (
        "Statistics operations: mean, median, variance, std, probability, normal_pdf"
    )
    _stats: "MatrixTool" = PrivateAttr()
    
    def __init__(self):
        super().__init__()
        from .math_tools import StatisticsTool
        self._stats = StatisticsTool()

    def _run(self, 
            action: str,
            data: list | None = None,
            favorable: int | None = None,
            total: int | None = None,
            x: float | None = None,
            mu: float = 0,
            sigma: float = 1
        ):
        if action == "mean":
            return self._stats.mean(data)
        elif action == "median":
            return self._stats.median(data)
        elif action == "variance":
            return self._stats.variance(data)
        elif action == "std":
            return self._stats.std(data)
        elif action == "probability":
            return self._stats.probability(favorable, total)
        elif action == "normal_pdf":
            return self._stats.normal_pdf(x, mu=mu, sigma=sigma)
        else:
            raise ValueError(f"Unknown statistics action: {action}")

# =============================================================================================================
# INPUT PROCESSING TOOLS INITIALIZING
# =============================================================================================================
class InputProcessingTool(BaseTool):
    name: str = "input_processing"
    description: str = (
        "Processing raw agent output into structured dictionary format. "
        "Extracts Tool, Action, and all related parameters from agent output."
    )
    args_schema: type[BaseModel] = InputProcessingArgs
    _processor: "InputProcessing" = PrivateAttr()

    def __init__(self):
        super().__init__()
        self._processor = InputProcessing()

    def _run(self, raw_input: str):
        """
        Process raw input string and extract tool, action, and parameters.
        
        Args:
            raw_input: Raw agent output string
            
        Returns:
            Dictionary with processed data including:
            - tool: Tool name
            - action: Action name
            - Other parameters extracted from the input
        """
        self._processor.input = raw_input
        result = self._processor.input_processing()
        return result

# =============================================================================================================
# TOOLS REGISTRY
# =============================================================================================================        
        
class ToolRegistry:
    def __init__(self):
        self.tools = {}
        
    def register(self, tool: BaseTool):
        self.tools[tool.name] = tool
        
    def get(self, name: str):
        if name not in self.tools:
            raise ValueError(f"Tool {name} not found")
        return self.tools[name]

    def get_tools(self):
        return self.tools.items()

# =============================================================================================================
# TOOLS EXECUTOR
# =============================================================================================================   

class ToolExecutor:
    def __init__(self, registry: ToolRegistry):
        self.registry = registry
        
    def execute(self, call: dict):
        tool = self.registry.get(call["tool"])
        action = call.get("action")
        return tool.run(action=action, **call["args"])
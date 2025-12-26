from .math_tools import Calculator, EquationSolver, SymbolicMath, MatrixTool, StatisticsTool
from abc import ABC, abstractmethod

# =============================================================================================================
# TOOLS INITIALIZING
# =============================================================================================================

class MathTool(ABC):
    name: str
    description: str

    @abstractmethod
    def run(self, **kwargs):
        pass

class CalculatorTool(MathTool):
    name = "calculator"
    description = "Evaluate numeric math expressions (no symbols)"

    def __init__(self):
        self.calc = Calculator()

    def run(self, action=None, **kwargs):
        return self.calc.evaluate(kwargs["expression"])

class EquationSolverTool(MathTool):
    name = "equation_solver"
    description = (
        "Solve algebraic equations. "
        "Actions: solve_equation, solve_system"
    )
    def __init__(self):
        self.solver = EquationSolver()
        
    def run(self, action, **kwargs):
        if action == "solve_equation":
            return self.solver.solve_equation(
                equation=kwargs["equation"],
                var=kwargs["var"]
            )
            
        elif action == "solve_system":
            return self.solver.solve_system(
                equations=kwargs["equations"],
                vars=kwargs["vars"]
            )

        else:
            raise ValueError(f"Unknown action: {action}")

class SymbolicMathTool(MathTool):
    name = "symbolic_math"
    description = (
        "Symbolic math operations: derivative, integral, simplify"
    )

    def __init__(self):
        self.sym = SymbolicMath()

    def run(self, action: str, **kwargs):
        if action == "derivative":
            return self.sym.derivative(kwargs["expr"], kwargs["var"])

        elif action == "integral":
            return self.sym.integral(kwargs["expr"], kwargs["var"])

        elif action == "simplify":
            return self.sym.simplify_expr(kwargs["expr"])

        else:
            raise ValueError(f"Unknown action: {action}")
    
class MatrixToolAgent(MathTool):
    name = "matrix"
    description = (
        "Matrix operations: add, multiply, determinant, inverse, eigen"
    )

    def __init__(self):
        self.m = MatrixTool()

    def run(self, action: str, **kwargs):
        if action == "add":
            return self.m.add(kwargs["A"], kwargs["B"])
        elif action == "multiply":
            return self.m.multiply(kwargs["A"], kwargs["B"])
        elif action == "determinant":
            return self.m.determinant(kwargs["A"])
        elif action == "inverse":
            return self.m.inverse(kwargs["A"])
        elif action == "eigen":
            return self.m.eigen(kwargs["A"])
        else:
            raise ValueError("Unknown matrix action")

class StatisticsToolAgent(MathTool):
    name = "statistics"
    description = (
        "Statistics operations: mean, median, variance, std, probability, normal_pdf"
    )

    def __init__(self):
        self.stats = StatisticsTool()

    def run(self, action: str, **kwargs):
        if action == "mean":
            return self.stats.mean(kwargs["data"])
        elif action == "median":
            return self.stats.median(kwargs["data"])
        elif action == "variance":
            return self.stats.variance(kwargs["data"])
        elif action == "std":
            return self.stats.std(kwargs["data"])
        elif action == "probability":
            return self.stats.probability(kwargs["favorable"], kwargs["total"])
        elif action == "normal_pdf":
            mu = kwargs.get("mu", 0)
            sigma = kwargs.get("sigma", 1)
            return self.stats.normal_pdf(kwargs["x"], mu=mu, sigma=sigma)
        else:
            raise ValueError(f"Unknown statistics action: {action}")
        
# =============================================================================================================
# TOOLS REGISTRY
# =============================================================================================================        
        
class ToolRegistry:
    def __init__(self):
        self.tools = {}
        
    def register(self, tool: MathTool):
        self.tools[tool.name] = tool
        
    def get(self, name: str):
        if name not in self.tools:
            raise ValueError(f"Tool {name} not found")
        return self.tools[name]

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
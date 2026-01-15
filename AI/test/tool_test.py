import pytest
from tools.tools import (CalculatorTool, EquationSolverTool, SymbolicMathTool, MatrixToolAgent, StatisticsToolAgent, 
                        ToolRegistry, ToolExecutor)

# =========================
# Calculator Tests
# =========================
def test_calculator_basic():
    calc_tool = CalculatorTool()
    assert calc_tool.run(expression="2 + 3") == 5
    assert calc_tool.run(expression="10 / 2") == 5

# =========================
# Equation Solver Tests
# =========================
def test_solve_equation():
    solver_tool = EquationSolverTool()
    result = solver_tool.run(action="solve_equation", equation="x + 2 = 5", var="x")
    assert result[0] == 3

def test_solve_system():
    solver_tool = EquationSolverTool()
    eqs = ["x + y = 3", "x - y = 1"]
    vars_ = ["x", "y"]
    result = solver_tool.run(action="solve_system", equations=eqs, vars=vars_)
    result_str_key = {str(k): v for k, v in result.items()}
    assert result_str_key == {"x": 2, "y": 1}
    
# =========================
# Symbolic Math Tests
# =========================
def test_derivative():
    sym_tool = SymbolicMathTool()
    result = sym_tool.run(action="derivative", expr="x**2", var="x")
    assert str(result) == "2*x"
    
def test_integral():
    sym_tool = SymbolicMathTool()
    result = sym_tool.run(action="integral", expr="2*x", var="x") 
    assert str(result) == "x**2"
    
def test_simplify():
    sym_tool = SymbolicMathTool()
    result =  sym_tool.run(action="simplify", expr="x + x") 
    assert str(result) == "2*x"
# =========================
# Matrix Tool Tests
# =========================
def test_matrix_add():
    matrix_tool = MatrixToolAgent()
    A = [[1, 2], [3, 4]]
    B = [[5, 6], [7, 8]]
    result = matrix_tool.run(action="add", A=A, B=B) 
    assert result.tolist() == [[6, 8], [10, 12]]

def test_matrix_multiply():
    matrix_tool = MatrixToolAgent()
    A = [[1, 2], [3, 4]]
    B = [[2, 0], [1, 2]]
    result = matrix_tool.run(action="multiply", A=A, B=B) 
    assert result.tolist() == [[4, 4], [10, 8]]

# =========================
# Statistics Tool Tests
# =========================
def test_statistics_mean():
    stats_tool = StatisticsToolAgent()
    data = [1, 2, 3, 4, 5]
    assert stats_tool.run(action="mean", data=data) == 3

def test_statistics_probability():
    stats_tool = StatisticsToolAgent()
    assert stats_tool.run(action="probability", favorable=2, total=5) == 0.4

# =========================
# Tool Registry & Executor Tests
# =========================
def test_tool_registry_and_executor():
    registry = ToolRegistry()
    calc_tool = CalculatorTool()
    registry.register(calc_tool)
    
    executor = ToolExecutor(registry)
    call = {"tool": "calculator", "action": None, "args": {"expression": "1 + 1"}}
    assert executor.execute(call) == 2

    # test get tools
    assert "calculator" in dict(registry.get_tools())

def test_executor_equation_solver_system():
    registry = ToolRegistry()
    solver = EquationSolverTool()
    registry.register(solver)

    executor = ToolExecutor(registry)
    call = {"tool":"equation_solver","action":"solve_system","args":{"equations":["x + y - 3", "x - y - 1"], "vars":["x","y"]}}
    result = executor.execute(call)
    result_str_key = {str(k): v for k, v in result.items()}
    assert result_str_key == {"x": 2, "y": 1}
import yaml
import pytest
import pprint
from pathlib import Path
from crewai import Agent, Task, LLM
from tools.tools import (
    ToolRegistry,
    CalculatorTool,
    EquationSolverTool,
    SymbolicMathTool,
    MatrixToolAgent,
    StatisticsToolAgent
)


llm=LLM(model="ollama/llama3.2", base_url="http://localhost:11434")
# =========================
# Load Configurations
# =========================
AGENTS_CONFIG_PATH = Path("config/agents.yaml")
TASKS_CONFIG_PATH = Path("config/tasks.yaml")

@pytest.fixture(scope="module")
def agents_config():
    if not AGENTS_CONFIG_PATH.exists():
        pytest.fail(f"File not found: {AGENTS_CONFIG_PATH}")
    with open(AGENTS_CONFIG_PATH, encoding="utf-8") as f:
        return yaml.safe_load(f)

@pytest.fixture(scope="module")
def tasks_config():
    if not TASKS_CONFIG_PATH.exists():
        pytest.fail(f"File not found: {TASKS_CONFIG_PATH}")
    with open(TASKS_CONFIG_PATH, encoding="utf-8") as f:
        return yaml.safe_load(f)

# =========================
# Tool Registry Fixture
# =========================
@pytest.fixture(scope="module")
def tool_registry():
    registry = ToolRegistry()
    registry.register(CalculatorTool())
    registry.register(EquationSolverTool())
    registry.register(SymbolicMathTool())
    registry.register(MatrixToolAgent())
    registry.register(StatisticsToolAgent())
    return registry

# =========================
# Agent Fixtures
# =========================
@pytest.fixture
def problem_analyzer(agents_config):
    return Agent(config=agents_config['problem_analyzer'], verbose=True, llm=llm)

@pytest.fixture
def math_planner(agents_config):
    return Agent(config=agents_config['math_planner'], verbose=True, llm=llm)

@pytest.fixture
def math_executor(agents_config, tool_registry):
    return Agent(
        config=agents_config["math_executor"],
        verbose=True,
        tools=[
            tool_registry.get("calculator"),
            tool_registry.get("equation_solver"),
            tool_registry.get("symbolic_math"),
            tool_registry.get("matrix"),
            tool_registry.get("statistics"),
        ],
        llm=llm
    )

@pytest.fixture
def solution_verifier(agents_config, tool_registry):
    return Agent(
        config=agents_config["solution_verifier"],
        verbose=True,
        tools=[
            tool_registry.get("calculator"),
            tool_registry.get("symbolic_math"),
        ],
        llm=llm
    )

@pytest.fixture
def math_explainer(agents_config):
    return Agent(config=agents_config["math_explainer"], verbose=True, llm=llm)

# =========================
# Tasks Fixtures
# =========================
@pytest.fixture
def analyze_problem_task(tasks_config, problem_analyzer):
    task_conf = tasks_config["analyze_problem"]
    return Task(
        description=task_conf["description"],
        expected_output=task_conf["expected_output"],
        agent=problem_analyzer
    )

@pytest.fixture
def plan_solution_task(tasks_config, math_planner, analyze_problem_task):
    task_conf = tasks_config["plan_solution"]
    return Task(
        description=task_conf["description"],
        expected_output="A plan including tool, action, and prepared inputs.",  # Thêm expected nếu thiếu trong yaml
        agent=math_planner,
        context=[analyze_problem_task]  # Giả sử context từ task trước
    )

@pytest.fixture
def execute_solution_task(tasks_config, math_executor, plan_solution_task):
    task_conf = tasks_config["execute_solution"]
    return Task(
        description=task_conf["description"],
        expected_output="The executed result from the tool.",  # Thêm expected nếu thiếu
        agent=math_executor,
        context=[plan_solution_task]
    )

@pytest.fixture
def verify_solution_task(tasks_config, solution_verifier, execute_solution_task):
    task_conf = tasks_config["verify_solution"]
    return Task(
        description=task_conf["description"],
        expected_output=task_conf["expected_output"],
        agent=solution_verifier,
        context=[execute_solution_task]  # Thay 'solve_problem' bằng execute_solution nếu khớp yaml
    )

@pytest.fixture
def explain_solution_task(tasks_config, math_explainer, verify_solution_task):
    task_conf = tasks_config["explain_solution"]
    return Task(
        description=task_conf["description"],
        expected_output=task_conf["expected_output"],
        agent=math_explainer,
        context=[verify_solution_task]
    )

# =========================
# TESTS
# =========================

def test_problem_analyzer(tasks_config, problem_analyzer, analyze_problem_task):
    topic = "What is the derivative of f(x) = 2*x"
    result = problem_analyzer.kickoff(
        messages=topic
    )
    print("\n--- Problem Analyzer Output ---\n")
    pprint.pprint(result.raw)
    assert result.raw is not None


#def test_plan_solution(plan_solution_task, math_planner):
    
    
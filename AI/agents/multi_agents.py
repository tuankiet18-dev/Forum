import os
import sys
import yaml

from pathlib import Path

from tools.tools import (CalculatorTool, EquationSolverTool, SymbolicMathTool, MatrixToolAgent,
                        StatisticsToolAgent, ToolRegistry, ToolExecutor, InputProcessingTool)
from prompt_processing import PromptProcessing
from config.llm_config import LLMConfig, LLMMode

from langchain.tools import tool

from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import SerperDevTool
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List

import pprint

from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())
print("DEBUG: OPENAI_API_KEY loaded:", bool(os.getenv("OPENAI_API_KEY")))
print("DEBUG: GOOGLE_API_KEY loaded:", bool(os.getenv("GOOGLE_API_KEY")))
# =============================================================================================================
# TOOLS REGISTRY
# =============================================================================================================

# Registering tools
registry = ToolRegistry()
registry.register(CalculatorTool())
registry.register(EquationSolverTool())
registry.register(SymbolicMathTool())
registry.register(MatrixToolAgent())
registry.register(StatisticsToolAgent())
registry.register(InputProcessingTool())

executor = ToolExecutor(registry=registry)

# =============================================================================================================
# GET PROMPTS
# =============================================================================================================

p_proc = PromptProcessing()
p_proc.load("system_prompts.json")
SYSTEM_PROMPT = p_proc.get_system_prompt()

# Initialize LLM with Google API (Gemini)
llm_config = LLMConfig(LLMMode.GOOGLE, model="gemini/gemini-2.5-flash-lite")
llm_config.print_status()
llm = llm_config.get_llm()
# =============================================================================================================
# CONFIG CREW
# =============================================================================================================

@CrewBase
class MathCrew():
    """Math crew for math problems."""
    
    agents: List[BaseAgent]
    tasks: List[Task]
    
    def __init__(self):
        with open("config/agents.yaml") as f:
            self.agents_config = yaml.safe_load(f)
        with open("config/tasks.yaml") as f:
            self.tasks_config = yaml.safe_load(f)
        # pprint.pprint(self.tasks_config['analyze_problem'])
        # print(type(self.tasks_config['analyze_problem']))   
        self.agents = [
            self.problem_analyzer(),
            self.math_planner(),
            self.input_formatter(),
            self.math_executor(),
            self.solution_verifier(),
            self.math_explainer(),
        ]

        self.tasks = [
            self.analyze_problem(),
            self.plan_solution(),
            self.format_input(),
            self.execute_solution(),
            self.verify_solution(),
            self.explain_solution(),
        ]
        
    def get_tasks_config(self):
        return self.tasks_config
    
    @agent
    def problem_analyzer(self) -> Agent:
        return Agent(
            config=self.agents_config['problem_analyzer'],
            verbose=True,
            #tools=[SerperDevTool()]
            llm=llm
        )
    
    @agent
    def math_planner(self) -> Agent:
        return Agent(
            config=self.agents_config['math_planner'],
            verbose=True,
            llm=llm
        )
      
    @agent
    def input_formatter(self) -> Agent:
        return Agent(
            config=self.agents_config['input_formatter'],
            verbose=True,
            tools=[registry.get('input_processing')],
            llm=llm
        )
      
    @agent
    def math_executor(self) -> Agent:
        return Agent(
            config=self.agents_config['math_executor'],
            verbose=True,
            tools=[
                registry.get("calculator"),
                registry.get("equation_solver"),
                registry.get("symbolic_math"),
                registry.get("matrix"),
                registry.get("statistics"),
                registry.get('input_processing')
            ],
            llm=llm
        ) 
    @agent
    def solution_verifier (self) -> Agent:
        return Agent(
            config=self.agents_config['solution_verifier'],
            verbose=True,
            tools=[
                registry.get("calculator"),
                registry.get("symbolic_math"),
            ],
            llm=llm
        )
    
    @agent
    def math_explainer(self) -> Agent:
        return Agent(
            config=self.agents_config['math_explainer'],
            verbose=True,
            llm=llm
        )
    
    @task
    def analyze_problem(self) -> Task:
        task_conf = self.tasks_config['analyze_problem']
        agent_obj = getattr(self, task_conf["agent"])()
        return Task(
            description=task_conf["description"],
            expected_output=task_conf["expected_output"],
            agent=agent_obj
        )
        
    @task
    def plan_solution(self) -> Task:
        task_conf = self.tasks_config['plan_solution']
        agent_obj = getattr(self, task_conf["agent"])()
        raw_ctx = task_conf.get("context", [])
        context = [getattr(self, c)() if isinstance(c, str) and hasattr(self, c) else c for c in raw_ctx]
        return Task(
            description=task_conf["description"],
            expected_output=task_conf["expected_output"],
            agent=agent_obj,
            context=context
        )
    
    @task
    def format_input(self) -> Task:
        task_conf = self.tasks_config['format_input']
        agent_obj = getattr(self, task_conf["agent"])()
        raw_ctx = task_conf.get("context", [])
        context = [getattr(self, c)() if isinstance(c, str) and hasattr(self, c) else c for c in raw_ctx]
        return Task(
            description=task_conf["description"],
            expected_output=task_conf["expected_output"],
            agent=agent_obj,
            context=context
        )
    
    @task
    def execute_solution(self) -> Task:
        task_conf = self.tasks_config['execute_solution']
        agent_obj = getattr(self, task_conf["agent"])()
        raw_ctx = task_conf.get("context", [])
        context = [getattr(self, c)() if isinstance(c, str) and hasattr(self, c) else c for c in raw_ctx]
        return Task(
            description=task_conf["description"],
            expected_output=task_conf["expected_output"],
            agent=agent_obj,
            context=context
        )
    @task
    def verify_solution(self) -> Task:
        task_conf = self.tasks_config['verify_solution']
        agent_obj = getattr(self, task_conf["agent"])()
        raw_ctx = task_conf.get("context", [])
        context = [getattr(self, c)() if isinstance(c, str) and hasattr(self, c) else c for c in raw_ctx]
        return Task(
            description=task_conf["description"],
            expected_output=task_conf["expected_output"],
            agent=agent_obj,
            context=context
        )
        
    @task
    def explain_solution(self) -> Task:
        task_conf = self.tasks_config['explain_solution']
        agent_obj = getattr(self, task_conf["agent"])()
        raw_ctx = task_conf.get("context", [])
        context = [getattr(self, c)() if isinstance(c, str) and hasattr(self, c) else c for c in raw_ctx]
        return Task(
            description=task_conf["description"],
            expected_output=task_conf["expected_output"],
            agent=agent_obj,
            context=context
        )
    
    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True
        )
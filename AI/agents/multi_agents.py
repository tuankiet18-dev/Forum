from load_models import TextGenerating, ModelLoader
from tools.tools import CalculatorTool, EquationSolverTool, SymbolicMathTool, MatrixToolAgent, StatisticsToolAgent, ToolRegistry
from prompt_processing import PromptProcessing

# =============================================================================================================
# MODEL LOADING
# =============================================================================================================

loader = ModelLoader()

model, tokenizer = loader.load()

llm = loader.create_llm()

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

# =============================================================================================================
# TOOLS CONTRACT
# =============================================================================================================

p_proc = PromptProcessing()
SYSTEM_PROMPT = p_proc.get_system_prompt()



        
        
    
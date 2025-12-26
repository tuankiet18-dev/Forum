from langchain_huggingface import HuggingFacePipeline
from prompt_processing import PromptProcessing
from tools.tools import ToolExecutor

class Agent:
    def __init__(self, 
                llm: HuggingFacePipeline,
                SYSTEM_PROMPT: str,
                p_proc: PromptProcessing,
                executor: ToolExecutor,
                ):
        self.llm = llm
        self.SYSTEM_PROMPT = SYSTEM_PROMPT
        self.p_proc = p_proc
        self.executor = executor
    
    def run_agent(self):
        prompt = self.SYSTEM_PROMPT
        
        response = self.llm.invoke(prompt)
        print("RAW LLM RESPONSE:", response)
        
        call = self.p_proc.parse_llm_output(response)
        
        try:
            self.p_proc.validate_call(call)
            result = self.executor.execute(call)
            return result
        except Exception as e:
            return f"Tool error: {e}"
    
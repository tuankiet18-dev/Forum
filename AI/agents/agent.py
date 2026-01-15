from langchain_huggingface import HuggingFacePipeline
from prompt_processing import PromptProcessing
from tools.tools import ToolExecutor
from openai import OpenAI
import os
import sys
from pathlib import Path

file_path = Path("load_models.py")
sys.path.append(str(Path(__file__).resolve().parents[1]))
OPEN_ROUTER_API = os.getenv("OPEN_ROUTER_API")

class MyAgent:
    def __init__(self, 
                SYSTEM_PROMPT: str,
                p_proc: PromptProcessing,
                executor: ToolExecutor,
                OPEN_ROUTER_API: str = OPEN_ROUTER_API,
                ):
        self.client = OpenAI(base_url="https://openrouter.ai/api/v1",
                            api_key=OPEN_ROUTER_API,
                            )
        self.SYSTEM_PROMPT = SYSTEM_PROMPT
        self.p_proc = p_proc
        self.executor = executor
    
    def run_agent(self, question):
        messages = [
        {"role": "system", "content": self.SYSTEM_PROMPT},
        {"role": "user", "content": question}
        ]
        extra_body={"reasoning": {"enabled": True}}
        
        response = self.client.chat.completions.create(
            model="deepseek/deepseek-v3.2",
            messages=messages,
            extra_body=extra_body
        )
        
        response = response.choices[0].message
        
        return response
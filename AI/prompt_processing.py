import json
import re

from typing import Dict, Optional
from pathlib import Path

class PromptProcessing:
    """
    Load and manage prompts for LLM agents.
    
    Supports: 
    - system prompts
    - tools specification
    - template formatting
    """
    
    def __init__(self, prompt_dir: str = "prompts"):
        self.prompt_dir = Path(prompt_dir)
        self._SYSTEM_PROMPTS: str
        self._cache: Dict[str, Dict] = {}
        
    def load(self, filename: str) -> Dict:
        """
        Load a JSON prompt file (cached).
        
        Args:
            filename: JSON file name
            
        Returns:
            Parsed JSON as dict
        """
        if filename in self._cache:
            return self._cache[filename]
        
        path = self.prompt_dir / filename
        
        if not path.exists():
            raise FileNotFoundError(f"Prompt file not found: {path}")

        with open(path, 'r', encoding="utf-8") as f:
            data = json.load(f)
        
        self._SYSTEM_PROMPTS = data["system_prompt_template"]
        self._cache[filename] = data
        
        return data
    
    def get_system_prompt(self):
        return self._SYSTEM_PROMPTS
    
    def parse_llm_output(self, texts):
        try:
            return json.load(texts)
        except Exception:
            raise ValueError("LLM did not return valid JSON")
        
    def validate_call(self, call: dict):
        if "tool" not in call or "args" not in call:
            raise ValueError("Invalid tool call format")
    
    def extract_assistant_json(self, text: str) -> dict:
        """
        Extract the JSON object from assistant output.
        """
        match = re.search(r'assistant\s*(\{[\s\S]*\})\s*$', text)
        if not match:
            raise ValueError("No JSON found in assistant output")

        json_str = match.group(1)
        return json.loads(json_str)
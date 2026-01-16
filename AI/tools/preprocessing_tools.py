import re
import json

class InputProcessing():
    def __init__(self, input: str | None = None):
        self.input=input
    
    def input_processing(self):
        data = self.input
        
        # Extract Tool and Action values
        tool_match = re.search(r'Tool:\s*(\w+)', data)
        action_match = re.search(r'Action:\s*(\w+)', data)
        
        tool = tool_match.group(1) if tool_match else None
        action = action_match.group(1) if action_match else None
        
        # Parse remaining fields (Equations, Variables, Args, etc.)
        result = {
            'tool': tool,
            'action': action
        }
        
        # Extract YAML-like content
        lines = data.split('\n')
        current_key = None
        current_list = []
        
        for line in lines:
            line = line.strip()
            if not line or line.startswith('Tool:') or line.startswith('Action:'):
                continue
            
            # Check for key: value patterns
            if ':' in line and not line.startswith('-'):
                if current_key and current_list:
                    result[current_key] = current_list
                    current_list = []
                
                key, value = line.split(':', 1)
                key = key.strip().lower()
                value = value.strip()
                
                if value and not value == '[':
                    result[key] = value
                    current_key = None
                else:
                    current_key = key
            
            # Check for list items
            elif line.startswith('-'):
                item = line[1:].strip()
                current_list.append(item)
        
        # Add last list if exists
        if current_key and current_list:
            result[current_key] = current_list
        
        return result
        
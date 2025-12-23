import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel

"""LOAD FINE TUNED MODEL"""

# Base model name
base_model_name = 'Qwen/Qwen2.5-0.5B-Instruct'

# Folder of fine tuned adapter
adapter_path = './models/fine-tuned qwen0.5B'

# Load tokenizers
tokenizer = AutoTokenizer.from_pretrained(
    pretrained_model_name_or_path=adapter_path
)

# Load base model
model = AutoModelForCausalLM.from_pretrained(
    base_model_name,
    dtype=torch.bfloat16,
    device_map="auto",
)

# Add adapter too base model
model = PeftModel.from_pretrained(model, adapter_path)


class LLModel:
    def __init__(self, 
                model: AutoModelForCausalLM = model,
                tokenizer: AutoTokenizer = tokenizer
    ):
        self.model = model
        self.tokenizer=tokenizer
        self.model.eval()
        
    def build_prompt(self, messages):
        """
        messages = [
            {"role": "system", "content": "..."},
            {"role": "user", "content": "..."}
        ]
        """
        return self.tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )
    
    def generate(self,
                prompt: str,
                max_new_tokens: int = 512,
                temperature: float = 0.7,
                top_p: float = 0.9,
                do_sample: bool = True,
        ):
        messages = [
            {"role": "system", "content": "You are a mathematics expert. Give correct, concise, and precise answers. Do not add unnecessary explanations."},
            {"role": "user", "content": prompt}
        ]
        text = tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True
        )
        model_inputs = tokenizer([text], return_tensors="pt").to(model.device)
        
        generated_ids = self.model.generate(
            **model_inputs,
            max_new_tokens=max_new_tokens,
            temperature=temperature,
            top_p=top_p,
            do_sample=do_sample
        )
        
        generated_ids = [
            output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
        ]
        
        return self.tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
        
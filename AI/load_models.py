import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from peft import PeftModel
from langchain_huggingface import HuggingFacePipeline

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

class ModelLoader:
    def __init__(
        self,
        base_model_name: str = "Qwen/Qwen2.5-0.5B-Instruct",
        adapter_path: str = None,
        device: str = "auto",
        dtype=torch.bfloat16
    ):
        self.base_model_name = base_model_name
        self.adapter_path = adapter_path
        self.device = device
        self.dtype = dtype

        self.tokenizer = None
        self.model = None
       
    def load(self):
        """Load Tokenizer and Model. Adapter is optional"""
        if self.adapter_path:
            self.tokenizer = AutoTokenizer.from_pretrained(self.adapter_path)
        else:
            self.tokenizer = AutoTokenizer.from_pretrained(self.base_model_name)
        
        base_model = AutoModelForCausalLM.from_pretrained(
            self.base_model_name,
            dtype=self.dtype,
            device_map=self.device
        )
        
        if self.adapter_path:
            self.model = PeftModel.from_pretrained(base_model, self.adapter_path)
        else:
            self.model = base_model

        return self.model, self.tokenizer
     
    def create_llm(self):
        model, tokenizer = self.load()
        
        pipe = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            max_new_tokens=512,
            temperature=0.0,
            do_sample=False,
        )      
        
        return HuggingFacePipeline(pipeline=pipe) 

class TextGenerating:
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
        
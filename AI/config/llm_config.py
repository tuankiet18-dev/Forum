"""
LLM Configuration Manager
Handles switching between API and local LLM modes
"""

import os
from enum import Enum
from typing import Optional, Dict, Any
from crewai import LLM
from dotenv import load_dotenv

load_dotenv()


class LLMMode(Enum):
    """Available LLM modes"""
    LOCAL = "local"
    OPENAI = "openai"
    GOOGLE = "google"
    ANTHROPIC = "anthropic"
    OLLAMA = "ollama"


class LLMConfig:
    """
    Configuration class to manage LLM mode switching between API and local deployments.
    
    Supported modes:
    - LOCAL (Ollama): Requires Ollama running locally
    - OPENAI: Requires OPENAI_API_KEY
    - GOOGLE: Requires GOOGLE_API_KEY
    - ANTHROPIC: Requires ANTHROPIC_API_KEY
    """
    
    # Default configurations for each mode
    CONFIGS = {
        LLMMode.LOCAL: {
            "model": "ollama/llama3.2",
            "base_url": "http://localhost:11434",
            "temperature": 0.7,
        },
        LLMMode.OPENAI: {
            "model": "gpt-4",
            "temperature": 0.7,
        },
        LLMMode.GOOGLE: {
            "model": "gemini/gemini-2.5-flash-lite",
            "temperature": 0.7,
        },
        LLMMode.ANTHROPIC: {
            "model": "claude-3-5-sonnet-20241022",
            "temperature": 0.7,
        },
        LLMMode.OLLAMA: {
            "model": "ollama/llama2",
            "base_url": "http://localhost:11434",
            "temperature": 0.7,
        },
    }

    def __init__(self, mode: LLMMode = LLMMode.LOCAL, **kwargs):
        """
        Initialize LLM Configuration.
        
        Args:
            mode: The LLM mode to use (LOCAL, OPENAI, GOOGLE, ANTHROPIC, OLLAMA)
            **kwargs: Additional configuration parameters to override defaults
        """
        self.mode = mode
        self.custom_config = kwargs
        self.llm = None
        self._initialize_llm()

    def _initialize_llm(self) -> None:
        """Initialize the LLM based on current mode"""
        config = self._get_config()
        print(f"Initializing LLM in {self.mode.value} mode...")
        print(f"Model: {config.get('model')}")
        
        try:
            self.llm = LLM(**config)
            print(f"✓ LLM initialized successfully in {self.mode.value} mode")
        except Exception as e:
            print(f"✗ Failed to initialize LLM: {str(e)}")
            raise

    def _get_config(self) -> Dict[str, Any]:
        """
        Get the configuration for the current mode.
        Merges default config with custom overrides.
        """
        base_config = self.CONFIGS[self.mode].copy()
        
        # Check for required API keys
        if self.mode == LLMMode.OPENAI:
            if not os.getenv("OPENAI_API_KEY"):
                raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        elif self.mode == LLMMode.GOOGLE:
            if not os.getenv("GOOGLE_API_KEY"):
                raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
        elif self.mode == LLMMode.ANTHROPIC:
            if not os.getenv("ANTHROPIC_API_KEY"):
                raise ValueError("ANTHROPIC_API_KEY not found in environment variables")
        
        elif self.mode == LLMMode.LOCAL or self.mode == LLMMode.OLLAMA:
            # Check if Ollama is running
            try:
                import requests
                requests.get(base_config["base_url"], timeout=2)
            except Exception:
                raise ValueError(
                    f"Cannot connect to Ollama at {base_config['base_url']}. "
                    "Make sure Ollama is running locally."
                )
        
        # Merge with custom config
        base_config.update(self.custom_config)
        return base_config

    def get_llm(self) -> LLM:
        """Get the configured LLM instance"""
        if self.llm is None:
            self._initialize_llm()
        return self.llm

    def switch_mode(self, mode: LLMMode, **kwargs) -> None:
        """
        Switch to a different LLM mode.
        
        Args:
            mode: The new LLM mode to switch to
            **kwargs: Optional configuration overrides for the new mode
        """
        self.mode = mode
        self.custom_config = kwargs
        self._initialize_llm()

    def list_available_modes(self) -> Dict[str, str]:
        """Return list of available modes and their descriptions"""
        descriptions = {
            LLMMode.LOCAL: "Ollama - Local deployment (recommended for development)",
            LLMMode.OPENAI: "OpenAI GPT-4 (requires OPENAI_API_KEY)",
            LLMMode.GOOGLE: "Google Gemini (requires GOOGLE_API_KEY)",
            LLMMode.ANTHROPIC: "Anthropic Claude (requires ANTHROPIC_API_KEY)",
            LLMMode.OLLAMA: "Ollama with custom model",
        }
        return {mode.value: descriptions[mode] for mode in LLMMode}

    @staticmethod
    def get_mode_from_env() -> LLMMode:
        """
        Get LLM mode from environment variable.
        Environment variable: LLM_MODE
        Default: LOCAL
        """
        mode_str = os.getenv("LLM_MODE", "local").upper()
        try:
            return LLMMode[mode_str]
        except KeyError:
            print(f"Invalid LLM_MODE: {mode_str}. Defaulting to LOCAL.")
            return LLMMode.LOCAL

    def print_status(self) -> None:
        """Print current LLM configuration status"""
        config = self._get_config()
        print("\n" + "="*50)
        print(f"LLM Configuration Status")
        print("="*50)
        print(f"Mode: {self.mode.value.upper()}")
        print(f"Model: {config.get('model')}")
        if 'base_url' in config:
            print(f"Base URL: {config.get('base_url')}")
        print(f"Temperature: {config.get('temperature')}")
        print("="*50 + "\n")


# Quick setup functions for common use cases
def get_local_llm(**kwargs) -> LLM:
    """Get a local Ollama LLM instance"""
    config = LLMConfig(LLMMode.LOCAL, **kwargs)
    return config.get_llm()


def get_openai_llm(**kwargs) -> LLM:
    """Get an OpenAI LLM instance"""
    config = LLMConfig(LLMMode.OPENAI, **kwargs)
    return config.get_llm()


def get_google_llm(**kwargs) -> LLM:
    """Get a Google Gemini LLM instance"""
    config = LLMConfig(LLMMode.GOOGLE, **kwargs)
    return config.get_llm()


def get_anthropic_llm(**kwargs) -> LLM:
    """Get an Anthropic Claude LLM instance"""
    config = LLMConfig(LLMMode.ANTHROPIC, **kwargs)
    return config.get_llm()


def get_llm_from_env(**kwargs) -> LLM:
    """
    Get LLM instance based on environment variables.
    Supports:
    - LLM_MODE: Specifies which mode to use (local, openai, google, anthropic)
    - Model-specific keys: OPENAI_API_KEY, GOOGLE_API_KEY, ANTHROPIC_API_KEY
    """
    mode = LLMConfig.get_mode_from_env()
    config = LLMConfig(mode, **kwargs)
    return config.get_llm()

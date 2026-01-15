from agents.crew_run import run
from fastapi import Form, APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import logging

# Setup logging
logger = logging.getLogger(__name__)

router = APIRouter()

class ChatRequest(BaseModel):
    """Chat request schema"""
    prompt: str

class ChatResponse(BaseModel):
    """Chat response schema"""
    response: str
    status: str = "success"
    error: Optional[str] = None

@router.post("/chat", response_model=ChatResponse)
def chat(prompt: str = Form(...)) -> ChatResponse:
    """
    Process user prompt through the math crew and return the final answer.
    
    Args:
        prompt: User's mathematical problem
        
    Returns:
        ChatResponse with the agent's answer or error message
    """
    try:
        if not prompt or not prompt.strip():
            raise ValueError("Prompt cannot be empty")
        
        logger.info(f"Processing prompt: {prompt}")
        
        # Run the crew to get the result
        result = run(inputs=prompt)
        
        # Extract the final answer from the crew output
        if result is None:
            raise ValueError("No response from agents")
        
        # Extract answer from different possible attributes
        answer = None
        
        # Try .raw first (most common from CrewAI)
        if hasattr(result, 'raw'):
            answer = str(result.raw).strip()
        # Try .output
        elif hasattr(result, 'output'):
            answer = str(result.output).strip()
        # Try string conversion
        elif result:
            answer = str(result).strip()
        
        if not answer:
            raise ValueError("Empty response from agents")
        
        logger.info(f"Generated answer: {answer}")
        
        return ChatResponse(
            response=answer,
            status="success"
        )
    
    except ValueError as ve:
        logger.error(f"Validation error: {str(ve)}")
        return ChatResponse(
            response="",
            status="error",
            error=f"Validation error: {str(ve)}"
        )
    
    except Exception as e:
        logger.error(f"Error processing prompt: {str(e)}", exc_info=True)
        return ChatResponse(
            response="",
            status="error",
            error=f"Failed to process prompt: {str(e)}"
        )


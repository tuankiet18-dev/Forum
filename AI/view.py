from load_models import LLModel
from fastapi import Form, APIRouter
from pydantic import BaseModel

model = LLModel()

router = APIRouter()

@router.post("/chat")
def chat(prompt: str = Form(...)):
    answer = model.generate(prompt)
    return {"response": answer}
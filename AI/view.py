from load_models import TextGenerating
from fastapi import Form, APIRouter
from pydantic import BaseModel

model = TextGenerating()

router = APIRouter()

@router.post("/chat")
def chat(prompt: str = Form(...)):
    answer = model.generate(prompt)
    return {"response": answer}
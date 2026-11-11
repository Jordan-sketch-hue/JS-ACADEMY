"""AXIOM BRAIN — inference server.

Serves YOUR trained weights as a small HTTP API. Deploy to your Railway
always-on lane (or any box with ~8GB RAM for the 1.5B model on CPU,
faster with any GPU). Once this is up, AXIOM's CODEGEN node calls it:

    localStorage.setItem("axiom_brain_url", "https://your-brain.up.railway.app")

No external AI service is involved at any point.
"""

import pathlib

import torch
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer

WEIGHTS = pathlib.Path(__file__).parent / "weights"

tokenizer = AutoTokenizer.from_pretrained(WEIGHTS)
model = AutoModelForCausalLM.from_pretrained(
    WEIGHTS,
    torch_dtype=torch.bfloat16 if torch.cuda.is_available() else torch.float32,
    device_map="auto",
)
model.eval()

app = FastAPI(title="AXIOM BRAIN")
app.add_middleware(  # allow the AXIOM web app to call this server
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)


class Ask(BaseModel):
    prompt: str
    max_new_tokens: int = 1024
    temperature: float = 0.4


@app.get("/")
def health():
    return {"brain": "online", "owner": "operator", "external_ai": None}


@app.post("/generate")
def generate(ask: Ask):
    inputs = tokenizer(ask.prompt, return_tensors="pt").to(model.device)
    with torch.no_grad():
        out = model.generate(
            **inputs,
            max_new_tokens=ask.max_new_tokens,
            temperature=ask.temperature,
            do_sample=ask.temperature > 0,
            pad_token_id=tokenizer.eos_token_id,
        )
    text = tokenizer.decode(out[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True)
    return {"code": text}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

"""AXIOM BRAIN — the learning loop.

This is the same algorithm every large AI is trained with:
next-token prediction optimized by gradient descent. Starting from an
open-weights code model (Apache-2.0 — the weights are yours), it continues
training on YOUR corpus with LoRA so it runs on a single rented GPU.

Run on any 24GB GPU (RTX 4090 / A10). First useful run: 2–6 hours.
Output: weights/ — your model. Keep it, version it, it belongs to you.
"""

import pathlib

import torch
from datasets import load_dataset
from peft import LoraConfig, get_peft_model
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    DataCollatorForLanguageModeling,
    Trainer,
    TrainingArguments,
)

ROOT = pathlib.Path(__file__).parent
BASE_MODEL = "Qwen/Qwen2.5-Coder-1.5B"  # open weights; swap for -0.5B on small GPUs
CTX = 2048

tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL, torch_dtype=torch.bfloat16, device_map="auto"
)

# LoRA: train small adapter matrices instead of all weights — same learning,
# a fraction of the memory. Merged into the base at the end so you ship one model.
model = get_peft_model(model, LoraConfig(
    r=32, lora_alpha=64, lora_dropout=0.05, task_type="CAUSAL_LM",
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
))
model.print_trainable_parameters()


def tokenize(batch):
    return tokenizer(batch["text"], truncation=True, max_length=CTX)


data = load_dataset("json", data_files=str(ROOT / "corpus" / "train.jsonl"), split="train")
data = data.map(tokenize, batched=True, remove_columns=["text"])

trainer = Trainer(
    model=model,
    train_dataset=data,
    data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False),
    args=TrainingArguments(
        output_dir=str(ROOT / "checkpoints"),
        per_device_train_batch_size=4,
        gradient_accumulation_steps=8,
        num_train_epochs=1,
        learning_rate=2e-4,
        lr_scheduler_type="cosine",
        warmup_ratio=0.03,
        bf16=True,
        logging_steps=20,
        save_steps=500,
        report_to="none",
    ),
)

trainer.train()

# merge the learned adapters into the base weights → one standalone model
merged = model.merge_and_unload()
out = ROOT / "weights"
merged.save_pretrained(out)
tokenizer.save_pretrained(out)
print(f"[train] done — your model is in {out}. It is yours.")

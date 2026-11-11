"""AXIOM BRAIN — corpus builder.

Assembles the training data your model learns from:
  1. open code datasets (HTML/CSS/JS/TS/React) from Hugging Face
  2. any reference docs you drop into corpus/docs/ (.md, .txt, .html)
  3. your AXIOM knowledge-base export (axiom-knowledge-base.json)

Output: corpus/train.jsonl — one {"text": ...} per line, ready for train.py.
"""

import json
import pathlib

from datasets import load_dataset

ROOT = pathlib.Path(__file__).parent
CORPUS = ROOT / "corpus"
DOCS = CORPUS / "docs"
OUT = CORPUS / "train.jsonl"

# open, permissively-licensed code — the web-stack languages AXIOM builds with
CODE_DATASET = "bigcode/the-stack-smol"
LANGS = ["html", "css", "javascript", "typescript"]
PER_LANG_LIMIT = 20_000  # raise for bigger training runs

MIN_LEN, MAX_LEN = 200, 20_000  # skip trivial and huge files


def iter_open_code():
    for lang in LANGS:
        ds = load_dataset(CODE_DATASET, data_dir=f"data/{lang}", split="train")
        kept = 0
        for row in ds:
            text = row.get("content", "")
            if MIN_LEN <= len(text) <= MAX_LEN:
                yield {"text": text}
                kept += 1
                if kept >= PER_LANG_LIMIT:
                    break
        print(f"[dataset] {lang}: {kept} files")


def iter_local_docs():
    if not DOCS.exists():
        return
    for path in DOCS.rglob("*"):
        if path.suffix.lower() in {".md", ".txt", ".html"} and path.is_file():
            text = path.read_text(errors="ignore")
            if len(text) >= MIN_LEN:
                yield {"text": text}


def iter_axiom_kb():
    kb = ROOT / "axiom-knowledge-base.json"
    if not kb.exists():
        print("[dataset] no axiom-knowledge-base.json found — skipping (export it from AXIOM panel 06)")
        return
    for entry in json.loads(kb.read_text()):
        yield {"text": f"# AXIOM build log — {entry.get('title', '')}\n{json.dumps(entry.get('body', {}), indent=2)}"}


def main():
    CORPUS.mkdir(exist_ok=True)
    n = 0
    with OUT.open("w") as f:
        for source in (iter_open_code, iter_local_docs, iter_axiom_kb):
            for row in source():
                f.write(json.dumps(row) + "\n")
                n += 1
    print(f"[dataset] wrote {n} documents → {OUT}")


if __name__ == "__main__":
    main()

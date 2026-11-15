# Lexsi Labs — Tiny-Aya Structured JSON Evaluation & Playground Web App

Production-ready Next.js web application built for the **AI Safety & Alignment Hackathon**, evaluating and showcasing schema-conditioned JSON extraction across three model variants:

1. **Base**: `CohereLabs/tiny-aya-global` (vanilla 3.35B baseline)
2. **SFT v2**: `monson2002/tiny-aya-sft-v2-adapter` (LoRA SFT adapter on Tiny Aya)
3. **DPO**: `monson2002/tiny-aya-sft-v2-dpo-adapter` (LoRA DPO-aligned adapter on Tiny Aya)

---

## 🚀 Key Features

### 1. Interactive 3-Model Playground (`/`)
- **Document Input Options**:
  - **PDF / TXT In-Browser Extraction**: Drag-and-drop client-side PDF parsing powered by `pdfjs-dist` (zero server upload / zero serverless binary overhead).
  - **Paste Text**: Multi-line editor with real-time token/char counts.
  - **FieldBench Sample Loader**: One-click benchmark sample loader populated directly from `fieldbench_benchmark_results.json`.
- **JSON Schema Builder**:
  - **Simple Key-Value Builder**: Interactive table to configure field names, data types, nullability, and required constraints — auto-compiling to valid JSON Schema v7.
  - **Raw Schema Editor**: Monospace editor with instant syntax validation and **4 one-click presets** (*Commercial Invoice*, *Clinical Note*, *Support Ticket*, *Legal Contract*).
- **Constrained Decoding Format Selector**:
  - `JSON (Strict Schema)` active.
- **Side-by-Side Model Comparison**:
  - Run Base vs. SFT v2 vs. DPO concurrently or individually.
  - **Live Validation Badges** computed on every output:
    - `parse_ok` (Valid / Invalid JSON syntax)
    - `schema_valid` (Complies with 100% of user-defined JSON Schema constraints via `ajv`)
    - `0 hallucinations` (Grounded leaf strings vs. ungrounded hallucination detector)
    - `null_acc` (Abstention accuracy on missing or null schema properties)
    - `field_f1` & `Latency (ms)`
  - **Compare vs. Gold**: Interactive field-by-field diff table highlighting exact matches vs mismatches when benchmark samples are loaded.
  - **Syntax-Highlighted JSON Viewer** with one-click **Copy JSON** and **Raw Token Stream** toggle.

### 2. FieldBench Benchmark Graphs & Analytics (`/benchmarks`)
- **Headline KPI Cards**: Real-time delta improvements from Base → SFT v2 → DPO on `doc_exact`, `schema_valid`, `field_f1`, and `hallucination_rate_adj`.
- **Chart 1 — Overall 7-Metric Grouped Bar Chart**: Responsive `recharts` comparison across `parse_ok`, `schema_valid`, `field_f1`, `doc_exact`, `null_acc`, `hallucination_rate`, and `hallucination_rate_adj`.
- **Chart 2 — Capability Radar Chart**: 5-axis geometric representation of extraction capability.
- **Chart 3 — Per-Domain Breakdown**: Interactive metric selector comparing performance across 6 distinct corpus categories (*Financial Invoices*, *Clinical Notes*, *Legal Contracts*, *Customer Support*, *Procurement RFP*, *Scientific Papers*).
- **Summary Metrics Table**: Sortable table with exact scores for every metric.
- **Sample Explorer**: Filterable and searchable sample browser allowing evaluators to inspect source texts, target schemas, gold targets, and all 3 model predictions side-by-side.

### 3. Vercel Serverless Proxy (`/api/infer`)
- Secure serverless route that interfaces with our Hugging Face Space running on an `Nvidia T4 Small` instance (`$0.40/hr`).
- Graceful **Auto-Sleep handling**: Intercepts 503 waking responses and prompts the UI with a friendly "Waking up T4 GPU (~20s)..." countdown banner that auto-polls until warm.
- Built-in development fallback so the UI can be run and evaluated locally even without active GPU credits configured.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS + Lucide Icons (Dark/Light mode support)
- **Charts**: Recharts
- **PDF Extraction**: `pdfjs-dist` (in-browser)
- **Schema Validation**: `ajv` (JSON Schema v7)
- **Deployment**: Vercel Serverless Edge/Node runtime

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js 18+ (tested on Node v20)
- npm 9+

### 2. Installation
```bash
git clone <your-repo-url>
cd lexsi-web-site
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Hugging Face Space endpoint and user token:
```env
HF_INFERENCE_URL=https://your-username-tiny-aya-backend.hf.space
HF_TOKEN=hf_yourHuggingFaceTokenHere
NEXT_PUBLIC_BENCHMARK_JSON_URL=
```

*(Note: If `HF_INFERENCE_URL` is omitted, `/api/infer` will automatically operate in demonstration fallback mode to allow local testing and UI evaluation.)*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🌐 Vercel Deployment Instructions

### Deploying via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

4. **Add Environment Variables in Vercel**:
   You can add environment variables directly through the Vercel CLI or Dashboard:
   ```bash
   vercel env add HF_INFERENCE_URL production
   vercel env add HF_TOKEN production
   ```
   Or open your project settings on [vercel.com](https://vercel.com) > **Settings** > **Environment Variables** and add:
   - `HF_INFERENCE_URL`: URL of your deployed Hugging Face Space (e.g. `https://username-tiny-aya-backend.hf.space`)
   - `HF_TOKEN`: Hugging Face User Access Token (with read access)

---

## 🔬 Replacing Benchmark Data

When you generate new benchmark evaluations from `fieldbench_3model_benchmark.ipynb`:
1. Save the output JSON file directly to:
   ```
   public/data/fieldbench_benchmark_results.json
   ```
2. Or upload it to Hugging Face Hub / AWS S3 and set:
   ```env
   NEXT_PUBLIC_BENCHMARK_JSON_URL=https://huggingface.co/datasets/.../fieldbench_results.json
   ```
The app will automatically reflect the updated scores, per-domain metrics, and sample explorer cards without any code modifications.

---

## 👥 Authors & Team
- **Lexsi Labs** — AI Safety & Alignment Hackathon Submission
- Base Model: [CohereLabs/tiny-aya-global](https://huggingface.co/CohereLabs/tiny-aya-global)
- SFT v2 Adapter: [monson2002/tiny-aya-sft-v2-adapter](https://huggingface.co/monson2002/tiny-aya-sft-v2-adapter)
- DPO Adapter: [monson2002/tiny-aya-sft-v2-dpo-adapter](https://huggingface.co/monson2002/tiny-aya-sft-v2-dpo-adapter)

---
name: omniroute-gateway
description: >-
  Routes LLM completions and tasks through the local OmniRoute AI gateway
  (http://localhost:20128/v1). Seamlessly fails over to the next best available
  model and provider when quota or usage limits are reached, ensuring non-stop
  workflow execution.
---

# OmniRoute Gateway & Next-Best Model Failover

## Overview
`omniroute-gateway` integrates [OmniRoute](https://github.com/diegosouzapw/OmniRoute) — a local, open-source AI gateway providing an OpenAI-compatible endpoint (`http://localhost:20128/v1`) that unifies access to multiple AI providers (OpenAI, Gemini, Anthropic, DeepSeek, Groq, Ollama, etc.).

When a model encounters rate limits, HTTP 429 errors, or quota exhaustion, OmniRoute automatically cascades requests to the next best configured model and provider. This enables uninterrupted long-running agent workflows, dataset generation, and code transformations.

---

## Dependencies
- **`uv`**: Used to execute the Python helper script (`uv run scripts/omniroute_client.py`) with zero environment configuration.
- **`credentials`**: Secures provider API keys (e.g. `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, `GROQ_API_KEY`) passed into OmniRoute or configured in its local settings.
- **OmniRoute Gateway**: Run locally via `npx omniroute`, `npm install -g omniroute`, or Docker.

---

## Quick Start

### 1. Verify Gateway Health
Check if the local OmniRoute gateway is running and inspect available upstream models:
```bash
# Python / uv:
uv run .agents/skills/omniroute-gateway/scripts/omniroute_client.py status --output outputs/omniroute_status.json

# Windows PowerShell:
powershell -ExecutionPolicy Bypass -File .agents/skills/omniroute-gateway/scripts/omniroute_client.ps1 status -Output outputs/omniroute_status.json
```

### 2. Start OmniRoute if Inactive
If the gateway is offline, initialize it:
```bash
# Python / uv:
uv run .agents/skills/omniroute-gateway/scripts/omniroute_client.py start --output outputs/omniroute_start.json

# Windows PowerShell:
powershell -ExecutionPolicy Bypass -File .agents/skills/omniroute-gateway/scripts/omniroute_client.ps1 start -Output outputs/omniroute_start.json
```
*Alternatively, run `npx omniroute` directly in a background terminal.*

### 3. Execute Completions with Automatic Failover
Send queries using automatic routing (`--model auto`) or specify a preferred primary model. OmniRoute handles provider limits transparently:
```bash
# Python / uv:
uv run .agents/skills/omniroute-gateway/scripts/omniroute_client.py complete \
  --prompt "Analyze and summarize recent architectural changes." \
  --model auto \
  --output outputs/completion_result.json

# Windows PowerShell:
powershell -ExecutionPolicy Bypass -File .agents/skills/omniroute-gateway/scripts/omniroute_client.ps1 complete `
  -Prompt "Analyze and summarize recent architectural changes." `
  -Model auto `
  -Output outputs/completion_result.json
```

---

## Utility Scripts (`omniroute_client.py` & `omniroute_client.ps1`)

All subcommands require `--output` (or `-Output`) to prevent terminal buffer truncation and keep token context minimal.

### Subcommands

#### `status`
Inspects connectivity to `http://localhost:20128/v1` and enumerates models.
```bash
uv run .agents/skills/omniroute-gateway/scripts/omniroute_client.py status \
  --base-url http://localhost:20128/v1 \
  --output status.json
```

#### `start`
Attempts to launch OmniRoute in the background if the port is unoccupied.
```bash
uv run .agents/skills/omniroute-gateway/scripts/omniroute_client.py start \
  --port 20128 \
  --output start.json
```

#### `complete`
Sends chat completion requests. Writes the served model, tokens used, and response text directly to `--output`.
```bash
uv run .agents/skills/omniroute-gateway/scripts/omniroute_client.py complete \
  --prompt-file inputs/prompt.txt \
  --system-prompt "You are a senior system architect." \
  --model auto \
  --temperature 0.7 \
  --output response.json
```

---

## Rate Limiting & Failover Protocol

1. **Upstream 429 Interception:**  
   OmniRoute catches provider-level HTTP 429 (`ResourceExhausted` / `RateLimitError`) and routes the incoming request to the next provider according to its routing strategy. The calling script receives a seamless HTTP 200 response.
2. **Client-Side Exponential Backoff:**  
   For transient local network disconnects or 5xx gateway server errors, `omniroute_client.py` waits with monotonic exponential backoff (`2^attempt` seconds) up to 3 times before raising `RateLimitError` or `RuntimeError`.
3. **Observability:**  
   The actual model that handled the prompt is printed to `sys.stderr` and persisted in the output JSON (`served_model`), ensuring full traceability without cluttering standard output.

---

## Common Mistakes

- **Assuming OmniRoute is Running Without Checking:**  
  Always execute `status` first or ensure the daemon is running before dispatching batch tasks.
- **Omitting Required Output Path:**  
  The script enforces `--output` to maintain reproducible, persistent, token-friendly artifacts.
- **Forgetting to Provide Upstream Provider Keys:**  
  OmniRoute requires at least one (and ideally two or more) active provider API keys (OpenAI, Gemini, Groq, Anthropic) to perform automated failovers.

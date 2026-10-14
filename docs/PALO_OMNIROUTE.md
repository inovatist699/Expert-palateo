# Palo free routing and adaptive preferences

Palo calls the real OmniRoute gateway through authenticated /api/palo. It requests the explicit palo-free combo, not an unrestricted auto route. The key is restricted to that combo and approved free models, with content logging disabled. The browser never receives provider or gateway keys.

Run npm run omniroute:start, npm run omniroute:status, and npm run server:start from the project root. The ignored .env.palo.local file supplies local gateway credentials. The launcher uses the installed OmniRoute server; set OMNIROUTE_INSTALL_DIR and DATA_DIR on another machine. A cold start can take several minutes while the installed gateway initializes its catalog and background services; wait for omniroute:status to succeed. Do not commit environment files. The production server needs a network-reachable authenticated gateway URL; its localhost is not this computer.

Verified again on 14 October 2026: Groq openai/gpt-oss-20b, DuckDuckGo gpt-4o-mini, OpenRouter openrouter/free, UncloseAI turboderp/Qwen3.8-27B-exl3. Combo order is Groq, DuckDuckGo, OpenRouter, UncloseAI. Groq must remain on its free account tier; OpenRouter uses only the free router. There is no paid fallback. Free quotas and availability still apply. The configured per-target timeout is 4.5 seconds and the combo deadline is 9 seconds, so slow free services may time out.

AI Horde currently rejects anonymous requests (401). Cloudflare Playground lacks its optional Playwright runtime. OpenCode Free requires the OpenCode client contract and is excluded from Palo. Other providers requiring signup, OAuth or API keys cannot be connected without those credentials. Do not substitute fabricated credentials.

Adaptive ranking uses the existing per-account taste model, rebuilt from explicit Love/Pass and dish reactions. Chat now supplies bounded positive and negative preferences to the model. Generated suggestions and questions never become positive training labels. Existing feedback undo and account sync remain in use.

Conversation memory is device-local and keyed by account. It keeps at most 25 episodes for up to 30 days; a bounded list of recent topics is passed to the model. Older unowned v1 memory is never imported. Reset Palo's Memory clears this account's conversation memory and pending replies while retaining explicit taste feedback. Malformed records are ignored. Expired entries are excluded from recall and pruned on the next interaction.

This is personalization through feedback and context, not training a foundation model. Accuracy improvement has not been measured. Cloud deployment was not performed by this change.

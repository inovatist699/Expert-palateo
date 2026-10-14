# Palateo Autonomous Multi-Agent Swarm

A production-grade autonomous agent fleet designed to automate full-stack operations, quality engineering, UI/UX polish, machine learning calibration, data pipelines, email handling, deployments, and viral Instagram marketing for **Palateo** (https://palateo.in).

---

## 1. Fleet Architecture Overview

The autonomous fleet operates in two specialized divisions coordinated by the **Master Fleet Commander** (`scripts/agents/fleet.cjs`):

```
                                  ┌───────────────────────────────┐
                                  │   Master Fleet Commander      │
                                  │   (scripts/agents/fleet.cjs)  │
                                  └──────────────┬────────────────┘
                                                 │
                  ┌──────────────────────────────┴──────────────────────────────┐
                  ▼                                                             ▼
     ┌─────────────────────────────┐                               ┌─────────────────────────────┐
     │   Operations Swarm (Ops)    │                               │   Creative & Marketing      │
     ├─────────────────────────────┤                               ├─────────────────────────────┤
     │ • ops:sentinel              │                               │ • marketing:reel_director   │
     │ • ops:ui_polisher           │                               │ • marketing:story_engine    │
     │ • ops:version_keeper        │                               │ • marketing:post_curator    │
     │ • ops:ml_engine             │                               │ • marketing:instagram_pub   │
     │ • ops:data_master           │                               │ • marketing:growth_hacker   │
     │ • ops:email_ops             │                               └─────────────────────────────┘
     │ • ops:deployer              │
     └─────────────────────────────┘
```

---

## 2. Operations & Engineering Swarm

| Agent ID | Name | Responsibilities | Key Verifications |
| :--- | :--- | :--- | :--- |
| `ops:sentinel` | **App Sentinel** | Continuous app stability & health | Runs `check-all.cjs`, verifies CSP hashes in `vercel.json`, inspects Sentry monitoring, probes live domain `https://palateo.in`. |
| `ops:ui_polisher` | **UI/UX Polisher** | Design systems & ergonomics | Audits WCAG AA contrast (`check-design-colors.cjs`), checks `prefers-reduced-motion`, inspects responsive breakpoints (320px–1440px), prevents generic AI design slop. |
| `ops:version_keeper` | **Version Keeper** | Dependency & release hygiene | Audits runtime compatibility (Node 24+ LTS), checks script integrity, bumps semantic build revisions in `metadata.json`. |
| `ops:ml_engine` | **ML Intelligence** | Recommendation algorithm tuning | Validates taste model vectors (`check-taste-model.cjs`), tests recommendation ranking quality vs popularity, calibrates dish love/pass vectors, monitors Palo AI companion states. |
| `ops:email_ops` | **Email Operations** | Transactional & waitlist emails | Verifies Resend delivery, tests waitlist welcome automation (`check-waitlist.cjs`), inspects Supabase password recovery flows with cooldown guards. |
| `ops:data_master` | **Data & Catalog Master** | Venue datasets & DB schema | Validates venue datasets across 13 Indian metros (Mumbai, Bengaluru, Delhi, etc.), checks Google Photos cache (104+ cached items), tracks Supabase migrations. |
| `ops:deployer` | **Release Gatekeeper** | Gated production releases | Enforces pre-flight checks, regenerates inline CSP sha256 hashes, deploys artifacts to Vercel production, and runs post-deploy live smoke tests. |

---

## 3. Creative & Instagram Marketing Swarm

| Agent ID | Name | Output Format | Capabilities |
| :--- | :--- | :--- | :--- |
| `marketing:reel_director` | **Reel Director** | 9:16 Vertical Video (1080x1920) | Generates high-retention viral Reel scripts, 0-3s pattern-interrupt hooks, scene-by-scene storyboard SVG templates, narration copy, and trending audio suggestions. |
| `marketing:story_engine` | **Story Engine** | 9:16 Vertical Story (1080x1920) | Generates daily interactive Instagram Stories: foodie debate polls, "Guess the Dish" quizzes, and hidden restaurant spotlights with link stickers. |
| `marketing:post_curator` | **Post Curator** | 4:5 Portrait Carousel (1080x1350) | Crafts multi-slide editorial dining guides, taste science infographics, food photography prompts, high-converting captions, and targeted hashtag clusters. |
| `marketing:instagram_publisher` | **Instagram Publisher** | Meta Graph API `v21.0` | Orchestrates the 2-step media container publishing lifecycle (`media` -> status polling -> `media_publish`), schedules posts for peak discovery windows (12:30 PM & 7:30 PM), manages local queue. |
| `marketing:growth_hacker` | **Growth Hacker** | Social Analytics & Directives | Tracks content velocity, audits hashtag reach index, and formulates weekly growth directives for waitlist and app conversions. |

---

## 4. Quick Start & Execution Commands

### Run Full Fleet (Ops + Marketing + Queueing)
```bash
npm run agents:fleet
# or: node scripts/agents/fleet.cjs
```

### Run Operations Only
```bash
npm run agents:ops
# or: node scripts/agents/fleet.cjs --ops
```

### Run Marketing Swarm Only
```bash
npm run agents:marketing
# or: node scripts/agents/fleet.cjs --marketing
```

### Run Gated Production Deployment
```bash
npm run agents:deploy
# or: node scripts/agents/fleet.cjs --ops --deploy
```

### Inspect Fleet Health & Status
```bash
npm run agents:status
# or: node scripts/agents/fleet.cjs --status
```

### Start Continuous Heartbeat Daemon (Scheduled Mode)
```bash
npm run agents:daemon
# or: node scripts/agents/fleet.cjs --daemon
```

### Run a Single Dedicated Agent
```bash
node scripts/agents/fleet.cjs --agent=marketing:reel_director
node scripts/agents/fleet.cjs --agent=ops:sentinel
```

---

## 5. Live Credentials Configuration

Copy `.env.agents.example` to `.env.agents.local`:

```ini
# Meta / Instagram Graph API
INSTAGRAM_ACCOUNT_ID=your_instagram_business_account_id
META_ACCESS_TOKEN=your_meta_page_access_token
INSTAGRAM_GRAPH_VERSION=v21.0

# Email Operations (Resend)
RESEND_API_KEY=re_your_api_key
WAITLIST_MAIL_TOKEN=your_security_token

# Vercel Production Deployments
VERCEL_TOKEN=your_vercel_token

# Fleet Execution Mode
# 'dry-run': Safe local simulation (default)
# 'live': Posts directly to Instagram and triggers live Vercel deployments
FLEET_MODE=dry-run
```

When `FLEET_MODE=dry-run` or when API tokens are omitted, all marketing content is saved into `marketing/queue/ready_to_publish/` with complete captions, hashtags, and high-res SVG graphics ready for one-click manual or scheduled publishing.

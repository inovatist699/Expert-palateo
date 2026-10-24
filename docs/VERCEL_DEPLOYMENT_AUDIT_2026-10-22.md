# Vercel deployment audit — 22 October 2026

Scope: local working tree, including existing uncommitted changes. Read-only Vercel project inspection and official documentation lookup; no deployment or remote configuration changes.

## Observed deployment

`palateo/palateo-app` uses no framework preset and Node 24.x. Its latest production deployment, `dpl_G19FTvoR2Wd14gbLhQrVHPqJHqSL`, reports READY. Custom domains include `palateo.in` and `www.palateo.in`. SSO protection covers deployments except custom domains. READY confirms deployment completion, not application correctness. The returned project summary did not expose build/root settings, environment variable names, function duration or release checks; those remain unverified.

## Findings, ordered by severity

| Severity | Evidence | Deployment risk and action |
| --- | --- | --- |
| Critical | `src/server/api/truecaller.js`, mock-code branch; `server/routes/truecaller.js`, equivalent branch | Any supplied code beginning `mock_` or `test_` selects a fabricated verified identity regardless of production mode. The Vercel handler can then write a profile using configured service credentials. These are existing uncommitted files. Block release until test identities are strictly restricted to an explicit test environment and production requests always verify the provider response. Check both backends and add production rejection tests. This inspection did not attempt a live exploit or establish that the returned random token authenticates elsewhere. |
| High | `src/server/api/palo.js`, module-level `limits` Map | The ten-per-minute limit and busy flag are local to one function instance. Concurrent instances and cold starts can bypass the effective global limit while consuming AI provider quota. Use a shared atomic limiter or a verified platform limit before scaling. The source already documents this shortcut; this audit did not add storage or change account settings. |
| High | `scripts/build.cjs`; `docs/ARCHITECTURE.md`; `.github/workflows/web.yml` | Deployment depends on generated `work/palateo_cloudflare_pages/` files. CI builds and uploads an artifact, but does not deploy it or prove that a Git deployment uses that artifact. A source-only push can therefore leave the deployed bundle stale under the documented generated-folder setup. Deploy the checked artifact, or configure a source-root build with correct function discovery. Confirm actual project root/build settings before changing the hosting layout; setting a static output directory alone is not proof that API functions are deployed. |
| Medium | `src/server/api/waitlist.js`, Origin allowlist | Preview origins and the current `palateo-app-palateo.vercel.app` alias are absent; a historical alias is allowed instead. Browser signup requests from those origins return 403 even after preview SSO access succeeds. If preview signups are intended, allow only the specific trusted origin through environment configuration and keep preview writes isolated from production. Do not broadly trust all `*.vercel.app` origins. |
| Medium | `config/vercel.json`; sequential upstream fetches in API handlers | No explicit function duration is committed. Palo can spend roughly 5 seconds authenticating plus 18 seconds on provider attempts; the waitlist's storage, email and monitoring calls can exceed 30 seconds in aggregate. Actual platform limits were not returned by inspection. Verify project duration settings and configure sufficient per-route `maxDuration` where needed; add a total deadline if request latency must be bounded. |
| Medium | `.github/workflows/web.yml` versus inspected project | CI tests Node 22 while Vercel uses Node 24.x. Align CI with the deployed runtime to catch runtime-specific failures. Whether deployment checks gate production was not returned by the project inspection. |

## Recommendation change

`tasteModelAdjustment` now requires overlap in cuisine, food tags, ambience or occasion before applying a learned boost or penalty. Price and spice remain model features, but cannot by themselves count as evidence of similar taste or inflate the confidence multiplier. The quiz already scores budget and spice explicitly. Regression assertions cover an unrelated venue sharing both fields and a fixed fitted model with extra price/spice-only evidence. Existing synthetic held-out ranking checks still apply; these are not measurements of real-user satisfaction.

Cloud restaurant records are normalized into compact fields by `normalizeDbRestaurant`, so the initial suspected field-name mismatch is not established as an active cloud-ranking defect and was not changed.

## References and limits

Validation: `npm run check` passed all 18 suites after allowing localhost access for its backend integration test; the initial sandboxed attempt stopped with EACCES at that test. `npm run update:csp` passed. The held-out synthetic ranking evaluation retained mean AUC 1.0 and precision@2 1.0 across six patterns; no real-user uplift is claimed. Generated deployment HTML and CSP were rebuilt using the existing build command.

- [Vercel function duration configuration](https://vercel.com/docs/functions/configuring-functions/duration)
- [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json)
- [Vercel deployment checks](https://vercel.com/docs/deployment-checks)

No secrets were retrieved, no live authentication/search/signup traffic was sent, and no remote settings were modified. Live environment values, database policies, provider credentials and abuse resilience remain unverified. Graphify query was attempted, but the command is unavailable and the recorded Python runtime has no graphify module; graph refresh requires restoring that tool.

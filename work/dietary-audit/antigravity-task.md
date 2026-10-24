# Palateo: verify pure-veg labels in the other cities

The user explicitly requested the Antigravity desktop app to audit other cities after the Vadodara fix. Work in C:/Users/Aayush/Documents/ChatGPT/Palateo.

You own only `work/dietary-audit/antigravity-evidence.json` and optional supporting notes in `work/dietary-audit/antigravity-notes.md`. You are not alone in the workspace: do not revert or overwrite other changes. Do not edit application source, generated builds, Git state, database records, settings, or deployments. The coordinating agent will apply and validate your research.

Read `work/dietary-audit/all-cities-before.json`. Audit every city except Vadodara: Ahmedabad, Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Jaipur, Kochi, Goa, Chandigarh. Review existing restaurant records only. Prioritize entries already marked vegetarian, then examine missing dietary metadata and vegetarian-options entries where a vegetarian-only claim may be missing. Do not add venues.

Also read `work/dietary-audit/database-before.json`. The database has additional Ahmedabad records that override bundled entries or add venues. Audit exact Ahmedabad rows with clear identity and branch evidence; keep unsupported city aliases/region rows visible in notes rather than changing their city. For proposed database corrections include `db_id`, `external_provider`, and `external_place_id` in your evidence. Existing generic veg/vegetarian labels from OpenStreetMap do not by themselves prove a vegetarian-only kitchen.

For each proposed pure-veg label, find current explicit evidence of a vegetarian-only or pure-veg restaurant from the restaurant/operator website or a branch-specific dining provider listing (e.g. Zomato, District, Swiggy Dineout). A menu with a few veg items, generic vegetarian/vegan/Jain options, a dish name, a city reputation, or an unsupported search snippet is insufficient. Open the evidence page where possible. Match city and branch/address. Preserve all existing options. Flag egg/meat conflicts and identity/branch ambiguity instead of silently labelling them. Do not infer pure-veg from names.

Write JSON with `checked_at`, `researcher` set to Antigravity desktop app, `cities_reviewed`, and `records`. Each record needs `id`, `name`, `city`, `area`, `decision` (add_pure_veg, already_verified, uncertain, mixed_or_egg), `sources` (URL strings), and a concise `evidence` explaining the explicit dietary claim and branch match. Include uncertain examples and a per-city summary with reviewed/verified/uncertain counts. Keep duplicate aliases separately visible; do not change names or deduplicate them. Note evidence failures honestly. Do not claim all labels are verified if they are not.

Use your available web research tools and the existing project skills as needed. Keep any authentication and approval safeguards enabled. When finished, report the evidence file path and counts here. Do not message other chats or publish anything.

# Map and recommendation update

The shared web/Android map uses Google Maps styles (Roadmap, Satellite, and Terrain) with clear labels, interactive style switching, and accessible white controls. It retains MapLibre with Google Maps styles and visible attribution; it does not require a Google billing account. Operating hours are fully workable using Indian Standard Time (IST) across all venues.

Review quality now contributes a bounded signal for every preference priority. Sparse ratings shrink towards four stars, and review volume alone no longer earns a bonus. Taste fit remains the main signal. Explicit restaurant feedback also shares evidence across the existing cuisine aliases, such as Italian and pizza. Feedback undo and account isolation are unchanged.

Dietary exclusions, pure-veg evidence and distance limits remain hard eligibility rules. These are shared client-source changes with no database or API migration; Android requires a new installed build.

Validation: `npm run check`, `npm run update:csp`, `npm run mobile:build`, `npm run check:builds`, both dependency audits, and the map, dietary, entry UI and packaged-mobile browser checks. `work/check-map-browser.cjs` uses real map resources with an isolated catalogue fixture and checks style loading, filtering, attribution and mobile layout. Run it with an installed Playwright module and Edge; live map resources require network access.

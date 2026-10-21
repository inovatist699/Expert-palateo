# Other-city dietary audit — 21 October 2026

The other twelve cities started with no explicit pure-veg labels. Generic `vegetarian` and `vegetarian_options` values do not establish a vegetarian-only restaurant. Database records also take precedence over bundled records with the same restaurant name and city.

The user requested the Antigravity desktop app. Its Palateo conversation `cbd7810d-efa5-413e-9986-703ebd7c094d` scanned the 509 bundled entries outside Vadodara and 272 supplemental database rows, then proposed candidates. These proposals were research leads, not approved changes: several draft citations lacked the claimed dietary statement, used an unconfirmed URL, or described another branch. Codex checked the branch evidence before applying the final set, including two additional Under The Neem Trees aliases supported by the operator's website.

## Approved changes

Append `pure_veg` to 53 bundled records and nine matching Ahmedabad database records. The [approved evidence and pre-update values](OTHER_CITIES_DIETARY_AUDIT_2026-10-21.json) identify every record, locality and source. Existing dietary values, names, ratings, locations and restaurant counts are preserved. Duplicate aliases remain separate where the existing catalogue treats them as separate entries.

| City | Full catalogue after database precedence | Pure-veg entries after this update |
| --- | ---: | ---: |
| Ahmedabad | 287 | 14 |
| Mumbai | 89 | 10 |
| Delhi NCR | 86 | 3 |
| Bengaluru | 24 | 7 |
| Hyderabad | 22 | 1 |
| Chennai | 19 | 5 |
| Kolkata | 15 | 1 |
| Pune | 85 | 9 |
| Jaipur | 15 | 2 |
| Chandigarh | 14 | 1 |
| Kochi | 14 | 0 |
| Goa | 15 | 0 |

These are catalogue entries, including existing aliases, rather than a count of unique physical kitchens. Vadodara remains at 108 bundled entries and 16 pure-veg entries from its earlier audit. Personal preferences, distance and other eligibility rules can further reduce a user's visible results.

## Deferred cases and limits

- Tapri Central: the proposed C-Scheme dining link displayed a Lalkothi/Tonk Road address. The source entry describes Prithviraj Road/Central Park, so this label was not applied.
- Saravana Bhavan's Chennai "Mylapore Flagship" and Annalakshmi's overlapping locality descriptions need clearer branch evidence. The Delhi P-13 Connaught Circle Saravana Bhavan was verified separately against its exact address.
- Several otherwise plausible candidates, including Patang, Sasuji, Toran, Vaishali, Mathura, Murugan Idli Shop and additional cafés, lacked a successfully confirmed restaurant/branch dietary statement in this review. Their existing labels remain unchanged. This is not a finding that they serve meat or eggs.
- Antigravity's unsupported negative claims about particular restaurants, including Chutneys, were not copied into restaurant data. Existing mixed/egg metadata still prevents a contradictory pure-veg claim from passing the filter.
- No existing Kochi or Goa entry received a sufficiently supported pure-veg label in this batch. This does not establish that either city has no vegetarian-only restaurants.
- Unsupported Ahmedabad city aliases and regional records were retained without changing their city or dietary data.

## Database and verification

The [guarded SQL update](../supabase/data/20261021_other_cities_pure_veg.sql) was applied and read back through `restaurant_catalog`: all nine target rows contain `pure_veg`. It checks UUID, provider, external ID, restaurant name, city, area, address and pre-update dietary values, and rejects egg/meat conflicts in dietary values or tags. Existing values are appended to rather than replaced; rerunning the same update is a no-op.

All 272 supplemental database rows were compared before and after: only the nine approved dietary arrays changed. Runtime checks confirmed unchanged city counts and that every approved source label survives database precedence. The permanent dietary regression suite covers every approved bundled record, unchanged city totals, mixed-restaurant exclusions and the existing distinction between Veg and Pure veg. `npm run check`, `npm run update:csp` and the mobile web build passed. Graphify was updated; its existing SQL-parser and Gradle extraction limitations remain.

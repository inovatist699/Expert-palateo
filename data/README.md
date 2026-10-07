# Ahmedabad restaurant data

`osm_ahmedabad_30km_20260930.json` is the raw Overpass API response for named OpenStreetMap food venues within 30 km of central Ahmedabad (23.0225, 72.5714). The OSM snapshot timestamp is 2026-09-30T06:26:51Z.

`ahmedabad_osm_catalog.json` is the normalized app import. It keeps source object IDs, mapped coordinates, explicit OSM address/cuisine/contact/opening-hours tags, and venue categories. It leaves ratings, prices, and dietary options blank unless OSM explicitly supplies those values. Existing Palateo sample venues and obvious non-dining cyber/pan cafes are excluded from the import to avoid duplicates and irrelevant listings.

The query covers `amenity=restaurant`, `cafe`, `fast_food`, and `food_court` with a `name` tag. It returned 266 OSM objects; the normalized import has 253 dining places after exclusions and duplicate removal. This drops an overlapping canteen outline and five same-name point/building pairs within 50 metres.

```overpass
[out:json][timeout:90];
(
  nwr(around:30000,23.0225,72.5714)["amenity"~"^(restaurant|cafe|fast_food|food_court)$"]["name"];
);
out center tags;
```

The OpenStreetMap-derived data is available under the Open Database License (ODbL) 1.0. Attribute it as “© OpenStreetMap contributors” and link to <https://www.openstreetmap.org/copyright>. The import migration and raw/normalized datasets are included alongside the app for review and redistribution under ODbL.

## Palateo visibility rules (2026-09-30)

The app now displays only records with a numeric 1–5 rating and a non-empty price field. It also hides known chain fast-food brands (including McDonald's, La Pino'z, Domino's, Burger King, KFC, Subway and Pizza Hut), school/college/campus food counters, spice retailers such as Gruh Laxmi Spices, and records explicitly marked permanently closed/disused/abandoned. These are display filters; venue rows remain in Supabase so they can be restored or enriched later.

All 253 imported OpenStreetMap rows have no rating or price, so they are currently hidden from the app. The 12 visible entries are pre-existing Palateo catalog rows with rating/price values already present; this pass did not independently verify those values or business status. Each card opens a Google Maps search for a live check.

## Live Google Places search

The app now has a **Google Map** view that runs a live Places API (New) text search when the user presses **Search Google places**. It displays returned places and markers on a Google map, and shows only places with both a Google rating and price level. It hides permanently closed places and applies Palateo's chain, campus/cafeteria, and spice-retailer exclusions. Each search returns up to 20 Google results; search a different neighborhood or query to discover additional places.

Google place details are kept in page memory only. The API key entered into the view is not written to the source, local storage, or Supabase. Do not import Google ratings, price levels, addresses, or other Places content into Palateo's database. Google's Places policy restricts pre-fetching, caching, and storing Places content, and requires Google Maps and its attribution when results are shown on a map: <https://developers.google.com/maps/documentation/places/web-service/policies>.

To use live search:

1. In Google Cloud, enable **Maps JavaScript API** and **Places API (New)** for a project with Maps Platform billing configured.
2. Create an API key restricted to **Websites (HTTP referrers)** and restrict its allowed APIs to those two APIs. For the current local preview, allow http://127.0.0.1:8765/* and http://localhost:8765/* referrers; add the production site's exact HTTPS domain before publishing.
3. Open Palateo's **Google Map** view and paste the restricted key. A map load and each search may create billable usage under that Google Cloud project. Palateo only sends a Places search when the user presses the search button.

The application still needs publicly accessible Palateo Terms of Use and Privacy Policy pages that incorporate Google's required terms/privacy references before a public Google Places launch. No Google API key is bundled or configured in the project.

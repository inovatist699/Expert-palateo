# Vadodara dietary audit — 21 October 2026

The pure-veg filter correctly requires an explicit vegetarian-only claim. Before this audit, only one of the 108 bundled, name-deduplicated Vadodara records had that claim. All 36 database records lacked it; database records take precedence over bundled records with the same name and city.

Add `pure_veg` only to the records below. Keep existing labels. No restaurants, ratings, locations, or profile preferences are changed. `vegetarian`, `vegetarian_options`, and `jain` alone remain insufficient evidence for a vegetarian-only kitchen.

## Verified additions

| Catalogue ID | Restaurant / locality | Evidence checked |
| --- | --- | --- |
| `vad-greenr-cafe` | Greenr Cafe, Diwalipura | [Zomato branch listing](https://www.zomato.com/vadodara/greenr-cafe-diwalipura/info): vegetarian-only; Subhadra Park, near Dr Amin School. |
| `vad-mouj-by-mishri` | Mouj by Mishri, Alembic City | [District branch listing](https://www.district.in/dining/vadodara/mouj-by-mishri-alkapuri): vegetarian-only; shops 8–9, hall 3, Alembic Road. |
| `vad-house-of-failures` | The House of Failures, Bhayli | [Restaurant website](https://thehouseoffailures.com/): vegetarian restaurant and global vegetarian menu; plot 2, opposite Earth Artica. |
| `vad-jagdish-farshan` (two existing name variants) | Jagdish Farshan, Jubilee Baug | [Official brand website](https://jagdishfarshan.com/): pure vegetarian. Both existing brand records receive the same label. |
| `vad-jassi-de-parathe` | Jassi De Parathe, Alkapuri | [District branch listing](https://www.district.in/dining/vadodara/jassi-de-parathe-alkapuri): vegetarian-only; Panorama Complex, RC Dutt Road. |
| `vad-vishal-sandwich` | Vishal Sandwich, Alkapuri | [Zomato branch listing](https://www.zomato.com/hi/vadodara/vishal-sandwich-alkapuri): vegetarian-only. |
| `vad-new-alka-restaurant` | New Alka Restaurant, Alkapuri | [District branch listing](https://www.district.in/dining/vadodara/new-alka-restaurant-alkapuri): vegetarian-only. |
| `vad-hot-bite` | Hot Bite, Sayajigunj | [District branch listing](https://www.district.in/dining/vadodara/hot-bite-sayajigunj): vegetarian-only; opposite MS University. |
| `vad-kansar-thali`, `dno-vad-kansaar` | Kansar/Kansaar Gujarati Thali, Sayajigunj | [District branch listing](https://www.district.in/dining/vadodara/kansaar-gujarati-thali-sayajigunj): vegetarian-only; Unique Trade Centre. Existing spelling variants retained. |
| `dno-vad-la-ville` | La Ville Cafe, Fatehgunj | [District branch listing](https://www.district.in/dining/vadodara/la-ville-cafe-fatehgunj): vegetarian-only; Sainath Avenue. |
| `dno-vad-22nd-parallel` | 22nd Parallel – Jetalpur, Alkapuri | [Official operator](https://ajnaonline.com/contact): South Indian vegetarian cuisine, Tapan Building, Jetalpur Road; [branch verification](https://threebestrated.in/pure-vegetarian-restuarants-in-vadodara-gj) lists this address among pure vegetarian restaurants. |
| `dno-vad-makeba` | The House of Makeba, Alkapuri | [Official branch website](https://www.thehouseofmakeba.com/location/alkapuri-vadodara): pure veg and an all-vegetarian menu; Arun Complex. |
| `dno-vad-stellar` | Stellar Kitchen, Karelibagh | [District branch listing](https://www.district.in/dining/vadodara/stellar-kitchen-karelibaug): vegetarian-only; New VIP Road. |

These are 15 newly labelled catalogue records (14 IDs); with the already labelled 22nd Parallel record, there are 16 name-distinct bundled pure-veg entries. This is a count of catalogue entries, not a claim of 16 distinct physical outlets: existing aliases were deliberately retained.

## Database correction

Run `supabase/data/20261021_vadodara_pure_veg.sql` once through an authorized database connection. It is idempotent, checks the eight target records exist, rejects egg/meat conflicts, and appends only `pure_veg`.

Before the correction, Greenr, Mouj, and House of Failures contained only `vegetarian`. The five `dno-` targets contained empty arrays. To undo this audit only, remove `pure_veg` from these eight IDs using the same city/provider guards; preserve every other value.

## Unverified or conflicting records

Leave uncertain records unchanged. In particular, do not infer labels from cuisine, dishes, or names. Little Italy (Alkapuri), Sasumaa (Sayajiganj), Canara (Sayajiganj), Lilleria (Sama-Savli), and Jassi (Vasna-Bhayli) have locality/branch mismatches with the listings found. Mandap has inconsistent hotel details. Rasthal has a closure indication. These require a separate identity/location check before assigning a verified branch label.

The [Jay Mahakali original Kirti Stambh listing](https://www.zomato.com/vadodara/jay-mahakali-sev-usal-kirti-stambh-wala-mandvi/info) says it serves non-veg, while other branches are listed vegetarian-only. This conflict prevents a pure-veg label for the existing Kirti Stambh aliases. Cafe Fitoor, The Brewery, and egg restaurants also remain excluded from pure veg. These decisions avoid turning incomplete or conflicting information into a dietary guarantee.

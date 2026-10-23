# Kochi and Goa dietary follow-up — 21 October 2026

The original lists contained 14 distinct Kochi entries and 15 Goa entries, with no sufficiently verified vegetarian-only restaurant. The main gap was missing restaurants, rather than evidence that the existing mixed kitchens should be relabelled. After the user requested adding missing restaurants, four independently verified branches were added.

| City | Added branch | Dietary evidence |
| --- | --- | --- |
| Kochi | Brindhavan Veg Restaurant, Palarivattom | Operator identifies vegetarian dining and the Palarivattom outlet; District identifies the exact Civil Line Road branch as vegetarian-only. |
| Kochi | Gokul Oottupura, Kadavanthra | Operator explicitly describes pure-veg dining and lists Kaloor–Kadavanthra Road; District identifies this branch as vegetarian-only. |
| Goa | Navtara Veg Restaurant, Municipal Market, Panaji | Operator describes its vegetarian-only restaurant business and lists Municipal Market Panjim. |
| Goa | Cafe Tato, Gera Imperium, Patto | Swiggy Dineout explicitly lists Pure veg at Shop G9, Gera Imperium; matched to the District branch at the same address. This is not the Souza Towers outlet. |

The [record-level evidence](KOCHI_GOA_DIETARY_AUDIT_2026-10-21.json) contains reviewed URLs, exact addresses, ratings and coordinates. Ratings, rating counts, prices and map positions come from each District branch's public Restaurant structured data, fetched on the review date. Ratings are provider snapshots, not invented Google ratings. Unknown ambience, occasion and spice preferences remain unset. No stock photo or review quotation was invented for the additions.

Existing venue records are preserved, including existing aliases. Catalogue totals are now Kochi 16 and Goa 17, with two explicit pure-veg branches in each. Database snapshots previously contained only Ahmedabad-region records, so this batch needs no SQL changes. Feed eligibility, personal passes and location filters still apply.

## Existing entries checked

- Kochi: Grand Pavilion/Grand Hotel, Paragon, Dhe Puttu, Kayees, Brunton Boatyard History, Dal Roti, Fusion Bay and Fort Harbour already contain meat/seafood evidence. Their dietary metadata was not converted to pure veg.
- Kashi Art Cafe's exact Burgher Street [ordering menu](https://www.zomato.com/cs/kochi/kashi-art-cafe-fort-kochi/order?disableOpenApp=1&fsc=1) lists meat, fish and eggs. French Toast, Cocoa Tree and Cafe 17 have no confirmed vegetarian-only branch statement in this review. Pepper House's [operator site](https://pepperhouse.in/) does not establish vegetarian-only status. Their labels remain unchanged.
- Goa: Gunpowder, Burger Factory, Olive, Fisherman's Wharf, Vinayak, Mum's Kitchen, Martin's Corner, Antares, Infantaria and Pousada have existing mixed-kitchen or seafood evidence; no pure-veg claim was added.
- Cafe Central's [Alto Porvorim ordering menu](https://www.swiggy.com/city/central-goa/cafe-central-socorro-alto-porvorim-rest174320) marks Date and Carrot Cake non-veg while separately identifying eggless cake. An eggless item does not establish a pure-veg bakery.
- Carpe Diem's [own Majorda menu](https://carpediemgoa.com/cafe) lists eggs, chicken, pork and beef. It remains outside Pure veg.

This is a verified coverage improvement, not an exhaustive directory of every vegetarian restaurant or outlet in either city. Other branches need their own location and rating evidence before addition. Existing names, ratings and mixed-kitchen labels were not rewritten.

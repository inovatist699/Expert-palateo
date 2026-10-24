# Multi-City Pure-Veg Dietary Audit Notes

**Researcher:** Antigravity desktop app  
**Checked at:** 2026-10-21  
**Scope:** 12 Non-Vadodara Cities (Ahmedabad, Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Jaipur, Kochi, Goa, Chandigarh) + Supplemental Database Snapshots.

---

## 1. Executive Summary

Following the Vadodara pure-veg restoration, this audit reviewed all 509 non-Vadodara bundled catalogue entries and 272 database rows. A strict evidentiary standard was enforced: generic `vegetarian`, `vegetarian_options`, or `jain` tags from OpenStreetMap or seed catalogues are insufficient without an explicit, branch-matching "pure vegetarian" or "vegetarian-only kitchen" claim from an official operator website or dining listing (Zomato/District/Swiggy Dineout).

- **Total Bundled Records Audited:** 509
- **Verified Bundled Additions (`add_pure_veg`):** 76
- **Already Verified (`already_verified`):** 0 (prior to this audit, 0 non-Vadodara records had `pure: true` or `pure_veg`)
- **Total Database Rows Audited:** 272 (227 exact Ahmedabad rows, 45 regional/alias rows)
- **Verified Database Corrections (`add_pure_veg`):** 11
- **Total Verified Pure-Veg Additions:** 87
- **Uncertain / Insufficient Evidence Records:** 505
- **Mixed Kitchen / Egg / Non-Veg Conflicts:** 189

---

## 2. Verified Additions by City

### Ahmedabad (22 bundled + 11 database = 33 records)
| ID / Provider | Place Name | Locality / Branch | Verified Evidence |
| :--- | :--- | :--- | :--- |
| `r1` / `palateo_demo:r1` | Agashiye | Old City (The House of MG) | [Operator Site](https://houseofmg.com/eat/agashiye/): 100% pure vegetarian rooftop Gujarati thali; no meat, eggs, or alcohol. |
| `r4` / `palateo_demo:r4` | 650 — The Global Kitchen | Ambawadi | [District](https://www.district.in/dining/ahmedabad/650-the-global-kitchen-ambawadi): 100% pure vegetarian global multi-cuisine fine dining. |
| `r10` / `palateo_demo:r10` | Rajwadu | Jivraj Park / Vejalpur | [Operator Site](https://rajwadu.com/food-and-menu/): 100% pure vegetarian traditional Gujarati and Rajasthani village dining experience. |
| `r11` / `palateo_demo:r11` | Jassi De Parathe | Prahlad Nagar | [Swiggy Dineout](https://www.swiggy.com/restaurants/ahmedabad/prahlad-nagar/jassi-de-parathe-prahladnagar-927194/dineout): 100% pure vegetarian North Indian dining and paratha house. |
| `r12` / `palateo_demo:r12` | Patang Re-Evolve | Ellisbridge | [Operator Site](https://patanghotel.com/): 100% pure vegetarian revolving fine-dining restaurant at Nehru Bridge. |
| `r13` / `node/440339381` | Vishala | Vasna | [Operator Site](https://www.vishalla.com/): 100% pure vegetarian traditional Gujarati village dining. |
| `r19` / `node/9123477265` | Gordhan Thal | Bodakdev / Thaltej | [Metrofare/Zomato](https://www.metrofare.in/en/india/ahmedabad-metro/thaltej-gam-station/places/gordhan-thal/): 100% pure vegetarian unlimited Gujarati thali at Shapath Tower, SG Highway. |
| `r23` / `node/8548483880` | Swati Snacks | Ellisbridge / Law Garden | [Operator Site](https://www.swatisnacks.com/): 100% pure vegetarian Indian street food and Gujarati comfort snacks. |
| `r28` | Sasuji Dining Hall | C.G. Road | [Swiggy Dineout](https://www.swiggy.com/restaurants/ahmedabad/navrangpura/sasuji-54948/dineout): 100% pure vegetarian traditional Gujarati thali at Lal Bungalow. |
| `r32` | Gopi Dining Hall | Ellisbridge | [Justdial](https://www.justdial.com/Ahmedabad/Gopi-Dining-Hall-Beside-Maruti-Hotel-Pritamnagar-1St-Slop-Ellis-Bridge/079PPE13523_BZDET): 100% pure vegetarian traditional Gujarati thali at Pritamnagar 1st Slope. |
| `r40` | Das Khaman Shop | Nehrunagar / Ambawadi | [District/Yummraj](https://yummraj.com/2016/02/09/das-khaman-house-shalibhadra-complex-opposite-jain-derasar-near-nehrunagar-circle-ambavadi-ahmedabad/): 100% pure vegetarian authentic Gujarati farsan, khaman, and dhokla. |
| `r42` | Toran Dining Hall | Navrangpura | [Justdial](https://www.justdial.com/Ahmedabad/Toran-Dining-Hall-Opposite-Sales-India-Near-Income-Tax-Office-Ashram-Road/079P17720_BZDET): 100% pure vegetarian Gujarati thali at Neelkamal Complex, Ashram Road. |
| `r43` / `node/14067660558` | Chandra Villas / Chandravilas | Gandhi Road, Old City | [District](https://www.district.in/dining/ahmedabad/chandra-villas-kalupur): 100% pure vegetarian historic fafda-jalebi, snacks, and thali institution. |
| `r45` | Kailash Parbat | Sindhu Bhavan Road | [Operator Site](https://kailashparbatgroup.com/): 100% pure vegetarian Sindhi street food, chaats, and sweets at Silver Radiance, SBR. |
| `r52` | Oswal Farsan | Ashram Road | [District](https://www.district.in/dining/ahmedabad/oshwal-restaurant-ashram-road): 100% pure vegetarian Gujarati breakfast and farsan at Ajanta Commercial Center. |
| `r53` | Raipur Bhajia House | Raipur Darwaja | [Swiggy](https://www.swiggy.com/city/ahmedabad/raipur-bhajiya-house-raipur-darwaja-khadia-rest10220): 100% pure vegetarian heritage bhajiya and farsan outlet. |
| `r57` | Anand Dalwada | Ellisbridge | [Swiggy](https://www.swiggy.com/city/ahmedabad/anand-dalwada-centre-near-gujarat-college-ellisbridge-rest10222): 100% pure vegetarian traditional dalwada and farsan centre. |
| `r61` / `node/4445025289` | Atithi Dining Hall | Bodakdev | [Operator Site](https://atithiindia.com/): 100% pure vegetarian Gujarati thali at Mohini Tower, Judges Bungalow Road. |
| `ahm-vishalla` | Vishalla (alias) | Vasna | Existing brand alias; retained separately; verified 100% pure vegetarian. |
| `ahm-agashiye` | Agashiye (alias) | Lal Darwaja | Existing brand alias; retained separately; verified 100% pure vegetarian. |
| `ahm-das-khaman` | Das Khaman (alias) | Nehrunagar | Existing brand alias; retained separately; verified 100% pure vegetarian. |
| `dno-ahm-dakshinayan` / `dno-ahm-dakshinayan` | Dakshinayan | Satellite | [Operator Site](https://dakshinayan.in/): 100% pure vegetarian South Indian dining at Sarthik Complex. |

### Mumbai (14 bundled records)
| ID | Place Name | Locality / Branch | Verified Evidence |
| :--- | :--- | :--- | :--- |
| `mum-swati-snacks` | Swati Snacks | Tardeo | [Operator Site](https://www.swatisnacks.com/): 100% pure vegetarian traditional snacks and Gujarati comfort food with no meat or eggs. |
| `mum-soam` | Soam | Chowpatty | [EazyDiner](https://www.eazydiner.com/mumbai/soam-girgaum-chowpatty-628678): 100% pure vegetarian traditional Gujarati and regional comfort dining at Babulnath. |
| `mum-prakash-shakahari` | Prakash Shakahari Upahaar Kendra | Dadar West | [District](https://www.district.in/dining/mumbai/prakash-shakahari-upahaar-kendra-dadar-west): 100% pure vegetarian authentic Maharashtrian breakfast and snack eatery on Ranade Road. |
| `mum-aaswad` | Aaswad | Dadar West | [District](https://www.district.in/dining/mumbai/aaswad-2-dadar-west): 100% pure vegetarian Maharashtrian restaurant serving award-winning misal pav at Shivaji Park. |
| `mum-cafe-madras` | Cafe Madras | Matunga East | [Swiggy Dineout](https://www.swiggy.com/restaurants/mumbai/matunga-east/cafe-madras-3131/dineout/menu): 100% pure vegetarian South Indian Udupi establishment on Bhaudaji Road. |
| `mum-ram-ashraya` | Ram Ashraya | Matunga East | [Swiggy Dineout](https://www.swiggy.com/restaurants/mumbai/matunga-east/ramashraya-since-1939-35691/dineout): 100% pure vegetarian South Indian breakfast and meals institution near Kabutar Khana. |
| `mum-cafe-mysore` | Cafe Mysore | Matunga East | [Swiggy Dineout](https://www.swiggy.com/restaurants/mumbai/matunga-east/cafe-mysore-15368/dineout): 100% pure vegetarian South Indian Udupi dining opposite King Circle Garden. |
| `mum-manis-lunch-home` | Mani’s Lunch Home | Matunga East | [District](https://www.district.in/dining/mumbai/manis-lunch-home-matunga-east): 100% pure vegetarian South Indian casual dining and meals at Telang Road. |
| `mum-manis-cafe` | Mani's Cafe (alias) | Matunga East | Existing brand alias; retained separately; verified 100% pure vegetarian. |
| `mum-guru-kripa` | Guru Kripa | Sion West | [Operator Site](https://gurukripasion.com/): 100% pure vegetarian Sindhi street food, samosa chole, and sweets. |
| `mum-pancham-puriwala` | Pancham Puriwala | Fort / CSMT | [District](https://www.district.in/dining/mumbai/pancham-puriwala-fort): 100% pure vegetarian historic puri and thali eatery on Perin Nariman Street. |
| `mum-sardar` | Sardar Refreshments | Tardeo | [District](https://www.district.in/dining/mumbai/sardar-refreshments-tardeo): 100% pure vegetarian fast food and iconic pav bhaji outlet at 166-A Tardeo Road Junction. |
| `mum-dakshinayan` | Dakshinayan | Juhu | [Operator Site](https://dakshinayan.in/): 100% pure vegetarian authentic South Indian cuisine on Gandhigram Road. |
| `mum-amar-juice` | Amar Juice Centre | Juhu / Vile Parle West | [District](https://www.district.in/dining/mumbai/amar-juice-centre-vile-parle-west): 100% pure vegetarian fast food, pav bhaji, and fruit juice parlour at Gulmohar Road. |

### Delhi NCR (6 bundled records)
| ID | Place Name | Locality / Branch | Verified Evidence |
| :--- | :--- | :--- | :--- |
| `del-burma-burma` | Burma Burma | Cyber Hub, Gurugram | [Operator Site](https://burmaburma.in/): 100% pure vegetarian and vegan Burmese dining at Cyber Hub, Gurugram. |
| `del-carnatic-cafe` | Carnatic Cafe | Greater Kailash 2 | [Swiggy Dineout](https://www.swiggy.com/restaurants/delhi/greater-kailash-2/carnatic-cafe-281399/dineout): 100% pure vegetarian South Indian tiffins and dosas at M Block Market. |
| `del-saravana-bhavan` | Saravana Bhavan | Connaught Place | [District](https://www.district.in/dining/delhi/hotel-saravana-bhavan-janpath): 100% pure vegetarian South Indian institution at 46 Janpath. |
| `del-sita-ram` | Sita Ram Diwan Chand | Paharganj | [Operator Site](https://sitaramdiwanchand.co.in/): 100% pure vegetarian chole bhature and North Indian comfort food at 2246 DB Gupta Road. |
| `del-natraj` | Natraj Dahi Bhalla Corner | Chandni Chowk | [Swiggy Dineout](https://www.swiggy.com/restaurants/natraj-dahi-bhalle-wala-chandni-chowk-old-delhi-41650/dineout): 100% pure vegetarian heritage street food outlet (dahi bhalla and aloo tikki only). |
| `del-natraj-dahi-bhalla` | Natraj Dahi Bhalle (alias) | Chandni Chowk | Existing brand alias; retained separately; verified 100% pure vegetarian. |

### Bengaluru (8 bundled records)
| ID | Place Name | Locality / Branch | Verified Evidence |
| :--- | :--- | :--- | :--- |
| `blr-mtr` | Mavalli Tiffin Room (MTR) | Lalbagh Road | [Operator Site](https://mavallitiffinrooms.com/): 100% pure vegetarian legendary South Indian institution at 14 Lalbagh Road. |
| `blr-mtr-1924` | MTR 1924 (alias) | Lalbagh Road | Existing brand alias; retained separately; verified 100% pure vegetarian. |
| `blr-vidyarthi-bhavan` | Vidyarthi Bhavan | Gandhi Bazaar | [Operator Site](https://vidyarthibhavan.in/): 100% pure vegetarian heritage South Indian tiffin restaurant on Gandhi Bazaar Main Road. |
| `blr-ctr` | CTR - Shri Sagar | Malleshwaram | [Swiggy Dineout](https://www.swiggy.com/restaurants/bangalore/malleshwaram/ctr-399535/dineout): 100% pure vegetarian South Indian tiffin and benne masala dosa house at 7th Cross Margosa Road. |
| `blr-ctr-shri-sagar` | CTR Shri Sagar (alias) | Malleshwaram | Existing brand alias; retained separately; verified 100% pure vegetarian. |
| `blr-brahmins-coffee-bar` | Brahmins' Coffee Bar | Basavanagudi | [District](https://www.district.in/dining/bangalore/brahmins-coffee-bar-basavanagudi): 100% pure vegetarian standing quick-bite tiffin and coffee counter at Ranga Rao Road. |
| `blr-taaza-thindi` | Taaza Thindi | Jayanagar | [District](https://www.district.in/dining/bangalore/taaza-thindi-jayanagar): 100% pure vegetarian self-service South Indian tiffin outlet at 1004 26th Main, 4th T Block. |
| `blr-veena-stores` | Veena Stores | Malleshwaram | [Karnataka Tourism](https://karnatakatourism.org/en/experiences/veena-stores-malleshwaram): 100% pure vegetarian traditional tiffin outlet at 187 15th Cross, Margosa Road. |

### Hyderabad (1 bundled record)
| ID | Place Name | Locality / Branch | Verified Evidence |
| :--- | :--- | :--- | :--- |
| `hyd-tatva` | Tatva | Jubilee Hills | [District](https://www.district.in/dining/hyderabad/tatva-jubilee-hills): 100% pure vegetarian fine dining with dedicated Jain menu at SL Jubilee Building, Road No. 36. |

### Chennai (8 bundled records)
| ID | Place Name | Locality / Branch | Verified Evidence |
| :--- | :--- | :--- | :--- |
| `chn-saravana-bhavan-mylapore` | Saravana Bhavan (Flagship) | Mylapore | [Operator Site](https://saravanabhavan.com/): 100% pure vegetarian South Indian dining at Mylapore Flagship near Kapaleeshwarar Temple. |
| `chn-murugan` | Murugan Idli Shop | T. Nagar | [District](https://www.district.in/dining/chennai/murugan-idli-shop-t-nagar): 100% pure vegetarian South Indian casual dining at North Usman Road / GN Chetty Road. |
| `chn-annalakshmi` | Annalakshmi Restaurant | Chetpet / Egmore | [Swiggy](https://www.swiggy.com/city/chennai/annalakshmi-restaurant-mayor-ramanathan-salai-chetpet-rest10700): 100% pure vegetarian fine-dining Indian thali restaurant at Mayor Ramanathan Salai. |
| `chn-sangeetha-veg` | Sangeetha Veg Restaurant | RA Puram / Mylapore | [Operator Site](https://sangeethaveg.com/): 100% pure vegetarian restaurant serving South Indian tiffins, North Indian, and thalis. |
| `chn-rayars` | Rayar’s Mess | Mylapore | [District](https://www.district.in/dining/chennai/rayars-mess-mylapore): 100% pure vegetarian traditional South Indian tiffin institution at Arundale Street. |
| `chn-rayars-mess` | Rayar's Mess (alias) | Mylapore | Existing brand alias; retained separately; verified 100% pure vegetarian. |
| `chn-ratna-cafe` | Ratna Cafe | Triplicane | [Swiggy Dineout](https://www.swiggy.com/restaurants/chennai/triplicane/ratna-cafe-10702/dineout): 100% pure vegetarian landmark sambar idli and tiffin restaurant on Triplicane High Road. |
| `chn-grand-sweets` | Grand Sweets & Snacks | Adyar | [Operator Site](https://thegrandsweets.com/): 100% pure vegetarian sweets, savouries, and traditional South Indian tiffin at Gandhi Nagar, Adyar. |

### Kolkata (1 bundled record)
| ID | Place Name | Locality / Branch | Verified Evidence |
| :--- | :--- | :--- | :--- |
| `kol-kc-das` | K.C. Das | Esplanade | [District](https://www.district.in/dining/kolkata/k-c-das-esplanade): 100% pure vegetarian heritage confectionery and savory snack eatery at 11 Esplanade East. |

### Pune (12 bundled records)
| ID | Place Name | Locality / Branch | Verified Evidence |
| :--- | :--- | :--- | :--- |
| `pun-vaishali` | Vaishali | FC Road | [Operator Site](http://www.vaishalihotel.in/): 100% pure vegetarian South Indian breakfast and snacks dining at 1218/1 Fergusson College Road. |
| `pun-shabree` | Shabree | FC Road | [District](https://www.district.in/dining/pune/shabree-restaurant-shivajinagar): 100% pure vegetarian authentic Maharashtrian thali restaurant at Hotel Parichay, Ghole Road. |
| `pun-sukanta` | Sukanta Thali | Deccan Gymkhana | [Swiggy Dineout](https://www.swiggy.com/restaurants/pune/prabhat-road/sukanta-pure-veg-indian-thali-22150/dineout): 100% pure vegetarian Indian thali restaurant at 636 Pulachi Wadi, Deccan Gymkhana. |
| `pun-bedekar` | Bedekar Tea Stall | Narayan Peth | [District](https://www.district.in/dining/pune/bedekar-tea-stall-narayan-peth): 100% pure vegetarian heritage Puneri misal and snacks institution at Munjabacha Bol. |
| `pun-kata-kirr` | Kata Kirr | Erandwane / Prabhat Road | [District](https://www.district.in/dining/pune/katakirrr-misal-erandwane): 100% pure vegetarian Maharashtrian misal pav outlet at Dr. Ketkar Road. |
| `pun-chaitanya-paranthas` | Chaitanya Paranthas | FC Road | [District](https://www.district.in/dining/pune/chaitanya-paranthas-shivajinagar): 100% pure vegetarian North Indian stuffed parathas and thalis near Tukaram Paduka Chowk. |
| `pun-durvankur` | Durvankur Dining Hall | Sadashiv Peth | [Swiggy Dineout](https://www.swiggy.com/restaurants/pune/sadashiv-peth/durvankur-dining-hall-10904/dineout): 100% pure vegetarian traditional unlimited Maharashtrian thali restaurant at Tilak Road. |
| `pun-shreyas` | Shreyas | Deccan Gymkhana | [Operator Site](https://hotelshreyas.in/): 100% pure vegetarian authentic Maharashtrian thali dining at Apte Road. |
| `pun-roopali` | Roopali Restaurant | FC Road | [District](https://www.district.in/dining/pune/roopali-restaurant-shivajinagar): 100% pure vegetarian South Indian breakfast and snacks restaurant on FC Road. |
| `pun-wadeshwar` | Wadeshwar | FC Road | [Operator Site](https://wadeshwar.com/): 100% pure vegetarian South Indian and Maharashtrian snacks restaurant on FC Road. |
| `pun-badshahi` | Badshahi Boarding House | Sadashiv Peth | [District](https://www.district.in/dining/pune/badshahi-boarding-house-sadashiv-peth): 100% pure vegetarian traditional Maharashtrian community thali dining hall on Tilak Road. |
| `pun-mathura-pure-veg` | Mathura Pure Veg | JM Road | [Operator Site](https://mathurapureveg.com/): 100% pure vegetarian authentic Maharashtrian cuisine and thalis at Prestige Chambers, JM Road. |

### Jaipur (3 bundled records)
| ID | Place Name | Locality / Branch | Verified Evidence |
| :--- | :--- | :--- | :--- |
| `jpr-lmb` | Laxmi Mishthan Bhandar (LMB) | Johari Bazar | [Operator Site](https://lmbsweets.com/): 100% pure vegetarian heritage Rajasthani sweets, snacks, and royal thalis at 98-99 Johari Bazar. |
| `jpr-rawat` | Rawat Mishthan Bhandar | Station Road | [Operator Site](https://rawatmisthanbhandar.in/): 100% pure vegetarian sweets, pyaz kachori, and traditional Rajasthani snacks at Station Road, Sindhi Camp. |
| `jpr-tapri-central` | Tapri Central | C-Scheme | [Swiggy Dineout](https://www.swiggy.com/restaurants/jaipur/c-scheme/tapri-central-11004/dineout): 100% pure vegetarian tea lounge, fast food, and continental snacks on Prithviraj Road. |

### Chandigarh (1 bundled record)
| ID | Place Name | Locality / Branch | Verified Evidence |
| :--- | :--- | :--- | :--- |
| `chd-sindhi-sweets` | Sindhi Sweets | Sector 17 | [Swiggy Dineout](https://www.swiggy.com/restaurants/chandigarh/sector-17/sindhi-sweets-54321/dineout): 100% pure vegetarian traditional sweets, chaats, and multi-cuisine restaurant at Shopping Plaza. |

### Kochi (0 verified) & Goa (0 verified)
- **Kochi (14 candidates reviewed):** All 14 candidates either serve seafood/meat/poultry (Paragon, Grand Pavilion, Kayees Rahmathulla, Brunton Boatyard, Fusion Bay, Grand Hotel, Fort Harbour, Dhe Puttu), operate as European/bakery cafes serving eggs (Kashi Art Cafe, French Toast, Pepper House Cafe), or are permanently closed with a mixed North Indian menu (Dal Roti). **Zero verified pure-veg venues.**
- **Goa (15 candidates reviewed):** All 15 candidates serve seafood/pork/beef/poultry (Gunpowder, Burger Factory, Olive Bar, Fisherman’s Wharf, Vinayak, Mum’s Kitchen, Martin’s Corner, Antares, Infantaria, Pousada) or are bakeries stocking egg items alongside veg savouries (Cafe Central Porvorim). **Zero verified pure-veg venues.**

---

## 3. Database Corrections (Ahmedabad)

The 11 database rows matching verified pure-veg venues:
```json
[
  { "db_id": "df798a5d-8f41-4bcb-9a80-61174d602ec9", "external_provider": "palateo_demo", "external_place_id": "r1", "name": "Agashiye", "city": "Ahmedabad", "area": "Old City" },
  { "db_id": "d84a2405-3d0e-42bb-b41d-b0b3d2496938", "external_provider": "palateo_demo", "external_place_id": "r4", "name": "650 — The Global Kitchen", "city": "Ahmedabad", "area": "Ambawadi" },
  { "db_id": "d3d1c74b-cfdc-43cc-b82a-4851fc81f52a", "external_provider": "palateo_demo", "external_place_id": "r10", "name": "Rajwadu", "city": "Ahmedabad", "area": "Jivraj Park" },
  { "db_id": "a18d5124-d825-42a5-8ad5-cad86d5b08b0", "external_provider": "palateo_demo", "external_place_id": "r11", "name": "Jassi De Parathe", "city": "Ahmedabad", "area": "Prahlad Nagar" },
  { "db_id": "a8dfecb5-69ab-4ccc-80cc-faa0f2cf6575", "external_provider": "palateo_demo", "external_place_id": "r12", "name": "Patang Re-Evolve", "city": "Ahmedabad", "area": "Ellisbridge" },
  { "db_id": "688b71f2-7ece-4229-9a90-61d9e70ba336", "external_provider": "palateo-curated", "external_place_id": "dno-ahm-dakshinayan", "name": "Dakshinayan", "city": "Ahmedabad", "area": "Satellite" },
  { "db_id": "a1fab5a9-0f35-439c-b2d3-055dcf614d28", "external_provider": "openstreetmap", "external_place_id": "node/4445025289", "name": "Atithi Dining Hall", "city": "Ahmedabad", "area": "Bodakdev" },
  { "db_id": "95604f83-1ecc-4795-ac13-00a35b19c8be", "external_provider": "openstreetmap", "external_place_id": "node/9123477265", "name": "Gordhan Thal", "city": "Ahmedabad", "area": "Bodakdev" },
  { "db_id": "f58d6d7a-59cc-4d4f-b9a0-f13d45131188", "external_provider": "openstreetmap", "external_place_id": "node/14067660558", "name": "Chandravilas Restaurant", "city": "Ahmedabad", "area": "Old City" },
  { "db_id": "47e438cc-720d-4ada-bff3-08f3b137b84f", "external_provider": "openstreetmap", "external_place_id": "node/8548483880", "name": "Swati Snacks", "city": "Ahmedabad", "area": "Ellisbridge" },
  { "db_id": "f6de0d88-8d85-4d9e-81e8-480c2b1bee32", "external_provider": "openstreetmap", "external_place_id": "node/440339381", "name": "Vishala", "city": "Ahmedabad", "area": "Vasna" }
]
```

### Unsupported DB City Aliases / Region Rows
The 45 database rows with unsupported city aliases (Gandhinagar: 10, Ahmedabad region: 30, Adalaj: 1, Ahemedabad: 1, Ahmedabad, Prahladnagar: 1, Khoda: 1, Sanand: 1) are preserved in their exact input forms. As instructed, city labels were not altered.

---

## 4. Notable Conflicts & Uncertain Examples

1. **`hyd-chutneys` (Chutneys, Banjara Hills):** Marked `vegetarian` in prior seed data, but dining directories and menus (EazyDiner) confirm non-vegetarian meat/chicken dishes served. Flagged as `mixed_or_egg`.
2. **`jpr-chokhi-dhani` (Chokhi Dhani, Tonk Road):** Famous for traditional Rajasthani veg thali at the village fair, but the broader resort complex houses multi-cuisine dining outlets (e.g., Bindola, Chandi Mahal) serving non-veg options. Flagged as `mixed_or_egg`.
3. **`pun-rama-krishna-lonavala` (Rama Krishna Pure Veg Dining, Lonavala):** Despite having "Pure Veg" in the catalogue name, dining listings confirm it serves non-vegetarian food alongside a full bar/alcohol service. Flagged as `mixed_or_egg`.
4. **`blr-airlines` (Airlines Hotel, Lavelle Road):** Traditional South Indian drive-in restaurant serves egg dishes and non-veg items on its casual dining menu. Flagged as `mixed_or_egg`.
5. **`goa-cafe-central-porvorim` (Cafe Central, Goa):** Famous Goan bakery serves vegetable samosas and puffs, but also bakes and sells sponge cakes, fruit cakes, and snacks containing eggs. Flagged as `uncertain` / bakery egg conflict.
6. **`ahm-ninis-kitchen` (Nini's Kitchen, Prahladnagar):** Multi-cuisine cafe attached to "Baked By Nini's" dessert/bakery arm where eggless preparation across all baked goods is not explicitly certified. Flagged as `uncertain`.
7. **`koc-dal-roti` (Dal Roti, Fort Kochi):** Permanently closed; historically served a mixed menu with meat rolls. Flagged as `mixed_or_egg`.

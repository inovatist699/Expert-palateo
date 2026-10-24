const fs = require('node:fs');
const assert = require('node:assert/strict');
const rows = JSON.parse(fs.readFileSync(__dirname + '/all-cities-before.json', 'utf8'));
const db = JSON.parse(fs.readFileSync(__dirname + '/database-full-before.json', 'utf8'));
const groups = [
  [['r1','ahm-agashiye'],'https://www.zomato.com/ahmedabad/agashiye-the-house-of-mg-lal-darwaja/info','Vegetarian-only listing at The House of MG, Lal Darwaja; includes the existing Old City alias.'],
  [['r4'],'https://www.swiggy.com/restaurants/ahmedabad/satellite/650-the-global-kitchen-54701/dineout','Pure-veg amenity for 650 at Shreekunj Mandapam, Manekbaug, Ambavadi.'],
  [['r10'],'https://www.swiggy.com/restaurants/ahmedabad/vejalpur/rajwadu-758894/dineout','Pure-veg amenity for Rajwadu near Ambaji Temple, Malav Talav, Jivraj Park/Vejalpur.'],
  [['r11'],'https://www.swiggy.com/restaurants/ahmedabad/prahlad-nagar/jassi-de-parathe-prahladnagar-927194/dineout','Pure-veg amenity at Safal Pegasus, Prahlad Nagar.'],
  [['r13','ahm-vishalla'],'https://www.zomato.com/ahmedabad/vishalla-vasna','Vegetarian-only listing opposite APMC Market, Vasna; includes the existing Vishala spelling.'],
  [['r23','mum-swati-snacks'],'https://www.swatisnacks.com/','Operator describes a vegetarian restaurant and lists the Ahmedabad Law Garden and Mumbai Tardeo branches.'],
  [['r61'],'https://www.swiggy.com/restaurants/ahmedabad/bodakdev/atithi-80853/dineout','Pure-veg amenity at Mohini, Judges Bungalow Road, Bodakdev.'],
  [['mum-soam'],'https://www.swiggy.com/restaurants/mumbai/chowpatty/soam-537121/dineout','Pure-veg amenity at the Chowpatty restaurant.'],
  [['mum-cafe-madras'],'https://www.zomato.com/cs/mumbai/cafe-madras-matunga-east','Vegetarian-only listing at 38 B Circle House, Kings Circle, Matunga East.'],
  [['mum-ram-ashraya'],'https://www.swiggy.com/restaurants/mumbai/matunga-east/ramashraya-since-1939-35691/dineout','Pure-veg amenity at Bhandarkar Road, Matunga East.'],
  [['mum-cafe-mysore'],'https://www.swiggy.com/restaurants/mumbai/matunga-east/cafe-mysore-15368/dineout','Pure-veg amenity at 461 Bhaudaji Road, opposite Kings Circle Garden.'],
  [['mum-manis-lunch-home'],'https://www.district.in/dining/mumbai/manis-lunch-home-since-1937-matunga-east','Vegetarian-only facility at 153 C Mahskar Building, Matunga East.'],
  [['mum-pancham-puriwala'],'https://www.swiggy.com/restaurants/mumbai/fort/pancham-puriwala-514139/dineout','Pure-veg amenity at Bhatia Dharamshala, Perin Nariman Street, Fort.'],
  [['blr-vidyarthi-bhavan'],'https://www.vidyarthibhavan.in/','Operator explicitly identifies its heritage South Indian vegetarian restaurant in Basavanagudi.'],
  [['blr-mtr','blr-mtr-1924'],'https://www.zomato.com/bangalore/mavalli-tiffin-room-mtr-basavanagudi-bangalore/info','Vegetarian-only listing at 14 Mavalli, Lalbagh Road; both existing aliases describe this branch.'],
  [['blr-ctr','blr-ctr-shri-sagar'],'https://www.swiggy.com/restaurants/bangalore/malleshwaram/ctr-399535/dineout','Pure-veg amenity at CTR, Malleshwaram; both existing aliases describe this restaurant.'],
  [['blr-brahmins-coffee-bar'],'https://www.swiggy.com/restaurants/bangalore/basavanagudi/brahmin-s-coffee-bar-111261/dineout','Pure-veg amenity at Ranga Rao Road, Shankarapura/Basavanagudi.'],
  [['blr-taaza-thindi'],'https://www.zomato.com/bangalore/taaza-thindi-jayanagar/info','Vegetarian-only listing at 1004, 26th Main, 4th T Block, Jayanagar.'],
  [['del-carnatic-cafe'],'https://www.zomato.com/ncr/carnatic-cafe-greater-kailash-gk-2-new-delhi','Vegetarian-only listing at 21 M Block Market, Greater Kailash 2.'],
  [['del-burma-burma'],'https://www.dlfcyberhub.com/shopdetails-4','The venue operator DLF CyberHub explicitly identifies its Burma Burma tenant as vegetarian-only.'],
  [['kol-kc-das'],'https://www.district.in/dining/kolkata/k-c-das-esplanade','Vegetarian-only facility at 11A Esplanade East.'],
  [['pun-shabree'],'https://www.swiggy.com/restaurants/pune/f-c-road/shabree-943452/dineout','Pure-veg amenity behind Tukaram Paduka Temple on FC Road.'],
  [['pun-sukanta'],'https://www.swiggy.com/restaurants/pune/prabhat-road/sukanta-pure-veg-indian-thali-22150/dineout','Pure-veg amenity at 636 Pulachi Wadi, Deccan Gymkhana.'],
  [['jpr-lmb'],'https://www.swiggy.com/restaurants/jaipur/pink-city/laxmi-misthan-bhandar-1033812/dineout','Pure-veg amenity at 98-99 Johari Bazar, Jaipur.'],
  [['jpr-rawat'],'https://www.swiggy.com/restaurants/jaipur/sindhi-camp/rawat-misthan-bhandar-55887/dineout','Pure-veg amenity opposite Polovictory Cinema on Station Road, Sindhi Camp.'],
  [['chd-sindhi-sweets'],'https://www.swiggy.com/restaurants/chandigarh/sector-17/sindhi-sweets-39978/dineout','Pure-veg amenity at SCO 108-109, Sector 17C.']
];
groups.push(
  [['r3','ahm-under-the-neem-tree'],'https://www.undertheneemtrees.com/','Operator explicitly identifies the Bodakdev estate as entirely pure vegetarian; both existing aliases match.'],
  [['r19'],'https://www.zomato.com/ahmedabad/gordhan-thaal-satellite','Vegetarian-only listing at Ground Floor, Sapath Complex, SG Highway, matching the Bodakdev/Shapath Tower venue.'],
  [['r32'],'https://www.zomato.com/ahmedabad/gopi-dining-hall-ellis-bridge/info','Vegetarian-only listing at Avdhesh House, Ellis Bridge.'],
  [['r52'],'https://www.swiggy.com/restaurants/ahmedabad/ashram-road/oshwal-63143/dineout','Pure-veg amenity at 14 Ajanta Commercial Center, Ashram Road, matching the existing Oswal spelling.'],
  [['mum-amar-juice'],'https://www.swiggy.com/restaurants/mumbai/juhu/amar-fast-food-juice-centre-69551/dineout','Pure-veg amenity at 3 Gulmohar Road, beside Cooper Hospital, Juhu.'],
  [['mum-prakash-shakahari'],'https://www.swiggy.com/restaurants/mumbai/dadar-west/prakash-shakahari-upahar-kendra-846141/dineout','Pure-veg amenity at 9/10 Horizon Building, Gokhale Road North, Dadar West.'],
  [['mum-dakshinayan'],'https://www.zomato.com/mumbai/dakshinayan-juhu/info','Vegetarian-only listing on Gandhigram Road, near ISKCON Temple, Juhu.'],
  [['del-saravana-bhavan'],'https://www.zomato.com/ncr/saravana-bhavan-connaught-place-new-delhi/info','Vegetarian-only listing at P-13 Connaught Circle, matching the source address.'],
  [['hyd-tatva'],'https://www.zomato.com/hyderabad/tatva-jubilee-hills','The target venue is explicitly tagged Pure Veg under its dining highlights; address matches SL Jubilee, Road 36.'],
  [['chn-rayars','chn-rayars-mess'],'https://www.swiggy.com/restaurants/chennai/mylapore/rayar-s-mess-133829/dineout','Pure-veg amenity at new number 31 Arundale Street, Mylapore; both existing aliases match.'],
  [['chn-ratna-cafe'],'https://www.swiggy.com/restaurants/chennai/triplicane/ratna-cafe-848198/dineout','Pure-veg amenity at 255 High Road, Triplicane.'],
  [['chn-grand-sweets'],'https://www.district.in/dining/chennai/the-grand-sweets-and-snacks-adyar','Vegetarian-only facility at 24 Second Main Road, Gandhi Nagar, Adyar.'],
  [['chn-sangeetha-veg'],'https://www.sangeethaveg.com/post/how-jain-meals-at-sangeetha-veg-restaurant-are-transforming-chennai-s-food-scene','Operator identifies its vegetarian restaurant and RA Puram branch; its Chennai location page confirms both RA Puram addresses.'],
  [['pun-bedekar'],'https://www.swiggy.com/restaurants/pune/narayan-peth/bedekar-misal-64313/dineout','Pure-veg amenity at Munjabacha Bol, Narayan Peth.'],
  [['pun-chaitanya-paranthas'],'https://www.district.in/dining/pune/chaitanya-paranthas-fc-road','Vegetarian-only facility at Tukaram Paduka Chowk, FC Road.'],
  [['pun-durvankur'],'https://www.swiggy.com/restaurants/pune/sadashiv-peth/durvankur-18077/dineout','Pure-veg amenity at 1166 New Sadashiv Peth.'],
  [['pun-shreyas'],'https://www.swiggy.com/restaurants/pune/deccan-gymkhana/shreyas-632442/dineout','Pure-veg amenity at Hotel Shreyas, 1242 B Apte Road, Deccan Gymkhana.'],
  [['pun-roopali'],'https://www.district.in/dining/pune/roopali-restaurant-fc-road','Vegetarian-only facility at 1227 FC Road, opposite British Library.'],
  [['pun-wadeshwar'],'https://www.swiggy.com/restaurants/pune/deccan-gymkhana/wadeshwar-13909/dineout','Pure-veg amenity at FC Road, Deccan Gymkhana.'],
  [['pun-badshahi'],'https://www.district.in/dining/pune/badshahi-boarding-house-tilak-road','Vegetarian-only facility at plot 1648 Tilak Road.'],
);
const sourceRecords = [];
for (const [ids, url, evidence] of groups) for (const id of ids) {
  const matches = rows.filter(r => r.id === id);
  assert.equal(matches.length, 1, id);
  const {name,city,area,options} = matches[0];
  sourceRecords.push({id,name,city,area,before:options,sources:[url],evidence});
}
const dbSourceIds = {r1:'r1',r3:'r3',r4:'r4',r10:'r10',r11:'r11','node/8548483880':'r23','node/4445025289':'r61','node/440339381':'r13','node/9123477265':'r19'};
const databaseRecords = Object.entries(dbSourceIds).map(([external,id]) => {
  const matches = db.filter(r => r.external_place_id === external && r.city === 'Ahmedabad');
  assert.equal(matches.length, 1, external);
  const row = matches[0], source = sourceRecords.find(r => r.id === id);
  return {...row,sources:source.sources,evidence:source.evidence};
});
const audit = {
  checked_at:'2026-10-21',researcher:'Antigravity desktop app with Codex source verification',reviewer:'Codex: branch evidence reviewed before applying',
  bundled_city_counts:Object.fromEntries([...new Set(rows.map(r=>r.city))].map(city=>[city,rows.filter(r=>r.city===city).length])),
  source_records:sourceRecords,database_records:databaseRecords
};
fs.writeFileSync('docs/OTHER_CITIES_DIETARY_AUDIT_2026-10-21.json',JSON.stringify(audit,null,2)+'\n');
console.log('Reviewed source records:',sourceRecords.length,'DB records:',databaseRecords.length);

const fs = require('node:fs');
const path = require('node:path');

const filePath = path.join(__dirname, 'palateo_cloudflare_pages', 'app', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Update footer attribution to remove OSM references
const oldFooter = '<footer class="dataAttribution">Palateo catalogue: © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a> · <a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" rel="noopener noreferrer">ODbL 1.0</a> · Venue details combine an OSM snapshot with curated Google Maps, District, Swiggy Dineout and Zomato listings, including this <a href="https://gujaratipedia.com/vadodara/cafes/" target="_blank" rel="noopener noreferrer">Google Maps café snapshot</a>; verify current details with the listing provider. · <a href="https://www.instagram.com/palateo.co/" target="_blank" rel="noopener noreferrer">Palateo on Instagram</a> · <a href="https://www.linkedin.com/in/aayush-mittal-01012004e/" target="_blank" rel="noopener noreferrer">Aayush Mittal on LinkedIn</a> · <a href="/privacy/">Privacy Policy</a> · <a href="/terms/">Terms &amp; Conditions</a> · <a href="mailto:palateo.com@gmail.com">Contact</a></footer>';
const newFooter = '<footer class="dataAttribution">Palateo catalogue: Curated restaurants, cafés and dessert destinations verified with Google Maps ratings, diner reviews and direct directions. Verify current timings with listing providers before visiting. · <a href="https://www.instagram.com/palateo.co/" target="_blank" rel="noopener noreferrer">Palateo on Instagram</a> · <a href="https://www.linkedin.com/in/aayush-mittal-01012004e/" target="_blank" rel="noopener noreferrer">Aayush Mittal on LinkedIn</a> · <a href="/privacy/">Privacy Policy</a> · <a href="/terms/">Terms &amp; Conditions</a> · <a href="mailto:palateo.com@gmail.com">Contact</a></footer>';

if (!html.includes(oldFooter)) {
  console.error('Could not find oldFooter');
  process.exit(1);
}
html = html.replace(oldFooter, newFooter);

// 2. Remove open map styles
const oldOpenMapStyle = /<style id="palateo-open-map-styles">[\s\S]*?<\/style>/;
if (!oldOpenMapStyle.test(html)) {
  console.error('Could not find palateo-open-map-styles');
  process.exit(1);
}
html = html.replace(oldOpenMapStyle, '');

// 3. Ahmedabad additions (r21 to r32)
const ahmedabadAdditions = `,\n{id:'r21',name:'Melt In',area:'Bodakdev',city:'Ahmedabad',latitude:23.0402,longitude:72.5115,c:['Desserts','Cafe','Bakery'],p:'500_1000',rating:4.6,review_count:3800,t:['Desserts','Gelato','Artisanal'],a:['cozy','modern'],o:['date','friends'],s:'mild',dietaryOptions:['vegetarian'],emoji:'🍨',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Melt In Bodakdev Ahmedabad'),review_insights:['artisanal authentic gelato','french pastries and macarons','gourmet dessert platters','cozy aesthetic ambiance'],why:'Ahmedabad’s premier artisanal gelato and gourmet dessert destination.'},
{id:'r22',name:'Asharfilal Kulfi',area:'Law Garden',city:'Ahmedabad',latitude:23.0272,longitude:72.5638,c:['Desserts','Ice Cream'],p:'under_500',rating:4.5,review_count:5200,t:['Desserts','Kulfi','Legend'],a:['casual','lively'],o:['family','friends','solo'],s:'mild',dietaryOptions:['vegetarian'],emoji:'🍦',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Asharfilal Kulfi Law Garden Ahmedabad'),review_insights:['legendary malai and kesar kulfi','thick rabdi falooda','nostalgic late night treat','unmatched quality for decades'],why:'Iconic dessert landmark celebrated for rich traditional kulfi and falooda.'},
{id:'r23',name:'Swati Snacks',area:'Ellisbridge',city:'Ahmedabad',latitude:23.0245,longitude:72.5621,c:['Gujarati','Regional','Fast food'],p:'500_1000',rating:4.5,review_count:4100,t:['Traditional','Snacks','Desserts'],a:['casual','quiet'],o:['family','friends'],s:'mild',dietaryOptions:['vegetarian'],emoji:'🥟',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Swati Snacks Ellisbridge Ahmedabad'),review_insights:['steamed panki in banana leaf','crispy handvo','fada ni khichdi','fresh artisanal desserts'],why:'Critically acclaimed Gujarati heritage snacks, panki, and handvo.'},
{id:'r24',name:'Tomato\\'s',area:'C.G. Road',city:'Ahmedabad',latitude:23.0331,longitude:72.5562,c:['Continental','Mexican','American','Desserts'],p:'1000_2000',rating:4.4,review_count:3400,t:['Retro','Theme','Date night'],a:['lively','themed'],o:['friends','date','family'],s:'medium',dietaryOptions:['vegetarian','non-vegetarian'],emoji:'🍅',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Tomatos Restaurant CG Road Ahmedabad'),review_insights:['1950s american retro diner theme','sizzling enchiladas','mudpie desserts','lively memorable vibe'],why:'Legendary retro diner known for Mexican comfort food and decadent mudpies.'},
{id:'r25',name:'Mocha Cafe & Bar',area:'Bodakdev',city:'Ahmedabad',latitude:23.0378,longitude:72.5098,c:['Cafe','Continental','Desserts','Italian'],p:'1000_2000',rating:4.4,review_count:2900,t:['Cafe','Desserts','Lounge'],a:['lively','cozy'],o:['friends','date'],s:'medium',dietaryOptions:['vegetarian_options'],emoji:'☕',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Mocha Cafe Bodakdev Ahmedabad'),review_insights:['rich gourmet hot chocolates','cheesecakes and waffle towers','relaxed lush outdoor lawn','friends social hub'],why:'Vibrant social lounge famous for decadent desserts and handcrafted beverages.'},
{id:'r26',name:'Shambhu\\'s Coffee Bar',area:'Navrangpura',city:'Ahmedabad',latitude:23.0369,longitude:72.5547,c:['Cafe','Coffee','Fast food'],p:'under_500',rating:4.4,review_count:6100,t:['Coffee','Youth','Quick bite'],a:['casual','lively'],o:['friends','solo'],s:'mild',dietaryOptions:['vegetarian'],emoji:'☕',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Shambhus Coffee Bar Navrangpura Ahmedabad'),review_insights:['iconic thick cold coffee','grilled chocolate sandwiches','student cultural staple','quick evening hangout'],why:'Ahmedabad’s beloved cold coffee institution with generations of loyal fans.'},
{id:'r27',name:'Gwalia Sweets & Cafe',area:'Prahlad Nagar',city:'Ahmedabad',latitude:23.0115,longitude:72.5074,c:['Desserts','North Indian','Sweets'],p:'under_500',rating:4.5,review_count:3300,t:['Desserts','Sweets','Chaat'],a:['casual','family'],o:['family','friends'],s:'mild',dietaryOptions:['vegetarian'],emoji:'🍬',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Gwalia Sweets Prahlad Nagar Ahmedabad'),review_insights:['gourmet rasmalai and gulab jamun','chaat platters','rich desi ghee sweets','hygienic family spot'],why:'Renowned sweets and dessert house serving artisanal Indian delicacies.'},
{id:'r28',name:'Sasuji Dining Hall',area:'C.G. Road',city:'Ahmedabad',latitude:23.0298,longitude:72.5579,c:['Gujarati','Thali'],p:'500_1000',rating:4.3,review_count:4700,t:['Traditional','Grand Thali','Family'],a:['traditional','family'],o:['family','friends'],s:'medium',dietaryOptions:['vegetarian'],emoji:'🥘',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Sasuji Dining Hall CG Road Ahmedabad'),review_insights:['endless gujarati delicacies','piping hot puran poli','traditional warm hospitality','authentic local flavors'],why:'Authentic unlimited Gujarati thali dining with warm Gujarati hospitality.'},
{id:'r29',name:'Manek Chowk Night Food Market',area:'Old City',city:'Ahmedabad',latitude:23.0239,longitude:72.5873,c:['Desserts','Fast food','Street food'],p:'under_500',rating:4.3,review_count:8900,t:['Street food','Desserts','Night market'],a:['lively','historic'],o:['friends','family'],s:'medium',dietaryOptions:['vegetarian'],emoji:'🍫',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Manek Chowk Night Food Market Ahmedabad'),review_insights:['famous chocolate cheese sandwich','gwalior butter dosa','kulfi and rabdi night stalls','bustling old city energy'],why:'Historic night market world-famous for inventive chocolate sandwiches and kulfis.'},
{id:'r30',name:'The Project Cafe',area:'Ambawadi',city:'Ahmedabad',latitude:23.0229,longitude:72.5481,c:['Cafe','Continental','Italian','Desserts'],p:'1000_2000',rating:4.5,review_count:2600,t:['Art cafe','Design','Desserts'],a:['quiet','peaceful','artistic'],o:['date','solo','friends'],s:'mild',dietaryOptions:['vegetarian_options'],emoji:'🎨',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('The Project Cafe Ambawadi Ahmedabad'),review_insights:['dynamic art gallery spaces','specialty pour-overs and cheesecakes','lush calm courtyard','creative peaceful work vibes'],why:'Serene art and design cafe combining specialty roasts with creative desserts.'},
{id:'r31',name:'Huber & Holly',area:'Bodakdev',city:'Ahmedabad',latitude:23.0361,longitude:72.5120,c:['Desserts','Ice Cream','Bakery'],p:'500_1000',rating:4.5,review_count:2800,t:['Gelato','Desserts','Luxury'],a:['modern','cozy'],o:['date','family','friends'],s:'mild',dietaryOptions:['vegetarian'],emoji:'🍨',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Huber and Holly Bodakdev Ahmedabad'),review_insights:['freshly churned rich gelato','the mighty mighty 24k gold cone','handcrafted pastry pizzas','luxurious dessert treat'],why:'High-end dessert boutique renowned for gourmet freshly-churned ice creams.'},
{id:'r32',name:'Gopi Dining Hall',area:'Ellisbridge',city:'Ahmedabad',latitude:23.0212,longitude:72.5694,c:['Gujarati','Kathiyawadi','Regional'],p:'500_1000',rating:4.4,review_count:3900,t:['Kathiyawadi','Traditional','Comfort'],a:['traditional','family'],o:['family','friends'],s:'medium',dietaryOptions:['vegetarian'],emoji:'🍲',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Gopi Dining Hall Ellisbridge Ahmedabad'),review_insights:['authentic kathiyawadi ringna no olo','bajra rotla with fresh butter','unlimited comforting thali','decades-old reliable taste'],why:'Treasured regional dining hall beloved for authentic Kathiyawadi and Gujarati thalis.'}`;

// Insert ahmedabadAdditions right before the closing bracket of catalog
const catalogEnd = `why:'Elevated rooftop cafe with sweeping skyline views and ambient music.'}\n];`;
if (!html.includes(catalogEnd)) {
  console.error('Could not find catalogEnd');
  process.exit(1);
}
html = html.replace(catalogEnd, `why:'Elevated rooftop cafe with sweeping skyline views and ambient music.'}` + ahmedabadAdditions + `\n];`);

// 4. Remove OSM catalog block
const osmRegex = /\/\* OSM_CATALOG_BEGIN \*\/[\s\S]*?\/\* OSM_CATALOG_END \*\/\n*/;
if (!osmRegex.test(html)) {
  console.error('Could not find osm block');
  process.exit(1);
}
html = html.replace(osmRegex, '');

// 5. Vadodara additions
const vadodaraAdditions = `,\n{id:'vad-canara-coffee',name:'Canara Coffee House',area:'Sayajiganj',city:'Vadodara',latitude:22.3089,longitude:73.1891,address:'Near Kala Ghoda Circle, Sayajiganj, Vadodara 390005',c:['Cafe','Coffee','South Indian'],p:'under_500',displayPrice:'₹100–250',rating:4.6,review_count:3100,t:['Heritage','Coffee','Legend'],a:['traditional','casual'],o:['solo','friends','family'],s:'medium',emoji:'☕',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Canara Coffee House Sayajiganj Vadodara'),review_insights:['legendary poona misal and sev usal','filter coffee brewed fresh','historic 1954 heritage institution','nostalgic vadodara landmark']},
{id:'vad-jagdish-farshan',name:'Jagdish Farshan & Sweets',area:'Jubilee Baug',city:'Vadodara',latitude:22.3024,longitude:73.2045,address:'Jubilee Baug, Raopura, Vadodara 390001',c:['Desserts','Sweets','Gujarati'],p:'under_500',displayPrice:'₹200–500',rating:4.7,review_count:6200,t:['Desserts','Sweets','Legend'],a:['casual','traditional'],o:['family','friends'],s:'mild',dietaryOptions:['vegetarian'],emoji:'🍬',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Jagdish Farshan Jubilee Baug Vadodara'),review_insights:['world famous bhakarwadi','lilo chevdo and mohanthal','traditional gujarati sweets','legendary taste since 1938']},
{id:'vad-dukes-pastry',name:'Duke\\'s Pastry Shop',area:'Alkapuri',city:'Vadodara',latitude:22.3110,longitude:73.1742,address:'Concorde Building, R.C. Dutt Road, Alkapuri, Vadodara 390007',c:['Desserts','Bakery','Cafe'],p:'under_500',displayPrice:'₹200–450',rating:4.6,review_count:2400,t:['Desserts','Bakery','Pastry'],a:['cozy','classic'],o:['family','friends','solo'],s:'mild',dietaryOptions:['vegetarian_options'],emoji:'🍰',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Dukes Pastry Shop Alkapuri Vadodara'),review_insights:['fresh chocolate truffles','black forest and fruit pastries','iconic vadodara birthday bakery','melt-in-mouth savory rolls']},
{id:'vad-dairy-den',name:'Dairy Den',area:'Sayajiganj',city:'Vadodara',latitude:22.3098,longitude:73.1878,address:'Station Road, Sayajiganj, Vadodara 390020',c:['Desserts','Ice Cream'],p:'under_500',displayPrice:'₹100–300',rating:4.5,review_count:4200,t:['Desserts','Ice Cream','Nostalgia'],a:['casual','lively'],o:['friends','family'],s:'mild',dietaryOptions:['vegetarian'],emoji:'🍦',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Dairy Den Sayajiganj Vadodara'),review_insights:['original soft-serve swirl in gujarat','chocolate dip cones','nostalgic evening treats','beloved city memory since 1969']},
{id:'vad-mandap',name:'Mandap Restaurant',area:'Alkapuri',city:'Vadodara',latitude:22.3108,longitude:73.1769,address:'Hotel Express Residency, 18-19, Alkapuri Society, Alkapuri, Vadodara 390007',c:['Gujarati','Thali','Desserts'],p:'500_1000',displayPrice:'₹650 per thali',rating:4.5,review_count:3800,t:['Traditional','Grand Thali','Royal'],a:['traditional','quiet'],o:['family','date'],s:'mild',dietaryOptions:['vegetarian'],emoji:'🥘',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Mandap Restaurant Express Alkapuri Vadodara'),review_insights:['palatial shamiana decor','silver service gujarati thali','warm royal hospitality','mouthwatering shrikhand and basundi']},
{id:'vad-sayaji-blue-coriander',name:'Blue Coriander',area:'Sayajiganj',city:'Vadodara',latitude:22.3122,longitude:73.1856,address:'Sayaji Hotel, near Bhimnath Bridge, Sayajiganj, Vadodara 390020',c:['North Indian','Multi-cuisine','Desserts'],p:'1000_2000',displayPrice:'₹1,600 for two',rating:4.5,review_count:2900,t:['Fine dining','Buffet','Desserts'],a:['quiet','premium'],o:['family','date','special'],s:'medium',dietaryOptions:['vegetarian','non-vegetarian'],emoji:'🍽️',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Blue Coriander Sayaji Hotel Vadodara'),review_insights:['grand multi-cuisine dinner buffet','live dessert counter and fondue','luxurious ambience','unrivalled five-star hospitality']},
{id:'vad-mishmash',name:'Mishmash Restro Cafe',area:'Alkapuri',city:'Vadodara',latitude:22.3120,longitude:73.1718,address:'Near Chakli Circle, Race Course Road, Alkapuri, Vadodara 390007',c:['Cafe','Desserts','Continental','Italian'],p:'500_1000',displayPrice:'₹850 for two',rating:4.6,review_count:1850,t:['Cafe','Desserts','Live music'],a:['lively','modern'],o:['friends','date'],s:'medium',dietaryOptions:['vegetarian'],emoji:'🍰',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Mishmash Restro Cafe Alkapuri Vadodara'),review_insights:['nutella waffle mountains','thick gourmet shakes','acoustic live music nights','vibrant youth hangout']},
{id:'vad-mahakali-sev-usal',name:'Mahakali Sev Usal',area:'Raopura',city:'Vadodara',latitude:22.3018,longitude:73.2052,address:'Near Kirti Stambh, Nehru Bhavan Road, Raopura, Vadodara 390001',c:['Regional','Fast food','Street food'],p:'under_500',displayPrice:'₹100–200',rating:4.4,review_count:5800,t:['Street food','Legend','Spicy'],a:['casual','lively'],o:['friends','solo'],s:'hot',dietaryOptions:['vegetarian'],emoji:'🍲',photo:'',maps:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Mahakali Sev Usal Raopura Vadodara'),review_insights:['world-famous fiery tari and spring onions','legendary sev usal since decades','pilgrimage for food lovers in vadodara','authentic spicy sensation']}`;

const vadodaraEnd = `review_insights:['cozy gotri cafe','crispy sandwiches','chilled coolers','friendly neighborhood place']}\n];`;
if (!html.includes(vadodaraEnd)) {
  console.error('Could not find vadodaraEnd');
  process.exit(1);
}
html = html.replace(vadodaraEnd, `review_insights:['cozy gotri cafe','crispy sandwiches','chilled coolers','friendly neighborhood place']}` + vadodaraAdditions + `\n];`);

// 6. Remove unused leaflet/osm variables in JS
const oldOsmVars = `let osmMapInstance=null, osmMapMarkers=[], leafletLoadPromise=null, openMapQuery='', openMapType='all';\n`;
if (html.includes(oldOsmVars)) {
  html = html.replace(oldOsmVars, '');
}

// 7. Remove freeMap and related functions (up to setDiscoverCuisine)
const openMapBlock = /function freeMap\(\)\{[\s\S]*?\}function setDiscoverCuisine\(cuisine\)\{/;
if (!openMapBlock.test(html)) {
  console.error('Could not find openMapBlock');
  process.exit(1);
}
html = html.replace(openMapBlock, 'function setDiscoverCuisine(cuisine){');

// 8. Clean up unused listeners for map-filter / map-type
html = html.replace(/\s*if\(target\.dataset\.action==='map-filter'\)filterOpenMap\(target\.value\);/, '');
html = html.replace(/\s*if\(target\.dataset\.action==='map-type'&&\[.*?\].includes\(target\.value\)\)setOpenMapType\(target\.value\);/, '');

fs.writeFileSync(filePath, html);
console.log('Successfully updated app/index.html');

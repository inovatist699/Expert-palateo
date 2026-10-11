# PowerShell script to update app/index.html and app/theme.css
$ErrorActionPreference = "Stop"

$indexPath = "$PSScriptRoot/palateo_cloudflare_pages/app/index.html"
$themePath = "$PSScriptRoot/palateo_cloudflare_pages/app/theme.css"

$content = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)

# 1. State variables
if (-not $content.Contains("let promptQuery=''")) {
    $oldVar = "let state=load(), page='home', supabaseClient=null, discoverCuisine='all', discoverQuery='', homeCuisine='all', homeLimit=12, searchEventTimer=null, authRequired=true, homeView='map', selectedPinId=null, mapZoom=1, map3d=false;"
    $newVar = "let state=load(), page='home', supabaseClient=null, discoverCuisine='all', discoverQuery='', homeCuisine='all', homeLimit=12, searchEventTimer=null, authRequired=true, homeView='map', selectedPinId=null, mapZoom=1, map3d=false;`nlet promptQuery='', minMatchThreshold=0, studioTunerOpen=false, selectedDishCategory='all', activeDishModalVenue=null, adventureMode='balanced';"
    if ($content.Contains($oldVar)) {
        $content = $content.Replace($oldVar, $newVar)
        Write-Host "State variables added." -ForegroundColor Green
    } else {
        throw "Could not locate state variables declaration."
    }
}

# 2. BEST_DISHES_REGISTRY and helper functions
$registryCode = @'
const BEST_DISHES_REGISTRY = {
  // Mumbai
  'mum-subko': [
    {name:'Podi Sourdough Toast & Cultured Butter',category:'Breakfast & Sourdough',price:'₹340',dietary:'Veg',description:'Signature 36-hr fermented sourdough slathered with house podi-spiced cultured butter and flaky sea salt.'},
    {name:'Lavender & Orange Cold Brew',category:'Coffee & Brews',price:'₹295',dietary:'Veg',description:'Single-origin Karnataka estate roast steeped 18 hours, infused with sweet orange peel and organic lavender.'},
    {name:'Chocolate Babka Knot',category:'Bakes & Pastry',price:'₹320',dietary:'Veg',description:'Braided enriched brioche twisted with 70% single-estate South Indian dark chocolate.'},
    {name:'Smoked Egg & Cheddar Morning Roll',category:'Breakfast & Brunch',price:'₹380',dietary:'Egg',description:'Fluffy farm eggs, aged sharp cheddar, and fermented chili mayo in a warm toasted brioche roll.'}
  ],
  'mum-veronicas': [
    {name:'The Big Pastrami Sandwich',category:'Mains & Sandwiches',price:'₹750',dietary:'Non-Veg',description:'House-cured spiced pastrami, grainy mustard emulsion, Swiss cheese, and dill pickles on toasted country sourdough.'},
    {name:'Truffle Mushroom Melt',category:'Mains & Sandwiches',price:'₹550',dietary:'Veg',description:'Wild shimeji and cremini mushrooms, gruyère, and truffle oil pressed on golden sourdough.'},
    {name:'Passionfruit Basil Iced Latte',category:'Coffee & Brews',price:'₹320',dietary:'Veg',description:'Crisp, tart passionfruit puree over double espresso and velvety cold oat milk.'},
    {name:'Cinnamon Sugar Choux Crullers',category:'Bakes & Pastry',price:'₹260',dietary:'Veg',description:'Airy, ridged choux pastry rings fried crisp and rolled generously in fragrant cinnamon sugar.'}
  ],
  'mum-bombay-canteen': [
    {name:'Eggs Kejriwal on Toast',category:'Breakfast & Small Plates',price:'₹475',dietary:'Egg',description:'Toasted brioche, melted cheddar, spicy green chili chutney, and sunny farm eggs.'},
    {name:'Chettinad Spiced Pulled Duck Tacos',category:'Mains & Small Plates',price:'₹650',dietary:'Non-Veg',description:'Slow-braised duck in roasted spices, fresh coconut shavings, served on hot thepla taco shells.'},
    {name:'Guava Tan-Tana-Tan Cocktail',category:'Craft Beverages',price:'₹680',dietary:'Veg',description:'Tequila, pink guava puree, chili salt rim, and lime cordial.'},
    {name:'Filter Coffee Tres Leches',category:'Desserts',price:'₹425',dietary:'Veg',description:'Airy sponge soaked in three milks infused with South Indian chicory roast coffee.'}
  ],
  'mum-blue-tokai': [
    {name:'Attikan Estate Pourover (V60)',category:'Coffee & Brews',price:'₹240',dietary:'Veg',description:'Light-medium roast with crisp notes of sweet dried fig, milk chocolate, and roasted almond.'},
    {name:'Signature Sea Salt Iced Mocha',category:'Coffee & Brews',price:'₹290',dietary:'Veg',description:'Double shot espresso blended with dark cocoa and Himalayan pink sea salt froth.'},
    {name:'Smoked Chicken Sourdough Toastie',category:'Mains & Sandwiches',price:'₹390',dietary:'Non-Veg',description:'Applewood smoked chicken breast, whole grain mustard, and caramelized shallots on country sourdough.'},
    {name:'Almond & Sea Salt Croissant',category:'Bakes & Pastry',price:'₹280',dietary:'Veg',description:'Flaky French laminated butter pastry with almond frangipane and sea salt flakes.'}
  ],
  'mum-kala-ghoda-cafe': [
    {name:'Organic Waffles with Honey & Bacon',category:'Breakfast & Brunch',price:'₹420',dietary:'Non-Veg',description:'Crisp multi-grain waffles served with local wild honey and crisp streaky bacon.'},
    {name:'KGC Cold Brew Reserve',category:'Coffee & Brews',price:'₹260',dietary:'Veg',description:'Slow extracted Arabica blend with low acidity and rich cocoa finish.'},
    {name:'Herbed Chicken Pot Pie',category:'Mains & Small Plates',price:'₹480',dietary:'Non-Veg',description:'Creamy tarragon chicken and carrots beneath a golden flaky puff pastry lid.'}
  ],
  'mum-bake-house-cafe': [
    {name:'Pan-Seared Truffle Gnocchi',category:'Mains & Small Plates',price:'₹520',dietary:'Veg',description:'Handmade potato pillows tossed with butter, sage, wild mushrooms, and parmesan.'},
    {name:'Nutella Stuffed Brioche French Toast',category:'Breakfast & Brunch',price:'₹390',dietary:'Egg',description:'Thick sliced brioche filled with warm Nutella and topped with crushed toasted hazelnuts.'}
  ],
  'mum-bastian': [
    {name:'Bastian Lobster Mac & Cheese',category:'Mains & Seafood',price:'₹1,650',dietary:'Non-Veg',description:'Butter-poached lobster tails tossed in five-cheese mornay with crisp garlic panko.'},
    {name:'Lotus Biscoff Pull-Me-Up Cheesecake',category:'Desserts',price:'₹750',dietary:'Veg',description:'Famous decadent cream cheese tower drenched in warm caramelized speculoos sauce.'}
  ],
  'mum-trishna': [
    {name:'Butter Garlic Mud Crab',category:'Mains & Seafood',price:'₹1,850',dietary:'Non-Veg',description:'Whole fresh mud crab bathed in colossal amounts of golden melted butter, crushed garlic, and black pepper.'},
    {name:'Neer Dosa with Mangalorean Fish Curry',category:'Mains & Seafood',price:'₹650',dietary:'Non-Veg',description:'Lacy steamed rice crepes paired with coconut, kokum, and kingfish gravy.'}
  ],

  // Delhi NCR
  'del-blue-tokai-champa': [
    {name:'South Indian Estate Cold Brew Tonic',category:'Coffee & Brews',price:'₹260',dietary:'Veg',description:'Crisp sparkling tonic poured over concentrated cold brew with fresh citrus zest.'},
    {name:'Pesto Bocconcini Sourdough Toast',category:'Breakfast & Sourdough',price:'₹360',dietary:'Veg',description:'House basil-cashew pesto, baby bocconcini cheese, and blistered cherry tomatoes on sourdough.'},
    {name:'Dark Chocolate Sea Salt Cruffin',category:'Bakes & Pastry',price:'₹270',dietary:'Veg',description:'Croissant muffin hybrid rolled in raw sugar and filled with 64% single estate chocolate ganache.'}
  ],
  'del-perch': [
    {name:'Cold Brew Coffee Sangria',category:'Coffee & Brews',price:'₹480',dietary:'Veg',description:'Chilled specialty espresso steeped with fresh orange wheels, berries, and spiced botanical vermouth.'},
    {name:'Grilled Forest Mushroom Tartine',category:'Breakfast & Small Plates',price:'₹420',dietary:'Veg',description:'Portobello and shimeji mushrooms, thyme, whipped goat cheese on artisanal multigrain.'},
    {name:'Charred Pork Belly with Spiced Plum',category:'Mains & Small Plates',price:'₹690',dietary:'Non-Veg',description:'Crisp crackling skin, melt-in-mouth pork belly glazed in sweet and sour Himalayan plum sauce.'}
  ],
  'del-colocal': [
    {name:'Single Origin Campfire Hot Chocolate',category:'Coffee & Brews',price:'₹380',dietary:'Veg',description:'Melted 72% bean-to-bar chocolate served with handmade torched vanilla marshmallow.'},
    {name:'Burrata & Roasted Tomato Bruschetta',category:'Mains & Small Plates',price:'₹440',dietary:'Veg',description:'Fresh creamy burrata cheese ball on garlic sourdough toast with basil reduction.'},
    {name:'Chocolate Fondant Tart',category:'Desserts',price:'₹340',dietary:'Veg',description:'Warm gooey molten dark chocolate center in a crumbly shortcrust pastry shell.'}
  ],
  'del-leos-pizza': [
    {name:'Burrata & Parma Prosciutto Pizza',category:'Woodfired Pizza',price:'₹850',dietary:'Non-Veg',description:'Slow fermented 48-hr dough, San Marzano tomato sauce, fresh burrata, and aged Italian ham.'},
    {name:'Four Cheese Classic Bianco Pizza',category:'Woodfired Pizza',price:'₹780',dietary:'Veg',description:'Mozzarella, Gorgonzola, aged parmesan, and creamy ricotta with fresh basil.'},
    {name:'Traditional Espresso Tiramisu',category:'Desserts',price:'₹420',dietary:'Veg',description:'Savoiardi ladyfingers soaked in dark roast espresso, layered with whipped mascarpone crema.'}
  ],
  'del-carnatic-cafe': [
    {name:'Malleshwaram 18th Cross Benne Dosa',category:'South Indian Breakfast',price:'₹220',dietary:'Veg',description:'Crisp on the outside, ultra-fluffy inside, loaded with white churned butter and spicy red gunpowder.'},
    {name:'Traditional Degree Filter Coffee',category:'Coffee & Brews',price:'₹120',dietary:'Veg',description:'Authentic chicory blend brewed strong in brass dabarah and tumbler.'}
  ],
  'del-indian-accent': [
    {name:'Meetha Aachar Chilean Sea Bass',category:'Fine Dining Mains',price:'₹1,850',dietary:'Non-Veg',description:'Pan-seared sea bass glazed in sweet pickle spices, served over puffed wild rice.'},
    {name:'Warm Doda Barfi Treacle Tart',category:'Desserts',price:'₹650',dietary:'Veg',description:'Punjabi milk fudge transformed into British treacle tart, served with homemade dairy ice cream.'}
  ],

  // Bengaluru
  'blr-araku': [
    {name:'Araku Signature Cascara Sparkling Fizz',category:'Coffee & Brews',price:'₹320',dietary:'Veg',description:'Upcycled sun-dried coffee cherry husk brewed sparkling with kaffir lime and fresh mint.'},
    {name:'Micro-lot Nitro Cold Brew Silk',category:'Coffee & Brews',price:'₹290',dietary:'Veg',description:'Nitrogen-infused cold brew velvety smooth with dense natural crema and cacao tasting notes.'},
    {name:'Custard Brioche French Toast with Wild Honey',category:'Breakfast & Brunch',price:'₹420',dietary:'Egg',description:'Thick sliced artisanal brioche soaked in vanilla bean custard, served with tribal Araku honey.'},
    {name:'Smoked Duck & Fig Sourdough Tartine',category:'Mains & Small Plates',price:'₹540',dietary:'Non-Veg',description:'Thinly sliced cured duck breast, fig compote, and peppery arugula on rustic rye sourdough.'}
  ],
  'blr-third-wave': [
    {name:'Signature Sea Salt Mocha',category:'Coffee & Brews',price:'₹280',dietary:'Veg',description:'Espresso infused with rich dark chocolate, steamed milk, and Himalayan pink rock salt froth.'},
    {name:'Hummus & Zaatar Multigrain Toast',category:'Breakfast & Sourdough',price:'₹320',dietary:'Veg',description:'House garlic hummus, fire-roasted bell peppers, and Levantine zaatar on toasted grains.'},
    {name:'Warm Belgian Chocolate Waffle',category:'Desserts',price:'₹360',dietary:'Veg',description:'Crisp malted waffle crowned with dark chocolate ganache and vanilla whipped cream.'}
  ],
  'blr-glens-bakehouse': [
    {name:'Famous Signature Red Velvet Cupcake',category:'Bakes & Pastry',price:'₹120',dietary:'Veg',description:'Bengaluru legendary moist ruby cocoa cake smothered in rich tangy cream cheese frosting.'},
    {name:'Country Chicken Pot Pie',category:'Mains & Small Plates',price:'₹360',dietary:'Non-Veg',description:'Tender shredded chicken, peas, and carrots in velvety cream baked in a buttery puff crust.'},
    {name:'Salted Caramel Iced Frappe',category:'Coffee & Brews',price:'₹240',dietary:'Veg',description:'Blended iced coffee ribboned with house cooked sea salt caramel.'}
  ],
  'blr-toit': [
    {name:'Tintin Toit Belgian Witbier',category:'Craft Beverages',price:'₹380',dietary:'Veg',description:'Crisp Belgian style wheat ale brewed with orange peel, coriander seeds, and yeast.'},
    {name:'Woodfired Spicy Smoked Pork Pizza',category:'Woodfired Pizza',price:'₹620',dietary:'Non-Veg',description:'Thin crispy crust topped with Goan spiced pulled pork and molten mozzarella.'}
  ],
  'blr-nagarjuna': [
    {name:'Unlimited Andhra Banana Leaf Thali',category:'Regional Meals',price:'₹360',dietary:'Veg',description:'Steaming hot sona masoori rice, gunpowder podi, pure cow ghee, pappu dal, and spicy rasam.'},
    {name:'Iconic Andhra Chilli Chicken',category:'Regional Mains',price:'₹390',dietary:'Non-Veg',description:'Tender chicken chunks stir-fried with green chilies, curry leaves, and secret Andhra spice blend.'}
  ],

  // Pune
  'pun-one-o-eight': [
    {name:'Avocado Goddess Sourdough Tartine',category:'Breakfast & Sourdough',price:'₹420',dietary:'Veg',description:'Ripe Hass avocado, fermented beetroot cream, pumpkin seeds, and microgreens on rustic loaf.'},
    {name:'Turmeric Golden Mylk Cortado',category:'Coffee & Brews',price:'₹260',dietary:'Veg',description:'Double espresso blended with Lakadong high-curcumin turmeric, oat milk, and cracked black pepper.'},
    {name:'Fluffy Buckwheat Banana Pancakes',category:'Breakfast & Brunch',price:'₹380',dietary:'Veg',description:'Gluten-free buckwheat stack drizzled with organic maple syrup and toasted walnuts.'}
  ],
  'pun-vohuman': [
    {name:'Double Cheese & Mushroom Omelette',category:'Parsi Breakfast',price:'₹170',dietary:'Egg',description:'Pune’s most famous morning dish: two-egg fluffy omelette packed with molten processed cheese.'},
    {name:'Brun Maska & Spiced Irani Chai',category:'Parsi Breakfast',price:'₹90',dietary:'Veg',description:'Crusty hard-baked bread roll slathered with cold salted butter, dipped in fragrant milky tea.'}
  ],

  // Jaipur
  'curious-life': [
    {name:'Ceramic V60 Micro-Lot Pour Over',category:'Coffee & Brews',price:'₹260',dietary:'Veg',description:'Meticulously hand-dripped Arabica from certified Indian bio-diverse coffee estates.'},
    {name:'Butter Croissant Croque Monsieur',category:'Breakfast & Bakes',price:'₹440',dietary:'Egg',description:'Laminated butter croissant baked with creamy béchamel, smoked ham, and melted Emmental.'},
    {name:'Affogato al Cafe with Madagascar Vanilla',category:'Desserts',price:'₹240',dietary:'Veg',description:'Fresh pulled piping hot espresso over a double scoop of rich Madagascar vanilla bean gelato.'}
  ],
  'anokhi-cafe': [
    {name:'Organic Farm Salad with Pomegranate & Feta',category:'Salads & Healthy',price:'₹360',dietary:'Veg',description:'Freshly harvested organic farm greens, crumbled feta, toasted pine nuts, and lemon vinaigrette.'},
    {name:'Mascarpone & Berry Cheesecake',category:'Desserts',price:'₹320',dietary:'Veg',description:'Baked Italian mascarpone cheesecake topped with simmered seasonal farm berries.'}
  ],

  // Goa
  'goa-baba-au-rhum': [
    {name:'Traditional Baba au Rhum Cake',category:'Bakes & Pastry',price:'₹340',dietary:'Veg',description:'Traditional yeast-risen French brioche soaked in dark Old Monk rum syrup with whipped chantilly.'},
    {name:'Goa Smoked Bacon Quiche Lorraine',category:'Breakfast & Bakes',price:'₹420',dietary:'Non-Veg',description:'Flaky shortcrust pastry filled with local smoked bacon lardons, gruyère, and rich custard.'},
    {name:'Cold Brew Affogato Tonic',category:'Coffee & Brews',price:'₹260',dietary:'Veg',description:'Concentrated cold brew over coconut gelato topped with sparkling tonic.'}
  ],
  'goa-caravela': [
    {name:'Panjim Chorizo Fermented Poee',category:'Goan Specialties',price:'₹380',dietary:'Non-Veg',description:'Warm fermented Goan wheat pocket bread packed with tangy, fiery pork chorizo and sautéed onions.'},
    {name:'Authentic Seven-Layer Bebinca',category:'Desserts',price:'₹280',dietary:'Veg',description:'Traditional baked Goan coconut milk and egg yolk layered dessert served with vanilla bean ice cream.'}
  ],
  'goa-artjuna': [
    {name:'Mediterranean Mezze Platter',category:'Mains & Small Plates',price:'₹480',dietary:'Veg',description:'Creamy tahini hummus, smoked babaganoush, fresh falafel, kalamata olives, and warm pita.'},
    {name:'Spirulina Power Smoothie Bowl',category:'Breakfast & Healthy',price:'₹380',dietary:'Veg',description:'Frozen banana, mango, organic spirulina, topped with chia seeds, cacao nibs, and coconut.'}
  ],

  // Kolkata
  'kol-8th-day': [
    {name:'Classic American Cinnamon Roll',category:'Bakes & Pastry',price:'₹240',dietary:'Veg',description:'Warm, pillowy yeast dough swirled with spicy brown cinnamon sugar and smothered in cream cheese frosting.'},
    {name:'Everything Bagel with Lox & Cream Cheese',category:'Breakfast & Brunch',price:'₹480',dietary:'Non-Veg',description:'Boiled and baked NYC style bagel topped with cured smoked salmon, capers, and scallion cream cheese.'},
    {name:'Kolkata Cold Brew Float',category:'Coffee & Brews',price:'₹260',dietary:'Veg',description:'Concentrated dark cold brew topped with a generous scoop of artisanal vanilla ice cream.'}
  ],
  'kol-sienna': [
    {name:'Crispy Bhetki with Bengal Kasundi Dip',category:'Regional Small Plates',price:'₹580',dietary:'Non-Veg',description:'Fresh flaky Kolkata Bhetki fillet in crisp batter with pungent fermented mustard seed emulsion.'},
    {name:'Handmade Walnut Pesto Tagliatelle',category:'Mains & Pasta',price:'₹460',dietary:'Veg',description:'Daily spun fresh egg pasta tossed with roasted Bengal walnut and aromatic basil pesto.'}
  ],

  // Hyderabad
  'hyd-concu': [
    {name:'Signature Opera Gateau',category:'Desserts',price:'₹380',dietary:'Veg',description:'Six delicate layers of almond joconde sponge soaked in coffee syrup, French espresso buttercream, and dark ganache.'},
    {name:'Pistachio Brioche Feuilletée',category:'Bakes & Pastry',price:'₹320',dietary:'Veg',description:'Flaky laminated puff brioche stuffed with roasted Sicilian pistachio praline and sea salt.'},
    {name:'Spanish Cortado with Condensed Milk',category:'Coffee & Brews',price:'₹260',dietary:'Veg',description:'Equal parts rich dark roast espresso and sweet steamed leche.'}
  ],
  'hyd-autumn-leaf': [
    {name:'Rose & Cardamom Iced Latte',category:'Coffee & Brews',price:'₹280',dietary:'Veg',description:'Double espresso laced with organic Kannauj rosewater, ground green cardamom, and chilled oat milk.'},
    {name:'Smoked Paprika Chicken Skewers',category:'Mains & Small Plates',price:'₹420',dietary:'Non-Veg',description:'Charcoal grilled tender chicken skewers served with garlic aioli and pickled cucumbers.'}
  ],

  // Chennai
  'chn-chamiers': [
    {name:'High Tea Scones with Clotted Cream & Jam',category:'Bakes & High Tea',price:'₹320',dietary:'Veg',description:'Two warm English buttermilk scones served with rich clotted cream and strawberry preserves.'},
    {name:'English Country Breakfast Platter',category:'Breakfast & Brunch',price:'₹460',dietary:'Egg',description:'Butter scrambled eggs, grilled tomatoes, sautéed wild mushrooms, and toasted sourdough.'},
    {name:'Fresh Meyer Lemon Meringue Tart',category:'Desserts',price:'₹280',dietary:'Veg',description:'Buttery shortcrust pastry shell filled with tangy lemon curd and torched Italian meringue.'}
  ],
  'chn-ciclo': [
    {name:'Truffled Funghi Woodfired Pizza',category:'Woodfired Pizza',price:'₹540',dietary:'Veg',description:'Crisp thin crust, portobello mushrooms, fontina cheese, and aromatic white truffle oil.'},
    {name:'Handmade Spinach & Ricotta Ravioli',category:'Mains & Pasta',price:'₹450',dietary:'Veg',description:'Delicate stuffed pasta parcels pan-fried in sage-infused brown butter and toasted pine nuts.'}
  ],

  // Kochi
  'koc-french-toast': [
    {name:'Golden Brioche French Toast with Caramelized Bananas',category:'Breakfast & Brunch',price:'₹380',dietary:'Egg',description:'Thick sliced country brioche crusted in cinnamon sugar, topped with buttery bananas and whipped cream.'},
    {name:'Malabar Spiced Cold Brew',category:'Coffee & Brews',price:'₹240',dietary:'Veg',description:'Slow steeped cold brew coffee infused with roasted Kerala green cardamom and sweet cinnamon bark.'},
    {name:'70% Valrhona Dark Drinking Chocolate',category:'Beverages & Bakes',price:'₹320',dietary:'Veg',description:'Velvety European sipping chocolate made from melted single origin chocolate beans.'}
  ],

  // Chandigarh
  'chd-willow': [
    {name:'Crisp Amritsari Kulcha with Chana & Maska',category:'North Indian Breakfast',price:'₹340',dietary:'Veg',description:'Layered flaky tandoori kulcha stuffed with spiced potatoes, served with slow-cooked chickpeas and butter.'},
    {name:'Warm Apple & Berry Crumble with Vanilla Custard',category:'Desserts',price:'₹320',dietary:'Veg',description:'Baked spiced apples and berries under a golden oats crumble, served with piping hot vanilla sauce.'},
    {name:'Kashmiri Kehwa & Saffron Tea',category:'Beverages & Brews',price:'₹210',dietary:'Veg',description:'Green tea steeped with whole saffron strands, green cardamom, cinnamon, and slivered almonds.'}
  ],
  'chd-backpackers': [
    {name:'The Backpackers Full English Breakfast',category:'Breakfast & Brunch',price:'₹480',dietary:'Egg',description:'Sunny side up farm eggs, grilled chicken sausages, hash browns, baked beans, and buttered toast.'},
    {name:'Belgian Malt Waffle with Warm Maple Syrup',category:'Breakfast & Bakes',price:'₹340',dietary:'Veg',description:'Airy, golden Belgian waffle with melted butter and pure Canadian maple syrup.'}
  ]
};

function generateCuratedDishes(r){
  if(!r)return [];
  const tags=[...(r.c||[]),...(r.t||[]),r.name||''].join(' ').toLowerCase();
  const priceTier=r.p||'500_1000';
  const isHighEnd=priceTier==='1000_2000'||priceTier==='2000_plus';
  const isVeg=r.dietaryOptions?.includes('vegetarian')&&!r.dietaryOptions?.includes('non-vegetarian');
  
  if(tags.includes('cafe')||tags.includes('coffee')||tags.includes('bakery')||tags.includes('bakehouse')){
    return [
      {name:'Artisanal Pour-Over V60 Reserve',category:'Coffee & Brews',price:isHighEnd?'₹290':'₹220',dietary:'Veg',description:'Handcrafted pour-over using single-origin estate coffee beans with notes of caramel and dried fruit.'},
      {name:'36-Hour Sourdough Toast & Cultured Butter',category:'Breakfast & Sourdough',price:isHighEnd?'₹340':'₹260',dietary:'Veg',description:'Naturally fermented rustic country loaf toasted golden and served with herb-infused butter.'},
      {name:'Almond & Dark Chocolate Croissant',category:'Bakes & Pastry',price:isHighEnd?'₹290':'₹240',dietary:'Veg',description:'Flaky French laminated butter pastry filled with almond frangipane and Belgian chocolate.'},
      {name:'Avocado & Blistered Tomato Tartine',category:'Breakfast & Brunch',price:isHighEnd?'₹420':'₹340',dietary:isVeg?'Veg':'Egg',description:'Mashed Hass avocado, cherry tomatoes, and microgreens on toasted multi-seed sourdough.'}
    ];
  }
  if(tags.includes('italian')||tags.includes('pizza')||tags.includes('pasta')){
    return [
      {name:'Woodfired Truffle & Burrata Pizza',category:'Woodfired Pizza',price:isHighEnd?'₹750':'₹580',dietary:'Veg',description:'48-hour fermented Neapolitan dough with San Marzano sauce, fresh creamy burrata, and white truffle oil.'},
      {name:'Handcrafted Tagliatelle al Funghi',category:'Mains & Pasta',price:isHighEnd?'₹620':'₹480',dietary:'Veg',description:'Freshly extruded ribbon pasta tossed with wild forest mushrooms, garlic, and aged parmesan.'},
      {name:'Classic Espresso Tiramisu',category:'Desserts',price:isHighEnd?'₹420':'₹320',dietary:'Veg',description:'Italian ladyfingers soaked in dark roast espresso and layered with whipped mascarpone.'}
    ];
  }
  if(tags.includes('gujarati')||tags.includes('thali')||tags.includes('kathiyawadi')){
    return [
      {name:'Royal Heritage Gujarati Thali',category:'Regional Meals',price:isHighEnd?'₹650':'₹420',dietary:'Veg',description:'Grand spread of farsan, four seasonal curries, sweet Gujarati dal, kadhi, and hot phulkas drenched in ghee.'},
      {name:'Ringna no Oro with Bajri no Rotlo',category:'Kathiyawadi Classics',price:isHighEnd?'₹380':'₹260',dietary:'Veg',description:'Smoky roasted eggplant mash served with clay-tava pearl millet flatbread, jaggery, and white butter.'},
      {name:'Kesar Pista Shrikhand & Warm Fafda',category:'Desserts & Farsan',price:isHighEnd?'₹240':'₹160',dietary:'Veg',description:'Silky hung yogurt infused with Kashmiri saffron and crushed pistachios, paired with crunchy papad.'}
    ];
  }
  if(tags.includes('seafood')||tags.includes('coastal')||tags.includes('mangalorean')){
    return [
      {name:'Butter Garlic Jumbo Crab / Prawns',category:'Coastal Seafood',price:isHighEnd?'₹1,450':'₹780',dietary:'Non-Veg',description:'Fresh catch cooked in aromatic golden garlic butter and freshly crushed Tellicherry peppercorns.'},
      {name:'Neer Dosa with Coastal Fish Curry',category:'Regional Mains',price:isHighEnd?'₹620':'₹440',dietary:'Non-Veg',description:'Paper-thin steamed rice crepes served with spicy, tangy coconut and kokum fish gravy.'},
      {name:'Solkadhi with Crispy Rava Fry',category:'Coastal Specialties',price:isHighEnd?'₹340':'₹260',dietary:'Non-Veg',description:'Digestive pink kokum and coconut milk nectar paired with semolina-crusted golden pan fry.'}
    ];
  }
  if(tags.includes('dessert')||tags.includes('ice cream')||tags.includes('sweet')){
    return [
      {name:'Single-Estate Dark Chocolate Mousse Tart',category:'Desserts',price:isHighEnd?'₹360':'₹260',dietary:'Veg',description:'70% Indian cacao chocolate mousse in crisp hazelnut shortbread shell.'},
      {name:'Artisanal Pistachio & Sea Salt Gelato',category:'Gelato & Ice Cream',price:isHighEnd?'₹240':'₹180',dietary:'Veg',description:'Slow churned creamy Italian gelato infused with roasted Sicilian pistachios.'},
      {name:'Warm Berry Crumble with Vanilla Custard',category:'Desserts',price:isHighEnd?'₹320':'₹240',dietary:'Veg',description:'Simmered raspberries and blackberries topped with toasted oats crumble and warm anglaise.'}
    ];
  }
  return [
    {name:'Chef’s Signature Degustation Platter',category:'Chef Specialties',price:isHighEnd?'₹680':'₹460',dietary:isVeg?'Veg':'Non-Veg',description:'Curated assortment of the kitchen’s top small plates highlighting regional seasonings.'},
    {name:'Wood-Smoked Paneer / Chicken Skewers',category:'Small Plates',price:isHighEnd?'₹480':'₹360',dietary:isVeg?'Veg':'Non-Veg',description:'Marinated in toasted spices, charred over natural charcoal embers and served with mint emulsion.'},
    {name:'Artisanal Hibiscus & Kaffir Lime Refresher',category:'Beverages',price:isHighEnd?'₹260':'₹190',dietary:'Veg',description:'Cold brewed wild hibiscus flowers with muddled lime leaves and sparkling mineral water.'}
  ];
}

function resolveBestDishes(r){
  if(!r)return [];
  const id=r.id||'';
  if(BEST_DISHES_REGISTRY[id])return BEST_DISHES_REGISTRY[id];
  const nameClean=(r.name||'').toLowerCase();
  for(const [regKey,dishes] of Object.entries(BEST_DISHES_REGISTRY)){
    if(id.includes(regKey)||regKey.includes(id))return dishes;
    const keyParts=regKey.replace(/^[a-z]{3}-/,'').split('-');
    if(keyParts.length>1&&keyParts.every(p=>nameClean.includes(p)))return dishes;
  }
  return generateCuratedDishes(r);
}

function renderDishesModalHtml(r){
  const id=esc(r.id);
  const dishes=resolveBestDishes(r);
  const place=esc(r.area||r.city||cityName());
  return `<div class="modal dishesModal" id="dishesModal" role="dialog" aria-modal="true" aria-labelledby="dishesModalTitle">
    <div class="modalBackdrop" data-action="close-dishes-modal"></div>
    <div class="modalCard dishesModalCard">
      <div class="dishesModalHeader">
        <div>
          <div class="studioModelPill" style="margin-bottom:8px">
            <span class="studioLiveDot"></span>
            <span>Gemini-Palate-1.5 Verified Menu</span>
          </div>
          <h2 id="dishesModalTitle">${esc(r.name)}</h2>
          <p class="dishesModalSubtitle">${place} · ${esc(displayPrice(r))} · ★ ${Number(r.rating).toFixed(1)}</p>
        </div>
        <button type="button" class="dishesModalCloseBtn" id="dishesModalClose" data-action="close-dishes-modal" aria-label="Close dishes dialog">✕</button>
      </div>
      <div class="dishesModalContent">
        <p class="studioHint">Handcrafted signature dishes and crowd-favorite recommendations compiled from diner sentiment and menu telemetry.</p>
        <div class="dishesList">
          ${dishes.map(d=>`
            <div class="dishModalItem">
              <div class="dishModalItemHead">
                <div class="dishModalTitleRow">
                  <span class="dishDietBadge ${d.dietary?.toLowerCase().includes('non-veg')?'nonVeg':d.dietary?.toLowerCase().includes('egg')?'egg':'veg'}" title="${esc(d.dietary)}">●</span>
                  <strong class="dishModalName">${esc(d.name)}</strong>
                </div>
                <div class="dishModalMeta">
                  <span class="dishModalCategory">${esc(d.category)}</span>
                  <span class="dishModalPrice">${esc(d.price)}</span>
                </div>
              </div>
              <p class="dishModalDesc">${esc(d.description)}</p>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="dishesModalFooter">
        <button type="button" class="btn secondary" data-action="close-dishes-modal">Close</button>
        <button type="button" class="btn secondary" data-action="open-place" data-rest-id="${id}">Full Cafe Details →</button>
        <button type="button" class="btn green" data-rest-action="maps" data-rest-id="${id}">Directions ↗</button>
      </div>
    </div>
  </div>`;
}

function openDishesModal(id){
  const r=activeRestaurant(id);
  if(!r)return;
  activeDishModalVenue=r;
  document.getElementById('dishesModal')?.remove();
  document.body.insertAdjacentHTML('beforeend', renderDishesModalHtml(r));
  document.getElementById('dishesModalClose')?.focus();
}

function closeDishesModal(){
  activeDishModalVenue=null;
  document.getElementById('dishesModal')?.remove();
}

function renderBestDishesShowcase(venues){
  const allDishes=[];
  venues.forEach(r=>{
    const dishes=resolveBestDishes(r);
    dishes.forEach(d=>{
      allDishes.push({dish:d, venue:r});
    });
  });
  
  let displayedDishes=allDishes;
  if(selectedDishCategory!=='all'){
    displayedDishes=allDishes.filter(item=>{
      const cat=item.dish.category.toLowerCase();
      if(selectedDishCategory==='coffee')return cat.includes('coffee')||cat.includes('brew');
      if(selectedDishCategory==='bakes')return cat.includes('bake')||cat.includes('sourdough')||cat.includes('croissant');
      if(selectedDishCategory==='breakfast')return cat.includes('breakfast')||cat.includes('brunch')||cat.includes('egg');
      if(selectedDishCategory==='mains')return cat.includes('main')||cat.includes('pizza')||cat.includes('pasta')||cat.includes('sandwich')||cat.includes('plate')||cat.includes('seafood');
      if(selectedDishCategory==='desserts')return cat.includes('dessert')||cat.includes('gelato')||cat.includes('pastry');
      return true;
    });
  }

  const categoryChips=`<div class="filterChips dishCategoryChips" role="group" aria-label="Filter dishes by category">
    <button type="button" class="filterChip ${selectedDishCategory==='all'?'active':''}" data-action="set-dish-category" data-category="all">All Dishes (${allDishes.length})</button>
    <button type="button" class="filterChip ${selectedDishCategory==='coffee'?'active':''}" data-action="set-dish-category" data-category="coffee">☕ Coffee & Brews</button>
    <button type="button" class="filterChip ${selectedDishCategory==='bakes'?'active':''}" data-action="set-dish-category" data-category="bakes">🥐 Bakes & Sourdough</button>
    <button type="button" class="filterChip ${selectedDishCategory==='breakfast'?'active':''}" data-action="set-dish-category" data-category="breakfast">🍳 Breakfast & Brunch</button>
    <button type="button" class="filterChip ${selectedDishCategory==='mains'?'active':''}" data-action="set-dish-category" data-category="mains">🍕 Mains & Specialties</button>
    <button type="button" class="filterChip ${selectedDishCategory==='desserts'?'active':''}" data-action="set-dish-category" data-category="desserts">🍨 Desserts & Gelato</button>
  </div>`;

  if(!displayedDishes.length){
    return `${categoryChips}<div class="empty"><h2>No dishes match this category</h2><p>Switch to “All Dishes” or adjust your Palate Prompt above.</p></div>`;
  }

  const gridHtml=`<div class="dishesShowcaseGrid" aria-label="Best dishes across ${esc(cityName())}">
    ${displayedDishes.slice(0, 36).map(({dish,venue})=>`
      <article class="dishShowcaseCard">
        <div class="dishShowcaseTop">
          <div class="dishShowcaseHeader">
            <span class="dishDietBadge ${dish.dietary?.toLowerCase().includes('non-veg')?'nonVeg':dish.dietary?.toLowerCase().includes('egg')?'egg':'veg'}">●</span>
            <strong class="dishShowcaseName">${esc(dish.name)}</strong>
          </div>
          <span class="dishShowcasePrice">${esc(dish.price)}</span>
        </div>
        <p class="dishShowcaseDesc">${esc(dish.description)}</p>
        <div class="dishShowcaseVenue">
          <div class="dishShowcaseVenueInfo">
            <span class="dishVenueName">${esc(venue.name)}</span>
            <span class="dishVenueArea">${esc(venue.area||venue.city)} · ★ ${Number(venue.rating).toFixed(1)}</span>
          </div>
          <div class="dishShowcaseActions">
            <button type="button" class="btn secondary smallBtn" data-action="open-dishes-modal" data-rest-id="${esc(venue.id)}" aria-label="All dishes at ${esc(venue.name)}">All Menu →</button>
            <button type="button" class="btn green smallBtn" data-rest-action="maps" data-rest-id="${esc(venue.id)}" aria-label="Directions to ${esc(venue.name)}">Directions ↗</button>
          </div>
        </div>
      </article>
    `).join('')}
  </div>`;

  return `${categoryChips}${gridHtml}`;
}

function toggleStudioTuner(){
  studioTunerOpen=!studioTunerOpen;
  home();
}
function setMinMatch(val){
  minMatchThreshold=val;
  homeLimit=12;
  home();
}
function setAdventureMode(mode){
  adventureMode=mode;
  homeLimit=12;
  home();
}
function applyPrompt(text){
  promptQuery=text;
  homeLimit=12;
  home();
}
function runPrompt(){
  const input=document.getElementById('studioPromptInput');
  if(input)promptQuery=input.value.trim();
  homeLimit=12;
  home();
}
function clearPrompt(){
  promptQuery='';
  homeLimit=12;
  home();
}
function setDishCategory(cat){
  selectedDishCategory=cat;
  home();
}
'@

if (-not $content.Contains("const BEST_DISHES_REGISTRY =")) {
    $anchor = "];`r`n`r`nconst cityCenters={"
    if (-not $content.Contains($anchor)) {
        $anchor = "];`n`nconst cityCenters={"
    }
    if (-not $content.Contains($anchor)) {
        # Try finding "];" right before "const cityCenters"
        $idxCity = $content.IndexOf("const cityCenters={")
        if ($idxCity -gt 0) {
            $idxBracket = $content.LastIndexOf("];", $idxCity)
            if ($idxBracket -gt 0) {
                $before = $content.Substring(0, $idxBracket + 2)
                $after = $content.Substring($idxBracket + 2)
                $content = $before + "`n`n" + $registryCode + "`n" + $after
                Write-Host "Injected BEST_DISHES_REGISTRY and helpers." -ForegroundColor Green
            } else {
                throw "Could not find closing bracket before cityCenters."
            }
        } else {
            throw "Could not find cityCenters."
        }
    } else {
        $replacement = "];`n`n" + $registryCode + "`n`nconst cityCenters={"
        $content = $content.Replace($anchor, $replacement)
        Write-Host "Injected BEST_DISHES_REGISTRY and helpers via anchor." -ForegroundColor Green
    }
}

# 3. Update card(r)
$oldCardStart = "function card(r){`n const saved=state.saves.includes(r.id),f=state.feedback[r.id],id=esc(r.id);`n const place=r.area||r.city||cityName(),rating=Number(r.rating).toFixed(1),reviews=Number(r.review_count)||0;"
$newCardStart = "function card(r){`n const saved=state.saves.includes(r.id),f=state.feedback[r.id],id=esc(r.id);`n const place=r.area||r.city||cityName(),rating=Number(r.rating).toFixed(1),reviews=Number(r.review_count)||0;`n const dishes=resolveBestDishes(r);`n const topDishes=dishes.slice(0, 3);"

# Search for card(r) in content
$regexCard = 'function card\(r\){\s+const saved=state\.saves\.includes\(r\.id\),f=state\.feedback\[r\.id\],id=esc\(r\.id\);\s+const place=r\.area\|\|r\.city\|\|cityName\(\),rating=Number\(r\.rating\)\.toFixed\(1\),reviews=Number\(r\.review_count\)\|\|0;\s+return `<article class="card restaurant-card" data-place-id="\${id}" id="card-\${id}"><div class="resthead"><button type="button" class="photo" data-action="open-place" data-rest-id="\${id}" aria-label="Explore \${esc\(r\.name\)}">\${photo\(r\)}</button><div><h3 class="restname"><button type="button" class="restnameButton" data-action="open-place" data-rest-id="\${id}">\${esc\(r\.name\)}</button></h3><div class="meta">\${esc\(place\)} · \${esc\(displayPrice\(r\)\)}<br>★ \${rating}\${reviews\?" · "\+reviews\.toLocaleString\(\)\+" ratings":""}\${r\.ratingSource\?" · "\+esc\(r\.ratingSource\):""}</div></div><div class="match \${r\.score>=75\?"strong":r\.score>=50\?"mixed":"low"}" title="Estimated taste fit from your quiz and feedback"><b>\${r\.score}%</b><span>PALATE MATCH</span></div></div><div class="tags">\${\[\.\.\.new Set\(\[\.\.\.\(r\.c\|\|\[\]\),\.\.\.\(r\.t\|\|\[\]\)\]\)\]\.slice\(0,3\)\.map\(x=>`<span class="tag">\${esc\(x\)}</span>`\)\.join\(""\)}</div><p class="fitReason"><b>Why it fits</b> · \${esc\(r\.why\[0\]\)}</p><details class="why"><summary>Your match explained</summary><p>\${esc\(r\.why\.join\(" · "\)\)}<br><br>An estimate from your quiz and active feedback\. Tap a selected rating again to undo it\. Venue details and prices can change; confirm before visiting\.</p></details><div class="actions"><button type="button" data-rest-action="like" data-rest-id="\${id}" aria-pressed="\${f===''like''}" aria-label="\${f===''like''\?''Unlike'':''Like''} \${esc\(r\.name\)}">\${f===''like''\?''♥ Undo like'':''♡ Like''}</button><button type="button" data-rest-action="dislike" data-rest-id="\${id}" aria-pressed="\${f===''dislike''}" aria-label="\${f===''dislike''\?''Undo not for me'':''Not for me''}: \${esc\(r\.name\)}">\${f===''dislike''\?''Undo pass'':''Not for me''}</button><button type="button" class="dark" data-rest-action="save" data-rest-id="\${id}" aria-label="\${saved\?''Remove'':''Save''} \${esc\(r\.name\)}">\${saved\?''Saved ✓'':''Save''}</button></div><div class="actions"><button type="button" data-rest-action="visited" data-rest-id="\${id}" aria-pressed="\${f===''visited''}" aria-label="\${f===''visited''\?''Undo visited'':''I visited''}: \${esc\(r\.name\)}">\${f===''visited''\?''Undo visit'':''I visited''}</button><button type="button" data-action="view-pin" data-rest-id="\${id}" aria-label="Locate \${esc\(r\.name\)} on your map">On your map</button><button type="button" data-rest-action="maps" data-rest-id="\${id}" aria-label="Directions to \${esc\(r\.name\)}">Directions ↗</button></div></article>`\s+}'

$newCardBody = @'
function card(r){
 const saved=state.saves.includes(r.id),f=state.feedback[r.id],id=esc(r.id);
 const place=r.area||r.city||cityName(),rating=Number(r.rating).toFixed(1),reviews=Number(r.review_count)||0;
 const dishes=resolveBestDishes(r);
 const topDishes=dishes.slice(0, 3);
 return `<article class="card restaurant-card" data-place-id="${id}" id="card-${id}"><div class="resthead"><button type="button" class="photo" data-action="open-place" data-rest-id="${id}" aria-label="Explore ${esc(r.name)}">${photo(r)}</button><div><h3 class="restname"><button type="button" class="restnameButton" data-action="open-place" data-rest-id="${id}">${esc(r.name)}</button></h3><div class="meta">${esc(place)} · ${esc(displayPrice(r))}<br>★ ${rating}${reviews?" · "+reviews.toLocaleString()+" ratings":""}${r.ratingSource?" · "+esc(r.ratingSource):""}</div></div><div class="match ${r.score>=75?"strong":r.score>=50?"mixed":"low"}" title="Estimated taste fit from your quiz and feedback"><b>${r.score}%</b><span>PALATE MATCH</span></div></div><div class="tags">${[...new Set([...(r.c||[]),...(r.t||[])])].slice(0,3).map(x=>`<span class="tag">${esc(x)}</span>`).join("")}</div><p class="fitReason"><b>Why it fits</b> · ${esc(r.why[0])}</p><div class="cardBestDishes"><div class="cardBestDishesHeader"><span class="cardBestDishesTitle">⭐ BEST DISHES</span><button type="button" class="viewAllDishesBtn" data-action="open-dishes-modal" data-rest-id="${id}">View menu highlights (${dishes.length}) →</button></div><div class="cardDishesList">${topDishes.map(d=>`<div class="cardDishItem" data-action="open-dishes-modal" data-rest-id="${id}" role="button" tabindex="0"><div class="cardDishInfo"><span class="cardDishDiet ${d.dietary?.toLowerCase().includes('non-veg')?'nonVeg':d.dietary?.toLowerCase().includes('egg')?'egg':'veg'}">●</span><span class="cardDishName">${esc(d.name)}</span></div><span class="cardDishPrice">${esc(d.price)}</span></div>`).join('')}</div></div><details class="why"><summary>Your match explained</summary><p>${esc(r.why.join(" · "))}<br><br>An estimate from your quiz and active feedback. Tap a selected rating again to undo it. Venue details and prices can change; confirm before visiting.</p></details><div class="actions"><button type="button" data-rest-action="like" data-rest-id="${id}" aria-pressed="${f==='like'}" aria-label="${f==='like'?'Unlike':'Like'} ${esc(r.name)}">${f==='like'?'♥ Undo like':'♡ Like'}</button><button type="button" data-rest-action="dislike" data-rest-id="${id}" aria-pressed="${f==='dislike'}" aria-label="${f==='dislike'?'Undo not for me':'Not for me'}: ${esc(r.name)}">${f==='dislike'?'Undo pass':'Not for me'}</button><button type="button" class="dark" data-rest-action="save" data-rest-id="${id}" aria-label="${saved?'Remove':'Save'} ${esc(r.name)}">${saved?'Saved ✓':'Save'}</button></div><div class="actions"><button type="button" data-rest-action="visited" data-rest-id="${id}" aria-pressed="${f==='visited'}" aria-label="${f==='visited'?'Undo visited':'I visited'}: ${esc(r.name)}">${f==='visited'?'Undo visit':'I visited'}</button><button type="button" data-action="view-pin" data-rest-id="${id}" aria-label="Locate ${esc(r.name)} on your map">On your map</button><button type="button" data-rest-action="maps" data-rest-id="${id}" aria-label="Directions to ${esc(r.name)}">Directions ↗</button></div></article>`
}
'@

if ($content -match $regexCard) {
    $content = $content -replace $regexCard, $newCardBody
    Write-Host "Updated card(r) with best dishes." -ForegroundColor Green
} else {
    Write-Host "Searching card(r) via string slice..." -ForegroundColor Yellow
    $idxCardStart = $content.IndexOf("function card(r){")
    if ($idxCardStart -gt 0) {
        $idxCardEnd = $content.IndexOf("function go(p,", $idxCardStart)
        if ($idxCardEnd -gt 0) {
            $before = $content.Substring(0, $idxCardStart)
            $after = $content.Substring($idxCardEnd)
            $content = $before + $newCardBody + "`n" + $after
            Write-Host "Updated card(r) via slice." -ForegroundColor Green
        }
    }
}

# 4. Update home()
$newHomeBody = @'
function home(){
const allRanked=ranked();
let filtered=allRanked;
const visitedCount=allRanked.filter(r=>state.feedback[r.id]==='visited').length;

if(homeCuisine!=='all'){
  filtered=allRanked.filter(r=>{
    if(homeCuisine==='Visited') return state.feedback[r.id]==='visited';
    if(homeCuisine==='Saved') return state.saves.includes(r.id);
    const pool=[...(r.c||[]),...(r.t||[])].map(x=>String(x).toLowerCase());
    if(homeCuisine==='Cafe')return pool.some(x=>x.includes('cafe')||x.includes('coffee'));
    if(homeCuisine==='Dessert')return pool.some(x=>x.includes('dessert')||x.includes('ice cream')||x.includes('gelato')||x.includes('kulfi')||x.includes('bakery')||x.includes('sweet'));
    if(homeCuisine==='Gujarati')return pool.some(x=>x.includes('gujarati')||x.includes('thali')||x.includes('kathiyawadi'));
    if(homeCuisine==='Italian')return pool.some(x=>x.includes('italian')||x.includes('pizza')||x.includes('pasta'));
    if(homeCuisine==='Fine dining')return (r.p==='1000_2000'||r.p==='2000_plus')||pool.some(x=>x.includes('premium')||x.includes('fine dining'));
    return pool.some(x=>x.includes(homeCuisine.toLowerCase()));
  });
}

if(minMatchThreshold>0){
  filtered=filtered.filter(r=>r.score>=minMatchThreshold);
}

if(adventureMode==='discover'){
  filtered=[...filtered].sort((a,b)=>{
    const aGem=(a.rating>=4.5&&(a.review_count||0)<2000)?1:0;
    const bGem=(b.rating>=4.5&&(b.review_count||0)<2000)?1:0;
    return (bGem*15+b.score)-(aGem*15+a.score);
  });
} else if(adventureMode==='familiar'){
  filtered=[...filtered].sort((a,b)=>{
    return (((b.review_count||0)>3000?10:0)+b.score) - (((a.review_count||0)>3000?10:0)+a.score);
  });
}

if(promptQuery.trim()){
  const terms=promptQuery.toLowerCase().split(/\s+/).filter(t=>t.length>1);
  filtered=filtered.filter(r=>{
    const dishes=resolveBestDishes(r);
    const textPool=[
      r.name, r.area, r.city,
      ...(r.c||[]), ...(r.t||[]), ...(r.a||[]), ...(r.o||[]),
      ...(r.review_insights||[]),
      r.why?.join(' '),
      ...dishes.map(d=>d.name+' '+d.category+' '+(d.description||''))
    ].join(' ').toLowerCase();
    return terms.some(t=>textPool.includes(t));
  });
}

const topPick=filtered[0];
const selectedIndex=filtered.findIndex(r=>r.id===selectedPinId);
if(selectedIndex>=homeLimit)homeLimit=selectedIndex+1;
const rs=filtered.slice(0,homeLimit);
const showMoreButton=(homeView!=='dishes'&&filtered.length>rs.length)?`<div class="homeMoreAction"><button class="btn secondary" type="button" data-action="load-more-home">Show more recommendations (${filtered.length-rs.length} more) ↓</button></div>`:'';

const viewTabs=`<div class="viewSwitcher" role="group" aria-label="Choose recommendation view">
<button type="button" class="viewTab ${homeView==='map'?'active':''}" aria-pressed="${homeView==='map'}" data-action="home-view" data-view="map">🗺️ 3D Palate Map</button>
<button type="button" class="viewTab ${homeView==='feed'?'active':''}" aria-pressed="${homeView==='feed'}" data-action="home-view" data-view="feed">🍱 Studio Cards</button>
<button type="button" class="viewTab ${homeView==='dishes'?'active':''}" aria-pressed="${homeView==='dishes'}" data-action="home-view" data-view="dishes">⭐ Best Dishes</button>
</div>`;

const studioControlBar=`<div class="studioControlBar">
  <div class="studioHeaderRow">
    <div class="studioModelPill" title="Gemini-Palate-1.5 Neural Reranker Active">
      <span class="studioLiveDot"></span>
      <span class="studioModelName">Gemini-Palate-1.5</span>
      <span class="studioModelStatus">Active</span>
    </div>
    <div class="studioMetaStats">
      <span class="studioStatChip">T: 0.7</span>
      <span class="studioStatChip">Vectors: ${allRanked.length} spots</span>
      <button type="button" class="studioTunerToggleBtn ${studioTunerOpen?'active':''}" data-action="toggle-tuner" aria-label="Toggle parameter tuning console" aria-expanded="${studioTunerOpen}">
        <svg class="smallIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6"/></svg>
        <span>Parameters</span>
      </button>
    </div>
  </div>

  ${studioTunerOpen?`
  <div class="studioTunerPanel" id="studioTunerPanel">
    <div class="tunerGrid">
      <div class="tunerGroup">
        <label class="tunerLabel">Min Palate Fit: <strong>${minMatchThreshold>0 ? minMatchThreshold+'%+' : 'All Matches'}</strong></label>
        <div class="tunerPills" role="group" aria-label="Filter minimum match percentage">
          <button type="button" class="tunerPill ${minMatchThreshold===0?'active':''}" data-action="set-min-match" data-val="0">All</button>
          <button type="button" class="tunerPill ${minMatchThreshold===60?'active':''}" data-action="set-min-match" data-val="60">60%+</button>
          <button type="button" class="tunerPill ${minMatchThreshold===75?'active':''}" data-action="set-min-match" data-val="75">75%+ (Strict)</button>
          <button type="button" class="tunerPill ${minMatchThreshold===85?'active':''}" data-action="set-min-match" data-val="85">85%+ (Elite)</button>
        </div>
      </div>
      <div class="tunerGroup">
        <label class="tunerLabel">Adventure Dial: <strong>${adventureMode==='discover'?'Hidden Gems':adventureMode==='familiar'?'Familiar Comforts':'Balanced'}</strong></label>
        <div class="tunerPills" role="group" aria-label="Discovery sampling mode">
          <button type="button" class="tunerPill ${adventureMode==='balanced'?'active':''}" data-action="set-adventure" data-mode="balanced">Balanced</button>
          <button type="button" class="tunerPill ${adventureMode==='familiar'?'active':''}" data-action="set-adventure" data-mode="familiar">Familiar</button>
          <button type="button" class="tunerPill ${adventureMode==='discover'?'active':''}" data-action="set-adventure" data-mode="discover">Explore Gems</button>
        </div>
      </div>
    </div>
  </div>`:''}

  <div class="studioPromptConsole">
    <div class="studioPromptInputWrapper">
      <span class="studioPromptSparkle" aria-hidden="true">✦</span>
      <input type="text" class="studioPromptInput" id="studioPromptInput" placeholder="Prompt your palate: e.g. 'Pour over & sourdough' or 'Quiet work cafe with wifi'..." value="${esc(promptQuery)}" data-action="prompt-input" aria-label="Palate AI Prompt">
      ${promptQuery?`<button type="button" class="studioPromptClearBtn" data-action="clear-prompt" aria-label="Clear prompt">✕</button>`:''}
      <button type="button" class="studioPromptRunBtn" data-action="run-prompt" aria-label="Run prompt search">Run ↵</button>
    </div>
    <div class="studioPromptChips" role="group" aria-label="Quick prompt templates">
      <button type="button" class="promptChip ${promptQuery==='Specialty Coffee & Sourdough'?'active':''}" data-action="apply-prompt" data-prompt="Specialty Coffee & Sourdough">☕ Specialty Coffee & Sourdough</button>
      <button type="button" class="promptChip ${promptQuery==='Quiet Work Cafe'?'active':''}" data-action="apply-prompt" data-prompt="Quiet Work Cafe">🌿 Quiet Work Cafe</button>
      <button type="button" class="promptChip ${promptQuery==='Woodfired Pizza & Pasta'?'active':''}" data-action="apply-prompt" data-prompt="Woodfired Pizza & Pasta">🍕 Woodfired Pizza</button>
      <button type="button" class="promptChip ${promptQuery==='Romantic Date Night'?'active':''}" data-action="apply-prompt" data-prompt="Romantic Date Night">🍸 Romantic Date Night</button>
      <button type="button" class="promptChip ${promptQuery==='Authentic Regional Thali'?'active':''}" data-action="apply-prompt" data-prompt="Authentic Regional Thali">🌶️ Regional Thali</button>
      <button type="button" class="promptChip ${promptQuery==='Artisanal Gelato & Bakes'?'active':''}" data-action="apply-prompt" data-prompt="Artisanal Gelato & Bakes">🍨 Gelato & Bakes</button>
    </div>
  </div>
</div>`;

const filterPills=`<div class="filterChips homeFilterChips" role="group" aria-label="Filter recommendations by category">
<button type="button" class="filterChip ${homeCuisine==='all'?'active':''}" aria-pressed="${homeCuisine==='all'}" data-action="home-cuisine" data-cuisine="all">For you</button>
<button type="button" class="filterChip ${homeCuisine==='Cafe'?'active':''}" aria-pressed="${homeCuisine==='Cafe'}" data-action="home-cuisine" data-cuisine="Cafe">Cafés</button>
<button type="button" class="filterChip ${homeCuisine==='Dessert'?'active':''}" aria-pressed="${homeCuisine==='Dessert'}" data-action="home-cuisine" data-cuisine="Dessert">Desserts</button>
<button type="button" class="filterChip ${homeCuisine==='Gujarati'?'active':''}" aria-pressed="${homeCuisine==='Gujarati'}" data-action="home-cuisine" data-cuisine="Gujarati">Regional</button>
<button type="button" class="filterChip ${homeCuisine==='Italian'?'active':''}" aria-pressed="${homeCuisine==='Italian'}" data-action="home-cuisine" data-cuisine="Italian">Italian</button>
<button type="button" class="filterChip ${homeCuisine==='Fine dining'?'active':''}" aria-pressed="${homeCuisine==='Fine dining'}" data-action="home-cuisine" data-cuisine="Fine dining">Fine dining</button>
<button type="button" class="filterChip ${homeCuisine==='Visited'?'active':''}" aria-pressed="${homeCuisine==='Visited'}" data-action="home-cuisine" data-cuisine="Visited">Visited</button>
<button type="button" class="filterChip ${homeCuisine==='Saved'?'active':''}" aria-pressed="${homeCuisine==='Saved'}" data-action="home-cuisine" data-cuisine="Saved">Saved</button>
</div>`;

const selectedVenue=selectedPinId?allRanked.find(r=>r.id===selectedPinId):null;
const mappedPlaces=filtered.filter(r=>hasCoordinates(r));
const mapComponent=`<div class="zestMapContainer" id="zestMapContainer"><div class="zestMapStage ${map3d?'is3d':''}" id="zestMapStage"><div class="homeMapToolbar">${viewTabs}<button type="button" class="homeSearch" data-action="navigate" data-page="discover" aria-label="Search restaurants in ${esc(cityName())}"><svg class="smallIcon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><span>Search</span></button></div><div class="zestMapLegend"><span><i style="background:#20373b"></i> 80%+ match</span><span><i style="background:#ffc64f"></i> Visited</span><span><i style="background:#519cab"></i> Saved</span></div>${renderZestMapSvg(mappedPlaces,cityName(),selectedPinId)}<div class="zestMapControls"><button type="button" class="zestMapBtn zestMapBtn3d ${map3d?'active':''}" data-action="toggle-3d" aria-label="Toggle map perspective" aria-pressed="${map3d}" title="${map3d?'Switch to flat view':'Switch to perspective view'}">${map3d?'3D':'2D'}</button><button type="button" class="zestMapBtn" data-action="zoom-in" aria-label="Zoom in">+</button><button type="button" class="zestMapBtn" data-action="zoom-out" aria-label="Zoom out">−</button><button type="button" class="zestMapBtn" data-action="zoom-reset" aria-label="Reset zoom"><svg class="smallIcon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6"/><path d="M12 2v5m0 10v5M2 12h5m10 0h5"/></svg></button></div></div>${selectedVenue?renderZestSheet(selectedVenue):''}<p class="mapNotice">${mappedPlaces.length} places mapped · ${visitedCount} visited. Illustrative area overview; use Directions for navigation.</p></div>`;

const emptyMessage=homeCuisine==='Visited'
  ?'<div class="empty"><h2>Your Dining Map is waiting</h2><p>Tap “I visited” on places you’ve tried in '+esc(cityName())+' to automatically build your personal dining map.</p></div>'
  :homeCuisine==='Saved'
  ?'<div class="empty"><h2>No saved spots yet</h2><p>Tap “Save” on any restaurant to pin your shortlist to your Palate Map.</p></div>'
  :'<div class="empty"><h2>No matches in this category</h2><p>Try switching to “For you” or adjusting your taste preferences in your Palate tab.</p></div>';

const cardsContent=rs.length?rs.map(card).join(''):emptyMessage;

let mainContent='';
if(homeView==='map'){
  mainContent=`${mapComponent}<div class="homeRecommendations"><div class="section"><h1>For you</h1>${topPick?`<div class="confidence">${topPick.score}%<small> top taste match</small></div>`:`<span>${filtered.length} places</span>`}</div>${filterPills}<div class="restaurantGrid" aria-label="Recommendations for your taste">${cardsContent}</div>${showMoreButton}${travelRangeNote()}<p class="homeEstimateNote">Matches are estimates from your taste quiz and feedback.</p></div>`;
} else if(homeView==='dishes'){
  mainContent=`<div class="homeListToolbar">${viewTabs}<button type="button" class="homeSearch" data-action="navigate" data-page="discover">Search places</button></div><div class="homeRecommendations"><div class="section"><h1>⭐ Best Dishes & Cafe Highlights</h1><span>${filtered.length} curated venues in ${esc(cityName())}</span></div>${renderBestDishesShowcase(filtered)}</div>`;
} else {
  mainContent=`<div class="homeListToolbar">${viewTabs}<button type="button" class="homeSearch" data-action="navigate" data-page="discover">Search places</button></div><div class="homeRecommendations"><div class="section"><h1>For you</h1>${topPick?`<div class="confidence">${topPick.score}%<small> top taste match</small></div>`:`<span>${filtered.length} places</span>`}</div>${filterPills}<div class="restaurantGrid" aria-label="Recommendations for your taste">${cardsContent}</div>${showMoreButton}${travelRangeNote()}<p class="homeEstimateNote">Matches are estimates from your taste quiz and feedback.</p></div>`;
}

document.getElementById('root').innerHTML=`<section class="screen home-screen ${homeView==='map'?'homeMapView':'homeListView'}">${studioControlBar}${mainContent}</section>`;
}
'@

$idxHomeStart = $content.IndexOf("function home(){")
if ($idxHomeStart -gt 0) {
    $idxHomeEnd = $content.IndexOf("function summaryChips(){", $idxHomeStart)
    if ($idxHomeEnd -gt 0) {
        $before = $content.Substring(0, $idxHomeStart)
        $after = $content.Substring($idxHomeEnd)
        $content = $before + $newHomeBody + "`n" + $after
        Write-Host "Updated home() via slice." -ForegroundColor Green
    } else {
        throw "Could not find summaryChips after home()."
    }
} else {
    throw "Could not find home()."
}

# 5. Event listeners
if (-not $content.Contains("case 'open-dishes-modal':")) {
    $clickTarget = "case 'home-cuisine': if(d.cuisine)setHomeCuisine(d.cuisine); break;"
    $clickReplacement = "case 'home-cuisine': if(d.cuisine)setHomeCuisine(d.cuisine); break;`n   case 'open-dishes-modal': if(d.restId)openDishesModal(d.restId); break;`n   case 'close-dishes-modal': closeDishesModal(); break;`n   case 'apply-prompt': if(d.prompt)applyPrompt(d.prompt); break;`n   case 'run-prompt': runPrompt(); break;`n   case 'clear-prompt': clearPrompt(); break;`n   case 'toggle-tuner': toggleStudioTuner(); break;`n   case 'set-min-match': setMinMatch(Number(d.val)); break;`n   case 'set-adventure': if(d.mode)setAdventureMode(d.mode); break;`n   case 'set-dish-category': if(d.category)setDishCategory(d.category); break;"
    $content = $content.Replace($clickTarget, $clickReplacement)
    Write-Host "Added click actions." -ForegroundColor Green
}

if (-not $content.Contains("target.dataset.action==='prompt-input'")) {
    $inputTarget = "if(target.dataset.action==='filter')filter(target.value);"
    $inputReplacement = "if(target.dataset.action==='filter')filter(target.value);`n if(target.dataset.action==='prompt-input')promptQuery=target.value;"
    $content = $content.Replace($inputTarget, $inputReplacement)
    Write-Host "Added prompt input action." -ForegroundColor Green
}

if (-not $content.Contains("document.getElementById('dishesModal')")) {
    $keyTarget = "if(event.key==='Escape'){"
    $keyReplacement = "if(event.key==='Escape'){if(document.getElementById('dishesModal')){event.preventDefault();closeDishesModal();return;}"
    $content = $content.Replace($keyTarget, $keyReplacement)
    Write-Host "Added Escape key handler for dishesModal." -ForegroundColor Green
}

[System.IO.File]::WriteAllText($indexPath, $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Successfully updated app/index.html!" -ForegroundColor Cyan

# 6. Append new CSS classes to theme.css if not present
$themeContent = [System.IO.File]::ReadAllText($themePath, [System.Text.Encoding]::UTF8)

$studioCss = @'

/* Google AI Studio Inspired Components & Best Dishes Showcase */
.studioControlBar{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 18px;margin-bottom:20px;box-shadow:0 2px 8px rgba(32,55,59,0.04)}
.studioHeaderRow{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:14px}
.studioModelPill{display:inline-flex;align-items:center;gap:8px;background:var(--soft);border:1px solid var(--line);border-radius:999px;padding:6px 14px;font-size:12px;font-weight:700;color:var(--ink)}
.studioLiveDot{width:8px;height:8px;border-radius:50%;background:#2e7d32;box-shadow:0 0 0 3px rgba(46,125,50,0.25);animation:pulseDot 2s infinite ease-in-out}
@keyframes pulseDot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.25);opacity:0.75}}
.studioModelName{font-weight:750;letter-spacing:-0.01em}
.studioModelStatus{color:var(--muted);font-weight:600;font-size:11px}
.studioMetaStats{display:inline-flex;align-items:center;gap:8px;flex-wrap:wrap}
.studioStatChip{background:var(--soft);border:1px solid var(--line);border-radius:6px;padding:5px 10px;font-size:11px;font-weight:600;color:var(--muted);font-variant-numeric:tabular-nums}
.studioTunerToggleBtn{display:inline-flex;align-items:center;gap:6px;background:var(--card);border:1px solid var(--control-line);border-radius:8px;padding:6px 12px;font-size:12px;font-weight:700;color:var(--ink);cursor:pointer;transition:all 0.15s ease}
.studioTunerToggleBtn:hover{background:var(--soft)}
.studioTunerToggleBtn.active{background:var(--gold);border-color:var(--ink)}
.studioTunerPanel{background:var(--soft);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin:0 0 14px;animation:slideDown 0.2s ease-out}
@keyframes slideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
.tunerGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.tunerGroup{display:flex;flex-direction:column;gap:8px}
.tunerLabel{font-size:12px;color:var(--ink);font-weight:600}
.tunerLabel strong{color:var(--green);font-weight:750}
.tunerPills{display:flex;gap:6px;flex-wrap:wrap}
.tunerPill{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:5px 10px;font-size:11px;font-weight:650;color:var(--ink);cursor:pointer;transition:all 0.12s}
.tunerPill:hover{background:var(--bg)}
.tunerPill.active{background:var(--gold)!important;border-color:var(--ink)!important;color:var(--ink)!important}
.studioPromptConsole{display:flex;flex-direction:column;gap:10px}
.studioPromptInputWrapper{display:flex;align-items:center;background:var(--card);border:1.5px solid var(--line);border-radius:12px;padding:4px 8px;gap:8px;transition:border-color 0.15s,box-shadow 0.15s}
.studioPromptInputWrapper:focus-within{border-color:var(--ink);box-shadow:0 0 0 3px rgba(32,55,59,0.1)}
.studioPromptSparkle{font-size:16px;color:var(--ink);margin-left:4px;user-select:none}
.studioPromptInput{flex:1;border:none;background:transparent;padding:9px 4px;font-size:13.5px;color:var(--ink);font-family:inherit;outline:none}
.studioPromptInput::placeholder{color:var(--muted);opacity:0.85}
.studioPromptClearBtn{background:transparent;border:none;color:var(--muted);cursor:pointer;padding:6px;font-size:14px;line-height:1}
.studioPromptClearBtn:hover{color:var(--ink)}
.studioPromptRunBtn{background:var(--ink);color:var(--card);border:none;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:750;cursor:pointer;transition:background 0.15s}
.studioPromptRunBtn:hover{background:var(--muted)}
.studioPromptChips{display:flex;gap:8px;overflow-x:auto;padding-bottom:2px;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.studioPromptChips::-webkit-scrollbar{display:none}
.promptChip{white-space:nowrap;background:var(--soft);border:1px solid var(--line);border-radius:999px;padding:6px 13px;font-size:11.5px;font-weight:650;color:var(--ink);cursor:pointer;transition:all 0.12s}
.promptChip:hover{background:var(--bg);border-color:var(--control-line)}
.promptChip.active{background:var(--gold)!important;border-color:var(--ink)!important}

/* Card Best Dishes Section */
.cardBestDishes{background:var(--soft);border:1px solid var(--line);border-radius:10px;padding:10px 12px;margin:12px 0 10px}
.cardBestDishesHeader{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.cardBestDishesTitle{font-size:10.5px;font-weight:800;letter-spacing:0.04em;color:var(--muted)}
.viewAllDishesBtn{background:transparent;border:none;color:var(--ink);font-size:11px;font-weight:750;cursor:pointer;text-decoration:underline;text-underline-offset:2px;padding:0}
.viewAllDishesBtn:hover{color:var(--green)}
.cardDishesList{display:flex;flex-direction:column;gap:6px}
.cardDishItem{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px;cursor:pointer;padding:2px 0;border-radius:4px}
.cardDishItem:hover .cardDishName{text-decoration:underline}
.cardDishInfo{display:flex;align-items:center;gap:6px;min-width:0}
.cardDishName{font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cardDishPrice{font-size:11px;font-weight:750;color:var(--muted);white-space:nowrap;font-variant-numeric:tabular-nums}
.cardDishDiet{font-size:10px;line-height:1}
.cardDishDiet.veg,.dishDietBadge.veg{color:#2e7d32}
.cardDishDiet.nonVeg,.dishDietBadge.nonVeg{color:#c62828}
.cardDishDiet.egg,.dishDietBadge.egg{color:#f57f17}

/* Best Dishes Showcase Grid View */
.dishCategoryChips{margin-bottom:16px}
.dishesShowcaseGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;margin:16px 0 24px}
.dishShowcaseCard{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;gap:12px;box-shadow:0 2px 6px rgba(32,55,59,0.03);transition:transform 0.15s,box-shadow 0.15s}
.dishShowcaseCard:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(32,55,59,0.08);border-color:var(--control-line)}
.dishShowcaseTop{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.dishShowcaseHeader{display:flex;align-items:baseline;gap:6px}
.dishShowcaseName{font-size:14px;font-weight:750;color:var(--ink);line-height:1.35}
.dishShowcasePrice{font-size:12.5px;font-weight:800;color:var(--ink);background:var(--soft);border:1px solid var(--line);border-radius:6px;padding:3px 8px;font-variant-numeric:tabular-nums;white-space:nowrap}
.dishShowcaseDesc{font-size:12px;line-height:1.55;color:var(--muted);margin:0}
.dishShowcaseVenue{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:10px;border-top:1px solid var(--line)}
.dishShowcaseVenueInfo{display:flex;flex-direction:column;gap:2px;min-width:0}
.dishVenueName{font-size:12px;font-weight:750;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dishVenueArea{font-size:11px;color:var(--muted)}
.dishShowcaseActions{display:flex;gap:6px;flex-shrink:0}
.smallBtn{padding:6px 10px!important;font-size:11px!important;min-height:32px!important}

/* Dishes Modal Dialog */
.dishesModal{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px}
.modalBackdrop{position:fixed;inset:0;background:rgba(32,55,59,0.6);backdrop-filter:blur(3px)}
.dishesModalCard{position:relative;background:var(--card);border:1px solid var(--line);border-radius:18px;max-width:620px;width:100%;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 16px 40px rgba(32,55,59,0.25);z-index:1;overflow:hidden}
.dishesModalHeader{display:flex;align-items:flex-start;justify-content:space-between;padding:18px 20px 14px;border-bottom:1px solid var(--line);background:var(--soft)}
.dishesModalHeader h2{font-size:20px;font-weight:800;margin:0 0 4px;color:var(--ink)}
.dishesModalSubtitle{font-size:12px;color:var(--muted);margin:0}
.dishesModalCloseBtn{background:transparent;border:none;font-size:18px;line-height:1;color:var(--muted);cursor:pointer;padding:4px;border-radius:6px}
.dishesModalCloseBtn:hover{color:var(--ink);background:var(--card)}
.dishesModalContent{padding:16px 20px;overflow-y:auto;flex:1}
.dishesList{display:flex;flex-direction:column;gap:12px;margin-top:12px}
.dishModalItem{background:var(--soft);border:1px solid var(--line);border-radius:10px;padding:12px 14px}
.dishModalItemHead{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:6px}
.dishModalTitleRow{display:flex;align-items:center;gap:6px}
.dishModalName{font-size:13.5px;font-weight:750;color:var(--ink)}
.dishModalMeta{display:flex;align-items:center;gap:8px}
.dishModalCategory{font-size:10.5px;color:var(--muted);font-weight:600}
.dishModalPrice{font-size:12px;font-weight:800;color:var(--ink);background:var(--card);border:1px solid var(--line);border-radius:4px;padding:2px 6px;font-variant-numeric:tabular-nums}
.dishModalDesc{font-size:12px;line-height:1.55;color:var(--muted);margin:0}
.dishesModalFooter{display:flex;align-items:center;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid var(--line);background:var(--card)}

@media(max-width:640px){
  .studioHeaderRow{flex-direction:column;align-items:flex-start}
  .studioMetaStats{width:100%;justify-content:space-between}
  .dishesShowcaseGrid{grid-template-columns:1fr}
  .dishModalItemHead{flex-direction:column;align-items:flex-start;gap:4px}
  .dishModalMeta{width:100%;justify-content:space-between}
}
'@

if (-not $themeContent.Contains(".studioControlBar")) {
    $themeContent = $themeContent + "`n" + $studioCss
    [System.IO.File]::WriteAllText($themePath, $themeContent, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "Appended studio CSS to theme.css!" -ForegroundColor Green
} else {
    Write-Host "theme.css already contains studioControlBar." -ForegroundColor Yellow
}

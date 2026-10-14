/* ==========================================================================
   PALATEO CURATED SIGNATURE DISHES & MENU INTELLIGENCE (STUDIO REGISTRY)
   - Verified signature dishes and crowd highlights across all 13 metro cities
   - Algorithmic fallback curated by cuisine and price tier
   ========================================================================== */

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
  if(!r) return [];
  const tags = [...(r.c||[]), ...(r.t||[]), r.name||''].join(' ').toLowerCase();
  const priceTier = r.p || '500_1000';
  const isHighEnd = priceTier==='1000_2000' || priceTier==='2000_plus';
  const isVeg = r.dietaryOptions?.includes('vegetarian') && !r.dietaryOptions?.includes('non-vegetarian');

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
  if(!r) return [];
  const id = r.id || '';
  if(BEST_DISHES_REGISTRY[id]) return BEST_DISHES_REGISTRY[id];
  const nameClean = (r.name||'').toLowerCase();
  for(const [regKey,dishes] of Object.entries(BEST_DISHES_REGISTRY)){
    if(id.includes(regKey)||regKey.includes(id)) return dishes;
    const keyParts = regKey.replace(/^[a-z]{3}-/,'').split('-');
    if(keyParts.length > 1 && keyParts.every(p => nameClean.includes(p))) return dishes;
  }
  return generateCuratedDishes(r);
}

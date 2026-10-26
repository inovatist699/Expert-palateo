const cuisineAliases={
 Gujarati:['gujarati','kathiyawadi','thali','farsan','khaman','dhokla','undhiyu','surti','dal baati','gujarati snacks'],
 Punjabi:['punjabi','north indian','mughlai','tandoori','biryani','curry','dal makhani','chole bhature','kebab','modern indian','desi ghee','bhojanalay','butter chicken','paneer'],
 Italian:['italian','pizza','pasta','woodfired pizza','risotto','pizzeria','trattoria','continental','european'],
 Cafe:['cafe','coffee','artisan coffee','bakery','tea','chai','roasters','bakes','croissant','patisserie','espresso','brews','cold brew','brunch','sandwiches','waffles','toast'],
 SouthIndian:['south indian','dosa','idli','vada','uttapam','filter coffee','chettinad','kerala','coastal','udupi','appam','podi'],
 Asian:['asian','chinese','thai','pan asian','pan-asian','dim sum','sushi','japanese','ramen','bao','oriental','noodles','wok','korean','dumplings','momos'],
 Dessert:['dessert','desserts','ice cream','gelato','bakery','sweets','kulfi','falooda','jalebi','pastry','cakes','churros','chocolate']
};
const cuisineLabels={Gujarati:'Gujarati',Punjabi:'North Indian',Italian:'Italian & continental',Cafe:'Café & coffee',SouthIndian:'South Indian',Asian:'Asian',Dessert:'Desserts'};
const calibrationDishes=[
 {id:'gujarati-thali',name:'Gujarati thali',description:'A little sweet, a little savoury, with a variety of textures.',cuisine:'Gujarati',tags:['thali','regional'],diet:'veg',spice:'mild',sensoryFocus:'Sweet-Savory Balance & Texture Variety',sensoryTags:['Sweet-Savory','Multi-Texture','Mild Savory'],tasteHighlight:'Sweet-savory harmony',sensoryProfile:{umami:0.75,acidity:0.65,sweet:0.7,salt:0.65,bitter:0.2,heat:0.2,crisp:0.65,rich:0.6,aromatic:0.8,ferment:0.5}},
 {id:'dhokla',name:'Dhokla',description:'Soft, tangy steamed bites with a light tempering.',cuisine:'Gujarati',tags:['dhokla','khaman','snacks','street food'],diet:'veg',spice:'mild',sensoryFocus:'OTOP1 Citrus Acidity & Steamed Sponginess',sensoryTags:['Spongy Steamed','Mustard Tempering','Tangy Fresh'],tasteHighlight:'Tangy mustard & curry leaf tempering',sensoryProfile:{umami:0.5,acidity:0.75,sweet:0.45,salt:0.6,bitter:0.2,heat:0.3,crisp:0.2,rich:0.3,aromatic:0.85,ferment:0.7}},
 {id:'paneer-tikka',name:'Paneer tikka',description:'Smoky grilled paneer with a warming masala.',cuisine:'Punjabi',tags:['paneer','tandoor','grill'],diet:'veg',spice:'medium',sensoryFocus:'Smoky Maillard Char & Warming Masala',sensoryTags:['Tandoor Smoke','Medium Warmth','Charred Paneer'],tasteHighlight:'Smoky charred tandoor',sensoryProfile:{umami:0.85,acidity:0.45,sweet:0.2,salt:0.7,bitter:0.25,heat:0.6,crisp:0.4,rich:0.75,aromatic:0.9,ferment:0.3}},
 {id:'butter-chicken',name:'Butter chicken',description:'A rich, creamy tomato curry with gently spiced chicken.',cuisine:'Punjabi',tags:['chicken','curry'],diet:'nonveg',spice:'mild',sensoryFocus:'Velvety Lipid Emulsion & Tomato Glutamate',sensoryTags:['Lipid Emulsion','Tomato Umami','Mild Heat'],tasteHighlight:'Creamy tomato-butter emulsion',sensoryProfile:{umami:0.95,acidity:0.45,sweet:0.4,salt:0.7,bitter:0.1,heat:0.3,crisp:0.15,rich:0.95,aromatic:0.85,ferment:0.4}},
 {id:'masala-dosa',name:'Masala dosa',description:'A crisp fermented crepe, potato filling and savoury accompaniments.',cuisine:'SouthIndian',tags:['dosa','breakfast'],diet:'veg',spice:'medium',sensoryFocus:'Lactic Fermentation Tang & Acoustic Crisp Crepe',sensoryTags:['Acoustic Crisp','Lactic Ferment','Spiced Potato'],tasteHighlight:'Golden crisp fermented crepe',sensoryProfile:{umami:0.75,acidity:0.65,sweet:0.2,salt:0.7,bitter:0.15,heat:0.55,crisp:0.95,rich:0.5,aromatic:0.85,ferment:0.85}},
 {id:'idli',name:'Idli & sambar',description:'Soft steamed rice cakes with a tangy lentil stew.',cuisine:'SouthIndian',tags:['idli','breakfast'],diet:'veg',spice:'mild',sensoryFocus:'Soft Steamed Aeration & Tamarind Acidity',sensoryTags:['Soft Aeration','Tamarind Lentil','Purity'],tasteHighlight:'Pillow-soft steamed rice & tangy sambar',sensoryProfile:{umami:0.7,acidity:0.75,sweet:0.15,salt:0.65,bitter:0.1,heat:0.35,crisp:0.1,rich:0.25,aromatic:0.8,ferment:0.8}},
 {id:'wood-fired-pizza',name:'Wood-fired vegetable pizza',description:'A crisp crust, roasted vegetables and melted cheese.',cuisine:'Italian',tags:['pizza','wood fired'],diet:'veg',spice:'mild',sensoryFocus:'Woodsmoke Char, Melted Mozzarella & Craggy Crust',sensoryTags:['Woodsmoke Char','Melted Lipids','Craggy Crust'],tasteHighlight:'Wood-fired blistered crust',sensoryProfile:{umami:0.85,acidity:0.4,sweet:0.25,salt:0.7,bitter:0.3,heat:0.2,crisp:0.85,rich:0.8,aromatic:0.85,ferment:0.6}},
 {id:'arrabbiata-pasta',name:'Arrabbiata pasta',description:'Tomato, garlic and chilli with a bold, savoury finish.',cuisine:'Italian',tags:['pasta'],diet:'veg',spice:'hot',sensoryFocus:'TRPV1 Chili Pungency & Tomato Umami-Acidity',sensoryTags:['Chili Pungency','Tomato Acidity','Garlic Allium'],tasteHighlight:'Fiery chili, garlic & tomato reduction',sensoryProfile:{umami:0.8,acidity:0.75,sweet:0.2,salt:0.7,bitter:0.15,heat:0.85,crisp:0.3,rich:0.45,aromatic:0.9,ferment:0.35}},
 {id:'chilli-noodles',name:'Chilli garlic noodles',description:'Wok-tossed vegetables, garlic and a sharper chilli kick.',cuisine:'Asian',tags:['noodles','wok','chinese'],diet:'veg',spice:'hot',sensoryFocus:'Wok Hei Breath & High-Voltage Capsaicin Shear',sensoryTags:['Wok Hei Smoke','High Capsaicin','Tensile Noodle'],tasteHighlight:'Wok hei sear & sharp garlic chili',sensoryProfile:{umami:0.85,acidity:0.4,sweet:0.2,salt:0.8,bitter:0.2,heat:0.88,crisp:0.65,rich:0.55,aromatic:0.95,ferment:0.45}},
 {id:'veg-dumplings',name:'Vegetable dumplings',description:'Soft wrappers, savoury vegetables and a light dipping sauce.',cuisine:'Asian',tags:['dumplings','momos'],diet:'veg',spice:'mild',sensoryFocus:'Delicate Steamed Membrane & Concentrated Broth Umami',sensoryTags:['Delicate Wrapper','Shiitake Broth','Subtle Savory'],tasteHighlight:'Steamed broth burst & sesame dip',sensoryProfile:{umami:0.85,acidity:0.35,sweet:0.2,salt:0.65,bitter:0.1,heat:0.2,crisp:0.15,rich:0.4,aromatic:0.8,ferment:0.5}},
 {id:'filter-coffee',name:'Filter coffee',description:'A deep roasted coffee flavour with a smooth milky finish.',cuisine:'Cafe',tags:['coffee','filter coffee'],diet:'veg',spice:'mild',sensoryFocus:'Roasted Pyrazine Bitterness & Chicory Creaminess',sensoryTags:['Dark Pyrazines','Velvety Froth','Chicory Depth'],tasteHighlight:'Slow drip chicory & dark roasted pyrazines',sensoryProfile:{umami:0.35,acidity:0.4,sweet:0.45,salt:0.15,bitter:0.8,heat:0.0,crisp:0.1,rich:0.8,aromatic:0.95,ferment:0.4}},
 {id:'sourdough-toast',name:'Sourdough & coffee',description:'A tangy, crisp toast alongside an aromatic cup.',cuisine:'Cafe',tags:['coffee','sourdough','bakery'],diet:'veg',spice:'mild',sensoryFocus:'Acetic Sourdough Acid & Acoustic Crumb Shear',sensoryTags:['Acoustic Crunch','Wild Ferment','Tangy Crumb'],tasteHighlight:'Golden crisp crust & acetic sourdough tang',sensoryProfile:{umami:0.5,acidity:0.7,sweet:0.15,salt:0.6,bitter:0.35,heat:0.0,crisp:0.95,rich:0.35,aromatic:0.85,ferment:0.85}},
 {id:'chocolate-brownie',name:'Eggless chocolate brownie',description:'An eggless cocoa brownie with a soft centre and a sweet finish.',cuisine:'Dessert',tags:['chocolate','brownie'],diet:'veg',spice:'mild',sensoryFocus:'Dark Polyphenol Cacao & Soft Lipid Core',sensoryTags:['Dark Cocoa','Fudgy Viscosity','Gourmet Sweet'],tasteHighlight:'Rich cocoa polyphenols & molten center',sensoryProfile:{umami:0.3,acidity:0.15,sweet:0.85,salt:0.3,bitter:0.65,heat:0.0,crisp:0.35,rich:0.9,aromatic:0.85,ferment:0.25}},
 {id:'masala-omelette',name:'Masala omelette',description:'Eggs with onion, tomato and warming spices. A taste example, not a verified menu item.',cuisine:'Cafe',tags:['egg','breakfast'],diet:'egg',spice:'medium',sensoryFocus:'Soft Egg Curds & Caramelized Allium Spices',sensoryTags:['Egg Protein','Caramelized Onion','Warming Cumin'],tasteHighlight:'Fluffy spiced eggs & caramelized onion',sensoryProfile:{umami:0.85,acidity:0.35,sweet:0.25,salt:0.75,bitter:0.15,heat:0.5,crisp:0.3,rich:0.7,aromatic:0.85,ferment:0.2}},
 {id:'dum-biryani',name:'Chicken dum biryani',description:'Aromatic rice, layered spices and slow-cooked chicken.',cuisine:'Punjabi',tags:['biryani','chicken'],diet:'nonveg',spice:'hot',sensoryFocus:'Slow-Cooked Dum Maillard & Retronasal Saffron',sensoryTags:['Retronasal Saffron','Slow-Cooked Dum','Layered Spice'],tasteHighlight:'Saffron aromatics, aged basmati & tender meat',sensoryProfile:{umami:0.95,acidity:0.3,sweet:0.2,salt:0.8,bitter:0.2,heat:0.8,crisp:0.35,rich:0.85,aromatic:0.98,ferment:0.45}},
 {id:'truffle-pasta',name:'Truffle & wild mushroom pasta',description:'Earthy black truffle butter, forest mushrooms, and hand-rolled pasta.',cuisine:'Italian',tags:['pasta','truffle','mushroom'],diet:'veg',spice:'mild',sensoryFocus:'Deep Glutamate Umami & Earthy Truffle',sensoryTags:['High Umami','Earthy Truffle','Rich Creaminess'],tasteHighlight:'Rich truffle & mushroom umami',sensoryProfile:{umami:0.95,acidity:0.2,sweet:0.1,salt:0.7,bitter:0.2,heat:0.1,crisp:0.2,rich:0.9,aromatic:0.95,ferment:0.9}},
 {id:'crispy-falafel',name:'Herbed crispy falafel platter',description:'Crisp chickpea croquettes with tahini dip and sumac-pickled vegetables.',cuisine:'Italian',tags:['falafel','continental','mediterranean'],diet:'veg',spice:'mild',sensoryFocus:'Acoustic Crunch & Herbaceous Aromatics',sensoryTags:['Acoustic Crunch','Bright Sumac','Herbal Aromatics'],tasteHighlight:'Craggy crisp crunch & tahini',sensoryProfile:{umami:0.55,acidity:0.65,sweet:0.1,salt:0.65,bitter:0.25,heat:0.25,crisp:0.95,rich:0.5,aromatic:0.85,ferment:0.3}},
 {id:'paneer-kurchan',name:'Smoky paneer khurchan',description:'Wok-tossed charred paneer batons with bell peppers and roasted cumin.',cuisine:'Punjabi',tags:['paneer','kadai','tandoor'],diet:'veg',spice:'medium',sensoryFocus:'Maillard Char & Capsicum Sweet-Savory',sensoryTags:['Smoky Char','Medium Spice','Savory Paneer'],tasteHighlight:'Smoky charred bell peppers',sensoryProfile:{umami:0.85,acidity:0.35,sweet:0.25,salt:0.7,bitter:0.2,heat:0.55,crisp:0.4,rich:0.75,aromatic:0.85,ferment:0.35}},
 {id:'dim-sum-truffle',name:'Crystal wild mushroom dumplings',description:'Translucent steamed dumplings packed with wild shiitake and truffle oil.',cuisine:'Asian',tags:['dumplings','dim sum','asian'],diet:'veg',spice:'mild',sensoryFocus:'Concentrated Shiitake Glutamate & Delicate Steam',sensoryTags:['High Umami','Truffle Glaze','Delicate Texture'],tasteHighlight:'Wild shiitake & aromatic truffle',sensoryProfile:{umami:0.92,acidity:0.25,sweet:0.15,salt:0.6,bitter:0.15,heat:0.1,crisp:0.15,rich:0.55,aromatic:0.9,ferment:0.6}},
 {id:'matcha-gelato',name:'Artisanal Uji matcha gelato',description:'Slow-churned gelato with stone-ground green tea and pleasant bittersweet depth.',cuisine:'Dessert',tags:['ice cream','gelato','dessert'],diet:'veg',spice:'mild',sensoryFocus:'TAS2R Pleasant Bittersweet & Lipid Viscosity',sensoryTags:['Bittersweet Depth','Velvety Churn','Green Tea'],tasteHighlight:'Stone-ground matcha & cream',sensoryProfile:{umami:0.4,acidity:0.1,sweet:0.6,salt:0.15,bitter:0.7,heat:0.0,crisp:0.1,rich:0.85,aromatic:0.8,ferment:0.25}},
 {id:'cold-brew-tonic',name:'Citrus cold brew tonic',description:'Steeped single-origin coffee poured over sparkling tonic and fresh orange peel.',cuisine:'Cafe',tags:['coffee','cold brew','beverage'],diet:'veg',spice:'mild',sensoryFocus:'Quinine Bitterness & Bright Citrus Sparkle',sensoryTags:['Sparkling Acidity','Citrus Zest','Coffee Roast'],tasteHighlight:'Effervescent citrus & dark roast',sensoryProfile:{umami:0.2,acidity:0.8,sweet:0.35,salt:0.1,bitter:0.75,heat:0.0,crisp:0.6,rich:0.1,aromatic:0.9,ferment:0.4}},
 {id:'dal-makhani',name:'Dal makhani & garlic naan',description:'Slow-simmered black lentils with churned butter and garlic naan.',cuisine:'Punjabi',tags:['dal makhani','makhani','black dal','naan'],diet:'veg',spice:'mild',sensoryFocus:'Slow-Simmered Lentil Umami & Churned White Butter',sensoryTags:['Smoked Lentils','Velvety Butter','Garlic Crisp'],tasteHighlight:'Slow-simmered black lentils & churned butter',sensoryProfile:{umami:0.92,acidity:0.35,sweet:0.25,salt:0.7,bitter:0.15,heat:0.3,crisp:0.35,rich:0.95,aromatic:0.9,ferment:0.35}},
 {id:'chole-bhature',name:'Delhi style chole bhature',description:'Dark spiced chickpeas with pickled amla and hot puffed bhatura.',cuisine:'Punjabi',tags:['chole bhature','bhature','chole','chana bhatura'],diet:'veg',spice:'hot',sensoryFocus:'Dark Spiced Pungency & Puffed Acoustic Bhatura',sensoryTags:['Anardana Tang','Puffed Bhatura','Robust Masala'],tasteHighlight:'Dark spiced chickpea curry & fluffy bhatura',sensoryProfile:{umami:0.88,acidity:0.65,sweet:0.15,salt:0.75,bitter:0.2,heat:0.75,crisp:0.7,rich:0.8,aromatic:0.92,ferment:0.4}},
 {id:'surti-undhiyu',name:'Surti undhiyu & puri',description:'Slow-cooked winter roots, green garlic and fenugreek muthiya.',cuisine:'Gujarati',tags:['undhiyu','muthiya','surti'],diet:'veg',spice:'medium',sensoryFocus:'Green Garlic Allium & Fenugreek Muthiya Harmony',sensoryTags:['Fenugreek Muthiya','Winter Greens','Roasted Sesame'],tasteHighlight:'Slow-cooked winter root vegetables & muthiya',sensoryProfile:{umami:0.82,acidity:0.45,sweet:0.55,salt:0.65,bitter:0.3,heat:0.45,crisp:0.4,rich:0.7,aromatic:0.92,ferment:0.35}},
 {id:'dal-baati',name:'Dal baati churma',description:'Woodsmoke ghee-soaked baked wheat baatis with spiced panchmel lentils.',cuisine:'Gujarati',tags:['dal baati','baati','churma','rajasthani'],diet:'veg',spice:'medium',sensoryFocus:'Woodsmoke Desi Ghee & Baked Wheat Crust',sensoryTags:['Desi Ghee Crunch','Panchmel Dal','Cardamom Churma'],tasteHighlight:'Ghee-soaked baked baati & spiced lentils',sensoryProfile:{umami:0.85,acidity:0.4,sweet:0.4,salt:0.7,bitter:0.15,heat:0.5,crisp:0.85,rich:0.95,aromatic:0.88,ferment:0.3}},
 {id:'ghee-podi-dosa',name:'Ghee podi roast dosa',description:'Crisp golden crepe roasted in pure ghee and spiced gunpowder podi.',cuisine:'SouthIndian',tags:['podi','gunpowder','ghee roast','ghee dosa'],diet:'veg',spice:'medium',sensoryFocus:'Roasted Gunpowder Pyrazines & Golden Ghee Crunch',sensoryTags:['Gunpowder Podi','Golden Ghee','Crisp Ferment'],tasteHighlight:'Nutty roasted podi spice & clarified butter',sensoryProfile:{umami:0.82,acidity:0.55,sweet:0.15,salt:0.75,bitter:0.2,heat:0.6,crisp:0.98,rich:0.8,aromatic:0.92,ferment:0.85}},
 {id:'medu-vada',name:'Medu vada & coconut chutney',description:'Acoustic crisp lentil fritters with tempered coconut chutney.',cuisine:'SouthIndian',tags:['vada','medu vada','sambar vada'],diet:'veg',spice:'medium',sensoryFocus:'Acoustic Exterior Shear & Aerated Lentil Core',sensoryTags:['Golden Crunch','Fluffy Aeration','Tempered Coconut'],tasteHighlight:'Crackling crisp crust & tempered coconut chutney',sensoryProfile:{umami:0.75,acidity:0.45,sweet:0.15,salt:0.7,bitter:0.1,heat:0.45,crisp:0.95,rich:0.65,aromatic:0.85,ferment:0.6}},
 {id:'burrata-bruschetta',name:'Burrata & heirloom tomato bruschetta',description:'Creamy burrata, ripe heirloom tomatoes and aged balsamic glaze.',cuisine:'Italian',tags:['burrata','bruschetta','mozzarella','crostini'],diet:'veg',spice:'mild',sensoryFocus:'Pugliese Cream Emulsion & Aged Balsamic Acidity',sensoryTags:['Fresh Burrata','Aged Acetic Glaze','Charred Sourdough'],tasteHighlight:'Creamy fresh burrata & sweet balsamic reduction',sensoryProfile:{umami:0.82,acidity:0.75,sweet:0.35,salt:0.6,bitter:0.15,heat:0.1,crisp:0.85,rich:0.88,aromatic:0.9,ferment:0.5}},
 {id:'creamy-pesto-gnocchi',name:'Genovese pesto gnocchi',description:'Potato gnocchi tossed in fresh sweet basil pine nut pesto.',cuisine:'Italian',tags:['gnocchi','pesto','basil pesto'],diet:'veg',spice:'mild',sensoryFocus:'Fresh Basil Terpenes & Pillowy Potato Shear',sensoryTags:['Sweet Genovese Basil','Toasted Pine Nuts','Parmesan Glutamate'],tasteHighlight:'Fragrant sweet basil pesto & soft gnocchi',sensoryProfile:{umami:0.86,acidity:0.35,sweet:0.2,salt:0.7,bitter:0.25,heat:0.15,crisp:0.25,rich:0.85,aromatic:0.98,ferment:0.45}},
 {id:'avocado-sushi-roll',name:'Truffle edamame sushi roll',description:'Short-grain seasoned rice, mineral nori, edamame and black truffle glaze.',cuisine:'Asian',tags:['sushi','maki','edamame','japanese'],diet:'veg',spice:'mild',sensoryFocus:'Seasoned Grain Glutamate & Mineral Nori Umami',sensoryTags:['Vinegared Rice','Earthy Truffle Glaze','Velvety Avocado'],tasteHighlight:'Seasoned sushi rice, nori & creamy avocado',sensoryProfile:{umami:0.88,acidity:0.6,sweet:0.25,salt:0.6,bitter:0.1,heat:0.1,crisp:0.4,rich:0.6,aromatic:0.85,ferment:0.7}},
 {id:'rich-miso-ramen',name:'Smoky miso mushroom ramen',description:'Springy ramen noodles in rich fermented koji miso broth.',cuisine:'Asian',tags:['ramen','miso','ramen noodles'],diet:'veg',spice:'medium',sensoryFocus:'Complex Koji Fermentation & Elastic Springy Wheat',sensoryTags:['Deep Miso Broth','Tensile Noodle','Charred Scallion'],tasteHighlight:'Rich fermented koji miso broth & springy ramen',sensoryProfile:{umami:0.96,acidity:0.35,sweet:0.25,salt:0.8,bitter:0.2,heat:0.5,crisp:0.4,rich:0.82,aromatic:0.95,ferment:0.95}},
 {id:'avocado-sourdough',name:'Crushed avocado & dukkah toast',description:'Creamy Hass avocado with Egyptian spiced seed crunch on wild sourdough.',cuisine:'Cafe',tags:['avocado','dukkah','avocado toast'],diet:'veg',spice:'mild',sensoryFocus:'Lipid Viscosity & Roasted Seed Egyptian Spices',sensoryTags:['Hass Avocado','Egyptian Dukkah','Craggy Sourdough'],tasteHighlight:'Creamy Hass avocado & toasted seed crunch',sensoryProfile:{umami:0.65,acidity:0.6,sweet:0.15,salt:0.6,bitter:0.2,heat:0.25,crisp:0.92,rich:0.78,aromatic:0.9,ferment:0.7}},
 {id:'belgian-waffle',name:'Warm Belgian waffle & dark chocolate',description:'Golden pearl sugar waffle with molten dark chocolate ganache.',cuisine:'Cafe',tags:['waffle','waffles','belgian waffle'],diet:'veg',spice:'mild',sensoryFocus:'Caramelized Pearl Sugar & Rich Cocoa Bittersweet',sensoryTags:['Pearl Sugar Crunch','Molten Ganache','Buttery Batter'],tasteHighlight:'Golden caramelized pearl sugar & dark ganache',sensoryProfile:{umami:0.35,acidity:0.15,sweet:0.85,salt:0.35,bitter:0.45,heat:0.0,crisp:0.85,rich:0.88,aromatic:0.85,ferment:0.3}},
 {id:'kesar-kulfi-falooda',name:'Kesar pista kulfi falooda',description:'Slow-churned rabdi kulfi with saffron, pistachios and rose syrup.',cuisine:'Dessert',tags:['kulfi','falooda','rabdi'],diet:'veg',spice:'mild',sensoryFocus:'Condensed Milk Viscosity & Retronasal Rose Saffron',sensoryTags:['Slow-Churned Rabdi','Kashmiri Saffron','Pistachio Crunch'],tasteHighlight:'Dense saffron rabdi kulfi & fragrant rose syrup',sensoryProfile:{umami:0.4,acidity:0.1,sweet:0.92,salt:0.2,bitter:0.1,heat:0.0,crisp:0.35,rich:0.96,aromatic:0.95,ferment:0.2}},
 {id:'bombay-pav-bhaji',name:'Buttery Bombay pav bhaji',description:'Spiced mashed vegetable butter masala with sizzling butter-toasted pav.',cuisine:'Punjabi',tags:['pav bhaji','bhaji','tawa pulav','pav'],diet:'veg',spice:'hot',sensoryFocus:'Caramelized Allium Masala & Melted Amul Butter',sensoryTags:['Sizzling Pav Butter','Mashed Spiced Bhaji','Sharp Onion Crunch'],tasteHighlight:'Sizzling spiced butter bhaji & toasted pav',sensoryProfile:{umami:0.88,acidity:0.65,sweet:0.2,salt:0.8,bitter:0.15,heat:0.8,crisp:0.4,rich:0.92,aromatic:0.95,ferment:0.35}},
 {id:'dahi-puri-chaat',name:'Crisp dahi sev puri',description:'Crisp hollow puris filled with spiced potatoes, chilled sweet curd and tamarind.',cuisine:'Gujarati',tags:['chaat','dahi puri','pani puri','sev puri','bhel'],diet:'veg',spice:'medium',sensoryFocus:'Multi-Phase Acoustic Shatter & Chilled Acid-Sweet',sensoryTags:['Acoustic Shatter','Velvety Chilled Curd','Tamarind Reduction'],tasteHighlight:'Crisp hollow puri burst, sweet curd & tangy tamarind',sensoryProfile:{umami:0.7,acidity:0.8,sweet:0.65,salt:0.7,bitter:0.1,heat:0.45,crisp:0.98,rich:0.65,aromatic:0.88,ferment:0.65}},
 {id:'chipotle-bean-tacos',name:'Smoky chipotle & charred corn tacos',description:'Warm corn tortillas with smoky black beans, roasted corn and lime crema.',cuisine:'Italian',tags:['tacos','taco','nachos','mexican'],diet:'veg',spice:'medium',sensoryFocus:'Woodsmoke Chipotle Capsaicin & Charred Sweet Corn',sensoryTags:['Nixtamal Corn Tortilla','Smoky Chipotle','Zesty Lime Slaw'],tasteHighlight:'Charred corn salsa, smoky beans & lime crema',sensoryProfile:{umami:0.78,acidity:0.75,sweet:0.35,salt:0.7,bitter:0.15,heat:0.65,crisp:0.6,rich:0.6,aromatic:0.92,ferment:0.45}}
];
let dishCalibrationIndex=0,lastCalibratedDish=null,dishRevision=0,dishSyncStatus='',detailRestaurantId=null,detailOrigin='home',detailTrigger=null;
function normalizeDishFeedback(value){
 if(!value||typeof value!=='object'||Array.isArray(value))return {};
 return Object.fromEntries(calibrationDishes.filter(d=>['love','pass'].includes(value[d.id])).map(d=>[d.id,value[d.id]]));
}
function preferredCuisines(a=state.answers){
 const favorites=Array.isArray(a?.cuisines)?a.cuisines.filter(x=>Object.hasOwn(cuisineAliases,x)):[];
 const direct=[...new Set(favorites.length?favorites:[a?.cuisine].filter(Boolean))];
 const feedback=typeof normalizeDishFeedback==='function'?normalizeDishFeedback(state?.dishFeedback):{};
 const available=typeof availableCalibrationDishes==='function'?availableCalibrationDishes():calibrationDishes;
 const availableIds=new Set(available.map(d=>d.id));
 const calibratedLoves=new Set();
 for(const [id,val] of Object.entries(feedback)){
  if(val==='love'&&availableIds.has(id)){
   const d=calibrationDishes.find(x=>x.id===id);
   if(d&&d.cuisine&&cuisineAliases[d.cuisine])calibratedLoves.add(d.cuisine);
  }
 }
 return [...new Set([...direct,...calibratedLoves])];
}
function preferredVibes(a=state.answers){
 const favorites=Array.isArray(a?.vibes)?a.vibes.filter(x=>['quiet','lively','date','family'].includes(x)):[];
 return [...new Set(favorites.length?favorites:[a?.mood].filter(Boolean))];
}
function cuisineFits(r,key){
 const values=[...(r.c||[]),...(r.t||[])].map(x=>String(x).toLowerCase());
 return values.some(x=>(cuisineAliases[key]||[String(key).toLowerCase()]).some(term=>x.includes(term)));
}
function availableCalibrationDishes(){const diet=state.answers?.diet;return calibrationDishes.filter(d=>diet==='veg'?d.diet==='veg':diet==='eggetarian'?d.diet!=='nonveg':true)}
function dishAffinity(r,d){
 if(!cuisineFits(r,d.cuisine))return 0;
 const tags=[...(r.t||[]),...(r.c||[])].map(x=>String(x).toLowerCase());
 const specific=tags.some(x=>d.tags.some(tag=>x.includes(tag)));
 // A cuisine label is weak evidence for a particular dish, especially after a pass.
 return specific?1:.25;
}
function computeUserTasteVector(){
 const feedback=normalizeDishFeedback(state.dishFeedback);
 const v={
  umami:0.55,
  acidity:0.5,
  sweet:0.45,
  salt:0.55,
  bitter:0.3,
  heat:(state.answers?.spice==='hot'?0.85:state.answers?.spice==='medium'?0.5:0.2),
  crisp:0.6,
  rich:0.55,
  aromatic:0.65,
  ferment:0.4
 };
 let count=0;
 for(const d of calibrationDishes){
  const val=feedback[d.id];
  if(!val||!d.sensoryProfile)continue;
  const sign=val==='love'?1:-0.7;
  const weight=val==='love'?0.22:0.18;
  for(const k of Object.keys(v)){
   if(d.sensoryProfile[k]!==undefined){
    v[k]=Math.max(0.05,Math.min(0.98,v[k]+sign*(d.sensoryProfile[k]-0.5)*weight));
   }
  }
  count++;
 }
 return {vector:v,signalCount:count};
}
function dishSensoryMatchScore(d,r){
 const {vector:u}=computeUserTasteVector();
 const dp=d.sensoryProfile;
 if(!dp)return 85;
 const axes=['umami','acidity','crisp','rich','aromatic','heat'];
 let diffSum=0;
 for(const axis of axes){
  const userVal=u[axis]??0.5;
  const dishVal=dp[axis]??0.5;
  let weight=1.0;
  if(axis==='heat'&&dishVal>userVal+0.15){
   weight=2.2;
  }
  diffSum+=Math.abs(userVal-dishVal)*weight;
 }
 const avgDiff=diffSum/(axes.length+0.6);
 const baseScore=Math.max(0.60,Math.min(0.98,1-avgDiff*0.7));
 const affinityBonus=r?(dishAffinity(r,d)*0.06):0.03;
 return Math.round(Math.min(99,Math.max(68,(baseScore+affinityBonus)*100)));
}
function venueCalibratedDishes(r){
 const available=availableCalibrationDishes();
 const isVegVenue = (typeof isPureVegRestaurant === 'function' && isPureVegRestaurant(r)) || r.isPureVeg === true || (typeof restaurantDietaryEvidence === 'function' && restaurantDietaryEvidence(r).pureVegetarian);
 const dietEligible = available.filter(d => isVegVenue ? (d.diet === 'veg') : true);
 
 const rWords = [r.name, ...(r.c||[]), ...(r.t||[]), ...(r.review_insights||[]), r.description, r.why].filter(Boolean).map(x => String(x).toLowerCase());
 const rText = rWords.join(' ');
 const genericTags = new Set(['street food', 'fast food', 'snacks', 'breakfast', 'regional', 'comfort', 'desserts', 'curry']);
 const primaryCuisine = (r.c && r.c.length) ? String(r.c[0]).toLowerCase() : '';

 const scored = dietEligible.map(d => {
  let score = 0;
  const affinity = dishAffinity(r, d);
  const specificMatches = d.tags.filter(t => !genericTags.has(t) && (rWords.some(w => w.includes(t)) || rText.includes(t)));
  const genericMatches = d.tags.filter(t => genericTags.has(t) && (rWords.some(w => w.includes(t)) || rText.includes(t)));
  const fitsCuisine = cuisineFits(r, d.cuisine);
  const fitsPrimary = primaryCuisine && cuisineFits({ c: [primaryCuisine] }, d.cuisine);
  
  // Specific dish item match in venue metadata (e.g. pav bhaji, tacos, sushi, ramen, pizza, dosa)
  if (specificMatches.length > 0) {
   score += 120 + specificMatches.length * 30;
  }
  
  if (affinity >= 1) score += 60;
  else if (affinity > 0) score += 20;
  
  if (fitsPrimary) score += 40;
  else if (fitsCuisine) score += 15;

  if (genericMatches.length > 0 && fitsCuisine) score += 10;
  
  return { dish: d, score, affinity, specificMatches: specificMatches.length, fitsPrimary: !!fitsPrimary };
 });
 
 let matching = scored.filter(x => x.score >= 20).sort((a, b) => b.score - a.score).map(x => x.dish);
 
 if (!matching.length) {
  const isCafe = rWords.some(w => /cafe|coffee|bakery|roast|tea|beverage/i.test(w));
  const isSweet = rWords.some(w => /dessert|ice cream|gelato|kulfi|sweet/i.test(w));
  const isItalian = rWords.some(w => /italian|pizza|pasta/i.test(w));
  const isAsian = rWords.some(w => /asian|chinese|thai|japanese|sushi|dim sum|noodle/i.test(w));
  const isSouth = rWords.some(w => /south indian|dosa|idli/i.test(w));
  const isStreet = rWords.some(w => /chaat|street|pav bhaji|fast food|snack/i.test(w));
  
  if (isCafe) matching = dietEligible.filter(d => d.cuisine === 'Cafe');
  else if (isSweet) matching = dietEligible.filter(d => d.cuisine === 'Dessert');
  else if (isItalian) matching = dietEligible.filter(d => d.cuisine === 'Italian');
  else if (isAsian) matching = dietEligible.filter(d => d.cuisine === 'Asian');
  else if (isSouth) matching = dietEligible.filter(d => d.cuisine === 'SouthIndian');
  else if (isStreet) matching = dietEligible.filter(d => d.tags.some(t => ['chaat', 'pav bhaji'].includes(t)));
  else matching = dietEligible.filter(d => cuisineFits(r, d.cuisine));
 }
 
 if (!matching.length) matching = dietEligible.slice(0, 3);
 
 return matching.map(d => ({
  ...d,
  matchScore: dishSensoryMatchScore(d, r)
 })).sort((a, b) => {
  const aSpecific = a.tags.filter(t => !genericTags.has(t) && (rWords.some(w => w.includes(t)) || rText.includes(t))).length;
  const bSpecific = b.tags.filter(t => !genericTags.has(t) && (rWords.some(w => w.includes(t)) || rText.includes(t))).length;
  if (aSpecific !== bSpecific) return bSpecific - aSpecific;
  
  const aPrimary = primaryCuisine && cuisineFits({ c: [primaryCuisine] }, a.cuisine);
  const bPrimary = primaryCuisine && cuisineFits({ c: [primaryCuisine] }, b.cuisine);
  if (aPrimary !== bPrimary) return aPrimary ? -1 : 1;

  const affA = dishAffinity(r, a), affB = dishAffinity(r, b);
  if (affA !== affB) return affB - affA;
  return b.matchScore - a.matchScore;
 });
}
function dishSensoryWhy(d,r){
 const {vector:u}=computeUserTasteVector();
 const dp=d.sensoryProfile;
 if(!dp)return 'Balanced flavor and texture profile';
 const highlights=[];
 if(dp.umami>=0.75&&u.umami>=0.55)highlights.push('deep umami richness');
 if(dp.crisp>=0.75&&u.crisp>=0.55)highlights.push('satisfying acoustic crunch');
 if(dp.acidity>=0.65&&u.acidity>=0.5)highlights.push('bright refreshing acidity');
 if(dp.heat>=0.6&&u.heat>=0.5)highlights.push('bold capsaicin heat');
 if(dp.rich>=0.75&&u.rich>=0.55)highlights.push('velvety creamy texture');
 if(dp.aromatic>=0.8&&u.aromatic>=0.55)highlights.push('fragrant roasted aromatics');
 if(highlights.length>0){
  return 'Calibrated for your love of '+highlights.slice(0,2).join(' & ');
 }
 return 'Harmonizes with your '+(d.sensoryFocus||'palate profile');
}
function dishAdjustment(r){
 const feedback=normalizeDishFeedback(state.dishFeedback);
 let sum=0,weight=0;
 for(const d of availableCalibrationDishes()){
  if(!feedback[d.id])continue;
  const affinity=dishAffinity(r,d);if(!affinity)continue;
  sum+=(feedback[d.id]==='love'?1:-1)*affinity;weight+=affinity;
 }
 // shortcut: cuisine/tag similarity approximates dish fit; upgrade when verified menu-level features are available.
 return weight?Math.max(-8,Math.min(8,8*sum/(1+weight))):0;
}

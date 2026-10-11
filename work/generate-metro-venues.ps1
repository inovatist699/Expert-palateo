$venues = @(
  # MUMBAI
  @{
    id = "mumbai-1"; name = "The Bombay Canteen"; area = "Lower Parel"; city = "Mumbai"
    latitude = 19.0068; longitude = 72.8286; c = @("Indian", "Modern Indian", "Regional")
    p = "1000_2000"; rating = 4.7; review_count = 5400; t = @("Progressive Indian", "Cocktails", "Iconic")
    a = @("lively", "modern"); o = @("friends", "date"); s = "medium"; dietaryOptions = @("vegetarian", "non-vegetarian")
    emoji = "🍛"; photo = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=The+Bombay+Canteen+Lower+Parel+Mumbai"
    review_insights = @("progressive regional indian", "eggs kejriwal", "craft cocktails", "electric atmosphere")
    why = "India's celebrated modern bistro redefining regional food and artisanal cocktails."
  },
  @{
    id = "mumbai-2"; name = "Veronica's"; area = "Bandra West"; city = "Mumbai"
    latitude = 19.0565; longitude = 72.8280; c = @("Cafe", "Sandwiches", "Bakery")
    p = "500_1000"; rating = 4.6; review_count = 2800; t = @("Sourdough", "Deli", "Bandra Vibe")
    a = @("lively", "cozy"); o = @("friends", "solo"); s = "mild"; dietaryOptions = @("vegetarian", "non-vegetarian")
    emoji = "🥪"; photo = "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Veronicas+Bandra+West+Mumbai"
    review_insights = @("iconic pastrami sandwich", "fresh kombucha", "heritage waroda road", "buzzing breakfast spot")
    why = "Vibrant retro deli in Bandra known for monster sourdough sandwiches and specialty bakes."
  },
  @{
    id = "mumbai-3"; name = "Subko Specialty Coffee & Bakehouse"; area = "Bandra West"; city = "Mumbai"
    latitude = 19.0573; longitude = 72.8315; c = @("Cafe", "Coffee", "Bakery")
    p = "500_1000"; rating = 4.7; review_count = 4100; t = @("Specialty Coffee", "Sourdough", "Work Friendly")
    a = @("cozy", "quiet"); o = @("solo", "friends"); s = "mild"; dietaryOptions = @("vegetarian_options")
    emoji = "☕"; photo = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Subko+Coffee+Bandra+West+Mumbai"
    review_insights = @("single-origin indian roasts", "podi sourdough toast", "cold brew bar", "quaint bylane courtyard")
    why = "India's trailblazing specialty coffee brand with bean-to-cup traceability."
  },
  @{
    id = "mumbai-4"; name = "Trishna"; area = "Fort"; city = "Mumbai"
    latitude = 18.9288; longitude = 72.8331; c = @("Seafood", "Mangalorean", "Coastal")
    p = "2000_plus"; rating = 4.6; review_count = 6200; t = @("Butter Garlic Crab", "Coastal", "Legend")
    a = @("traditional", "lively"); o = @("family", "special"); s = "medium"; dietaryOptions = @("non-vegetarian", "seafood")
    emoji = "🦀"; photo = "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Trishna+Fort+Mumbai"
    review_insights = @("world-famous butter garlic crab", "neer dosa with fish curry", "koliwada prawns", "legendary heritage")
    why = "World-famous South Mumbai institution for colossal mud crabs and coastal spice."
  },
  @{
    id = "mumbai-5"; name = "Bastian"; area = "Bandra West"; city = "Mumbai"
    latitude = 19.0620; longitude = 72.8340; c = @("Seafood", "Asian", "Desserts")
    p = "2000_plus"; rating = 4.5; review_count = 3800; t = @("Celebrity Spot", "Cheesecakes", "Cocktails")
    a = @("lively", "premium"); o = @("date", "special"); s = "medium"; dietaryOptions = @("non-vegetarian", "vegetarian")
    emoji = "🍸"; photo = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Bastian+Bandra+West+Mumbai"
    review_insights = @("gluten-free cheesecakes", "lobster rolls", "craft signature cocktails", "celebrity favorite")
    why = "High-energy dining synonymous with seafood decadence and legendary cheesecakes."
  },
  @{
    id = "mumbai-6"; name = "Britannia & Co."; area = "Ballard Estate"; city = "Mumbai"
    latitude = 18.9348; longitude = 72.8402; c = @("Parsi", "Iranian", "Heritage")
    p = "500_1000"; rating = 4.5; review_count = 4900; t = @("Berry Pulao", "Historic", "Parsi Classic")
    a = @("traditional", "quiet"); o = @("family", "friends"); s = "medium"; dietaryOptions = @("vegetarian", "non-vegetarian")
    emoji = "🥘"; photo = "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Britannia+Co+Ballard+Estate+Mumbai"
    review_insights = @("authentic irani berry pulao", "sali boti mutton", "caramel custard", "1923 colonial cafe charm")
    why = "1923 colonial gem famous for zereshk berry pulao and silky caramel custard."
  },

  # DELHI NCR
  @{
    id = "delhi-1"; name = "Indian Accent"; area = "The Lodhi, Lodhi Road"; city = "Delhi NCR"
    latitude = 28.5916; longitude = 77.2372; c = @("Modern Indian", "Fine Dining", "Tasting Menu")
    p = "2000_plus"; rating = 4.8; review_count = 4500; t = @("Chef Manish Mehrotra", "World 50 Best", "Luxury")
    a = @("quiet", "premium"); o = @("date", "special"); s = "mild"; dietaryOptions = @("vegetarian", "non-vegetarian")
    emoji = "🍽️"; photo = "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Indian+Accent+The+Lodhi+Delhi"
    review_insights = @("globally acclaimed tasting menu", "meetha aachar pork ribs", "duck khurchan cornetto", "glasshouse water body")
    why = "India's highest rated culinary export, marrying nostalgia with global haute cuisine."
  },
  @{
    id = "delhi-2"; name = "Bukhara"; area = "ITC Maurya, Chanakyapuri"; city = "Delhi NCR"
    latitude = 28.5976; longitude = 77.1724; c = @("North Indian", "North-West Frontier", "Mughlai")
    p = "2000_plus"; rating = 4.7; review_count = 7800; t = @("Dal Bukhara", "Iconic Tandoor", "Heritage")
    a = @("traditional", "premium"); o = @("family", "special"); s = "medium"; dietaryOptions = @("vegetarian", "non-vegetarian")
    emoji = "🥘"; photo = "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Bukhara+ITC+Maurya+Delhi"
    review_insights = @("legendary 18-hour dal bukhara", "jumbo naan bukhara", "sikandari raan", "rustic earthen setting")
    why = "The world's most famous Indian clay oven restaurant, unchanged since 1978."
  },
  @{
    id = "delhi-3"; name = "Fig & Maple"; area = "Greater Kailash 2"; city = "Delhi NCR"
    latitude = 28.5332; longitude = 77.2435; c = @("Cafe", "European", "Continental")
    p = "1000_2000"; rating = 4.6; review_count = 2100; t = @("Rooftop", "Farm to Table", "Craft Brunch")
    a = @("modern", "lively"); o = @("friends", "date"); s = "mild"; dietaryOptions = @("vegetarian_options")
    emoji = "🌿"; photo = "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Fig+and+Maple+GK2+Delhi"
    review_insights = @("seasonal farm-to-fork ingredients", "rooftop garden terrace", "artisan cocktails", "creative waffles")
    why = "Lush rooftop cafe celebrated for ethical local produce and playful presentation."
  },
  @{
    id = "delhi-4"; name = "Leo's Artisan Pizza"; area = "Vasant Vihar"; city = "Delhi NCR"
    latitude = 28.5583; longitude = 77.1631; c = @("Italian", "Pizza", "Cafe")
    p = "1000_2000"; rating = 4.7; review_count = 3200; t = @("Neapolitan Pizza", "Woodfired", "Pet Friendly")
    a = @("cozy", "casual"); o = @("friends", "date"); s = "mild"; dietaryOptions = @("vegetarian_options")
    emoji = "🍕"; photo = "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Leos+Artisan+Pizza+Vasant+Vihar+Delhi"
    review_insights = @("authentic woodfired sourdough crust", "burrata and prosciutto pizza", "cozy relaxed vibe", "tiramisu")
    why = "Delhi's gold standard for true Naples-style leopard-spotted woodfired pizza."
  },
  @{
    id = "delhi-5"; name = "Carnatic Cafe"; area = "Greater Kailash 2"; city = "Delhi NCR"
    latitude = 28.5328; longitude = 77.2442; c = @("South Indian", "Karnataka", "Regional")
    p = "under_500"; rating = 4.6; review_count = 5100; t = @("Benne Dosa", "Filter Coffee", "Comfort")
    a = @("casual", "quiet"); o = @("family", "solo"); s = "mild"; dietaryOptions = @("vegetarian")
    emoji = "🥞"; photo = "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Carnatic+Cafe+GK2+Delhi"
    review_insights = @("iconic malleshwaram 18th cross dosa", "fluffy benne dosa", "steaming filter coffee", "homely bangalore flavors")
    why = "Beloved Karnataka comfort food haven serving ghee-laden fluffy benne dosas."
  },

  # BENGALURU
  @{
    id = "blr-1"; name = "Toit Brewpub"; area = "Indiranagar"; city = "Bengaluru"
    latitude = 12.9793; longitude = 77.6406; c = @("Brewery", "Pizza", "Continental")
    p = "1000_2000"; rating = 4.6; review_count = 12000; t = @("Craft Beer", "Woodfired Pizza", "Cult Classic")
    a = @("lively", "modern"); o = @("friends", "date"); s = "medium"; dietaryOptions = @("vegetarian_options")
    emoji = "🍺"; photo = "https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Toit+Indiranagar+Bengaluru"
    review_insights = @("tintin witbier craft brews", "crisp woodfired sourdough pizza", "iconic indiranagar energy", "chilli pork")
    why = "Bangalore's quintessential craft beer institution that ignited the city's pub culture."
  },
  @{
    id = "blr-2"; name = "Nagarjuna"; area = "Residency Road"; city = "Bengaluru"
    latitude = 12.9705; longitude = 77.6067; c = @("Andhra", "South Indian", "Biryani")
    p = "500_1000"; rating = 4.5; review_count = 9400; t = @("Banana Leaf Meals", "Andhra Chilli Chicken", "Spicy")
    a = @("lively", "traditional"); o = @("family", "friends"); s = "hot"; dietaryOptions = @("non-vegetarian", "vegetarian")
    emoji = "🌶️"; photo = "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Nagarjuna+Residency+Road+Bengaluru"
    review_insights = @("fiery andhra banana leaf meals", "gunpowder and ghee rice", "iconic sholay kebab", "legendary spice level")
    why = "Legendary fiery Andhra feasts served on fresh plantain leaves with fragrant ghee."
  },
  @{
    id = "blr-3"; name = "The Permit Room"; area = "MG Road"; city = "Bengaluru"
    latitude = 12.9744; longitude = 77.6108; c = @("South Indian", "Cocktails", "Modern Indian")
    p = "1000_2000"; rating = 4.6; review_count = 3400; t = @("South Indian Cocktails", "Podi Idli", "Rooftop")
    a = @("lively", "modern"); o = @("friends", "date"); s = "medium"; dietaryOptions = @("vegetarian", "non-vegetarian")
    emoji = "🍹"; photo = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=The+Permit+Room+MG+Road+Bengaluru"
    review_insights = @("rasam whiskey sours", "curry leaf cocktails", "kerala beef fry", "cheeky nostalgic south vibe")
    why = "Clever contemporary South Indian bar serving spiced cocktails and gourmet regional bites."
  },
  @{
    id = "blr-4"; name = "Maverick & Farmer Coffee"; area = "Ulsoor Lake"; city = "Bengaluru"
    latitude = 12.9818; longitude = 77.6212; c = @("Cafe", "Coffee", "Bakery")
    p = "under_500"; rating = 4.7; review_count = 1800; t = @("Lake View", "Specialty Coffee", "Artisanal")
    a = @("quiet", "cozy"); o = @("solo", "friends"); s = "mild"; dietaryOptions = @("vegetarian_options")
    emoji = "☕"; photo = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Maverick+Farmer+Coffee+Ulsoor+Bengaluru"
    review_insights = @("clarified coffee brews", "peaceful ulsoor lake terrace view", "cold smoke cold brew", "serene work setting")
    why = "Innovative artisanal coffee roaster overlooking the tranquil waters of Ulsoor Lake."
  },
  @{
    id = "blr-5"; name = "Corner House Ice Cream"; area = "Koramangala"; city = "Bengaluru"
    latitude = 12.9348; longitude = 77.6190; c = @("Desserts", "Ice Cream", "Cafe")
    p = "under_500"; rating = 4.7; review_count = 11000; t = @("DBC", "Death By Chocolate", "Cult Legend")
    a = @("casual", "lively"); o = @("friends", "family"); s = "mild"; dietaryOptions = @("vegetarian")
    emoji = "🍨"; photo = "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Corner+House+Koramangala+Bengaluru"
    review_insights = @("legendary death by chocolate dbc", "hot chocolate fudge", "warm brownie sundae", "unmatched local cult love")
    why = "Bangalore's dessert religion famous for the cult favorite Death By Chocolate sundae."
  },

  # HYDERABAD
  @{
    id = "hyd-1"; name = "Roastery Coffee House"; area = "Banjara Hills"; city = "Hyderabad"
    latitude = 17.4156; longitude = 78.4385; c = @("Cafe", "Coffee", "Continental")
    p = "500_1000"; rating = 4.7; review_count = 6100; t = @("Bungalow Cafe", "Specialty Roaster", "Garden")
    a = @("cozy", "quiet"); o = @("friends", "date"); s = "mild"; dietaryOptions = @("vegetarian_options")
    emoji = "☕"; photo = "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Roastery+Coffee+House+Banjara+Hills+Hyderabad"
    review_insights = @("gorgeous green bungalow courtyard", "pour-over brew bar", "jalapeno cheese balls", "quaint ambience")
    why = "Beautiful heritage villa converted into Hyderabad's finest specialty coffee sanctuary."
  },
  @{
    id = "hyd-2"; name = "Olive Bistro & Bar"; area = "Jubilee Hills"; city = "Hyderabad"
    latitude = 17.4367; longitude = 78.3978; c = @("Mediterranean", "Italian", "European")
    p = "1000_2000"; rating = 4.6; review_count = 4300; t = @("Lake View", "Date Night", "White Villa")
    a = @("quiet", "premium"); o = @("date", "special"); s = "mild"; dietaryOptions = @("vegetarian_options")
    emoji = "🌊"; photo = "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Olive+Bistro+Jubilee+Hills+Hyderabad"
    review_insights = @("cliffside panoramic lake view", "fairy-tale whitewashed decor", "woodfired artisanal pizzas", "romantic sunset dinners")
    why = "Idyllic cliffside Mediterranean bistro overlooking Durgam Cheruvu lake."
  },
  @{
    id = "hyd-3"; name = "Bawarchi"; area = "RTC X Roads, Nallakunta"; city = "Hyderabad"
    latitude = 17.4048; longitude = 78.4975; c = @("Biryani", "Mughlai", "Hyderabadi")
    p = "under_500"; rating = 4.4; review_count = 18000; t = @("Mutton Dum Biryani", "Heritage", "Cult Classic")
    a = @("lively", "casual"); o = @("family", "friends"); s = "hot"; dietaryOptions = @("non-vegetarian")
    emoji = "🍚"; photo = "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Bawarchi+RTC+X+Roads+Hyderabad"
    review_insights = @("authentic coal dum mutton biryani", "mirchi ka salan", "aromatic long-grain basmati", "unrivaled local institution")
    why = "The holy grail of authentic slow-cooked dum biryani in the heart of Hyderabad."
  },

  # CHENNAI
  @{
    id = "chn-1"; name = "Dakshin"; area = "Alwarpet"; city = "Chennai"
    latitude = 13.0298; longitude = 80.2520; c = @("South Indian", "Coastal", "Traditional")
    p = "2000_plus"; rating = 4.7; review_count = 3200; t = @("Live Carnatic Music", "Royal Feast", "Heritage")
    a = @("traditional", "quiet"); o = @("family", "special"); s = "medium"; dietaryOptions = @("vegetarian", "non-vegetarian")
    emoji = "🪔"; photo = "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Dakshin+Alwarpet+Chennai"
    review_insights = @("royal five-state south indian thali", "live veena and flute recital", "fresh appam trolley", "grand brass thali service")
    why = "Crown jewel of South Indian fine dining, serenaded by live Carnatic classical music."
  },
  @{
    id = "chn-2"; name = "Amethyst - Wild Garden Cafe"; area = "Royapettah"; city = "Chennai"
    latitude = 13.0543; longitude = 80.2604; c = @("Cafe", "Continental", "Italian")
    p = "500_1000"; rating = 4.5; review_count = 5300; t = @("Heritage Mansion", "Verandah", "Garden")
    a = @("quiet", "cozy"); o = @("date", "solo"); s = "mild"; dietaryOptions = @("vegetarian_options")
    emoji = "🌿"; photo = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Amethyst+Wild+Garden+Cafe+Royapettah+Chennai"
    review_insights = @("colonial verandah under banyan trees", "filter kaapi affogato", "artisanal pastas", "peaceful reading courtyard")
    why = "Restored colonial bungalow hidden inside an enchanted tropical garden."
  },

  # KOLKATA
  @{
    id = "kol-1"; name = "Peter Cat"; area = "Park Street"; city = "Kolkata"
    latitude = 22.5517; longitude = 88.3533; c = @("Continental", "North Indian", "Heritage")
    p = "1000_2000"; rating = 4.6; review_count = 14000; t = @("Chelo Kebab", "1975 Classic", "Park Street Legend")
    a = @("lively", "traditional"); o = @("family", "friends"); s = "medium"; dietaryOptions = @("non-vegetarian", "vegetarian")
    emoji = "🍢"; photo = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Peter+Cat+Park+Street+Kolkata"
    review_insights = @("iconic chelo kebab with fried egg", "piping hot sizzler platters", "retro 1970s dim-lit ambiance", "perennial park street lines")
    why = "The undisputed king of Park Street dining, famous for the legendary Iranian Chelo Kebab."
  },
  @{
    id = "kol-2"; name = "6 Ballygunge Place"; area = "Ballygunge"; city = "Kolkata"
    latitude = 22.5273; longitude = 88.3654; c = @("Bengali", "Regional", "Traditional")
    p = "1000_2000"; rating = 4.5; review_count = 7800; t = @("Daab Chingri", "Kosha Mangsho", "Centenary Haveli")
    a = @("traditional", "quiet"); o = @("family", "special"); s = "medium"; dietaryOptions = @("non-vegetarian", "vegetarian")
    emoji = "🥘"; photo = "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=6+Ballygunge+Place+Kolkata"
    review_insights = @("prawns steamed in tender coconut daab chingri", "slow cooked kosha mangsho", "chitol muitha", "authentic colonial bungalow")
    why = "Colonial mansion serving authentic Zamindari Bengali delicacies like Daab Chingri."
  },
  @{
    id = "kol-3"; name = "Flurys"; area = "Park Street"; city = "Kolkata"
    latitude = 22.5523; longitude = 88.3524; c = @("Bakery", "Cafe", "Desserts", "European")
    p = "500_1000"; rating = 4.4; review_count = 11000; t = @("1927 Heritage", "English Breakfast", "Rum Balls")
    a = @("traditional", "lively"); o = @("friends", "family"); s = "mild"; dietaryOptions = @("vegetarian_options")
    emoji = "🥐"; photo = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Flurys+Park+Street+Kolkata"
    review_insights = @("iconic traditional english breakfast", "nostalgic rum balls", "creamy chicken patties", "1927 historic tearoom")
    why = "Historic tearoom on Park Street serving European confectioneries since 1927."
  },

  # PUNE
  @{
    id = "pune-1"; name = "Malaka Spice"; area = "Koregaon Park"; city = "Pune"
    latitude = 18.5362; longitude = 73.8994; c = @("Asian", "Southeast Asian", "Thai")
    p = "1000_2000"; rating = 4.6; review_count = 7200; t = @("Eclectic Asian", "Art Courtyard", "Cocktails")
    a = @("lively", "modern"); o = @("friends", "date"); s = "medium"; dietaryOptions = @("vegetarian", "non-vegetarian")
    emoji = "🍜"; photo = "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Malaka+Spice+Koregaon+Park+Pune"
    review_insights = @("authentic south-east asian small plates", "lush garden seating with art gallery", "top hats cocktail", "fresh coconut curries")
    why = "Koregaon Park institution serving vibrant street food from Vietnam, Thailand and Bali."
  },
  @{
    id = "pune-2"; name = "German Bakery"; area = "Koregaon Park"; city = "Pune"
    latitude = 18.5375; longitude = 73.8962; c = @("Cafe", "Bakery", "European", "Desserts")
    p = "500_1000"; rating = 4.3; review_count = 11000; t = @("Bohemian", "Apple Strudel", "Osho Cult")
    a = @("casual", "lively"); o = @("friends", "solo"); s = "mild"; dietaryOptions = @("vegetarian_options")
    emoji = "🥨"; photo = "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=German+Bakery+Koregaon+Park+Pune"
    review_insights = @("signature warm apple strudel", "keema pav", "chilled iced teas", "bohemian travelers hangout")
    why = "Bohemian Koregaon Park landmark famed for German pastries and backpacker warmth."
  },
  @{
    id = "pune-3"; name = "Le Plaisir"; area = "Prabhat Road, Deccan"; city = "Pune"
    latitude = 18.5143; longitude = 73.8378; c = @("French", "Bistro", "Desserts", "European")
    p = "500_1000"; rating = 4.8; review_count = 4900; t = @("Espresso Macaron", "French Bistro", "Top Rated")
    a = @("cozy", "quiet"); o = @("date", "friends"); s = "mild"; dietaryOptions = @("vegetarian_options")
    emoji = "🥖"; photo = "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Le+Plaisir+Prabhat+Road+Pune"
    review_insights = @("parisian espresso macarons", "four cheese creamy pasta", "harissa grilled chicken", "unmatched dessert perfection")
    why = "Highest-rated French bistro in Pune serving authentic Parisian pastries and savory crepes."
  },

  # JAIPUR
  @{
    id = "jpr-1"; name = "Bar Palladio"; area = "Narain Niwas Palace"; city = "Jaipur"
    latitude = 26.8920; longitude = 75.8152; c = @("Italian", "Cocktails", "Lounge")
    p = "1000_2000"; rating = 4.6; review_count = 3800; t = @("Electric Blue", "Palace Courtyard", "Romantic")
    a = @("quiet", "premium"); o = @("date", "special"); s = "mild"; dietaryOptions = @("vegetarian_options")
    emoji = "🍸"; photo = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Bar+Palladio+Narain+Niwas+Jaipur"
    review_insights = @("iconic royal blue mughal-italian decor", "tent pavilions under starlight", "handmade pasta", "world class cocktails")
    why = "A breathtaking blue jewel box combining Italian aperitivo culture with Rajputana grandeur."
  },
  @{
    id = "jpr-2"; name = "Tapri Central"; area = "C-Scheme"; city = "Jaipur"
    latitude = 26.9064; longitude = 75.8080; c = @("Cafe", "Chai", "Fast food")
    p = "under_500"; rating = 4.6; review_count = 8900; t = @("Rooftop Chai", "Central Park View", "Street Fusion")
    a = @("lively", "casual"); o = @("friends", "solo"); s = "medium"; dietaryOptions = @("vegetarian")
    emoji = "🫖"; photo = "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Tapri+Central+C+Scheme+Jaipur"
    review_insights = @("rooftop view overlooking central park", "signature cutting chai", "sauteed vada pav", "maggi platters")
    why = "Cult rooftop tea room celebrating India's street chai ritual with panoramic park views."
  },

  # KOCHI
  @{
    id = "koc-1"; name = "Kashi Art Cafe"; area = "Fort Kochi"; city = "Kochi"
    latitude = 9.9654; longitude = 76.2415; c = @("Cafe", "European", "Continental", "Desserts")
    p = "500_1000"; rating = 4.5; review_count = 5800; t = @("Bohemian Art Gallery", "Chocolate Cake", "Heritage")
    a = @("quiet", "cozy"); o = @("solo", "date"); s = "mild"; dietaryOptions = @("vegetarian_options")
    emoji = "🖼️"; photo = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Kashi+Art+Cafe+Fort+Kochi"
    review_insights = @("famous warm chocolate pie", "courtyard art installations", "cold press juices", "historic fort kochi calmness")
    why = "Art gallery courtyard cafe synonymous with Fort Kochi's slow bohemian lifestyle."
  },
  @{
    id = "koc-2"; name = "Grand Pavilion"; area = "MG Road"; city = "Kochi"
    latitude = 9.9698; longitude = 76.2842; c = @("Kerala", "Seafood", "South Indian")
    p = "500_1000"; rating = 4.5; review_count = 4200; t = @("Karimeen Pollichathu", "Appam", "Iconic")
    a = @("traditional", "family"); o = @("family", "friends"); s = "medium"; dietaryOptions = @("non-vegetarian", "seafood")
    emoji = "🐟"; photo = "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Grand+Pavilion+MG+Road+Kochi"
    review_insights = @("pearlspot fish wrapped in banana leaf", "fluffy lace appams", "mutton stew", "decades-old culinary legend")
    why = "Kochi's definitive institution for spiced Karimeen Pollichathu and lace appams."
  },

  # GOA
  @{
    id = "goa-1"; name = "Gunpowder"; area = "Assagao"; city = "Goa"
    latitude = 15.5898; longitude = 73.7745; c = @("South Indian", "Coastal", "Kerala")
    p = "1000_2000"; rating = 4.6; review_count = 5100; t = @("Heritage Portuguese Villa", "Podi", "Cocktails")
    a = @("lively", "modern"); o = @("friends", "date"); s = "medium"; dietaryOptions = @("vegetarian", "non-vegetarian")
    emoji = "🥘"; photo = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Gunpowder+Assagao+Goa"
    review_insights = @("spicy pandi pork curry", "fluffy malabar parotta", "heritage villa courtyard", "artisanal cocktail bar")
    why = "A tranquil Portuguese mansion courtyard in Assagao serving fiery peninsular home-cooking."
  },
  @{
    id = "goa-2"; name = "Burger Factory"; area = "Anjuna"; city = "Goa"
    latitude = 15.5802; longitude = 73.7432; c = @("American", "Fast food", "Cafe")
    p = "500_1000"; rating = 4.7; review_count = 4300; t = @("Gourmet Burgers", "Craft Beer", "Beach Vibe")
    a = @("casual", "lively"); o = @("friends", "solo"); s = "medium"; dietaryOptions = @("vegetarian_options")
    emoji = "🍔"; photo = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Burger+Factory+Anjuna+Goa"
    review_insights = @("handcrafted brioche burgers", "bacon blue cheese burger", "passion fruit coolers", "relaxed bohemian beach vibe")
    why = "Goa's cult burger haven producing thick gourmet patties on toasted artisanal brioche."
  },
  @{
    id = "goa-3"; name = "Olive Bar & Kitchen"; area = "Vagator"; city = "Goa"
    latitude = 15.6021; longitude = 73.7348; c = @("Mediterranean", "European", "Cocktails")
    p = "2000_plus"; rating = 4.6; review_count = 3900; t = @("Cliff Sunset", "Sea View", "Romantic")
    a = @("quiet", "premium"); o = @("date", "special"); s = "mild"; dietaryOptions = @("vegetarian_options")
    emoji = "🌅"; photo = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Olive+Vagator+Goa"
    review_insights = @("breathtaking vagator cliff sunset", "white-washed greek island styling", "fresh seafood platters", "unrivaled sundowner scene")
    why = "Cliff-perched white-walled sanctuary overlooking the crashing waves of Vagator beach."
  },

  # CHANDIGARH
  @{
    id = "chd-1"; name = "Backpackers Cafe"; area = "Sector 9"; city = "Chandigarh"
    latitude = 30.7441; longitude = 76.7905; c = @("Cafe", "Continental", "European", "Breakfast")
    p = "500_1000"; rating = 4.5; review_count = 4100; t = @("All Day Breakfast", "Waffles", "Cosmopolitan")
    a = @("cozy", "casual"); o = @("friends", "solo"); s = "mild"; dietaryOptions = @("vegetarian_options")
    emoji = "🍳"; photo = "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Backpackers+Cafe+Sector+9+Chandigarh"
    review_insights = @("classic english breakfast", "fluffy belgian waffles", "traveler memorabilia", "cozy sunny brunch spot")
    why = "Chandigarh's favorite traveler-inspired bistro renowned for hearty all-day breakfast plates."
  },
  @{
    id = "chd-2"; name = "Virgin Courtyard"; area = "Sector 7"; city = "Chandigarh"
    latitude = 30.7302; longitude = 76.7998; c = @("Italian", "European", "Fine Dining")
    p = "1000_2000"; rating = 4.6; review_count = 3200; t = @("Sunlit Courtyard", "Date Night", "Italian")
    a = @("quiet", "premium"); o = @("date", "special"); s = "mild"; dietaryOptions = @("vegetarian_options")
    emoji = "🍝"; photo = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
    maps = "https://www.google.com/maps/search/?api=1&query=Virgin+Courtyard+Sector+7+Chandigarh"
    review_insights = @("sun-drenched cobblestone courtyard", "truffle mushroom risotto", "fine italian wine list", "serene romantic dinner")
    why = "A tranquil Mediterranean courtyard in Sector 7 pairing rustic Italian dishes with fine wines."
  }
)

Write-Host "Total metro venues: $($venues.Count)"
$json = $venues | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText("$PSScriptRoot/metro-venues-generated.json", $json)
Write-Host "Saved to metro-venues-generated.json successfully."

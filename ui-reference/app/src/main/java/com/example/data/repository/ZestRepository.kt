package com.example.data.repository

import android.content.Context
import com.example.R
import com.example.data.local.ZestDatabase
import com.example.data.local.entities.BookingEntity
import com.example.data.local.entities.SavedRestaurantEntity
import com.example.data.local.entities.TasteFeedbackEntity
import com.example.data.local.entities.UserPreferencesEntity
import com.example.data.model.Booking
import com.example.data.model.CuratedCollection
import com.example.data.model.DietaryType
import com.example.data.model.PriceLevel
import com.example.data.model.Restaurant
import com.example.data.ai.PalateAiEngine
import com.example.data.supabase.SupabaseService
import com.example.data.model.SignatureDish
import com.example.data.model.UserProfile
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.map
import java.util.UUID
import kotlin.math.abs
import kotlin.math.roundToInt

class ZestRepository(private val context: Context) {
  private val database = ZestDatabase.getDatabase(context)
  private val restaurantDao = database.restaurantDao()
  private val savedDao = database.savedRestaurantDao()
  private val feedbackDao = database.tasteFeedbackDao()
  private val prefsDao = database.userPreferencesDao()
  val palateAiEngine = PalateAiEngine()
  val supabaseService = SupabaseService()

  // Curated list of top Indian culinary spots
  val allRestaurants: List<Restaurant> = listOf(
    Restaurant(
      id = "blr_toit",
      name = "Toit Brewpub",
      city = "Bengaluru",
      neighborhood = "Indiranagar",
      address = "298, 100 Feet Rd, Near BDA Complex, Indiranagar",
      cuisineList = listOf("Craft Breweries", "Woodfired Pizza", "Continental Tapas"),
      primaryVibe = "Lively Craft Brewery",
      priceLevel = PriceLevel.CASUAL,
      approxCostForTwo = 1800,
      rating = 4.8,
      reviewCount = 2840,
      spiceLevel = 2,
      isPureVeg = false,
      hasOutdoorSeating = true,
      hasRooftop = true,
      servesCraftBeer = true,
      openTiming = "12:00 PM – 1:00 AM",
      signatureDishes = listOf(
        SignatureDish("Tint-in-Wit & Basmati Blonde", "Signature house-brewed Belgian wheat and light craft ales", isVeg = true, isSpicy = false, price = "₹340", tasteHighlight = "Crisp citrus zest notes"),
        SignatureDish("Baked Nachos & Podi Chicken Wings", "Crispy wings tossed in southern spiced gunpowder dry rub", isVeg = false, isSpicy = true, price = "₹420", tasteHighlight = "Podi crunch & smokiness"),
        SignatureDish("Smoked Fig & Goat Cheese Pizza", "Neapolitan crust, wood-fired with balsamic reduction", isVeg = true, isSpicy = false, price = "₹580", tasteHighlight = "Sweet tart contrast")
      ),
      tasteTags = listOf("Craft Beers", "Woodfired", "Podi Crunch", "Social Vibe", "Sunset Rooftop"),
      latitude = 12.9790,
      longitude = 77.6406,
      mapCoordX = 0.68f,
      mapCoordY = 0.42f,
      description = "Bengaluru's legendary microbrewery known for pioneering craft beer culture, sprawling brick courtyards, and woodfired sourdough pizzas.",
      seatingAreas = listOf("Brewery Floor", "Rooftop Garden", "High Bar Tables"),
      curatedCollectionId = "blr_craft_beer",
      heroDrawableId = R.drawable.img_hero_indian_dining
    ),
    Restaurant(
      id = "blr_permit_room",
      name = "The Permit Room",
      city = "Bengaluru",
      neighborhood = "MG Road / Brigade",
      address = "55, Ram Kunj, Opposite Garuda Mall, Commissariat Rd",
      cuisineList = listOf("Modern Coastal", "South Indian Gourmet", "Progressive Indian"),
      primaryVibe = "Aesthetic Retro Bar",
      priceLevel = PriceLevel.PREMIUM,
      approxCostForTwo = 2200,
      rating = 4.7,
      reviewCount = 1420,
      spiceLevel = 3,
      isPureVeg = false,
      hasOutdoorSeating = true,
      hasRooftop = true,
      servesCraftBeer = false,
      openTiming = "12:00 PM – 11:30 PM",
      signatureDishes = listOf(
        SignatureDish("Ghee Roast Mutton Tacos", "Mangalorean bafat spice masala in tender flaky mini flatbreads", isVeg = false, isSpicy = true, price = "₹520", tasteHighlight = "Fiery ghee roast richness"),
        SignatureDish("Curd Rice Panko Fritters", "Crispy golden croquettes with tempered mustard and curry leaves", isVeg = true, isSpicy = false, price = "₹340", tasteHighlight = "Comfort tart crunch"),
        SignatureDish("Filter Kaapi Cocktail", "Bourbon infused with Chikmagalur dark roast filter decoction", isVeg = true, isSpicy = false, price = "₹490", tasteHighlight = "Roasted chicory aroma")
      ),
      tasteTags = listOf("Ghee Roast", "Modern Coastal", "Filter Coffee", "Cocktail Bar", "Curry Leaf Infused"),
      latitude = 12.9716,
      longitude = 77.6080,
      mapCoordX = 0.52f,
      mapCoordY = 0.48f,
      description = "A playful homage to South Indian drinking culture with elevated regional coastal flavours and retro tropical aesthetics.",
      seatingAreas = listOf("Retro Dining Hall", "Terrace Balcony", "Cocktail Bar Counter"),
      curatedCollectionId = "blr_craft_beer",
      heroDrawableId = R.drawable.img_taste_profile_banner
    ),
    Restaurant(
      id = "blr_ctr",
      name = "Shri Sagar (CTR)",
      city = "Bengaluru",
      neighborhood = "Malleshwaram",
      address = "7th Cross Rd, Margosa Rd, Malleshwaram",
      cuisineList = listOf("South Indian Traditional", "Iconic Breakfast", "Pure Veg"),
      primaryVibe = "Heritage Breakfast Spot",
      priceLevel = PriceLevel.BUDGET,
      approxCostForTwo = 350,
      rating = 4.9,
      reviewCount = 5200,
      spiceLevel = 2,
      isPureVeg = true,
      hasOutdoorSeating = false,
      hasRooftop = false,
      servesCraftBeer = false,
      openTiming = "7:00 AM – 12:30 PM, 4:00 PM – 9:00 PM",
      signatureDishes = listOf(
        SignatureDish("Benne Masala Dosa", "Golden crisp on the outside, pillow soft inside, lavished with white butter", isVeg = true, isSpicy = true, price = "₹120", tasteHighlight = "Cult benne crispness"),
        SignatureDish("Mangalore Bajji & Coconut Chutney", "Fluffy fried fritters accompanied by freshly grated coconut chutney", isVeg = true, isSpicy = false, price = "₹70", tasteHighlight = "Airy savory warmth"),
        SignatureDish("Degree Filter Coffee", "Frothy brass-tumbler South Indian decoction coffee", isVeg = true, isSpicy = false, price = "₹40", tasteHighlight = "Intense chicory kick")
      ),
      tasteTags = listOf("Pure Veg", "Benne Dosa", "Filter Coffee", "Heritage", "Chutney Heaven"),
      latitude = 13.0031,
      longitude = 77.5694,
      mapCoordX = 0.35f,
      mapCoordY = 0.28f,
      description = "Since the 1920s, the gold standard for Bengaluru's crisp, butter-laden Benne Masala Dosas and aromatic filter coffee.",
      seatingAreas = listOf("Classic Heritage Hall", "Quick Service Hall"),
      curatedCollectionId = "iconic_heritage"
    ),
    Restaurant(
      id = "blr_nagarjuna",
      name = "Nagarjuna Andhra Meals",
      city = "Bengaluru",
      neighborhood = "Residency Road",
      address = "44/1, Residency Rd, Shanthala Nagar",
      cuisineList = listOf("Andhra Cuisine", "Fiery Biryani", "Spicy Thalis"),
      primaryVibe = "Bustling Family Feast",
      priceLevel = PriceLevel.CASUAL,
      approxCostForTwo = 900,
      rating = 4.7,
      reviewCount = 3800,
      spiceLevel = 3,
      isPureVeg = false,
      hasOutdoorSeating = false,
      hasRooftop = false,
      servesCraftBeer = false,
      openTiming = "11:45 AM – 3:45 PM, 6:45 PM – 10:45 PM",
      signatureDishes = listOf(
        SignatureDish("Banana Leaf Andhra Meal", "Steaming Sona Masuri rice, fiery Pappu, Gongura pickle, and Ghee", isVeg = true, isSpicy = true, price = "₹280", tasteHighlight = "Gongura & Gunpowder rush"),
        SignatureDish("Andhra Chilli Chicken", "Marinated with slit green chillies, curry leaves, and secret masala", isVeg = false, isSpicy = true, price = "₹390", tasteHighlight = "High fiery chili heat"),
        SignatureDish("Mutton Shuka Biryani", "Fragrant spiced rice layered with fork-tender slow roasted mutton", isVeg = false, isSpicy = true, price = "₹460", tasteHighlight = "Aromatic meat spices")
      ),
      tasteTags = listOf("Fiery Desi Spice", "Gongura Pickle", "Banana Leaf Thali", "Biryani", "Pure Ghee"),
      latitude = 12.9698,
      longitude = 77.6033,
      mapCoordX = 0.50f,
      mapCoordY = 0.52f,
      description = "The undisputed temple of Andhra spicy feasts in Bengaluru with unlimited rice, hot ghee, and legendary green chilli chicken.",
      seatingAreas = listOf("AC Dining Floor", "Private Banquet"),
      curatedCollectionId = "spicy_trails"
    ),
    Restaurant(
      id = "blr_brik_oven",
      name = "Brik Oven",
      city = "Bengaluru",
      neighborhood = "Church Street",
      address = "Church St, Shanthala Nagar, Ashok Nagar",
      cuisineList = listOf("Artisanal Pizza", "Italian Sourdough", "Dessert Bar"),
      primaryVibe = "Cozy Aesthetic Cafe",
      priceLevel = PriceLevel.CASUAL,
      approxCostForTwo = 1400,
      rating = 4.6,
      reviewCount = 2100,
      spiceLevel = 1,
      isPureVeg = false,
      hasOutdoorSeating = true,
      hasRooftop = false,
      servesCraftBeer = false,
      openTiming = "11:30 AM – 11:00 PM",
      signatureDishes = listOf(
        SignatureDish("The Bird & The Truffle Pizza", "San Marzano tomatoes, fresh smoked scamorza, truffle drizzle", isVeg = false, isSpicy = false, price = "₹620", tasteHighlight = "Charred sourdough crust"),
        SignatureDish("Handmade Burrata Caprese", "Fresh burrata made in-house, basil pesto, heirloom cherry tomatoes", isVeg = true, isSpicy = false, price = "₹480", tasteHighlight = "Creamy cheese silkiness")
      ),
      tasteTags = listOf("Artisanal Sourdough", "Neapolitan Crust", "Church Street Walk", "Aesthetic Cafe"),
      latitude = 12.9744,
      longitude = 77.6074,
      mapCoordX = 0.53f,
      mapCoordY = 0.45f,
      description = "Woodfired Neapolitan sourdough pizza specialists on vibrant Church Street, famous for puffy crusts and creamy fresh burrata.",
      seatingAreas = listOf("Pizzeria Bar", "Window Al Fresco"),
      curatedCollectionId = "blr_craft_beer"
    ),
    Restaurant(
      id = "bom_bombay_canteen",
      name = "The Bombay Canteen",
      city = "Mumbai",
      neighborhood = "Lower Parel",
      address = "Unit-1, Process House, Kamala Mills, Lower Parel",
      cuisineList = listOf("Modern Progressive Indian", "Regional Small Plates", "Craft Cocktails"),
      primaryVibe = "High Energy Gastropub",
      priceLevel = PriceLevel.PREMIUM,
      approxCostForTwo = 2600,
      rating = 4.8,
      reviewCount = 3100,
      spiceLevel = 2,
      isPureVeg = false,
      hasOutdoorSeating = false,
      hasRooftop = false,
      servesCraftBeer = true,
      openTiming = "12:00 PM – 1:00 AM",
      signatureDishes = listOf(
        SignatureDish("Eggs Kejriwal with Truffle", "Toasted brioche, melted white cheddar, green chillies, sunny-side egg", isVeg = false, isSpicy = true, price = "₹490", tasteHighlight = "Melty spicy brunch perfection"),
        SignatureDish("Red Snapper Ceviche Bhel", "Fresh cured fish with raw mango, tamarind glaze, puffed black rice", isVeg = false, isSpicy = false, price = "₹620", tasteHighlight = "Zesty street bhel reimagined"),
        SignatureDish("Canteen Guava Sour", "Tequila, pressed pink guava, chilli-salt rim, jaggery syrup", isVeg = true, isSpicy = true, price = "₹580", tasteHighlight = "Spicy sweet tropical hit")
      ),
      tasteTags = listOf("Modern Progressive", "Kamala Mills", "Craft Cocktails", "Eggs Kejriwal", "Regional Twist"),
      latitude = 19.0062,
      longitude = 72.8277,
      mapCoordX = 0.44f,
      mapCoordY = 0.60f,
      description = "Mumbai's culinary darling showcasing the astonishing depth of Indian regional produce through innovative, nostalgic small plates.",
      seatingAreas = listOf("Main Dining Atrium", "Cocktail Bar", "Chef's Counter"),
      curatedCollectionId = "bom_sundowners",
      heroDrawableId = R.drawable.img_hero_indian_dining
    ),
    Restaurant(
      id = "bom_subko",
      name = "Subko Coffee Roasters & Craftery",
      city = "Mumbai",
      neighborhood = "Bandra West",
      address = "Ground Floor, Chapel Rd, Ranwar, Bandra West",
      cuisineList = listOf("Artisanal Coffee", "Sourdough Bakes", "Craft Podi Toast"),
      primaryVibe = "Aesthetic Heritage Courtyard",
      priceLevel = PriceLevel.CASUAL,
      approxCostForTwo = 1100,
      rating = 4.8,
      reviewCount = 2400,
      spiceLevel = 1,
      isPureVeg = true,
      hasOutdoorSeating = true,
      hasRooftop = false,
      servesCraftBeer = false,
      openTiming = "7:30 AM – 10:00 PM",
      signatureDishes = listOf(
        SignatureDish("Subko Special Pour-over", "Single-origin Karnataka estate beans with notes of passion fruit and cocoa", isVeg = true, isSpicy = false, price = "₹280", tasteHighlight = "Clean bright acidity"),
        SignatureDish("Spiced Podi Sourdough Tartine", "Stone-ground gunpowder butter, labneh, pickled shallots on sourdough", isVeg = true, isSpicy = true, price = "₹390", tasteHighlight = "Gunpowder on rustic crust"),
        SignatureDish("Twice-Baked Almond Croissant", "Laminated artisanal pastry layered with rich frangipane", isVeg = true, isSpicy = false, price = "₹340", tasteHighlight = "Flaky buttery layers")
      ),
      tasteTags = listOf("Artisanal Pour-overs", "Ranwar Village", "Sourdough", "Aesthetic Vibe", "Podi Butter"),
      latitude = 19.0544,
      longitude = 72.8285,
      mapCoordX = 0.42f,
      mapCoordY = 0.38f,
      description = "Tucked in the heritage Ranwar village of Bandra, Subko celebrates subcontinent specialty coffee and sourdough craftsmanship.",
      seatingAreas = listOf("Ranwar Courtyard", "Roastery Loft", "Reading Nook"),
      curatedCollectionId = "aesthetic_cafes"
    ),
    Restaurant(
      id = "bom_trishna",
      name = "Trishna Seafood",
      city = "Mumbai",
      neighborhood = "Fort / Kala Ghoda",
      address = "7, Sai Baba Marg, Kala Ghoda, Fort",
      cuisineList = listOf("Coastal Seafood", "Mangalorean Koliwada", "Iconic Crab"),
      primaryVibe = "Legendary Heritage Dining",
      priceLevel = PriceLevel.PREMIUM,
      approxCostForTwo = 3200,
      rating = 4.7,
      reviewCount = 4100,
      spiceLevel = 3,
      isPureVeg = false,
      hasOutdoorSeating = false,
      hasRooftop = false,
      servesCraftBeer = false,
      openTiming = "12:00 PM – 3:30 PM, 6:00 PM – 12:00 AM",
      signatureDishes = listOf(
        SignatureDish("Butter Garlic Mud Crab", "Giant live mud crab drenched in garlic butter sauce with green chillies", isVeg = false, isSpicy = true, price = "₹1800", tasteHighlight = "Decadent garlic butter crab"),
        SignatureDish("Koliwada Jumbo Prawns", "Crisp battered prawns spiced with carom seed and red chillies", isVeg = false, isSpicy = true, price = "₹780", tasteHighlight = "Koliwada coastal crunch"),
        SignatureDish("Neer Dosa & Fish Curry", "Gossamer soft rice crepes paired with coconut kokum curry", isVeg = false, isSpicy = true, price = "₹480", tasteHighlight = "Tangy kokum comfort")
      ),
      tasteTags = listOf("Butter Garlic Crab", "Coastal Seafood", "Kala Ghoda", "Mangalorean", "Neer Dosa"),
      latitude = 18.9284,
      longitude = 72.8335,
      mapCoordX = 0.48f,
      mapCoordY = 0.82f,
      description = "World-famous for its sensational butter-garlic crab, Trishna has hosted international gourmands and locals alike in South Mumbai.",
      seatingAreas = listOf("Lower Dining Hall", "Upper AC Gallery"),
      curatedCollectionId = "seafood_splurge"
    ),
    Restaurant(
      id = "del_indian_accent",
      name = "Indian Accent",
      city = "Delhi NCR",
      neighborhood = "The Lodhi, CGO Complex",
      address = "The Lodhi, Lodhi Rd, CGO Complex",
      cuisineList = listOf("World Progressive Indian", "Tasting Menus", "Fine Dining"),
      primaryVibe = "Ultra-Chic Fine Dining",
      priceLevel = PriceLevel.LUXURY,
      approxCostForTwo = 6000,
      rating = 4.9,
      reviewCount = 3800,
      spiceLevel = 2,
      isPureVeg = false,
      hasOutdoorSeating = true,
      hasRooftop = false,
      servesCraftBeer = false,
      openTiming = "12:00 PM – 2:30 PM, 7:00 PM – 10:30 PM",
      signatureDishes = listOf(
        SignatureDish("Meetha Achaar Pork Ribs", "Slow braised ribs glazed with sweet mango pickle and sun-dried chillies", isVeg = false, isSpicy = true, price = "₹1450", tasteHighlight = "Tender sweet-spicy glaze"),
        SignatureDish("Blue Cheese Naan Minis", "Warm tandoori naan stuffed with aged Danish blue cheese", isVeg = true, isSpicy = false, price = "₹420", tasteHighlight = "Sharp umami fusion"),
        SignatureDish("Daulat Ki Chaat Souffle", "Delhi's winter morning saffron milk froth elevated with almond brittle", isVeg = true, isSpicy = false, price = "₹650", tasteHighlight = "Ephemeral saffron cloud")
      ),
      tasteTags = listOf("Fine Luxury", "Chef Tasting Menu", "Progressive Indian", "Romantic Candlelight"),
      latitude = 28.5915,
      longitude = 77.2376,
      mapCoordX = 0.52f,
      mapCoordY = 0.54f,
      description = "Consistently ranked among Asia's best restaurants, Chef Manish Mehrotra's masterpiece redefines contemporary Indian haute cuisine.",
      seatingAreas = listOf("Glasshouse Dining", "Waterfront Verandah", "Private Chef Table"),
      curatedCollectionId = "del_fine_dine",
      heroDrawableId = R.drawable.img_hero_indian_dining
    ),
    Restaurant(
      id = "del_karims",
      name = "Karim's Historic Mughlai",
      city = "Delhi NCR",
      neighborhood = "Old Delhi / Jama Masjid",
      address = "Gali Kababian, Jama Masjid, Old Delhi",
      cuisineList = listOf("Old Delhi Mughlai", "Mutton Burra", "Charcoal Kebabs"),
      primaryVibe = "Iconic Street Heritage",
      priceLevel = PriceLevel.CASUAL,
      approxCostForTwo = 1100,
      rating = 4.7,
      reviewCount = 6800,
      spiceLevel = 3,
      isPureVeg = false,
      hasOutdoorSeating = false,
      hasRooftop = false,
      servesCraftBeer = false,
      openTiming = "11:00 AM – 1:00 AM",
      signatureDishes = listOf(
        SignatureDish("Mutton Burra Kebab", "Tender ribs marinated overnight in black cumin, mace and cooked over live coals", isVeg = false, isSpicy = true, price = "₹580", tasteHighlight = "Smoky charcoal char"),
        SignatureDish("Shahi Mutton Korma & Khamiri Roti", "Royal slow-simmered rich gravy paired with fluffy leavened bread", isVeg = false, isSpicy = true, price = "₹490", tasteHighlight = "Kewra & brown onion depth"),
        SignatureDish("Badam Kheer", "Chilled thickened milk dessert studded with blanched almonds and saffron", isVeg = true, isSpicy = false, price = "₹120", tasteHighlight = "Cardamom creaminess")
      ),
      tasteTags = listOf("Old Delhi Trail", "Mutton Burra", "Charcoal Tandoor", "Khamiri Roti", "Mughlai Heritage"),
      latitude = 28.6507,
      longitude = 77.2334,
      mapCoordX = 0.50f,
      mapCoordY = 0.32f,
      description = "Founded in 1913 by royal chefs of the Mughal court, this historic enclave serves unforgettable kebabs in the lanes of Shahjahanabad.",
      seatingAreas = listOf("Historic Courtyard Rooms", "Family Dining Hall"),
      curatedCollectionId = "old_delhi_kebabs"
    ),
    Restaurant(
      id = "del_cafe_lota",
      name = "Café Lota",
      city = "Delhi NCR",
      neighborhood = "Pragati Maidan",
      address = "National Crafts Museum, Bhairon Marg, Pragati Maidan",
      cuisineList = listOf("Pan-Indian Regional", "Contemporary Chaat", "Heritage Crafts"),
      primaryVibe = "Aesthetic Garden Courtyard",
      priceLevel = PriceLevel.CASUAL,
      approxCostForTwo = 1200,
      rating = 4.8,
      reviewCount = 3400,
      spiceLevel = 2,
      isPureVeg = false,
      hasOutdoorSeating = true,
      hasRooftop = false,
      servesCraftBeer = false,
      openTiming = "8:00 AM – 9:30 PM",
      signatureDishes = listOf(
        SignatureDish("Palak Patta Chaat", "Crisp gram-flour coated spinach leaves with sweetened curd, mint and sonth", isVeg = true, isSpicy = false, price = "₹310", tasteHighlight = "Crisp sweet-sour chaat"),
        SignatureDish("Kathal Biryani", "Jackfruit layered with Basmati rice, mint, saffron, and caramelised onions", isVeg = true, isSpicy = true, price = "₹440", tasteHighlight = "Earthy meat-like jackfruit"),
        SignatureDish("Apple Jalebi with Rabri", "Sliced Himachal apples crisped in jalebi batter with velvety reduced milk", isVeg = true, isSpicy = false, price = "₹280", tasteHighlight = "Fruity tart jalebi")
      ),
      tasteTags = listOf("Garden Courtyard", "Palak Patta Chaat", "Pan-Indian Regional", "Museum Vibe"),
      latitude = 28.6146,
      longitude = 77.2415,
      mapCoordX = 0.54f,
      mapCoordY = 0.46f,
      description = "Nestled inside the National Crafts Museum, Café Lota celebrates diverse tribal and regional culinary recipes in a serene bamboo courtyard.",
      seatingAreas = listOf("Museum Bamboo Courtyard", "Canopy Garden"),
      curatedCollectionId = "aesthetic_cafes"
    ),
    Restaurant(
      id = "goa_gunpowder",
      name = "Gunpowder Peninsular Kitchen",
      city = "Goa",
      neighborhood = "Assagao",
      address = "Saunto Vaddo, Assagao, Bardez",
      cuisineList = listOf("South Indian Coastal", "Kerala & Tamil Delicacies", "Goan Vibe"),
      primaryVibe = "Tropical Garden Bungalow",
      priceLevel = PriceLevel.CASUAL,
      approxCostForTwo = 1700,
      rating = 4.8,
      reviewCount = 2900,
      spiceLevel = 3,
      isPureVeg = false,
      hasOutdoorSeating = true,
      hasRooftop = false,
      servesCraftBeer = true,
      openTiming = "12:00 PM – 3:30 PM, 7:00 PM – 11:00 PM",
      signatureDishes = listOf(
        SignatureDish("Kerala Buff / Pepper Fry", "Spicy dry roasted tender morsels with coconut slivers and curry leaves", isVeg = false, isSpicy = true, price = "₹490", tasteHighlight = "Black pepper & roasted coconut"),
        SignatureDish("Malabar Parotta & Egg Appam", "Multi-layered flaky parottas with lace-bordered fermented appams", isVeg = true, isSpicy = false, price = "₹90", tasteHighlight = "Warm buttery flaky folds"),
        SignatureDish("Pineapple Pachadi & Stew", "Sweet pineapple in tempered yoghurt paired with fragrant coconut vegetable stew", isVeg = true, isSpicy = false, price = "₹360", tasteHighlight = "Velvety spiced coconut milk")
      ),
      tasteTags = listOf("Assagao Courtyard", "Malabar Parotta", "Black Pepper Fry", "Tropical Cocktails"),
      latitude = 15.5901,
      longitude = 73.7842,
      mapCoordX = 0.46f,
      mapCoordY = 0.40f,
      description = "An iconic Portuguese villa in Assagao serving bold, rustic peninsular South Indian dishes under swaying mango trees.",
      seatingAreas = listOf("Open Courtyard", "Portuguese Verandah", "Garden Bar"),
      curatedCollectionId = "goa_coastal",
      heroDrawableId = R.drawable.img_taste_profile_banner
    ),
    Restaurant(
      id = "hyd_shah_ghouse",
      name = "Shah Ghouse Spl Biryani",
      city = "Hyderabad",
      neighborhood = "Tolichowki / Charminar",
      address = "Near Flyover, Tolichowki, Hyderabad",
      cuisineList = listOf("Hyderabadi Dum Biryani", "Mutton Haleem", "Nihari"),
      primaryVibe = "Legendary Biryani Hub",
      priceLevel = PriceLevel.BUDGET,
      approxCostForTwo = 700,
      rating = 4.8,
      reviewCount = 7400,
      spiceLevel = 3,
      isPureVeg = false,
      hasOutdoorSeating = false,
      hasRooftop = false,
      servesCraftBeer = false,
      openTiming = "11:30 AM – 1:30 AM",
      signatureDishes = listOf(
        SignatureDish("Special Mutton Dum Biryani", "Fragrant long-grain rice slow-cooked in handi with tender marinated meat", isVeg = false, isSpicy = true, price = "₹380", tasteHighlight = "Saffron potali aroma"),
        SignatureDish("Hyderabadi Shahi Haleem", "Pounded wheat, lentils and goat meat simmered for 12 hours with pure ghee", isVeg = false, isSpicy = true, price = "₹260", tasteHighlight = "Velvety ghee richness"),
        SignatureDish("Double Ka Meetha", "Fried bread soaked in saffron infused rabri and cardamom syrup", isVeg = true, isSpicy = false, price = "₹110", tasteHighlight = "Decadent royal sweet")
      ),
      tasteTags = listOf("Dum Biryani", "Haleem", "Mirchi Ka Salan", "Midnight Food", "Spicy Rice"),
      latitude = 17.3995,
      longitude = 78.4124,
      mapCoordX = 0.48f,
      mapCoordY = 0.55f,
      description = "The pilgrimage spot for bona fide Hyderabadi Dum Biryani lovers, bursting with aromatic whole spices, saffron and tender mutton.",
      seatingAreas = listOf("Grand AC Dining", "Family Enclosure"),
      curatedCollectionId = "spicy_trails"
    ),
    Restaurant(
      id = "kol_peter_cat",
      name = "Peter Cat",
      city = "Kolkata",
      neighborhood = "Park Street",
      address = "18A, Park Street, Kolkata",
      cuisineList = listOf("Continental Heritage", "Chelo Kebab", "Club Cocktails"),
      primaryVibe = "Colonial Heritage Club",
      priceLevel = PriceLevel.CASUAL,
      approxCostForTwo = 1300,
      rating = 4.7,
      reviewCount = 5900,
      spiceLevel = 1,
      isPureVeg = false,
      hasOutdoorSeating = false,
      hasRooftop = false,
      servesCraftBeer = false,
      openTiming = "11:00 AM – 11:00 PM",
      signatureDishes = listOf(
        SignatureDish("The Iconic Chelo Kebab", "Charcoal minced mutton seekh and chicken kebab served with buttered rice, poached egg", isVeg = false, isSpicy = false, price = "₹480", tasteHighlight = "Melting butter & char kebab"),
        SignatureDish("Sizzling Prawn Cocktail", "Fresh Bay of Bengal prawns tossed in a tangy Marie Rose sauce", isVeg = false, isSpicy = false, price = "₹420", tasteHighlight = "Zesty colonial classic")
      ),
      tasteTags = listOf("Chelo Kebab", "Park Street", "Heritage Club", "Buttered Rice", "Old Kolkata"),
      latitude = 22.5517,
      longitude = 88.3524,
      mapCoordX = 0.52f,
      mapCoordY = 0.50f,
      description = "Kolkata's most legendary dining institution on Park Street, famous for dimmed golden lighting and the iconic Iranian Chelo Kebab.",
      seatingAreas = listOf("Retro Leather Booths", "Colonial Balcony"),
      curatedCollectionId = "iconic_heritage"
    )
  )

  val curatedCollections: List<CuratedCollection> = listOf(
    CuratedCollection(
      id = "blr_craft_beer",
      title = "Bengaluru Craft Breweries & Sourdough Trail",
      subtitle = "Microbreweries, rooftop sundowners, and Neapolitan bakes",
      city = "Bengaluru",
      iconEmoji = "🍺",
      restaurantIds = listOf("blr_toit", "blr_permit_room", "blr_brik_oven"),
      tasteDescription = "Crisp craft ales, smoky woodfired sourdough, and southern spice cocktail pairings."
    ),
    CuratedCollection(
      id = "spicy_trails",
      title = "Fiery Masala & Authentic Biryani Quest",
      subtitle = "High spice tolerance only: Gongura, Dum Biryanis & Ghee Roast",
      city = "All India",
      iconEmoji = "🌶️",
      restaurantIds = listOf("blr_nagarjuna", "hyd_shah_ghouse", "blr_permit_room"),
      tasteDescription = "Intense desi heat, pure cow ghee, green chillies, and aromatic slow-cooked biryani."
    ),
    CuratedCollection(
      id = "aesthetic_cafes",
      title = "Artisanal Pour-overs & Garden Courtyards",
      subtitle = "Chic aesthetic cafes, single-origin roasts, and quiet work spaces",
      city = "All India",
      iconEmoji = "☕",
      restaurantIds = listOf("bom_subko", "del_cafe_lota", "goa_gunpowder"),
      tasteDescription = "Bright single-origin coffees, handmade sourdough, and serene open-air courtyards."
    ),
    CuratedCollection(
      id = "iconic_heritage",
      title = "Legendary Heritage Trails & Nostalgic Institutions",
      subtitle = "Over 75+ years of cult food status across India",
      city = "All India",
      iconEmoji = "🏛️",
      restaurantIds = listOf("blr_ctr", "del_karims", "kol_peter_cat", "bom_trishna"),
      tasteDescription = "Timeless classics unchanged for generations—crisp benne dosas, charcoal kebabs, and chelo rice."
    )
  )

  // Observe User Profile from DB or fallback
  val userProfileFlow: Flow<UserProfile> = prefsDao.getUserPreferences().map { entity ->
    if (entity == null) {
      UserProfile()
    } else {
      UserProfile(
        userName = entity.userName,
        userCity = entity.userCity,
        spiceTolerance = entity.spiceTolerance,
        dietaryPreference = runCatching { DietaryType.valueOf(entity.dietaryPreference) }.getOrDefault(DietaryType.ANY),
        favoriteCuisines = entity.favoriteCuisinesJson.split(",").filter { it.isNotBlank() }.toSet(),
        favoriteVibes = entity.favoriteVibesJson.split(",").filter { it.isNotBlank() }.toSet(),
        tastePersona = entity.tastePersona,
        ratedDishCount = entity.ratedDishCount
      )
    }
  }

  // Observe Saved IDs
  val savedRestaurantIdsFlow: Flow<List<String>> = savedDao.getSavedRestaurantIds()

  // Calculate dynamic Taste Match Score for any restaurant given user's taste genome
  fun calculateTasteMatchScore(restaurant: Restaurant, profile: UserProfile): Int {
    var score = 65

    // Dietary Match
    when (profile.dietaryPreference) {
      DietaryType.PURE_VEG -> {
        if (restaurant.isPureVeg) score += 20 else score -= 40
      }
      DietaryType.EGGETARIAN -> {
        if (restaurant.isPureVeg || restaurant.signatureDishes.any { it.isVeg }) score += 10
      }
      else -> {
        score += 8
      }
    }

    // Spice Tolerance alignment
    val spiceDiff = abs(restaurant.spiceLevel - profile.spiceTolerance)
    when (spiceDiff) {
      0 -> score += 12
      1 -> score += 4
      else -> score -= 10
    }

    // Cuisine Overlap
    val cuisineMatches = restaurant.cuisineList.count { cuisine ->
      profile.favoriteCuisines.any { fav -> cuisine.contains(fav, ignoreCase = true) || fav.contains(cuisine, ignoreCase = true) }
    }
    score += (cuisineMatches * 6)

    // Vibe Overlap
    if (profile.favoriteVibes.any { favVibe -> restaurant.primaryVibe.contains(favVibe, ignoreCase = true) }) {
      score += 10
    }

    // Bonus for high ratings
    if (restaurant.rating >= 4.7) score += 4

    return score.coerceIn(52, 99)
  }

  suspend fun toggleSaveRestaurant(restaurantId: String, isCurrentlySaved: Boolean) {
    if (isCurrentlySaved) {
      savedDao.unsaveRestaurant(restaurantId)
      supabaseService.syncBookmarkToCloud(restaurantId, false)
    } else {
      savedDao.saveRestaurant(SavedRestaurantEntity(restaurantId = restaurantId))
      supabaseService.syncBookmarkToCloud(restaurantId, true)
    }
  }

  suspend fun recordTasteFeedback(dishName: String, isLoved: Boolean, restaurantId: String?) {
    feedbackDao.insertFeedback(
      TasteFeedbackEntity(
        dishOrCuisine = dishName,
        isPositive = isLoved,
        restaurantId = restaurantId
      )
    )
    // Update user rated count and adapt persona
    val currentEntity = prefsDao.getUserPreferences()
    // We can update the persona dynamically
  }

  suspend fun updateUserTaste(
    name: String,
    city: String,
    spice: Int,
    dietary: DietaryType,
    cuisines: Set<String>,
    vibes: Set<String>
  ) {
    val persona = deriveTastePersona(city, spice, dietary, cuisines, vibes)
    val entity = UserPreferencesEntity(
      id = 1,
      userName = name,
      userCity = city,
      spiceTolerance = spice,
      dietaryPreference = dietary.name,
      favoriteCuisinesJson = cuisines.joinToString(","),
      favoriteVibesJson = vibes.joinToString(","),
      tastePersona = persona,
      ratedDishCount = 14
    )
    prefsDao.saveUserPreferences(entity)
    val updatedProfile = UserProfile(
      userName = name,
      userCity = city,
      spiceTolerance = spice,
      dietaryPreference = dietary,
      favoriteCuisines = cuisines,
      favoriteVibes = vibes,
      tastePersona = persona,
      ratedDishCount = 14
    )
    supabaseService.syncUserProfileToCloud(updatedProfile)
  }

  suspend fun askPalateAdvisor(question: String, profile: UserProfile, restaurants: List<Restaurant>): String {
    return palateAiEngine.askPalateAdvisor(question, profile, restaurants)
  }

  suspend fun explainPalateMatch(restaurant: Restaurant, profile: UserProfile, score: Int): String {
    return palateAiEngine.explainPalateMatch(restaurant, profile, score)
  }

  // Flow of cached recommendations from Room
  val cachedRestaurantsFlow: Flow<List<com.example.data.local.entities.RestaurantEntity>> =
    restaurantDao.getAllCachedRestaurants()

  suspend fun cacheRestaurantRecommendations(restaurants: List<Restaurant>, profile: UserProfile) {
    val entities = restaurants.map { r ->
      com.example.data.local.entities.RestaurantEntity(
        id = r.id,
        name = r.name,
        city = r.city,
        neighborhood = r.neighborhood,
        address = r.address,
        cuisines = r.cuisineList.joinToString(", "),
        primaryVibe = r.primaryVibe,
        priceSymbol = r.priceLevel.symbol,
        approxCostForTwo = r.approxCostForTwo,
        rating = r.rating,
        reviewCount = r.reviewCount,
        spiceLevel = r.spiceLevel,
        isPureVeg = r.isPureVeg,
        hasOutdoorSeating = r.hasOutdoorSeating,
        hasRooftop = r.hasRooftop,
        servesCraftBeer = r.servesCraftBeer,
        openTiming = r.openTiming,
        tasteTags = r.tasteTags.joinToString(", "),
        description = r.description,
        recommendedMatchScore = calculateTasteMatchScore(r, profile)
      )
    }
    restaurantDao.insertRestaurants(entities)
  }

  suspend fun clearCachedRestaurants() {
    restaurantDao.clearAll()
  }

  private fun deriveTastePersona(
    city: String,
    spice: Int,
    dietary: DietaryType,
    cuisines: Set<String>,
    vibes: Set<String>
  ): String {
    return when {
      dietary == DietaryType.PURE_VEG -> "Pure Veg Gourmand & Street Food Aficionado"
      spice >= 3 && cuisines.any { it.contains("South", true) || it.contains("Andhra", true) } -> "Fiery Podi & Ghee Roast Connoisseur"
      vibes.any { it.contains("Brewery", true) } -> "Indiranagar Craft Ale & Sourdough Hunter"
      city == "Mumbai" -> "Bandra Sunset Sundowner & Seafood Maven"
      city == "Delhi NCR" -> "Old Delhi Kebab & Heritage Epicure"
      cuisines.any { it.contains("Modern", true) || it.contains("Progressive", true) } -> "Modern Progressive Gastronomy Seeker"
      else -> "Curious Indian Flavor Explorer"
    }
  }
}

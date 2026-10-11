package com.example.data.model

data class Booking(
  val id: String,
  val restaurantId: String,
  val restaurantName: String,
  val restaurantNeighborhood: String,
  val city: String,
  val bookingDate: String,
  val timeSlot: String,
  val guests: Int,
  val seatingArea: String,
  val specialRequests: String,
  val guestName: String,
  val guestPhone: String,
  val status: String = "CONFIRMED",
  val bookingCode: String,
  val createdAt: Long = System.currentTimeMillis()
)

data class UserProfile(
  val userName: String = "Aayush Sharma",
  val userCity: String = "Bengaluru",
  val spiceTolerance: Int = 2, // 1 to 3
  val dietaryPreference: DietaryType = DietaryType.ANY,
  val favoriteCuisines: Set<String> = setOf("South Indian Gourmet", "Craft Breweries", "Coastal Seafood", "Modern Progressive"),
  val favoriteVibes: Set<String> = setOf("Craft Brewery", "Aesthetic Courtyard", "Chic Rooftop"),
  val preferredBudget: Set<PriceLevel> = setOf(PriceLevel.CASUAL, PriceLevel.PREMIUM),
  val tastePersona: String = "Indiranagar Brewer & Podi Explorer",
  val ratedDishCount: Int = 12
)

data class CuratedCollection(
  val id: String,
  val title: String,
  val subtitle: String,
  val city: String,
  val iconEmoji: String,
  val restaurantIds: List<String>,
  val tasteDescription: String
)

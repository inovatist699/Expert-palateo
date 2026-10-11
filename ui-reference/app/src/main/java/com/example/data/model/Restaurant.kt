package com.example.data.model

import androidx.annotation.DrawableRes

enum class PriceLevel(val symbol: String, val label: String) {
  BUDGET("₹", "Budget Friendly (₹500 for two)"),
  CASUAL("₹₹", "Smart Casual (₹1,200 for two)"),
  PREMIUM("₹₹₹", "Premium Dining (₹2,400 for two)"),
  LUXURY("₹₹₹₹", "Fine Luxury (₹4,500+ for two)")
}

enum class DietaryType(val label: String, val badge: String) {
  ANY("Any Food", "✨ All"),
  PURE_VEG("Pure Vegetarian", "🌱 Pure Veg"),
  EGGETARIAN("Eggetarian", "🥚 Eggitarian"),
  NON_VEG("Non-Veg Friendly", "🍗 Non-Veg")
}

data class SignatureDish(
  val name: String,
  val description: String,
  val isVeg: Boolean,
  val isSpicy: Boolean,
  val price: String,
  val tasteHighlight: String
)

data class Restaurant(
  val id: String,
  val name: String,
  val city: String,
  val neighborhood: String,
  val address: String,
  val cuisineList: List<String>,
  val primaryVibe: String,
  val priceLevel: PriceLevel,
  val approxCostForTwo: Int,
  val rating: Double,
  val reviewCount: Int,
  val spiceLevel: Int, // 1 = mild, 2 = medium, 3 = fiery
  val isPureVeg: Boolean,
  val hasOutdoorSeating: Boolean,
  val hasRooftop: Boolean,
  val servesCraftBeer: Boolean,
  val openTiming: String,
  val signatureDishes: List<SignatureDish>,
  val tasteTags: List<String>,
  val latitude: Double,
  val longitude: Double,
  val mapCoordX: Float, // 0.0 to 1.0 relative to city canvas
  val mapCoordY: Float, // 0.0 to 1.0 relative to city canvas
  val description: String,
  val seatingAreas: List<String>,
  val curatedCollectionId: String? = null,
  @DrawableRes val heroDrawableId: Int? = null
)

package com.example.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "bookings")
data class BookingEntity(
  @PrimaryKey val id: String,
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
  val status: String,
  val bookingCode: String,
  val createdAt: Long
)

@Entity(tableName = "saved_restaurants")
data class SavedRestaurantEntity(
  @PrimaryKey val restaurantId: String,
  val savedAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "taste_feedback")
data class TasteFeedbackEntity(
  @PrimaryKey(autoGenerate = true) val id: Long = 0,
  val dishOrCuisine: String,
  val isPositive: Boolean, // true = loved, false = not for me
  val restaurantId: String? = null,
  val timestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "user_preferences")
data class UserPreferencesEntity(
  @PrimaryKey val id: Int = 1,
  val userName: String,
  val userCity: String,
  val spiceTolerance: Int,
  val dietaryPreference: String,
  val favoriteCuisinesJson: String,
  val favoriteVibesJson: String,
  val tastePersona: String,
  val ratedDishCount: Int
)

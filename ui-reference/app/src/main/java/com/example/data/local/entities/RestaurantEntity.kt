package com.example.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Room Entity to store cached restaurant recommendations.
 */
@Entity(tableName = "cached_restaurants")
data class RestaurantEntity(
  @PrimaryKey val id: String,
  val name: String,
  val city: String,
  val neighborhood: String,
  val address: String,
  val cuisines: String,
  val primaryVibe: String,
  val priceSymbol: String,
  val approxCostForTwo: Int,
  val rating: Double,
  val reviewCount: Int,
  val spiceLevel: Int,
  val isPureVeg: Boolean,
  val hasOutdoorSeating: Boolean,
  val hasRooftop: Boolean,
  val servesCraftBeer: Boolean,
  val openTiming: String,
  val tasteTags: String,
  val description: String,
  val recommendedMatchScore: Int = 0,
  val cachedAt: Long = System.currentTimeMillis()
)

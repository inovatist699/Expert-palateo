package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.example.data.local.ZestDatabase
import com.example.data.local.entities.RestaurantEntity
import com.example.data.model.DietaryType
import com.example.data.model.UserProfile
import com.example.data.repository.ZestRepository
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ExampleRobolectricTest {

  @Test
  fun `read string from context`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val appName = context.getString(R.string.app_name)
    assertEquals("Palateo", appName)
  }

  @Test
  fun `verify restaurant list and taste match score`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val repository = ZestRepository(context)
    val restaurants = repository.allRestaurants
    assertTrue("Should contain curated Indian restaurants", restaurants.isNotEmpty())

    val sampleProfile = UserProfile(
      spiceTolerance = 2,
      dietaryPreference = DietaryType.ANY,
      favoriteCuisines = setOf("Craft Breweries")
    )

    val toit = restaurants.first { it.id == "blr_toit" }
    val score = repository.calculateTasteMatchScore(toit, sampleProfile)
    assertTrue("Taste match score should be between 50 and 100", score in 50..100)
  }

  @Test
  fun `verify restaurant dao caching and retrieval`() = runBlocking {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val database = ZestDatabase.getDatabase(context)
    val restaurantDao = database.restaurantDao()

    val testEntity = RestaurantEntity(
      id = "test_blr_toit",
      name = "Toit Brewpub",
      city = "Bengaluru",
      neighborhood = "Indiranagar",
      address = "100 Feet Road",
      cuisines = "Craft Breweries, Woodfired Pizza",
      primaryVibe = "Lively Craft Brewery",
      priceSymbol = "₹₹",
      approxCostForTwo = 1800,
      rating = 4.8,
      reviewCount = 2840,
      spiceLevel = 2,
      isPureVeg = false,
      hasOutdoorSeating = true,
      hasRooftop = true,
      servesCraftBeer = true,
      openTiming = "12:00 PM – 1:00 AM",
      tasteTags = "Craft Beers, Podi Crunch",
      description = "Bengaluru legendary microbrewery",
      recommendedMatchScore = 96
    )

    restaurantDao.insertRestaurant(testEntity)

    val retrieved = restaurantDao.getRestaurantById("test_blr_toit")
    assertNotNull(retrieved)
    assertEquals("Toit Brewpub", retrieved?.name)
    assertEquals("Bengaluru", retrieved?.city)
    assertEquals(96, retrieved?.recommendedMatchScore)

    val allCached = restaurantDao.getAllCachedRestaurants().first()
    assertTrue(allCached.any { it.id == "test_blr_toit" })
  }
}

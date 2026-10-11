package com.example.data.ai

import com.example.BuildConfig
import com.example.data.model.Restaurant
import com.example.data.model.UserProfile
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class PalateAiEngine {
  private val client = OkHttpClient.Builder()
    .connectTimeout(30, TimeUnit.SECONDS)
    .readTimeout(60, TimeUnit.SECONDS)
    .writeTimeout(30, TimeUnit.SECONDS)
    .build()

  private val modelName = "gemini-3.5-flash"
  private val baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/$modelName:generateContent"

  suspend fun askPalateAdvisor(
    question: String,
    userProfile: UserProfile,
    nearbyRestaurants: List<Restaurant>
  ): String = withContext(Dispatchers.IO) {
    val apiKey = BuildConfig.GEMINI_API_KEY

    // Fallback if API key is unconfigured placeholder
    if (apiKey.isBlank() || apiKey == "MY_GEMINI_API_KEY") {
      return@withContext generateLocalPalateAdvice(question, userProfile, nearbyRestaurants)
    }

    try {
      val systemPrompt = buildSystemPrompt(userProfile, nearbyRestaurants)
      val jsonBody = JSONObject().apply {
        put("contents", JSONArray().apply {
          put(JSONObject().apply {
            put("parts", JSONArray().apply {
              put(JSONObject().put("text", question))
            })
          })
        })
        put("systemInstruction", JSONObject().apply {
          put("parts", JSONArray().apply {
            put(JSONObject().put("text", systemPrompt))
          })
        })
      }

      val request = Request.Builder()
        .url("$baseUrl?key=$apiKey")
        .post(jsonBody.toString().toRequestBody("application/json".toMediaType()))
        .build()

      val response = client.newCall(request).execute()
      val responseBodyString = response.body?.string() ?: ""

      if (response.isSuccessful) {
        val root = JSONObject(responseBodyString)
        val candidates = root.optJSONArray("candidates")
        val firstCandidate = candidates?.optJSONObject(0)
        val content = firstCandidate?.optJSONObject("content")
        val parts = content?.optJSONArray("parts")
        val text = parts?.optJSONObject(0)?.optString("text")

        if (!text.isNullOrBlank()) {
          return@withContext text.trim()
        }
      }

      // If call returned an error or empty text, gracefully fall back to local rule engine
      generateLocalPalateAdvice(question, userProfile, nearbyRestaurants)
    } catch (e: Exception) {
      generateLocalPalateAdvice(question, userProfile, nearbyRestaurants)
    }
  }

  suspend fun explainPalateMatch(
    restaurant: Restaurant,
    userProfile: UserProfile,
    score: Int
  ): String = withContext(Dispatchers.IO) {
    val apiKey = BuildConfig.GEMINI_API_KEY

    if (apiKey.isBlank() || apiKey == "MY_GEMINI_API_KEY") {
      return@withContext generateLocalExplanation(restaurant, userProfile, score)
    }

    try {
      val prompt = """
        User Palate Profile:
        - Spice Tolerance: ${userProfile.spiceTolerance}/3
        - Dietary Philosophy: ${userProfile.dietaryPreference.label}
        - Favorite Cuisines: ${userProfile.favoriteCuisines.joinToString(", ")}
        - Preferred Vibes: ${userProfile.favoriteVibes.joinToString(", ")}
        - Taste Persona: ${userProfile.tastePersona}

        Restaurant:
        - Name: ${restaurant.name} (${restaurant.neighborhood}, ${restaurant.city})
        - Cuisines: ${restaurant.cuisineList.joinToString(", ")}
        - Primary Vibe: ${restaurant.primaryVibe}
        - Spice Level: ${restaurant.spiceLevel}/3
        - Signature Dishes: ${restaurant.signatureDishes.joinToString("; ") { "${it.name} (${it.tasteHighlight})" }}
        - Palate Match Score: $score%

        In 2-3 engaging, expert sentences, explain specifically why Palateo's taste AI gave this restaurant a $score% Palate Match for this user. Highlight specific flavors and dish textures that appeal to their palate.
      """.trimIndent()

      val jsonBody = JSONObject().apply {
        put("contents", JSONArray().apply {
          put(JSONObject().apply {
            put("parts", JSONArray().apply {
              put(JSONObject().put("text", prompt))
            })
          })
        })
      }

      val request = Request.Builder()
        .url("$baseUrl?key=$apiKey")
        .post(jsonBody.toString().toRequestBody("application/json".toMediaType()))
        .build()

      val response = client.newCall(request).execute()
      val responseBodyString = response.body?.string() ?: ""

      if (response.isSuccessful) {
        val root = JSONObject(responseBodyString)
        val candidates = root.optJSONArray("candidates")
        val firstCandidate = candidates?.optJSONObject(0)
        val content = firstCandidate?.optJSONObject("content")
        val parts = content?.optJSONArray("parts")
        val text = parts?.optJSONObject(0)?.optString("text")

        if (!text.isNullOrBlank()) {
          return@withContext text.trim()
        }
      }

      generateLocalExplanation(restaurant, userProfile, score)
    } catch (e: Exception) {
      generateLocalExplanation(restaurant, userProfile, score)
    }
  }

  private fun buildSystemPrompt(userProfile: UserProfile, restaurants: List<Restaurant>): String {
    val catalogSummary = restaurants.take(10).joinToString("\n") { r ->
      "- ${r.name} in ${r.neighborhood}, ${r.city}: ${r.cuisineList.joinToString(", ")}, Vibe: ${r.primaryVibe}, Spice: ${r.spiceLevel}/3, Must Order: ${r.signatureDishes.firstOrNull()?.name}"
    }

    return """
      You are Palateo, the elite AI Taste Intelligence Engine for Indian dining and regional gastronomy.
      The user's palate profile:
      - City: ${userProfile.userCity}
      - Persona: ${userProfile.tastePersona}
      - Spice Tolerance: ${userProfile.spiceTolerance}/3 (${if (userProfile.spiceTolerance >= 3) "Fiery Desi Spice Lover" else "Balanced Masala"})
      - Dietary: ${userProfile.dietaryPreference.label}
      - Favorite Cuisines: ${userProfile.favoriteCuisines.joinToString(", ")}
      - Preferred Vibes: ${userProfile.favoriteVibes.joinToString(", ")}

      Known Curated Spots:
      $catalogSummary

      Give concise, flavorful, sensory-rich dining recommendations. Emphasize textures (crunchy podi, velvety ghee roast, charred tandoor smoke, fermented sourdough, delicate appam lace). Keep responses under 120 words.
    """.trimIndent()
  }

  private fun generateLocalPalateAdvice(
    query: String,
    profile: UserProfile,
    restaurants: List<Restaurant>
  ): String {
    val q = query.lowercase()
    val matching = restaurants.filter { r ->
      r.name.lowercase().contains(q) ||
        r.neighborhood.lowercase().contains(q) ||
        r.cuisineList.any { it.lowercase().contains(q) } ||
        r.tasteTags.any { it.lowercase().contains(q) } ||
        r.signatureDishes.any { it.name.lowercase().contains(q) }
    }.ifEmpty {
      restaurants.filter { it.city.equals(profile.userCity, ignoreCase = true) }.take(3)
    }

    val topSpot = matching.firstOrNull() ?: restaurants.first()
    val dish = topSpot.signatureDishes.firstOrNull()?.name ?: "house specialties"

    return "Based on your ${profile.tastePersona} genome in ${profile.userCity}, head to ${topSpot.name} in ${topSpot.neighborhood}. " +
      "It hits a high Palate Match with standout dishes like $dish, complementing your preference for ${topSpot.primaryVibe.lowercase()}."
  }

  private fun generateLocalExplanation(
    restaurant: Restaurant,
    profile: UserProfile,
    score: Int
  ): String {
    val highlights = mutableListOf<String>()
    if (restaurant.spiceLevel == profile.spiceTolerance) {
      highlights.add("hits your preferred spice benchmark (${if (restaurant.spiceLevel >= 3) "fiery Indian heat" else "balanced medium masala"})")
    }
    if (restaurant.tasteTags.any { tag -> profile.favoriteCuisines.any { c -> tag.contains(c, true) || c.contains(tag, true) } }) {
      highlights.add("specializes in regional flavors that align with your flavor affinities")
    }
    if (profile.favoriteVibes.any { restaurant.primaryVibe.contains(it, true) }) {
      highlights.add("offers a ${restaurant.primaryVibe.lowercase()} ambiance matching your dining style")
    }

    val dish = restaurant.signatureDishes.firstOrNull()
    return "Palateo gives this a $score% Palate Match because it ${highlights.joinToString(", and ")}. " +
      "Don't miss the ${dish?.name ?: "signature item"} for its notable ${dish?.tasteHighlight ?: "flavor profile"}."
  }
}

package com.example.data.supabase

import com.example.BuildConfig
import com.example.data.model.UserProfile
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class SupabaseService {
  private val client = OkHttpClient.Builder()
    .connectTimeout(15, TimeUnit.SECONDS)
    .readTimeout(15, TimeUnit.SECONDS)
    .build()

  // Safely extract from BuildConfig or placeholder
  private val supabaseUrl: String = runCatching {
    BuildConfig::class.java.getField("SUPABASE_URL").get(null) as? String ?: ""
  }.getOrDefault("")

  private val supabaseAnonKey: String = runCatching {
    BuildConfig::class.java.getField("SUPABASE_ANON_KEY").get(null) as? String ?: ""
  }.getOrDefault("")

  val isConfigured: Boolean
    get() = supabaseUrl.isNotBlank() &&
      !supabaseUrl.contains("your-project") &&
      supabaseAnonKey.isNotBlank() &&
      !supabaseAnonKey.contains("your-supabase-anon-key")

  suspend fun syncUserProfileToCloud(profile: UserProfile): Boolean = withContext(Dispatchers.IO) {
    if (!isConfigured) return@withContext false

    try {
      val payload = JSONObject().apply {
        put("user_name", profile.userName)
        put("user_city", profile.userCity)
        put("spice_tolerance", profile.spiceTolerance)
        put("dietary_preference", profile.dietaryPreference.name)
        put("favorite_cuisines", profile.favoriteCuisines.joinToString(","))
        put("favorite_vibes", profile.favoriteVibes.joinToString(","))
        put("taste_persona", profile.tastePersona)
        put("updated_at", System.currentTimeMillis())
      }

      val request = Request.Builder()
        .url("$supabaseUrl/rest/v1/palate_profiles")
        .addHeader("apikey", supabaseAnonKey)
        .addHeader("Authorization", "Bearer $supabaseAnonKey")
        .addHeader("Content-Type", "application/json")
        .addHeader("Prefer", "resolution=merge-duplicates")
        .post(payload.toString().toRequestBody("application/json".toMediaType()))
        .build()

      val response = client.newCall(request).execute()
      response.isSuccessful
    } catch (e: Exception) {
      false
    }
  }

  suspend fun syncBookmarkToCloud(restaurantId: String, isSaved: Boolean): Boolean = withContext(Dispatchers.IO) {
    if (!isConfigured) return@withContext false

    try {
      val payload = JSONObject().apply {
        put("restaurant_id", restaurantId)
        put("is_saved", isSaved)
        put("timestamp", System.currentTimeMillis())
      }

      val request = Request.Builder()
        .url("$supabaseUrl/rest/v1/saved_restaurants")
        .addHeader("apikey", supabaseAnonKey)
        .addHeader("Authorization", "Bearer $supabaseAnonKey")
        .addHeader("Content-Type", "application/json")
        .addHeader("Prefer", "resolution=merge-duplicates")
        .post(payload.toString().toRequestBody("application/json".toMediaType()))
        .build()

      val response = client.newCall(request).execute()
      response.isSuccessful
    } catch (e: Exception) {
      false
    }
  }
}

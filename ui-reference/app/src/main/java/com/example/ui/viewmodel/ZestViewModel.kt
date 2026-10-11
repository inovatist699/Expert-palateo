package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.model.CuratedCollection
import com.example.data.model.DietaryType
import com.example.data.model.Restaurant
import com.example.data.model.UserProfile
import com.example.data.repository.ZestRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class PalateTab(val title: String, val testTag: String) {
  MAP("Palate Map", "nav_tab_map"),
  TRAILS("Food Trails", "nav_tab_trails"),
  PALATE_AI("Palate AI", "nav_tab_palate_ai"),
  GENOME("Taste Genome", "nav_tab_genome")
}

data class PalateoUiState(
  val userProfile: UserProfile = UserProfile(),
  val selectedCity: String = "Bengaluru",
  val activeTab: PalateTab = PalateTab.MAP,
  val selectedCategoryFilter: String = "All",
  val searchQuery: String = "",
  val selectedMapRestaurantId: String? = null,
  val activeDetailRestaurant: Restaurant? = null,
  val savedIds: Set<String> = emptySet(),
  val allRestaurants: List<Restaurant> = emptyList(),
  val curatedCollections: List<CuratedCollection> = emptyList(),
  val toastMessage: String? = null,
  // Palate AI Engine State
  val aiQueryText: String = "",
  val aiLatestResponse: String = "",
  val isAiLoading: Boolean = false,
  val aiActiveDetailExplanation: String? = null,
  val isAiDetailLoading: Boolean = false,
  val isSupabaseConnected: Boolean = false
)

class ZestViewModel(application: Application) : AndroidViewModel(application) {
  val repository = ZestRepository(application)

  private val _selectedCity = MutableStateFlow("Bengaluru")
  private val _activeTab = MutableStateFlow(PalateTab.MAP)
  private val _selectedCategoryFilter = MutableStateFlow("All")
  private val _searchQuery = MutableStateFlow("")
  private val _selectedMapRestaurantId = MutableStateFlow<String?>("blr_toit")
  private val _activeDetailRestaurant = MutableStateFlow<Restaurant?>(null)
  private val _toastMessage = MutableStateFlow<String?>(null)

  // AI states
  private val _aiQueryText = MutableStateFlow("")
  private val _aiLatestResponse = MutableStateFlow(
    "Welcome to Palateo AI! Ask me anything about dishes, hidden gems, or culinary comparisons in your city."
  )
  private val _isAiLoading = MutableStateFlow(false)
  private val _aiActiveDetailExplanation = MutableStateFlow<String?>(null)
  private val _isAiDetailLoading = MutableStateFlow(false)

  init {
    // Initial caching of curated catalog recommendations to Room
    viewModelScope.launch {
      repository.cacheRestaurantRecommendations(
        repository.allRestaurants,
        UserProfile()
      )
    }
  }

  val uiState: StateFlow<PalateoUiState> = combine(
    repository.userProfileFlow,
    repository.savedRestaurantIdsFlow,
    _selectedCity,
    _activeTab
  ) { profile, savedIds, city, tab ->
    PalateoUiState(
      userProfile = profile,
      selectedCity = city,
      activeTab = tab,
      selectedCategoryFilter = _selectedCategoryFilter.value,
      searchQuery = _searchQuery.value,
      selectedMapRestaurantId = _selectedMapRestaurantId.value,
      activeDetailRestaurant = _activeDetailRestaurant.value,
      savedIds = savedIds.toSet(),
      allRestaurants = repository.allRestaurants,
      curatedCollections = repository.curatedCollections,
      toastMessage = _toastMessage.value,
      aiQueryText = _aiQueryText.value,
      aiLatestResponse = _aiLatestResponse.value,
      isAiLoading = _isAiLoading.value,
      aiActiveDetailExplanation = _aiActiveDetailExplanation.value,
      isAiDetailLoading = _isAiDetailLoading.value,
      isSupabaseConnected = repository.supabaseService.isConfigured
    )
  }.combine(_selectedCategoryFilter) { state, filter ->
    state.copy(selectedCategoryFilter = filter)
  }.combine(_searchQuery) { state, query ->
    state.copy(searchQuery = query)
  }.combine(_selectedMapRestaurantId) { state, mapId ->
    state.copy(selectedMapRestaurantId = mapId)
  }.combine(_activeDetailRestaurant) { state, detail ->
    state.copy(activeDetailRestaurant = detail)
  }.combine(_aiLatestResponse) { state, aiResp ->
    state.copy(aiLatestResponse = aiResp)
  }.combine(_isAiLoading) { state, loading ->
    state.copy(isAiLoading = loading)
  }.combine(_aiActiveDetailExplanation) { state, explanation ->
    state.copy(aiActiveDetailExplanation = explanation)
  }.combine(_isAiDetailLoading) { state, detailLoading ->
    state.copy(isAiDetailLoading = detailLoading)
  }.combine(_toastMessage) { state, toast ->
    state.copy(toastMessage = toast)
  }.stateIn(
    scope = viewModelScope,
    started = SharingStarted.WhileSubscribed(5000),
    initialValue = PalateoUiState(
      allRestaurants = repository.allRestaurants,
      curatedCollections = repository.curatedCollections
    )
  )

  fun selectTab(tab: PalateTab) {
    _activeTab.value = tab
  }

  fun selectCity(city: String) {
    _selectedCity.value = city
    val firstInCity = repository.allRestaurants.firstOrNull { it.city.equals(city, ignoreCase = true) }
    _selectedMapRestaurantId.value = firstInCity?.id
  }

  fun selectFilter(filter: String) {
    _selectedCategoryFilter.value = filter
  }

  fun setSearchQuery(query: String) {
    _searchQuery.value = query
  }

  fun selectMapRestaurant(id: String?) {
    _selectedMapRestaurantId.value = id
  }

  fun openDetail(restaurant: Restaurant) {
    _activeDetailRestaurant.value = restaurant
    _aiActiveDetailExplanation.value = null
  }

  fun closeDetail() {
    _activeDetailRestaurant.value = null
    _aiActiveDetailExplanation.value = null
  }

  fun clearToast() {
    _toastMessage.value = null
  }

  fun toggleSave(restaurantId: String) {
    viewModelScope.launch {
      val isSaved = uiState.value.savedIds.contains(restaurantId)
      repository.toggleSaveRestaurant(restaurantId, isSaved)
      _toastMessage.value = if (isSaved) "Removed from Saved" else "Saved to Palate Wishlist ❤️"
    }
  }

  fun submitTasteFeedback(dishName: String, isLoved: Boolean, restaurantId: String?) {
    viewModelScope.launch {
      repository.recordTasteFeedback(dishName, isLoved, restaurantId)
      _toastMessage.value = if (isLoved) "Palate AI tuned: Prioritizing $dishName flavors ✨" else "Preference noted for Palate AI"
    }
  }

  fun saveTastePreferences(
    name: String,
    city: String,
    spice: Int,
    dietary: DietaryType,
    cuisines: Set<String>,
    vibes: Set<String>
  ) {
    viewModelScope.launch {
      repository.updateUserTaste(name, city, spice, dietary, cuisines, vibes)
      val updatedProfile = uiState.value.userProfile.copy(
        userName = name,
        userCity = city,
        spiceTolerance = spice,
        dietaryPreference = dietary,
        favoriteCuisines = cuisines,
        favoriteVibes = vibes
      )
      // Recache recommendations in Room with new palate match scores
      repository.cacheRestaurantRecommendations(repository.allRestaurants, updatedProfile)
      _toastMessage.value = "Palate Genome & Matches Calibrated! ✨"
    }
  }

  fun calculatePalateMatchScore(restaurant: Restaurant): Int {
    return repository.calculateTasteMatchScore(restaurant, uiState.value.userProfile)
  }

  // Alias for backward compatibility
  fun calculateMatchScore(restaurant: Restaurant): Int = calculatePalateMatchScore(restaurant)

  // Real Gemini AI consultation
  fun askPalateAi(question: String) {
    if (question.isBlank()) return
    viewModelScope.launch {
      _isAiLoading.value = true
      _aiQueryText.value = question
      val response = repository.askPalateAdvisor(
        question = question,
        profile = uiState.value.userProfile,
        restaurants = getFilteredRestaurants()
      )
      _aiLatestResponse.value = response
      _isAiLoading.value = false
    }
  }

  // Real Gemini AI explanation for a specific restaurant
  fun generateAiExplanationForRestaurant(restaurant: Restaurant) {
    viewModelScope.launch {
      _isAiDetailLoading.value = true
      val score = calculatePalateMatchScore(restaurant)
      val explanation = repository.explainPalateMatch(
        restaurant = restaurant,
        profile = uiState.value.userProfile,
        score = score
      )
      _aiActiveDetailExplanation.value = explanation
      _isAiDetailLoading.value = false
    }
  }

  fun getFilteredRestaurants(): List<Restaurant> {
    val state = uiState.value
    val baseList = state.allRestaurants.filter {
      state.selectedCity.isBlank() || it.city.equals(state.selectedCity, ignoreCase = true)
    }

    val queryFiltered = if (state.searchQuery.isBlank()) {
      baseList
    } else {
      val q = state.searchQuery.trim().lowercase()
      baseList.filter {
        it.name.lowercase().contains(q) ||
          it.neighborhood.lowercase().contains(q) ||
          it.cuisineList.any { c -> c.lowercase().contains(q) } ||
          it.tasteTags.any { t -> t.lowercase().contains(q) } ||
          it.signatureDishes.any { d -> d.name.lowercase().contains(q) }
      }
    }

    return when (state.selectedCategoryFilter) {
      "🔥 90%+ Match" -> queryFiltered.filter { calculatePalateMatchScore(it) >= 90 }
      "Pure Veg 🌱" -> queryFiltered.filter { it.isPureVeg }
      "Rooftops 🌅" -> queryFiltered.filter { it.hasRooftop }
      "Craft Beer 🍺" -> queryFiltered.filter { it.servesCraftBeer }
      "Outdoor 🌿" -> queryFiltered.filter { it.hasOutdoorSeating }
      "High Spice 🌶️" -> queryFiltered.filter { it.spiceLevel >= 3 }
      else -> queryFiltered
    }
  }
}

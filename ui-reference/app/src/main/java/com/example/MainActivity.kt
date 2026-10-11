package com.example

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Explore
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.ui.screens.CuratedCollectionsScreen
import com.example.ui.screens.MapDiscoveryScreen
import com.example.ui.screens.PalateAiScreen
import com.example.ui.screens.RestaurantDetailScreen
import com.example.ui.screens.TasteStudioScreen
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.viewmodel.PalateTab
import com.example.ui.viewmodel.ZestViewModel

class MainActivity : ComponentActivity() {
  private val viewModel: ZestViewModel by viewModels()

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      MyApplicationTheme {
        PalateoApp(viewModel = viewModel)
      }
    }
  }
}

@Composable
fun PalateoApp(viewModel: ZestViewModel) {
  val uiState by viewModel.uiState.collectAsStateWithLifecycle()
  val context = LocalContext.current
  val snackbarHostState = remember { SnackbarHostState() }

  // Handle toast notifications
  LaunchedEffect(uiState.toastMessage) {
    uiState.toastMessage?.let { msg ->
      Toast.makeText(context, msg, Toast.LENGTH_SHORT).show()
      viewModel.clearToast()
    }
  }

  Scaffold(
    modifier = Modifier.fillMaxSize(),
    snackbarHost = { SnackbarHost(snackbarHostState) },
    bottomBar = {
      // Hide bottom bar when viewing a full-screen restaurant detail
      if (uiState.activeDetailRestaurant == null) {
        NavigationBar(
          containerColor = com.example.ui.theme.ZestGunmetalSurface,
          contentColor = com.example.ui.theme.ZestLightBlue,
          tonalElevation = 8.dp,
          modifier = Modifier
            .navigationBarsPadding()
            .testTag("palateo_bottom_navigation_bar")
        ) {
          NavigationBarItem(
            selected = uiState.activeTab == PalateTab.MAP,
            onClick = { viewModel.selectTab(PalateTab.MAP) },
            icon = { Icon(Icons.Default.Map, contentDescription = "Map") },
            label = { Text("Palate Map") },
            colors = NavigationBarItemDefaults.colors(
              selectedIconColor = com.example.ui.theme.ZestPureWhite,
              selectedTextColor = com.example.ui.theme.ZestSaffron,
              unselectedIconColor = com.example.ui.theme.ZestGunmetalMuted,
              unselectedTextColor = com.example.ui.theme.ZestGunmetalMuted,
              indicatorColor = com.example.ui.theme.ZestMoonstone
            ),
            modifier = Modifier.testTag("nav_tab_map")
          )

          NavigationBarItem(
            selected = uiState.activeTab == PalateTab.TRAILS,
            onClick = { viewModel.selectTab(PalateTab.TRAILS) },
            icon = { Icon(Icons.Default.Explore, contentDescription = "Trails") },
            label = { Text("Food Trails") },
            colors = NavigationBarItemDefaults.colors(
              selectedIconColor = com.example.ui.theme.ZestPureWhite,
              selectedTextColor = com.example.ui.theme.ZestSaffron,
              unselectedIconColor = com.example.ui.theme.ZestGunmetalMuted,
              unselectedTextColor = com.example.ui.theme.ZestGunmetalMuted,
              indicatorColor = com.example.ui.theme.ZestMoonstone
            ),
            modifier = Modifier.testTag("nav_tab_trails")
          )

          NavigationBarItem(
            selected = uiState.activeTab == PalateTab.PALATE_AI,
            onClick = { viewModel.selectTab(PalateTab.PALATE_AI) },
            icon = { Icon(Icons.Default.AutoAwesome, contentDescription = "Palate AI") },
            label = { Text("Palate AI") },
            colors = NavigationBarItemDefaults.colors(
              selectedIconColor = com.example.ui.theme.ZestPureWhite,
              selectedTextColor = com.example.ui.theme.ZestSaffron,
              unselectedIconColor = com.example.ui.theme.ZestGunmetalMuted,
              unselectedTextColor = com.example.ui.theme.ZestGunmetalMuted,
              indicatorColor = com.example.ui.theme.ZestMoonstone
            ),
            modifier = Modifier.testTag("nav_tab_palate_ai")
          )

          NavigationBarItem(
            selected = uiState.activeTab == PalateTab.GENOME,
            onClick = { viewModel.selectTab(PalateTab.GENOME) },
            icon = { Icon(Icons.Default.Tune, contentDescription = "Genome") },
            label = { Text("Taste Genome") },
            colors = NavigationBarItemDefaults.colors(
              selectedIconColor = com.example.ui.theme.ZestPureWhite,
              selectedTextColor = com.example.ui.theme.ZestSaffron,
              unselectedIconColor = com.example.ui.theme.ZestGunmetalMuted,
              unselectedTextColor = com.example.ui.theme.ZestGunmetalMuted,
              indicatorColor = com.example.ui.theme.ZestMoonstone
            ),
            modifier = Modifier.testTag("nav_tab_genome")
          )
        }
      }
    }
  ) { innerPadding ->
    Box(
      modifier = Modifier
        .fillMaxSize()
        .padding(innerPadding)
    ) {
      // Main Tab Content
      when (uiState.activeTab) {
        PalateTab.MAP -> {
          MapDiscoveryScreen(
            selectedCity = uiState.selectedCity,
            userProfile = uiState.userProfile,
            restaurants = viewModel.getFilteredRestaurants(),
            selectedRestaurantId = uiState.selectedMapRestaurantId,
            selectedFilter = uiState.selectedCategoryFilter,
            searchQuery = uiState.searchQuery,
            savedIds = uiState.savedIds,
            onCitySelected = { viewModel.selectCity(it) },
            onFilterSelected = { viewModel.selectFilter(it) },
            onSearchQueryChanged = { viewModel.setSearchQuery(it) },
            onRestaurantSelected = { viewModel.selectMapRestaurant(it) },
            onOpenDetail = { viewModel.openDetail(it) },
            onToggleSave = { viewModel.toggleSave(it) },
            matchScoreCalculator = { viewModel.calculatePalateMatchScore(it) }
          )
        }

        PalateTab.TRAILS -> {
          CuratedCollectionsScreen(
            collections = uiState.curatedCollections,
            allRestaurants = uiState.allRestaurants,
            savedIds = uiState.savedIds,
            onOpenDetail = { viewModel.openDetail(it) },
            onToggleSave = { viewModel.toggleSave(it) },
            matchScoreCalculator = { viewModel.calculatePalateMatchScore(it) }
          )
        }

        PalateTab.PALATE_AI -> {
          PalateAiScreen(
            userProfile = uiState.userProfile,
            latestResponse = uiState.aiLatestResponse,
            isLoading = uiState.isAiLoading,
            onAskAi = { viewModel.askPalateAi(it) }
          )
        }

        PalateTab.GENOME -> {
          TasteStudioScreen(
            userProfile = uiState.userProfile,
            isSupabaseConnected = uiState.isSupabaseConnected,
            onSavePreferences = { name, city, spice, dietary, cuisines, vibes ->
              viewModel.saveTastePreferences(name, city, spice, dietary, cuisines, vibes)
            },
            onRecordDishTaste = { dish, isLoved ->
              viewModel.submitTasteFeedback(dish, isLoved, null)
            }
          )
        }
      }

      // Fullscreen Restaurant Detail Overlay
      uiState.activeDetailRestaurant?.let { detailRestaurant ->
        RestaurantDetailScreen(
          restaurant = detailRestaurant,
          userProfile = uiState.userProfile,
          matchScore = viewModel.calculatePalateMatchScore(detailRestaurant),
          isSaved = uiState.savedIds.contains(detailRestaurant.id),
          aiExplanation = uiState.aiActiveDetailExplanation,
          isAiLoading = uiState.isAiDetailLoading,
          onBack = { viewModel.closeDetail() },
          onToggleSave = { viewModel.toggleSave(it) },
          onAskAiBreakdown = { viewModel.generateAiExplanationForRestaurant(it) },
          onRateDish = { dish, isLoved, restId ->
            viewModel.submitTasteFeedback(dish, isLoved, restId)
          }
        )
      }
    }
  }
}

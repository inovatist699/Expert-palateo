package com.example.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.data.model.Restaurant
import com.example.data.model.UserProfile
import com.example.ui.components.ZestMapCanvas
import com.example.ui.theme.ZestGunmetal
import com.example.ui.theme.ZestGunmetalCard
import com.example.ui.theme.ZestGunmetalDark
import com.example.ui.theme.ZestGunmetalDeeper
import com.example.ui.theme.ZestGunmetalMuted
import com.example.ui.theme.ZestGunmetalSurface
import com.example.ui.theme.ZestLightBlue
import com.example.ui.theme.ZestLightBlueContainer
import com.example.ui.theme.ZestLightBlueSoft
import com.example.ui.theme.ZestMoonstone
import com.example.ui.theme.ZestMoonstoneDark
import com.example.ui.theme.ZestOffWhite
import com.example.ui.theme.ZestPureWhite
import com.example.ui.theme.ZestSaffron
import com.example.ui.theme.ZestSaffronContainer
import com.example.ui.theme.ZestSaffronDark

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MapDiscoveryScreen(
  selectedCity: String,
  userProfile: UserProfile,
  restaurants: List<Restaurant>,
  selectedRestaurantId: String?,
  selectedFilter: String,
  searchQuery: String,
  savedIds: Set<String>,
  onCitySelected: (String) -> Unit,
  onFilterSelected: (String) -> Unit,
  onSearchQueryChanged: (String) -> Unit,
  onRestaurantSelected: (String) -> Unit,
  onOpenDetail: (Restaurant) -> Unit,
  onToggleSave: (String) -> Unit,
  matchScoreCalculator: (Restaurant) -> Int,
  modifier: Modifier = Modifier
) {
  val cities = listOf("Bengaluru", "Mumbai", "Delhi NCR", "Goa", "Hyderabad", "Kolkata")
  val filterOptions = listOf(
    "All",
    "🍋 90%+ Match",
    "🍺 Craft Brews",
    "☕ Artisanal Cafes",
    "🌱 Pure Veg",
    "🌅 Rooftops",
    "🌶️ High Spice"
  )

  val listState = rememberLazyListState()

  // Scroll to selected restaurant in carousel when pin is tapped
  LaunchedEffect(selectedRestaurantId) {
    if (selectedRestaurantId != null) {
      val index = restaurants.indexOfFirst { it.id == selectedRestaurantId }
      if (index >= 0) {
        listState.animateScrollToItem(index)
      }
    }
  }

  Box(modifier = modifier.fillMaxSize().testTag("map_discovery_screen")) {
    // 1. Zest Map Interactive Canvas
    ZestMapCanvas(
      city = selectedCity,
      restaurants = restaurants,
      selectedRestaurantId = selectedRestaurantId,
      onRestaurantSelected = onRestaurantSelected,
      matchScoreProvider = matchScoreCalculator,
      modifier = Modifier.fillMaxSize()
    )

    // 2. Top Floating Glassmorphic Header (Zest Maps Signature UI)
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .align(Alignment.TopCenter)
        .background(
          Brush.verticalGradient(
            colors = listOf(
              ZestGunmetalDeeper.copy(alpha = 0.94f),
              ZestGunmetalDark.copy(alpha = 0.82f),
              Color.Transparent
            )
          )
        )
        .padding(top = 40.dp, bottom = 12.dp)
        .padding(horizontal = 16.dp)
    ) {
      // City Selector Scrollable Pills with Saffron Active Glow
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
      ) {
        cities.forEach { city ->
          val isSelected = city == selectedCity
          Surface(
            shape = RoundedCornerShape(20.dp),
            color = if (isSelected) ZestSaffron else ZestGunmetalSurface,
            border = androidx.compose.foundation.BorderStroke(
              width = 1.dp,
              color = if (isSelected) ZestSaffronDark else ZestMoonstone.copy(alpha = 0.35f)
            ),
            modifier = Modifier
              .clickable { onCitySelected(city) }
              .testTag("city_tab_${city.replace(" ", "_")}")
          ) {
            Row(
              modifier = Modifier.padding(horizontal = 14.dp, vertical = 7.dp),
              verticalAlignment = Alignment.CenterVertically
            ) {
              if (isSelected) {
                Text("🍋", fontSize = 12.sp)
                Spacer(modifier = Modifier.width(4.dp))
              }
              Text(
                text = city,
                style = MaterialTheme.typography.labelMedium,
                fontWeight = if (isSelected) FontWeight.ExtraBold else FontWeight.Medium,
                color = if (isSelected) ZestGunmetalDark else ZestLightBlue
              )
            }
          }
        }
      }

      Spacer(modifier = Modifier.height(10.dp))

      // Zest Search Bar Pill
      OutlinedTextField(
        value = searchQuery,
        onValueChange = onSearchQueryChanged,
        placeholder = {
          Text(
            text = "Search dishes, sourdough, biryani, vibes...",
            color = ZestGunmetalMuted,
            fontSize = 14.sp
          )
        },
        leadingIcon = {
          Icon(
            Icons.Default.Search,
            contentDescription = null,
            tint = ZestSaffron,
            modifier = Modifier.size(20.dp)
          )
        },
        trailingIcon = {
          if (searchQuery.isNotEmpty()) {
            IconButton(onClick = { onSearchQueryChanged("") }) {
              Icon(Icons.Default.Clear, contentDescription = "Clear", tint = ZestLightBlue)
            }
          }
        },
        modifier = Modifier
          .fillMaxWidth()
          .testTag("map_search_input"),
        shape = RoundedCornerShape(18.dp),
        colors = OutlinedTextFieldDefaults.colors(
          focusedContainerColor = ZestGunmetalSurface.copy(alpha = 0.95f),
          unfocusedContainerColor = ZestGunmetalSurface.copy(alpha = 0.88f),
          focusedTextColor = ZestPureWhite,
          unfocusedTextColor = ZestOffWhite,
          focusedBorderColor = ZestMoonstone,
          unfocusedBorderColor = ZestGunmetalCard
        ),
        singleLine = true
      )

      Spacer(modifier = Modifier.height(8.dp))

      // Zest Category Filter Pills
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
      ) {
        filterOptions.forEach { filter ->
          val isSelected = filter == selectedFilter || (selectedFilter == "🔥 90%+ Match" && filter.contains("90%"))
          FilterChip(
            selected = isSelected,
            onClick = { onFilterSelected(filter) },
            label = {
              Text(
                text = filter,
                fontSize = 12.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
              )
            },
            colors = FilterChipDefaults.filterChipColors(
              selectedContainerColor = ZestMoonstone,
              selectedLabelColor = ZestPureWhite,
              containerColor = ZestGunmetalSurface.copy(alpha = 0.85f),
              labelColor = ZestLightBlueSoft
            ),
            border = androidx.compose.foundation.BorderStroke(
              width = 1.dp,
              color = if (isSelected) ZestLightBlue else ZestGunmetalCard
            ),
            modifier = Modifier.testTag("filter_chip_${filter.take(4)}")
          )
        }
      }
    }

    // 3. Bottom Carousel of Zest Cards (Synchronized with Map Pins)
    Column(
      modifier = Modifier
        .align(Alignment.BottomCenter)
        .fillMaxWidth()
        .padding(bottom = 16.dp)
    ) {
      if (restaurants.isEmpty()) {
        Card(
          shape = RoundedCornerShape(18.dp),
          colors = CardDefaults.cardColors(containerColor = ZestGunmetalSurface),
          border = androidx.compose.foundation.BorderStroke(1.dp, ZestMoonstone.copy(alpha = 0.3f)),
          modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
        ) {
          Column(
            modifier = Modifier.padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
          ) {
            Text(
              text = "No spots match this filter in $selectedCity",
              style = MaterialTheme.typography.bodyLarge,
              fontWeight = FontWeight.Bold,
              color = ZestLightBlue
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
              text = "Try switching filters or explore another culinary neighborhood",
              style = MaterialTheme.typography.bodySmall,
              color = ZestGunmetalMuted
            )
          }
        }
      } else {
        LazyRow(
          state = listState,
          contentPadding = PaddingValues(horizontal = 16.dp),
          horizontalArrangement = Arrangement.spacedBy(14.dp),
          modifier = Modifier.fillMaxWidth().testTag("map_restaurant_carousel")
        ) {
          items(restaurants, key = { it.id }) { restaurant ->
            val isSelected = restaurant.id == selectedRestaurantId
            val score = matchScoreCalculator(restaurant)
            val isSaved = savedIds.contains(restaurant.id)

            ZestRestaurantCard(
              restaurant = restaurant,
              matchScore = score,
              isSelected = isSelected,
              isSaved = isSaved,
              onCardClick = {
                onRestaurantSelected(restaurant.id)
                onOpenDetail(restaurant)
              },
              onToggleSave = { onToggleSave(restaurant.id) }
            )
          }
        }
      }
    }
  }
}

@Composable
private fun ZestRestaurantCard(
  restaurant: Restaurant,
  matchScore: Int,
  isSelected: Boolean,
  isSaved: Boolean,
  onCardClick: () -> Unit,
  onToggleSave: () -> Unit
) {
  val heroDrawable = restaurant.heroDrawableId ?: R.drawable.img_hero_indian_dining

  Card(
    shape = RoundedCornerShape(20.dp),
    colors = CardDefaults.cardColors(
      containerColor = if (isSelected) ZestGunmetalCard else ZestGunmetalSurface
    ),
    border = androidx.compose.foundation.BorderStroke(
      width = if (isSelected) 2.dp else 1.dp,
      color = if (isSelected) ZestSaffron else ZestMoonstone.copy(alpha = 0.35f)
    ),
    elevation = CardDefaults.cardElevation(if (isSelected) 10.dp else 5.dp),
    modifier = Modifier
      .width(315.dp)
      .clickable(onClick = onCardClick)
      .testTag("map_card_${restaurant.id}")
  ) {
    Column {
      // Card Image with Saffron Match Pill and Bookmark
      Box(
        modifier = Modifier
          .fillMaxWidth()
          .height(125.dp)
      ) {
        Image(
          painter = painterResource(id = heroDrawable),
          contentDescription = restaurant.name,
          modifier = Modifier.fillMaxSize(),
          contentScale = ContentScale.Crop
        )

        // Subtle gradient overlay
        Box(
          modifier = Modifier
            .fillMaxSize()
            .background(
              Brush.verticalGradient(
                colors = listOf(
                  ZestGunmetalDark.copy(alpha = 0.45f),
                  Color.Transparent,
                  ZestGunmetalDark.copy(alpha = 0.85f)
                )
              )
            )
        )

        // Saffron Match Score Badge (Zest Maps Iconic Pill)
        Surface(
          shape = RoundedCornerShape(12.dp),
          color = ZestSaffron,
          shadowElevation = 4.dp,
          modifier = Modifier
            .align(Alignment.TopStart)
            .padding(10.dp)
        ) {
          Row(
            modifier = Modifier.padding(horizontal = 9.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Text(
              text = "⚡ $matchScore%",
              style = MaterialTheme.typography.labelSmall,
              fontWeight = FontWeight.ExtraBold,
              color = ZestGunmetalDark
            )
            Spacer(modifier = Modifier.width(3.dp))
            Text(
              text = "Palate Match",
              style = MaterialTheme.typography.labelSmall,
              fontWeight = FontWeight.SemiBold,
              color = ZestGunmetalDark,
              fontSize = 10.sp
            )
          }
        }

        // Bookmark Pill Icon
        Surface(
          shape = CircleShape,
          color = ZestGunmetalSurface.copy(alpha = 0.8f),
          modifier = Modifier
            .align(Alignment.TopEnd)
            .padding(10.dp)
            .size(32.dp)
        ) {
          IconButton(
            onClick = onToggleSave,
            modifier = Modifier.size(32.dp)
          ) {
            Icon(
              imageVector = if (isSaved) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
              contentDescription = "Save",
              tint = if (isSaved) ZestSaffron else ZestLightBlue,
              modifier = Modifier.size(18.dp)
            )
          }
        }

        // Vibe & Price row on image bottom
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .align(Alignment.BottomStart)
            .padding(horizontal = 12.dp, vertical = 6.dp),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text(
            text = "${restaurant.priceLevel.symbol} • ₹${restaurant.approxCostForTwo} for two",
            style = MaterialTheme.typography.labelSmall,
            color = ZestLightBlue,
            fontWeight = FontWeight.SemiBold
          )
          Surface(
            shape = RoundedCornerShape(6.dp),
            color = ZestMoonstoneDark.copy(alpha = 0.7f)
          ) {
            Text(
              text = restaurant.primaryVibe,
              style = MaterialTheme.typography.labelSmall,
              color = ZestPureWhite,
              modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
              fontSize = 10.sp
            )
          }
        }
      }

      // Card Content
      Column(modifier = Modifier.padding(14.dp)) {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Text(
            text = restaurant.name,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            color = ZestPureWhite,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.weight(1f)
          )
          Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Default.Star, contentDescription = null, tint = ZestSaffron, modifier = Modifier.size(16.dp))
            Spacer(modifier = Modifier.width(3.dp))
            Text(
              text = "${restaurant.rating}",
              style = MaterialTheme.typography.bodySmall,
              fontWeight = FontWeight.Bold,
              color = ZestPureWhite
            )
          }
        }

        Text(
          text = "${restaurant.neighborhood} • ${restaurant.cuisineList.take(2).joinToString(", ")}",
          style = MaterialTheme.typography.bodySmall,
          color = ZestLightBlueSoft,
          maxLines = 1,
          overflow = TextOverflow.Ellipsis
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Must Order Signature Highlight (Zest characteristic)
        val topDish = restaurant.signatureDishes.firstOrNull()
        if (topDish != null) {
          Surface(
            shape = RoundedCornerShape(8.dp),
            color = ZestGunmetalCard,
            border = androidx.compose.foundation.BorderStroke(1.dp, ZestMoonstone.copy(alpha = 0.25f)),
            modifier = Modifier.fillMaxWidth()
          ) {
            Row(
              modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
              verticalAlignment = Alignment.CenterVertically
            ) {
              Text(
                text = "🍋 Must Order: ",
                style = MaterialTheme.typography.labelSmall,
                color = ZestSaffron,
                fontWeight = FontWeight.Bold,
                fontSize = 11.sp
              )
              Text(
                text = topDish.name,
                style = MaterialTheme.typography.labelSmall,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                color = ZestLightBlue,
                fontSize = 11.sp
              )
            }
          }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Action CTA in Zest Moonstone
        Button(
          onClick = onCardClick,
          colors = ButtonDefaults.buttonColors(
            containerColor = ZestMoonstone,
            contentColor = ZestPureWhite
          ),
          shape = RoundedCornerShape(12.dp),
          modifier = Modifier
            .fillMaxWidth()
            .height(40.dp)
            .testTag("card_explore_palate_${restaurant.id}")
        ) {
          Icon(Icons.Default.Restaurant, contentDescription = null, modifier = Modifier.size(16.dp))
          Spacer(modifier = Modifier.width(6.dp))
          Text(
            text = "Explore Palate Breakdown",
            style = MaterialTheme.typography.labelMedium,
            fontWeight = FontWeight.Bold
          )
        }
      }
    }
  }
}

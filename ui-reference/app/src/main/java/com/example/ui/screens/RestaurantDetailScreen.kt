package com.example.ui.screens

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AccessTime
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.ThumbDown
import androidx.compose.material.icons.filled.ThumbUp
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.data.model.Restaurant
import com.example.data.model.UserProfile
import com.example.ui.theme.ZestGunmetal
import com.example.ui.theme.ZestGunmetalCard
import com.example.ui.theme.ZestGunmetalDark
import com.example.ui.theme.ZestGunmetalDeeper
import com.example.ui.theme.ZestGunmetalMuted
import com.example.ui.theme.ZestGunmetalSurface
import com.example.ui.theme.ZestLightBlue
import com.example.ui.theme.ZestLightBlueSoft
import com.example.ui.theme.ZestMoonstone
import com.example.ui.theme.ZestOffWhite
import com.example.ui.theme.ZestPureWhite
import com.example.ui.theme.ZestSaffron
import com.example.ui.theme.ZestSaffronDark

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun RestaurantDetailScreen(
  restaurant: Restaurant,
  userProfile: UserProfile,
  matchScore: Int,
  isSaved: Boolean,
  aiExplanation: String?,
  isAiLoading: Boolean,
  onBack: () -> Unit,
  onToggleSave: (String) -> Unit,
  onAskAiBreakdown: (Restaurant) -> Unit,
  onRateDish: (dishName: String, isLoved: Boolean, restaurantId: String) -> Unit,
  modifier: Modifier = Modifier
) {
  BackHandler(onBack = onBack)

  val heroDrawable = restaurant.heroDrawableId ?: R.drawable.img_hero_indian_dining

  Box(modifier = modifier.fillMaxSize().background(ZestGunmetalDark)) {
    Column(
      modifier = Modifier
        .fillMaxSize()
        .verticalScroll(rememberScrollState())
        .padding(bottom = 90.dp)
        .testTag("restaurant_detail_screen")
    ) {
      // 1. Hero Image & Top Bar
      Box(
        modifier = Modifier
          .fillMaxWidth()
          .height(260.dp)
      ) {
        Image(
          painter = painterResource(id = heroDrawable),
          contentDescription = restaurant.name,
          modifier = Modifier.fillMaxSize(),
          contentScale = ContentScale.Crop
        )

        // Gradient overlay
        Box(
          modifier = Modifier
            .fillMaxSize()
            .background(
              Brush.verticalGradient(
                colors = listOf(
                  ZestGunmetalDark.copy(alpha = 0.7f),
                  Color.Transparent,
                  ZestGunmetalDark.copy(alpha = 0.95f)
                )
              )
            )
        )

        // Top Navigation Row
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 40.dp),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          IconButton(
            onClick = onBack,
            modifier = Modifier
              .background(ZestGunmetalSurface.copy(alpha = 0.85f), CircleShape)
              .testTag("detail_back_button")
          ) {
            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = ZestPureWhite)
          }

          IconButton(
            onClick = { onToggleSave(restaurant.id) },
            modifier = Modifier
              .background(ZestGunmetalSurface.copy(alpha = 0.85f), CircleShape)
              .testTag("detail_save_button")
          ) {
            Icon(
              imageVector = if (isSaved) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
              contentDescription = "Save",
              tint = if (isSaved) ZestSaffron else ZestLightBlue
            )
          }
        }

        // Title and Match Badge on Hero Bottom
        Row(
          modifier = Modifier
            .fillMaxWidth()
            .align(Alignment.BottomStart)
            .padding(16.dp),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.Bottom
        ) {
          Column(modifier = Modifier.weight(1f)) {
            Text(
              text = restaurant.name,
              style = MaterialTheme.typography.headlineMedium,
              fontWeight = FontWeight.Bold,
              color = ZestPureWhite
            )
            Text(
              text = "${restaurant.neighborhood}, ${restaurant.city}",
              style = MaterialTheme.typography.bodyMedium,
              color = ZestLightBlueSoft
            )
          }

          // Palate Match Badge (Zest Iconic Saffron Badge)
          Surface(
            shape = RoundedCornerShape(14.dp),
            color = ZestSaffron,
            modifier = Modifier.testTag("detail_palate_match_badge")
          ) {
            Row(
              modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
              verticalAlignment = Alignment.CenterVertically
            ) {
              Text(
                text = "⚡ $matchScore%",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.ExtraBold,
                color = ZestGunmetalDark
              )
              Spacer(modifier = Modifier.width(4.dp))
              Text(
                text = "Palate Match",
                style = MaterialTheme.typography.labelSmall,
                color = ZestGunmetalDark,
                fontWeight = FontWeight.Bold
              )
            }
          }
        }
      }

      Column(modifier = Modifier.padding(16.dp)) {
        // Quick Stats Row
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Default.Star, contentDescription = null, tint = ZestSaffron, modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.width(4.dp))
            Text(
              text = "${restaurant.rating}",
              style = MaterialTheme.typography.titleMedium,
              fontWeight = FontWeight.Bold,
              color = ZestPureWhite
            )
            Text(
              text = " (${restaurant.reviewCount} reviews)",
              style = MaterialTheme.typography.bodySmall,
              color = ZestGunmetalMuted
            )
          }

          Text(
            text = "${restaurant.priceLevel.symbol} • ₹${restaurant.approxCostForTwo} for two",
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.SemiBold,
            color = ZestSaffron
          )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Cuisines and Vibes Tags
        FlowRow(
          horizontalArrangement = Arrangement.spacedBy(8.dp),
          verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
          restaurant.cuisineList.forEach { cuisine ->
            Surface(
              shape = RoundedCornerShape(10.dp),
              color = ZestGunmetalSurface,
              border = androidx.compose.foundation.BorderStroke(1.dp, ZestMoonstone.copy(alpha = 0.35f))
            ) {
              Text(
                text = cuisine,
                style = MaterialTheme.typography.labelMedium,
                modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
                color = ZestLightBlueSoft
              )
            }
          }

          Surface(
            shape = RoundedCornerShape(10.dp),
            color = ZestMoonstone.copy(alpha = 0.2f),
            border = androidx.compose.foundation.BorderStroke(1.dp, ZestMoonstone)
          ) {
            Text(
              text = "✨ ${restaurant.primaryVibe}",
              style = MaterialTheme.typography.labelMedium,
              fontWeight = FontWeight.Medium,
              modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
              color = ZestLightBlue
            )
          }

          if (restaurant.isPureVeg) {
            Surface(
              shape = RoundedCornerShape(10.dp),
              color = Color(0xFF1B3D34)
            ) {
              Text(
                text = "🌱 Pure Veg",
                style = MaterialTheme.typography.labelMedium,
                modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
                color = com.example.ui.theme.ZestVegGreen,
                fontWeight = FontWeight.Bold
              )
            }
          }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // 3. Why Palate AI Picked This Spot (Explainability Card)
        Card(
          shape = RoundedCornerShape(18.dp),
          colors = CardDefaults.cardColors(containerColor = ZestGunmetalSurface),
          border = androidx.compose.foundation.BorderStroke(1.5.dp, ZestMoonstone.copy(alpha = 0.45f)),
          modifier = Modifier.fillMaxWidth().testTag("ai_explanation_card")
        ) {
          Column(modifier = Modifier.padding(16.dp)) {
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Psychology, contentDescription = null, tint = ZestSaffron)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                  text = "Why Palate AI Picked This",
                  style = MaterialTheme.typography.titleMedium,
                  fontWeight = FontWeight.Bold,
                  color = ZestPureWhite
                )
              }

              if (aiExplanation == null && !isAiLoading) {
                OutlinedButton(
                  onClick = { onAskAiBreakdown(restaurant) },
                  colors = ButtonDefaults.outlinedButtonColors(contentColor = ZestSaffron),
                  border = androidx.compose.foundation.BorderStroke(1.dp, ZestSaffron),
                  shape = RoundedCornerShape(8.dp),
                  modifier = Modifier.testTag("ai_deep_dive_btn")
                ) {
                  Icon(Icons.Default.AutoAwesome, contentDescription = null, modifier = Modifier.size(14.dp), tint = ZestSaffron)
                  Spacer(modifier = Modifier.width(4.dp))
                  Text("AI Deep Dive", fontSize = 11.sp, color = ZestSaffron)
                }
              }
            }

            Spacer(modifier = Modifier.height(10.dp))

            if (isAiLoading) {
              Row(verticalAlignment = Alignment.CenterVertically) {
                CircularProgressIndicator(modifier = Modifier.size(16.dp), strokeWidth = 2.dp, color = ZestSaffron)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Synthesizing palate harmony with Gemini...", style = MaterialTheme.typography.bodySmall, color = ZestLightBlue)
              }
            } else {
              val textToShow = aiExplanation ?: generateDefaultPalateExplanation(restaurant, userProfile, matchScore)
              Text(
                text = textToShow,
                style = MaterialTheme.typography.bodyMedium,
                lineHeight = 22.sp,
                color = ZestLightBlueSoft
              )
            }
          }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Description
        Text(
          text = "About This Spot",
          style = MaterialTheme.typography.titleMedium,
          fontWeight = FontWeight.Bold,
          color = ZestOffWhite
        )
        Spacer(modifier = Modifier.height(6.dp))
        Text(
          text = restaurant.description,
          style = MaterialTheme.typography.bodyMedium,
          color = ZestLightBlue
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Hours & Location Info
        Row(verticalAlignment = Alignment.CenterVertically) {
          Icon(Icons.Default.AccessTime, contentDescription = null, tint = ZestSaffron, modifier = Modifier.size(18.dp))
          Spacer(modifier = Modifier.width(8.dp))
          Text(text = restaurant.openTiming, style = MaterialTheme.typography.bodyMedium, color = ZestLightBlueSoft)
        }
        Spacer(modifier = Modifier.height(8.dp))
        Row(verticalAlignment = Alignment.Top) {
          Icon(Icons.Default.LocationOn, contentDescription = null, tint = ZestSaffron, modifier = Modifier.size(18.dp))
          Spacer(modifier = Modifier.width(8.dp))
          Text(text = restaurant.address, style = MaterialTheme.typography.bodyMedium, color = ZestLightBlueSoft)
        }

        Spacer(modifier = Modifier.height(24.dp))

        // 4. Must-Try Signature Dishes & Live Taste Calibration
        Text(
          text = "Signature Dishes & Palate Match",
          style = MaterialTheme.typography.titleMedium,
          fontWeight = FontWeight.Bold,
          color = ZestOffWhite
        )
        Text(
          text = "Rate dishes to dynamically train your personal Palate Genome",
          style = MaterialTheme.typography.bodySmall,
          color = ZestGunmetalMuted
        )
        Spacer(modifier = Modifier.height(12.dp))

        restaurant.signatureDishes.forEach { dish ->
          DishItemCard(
            dish = dish,
            onRate = { isLoved -> onRateDish(dish.name, isLoved, restaurant.id) }
          )
          Spacer(modifier = Modifier.height(12.dp))
        }

        Spacer(modifier = Modifier.height(16.dp))

        // 5. Ambiance & Seating Zones
        Text(
          text = "Atmosphere & Seating Areas",
          style = MaterialTheme.typography.titleMedium,
          fontWeight = FontWeight.Bold,
          color = ZestOffWhite
        )
        Spacer(modifier = Modifier.height(8.dp))
        FlowRow(
          horizontalArrangement = Arrangement.spacedBy(8.dp),
          verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
          restaurant.seatingAreas.forEach { area ->
            Surface(
              shape = RoundedCornerShape(10.dp),
              color = ZestGunmetalSurface,
              border = androidx.compose.foundation.BorderStroke(1.dp, ZestMoonstone.copy(alpha = 0.3f))
            ) {
              Text(
                text = area,
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                style = MaterialTheme.typography.bodySmall,
                color = ZestLightBlueSoft
              )
            }
          }
        }
      }
    }

    // Fixed Bottom Action Bar
    Surface(
      modifier = Modifier
        .align(Alignment.BottomCenter)
        .fillMaxWidth(),
      shadowElevation = 8.dp,
      color = ZestGunmetalSurface,
      border = androidx.compose.foundation.BorderStroke(1.dp, ZestMoonstone.copy(alpha = 0.3f))
    ) {
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Column {
          Text(
            text = "⚡ $matchScore% Palate Match",
            style = MaterialTheme.typography.labelMedium,
            color = ZestSaffron,
            fontWeight = FontWeight.ExtraBold
          )
          Text(
            text = "Tuned for ${userProfile.userCity}",
            style = MaterialTheme.typography.bodySmall,
            color = ZestLightBlue
          )
        }

        Button(
          onClick = { onToggleSave(restaurant.id) },
          colors = ButtonDefaults.buttonColors(
            containerColor = if (isSaved) ZestGunmetalCard else ZestSaffron,
            contentColor = if (isSaved) ZestSaffron else ZestGunmetalDark
          ),
          shape = RoundedCornerShape(14.dp),
          modifier = Modifier.testTag("detail_save_toggle_cta")
        ) {
          Icon(
            imageVector = if (isSaved) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
            contentDescription = null,
            modifier = Modifier.size(18.dp),
            tint = if (isSaved) ZestSaffron else ZestGunmetalDark
          )
          Spacer(modifier = Modifier.width(6.dp))
          Text(
            text = if (isSaved) "Saved" else "Save Spot",
            color = if (isSaved) ZestSaffron else ZestGunmetalDark,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold
          )
        }
      }
    }
  }
}

@Composable
private fun DishItemCard(
  dish: com.example.data.model.SignatureDish,
  onRate: (Boolean) -> Unit
) {
  var feedbackGiven by remember { mutableStateOf<Boolean?>(null) }

  Card(
    shape = RoundedCornerShape(16.dp),
    colors = CardDefaults.cardColors(containerColor = ZestGunmetalSurface),
    border = androidx.compose.foundation.BorderStroke(1.dp, ZestMoonstone.copy(alpha = 0.35f)),
    modifier = Modifier.fillMaxWidth().testTag("dish_item_${dish.name.take(4)}")
  ) {
    Column(modifier = Modifier.padding(14.dp)) {
      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Row(modifier = Modifier.weight(1f), verticalAlignment = Alignment.CenterVertically) {
          Surface(
            shape = RoundedCornerShape(4.dp),
            color = if (dish.isVeg) Color(0xFF1B3D34) else Color(0xFF3B1D19),
            modifier = Modifier.size(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, if (dish.isVeg) com.example.ui.theme.ZestVegGreen else com.example.ui.theme.ZestNonVegRed)
          ) {
            Box(contentAlignment = Alignment.Center) {
              Box(
                modifier = Modifier
                  .size(6.dp)
                  .background(if (dish.isVeg) com.example.ui.theme.ZestVegGreen else com.example.ui.theme.ZestNonVegRed, CircleShape)
              )
            }
          }
          Spacer(modifier = Modifier.width(8.dp))
          Text(
            text = dish.name,
            style = MaterialTheme.typography.titleSmall,
            fontWeight = FontWeight.Bold,
            color = ZestPureWhite
          )
        }
        Text(
          text = dish.price,
          style = MaterialTheme.typography.labelLarge,
          fontWeight = FontWeight.Bold,
          color = ZestSaffron
        )
      }

      Spacer(modifier = Modifier.height(4.dp))
      Text(
        text = dish.description,
        style = MaterialTheme.typography.bodySmall,
        color = ZestLightBlueSoft
      )

      Spacer(modifier = Modifier.height(8.dp))

      Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
      ) {
        Surface(
          shape = RoundedCornerShape(8.dp),
          color = ZestGunmetalCard
        ) {
          Text(
            text = "✨ ${dish.tasteHighlight}",
            style = MaterialTheme.typography.labelSmall,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
            color = ZestSaffron
          )
        }

        // Live feedback buttons
        Row(verticalAlignment = Alignment.CenterVertically) {
          if (feedbackGiven == null) {
            Text(
              text = "Taste it?",
              style = MaterialTheme.typography.labelSmall,
              color = ZestGunmetalMuted
            )
            Spacer(modifier = Modifier.width(4.dp))
            IconButton(
              onClick = {
                feedbackGiven = true
                onRate(true)
              },
              modifier = Modifier.size(32.dp).testTag("rate_love_${dish.name.take(4)}")
            ) {
              Icon(Icons.Default.ThumbUp, contentDescription = "Love dish", tint = ZestSaffron, modifier = Modifier.size(16.dp))
            }
            IconButton(
              onClick = {
                feedbackGiven = false
                onRate(false)
              },
              modifier = Modifier.size(32.dp).testTag("rate_dislike_${dish.name.take(4)}")
            ) {
              Icon(Icons.Default.ThumbDown, contentDescription = "Pass dish", tint = ZestGunmetalMuted, modifier = Modifier.size(16.dp))
            }
          } else {
            Surface(
              shape = RoundedCornerShape(8.dp),
              color = if (feedbackGiven == true) Color(0xFF1B3D34) else Color(0xFF3B1D19)
            ) {
              Text(
                text = if (feedbackGiven == true) "👍 Loved (Tuned AI)" else "👎 Noted for AI",
                style = MaterialTheme.typography.labelSmall,
                color = if (feedbackGiven == true) com.example.ui.theme.ZestVegGreen else com.example.ui.theme.ZestNonVegRed,
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
              )
            }
          }
        }
      }
    }
  }
}

private fun generateDefaultPalateExplanation(restaurant: Restaurant, profile: UserProfile, score: Int): String {
  val reasons = mutableListOf<String>()
  if (restaurant.spiceLevel == profile.spiceTolerance) {
    reasons.add("perfectly aligns with your spice benchmark (${if (restaurant.spiceLevel >= 3) "fiery Indian spice" else "balanced medium masala"})")
  }
  if (restaurant.isPureVeg && profile.dietaryPreference == com.example.data.model.DietaryType.PURE_VEG) {
    reasons.add("is dedicated 100% Pure Vegetarian")
  }
  if (restaurant.servesCraftBeer && profile.favoriteVibes.any { it.contains("Brewery", true) }) {
    reasons.add("features fresh craft microbrews matching your brewery preferences")
  }
  if (restaurant.tasteTags.any { tag -> profile.favoriteCuisines.any { c -> tag.contains(c, true) || c.contains(tag, true) } }) {
    reasons.add("offers signature dishes mirroring your favorite regional profile")
  }

  return if (reasons.isNotEmpty()) {
    "With a $score% Palate Match, this spot " + reasons.joinToString(", and ") + "."
  } else {
    "With a $score% Palate Match, this spot matches your flavor palette in ${restaurant.neighborhood} with standout dishes like ${restaurant.signatureDishes.firstOrNull()?.name ?: "local specialties"}."
  }
}

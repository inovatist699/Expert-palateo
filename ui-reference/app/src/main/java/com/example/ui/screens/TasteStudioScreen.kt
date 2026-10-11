package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
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
import com.example.data.model.DietaryType
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
import com.example.ui.theme.ZestMoonstoneDark
import com.example.ui.theme.ZestOffWhite
import com.example.ui.theme.ZestPureWhite
import com.example.ui.theme.ZestSaffron
import com.example.ui.theme.ZestSaffronDark
import com.example.ui.theme.ZestVegGreen
import kotlin.math.roundToInt

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun TasteStudioScreen(
  userProfile: UserProfile,
  isSupabaseConnected: Boolean,
  onSavePreferences: (
    name: String,
    city: String,
    spice: Int,
    dietary: DietaryType,
    cuisines: Set<String>,
    vibes: Set<String>
  ) -> Unit,
  onRecordDishTaste: (dishName: String, isLoved: Boolean) -> Unit,
  modifier: Modifier = Modifier
) {
  var selectedSpice by remember(userProfile) { mutableFloatStateOf(userProfile.spiceTolerance.toFloat()) }
  var selectedDietary by remember(userProfile) { mutableStateOf(userProfile.dietaryPreference) }
  var selectedCuisines by remember(userProfile) { mutableStateOf(userProfile.favoriteCuisines) }
  var selectedVibes by remember(userProfile) { mutableStateOf(userProfile.favoriteVibes) }

  // Quick calibration dish index
  var calibrationIndex by remember { mutableIntStateOf(0) }
  val calibrationDishes = listOf(
    Pair("Mangalorean Ghee Roast Masala", "Fiery red Byadgi chillies, pure cow ghee & roasted spices"),
    Pair("Fluffy Crispy Benne Dosa & Filter Kaapi", "Golden fermented batter with dollop of white butter"),
    Pair("Smoky Charcoal Mutton Burra Kebabs", "Slow-charred in clay tandoor with royal Lucknowi spices"),
    Pair("Artisanal Sourdough & Specialty Pour-overs", "Fermented sourdough crust, podi butter & estate coffee"),
    Pair("Authentic Hyderabadi Dum Biryani", "Aromatic long-grain basmati with saffron and tender meat")
  )

  val allCuisineOptions = listOf(
    "South Indian Gourmet",
    "Craft Breweries",
    "Coastal Seafood",
    "Modern Progressive",
    "Old Delhi Mughlai",
    "Artisanal Coffee",
    "Andhra Meals",
    "Continental Tapas"
  )

  val allVibeOptions = listOf(
    "Lively Craft Brewery",
    "Aesthetic Courtyard",
    "Chic Rooftop",
    "Heritage Breakfast Spot",
    "Tropical Garden",
    "Ultra-Chic Fine Dining"
  )

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(ZestGunmetalDark)
      .verticalScroll(rememberScrollState())
      .padding(16.dp)
      .padding(top = 28.dp, bottom = 48.dp)
      .testTag("taste_studio_screen")
  ) {
    // Header
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      Column {
        Text(
          text = "Palate Genome Studio",
          style = MaterialTheme.typography.headlineMedium,
          fontWeight = FontWeight.Bold,
          color = ZestOffWhite
        )
        Text(
          text = "Teach Palateo AI your culinary DNA & flavor rules",
          style = MaterialTheme.typography.bodyMedium,
          color = ZestGunmetalMuted
        )
      }

      Surface(
        shape = CircleShape,
        color = ZestGunmetalSurface,
        border = androidx.compose.foundation.BorderStroke(1.dp, ZestMoonstone),
        modifier = Modifier.size(44.dp)
      ) {
        Box(contentAlignment = Alignment.Center) {
          Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = ZestSaffron)
        }
      }
    }

    Spacer(modifier = Modifier.height(12.dp))

    // Supabase Cloud Sync Status Pill
    Surface(
      shape = RoundedCornerShape(12.dp),
      color = if (isSupabaseConnected) Color(0xFF1B3D34) else ZestGunmetalSurface,
      border = androidx.compose.foundation.BorderStroke(
        1.dp,
        if (isSupabaseConnected) ZestVegGreen else ZestMoonstone.copy(alpha = 0.35f)
      ),
      modifier = Modifier.fillMaxWidth()
    ) {
      Row(
        modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
      ) {
        Text(
          text = if (isSupabaseConnected) "☁️ Supabase Cloud Sync Active" else "💾 Local Room Database Engine Active (Supabase sync ready)",
          style = MaterialTheme.typography.labelSmall,
          fontWeight = FontWeight.Bold,
          color = if (isSupabaseConnected) ZestSaffron else ZestLightBlue
        )
      }
    }

    Spacer(modifier = Modifier.height(16.dp))

    // Taste Genome Hero Persona Card
    Card(
      shape = RoundedCornerShape(20.dp),
      colors = CardDefaults.cardColors(containerColor = ZestGunmetalSurface),
      border = androidx.compose.foundation.BorderStroke(1.5.dp, ZestSaffron),
      elevation = CardDefaults.cardElevation(6.dp),
      modifier = Modifier.fillMaxWidth().testTag("taste_persona_card")
    ) {
      Box(modifier = Modifier.fillMaxWidth()) {
        Image(
          painter = painterResource(id = R.drawable.img_taste_profile_banner),
          contentDescription = null,
          modifier = Modifier
            .fillMaxWidth()
            .height(130.dp),
          contentScale = ContentScale.Crop
        )

        Box(
          modifier = Modifier
            .fillMaxWidth()
            .height(130.dp)
            .background(
              Brush.verticalGradient(
                colors = listOf(
                  ZestGunmetalDark.copy(alpha = 0.4f),
                  ZestGunmetalDark.copy(alpha = 0.92f)
                )
              )
            )
        )

        Column(
          modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
            .padding(top = 36.dp)
        ) {
          Text(
            text = "CURRENT TASTE GENOME",
            style = MaterialTheme.typography.labelSmall,
            color = ZestSaffron,
            fontWeight = FontWeight.ExtraBold
          )
          Text(
            text = userProfile.tastePersona,
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            color = ZestPureWhite
          )
          Text(
            text = "Active in ${userProfile.userCity} • ${userProfile.ratedDishCount} taste signals trained",
            style = MaterialTheme.typography.bodySmall,
            color = ZestLightBlueSoft
          )
        }
      }
    }

    Spacer(modifier = Modifier.height(24.dp))

    // 1. Spice Tolerance Meter
    Text(
      text = "1. Spice Tolerance Meter",
      style = MaterialTheme.typography.titleMedium,
      fontWeight = FontWeight.Bold,
      color = ZestOffWhite
    )
    val spiceLabel = when (selectedSpice.roundToInt()) {
      1 -> "Mild & Gentle (European / Coconut mild)"
      2 -> "Balanced Masala (Classic street & cafe spice)"
      else -> "Fiery Desi Spice 🔥 (Gongura, Andhra, Ghee Roast)"
    }
    Text(
      text = spiceLabel,
      style = MaterialTheme.typography.bodyMedium,
      color = ZestSaffron,
      fontWeight = FontWeight.SemiBold
    )

    Slider(
      value = selectedSpice,
      onValueChange = { selectedSpice = it },
      valueRange = 1f..3f,
      steps = 1,
      colors = SliderDefaults.colors(
        thumbColor = ZestSaffron,
        activeTrackColor = ZestSaffron,
        inactiveTrackColor = ZestGunmetalCard
      ),
      modifier = Modifier
        .fillMaxWidth()
        .testTag("spice_tolerance_slider")
    )

    Spacer(modifier = Modifier.height(20.dp))

    // 2. Dietary Philosophy
    Text(
      text = "2. Dietary Philosophy",
      style = MaterialTheme.typography.titleMedium,
      fontWeight = FontWeight.Bold,
      color = ZestOffWhite
    )
    Spacer(modifier = Modifier.height(8.dp))
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
      DietaryType.values().forEach { diet ->
        val isSelected = diet == selectedDietary
        Surface(
          shape = RoundedCornerShape(12.dp),
          color = if (isSelected) ZestSaffron else ZestGunmetalSurface,
          border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (isSelected) ZestSaffronDark else ZestMoonstone.copy(alpha = 0.35f)
          ),
          modifier = Modifier
            .weight(1f)
            .clickable { selectedDietary = diet }
            .testTag("dietary_${diet.name}")
        ) {
          Box(
            modifier = Modifier.padding(vertical = 10.dp),
            contentAlignment = Alignment.Center
          ) {
            Text(
              text = diet.badge,
              style = MaterialTheme.typography.labelSmall,
              fontWeight = FontWeight.Bold,
              color = if (isSelected) ZestGunmetalDark else ZestLightBlue
            )
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(24.dp))

    // 3. Favorite Cuisines
    Text(
      text = "3. Favorite Regional Cuisines",
      style = MaterialTheme.typography.titleMedium,
      fontWeight = FontWeight.Bold,
      color = ZestOffWhite
    )
    Text(
      text = "Tap to toggle cuisines you crave most",
      style = MaterialTheme.typography.bodySmall,
      color = ZestGunmetalMuted
    )
    Spacer(modifier = Modifier.height(8.dp))
    FlowRow(
      horizontalArrangement = Arrangement.spacedBy(8.dp),
      verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
      allCuisineOptions.forEach { cuisine ->
        val isSelected = selectedCuisines.contains(cuisine)
        FilterChip(
          selected = isSelected,
          onClick = {
            selectedCuisines = if (isSelected) selectedCuisines - cuisine else selectedCuisines + cuisine
          },
          label = { Text(cuisine) },
          leadingIcon = if (isSelected) {
            { Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp)) }
          } else null,
          colors = FilterChipDefaults.filterChipColors(
            selectedContainerColor = ZestMoonstone,
            selectedLabelColor = ZestPureWhite,
            containerColor = ZestGunmetalSurface,
            labelColor = ZestLightBlueSoft
          ),
          border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (isSelected) ZestLightBlue else ZestGunmetalCard
          ),
          modifier = Modifier.testTag("cuisine_chip_${cuisine.take(4)}")
        )
      }
    }

    Spacer(modifier = Modifier.height(24.dp))

    // 4. Dining Vibes
    Text(
      text = "4. Ambiance & Dining Vibes",
      style = MaterialTheme.typography.titleMedium,
      fontWeight = FontWeight.Bold,
      color = ZestOffWhite
    )
    Spacer(modifier = Modifier.height(8.dp))
    FlowRow(
      horizontalArrangement = Arrangement.spacedBy(8.dp),
      verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
      allVibeOptions.forEach { vibe ->
        val isSelected = selectedVibes.contains(vibe)
        FilterChip(
          selected = isSelected,
          onClick = {
            selectedVibes = if (isSelected) selectedVibes - vibe else selectedVibes + vibe
          },
          label = { Text(vibe) },
          colors = FilterChipDefaults.filterChipColors(
            selectedContainerColor = ZestSaffron,
            selectedLabelColor = ZestGunmetalDark,
            containerColor = ZestGunmetalSurface,
            labelColor = ZestLightBlueSoft
          ),
          border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (isSelected) ZestSaffronDark else ZestGunmetalCard
          ),
          modifier = Modifier.testTag("vibe_chip_${vibe.take(4)}")
        )
      }
    }

    Spacer(modifier = Modifier.height(24.dp))

    // 5. Rapid Dish Calibration Deck
    Text(
      text = "5. Live Dish Calibration Deck",
      style = MaterialTheme.typography.titleMedium,
      fontWeight = FontWeight.Bold,
      color = ZestOffWhite
    )
    Text(
      text = "Quick taste signals to sharpen your match score",
      style = MaterialTheme.typography.bodySmall,
      color = ZestGunmetalMuted
    )
    Spacer(modifier = Modifier.height(10.dp))

    if (calibrationIndex < calibrationDishes.size) {
      val currentDish = calibrationDishes[calibrationIndex]
      Card(
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = ZestGunmetalSurface),
        border = androidx.compose.foundation.BorderStroke(1.dp, ZestMoonstone.copy(alpha = 0.4f)),
        modifier = Modifier.fillMaxWidth().testTag("calibration_dish_card")
      ) {
        Column(modifier = Modifier.padding(18.dp)) {
          Text(
            text = "DISH ${calibrationIndex + 1} OF ${calibrationDishes.size}",
            style = MaterialTheme.typography.labelSmall,
            color = ZestSaffron,
            fontWeight = FontWeight.ExtraBold
          )
          Text(
            text = currentDish.first,
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            color = ZestPureWhite
          )
          Spacer(modifier = Modifier.height(4.dp))
          Text(
            text = currentDish.second,
            style = MaterialTheme.typography.bodyMedium,
            color = ZestLightBlueSoft
          )

          Spacer(modifier = Modifier.height(16.dp))

          Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
          ) {
            Button(
              onClick = {
                onRecordDishTaste(currentDish.first, false)
                calibrationIndex++
              },
              colors = ButtonDefaults.buttonColors(
                containerColor = ZestGunmetalCard,
                contentColor = ZestGunmetalMuted
              ),
              shape = RoundedCornerShape(12.dp),
              modifier = Modifier.weight(1f).testTag("calibration_pass_button")
            ) {
              Icon(Icons.Default.Close, contentDescription = null, tint = ZestLightBlue)
              Spacer(modifier = Modifier.width(6.dp))
              Text("Pass", color = ZestLightBlue)
            }

            Spacer(modifier = Modifier.width(12.dp))

            Button(
              onClick = {
                onRecordDishTaste(currentDish.first, true)
                calibrationIndex++
              },
              colors = ButtonDefaults.buttonColors(
                containerColor = ZestSaffron,
                contentColor = ZestGunmetalDark
              ),
              shape = RoundedCornerShape(12.dp),
              modifier = Modifier.weight(1f).testTag("calibration_love_button")
            ) {
              Icon(Icons.Default.Favorite, contentDescription = null, tint = ZestGunmetalDark)
              Spacer(modifier = Modifier.width(6.dp))
              Text("Love It", color = ZestGunmetalDark, fontWeight = FontWeight.Bold)
            }
          }
        }
      }
    } else {
      Surface(
        shape = RoundedCornerShape(14.dp),
        color = Color(0xFF1B3D34),
        border = androidx.compose.foundation.BorderStroke(1.dp, ZestVegGreen),
        modifier = Modifier.fillMaxWidth()
      ) {
        Row(
          modifier = Modifier.padding(16.dp),
          verticalAlignment = Alignment.CenterVertically
        ) {
          Icon(Icons.Default.Check, contentDescription = null, tint = ZestSaffron)
          Spacer(modifier = Modifier.width(8.dp))
          Text(
            text = "Dish calibration complete! Your recommendations are hyper-tuned.",
            style = MaterialTheme.typography.bodyMedium,
            color = ZestPureWhite,
            fontWeight = FontWeight.Medium
          )
        }
      }
    }

    Spacer(modifier = Modifier.height(28.dp))

    // Save Button
    Button(
      onClick = {
        onSavePreferences(
          userProfile.userName,
          userProfile.userCity,
          selectedSpice.roundToInt(),
          selectedDietary,
          selectedCuisines,
          selectedVibes
        )
      },
      colors = ButtonDefaults.buttonColors(
        containerColor = ZestSaffron,
        contentColor = ZestGunmetalDark
      ),
      shape = RoundedCornerShape(16.dp),
      modifier = Modifier
        .fillMaxWidth()
        .height(54.dp)
        .testTag("save_taste_preferences_button")
    ) {
      Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = ZestGunmetalDark)
      Spacer(modifier = Modifier.width(8.dp))
      Text(
        text = "Save & Recalculate Matches",
        style = MaterialTheme.typography.titleMedium,
        fontWeight = FontWeight.Bold,
        color = ZestGunmetalDark
      )
    }
  }
}

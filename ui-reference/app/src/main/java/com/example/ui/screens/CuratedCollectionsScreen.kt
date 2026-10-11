package com.example.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.Explore
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.CuratedCollection
import com.example.data.model.Restaurant
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

@Composable
fun CuratedCollectionsScreen(
  collections: List<CuratedCollection>,
  allRestaurants: List<Restaurant>,
  savedIds: Set<String>,
  onOpenDetail: (Restaurant) -> Unit,
  onToggleSave: (String) -> Unit,
  matchScoreCalculator: (Restaurant) -> Int,
  modifier: Modifier = Modifier
) {
  var selectedCollectionId by remember { mutableStateOf<String?>(collections.firstOrNull()?.id) }

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(ZestGunmetalDark)
      .padding(16.dp)
      .padding(top = 28.dp)
      .testTag("curated_collections_screen")
  ) {
    // Header
    Column {
      Text(
        text = "Curated Food Trails",
        style = MaterialTheme.typography.headlineMedium,
        fontWeight = FontWeight.Bold,
        color = ZestOffWhite
      )
      Text(
        text = "Handpicked culinary journeys tailored to your taste radar",
        style = MaterialTheme.typography.bodyMedium,
        color = ZestGunmetalMuted
      )
    }

    Spacer(modifier = Modifier.height(16.dp))

    LazyColumn(
      verticalArrangement = Arrangement.spacedBy(16.dp),
      modifier = Modifier
        .fillMaxSize()
        .padding(bottom = 60.dp)
        .testTag("collections_list")
    ) {
      items(collections, key = { it.id }) { collection ->
        val isExpanded = collection.id == selectedCollectionId
        val matchingRestaurants = allRestaurants.filter { collection.restaurantIds.contains(it.id) }

        Card(
          shape = RoundedCornerShape(20.dp),
          colors = CardDefaults.cardColors(
            containerColor = if (isExpanded) ZestGunmetalCard else ZestGunmetalSurface
          ),
          border = androidx.compose.foundation.BorderStroke(
            width = if (isExpanded) 1.5.dp else 1.dp,
            color = if (isExpanded) ZestSaffron else ZestMoonstone.copy(alpha = 0.35f)
          ),
          elevation = CardDefaults.cardElevation(if (isExpanded) 8.dp else 2.dp),
          modifier = Modifier
            .fillMaxWidth()
            .clickable { selectedCollectionId = if (isExpanded) null else collection.id }
            .testTag("collection_item_${collection.id}")
        ) {
          Column(modifier = Modifier.padding(18.dp)) {
            Row(
              modifier = Modifier.fillMaxWidth(),
              horizontalArrangement = Arrangement.SpaceBetween,
              verticalAlignment = Alignment.CenterVertically
            ) {
              Row(
                modifier = Modifier.weight(1f),
                verticalAlignment = Alignment.CenterVertically
              ) {
                Text(
                  text = collection.iconEmoji,
                  fontSize = 30.sp
                )
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                  Text(
                    text = collection.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = ZestPureWhite
                  )
                  Text(
                    text = "${collection.city} • ${collection.restaurantIds.size} Curated Spots",
                    style = MaterialTheme.typography.bodySmall,
                    color = ZestSaffron,
                    fontWeight = FontWeight.SemiBold
                  )
                }
              }
            }

            Spacer(modifier = Modifier.height(8.dp))
            Text(
              text = collection.subtitle,
              style = MaterialTheme.typography.bodyMedium,
              color = ZestLightBlueSoft
            )

            if (isExpanded) {
              Spacer(modifier = Modifier.height(14.dp))
              HorizontalDivider(color = ZestMoonstone.copy(alpha = 0.25f))
              Spacer(modifier = Modifier.height(14.dp))

              Text(
                text = "PALATE DNA NOTES",
                style = MaterialTheme.typography.labelSmall,
                color = ZestSaffron,
                fontWeight = FontWeight.Bold
              )
              Text(
                text = collection.tasteDescription,
                style = MaterialTheme.typography.bodySmall,
                color = ZestLightBlue
              )

              Spacer(modifier = Modifier.height(16.dp))

              // Show restaurants list inside this collection
              matchingRestaurants.forEach { restaurant ->
                val score = matchScoreCalculator(restaurant)
                val isSaved = savedIds.contains(restaurant.id)

                CollectionRestaurantRow(
                  restaurant = restaurant,
                  matchScore = score,
                  isSaved = isSaved,
                  onClick = { onOpenDetail(restaurant) },
                  onToggleSave = { onToggleSave(restaurant.id) }
                )
                Spacer(modifier = Modifier.height(10.dp))
              }
            }
          }
        }
      }
    }
  }
}

@Composable
private fun CollectionRestaurantRow(
  restaurant: Restaurant,
  matchScore: Int,
  isSaved: Boolean,
  onClick: () -> Unit,
  onToggleSave: () -> Unit
) {
  Surface(
    shape = RoundedCornerShape(14.dp),
    color = ZestGunmetalDeeper,
    border = androidx.compose.foundation.BorderStroke(1.dp, ZestMoonstone.copy(alpha = 0.25f)),
    modifier = Modifier
      .fillMaxWidth()
      .clickable(onClick = onClick)
      .testTag("collection_spot_${restaurant.id}")
  ) {
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .padding(14.dp),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      Column(modifier = Modifier.weight(1f)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
          Text(
            text = restaurant.name,
            style = MaterialTheme.typography.titleSmall,
            fontWeight = FontWeight.Bold,
            color = ZestPureWhite
          )
          Spacer(modifier = Modifier.width(6.dp))
          Surface(
            shape = RoundedCornerShape(8.dp),
            color = ZestSaffron
          ) {
            Text(
              text = "⚡ $matchScore%",
              style = MaterialTheme.typography.labelSmall,
              fontWeight = FontWeight.ExtraBold,
              color = ZestGunmetalDark,
              modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
            )
          }
        }

        Text(
          text = "${restaurant.neighborhood} • ${restaurant.primaryVibe}",
          style = MaterialTheme.typography.bodySmall,
          color = ZestLightBlue
        )

        val topDish = restaurant.signatureDishes.firstOrNull()
        if (topDish != null) {
          Text(
            text = "Must Order: ${topDish.name}",
            style = MaterialTheme.typography.labelSmall,
            color = ZestSaffron,
            fontWeight = FontWeight.Medium
          )
        }
      }

      Row(verticalAlignment = Alignment.CenterVertically) {
        IconButton(onClick = onToggleSave) {
          Icon(
            if (isSaved) Icons.Default.Bookmark else Icons.Default.BookmarkBorder,
            contentDescription = null,
            tint = if (isSaved) ZestSaffron else ZestLightBlue,
            modifier = Modifier.size(20.dp)
          )
        }

        Button(
          onClick = onClick,
          colors = ButtonDefaults.buttonColors(
            containerColor = ZestMoonstone,
            contentColor = ZestPureWhite
          ),
          shape = RoundedCornerShape(10.dp),
          contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 12.dp, vertical = 6.dp),
          modifier = Modifier.testTag("collection_view_btn_${restaurant.id}")
        ) {
          Text("View Spot", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
        }
      }
    }
  }
}

package com.example.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
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

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun PalateAiScreen(
  userProfile: UserProfile,
  latestResponse: String,
  isLoading: Boolean,
  onAskAi: (String) -> Unit,
  modifier: Modifier = Modifier
) {
  var userPrompt by remember { mutableStateOf("") }

  val sampleQuestions = listOf(
    "Where should I go for the crunchiest Podi Dosa in Bengaluru?",
    "Best sunset rooftop with spicy food in Mumbai",
    "Compare Toit Brewpub vs The Permit Room for my palate",
    "Recommend 3 must-try signature dishes for my spice tolerance",
    "Best artisanal sourdough & pour-over cafes in India"
  )

  Column(
    modifier = modifier
      .fillMaxSize()
      .background(ZestGunmetalDark)
      .verticalScroll(rememberScrollState())
      .padding(16.dp)
      .padding(top = 28.dp, bottom = 48.dp)
      .testTag("palate_ai_screen")
  ) {
    // Header
    Row(
      modifier = Modifier.fillMaxWidth(),
      horizontalArrangement = Arrangement.SpaceBetween,
      verticalAlignment = Alignment.CenterVertically
    ) {
      Column {
        Text(
          text = "Palate AI Advisor",
          style = MaterialTheme.typography.headlineMedium,
          fontWeight = FontWeight.Bold,
          color = ZestOffWhite
        )
        Text(
          text = "Real-time culinary intelligence powered by Gemini 3.5 Flash",
          style = MaterialTheme.typography.bodyMedium,
          color = ZestSaffron,
          fontWeight = FontWeight.Medium
        )
      }

      Surface(
        shape = CircleShape,
        color = ZestGunmetalSurface,
        border = androidx.compose.foundation.BorderStroke(1.dp, ZestMoonstone),
        modifier = Modifier.size(46.dp)
      ) {
        Box(contentAlignment = Alignment.Center) {
          Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = ZestSaffron)
        }
      }
    }

    Spacer(modifier = Modifier.height(14.dp))

    // Active Palate DNA Summary Pill
    Surface(
      shape = RoundedCornerShape(14.dp),
      color = ZestGunmetalSurface,
      border = androidx.compose.foundation.BorderStroke(1.dp, ZestMoonstone.copy(alpha = 0.35f)),
      modifier = Modifier.fillMaxWidth()
    ) {
      Row(
        modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
      ) {
        Icon(Icons.Default.Psychology, contentDescription = null, tint = ZestSaffron, modifier = Modifier.size(24.dp))
        Spacer(modifier = Modifier.width(10.dp))
        Column {
          Text(
            text = "Active Palate DNA: ${userProfile.tastePersona}",
            style = MaterialTheme.typography.labelMedium,
            fontWeight = FontWeight.Bold,
            color = ZestPureWhite
          )
          Text(
            text = "Spice: ${userProfile.spiceTolerance}/3 • ${userProfile.dietaryPreference.label} • ${userProfile.userCity}",
            style = MaterialTheme.typography.bodySmall,
            color = ZestLightBlue
          )
        }
      }
    }

    Spacer(modifier = Modifier.height(20.dp))

    // Query Input Field
    OutlinedTextField(
      value = userPrompt,
      onValueChange = { userPrompt = it },
      placeholder = { Text("Ask anything about dishes, flavors, or places...", color = ZestGunmetalMuted) },
      trailingIcon = {
        IconButton(
          onClick = {
            if (userPrompt.isNotBlank()) {
              onAskAi(userPrompt)
              userPrompt = ""
            }
          },
          enabled = userPrompt.isNotBlank() && !isLoading,
          modifier = Modifier.testTag("palate_ai_send_button")
        ) {
          Icon(
            Icons.AutoMirrored.Filled.Send,
            contentDescription = "Send",
            tint = if (userPrompt.isNotBlank() && !isLoading) ZestSaffron else ZestGunmetalMuted
          )
        }
      },
      modifier = Modifier
        .fillMaxWidth()
        .testTag("palate_ai_input_field"),
      shape = RoundedCornerShape(18.dp),
      colors = OutlinedTextFieldDefaults.colors(
        focusedContainerColor = ZestGunmetalSurface,
        unfocusedContainerColor = ZestGunmetalSurface,
        focusedTextColor = ZestPureWhite,
        unfocusedTextColor = ZestOffWhite,
        focusedBorderColor = ZestSaffron,
        unfocusedBorderColor = ZestMoonstone.copy(alpha = 0.4f)
      )
    )

    Spacer(modifier = Modifier.height(14.dp))

    // Suggested Questions Chips
    Text(
      text = "Suggested Questions",
      style = MaterialTheme.typography.titleSmall,
      fontWeight = FontWeight.Bold,
      color = ZestOffWhite
    )
    Spacer(modifier = Modifier.height(8.dp))

    FlowRow(
      horizontalArrangement = Arrangement.spacedBy(8.dp),
      verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
      sampleQuestions.forEach { question ->
        Surface(
          shape = RoundedCornerShape(12.dp),
          color = ZestGunmetalSurface,
          border = androidx.compose.foundation.BorderStroke(1.dp, ZestMoonstone.copy(alpha = 0.3f)),
          modifier = Modifier
            .clickable {
              userPrompt = question
              onAskAi(question)
            }
            .testTag("ai_suggested_chip_${question.take(5)}")
        ) {
          Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 7.dp),
            verticalAlignment = Alignment.CenterVertically
          ) {
            Icon(Icons.Default.Lightbulb, contentDescription = null, tint = ZestSaffron, modifier = Modifier.size(15.dp))
            Spacer(modifier = Modifier.width(6.dp))
            Text(
              text = question,
              style = MaterialTheme.typography.labelSmall,
              color = ZestLightBlueSoft
            )
          }
        }
      }
    }

    Spacer(modifier = Modifier.height(24.dp))

    // AI Response Card
    Text(
      text = "Palate AI Recommendation",
      style = MaterialTheme.typography.titleMedium,
      fontWeight = FontWeight.Bold,
      color = ZestOffWhite
    )
    Spacer(modifier = Modifier.height(8.dp))

    Card(
      shape = RoundedCornerShape(20.dp),
      colors = CardDefaults.cardColors(containerColor = ZestGunmetalSurface),
      border = androidx.compose.foundation.BorderStroke(1.5.dp, ZestMoonstone.copy(alpha = 0.5f)),
      elevation = CardDefaults.cardElevation(5.dp),
      modifier = Modifier.fillMaxWidth().testTag("palate_ai_response_card")
    ) {
      Column(modifier = Modifier.padding(20.dp)) {
        Row(
          modifier = Modifier.fillMaxWidth(),
          horizontalArrangement = Arrangement.SpaceBetween,
          verticalAlignment = Alignment.CenterVertically
        ) {
          Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
              modifier = Modifier
                .size(32.dp)
                .background(ZestSaffron, CircleShape),
              contentAlignment = Alignment.Center
            ) {
              Text("P", color = ZestGunmetalDark, fontWeight = FontWeight.ExtraBold, fontSize = 16.sp)
            }
            Spacer(modifier = Modifier.width(10.dp))
            Text(
              text = "Palateo Engine",
              style = MaterialTheme.typography.titleMedium,
              fontWeight = FontWeight.Bold,
              color = ZestSaffron
            )
          }

          if (isLoading) {
            CircularProgressIndicator(
              modifier = Modifier.size(20.dp),
              strokeWidth = 2.5.dp,
              color = ZestSaffron
            )
          }
        }

        Spacer(modifier = Modifier.height(14.dp))

        if (isLoading) {
          Text(
            text = "Analyzing regional Indian spice layers and matching against your Palate Genome...",
            style = MaterialTheme.typography.bodyMedium,
            color = ZestLightBlue
          )
        } else {
          Text(
            text = latestResponse,
            style = MaterialTheme.typography.bodyLarge,
            lineHeight = 24.sp,
            color = ZestPureWhite
          )
        }
      }
    }
  }
}

package com.example.ui.components

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.gestures.rememberTransformableState
import androidx.compose.foundation.gestures.transformable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Explore
import androidx.compose.material.icons.filled.Layers
import androidx.compose.material.icons.filled.MyLocation
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.FloatingActionButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.Restaurant
import com.example.ui.theme.ZestGunmetal
import com.example.ui.theme.ZestGunmetalCard
import com.example.ui.theme.ZestGunmetalDark
import com.example.ui.theme.ZestGunmetalDeeper
import com.example.ui.theme.ZestGunmetalMuted
import com.example.ui.theme.ZestGunmetalSurface
import com.example.ui.theme.ZestLightBlue
import com.example.ui.theme.ZestMoonstone
import com.example.ui.theme.ZestMoonstoneDark
import com.example.ui.theme.ZestPureWhite
import com.example.ui.theme.ZestSaffron
import com.example.ui.theme.ZestSaffronDark
import com.example.ui.theme.ZestSaffronLight
import com.example.ui.theme.ZestSpicyFlame
import com.example.ui.theme.ZestVegGreen
import kotlin.math.sqrt

@Composable
fun ZestMapCanvas(
  city: String,
  restaurants: List<Restaurant>,
  selectedRestaurantId: String?,
  onRestaurantSelected: (String) -> Unit,
  matchScoreProvider: (Restaurant) -> Int,
  modifier: Modifier = Modifier
) {
  var scale by remember { mutableFloatStateOf(1.0f) }
  var offset by remember { mutableStateOf(Offset.Zero) }
  var showHeatmap by remember { mutableStateOf(false) }

  // Pulsing animation for selected restaurant pin
  val infiniteTransition = rememberInfiniteTransition(label = "pulse")
  val pulseRadius by infiniteTransition.animateFloat(
    initialValue = 26f,
    targetValue = 54f,
    animationSpec = infiniteRepeatable(
      animation = tween(1500, easing = FastOutSlowInEasing),
      repeatMode = RepeatMode.Restart
    ),
    label = "pulseRadius"
  )
  val pulseAlpha by infiniteTransition.animateFloat(
    initialValue = 0.85f,
    targetValue = 0.0f,
    animationSpec = infiniteRepeatable(
      animation = tween(1500, easing = FastOutSlowInEasing),
      repeatMode = RepeatMode.Restart
    ),
    label = "pulseAlpha"
  )

  val transformState = rememberTransformableState { zoomChange, offsetChange, _ ->
    scale = (scale * zoomChange).coerceIn(0.7f, 2.8f)
    offset += offsetChange
  }

  Box(modifier = modifier.testTag("zest_map_container")) {
    Canvas(
      modifier = Modifier
        .fillMaxSize()
        .transformable(state = transformState)
        .pointerInput(restaurants, scale, offset) {
          detectTapGestures { tapOffset: Offset ->
            val hitRadiusPx = 80f
            var closestId: String? = null
            var minDistance = Float.MAX_VALUE

            for (restaurant in restaurants) {
              val pinX = (restaurant.mapCoordX * size.width) * scale + offset.x
              val pinY = (restaurant.mapCoordY * size.height) * scale + offset.y
              val dx = tapOffset.x - pinX
              val dy = tapOffset.y - pinY
              val dist = sqrt((dx * dx + dy * dy).toDouble()).toFloat()
              if (dist < hitRadiusPx && dist < minDistance) {
                minDistance = dist
                closestId = restaurant.id
              }
            }

            if (closestId != null) {
              onRestaurantSelected(closestId)
            }
          }
        }
    ) {
      val canvasWidth = size.width
      val canvasHeight = size.height

      // 1. Zest Maps Deep Gunmetal Base Terrain
      drawRect(
        brush = Brush.radialGradient(
          colors = listOf(
            ZestGunmetalSurface,
            ZestGunmetalDark,
            ZestGunmetalDeeper
          ),
          center = Offset(canvasWidth * 0.5f * scale + offset.x, canvasHeight * 0.5f * scale + offset.y),
          radius = canvasWidth * 0.9f * scale
        )
      )

      // 2. Micro Map Texture Grid & Coordinates
      drawZestMicroGrid(canvasWidth, canvasHeight, scale, offset)

      // 3. Stylized City Geography (Moonstone coastal lines, lakes, park contours)
      drawZestGeography(city, canvasWidth, canvasHeight, scale, offset)

      // 4. District / Neighborhood Typography Labels (Zest Maps characteristic)
      drawNeighborhoodWatermarks(city, canvasWidth, canvasHeight, scale, offset)

      // 5. Palate Heatmap overlay (if toggled)
      if (showHeatmap) {
        for (restaurant in restaurants) {
          val screenX = (restaurant.mapCoordX * canvasWidth) * scale + offset.x
          val screenY = (restaurant.mapCoordY * canvasHeight) * scale + offset.y
          val score = matchScoreProvider(restaurant)
          val heatRadius = (score * 1.6f) * scale
          drawCircle(
            brush = Brush.radialGradient(
              colors = listOf(
                ZestSaffron.copy(alpha = 0.35f),
                ZestMoonstone.copy(alpha = 0.15f),
                Color.Transparent
              ),
              center = Offset(screenX, screenY),
              radius = heatRadius
            ),
            radius = heatRadius,
            center = Offset(screenX, screenY)
          )
        }
      }

      // 6. Zest Style Pins
      for (restaurant in restaurants) {
        val isSelected = restaurant.id == selectedRestaurantId
        val score = matchScoreProvider(restaurant)

        val screenX = (restaurant.mapCoordX * canvasWidth) * scale + offset.x
        val screenY = (restaurant.mapCoordY * canvasHeight) * scale + offset.y

        drawZestPin(
          x = screenX,
          y = screenY,
          restaurant = restaurant,
          matchScore = score,
          isSelected = isSelected,
          pulseRadius = pulseRadius,
          pulseAlpha = pulseAlpha
        )
      }
    }

    // Top Right Radar Badge
    Surface(
      shape = RoundedCornerShape(20.dp),
      color = ZestGunmetal.copy(alpha = 0.88f),
      border = androidx.compose.foundation.BorderStroke(1.dp, ZestMoonstone.copy(alpha = 0.4f)),
      modifier = Modifier
        .align(Alignment.TopEnd)
        .padding(top = 110.dp, end = 16.dp)
    ) {
      Row(
        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically
      ) {
        Box(
          modifier = Modifier
            .size(8.dp)
            .background(ZestSaffron, CircleShape)
        )
        Spacer(modifier = Modifier.width(6.dp))
        Text(
          text = "PALATE RADAR • $city",
          style = MaterialTheme.typography.labelSmall,
          fontWeight = FontWeight.Bold,
          color = ZestLightBlue,
          fontSize = 11.sp
        )
      }
    }

    // Floating Map HUD Controls (Zest Style on Right Edge)
    Column(
      modifier = Modifier
        .align(Alignment.BottomEnd)
        .padding(end = 16.dp, bottom = 220.dp),
      verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
      // Heatmap toggle
      FloatingActionButton(
        onClick = { showHeatmap = !showHeatmap },
        containerColor = if (showHeatmap) ZestSaffron else ZestGunmetalCard,
        contentColor = if (showHeatmap) ZestGunmetalDark else ZestLightBlue,
        elevation = FloatingActionButtonDefaults.elevation(4.dp),
        modifier = Modifier
          .size(44.dp)
          .testTag("map_heatmap_toggle")
      ) {
        Icon(Icons.Default.Layers, contentDescription = "Toggle Palate Heatmap", modifier = Modifier.size(20.dp))
      }

      // Compass Reset
      FloatingActionButton(
        onClick = {
          scale = 1.0f
          offset = Offset.Zero
        },
        containerColor = ZestGunmetalCard,
        contentColor = ZestLightBlue,
        elevation = FloatingActionButtonDefaults.elevation(4.dp),
        modifier = Modifier
          .size(44.dp)
          .testTag("map_recenter_button")
      ) {
        Icon(Icons.Default.Explore, contentDescription = "North Compass", modifier = Modifier.size(20.dp))
      }

      // Recenter Location
      FloatingActionButton(
        onClick = {
          scale = 1.2f
          offset = Offset.Zero
        },
        containerColor = ZestGunmetalCard,
        contentColor = ZestSaffron,
        elevation = FloatingActionButtonDefaults.elevation(4.dp),
        modifier = Modifier
          .size(44.dp)
          .testTag("map_mylocation_button")
      ) {
        Icon(Icons.Default.MyLocation, contentDescription = "Center city", modifier = Modifier.size(20.dp))
      }

      // Zoom In
      FloatingActionButton(
        onClick = { scale = (scale + 0.35f).coerceAtMost(2.8f) },
        containerColor = ZestGunmetalCard,
        contentColor = ZestPureWhite,
        elevation = FloatingActionButtonDefaults.elevation(4.dp),
        modifier = Modifier
          .size(44.dp)
          .testTag("map_zoom_in_button")
      ) {
        Icon(Icons.Default.Add, contentDescription = "Zoom In", modifier = Modifier.size(20.dp))
      }

      // Zoom Out
      FloatingActionButton(
        onClick = { scale = (scale - 0.35f).coerceAtLeast(0.7f) },
        containerColor = ZestGunmetalCard,
        contentColor = ZestPureWhite,
        elevation = FloatingActionButtonDefaults.elevation(4.dp),
        modifier = Modifier
          .size(44.dp)
          .testTag("map_zoom_out_button")
      ) {
        Icon(Icons.Default.Remove, contentDescription = "Zoom Out", modifier = Modifier.size(20.dp))
      }
    }
  }
}

private fun DrawScope.drawZestMicroGrid(
  width: Float,
  height: Float,
  scale: Float,
  offset: Offset
) {
  val dotColor = ZestMoonstone.copy(alpha = 0.08f)
  val step = 60f * scale
  val startX = (offset.x % step)
  val startY = (offset.y % step)

  var x = startX
  while (x < width) {
    var y = startY
    while (y < height) {
      drawCircle(
        color = dotColor,
        radius = 1.5f,
        center = Offset(x, y)
      )
      y += step
    }
    x += step
  }
}

private fun DrawScope.drawZestGeography(
  city: String,
  width: Float,
  height: Float,
  scale: Float,
  offset: Offset
) {
  val waterBase = ZestMoonstone.copy(alpha = 0.30f)
  val waterHighlight = ZestLightBlue.copy(alpha = 0.22f)
  val parkColor = Color(0xFF1E3A33).copy(alpha = 0.45f)
  val parkBorder = ZestMoonstone.copy(alpha = 0.25f)

  val roadSecondary = Color(0xFF243F44)
  val roadPrimary = Color(0xFF335860)
  val roadGlow = ZestLightBlue.copy(alpha = 0.18f)

  // 1. Water bodies & Coastlines
  when (city) {
    "Mumbai" -> {
      val bayPath = Path().apply {
        moveTo(0f, 0f)
        lineTo(width * 0.28f * scale + offset.x, 0f)
        cubicTo(
          width * 0.35f * scale + offset.x, height * 0.32f * scale + offset.y,
          width * 0.20f * scale + offset.x, height * 0.65f * scale + offset.y,
          width * 0.30f * scale + offset.x, height
        )
        lineTo(0f, height)
        close()
      }
      drawPath(bayPath, waterBase)
      drawPath(bayPath, waterHighlight, style = Stroke(width = 8f * scale))
    }
    "Goa" -> {
      val seaPath = Path().apply {
        moveTo(0f, 0f)
        lineTo(width * 0.32f * scale + offset.x, 0f)
        cubicTo(
          width * 0.24f * scale + offset.x, height * 0.45f * scale + offset.y,
          width * 0.38f * scale + offset.x, height * 0.75f * scale + offset.y,
          width * 0.26f * scale + offset.x, height
        )
        lineTo(0f, height)
        close()
      }
      drawPath(seaPath, waterBase)
      drawPath(seaPath, waterHighlight, style = Stroke(width = 10f * scale))
    }
    "Kolkata" -> {
      val hooghly = Path().apply {
        moveTo(width * 0.38f * scale + offset.x, 0f)
        cubicTo(
          width * 0.28f * scale + offset.x, height * 0.38f * scale + offset.y,
          width * 0.44f * scale + offset.x, height * 0.68f * scale + offset.y,
          width * 0.34f * scale + offset.x, height
        )
      }
      drawPath(hooghly, waterBase, style = Stroke(width = 44f * scale))
      drawPath(hooghly, waterHighlight, style = Stroke(width = 8f * scale))
    }
    else -> {
      // Bengaluru / Delhi / Hyderabad: Urban Lakes (e.g., Ulsoor Lake, Hussain Sagar)
      val lakeCenter = Offset(width * 0.82f * scale + offset.x, height * 0.36f * scale + offset.y)
      drawCircle(
        color = waterBase,
        radius = 80f * scale,
        center = lakeCenter
      )
      drawCircle(
        color = waterHighlight,
        radius = 80f * scale,
        center = lakeCenter,
        style = Stroke(width = 4f * scale)
      )

      // Urban Parks (e.g., Cubbon Park, Lodhi Gardens)
      drawRoundRect(
        color = parkColor,
        topLeft = Offset(width * 0.22f * scale + offset.x, height * 0.62f * scale + offset.y),
        size = Size(140f * scale, 95f * scale),
        cornerRadius = CornerRadius(20f * scale, 20f * scale)
      )
      drawRoundRect(
        color = parkBorder,
        topLeft = Offset(width * 0.22f * scale + offset.x, height * 0.62f * scale + offset.y),
        size = Size(140f * scale, 95f * scale),
        cornerRadius = CornerRadius(20f * scale, 20f * scale),
        style = Stroke(width = 2f * scale)
      )
    }
  }

  // 2. Arterial Road Network (Zest Aesthetic Grid)
  // Horizontal Expressways
  drawLine(roadPrimary, Offset(0f, height * 0.36f * scale + offset.y), Offset(width, height * 0.36f * scale + offset.y), strokeWidth = 10f * scale)
  drawLine(roadGlow, Offset(0f, height * 0.36f * scale + offset.y), Offset(width, height * 0.36f * scale + offset.y), strokeWidth = 2f * scale)

  drawLine(roadPrimary, Offset(0f, height * 0.58f * scale + offset.y), Offset(width, height * 0.58f * scale + offset.y), strokeWidth = 14f * scale)
  drawLine(roadGlow, Offset(0f, height * 0.58f * scale + offset.y), Offset(width, height * 0.58f * scale + offset.y), strokeWidth = 2.5f * scale)

  drawLine(roadSecondary, Offset(0f, height * 0.78f * scale + offset.y), Offset(width, height * 0.78f * scale + offset.y), strokeWidth = 6f * scale)

  // Vertical Boulevards
  drawLine(roadSecondary, Offset(width * 0.24f * scale + offset.x, 0f), Offset(width * 0.24f * scale + offset.x, height), strokeWidth = 6f * scale)
  drawLine(roadPrimary, Offset(width * 0.52f * scale + offset.x, 0f), Offset(width * 0.52f * scale + offset.x, height), strokeWidth = 14f * scale)
  drawLine(roadGlow, Offset(width * 0.52f * scale + offset.x, 0f), Offset(width * 0.52f * scale + offset.x, height), strokeWidth = 2.5f * scale)

  drawLine(roadSecondary, Offset(width * 0.76f * scale + offset.x, 0f), Offset(width * 0.76f * scale + offset.x, height), strokeWidth = 6f * scale)

  // Diagonal Connector Avenue (100ft road style)
  drawLine(
    roadPrimary,
    Offset(width * 0.12f * scale + offset.x, height * 0.24f * scale + offset.y),
    Offset(width * 0.88f * scale + offset.x, height * 0.82f * scale + offset.y),
    strokeWidth = 7f * scale
  )
}

private fun DrawScope.drawNeighborhoodWatermarks(
  city: String,
  width: Float,
  height: Float,
  scale: Float,
  offset: Offset
) {
  val textPaint = android.graphics.Paint().apply {
    color = android.graphics.Color.parseColor("#45727A")
    textSize = (22f * scale).coerceIn(14f, 32f)
    isFakeBoldText = true
    letterSpacing = 0.22f
    isAntiAlias = true
  }

  val neighborhoods = when (city) {
    "Bengaluru" -> listOf(
      Triple("INDIRANAGAR", width * 0.64f, height * 0.38f),
      Triple("CHURCH STREET", width * 0.44f, height * 0.46f),
      Triple("MALLESHWARAM", width * 0.28f, height * 0.26f),
      Triple("KORAMANGALA", width * 0.60f, height * 0.72f)
    )
    "Mumbai" -> listOf(
      Triple("BANDRA WEST", width * 0.36f, height * 0.34f),
      Triple("LOWER PAREL", width * 0.46f, height * 0.56f),
      Triple("KALA GHODA", width * 0.44f, height * 0.80f)
    )
    "Delhi NCR" -> listOf(
      Triple("OLD DELHI", width * 0.44f, height * 0.28f),
      Triple("LODHI ESTATE", width * 0.48f, height * 0.52f),
      Triple("PRAGATI MAIDAN", width * 0.62f, height * 0.42f)
    )
    "Goa" -> listOf(
      Triple("ASSAGAO", width * 0.48f, height * 0.36f),
      Triple("ANJUNA", width * 0.32f, height * 0.52f)
    )
    else -> listOf(
      Triple("CULINARY QUARTER", width * 0.45f, height * 0.40f)
    )
  }

  neighborhoods.forEach { (name, nx, ny) ->
    val x = nx * scale + offset.x
    val y = ny * scale + offset.y
    drawContext.canvas.nativeCanvas.drawText(name, x, y, textPaint)
  }
}

private fun DrawScope.drawZestPin(
  x: Float,
  y: Float,
  restaurant: Restaurant,
  matchScore: Int,
  isSelected: Boolean,
  pulseRadius: Float,
  pulseAlpha: Float
) {
  // Pin theme accents
  val pinCoreColor = when {
    restaurant.isPureVeg -> ZestVegGreen
    restaurant.servesCraftBeer -> ZestSaffron
    restaurant.spiceLevel >= 3 -> ZestSpicyFlame
    else -> ZestMoonstone
  }

  // Symbol or emoji representation for Zest pin
  val pinEmoji = when {
    restaurant.servesCraftBeer -> "🍺"
    restaurant.cuisineList.any { it.contains("Coffee", true) || it.contains("Bakes", true) } -> "☕"
    restaurant.isPureVeg -> "🌱"
    restaurant.spiceLevel >= 3 -> "🌶️"
    restaurant.hasRooftop -> "🌅"
    restaurant.cuisineList.any { it.contains("Pizza", true) || it.contains("Sourdough", true) } -> "🍕"
    else -> "🥘"
  }

  // 1. Pulsing Rings if selected
  if (isSelected) {
    // Saffron outer pulse
    drawCircle(
      color = ZestSaffron.copy(alpha = pulseAlpha),
      radius = pulseRadius,
      center = Offset(x, y),
      style = Stroke(width = 3.5f)
    )
    // Moonstone inner ring
    drawCircle(
      color = ZestMoonstone.copy(alpha = 0.4f),
      radius = 32f,
      center = Offset(x, y),
      style = Stroke(width = 2f)
    )
  }

  // 2. Drop Shadow under pin
  drawCircle(
    color = Color.Black.copy(alpha = 0.5f),
    radius = if (isSelected) 22f else 17f,
    center = Offset(x, y + 5f)
  )

  // 3. Crisp White Outer Ring
  drawCircle(
    color = if (isSelected) ZestPureWhite else ZestLightBlue,
    radius = if (isSelected) 22f else 17f,
    center = Offset(x, y)
  )

  // 4. Pin Core
  drawCircle(
    color = pinCoreColor,
    radius = if (isSelected) 18f else 14f,
    center = Offset(x, y)
  )

  // 5. Draw Emoji in pin center
  val emojiPaint = android.graphics.Paint().apply {
    textSize = if (isSelected) 20f else 15f
    textAlign = android.graphics.Paint.Align.CENTER
    isAntiAlias = true
  }
  drawContext.canvas.nativeCanvas.drawText(
    pinEmoji,
    x,
    y + if (isSelected) 7f else 5f,
    emojiPaint
  )

  // 6. Floating Zest Match Score Pill above Pin (In Saffron #FFC64F with Gunmetal Text)
  val badgeWidth = if (isSelected) 84f else 70f
  val badgeHeight = if (isSelected) 28f else 22f
  val badgeTop = y - (if (isSelected) 42f else 34f)

  // Pill Shadow
  drawRoundRect(
    color = Color.Black.copy(alpha = 0.35f),
    topLeft = Offset(x - badgeWidth / 2f, badgeTop + 2f),
    size = Size(badgeWidth, badgeHeight),
    cornerRadius = CornerRadius(14f, 14f)
  )

  // Saffron Pill Background
  drawRoundRect(
    color = if (isSelected) ZestSaffron else ZestSaffronLight,
    topLeft = Offset(x - badgeWidth / 2f, badgeTop),
    size = Size(badgeWidth, badgeHeight),
    cornerRadius = CornerRadius(14f, 14f)
  )

  // Pill Outline in Gunmetal
  drawRoundRect(
    color = ZestGunmetal.copy(alpha = 0.35f),
    topLeft = Offset(x - badgeWidth / 2f, badgeTop),
    size = Size(badgeWidth, badgeHeight),
    cornerRadius = CornerRadius(14f, 14f),
    style = Stroke(width = 1.2f)
  )

  // Match Text inside Saffron Pill (Gunmetal Bold Text)
  val scorePaint = android.graphics.Paint().apply {
    color = android.graphics.Color.parseColor("#20373B") // Gunmetal
    textSize = if (isSelected) 17f else 14f
    isFakeBoldText = true
    textAlign = android.graphics.Paint.Align.CENTER
    isAntiAlias = true
  }

  val scoreText = "$matchScore%"
  drawContext.canvas.nativeCanvas.drawText(
    scoreText,
    x,
    badgeTop + badgeHeight * 0.72f,
    scorePaint
  )

  // 7. If selected: Draw restaurant preview name badge below
  if (isSelected) {
    val nameWidth = (restaurant.name.length * 15f).coerceIn(160f, 280f)
    val nameHeight = 36f
    val nameTop = y + 26f

    // Background pill in Gunmetal
    drawRoundRect(
      color = ZestGunmetal.copy(alpha = 0.95f),
      topLeft = Offset(x - nameWidth / 2f, nameTop),
      size = Size(nameWidth, nameHeight),
      cornerRadius = CornerRadius(18f, 18f)
    )

    // Border in Moonstone
    drawRoundRect(
      color = ZestMoonstone,
      topLeft = Offset(x - nameWidth / 2f, nameTop),
      size = Size(nameWidth, nameHeight),
      cornerRadius = CornerRadius(18f, 18f),
      style = Stroke(width = 1.8f)
    )

    val labelPaint = android.graphics.Paint().apply {
      color = android.graphics.Color.WHITE
      textSize = 19f
      isFakeBoldText = true
      textAlign = android.graphics.Paint.Align.CENTER
      isAntiAlias = true
    }

    drawContext.canvas.nativeCanvas.drawText(
      restaurant.name,
      x,
      nameTop + nameHeight * 0.68f,
      labelPaint
    )
  }
}

package com.example.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme =
  darkColorScheme(
    primary = ZestMoonstone,
    onPrimary = ZestPureWhite,
    primaryContainer = ZestGunmetalCard,
    onPrimaryContainer = ZestLightBlue,
    secondary = ZestSaffron,
    onSecondary = ZestGunmetalDark,
    secondaryContainer = ZestGunmetalSurface,
    onSecondaryContainer = ZestSaffronLight,
    tertiary = ZestLightBlue,
    onTertiary = ZestGunmetalDark,
    tertiaryContainer = ZestMoonstoneDark,
    onTertiaryContainer = ZestPureWhite,
    background = ZestGunmetalDark,
    onBackground = ZestOffWhite,
    surface = ZestGunmetalSurface,
    onSurface = ZestOffWhite,
    surfaceVariant = ZestGunmetalCard,
    onSurfaceVariant = ZestLightBlueSoft,
    outline = ZestGunmetalMuted
  )

private val LightColorScheme =
  lightColorScheme(
    primary = ZestMoonstoneDark,
    onPrimary = ZestPureWhite,
    primaryContainer = ZestLightBlueContainer,
    onPrimaryContainer = ZestGunmetal,
    secondary = ZestSaffronDark,
    onSecondary = ZestPureWhite,
    secondaryContainer = ZestSaffronContainer,
    onSecondaryContainer = ZestGunmetalDark,
    tertiary = ZestMoonstone,
    onTertiary = ZestPureWhite,
    tertiaryContainer = ZestLightBlue,
    onTertiaryContainer = ZestGunmetal,
    background = ZestOffWhite,
    onBackground = ZestGunmetal,
    surface = ZestPureWhite,
    onSurface = ZestGunmetal,
    surfaceVariant = ZestLightBlueSoft,
    onSurfaceVariant = ZestMoonstoneDark,
    outline = ZestGunmetalMuted
  )

@Composable
fun MyApplicationTheme(
  darkTheme: Boolean = true, // Default to rich Zest Gunmetal aesthetic
  dynamicColor: Boolean = false,
  content: @Composable () -> Unit,
) {
  val colorScheme =
    when {
      dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
        val context = LocalContext.current
        if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
      }
      darkTheme -> DarkColorScheme
      else -> LightColorScheme
    }

  MaterialTheme(
    colorScheme = colorScheme,
    typography = Typography,
    content = content
  )
}

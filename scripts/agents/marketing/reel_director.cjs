const BaseAgent = require('../core/agent_base.cjs');
const path = require('node:path');
const fs = require('node:fs');

class ReelDirectorAgent extends BaseAgent {
  constructor() {
    super(
      'marketing:reel_director',
      'Instagram Reel Director',
      'Directs, scripts, and produces high-retention 9:16 viral Instagram Reels featuring curated dining spots, taste science, and food discovery.'
    );
  }

  getTrendingFormats() {
    return [
      {
        id: 'pov_decision_paralysis',
        archetype: 'Relatable Dining Dilemma',
        title: 'POV: 45 Minutes of "Where Should We Eat?"',
        city: 'Mumbai',
        estimatedRetentionScore: 94,
        hook: 'POV: You and your group have been arguing about dinner for 45 minutes.',
        subHook: 'Stop doom-scrolling 4.2-star reviews that all taste the same.',
        audio: {
          name: 'Funny Relatable Lo-Fi / Beat Drop (Trending Audio)',
          bpm: 118,
          vibe: 'Comedic build-up into smooth satisfaction drop'
        },
        scenes: [
          {
            scene: 1,
            time: '0.0s - 2.5s',
            visual: 'Fast montage of endless food apps scrolling with frustration',
            onScreenText: 'POV: Spending 45 mins arguing where to eat 🤦‍♂️',
            voiceover: 'POV: You are starving, but nobody in the group can agree on where to go.'
          },
          {
            scene: 2,
            time: '2.5s - 6.0s',
            visual: 'Splitscreen: One person wants spicy street food, one wants quiet cocktails',
            onScreenText: 'Friend A: Spicy street food 🌶️\nFriend B: Aesthetic cocktail bar 🍸',
            voiceover: 'One wants fiery regional spices, the other wants a quiet craft cocktail lounge.'
          },
          {
            scene: 3,
            time: '6.0s - 10.0s',
            visual: 'Palateo Taste Quiz running on mobile: tapping spice tolerance & budget',
            onScreenText: 'The Fix: 60-Second Palateo Taste Quiz ✨',
            voiceover: 'Instead of guessing, we ran our preferences through Palateo in 60 seconds.'
          },
          {
            scene: 4,
            time: '10.0s - 13.5s',
            visual: 'Instant Match: The Bombay Canteen / O Pedro with Eggs Kejriwal & Craft Drinks',
            onScreenText: 'Instant Match: The Bombay Canteen (Lower Parel) 🍽️',
            voiceover: 'Boom. The exact match that hit both flavor profiles without a single argument.'
          },
          {
            scene: 5,
            time: '13.5s - 15.0s',
            visual: 'App CTA screen with radar chart & Save Reel prompt',
            onScreenText: 'Comment "EAT" for your personalized link! 📲',
            voiceover: 'Comment "EAT" and I will send you the direct quiz link. Save this for Friday!'
          }
        ],
        caption: `Be honest: how many friendships have been tested by the question "Where do you wanna eat?" 💀

You scroll Zomato for 45 minutes, every place has a 4.2 rating, and you end up at the same tired cafe you went to last week.

We built Palateo to solve dining decision paralysis once and for all:
1. 8 quick questions (spice tolerance, vibe, budget, flavor biases)
2. Zero fake 5-star spam reviews
3. Exact restaurant recommendations that match your actual palate

👉 Comment "EAT" below and we'll DM you the free 60-second quiz! Or hit the link in bio.

Save this for your next weekend food debate! 📌

#Palateo #FoodDecisions #WhereToEat #MumbaiFoodie #FoodReels #IndianFoodie #TasteQuiz #WeekendEats #BandraEats #FoodDiscovery #DiningOut #MumbaiRestaurants #FoodieHacks`,
        commentTrigger: 'EAT',
        tags: ['#Palateo', '#FoodDecisions', '#WhereToEat', '#MumbaiFoodie', '#TasteQuiz']
      },

      {
        id: 'hidden_gems_bengaluru',
        archetype: 'Hyper-Local Insider Guide',
        title: '3 Secret Dining Spots in Bengaluru You Walk Past Every Day',
        city: 'Bengaluru',
        estimatedRetentionScore: 92,
        hook: '3 spots in Bengaluru locals are lowkey gatekeeping.',
        subHook: 'Beyond the crowded brewery belt.',
        audio: {
          name: 'Atmospheric Downtempo / Chic House (Trending Audio)',
          bpm: 122,
          vibe: 'Sophisticated, modern urban groove'
        },
        scenes: [
          {
            scene: 1,
            time: '0.0s - 2.5s',
            visual: 'Aesthetic slow-mo shot of bubbling ghee podi on crisp dosa',
            onScreenText: 'Stop going to the same 3 spots in Indiranagar 🛑',
            voiceover: 'If you live in Bangalore, stop going to the same three crowded places every weekend.'
          },
          {
            scene: 2,
            time: '2.5s - 6.0s',
            visual: 'Spot 1: Subko Coffee Roasters & Bakehouse in Indiranagar',
            onScreenText: 'Spot 1: Subko Bakehouse (Sourdough & Podi Toast) ☕',
            voiceover: 'First: Subko in Indiranagar. Their artisanal sourdough and house brew hits different.'
          },
          {
            scene: 3,
            time: '6.0s - 9.5s',
            visual: 'Spot 2: Lupa on MG Road - European charcuterie & house pasta',
            onScreenText: 'Spot 2: Lupa (MG Road) &bull; European Craft 🍝',
            voiceover: 'Second: Lupa on MG Road. Unbelievable handmade pasta and zero generic food slop.'
          },
          {
            scene: 4,
            time: '9.5s - 13.0s',
            visual: 'Spot 3: Toast & Tonic in Richmond Town - botanical cocktails',
            onScreenText: 'Spot 3: Toast & Tonic &bull; Botanical Dining 🍸',
            voiceover: 'Third: Toast and Tonic in Richmond Town. Botanical cocktails paired with local produce.'
          },
          {
            scene: 5,
            time: '13.0s - 15.0s',
            visual: 'Palateo app map with curated Bangalore pins',
            onScreenText: 'Find 40+ curated Bengaluru gems at palateo.in 📲',
            voiceover: 'All 40 curated Bangalore gems are live on Palateo. Link in bio!'
          }
        ],
        caption: `Bangalore food scene is incredible, but only if you know where to look. 🌿✨

Here are 3 culinary benchmarks that pass Palateo's taste intelligence with flying colors:

1. ☕ Subko Bakehouse (Indiranagar) - Artisanal viennoiserie and bean-to-bar chocolate.
2. 🍝 Lupa (MG Road) - Chef Manu Chandra's European craft institution.
3. 🍸 Toast & Tonic (Richmond Town) - Regional Indian botanical gins & comfort plates.

Want the full list with Google Maps coordinates and price tiers?

👉 Comment "BLR" and our AI concierge will DM you the curated list directly!

Save this reel for your Saturday plans 📌

#BengaluruFoodies #BangaloreEats #BangaloreCafes #Indiranagar #Palateo #TasteQuiz #FoodDiscovery #HiddenGemsBangalore #GourmetDining #CraftBeerCapital #BangaloreRestaurants`,
        commentTrigger: 'BLR',
        tags: ['#BengaluruFoodies', '#BangaloreEats', '#Subko', '#Lupa', '#Palateo']
      },

      {
        id: 'taste_psychology_roast',
        archetype: 'Contrarian Food Science',
        title: 'Why You Hate Your Best Friend\'s Favorite Restaurant',
        city: 'All Metros',
        estimatedRetentionScore: 96,
        hook: 'Why generic 5-star restaurant ratings are a lie.',
        subHook: 'The science of why your palate is 1 in a million.',
        audio: {
          name: 'Mysterious Deep Bass / Chill Synthwave (Trending Audio)',
          bpm: 115,
          vibe: 'Intriguing, intellectual, curiosity gap'
        },
        scenes: [
          {
            scene: 1,
            time: '0.0s - 2.5s',
            visual: 'Shocked reaction looking at a 4.9-star Google rating vs bland plate',
            onScreenText: 'Why 5-star ratings mean NOTHING for food 🚫⭐',
            voiceover: 'Ever wonder why you can hate a restaurant that literally has 5,000 five-star reviews?'
          },
          {
            scene: 2,
            time: '2.5s - 6.0s',
            visual: 'Diagram showing human palate differences: spice, umami, texture, acidity',
            onScreenText: 'Flavor is 8-Dimensional: Spice • Umami • Acidity • Texture',
            voiceover: 'Because taste is not universal. You might be ultra-sensitive to acidity, while your friend craves intense umami.'
          },
          {
            scene: 3,
            time: '6.0s - 10.0s',
            visual: 'Palateo 8-Axis Radar Chart adapting dynamically to diner answers',
            onScreenText: 'Palateo maps your unique 8-axis Dining Vector 📊',
            voiceover: 'Palateo maps your dining vector across eight distinct flavor axes in under 60 seconds.'
          },
          {
            scene: 4,
            time: '10.0s - 13.0s',
            visual: 'Recommendations filtered with 92% taste compatibility badge',
            onScreenText: 'Matched to YOUR palate, not the crowd 🎯',
            voiceover: 'Then it matches you with spots where people with your exact taste profile rave about the food.'
          },
          {
            scene: 5,
            time: '13.0s - 15.0s',
            visual: 'Call to action card with Palo companion animation',
            onScreenText: 'Discover your food vector &bull; Link in Bio (Free) 🚀',
            voiceover: 'Stop eating at places you secretly dislike. Take the quiz at palateo.in.'
          }
        ],
        caption: `Stop letting people with completely different palates tell you where to eat! 🧬🥘

If you love crisp, tangy South Indian breakfasts and light broths, why would you enjoy a heavy, cream-laden North Indian gravy spot just because it has 4.8 stars?

Taste isn't popular opinion. It's personal chemistry.

At Palateo, our algorithm evaluates:
🌶️ Spice threshold (from mild coconut soothing to Kolhapuri fire)
🥣 Textural bias (crunch vs silky slow-cooked)
🍋 Acid/Citrus balance
🌿 Ingredient ethics & price ergonomics

Take the free 60-second Taste Quiz at the link in bio!

👉 Comment "VECTOR" to get your personalized taste profile report.

#FoodScience #TastePsychology #Palateo #TasteQuiz #FoodieReels #FoodTech #SmartDining #GourmetFood #FoodDiscovery #IndianGastronomy`,
        commentTrigger: 'VECTOR',
        tags: ['#FoodScience', '#TastePsychology', '#Palateo', '#TasteQuiz', '#SmartDining']
      },

      {
        id: 'date_night_speakeasy',
        archetype: 'Moody Aesthetic & Romance',
        title: 'Secret Candlelit Date Night Spots That Guarantee a 10/10 Vibe',
        city: 'Delhi & Mumbai',
        estimatedRetentionScore: 91,
        hook: 'The date spots nobody tells you about.',
        subHook: 'Low lighting, unmatched cocktails, intimate tables.',
        audio: {
          name: 'Midnight Jazz / Velvet R&B Instrumental (Trending Audio)',
          bpm: 95,
          vibe: 'Sophisticated, romantic, smooth'
        },
        scenes: [
          {
            scene: 1,
            time: '0.0s - 2.5s',
            visual: 'Moody candle flicker with artisanal crystal glass and botanical smoke',
            onScreenText: 'Top secret date night dining spots 🕯️🍸',
            voiceover: 'Save this before your next date night. Three spots where the atmosphere does all the work.'
          },
          {
            scene: 2,
            time: '2.5s - 6.0s',
            visual: 'Interior of Olive Bar & Kitchen (Mehrauli/Bandra) under banyan trees',
            onScreenText: 'Olive Bar & Kitchen &bull; Mediterranean Courtyard 🌿',
            voiceover: 'Spot one: Olive. Mediterranean white courtyards, cobblestones, and incredible woodfired plates.'
          },
          {
            scene: 3,
            time: '6.0s - 9.5s',
            visual: 'Speakeasy craft cocktail pour with citrus smoke bubble',
            onScreenText: 'PCO / Pass Code Only &bull; Secret Phone Booth Speakeasy 📞',
            voiceover: 'Spot two: PCO. Enter through an old-school phone booth into pure jazz cocktail heaven.'
          },
          {
            scene: 4,
            time: '9.5s - 13.0s',
            visual: 'Palateo app romantic filter: "Quiet Vibe", "Date Night", "Craft Cocktails"',
            onScreenText: 'Filtered for romance with zero guesswork 🥂',
            voiceover: 'Palateo filters by noise level, lighting, and table spacing so you never get stuck at a noisy table.'
          },
          {
            scene: 5,
            time: '13.0s - 15.0s',
            visual: 'Final CTA with Save button pulse',
            onScreenText: 'Save this for your next date night! 📌 Link in Bio',
            voiceover: 'Send this to the person taking you out this weekend. Link in bio!'
          }
        ],
        caption: `Atmosphere matters just as much as the food on date night. 🕯️🥂

Nothing ruins a romantic evening faster than shouting across a table in an echoey restaurant with harsh white fluorescent lighting.

Here are the benchmarks for romance, craft cocktails, and quiet conversation:
1. 🌿 Olive Bar & Kitchen - Candlelit courtyard dining under ancient trees.
2. 📞 PCO - Secret speakeasy with bespoke cocktails tailored to your mood.

Want date night dining curated specifically to your budget and neighborhood?

👉 Head to the link in bio to take the Palateo Taste Quiz!
👉 Comment "DATE" and we'll DM you the top 10 romantic spots in your city.

#DateNightIdeas #RomanticRestaurants #Palateo #CocktailBar #DelhiEats #MumbaiNightlife #Speakeasy #FineDiningIndia #HiddenGems #WeekendPlans`,
        commentTrigger: 'DATE',
        tags: ['#DateNightIdeas', '#RomanticRestaurants', '#Palateo', '#Speakeasy', '#DelhiEats']
      }
    ];
  }

  generateFrameSvg(sceneNumber, theme, sceneData) {
    const totalScenes = theme.scenes.length;
    const progressWidth = Math.round((sceneNumber / totalScenes) * 920);

    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="45%" stop-color="#141a2e" />
      <stop offset="100%" stop-color="#05070c" />
    </linearGradient>
    <linearGradient id="orangeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f97316" />
      <stop offset="100%" stop-color="#ec4899" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="24" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Deep Moody Canvas -->
  <rect width="1080" height="1920" fill="url(#bg)" />

  <!-- Instagram Story / Reel Progress Bar -->
  <rect x="80" y="60" width="920" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
  <rect x="80" y="60" width="${progressWidth}" height="6" rx="3" fill="#f97316" />

  <!-- Top User Profile & Sound Tag -->
  <g transform="translate(80, 95)">
    <circle cx="28" cy="28" r="28" fill="url(#orangeGlow)" />
    <text x="28" y="36" font-size="24" text-anchor="middle">🍽️</text>
    <text x="75" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="700" fill="#ffffff">palateo.in</text>
    <text x="75" y="48" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#94a3b8">♫ ${theme.audio.name.slice(0, 32)}...</text>
  </g>

  <!-- Scene Tag Badge -->
  <rect x="80" y="200" width="260" height="48" rx="24" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.16)" stroke-width="1.5" />
  <text x="210" y="232" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#f97316" text-anchor="middle">
    SCENE ${sceneNumber} / ${totalScenes} &bull; ${sceneData.time}
  </text>

  <!-- Main Visual Card Container -->
  <g filter="url(#shadow)">
    <rect x="80" y="280" width="920" height="1140" rx="36" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" stroke-width="2" />
    
    <!-- Central Icon / Motif -->
    <circle cx="540" cy="580" r="140" fill="url(#orangeGlow)" opacity="0.9" />
    <text x="540" y="615" font-size="100" text-anchor="middle">${sceneNumber === 1 ? '🔥' : sceneNumber === totalScenes ? '📲' : '✨'}</text>

    <!-- Visual Direction Text -->
    <text x="540" y="800" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="600" fill="#94a3b8" text-anchor="middle" letter-spacing="2">
      VISUAL DIRECTION
    </text>
    <foreignObject x="140" y="830" width="800" height="180">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: system-ui, -apple-system, sans-serif; font-size: 28px; line-height: 1.4; color: #cbd5e1; text-align: center;">
        ${sceneData.visual}
      </div>
    </foreignObject>

    <!-- Voiceover Narration Box -->
    <rect x="140" y="1040" width="800" height="280" rx="24" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
    <text x="180" y="1085" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#f97316" letter-spacing="2">VOICEOVER / DIALOGUE</text>
    <foreignObject x="180" y="1110" width="720" height="180">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: system-ui, -apple-system, sans-serif; font-size: 26px; line-height: 1.45; color: #ffffff; font-style: italic;">
        "${sceneData.voiceover}"
      </div>
    </foreignObject>
  </g>

  <!-- Big Floating On-Screen Hook Overlay (TikTok/Reel Style) -->
  <g filter="url(#shadow)">
    <rect x="80" y="1460" width="920" height="200" rx="32" fill="#000000" fill-opacity="0.85" stroke="#f97316" stroke-width="3" />
    <text x="120" y="1510" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="#f97316" letter-spacing="3">ON-SCREEN CAPTION</text>
    <foreignObject x="120" y="1530" width="840" height="110">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: system-ui, -apple-system, sans-serif; font-size: 32px; font-weight: 800; color: #ffffff; line-height: 1.25;">
        ${sceneData.onScreenText}
      </div>
    </foreignObject>
  </g>

  <!-- Bottom CTA Pill -->
  <g transform="translate(540, 1780)">
    <rect x="-340" y="-35" width="680" height="70" rx="35" fill="url(#orangeGlow)" />
    <text x="0" y="12" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="800" fill="#ffffff" text-anchor="middle">
      Comment "${theme.commentTrigger}" &bull; Free Taste Quiz at palateo.in
    </text>
  </g>
</svg>
    `.trim();
  }

  generateHtmlPreviewPlayer(theme, reelDirRelative) {
    const scenesJson = JSON.stringify(theme.scenes);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Palateo Reel Preview - ${theme.title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #090d16;
      color: #f8fafc;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 900px;
      width: 100%;
      gap: 24px;
    }
    .header {
      text-align: center;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 800;
      color: #f97316;
      margin-bottom: 8px;
    }
    .header p {
      font-size: 15px;
      color: #94a3b8;
    }
    /* Phone Mockup 9:16 */
    .phone-mockup {
      width: 380px;
      height: 675px;
      background: #000;
      border-radius: 44px;
      border: 8px solid #334155;
      box-shadow: 0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(249, 115, 22, 0.2);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .phone-screen {
      width: 100%;
      height: 100%;
      position: relative;
      background: #0f172a;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20px 16px;
      background-size: cover;
      background-position: center;
      transition: background-image 0.4s ease;
    }
    .reel-svg-frame {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      object-fit: cover;
    }
    .progress-bar {
      position: absolute;
      top: 12px;
      left: 16px;
      right: 16px;
      height: 3px;
      background: rgba(255,255,255,0.3);
      border-radius: 2px;
      z-index: 10;
    }
    .progress-fill {
      height: 100%;
      width: 20%;
      background: #f97316;
      border-radius: 2px;
      transition: width 0.3s linear;
    }
    /* IG Side Action Icons */
    .ig-actions {
      position: absolute;
      right: 14px;
      bottom: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      z-index: 10;
    }
    .ig-action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 700;
      color: #fff;
    }
    .ig-icon-circle {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    /* Controls */
    .controls {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 12px;
    }
    button {
      background: #f97316;
      color: #fff;
      border: none;
      padding: 12px 24px;
      border-radius: 24px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover {
      background: #ea580c;
    }
    .btn-secondary {
      background: #1e293b;
      color: #cbd5e1;
      border: 1px solid #334155;
    }
    .btn-secondary:hover {
      background: #334155;
    }
    .metadata-card {
      background: #1e293b;
      border-radius: 16px;
      padding: 20px;
      width: 100%;
      border: 1px solid #334155;
    }
    .metadata-card h3 {
      font-size: 18px;
      color: #f97316;
      margin-bottom: 8px;
    }
    pre {
      background: #0f172a;
      padding: 12px;
      border-radius: 8px;
      font-size: 13px;
      color: #94a3b8;
      white-space: pre-wrap;
      max-height: 200px;
      overflow-y: auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎬 Palateo Trendy Reel Preview</h1>
      <p>${theme.title} &bull; ${theme.archetype} &bull; Retention Score: ${theme.estimatedRetentionScore}/100</p>
    </div>

    <div class="phone-mockup">
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
      </div>
      <img src="scene_1.svg" class="reel-svg-frame" id="reelImage" alt="Reel Scene Frame">
      <div class="ig-actions">
        <div class="ig-action-btn"><div class="ig-icon-circle">❤️</div><span>14.8k</span></div>
        <div class="ig-action-btn"><div class="ig-icon-circle">💬</div><span>894</span></div>
        <div class="ig-action-btn"><div class="ig-icon-circle">↗️</div><span>3.2k</span></div>
        <div class="ig-action-btn"><div class="ig-icon-circle">📌</div><span>5.1k</span></div>
      </div>
    </div>

    <div class="controls">
      <button id="prevBtn" class="btn-secondary">◀ Previous Scene</button>
      <button id="playBtn">▶ Auto Play</button>
      <button id="nextBtn" class="btn-secondary">Next Scene ▶</button>
    </div>

    <div class="metadata-card">
      <h3>📋 Caption & Viral Mechanics</h3>
      <p style="margin-bottom: 8px; font-size: 14px; color: #cbd5e1;"><strong>Audio Track:</strong> ${theme.audio.name} (${theme.audio.bpm} BPM)</p>
      <p style="margin-bottom: 8px; font-size: 14px; color: #cbd5e1;"><strong>Comment-to-DM Trigger:</strong> Comment "<strong>${theme.commentTrigger}</strong>" for auto-response</p>
      <pre>${theme.caption}</pre>
    </div>
  </div>

  <script>
    const scenes = ${scenesJson};
    let currentIdx = 0;
    let timer = null;
    let isPlaying = false;

    const reelImg = document.getElementById('reelImage');
    const progressFill = document.getElementById('progressFill');
    const playBtn = document.getElementById('playBtn');

    function updateScene(idx) {
      currentIdx = (idx + scenes.length) % scenes.length;
      reelImg.src = 'scene_' + (currentIdx + 1) + '.svg';
      progressFill.style.width = ((currentIdx + 1) / scenes.length * 100) + '%';
    }

    document.getElementById('prevBtn').onclick = () => { updateScene(currentIdx - 1); };
    document.getElementById('nextBtn').onclick = () => { updateScene(currentIdx + 1); };

    playBtn.onclick = () => {
      if (isPlaying) {
        clearInterval(timer);
        isPlaying = false;
        playBtn.innerText = '▶ Auto Play';
      } else {
        isPlaying = true;
        playBtn.innerText = '⏸ Pause';
        timer = setInterval(() => {
          updateScene(currentIdx + 1);
        }, 3000);
      }
    };
  </script>
</body>
</html>
    `.trim();
  }

  async execute(context = {}) {
    const root = this.config.root;
    const outputDir = path.join(root, 'marketing/output/reels');
    fs.mkdirSync(outputDir, { recursive: true });

    const formats = this.getTrendingFormats();
    const selectedFormat = context.format 
      ? (formats.find(f => f.id === context.format) || formats[0])
      : formats[Math.floor(Math.random() * formats.length)];

    const reelId = `reel_${Date.now()}_${selectedFormat.id}`;
    const reelDir = path.join(outputDir, reelId);
    fs.mkdirSync(reelDir, { recursive: true });

    this.log(`Scripting Trendy 9:16 Reel: "${selectedFormat.title}" [${selectedFormat.archetype}]`);
    this.log(`Viral Hook: "${selectedFormat.hook}"`);
    this.log(`Trending Audio: ${selectedFormat.audio.name} (${selectedFormat.audio.bpm} BPM)`);

    // 1. Generate individual SVG frames for all 5 scenes
    const sceneFiles = [];
    for (let i = 0; i < selectedFormat.scenes.length; i++) {
      const sceneNum = i + 1;
      const svgContent = this.generateFrameSvg(sceneNum, selectedFormat, selectedFormat.scenes[i]);
      const frameFilename = `scene_${sceneNum}.svg`;
      const framePath = path.join(reelDir, frameFilename);
      fs.writeFileSync(framePath, svgContent, 'utf8');
      sceneFiles.push(framePath);
    }
    this.log(`Rendered ${sceneFiles.length} vertical 1080x1920 SVG storyboard frames.`, 'success');

    // 2. Generate Interactive Reel Preview Player (HTML)
    const previewHtml = this.generateHtmlPreviewPlayer(selectedFormat, reelId);
    const previewPath = path.join(reelDir, 'reel_preview.html');
    fs.writeFileSync(previewPath, previewHtml, 'utf8');
    this.log(`Generated interactive browser reel player at ${previewPath}`);

    // 3. Generate Video Composition & Audio Manifest
    const compositionManifest = {
      id: reelId,
      aspectRatio: '9:16',
      resolution: { width: 1080, height: 1920 },
      fps: 30,
      totalDurationSeconds: 15,
      title: selectedFormat.title,
      archetype: selectedFormat.archetype,
      city: selectedFormat.city,
      estimatedRetentionScore: selectedFormat.estimatedRetentionScore,
      audio: selectedFormat.audio,
      commentTrigger: selectedFormat.commentTrigger,
      caption: selectedFormat.caption,
      hashtags: selectedFormat.tags,
      scenes: selectedFormat.scenes.map((s, idx) => ({
        ...s,
        frameSvg: `scene_${idx + 1}.svg`
      })),
      previewHtml: 'reel_preview.html',
      createdAt: new Date().toISOString()
    };

    const manifestPath = path.join(reelDir, 'composition_manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(compositionManifest, null, 2), 'utf8');

    // 4. Copy primary thumbnail
    fs.copyFileSync(path.join(reelDir, 'scene_1.svg'), path.join(reelDir, 'thumbnail.svg'));

    this.log(`Trendy Reel package generated successfully at ${reelDir}`, 'success');
    this.eventBus.emit('marketing:reel_created', compositionManifest);

    return {
      reelId,
      reelDir,
      title: selectedFormat.title,
      archetype: selectedFormat.archetype,
      caption: selectedFormat.caption,
      commentTrigger: selectedFormat.commentTrigger,
      previewHtmlPath: previewPath,
      thumbnailPath: path.join(reelDir, 'thumbnail.svg'),
      scenesCount: sceneFiles.length
    };
  }

  async generateAllTrendingFormats() {
    this.log('Batch generating all 4 viral trending reel formats...');
    const formats = this.getTrendingFormats();
    const results = [];
    for (const f of formats) {
      const res = await this.execute({ format: f.id });
      results.push(res);
    }
    this.log(`Batch complete! Generated ${results.length} viral Reel packages.`, 'success');
    return results;
  }
}

module.exports = ReelDirectorAgent;

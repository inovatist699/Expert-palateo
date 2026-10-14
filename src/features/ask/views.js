/* ==========================================================================
   PALATEO ASK PALATEO VIEW (GOOGLE AI STUDIO PALATE AI ADVISOR)
   - Faithfully adapted from PalateAiScreen.kt & TasteStudioScreen.kt
   - Powered by Google AI Studio · Gemini 3.5 Flash
   - Persistent companion switch for Palo with docking slot
   ========================================================================== */

function isPaloCompanionVisible(){
  return localStorage.getItem('palateo_show_palo') !== 'false';
}

function resolvePalatePersona(){
  const a = (typeof state !== 'undefined' && state.answers) ? state.answers : {};
  if (a.spice === 'hot' && (a.cuisine === 'Regional' || a.cuisine === 'South Indian')) return 'Fiery Desi Spice Explorer';
  if (a.diet === 'vegan') return 'Mindful Plant-Powered Gourmet';
  if (a.diet === 'vegetarian') return 'Pure Veg Heritage Connoisseur';
  if (a.mood === 'Aesthetic Courtyard' || a.cuisine === 'Cafe') return 'Specialty Brew & Sourdough Hunter';
  if (a.cuisine === 'Italian' || a.cuisine === 'Continental') return 'Neapolitan Woodfire Aficionado';
  return 'Regional Gastronomy Adventurer';
}

function ask(){
  const showMascot = isPaloCompanionVisible();
  const city = cityName();
  const a = (typeof state !== 'undefined' && state.answers) ? state.answers : {};
  const persona = resolvePalatePersona();
  const spiceText = a.spice === 'hot' ? '3/3 (Fiery)' : a.spice === 'mild' ? '1/3 (Mild)' : '2/3 (Balanced)';
  const dietText = (typeof dietLabel === 'function' && a.diet) ? dietLabel(a.diet) : (a.diet || 'All Diets');

  document.getElementById('root').innerHTML = `
    <section class="screen ask-screen" id="palateAiScreen">
      <!-- 1. Google AI Studio Header -->
      <div class="askHero">
        <div class="askHeroHeader">
          <div class="askTitleRow">
            <div class="askIconSparkle" aria-hidden="true">✦</div>
            <h1>Ask Palateo</h1>
            <span class="navBetaPill">BETA</span>
          </div>
          <p class="askSubtitle">Real-time culinary intelligence powered by <strong>Google AI Studio · Gemini 3.5 Flash</strong></p>
        </div>

        <!-- 2. Active Palate DNA Summary Pill (From PalateAiScreen.kt) -->
        <div class="activePalateDnaPill">
          <div class="dnaIcon">🧠</div>
          <div class="dnaInfo">
            <strong class="dnaPersonaTitle">Active Palate DNA: ${esc(persona)}</strong>
            <span class="dnaSubtext">Spice: ${esc(spiceText)} • ${esc(dietText)} • ${esc(city)}</span>
          </div>
        </div>

        <!-- 3. Direct Query Input Field (From PalateAiScreen.kt) -->
        <form class="palateAiQueryForm" id="palateAiForm" data-action="ask-query-form">
          <div class="palateAiInputRow">
            <input type="text" class="palateAiInputField" id="palateAiInput" placeholder="Ask anything about dishes, flavors, or places in ${esc(city)}..." autocomplete="off" aria-label="Ask Palateo culinary question">
            <button type="submit" class="palateAiSendButton" id="palateAiSendBtn" aria-label="Send question to AI Studio">
              <svg class="smallIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </form>

        <!-- 4. Palo AI Mascot Companion Switch Card -->
        <div class="paloCompanionToggleCard">
          <div class="toggleInfo">
            <span class="toggleIcon">🐾</span>
            <div>
              <strong>Palo AI Companion (Beta)</strong>
              <p>Show animated mascot companion, cheerful sounds, and live emotion chirps</p>
            </div>
          </div>
          <label class="toggleSwitch" for="paloMascotSwitch">
            <input type="checkbox" id="paloMascotSwitch" data-action="toggle-palo" ${showMascot ? 'checked' : ''} aria-label="Toggle Palo companion">
            <span class="toggleSlider"></span>
          </label>
        </div>
      </div>

      <!-- 5. Suggested Questions Section (From PalateAiScreen.kt) -->
      <div class="askSuggestionsSection">
        <div class="suggestedHeader">
          <span class="suggestedIcon">💡</span>
          <h2>Suggested Questions</h2>
        </div>
        <div class="askQuickChips" role="group" aria-label="Suggested food questions">
          <button type="button" class="promptChip suggestedQuestionChip" data-action="ask-prompt" data-prompt="Where should I go for the crunchiest Podi Dosa in ${esc(city)}?">Where should I go for the crunchiest Podi Dosa in ${esc(city)}?</button>
          <button type="button" class="promptChip suggestedQuestionChip" data-action="ask-prompt" data-prompt="Best sunset rooftop with spicy food in ${esc(city)}">Best sunset rooftop with spicy food in ${esc(city)}</button>
          <button type="button" class="promptChip suggestedQuestionChip" data-action="ask-prompt" data-prompt="Compare top craft brewpubs vs cocktail rooms for my palate">Compare top craft brewpubs vs cocktail rooms for my palate</button>
          <button type="button" class="promptChip suggestedQuestionChip" data-action="ask-prompt" data-prompt="Recommend 3 must-try signature dishes for my spice tolerance">Recommend 3 must-try signature dishes for my spice tolerance</button>
          <button type="button" class="promptChip suggestedQuestionChip" data-action="ask-prompt" data-prompt="Best artisanal sourdough & pour-over specialty cafes in ${esc(city)}">Best artisanal sourdough & pour-over specialty cafes in ${esc(city)}</button>
        </div>
      </div>

      <!-- 6. Docked Companion Container -->
      <div class="askCompanionDock" id="askCompanionDock">
        <!-- Palo companion container automatically docks here -->
      </div>
    </section>
  `;

  // Synchronize companion visibility
  if (typeof syncPaloPage === 'function') {
    syncPaloPage('ask');
  }

  // Focus prompt input
  setTimeout(() => {
    document.getElementById('palateAiInput')?.focus({ preventScroll: true });
  }, 120);
}

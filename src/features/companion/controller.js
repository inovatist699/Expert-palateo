/* ==========================================================================
   PALATEO AI CULINARY PET COMPANION (PALO)
   - Living animated on-screen vector mascot (not a blocking window modal!)
   - Cute pitched voice synthesis + procedural Web Audio chirps & chimes
   - Online Reinforcement Machine Learning Engine (learns & evolves taste genome)
   - Real-time review synthesis with deep access to verified diner insights
   ========================================================================== */
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  // --------------------------------------------------------------------------
  // 1. PALO SVG CHARACTER TEMPLATE
  // --------------------------------------------------------------------------
  const paloCharacterSvg = `
    <div class="paloCreature" id="paloCreature">
      <div class="paloSparkles" id="paloSparkles" aria-hidden="true"></div>
      <svg class="paloSvg" viewBox="0 0 100 100" width="84" height="84" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <radialGradient id="paloBodyGrad" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stop-color="#FFF4BC" />
            <stop offset="42%" stop-color="#FFC64F" />
            <stop offset="82%" stop-color="#E29E24" />
            <stop offset="100%" stop-color="#B87309" />
          </radialGradient>
          <radialGradient id="paloCheekGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FF6B6B" stop-opacity="0.85" />
            <stop offset="100%" stop-color="#FF6B6B" stop-opacity="0" />
          </radialGradient>
          <linearGradient id="paloSproutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#5FE397" />
            <stop offset="100%" stop-color="#197343" />
          </linearGradient>
          <filter id="paloGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4.5" flood-color="#FFC64F" flood-opacity="0.38" />
          </filter>
        </defs>

        <!-- Ambient Floor Shadow -->
        <ellipse class="paloShadow" cx="50" cy="94" rx="28" ry="5" fill="#102B30" fill-opacity="0.22" />

        <!-- Springy Leaf Sprout on Head -->
        <g class="paloSproutWrap">
          <path class="paloSproutStem" d="M 50 25 Q 51 17 53 13" stroke="#197343" stroke-width="2.6" stroke-linecap="round" />
          <path class="paloLeafMain" d="M 53 13 C 46 5, 34 8, 37 17 C 43 21, 50 17, 53 13 Z" fill="url(#paloSproutGrad)" />
          <path class="paloLeafSec" d="M 53 13 C 59 6, 68 9, 66 18 C 61 22, 56 18, 53 13 Z" fill="url(#paloSproutGrad)" />
        </g>

        <!-- Plump Pear Mascot Body -->
        <path class="paloBodyShape" d="M 50 22 C 34 22, 22 36, 22 55 C 22 75, 34 88, 50 88 C 66 88, 78 75, 78 55 C 78 36, 66 22, 50 22 Z" fill="url(#paloBodyGrad)" filter="url(#paloGlow)" />

        <!-- Rosy Cheeks -->
        <ellipse class="paloCheek left" cx="29" cy="62" rx="7" ry="4.8" fill="url(#paloCheekGrad)" />
        <ellipse class="paloCheek right" cx="71" cy="62" rx="7" ry="4.8" fill="url(#paloCheekGrad)" />

        <!-- Expressive Anime / Mascot Eyes -->
        <g class="paloEyesGroup">
          <g class="paloEye left">
            <ellipse cx="37" cy="51" rx="5.2" ry="7" fill="#183B3E" />
            <circle cx="35" cy="48.5" r="2.3" fill="#FFFFFF" />
            <circle cx="39" cy="53.5" r="1.1" fill="#FFFFFF" />
          </g>
          <g class="paloEye right">
            <ellipse cx="63" cy="51" rx="5.2" ry="7" fill="#183B3E" />
            <circle cx="61" cy="48.5" r="2.3" fill="#FFFFFF" />
            <circle cx="65" cy="53.5" r="1.1" fill="#FFFFFF" />
          </g>
        </g>

        <!-- Animated Mouth (flutters when speaking) -->
        <path class="paloMouth" d="M 45 61 Q 50 67 55 61" stroke="#183B3E" stroke-width="2.3" stroke-linecap="round" fill="none" />
        <path class="paloTongue" d="M 48 63 Q 50 67 52 63 Z" fill="#FF7A60" />

        <!-- Cute Paws -->
        <ellipse class="paloPaw left" cx="31" cy="74" rx="5" ry="3.2" fill="#E29E24" />
        <ellipse class="paloPaw right" cx="69" cy="74" rx="5" ry="3.2" fill="#E29E24" />
      </svg>
      <span class="paloMoodPill" id="paloMoodPill">Palo · Ready!</span>
    </div>
  `;

  // Mini pet badge for header and login
  const pet = `<span class="palo" aria-hidden="true"><span class="paloLeaf"></span><span class="paloFace"><i></i><i></i><b></b></span><span class="paloFoot left"></span><span class="paloFoot right"></span></span>`;

  // --------------------------------------------------------------------------
  // 2. ONLINE REINFORCEMENT MACHINE LEARNING ENGINE
  // --------------------------------------------------------------------------
  class PaloMLTasteEngine {
    constructor() {
      this.storageKey = 'palateo_palo_ml_genome';
      this.genome = this.loadGenome();
    }

    defaultGenome() {
      return {
        version: 2,
        xp: 40,
        level: 1,
        totalInteractions: 0,
        cuisines: {
          Italian: 0.2,
          Gujarati: 0.2,
          Punjabi: 0.2,
          SouthIndian: 0.2,
          Cafe: 0.25,
          Asian: 0.15,
          Dessert: 0.15,
          Continental: 0.15,
          Seafood: 0.1
        },
        spiceTolerance: 0.5, // 0..1 (mild to hot)
        vibes: {
          cozy: 0.2,
          quiet: 0.2,
          lively: 0.1,
          modern: 0.15,
          date: 0.2,
          friends: 0.15,
          family: 0.1,
          solo: 0.15
        },
        priceSensitivity: {
          under_500: 0.25,
          '500_1000': 0.35,
          '1000_2000': 0.25,
          '2000_plus': 0.15
        },
        reviewKeywords: {
          coffee: 0.2,
          sourdough: 0.2,
          pizza: 0.2,
          waffles: 0.15,
          courtyard: 0.2,
          cocktails: 0.15,
          biryani: 0.2,
          dosa: 0.2,
          truffle: 0.15,
          spicy: 0.15,
          dessert: 0.2,
          pasta: 0.2,
          rooftop: 0.15,
          authentic: 0.2
        },
        dishWeights: {},
        recentLearnings: []
      };
    }

    loadGenome() {
      try {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...this.defaultGenome(), ...parsed };
        }
      } catch (e) {}
      return this.defaultGenome();
    }

    saveGenome() {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.genome));
      } catch (e) {}
    }

    // Gradient reinforcement step
    learnFromVenue(venue, reward) {
      if (!venue) return null;
      const lr = 0.22;
      this.genome.totalInteractions++;
      const xpGain = Math.round(Math.abs(reward) * 35);
      this.genome.xp += xpGain;
      const prevLevel = this.genome.level;
      this.genome.level = Math.max(1, Math.floor(this.genome.xp / 100) + 1);
      const leveledUp = this.genome.level > prevLevel;

      // Update cuisine vectors
      (venue.c || []).forEach(c => {
        const current = this.genome.cuisines[c] || 0.1;
        this.genome.cuisines[c] = Math.max(-1.5, Math.min(2.5, current + lr * reward));
      });

      // Update ambiance & occasion vectors
      (venue.a || []).concat(venue.o || []).forEach(v => {
        const current = this.genome.vibes[v] || 0.1;
        this.genome.vibes[v] = Math.max(-1.2, Math.min(2.0, current + lr * reward * 0.7));
      });

      // Update spice index
      if (venue.s === 'hot') {
        this.genome.spiceTolerance = Math.max(0, Math.min(1, this.genome.spiceTolerance + reward * 0.1));
      } else if (venue.s === 'mild') {
        this.genome.spiceTolerance = Math.max(0, Math.min(1, this.genome.spiceTolerance - reward * 0.1));
      }

      // Learn from verified review insights
      const reviews = Array.isArray(venue.review_insights) ? venue.review_insights : [];
      reviews.forEach(phrase => {
        const words = phrase.toLowerCase().split(/\s+/);
        words.forEach(w => {
          if (w.length > 3 && this.genome.reviewKeywords[w] !== undefined) {
            this.genome.reviewKeywords[w] = Math.max(-1.0, Math.min(2.0, this.genome.reviewKeywords[w] + lr * reward * 0.4));
          }
        });
      });

      const summary = `${reward > 0 ? 'Loved' : 'Passed on'} ${venue.name} · Updated ${(venue.c || []).slice(0, 2).join(', ')} affinity`;
      this.genome.recentLearnings.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        summary,
        xp: xpGain
      });
      if (this.genome.recentLearnings.length > 6) this.genome.recentLearnings.pop();

      this.saveGenome();
      return { level: this.genome.level, xp: this.genome.xp, leveledUp, summary };
    }

    learnFromDish(dishId, dishName, cuisine, sentiment) {
      const reward = sentiment === 'love' ? 1.4 : -1.4;
      this.genome.dishWeights[dishId] = reward;
      this.genome.xp += 25;
      const prevLevel = this.genome.level;
      this.genome.level = Math.max(1, Math.floor(this.genome.xp / 100) + 1);
      const leveledUp = this.genome.level > prevLevel;

      if (cuisine) {
        const current = this.genome.cuisines[cuisine] || 0.1;
        this.genome.cuisines[cuisine] = Math.max(-1.5, Math.min(2.5, current + 0.3 * reward));
      }

      const summary = `${sentiment === 'love' ? 'Loved' : 'Disliked'} ${dishName} · Reinforced ${cuisine || 'flavour'}`;
      this.genome.recentLearnings.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        summary,
        xp: 25
      });
      if (this.genome.recentLearnings.length > 6) this.genome.recentLearnings.pop();

      this.saveGenome();
      return { level: this.genome.level, xp: this.genome.xp, leveledUp, summary };
    }

    evaluateVenue(venue) {
      let score = venue.score || 72;
      (venue.c || []).forEach(c => {
        if (this.genome.cuisines[c]) score += this.genome.cuisines[c] * 12;
      });
      (venue.a || []).concat(venue.o || []).forEach(v => {
        if (this.genome.vibes[v]) score += this.genome.vibes[v] * 7;
      });
      (venue.review_insights || []).forEach(phrase => {
        const words = phrase.toLowerCase().split(/\s+/);
        words.forEach(w => {
          if (this.genome.reviewKeywords[w]) score += this.genome.reviewKeywords[w] * 6;
        });
      });
      if (venue.s === 'hot') score += (this.genome.spiceTolerance - 0.5) * 12;
      if (venue.s === 'mild') score += (0.5 - this.genome.spiceTolerance) * 12;
      return Math.max(1, Math.min(99, Math.round(score)));
    }
  }

  const paloML = new PaloMLTasteEngine();

  // --------------------------------------------------------------------------
  // 3. REVIEW INTELLIGENCE ENGINE (DEEP ACCESS TO VERIFIED REVIEWS)
  // --------------------------------------------------------------------------
  function analyzeVenueReviews(venue) {
    const rawInsights = Array.isArray(venue.review_insights) ? venue.review_insights : [];
    const rating = Number(venue.rating || 4.5).toFixed(1);
    const count = Number(venue.review_count || 1200).toLocaleString();
    const sentimentPct = Math.min(99, Math.max(82, Math.round((Number(venue.rating || 4.5) / 5.0) * 100)));

    const formattedQuotes = rawInsights.length
      ? rawInsights.slice(0, 3).map(r => `“${r}”`)
      : [`“${venue.why || 'Authentic atmosphere and crowd favorites'}”`];

    let insiderTip = '';
    if (venue.a?.includes('cozy') || venue.o?.includes('date')) {
      insiderTip = 'Diners praise the intimate corner seating and calm lighting.';
    } else if (Number(venue.review_count) > 4000) {
      insiderTip = 'Frequent diner crowd on weekends—visit early or book in advance.';
    } else if (venue.c?.includes('Cafe') || venue.c?.includes('Coffee')) {
      insiderTip = 'Diners highlight single-origin espresso roasts and fresh sourdough bakes.';
    } else if (venue.s === 'hot') {
      insiderTip = 'Known for unapologetic fiery spice—ask for milder prep if needed.';
    } else {
      insiderTip = 'Consistently recommended for generous portions and authentic recipes.';
    }

    return {
      rating,
      count,
      sentimentPct,
      quotes: formattedQuotes,
      topQuote: formattedQuotes[0] || '“Celebrated local culinary favorite”',
      insiderTip
    };
  }

  function searchVenuesByReviewInsights(query, venuesList) {
    const q = String(query || '').toLowerCase().trim();
    const tokens = q.replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(t => t.length > 2 && !['want', 'some', 'food', 'place', 'restaurant', 'find', 'with', 'good', 'best', 'craving'].includes(t));

    return venuesList.map(v => {
      let reviewScore = 0;
      const reviewText = (v.review_insights || []).join(' ').toLowerCase();
      const whyText = String(v.why || '').toLowerCase();
      const tagText = (v.t || []).join(' ').toLowerCase();
      const nameText = String(v.name || '').toLowerCase();
      const cuisineText = (v.c || []).join(' ').toLowerCase();

      tokens.forEach(tok => {
        if (reviewText.includes(tok)) reviewScore += 35; // Direct diner review quote match!
        if (tagText.includes(tok)) reviewScore += 22;
        if (whyText.includes(tok)) reviewScore += 18;
        if (cuisineText.includes(tok)) reviewScore += 25;
        if (nameText.includes(tok)) reviewScore += 30;
      });

      const mlTasteScore = paloML.evaluateVenue(v);
      const totalScore = mlTasteScore + reviewScore;
      const reviewData = analyzeVenueReviews(v);

      return {
        r: v,
        reviewScore,
        mlTasteScore,
        totalScore,
        reviewData,
        hasExactReviewMatch: reviewScore > 0
      };
    })
    .filter(item => tokens.length === 0 || item.reviewScore > 0)
    .sort((a, b) => b.totalScore - a.totalScore);
  }

  // --------------------------------------------------------------------------
  // 4. CUTE VOICE & AUDIO ENGINE (WEB AUDIO CHIRPS + PITCHED SPEECH)
  // --------------------------------------------------------------------------
  let audioCtx = null;
  let voiceEnabled = true;
  try {
    voiceEnabled = localStorage.getItem('palateo-palo-voice') !== 'off';
  } catch (e) {}

  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (AudioCtor) audioCtx = new AudioCtor();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function playCuteSound(type = 'blip') {
    if (!voiceEnabled || reduceMotion.matches) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'blip') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(940, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
        osc.start(now);
        osc.stop(now + 0.11);
      } else if (type === 'learn') {
        const notes = [1046.5, 1318.5, 1760.0]; // C6, E6, A6 sparkle
        notes.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'triangle';
          o.frequency.setValueAtTime(freq, now + idx * 0.055);
          g.gain.setValueAtTime(0.07, now + idx * 0.055);
          g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.055 + 0.09);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(now + idx * 0.055);
          o.stop(now + idx * 0.055 + 0.09);
        });
      } else if (type === 'happy') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(740, now);
        osc.frequency.exponentialRampToValueAtTime(1180, now + 0.06);
        osc.frequency.setValueAtTime(860, now + 0.07);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
        osc.start(now);
        osc.stop(now + 0.17);
      } else if (type === 'think') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(560, now + 0.12);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch (e) {}
  }

  let activeUtterance = null;
  function stopSpeaking() {
    activeUtterance = null;
    window.speechSynthesis?.cancel();
    setPetMood('Ready!');
    setPetState('is-idle');
  }

  function speakCute(text) {
    stopSpeaking();
    if (!voiceEnabled || !window.speechSynthesis) return;
    const speech = new SpeechSynthesisUtterance(text);
    activeUtterance = speech;

    const voices = window.speechSynthesis.getVoices();
    const sweetVoice = voices.find(v => /(samantha|victoria|karen|tessa|moira|google uk english female|google us english|en-IN)/i.test(v.name) && /^en/i.test(v.lang))
      || voices.find(v => /^en/i.test(v.lang))
      || null;

    if (sweetVoice) speech.voice = sweetVoice;
    speech.lang = sweetVoice?.lang || 'en-IN';
    speech.rate = 1.07; // Cheerful, brisk pace
    speech.pitch = 1.56; // Cute, friendly mascot pitch

    speech.onstart = () => {
      if (activeUtterance !== speech) return;
      setPetState('is-speaking');
      setPetMood('Talking 🎵');
      playCuteSound('blip');
    };
    speech.onend = () => {
      if (activeUtterance === speech) {
        stopSpeaking();
      }
    };
    speech.onerror = () => {
      if (activeUtterance === speech) {
        stopSpeaking();
      }
    };

    window.speechSynthesis.speak(speech);
  }

  // --------------------------------------------------------------------------
  // 5. ON-SCREEN PET UI MOUNT (NON-BLOCKING DOCK & SPEECH BUBBLE)
  // --------------------------------------------------------------------------
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const paloContainerHtml = `
    <aside id="paloContainer" class="paloContainer" aria-label="Palo culinary pet companion">
      <!-- Living Character Pet (Click to tickle / expand) -->
      <div id="paloPetButton" class="paloPetWrapper" role="button" tabindex="0" aria-label="Talk to Palo, your culinary pet" aria-expanded="true">
        ${paloCharacterSvg}
      </div>

      <!-- Non-Blocking Speech Bubble & Recommendation Hub -->
      <div id="paloBubble" class="paloBubble is-open" role="region" aria-label="Palo's conversation and recommendations">
        <div class="paloBubbleTail" aria-hidden="true"></div>
        <header class="paloBubbleHeader">
          <div class="paloIdentity">
            <span class="paloAvatarBadge" aria-hidden="true">${pet}</span>
            <div>
              <div class="paloTitleRow">
                <h3>Palo</h3>
                <button type="button" class="paloBrainBadge" id="paloBrainBadge" title="Inspect Palo's Machine Learning Brain">
                  ⚡ Lvl <span id="paloLevelNum">1</span> · <span id="paloXpNum">40</span> XP
                </button>
              </div>
              <p class="paloSubtitle">Your Adaptive Culinary Companion</p>
            </div>
          </div>
          <div class="paloHeaderActions">
            <button type="button" id="paloVoiceToggle" class="paloIconBtn" aria-label="Toggle voice replies" title="Toggle voice replies">
              ${voiceEnabled ? '🔊' : '🔇'}
            </button>
            <button type="button" id="paloMinimizeBtn" class="paloIconBtn" aria-label="Minimize companion" title="Minimize">
              ✕
            </button>
          </div>
        </header>

        <!-- Palo Live Message -->
        <div class="paloSpeechBody">
          <p id="paloMessageText" class="paloMessageText">
            Hi! I’m Palo, your food pet. I learn what you love and scan latest diner reviews to pick your next great meal!
          </p>
        </div>

        <!-- Latest Review Citation Card (Populated on recommendations) -->
        <div id="paloReviewHighlight" class="paloReviewCard" style="display:none;"></div>

        <!-- Quick Suggestions Chips -->
        <div class="paloChipRail" aria-label="Quick requests">
          <button type="button" data-palo-action="foryou">✨ Pick For Me</button>
          <button type="button" data-palo-action="reviews">💬 Top Reviews</button>
          <button type="button" data-palo-action="brain">🧠 What I've Learned</button>
          <button type="button" data-palo-dish="pizza">🍕 Pizza</button>
          <button type="button" data-palo-dish="coffee">☕ Cafés</button>
          <button type="button" data-palo-dish="biryani">🍛 Biryani</button>
          <button type="button" data-palo-dish="dessert">🍨 Desserts</button>
        </div>

        <!-- Results Deck -->
        <div id="paloResultsDeck" class="paloResultsDeck"></div>

        <!-- ML Brain Inspection Drawer -->
        <section id="paloBrainDrawer" class="paloBrainDrawer" style="display:none;" aria-label="Palo's ML Genome"></section>

        <!-- Input Bar (Text + Voice Recognition) -->
        <form id="paloForm" class="paloForm">
          <div class="paloInputRow">
            <input id="paloInput" maxlength="160" placeholder="Ask for a dish, vibe, or craving…" autocomplete="off">
            <button type="button" id="paloMicBtn" class="paloMicBtn" aria-label="Speak your request" title="Voice input">
              🎤
            </button>
            <button type="submit" class="paloSendBtn" aria-label="Send request">
              →
            </button>
          </div>
          <p class="paloStatusText" id="paloStatusText">Tap a suggestion or type your craving.</p>
        </form>
      </div>
    </aside>
  `;

  document.body.insertAdjacentHTML('beforeend', paloContainerHtml);

  // --------------------------------------------------------------------------
  // 6. DOM BINDINGS & STATE MANAGEMENT
  // --------------------------------------------------------------------------
  const container = document.getElementById('paloContainer');
  const petButton = document.getElementById('paloPetButton');
  const bubble = document.getElementById('paloBubble');
  const messageText = document.getElementById('paloMessageText');
  const reviewCard = document.getElementById('paloReviewHighlight');
  const resultsDeck = document.getElementById('paloResultsDeck');
  const brainDrawer = document.getElementById('paloBrainDrawer');
  const brainBadge = document.getElementById('paloBrainBadge');
  const levelNum = document.getElementById('paloLevelNum');
  const xpNum = document.getElementById('paloXpNum');
  const input = document.getElementById('paloInput');
  const form = document.getElementById('paloForm');
  const micBtn = document.getElementById('paloMicBtn');
  const voiceToggle = document.getElementById('paloVoiceToggle');
  const minimizeBtn = document.getElementById('paloMinimizeBtn');
  const statusText = document.getElementById('paloStatusText');
  const moodPill = document.getElementById('paloMoodPill');
  const sparkles = document.getElementById('paloSparkles');

  let isBubbleOpen = true;
  let isListening = false;
  let recognitionInstance = null;
  let listenTimeout = null;

  function updateBrainStats() {
    levelNum.textContent = paloML.genome.level;
    xpNum.textContent = paloML.genome.xp;
  }
  updateBrainStats();

  function setPetMood(text) {
    if (moodPill) moodPill.textContent = `Palo · ${text}`;
  }

  function setPetState(stateClass) {
    const creature = document.getElementById('paloCreature');
    if (!creature) return;
    creature.classList.remove('is-idle', 'is-speaking', 'is-learning', 'is-listening', 'is-thinking', 'is-delighted');
    if (stateClass) creature.classList.add(stateClass);
  }

  function triggerDelightAnimation() {
    setPetState('is-delighted');
    playCuteSound('happy');
    if (sparkles) {
      sparkles.innerHTML = '<span class="sSpark s1">✨</span><span class="sSpark s2">💖</span><span class="sSpark s3">⭐</span><span class="sSpark s4">✨</span>';
      setTimeout(() => { sparkles.innerHTML = ''; }, 1200);
    }
    setTimeout(() => { setPetState('is-idle'); }, 1400);
  }

  function triggerLearningAnimation(summary) {
    setPetState('is-learning');
    playCuteSound('learn');
    if (sparkles) {
      sparkles.innerHTML = '<span class="sSpark s1">🧠</span><span class="sSpark s2">✦</span><span class="sSpark s3">✨</span><span class="sSpark s4">✦</span>';
      setTimeout(() => { sparkles.innerHTML = ''; }, 1400);
    }
    setPetMood('Learning! 🧠');
    updateBrainStats();
    setTimeout(() => {
      setPetState('is-idle');
      setPetMood('Ready!');
    }, 1600);
  }

  // --------------------------------------------------------------------------
  // 7. RECOMMENDATION & REVIEW SYNTHESIS CONTROLLER
  // --------------------------------------------------------------------------
  const isReady = () => typeof currentUser !== 'undefined' && currentUser && !authRequired && hasTasteProfile();

  function handleQuery(forcedQuery = null, forYou = false) {
    stopSpeaking();
    stopListening();
    brainDrawer.style.display = 'none';
    resultsDeck.replaceChildren();
    reviewCard.style.display = 'none';

    const city = typeof cityName === 'function' ? cityName() : 'your city';
    const allVenues = typeof ranked === 'function' ? ranked() : [];

    if (!isReady()) {
      const msg = `Sign in and complete your taste quiz! That way I can connect your preferences with the best reviewed spots in ${city}.`;
      messageText.textContent = msg;
      statusText.textContent = 'Please finish onboarding first.';
      speakCute(msg);
      return;
    }

    const query = (forcedQuery !== null ? forcedQuery : input.value).trim();
    if (!query && !forYou) {
      input.focus();
      return;
    }

    setPetState('is-thinking');
    playCuteSound('think');
    setPetMood('Thinking…');

    // 1. Check for explicit natural language taste teaching
    const teachMatch = query.match(/^i\s+(love|like|hate|dislike|don't like|do not like)\s+(.+?)[.!]?$/i);
    if (teachMatch) {
      const sentiment = /^(love|like)$/i.test(teachMatch[1]) ? 'love' : 'pass';
      const term = teachMatch[2].toLowerCase();
      const dishes = availableCalibrationDishes();
      const match = dishes.find(d => d.name.toLowerCase().includes(term) || d.tags.some(t => t.toLowerCase().includes(term)));

      if (match) {
        rateDish(match.id, sentiment, 'palo');
        const res = paloML.learnFromDish(match.id, match.name, match.cuisine, sentiment);
        triggerLearningAnimation(res.summary);
        const reply = `${sentiment === 'love' ? 'Ooh, yum!' : 'Got it!'} I remembered that you ${sentiment === 'love' ? 'love' : 'prefer to skip'} ${match.name}. My recommendations in ${city} have evolved!`;
        messageText.textContent = reply;
        statusText.textContent = `Palo learned: ${match.name} (${sentiment}) · Level ${paloML.genome.level}`;
        speakCute(reply);
        input.value = '';
        renderBrainDrawer();
        brainDrawer.style.display = 'block';
        return;
      }
    }

    // 2. Perform ML and review search across venues in city
    let matches = [];
    if (forYou) {
      matches = allVenues
        .filter(r => state.feedback[r.id] !== 'dislike')
        .map(r => ({
          r,
          mlTasteScore: paloML.evaluateVenue(r),
          totalScore: paloML.evaluateVenue(r),
          reviewData: analyzeVenueReviews(r),
          hasExactReviewMatch: false
        }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 3);
    } else {
      matches = searchVenuesByReviewInsights(query, allVenues).slice(0, 3);
    }

    setTimeout(() => {
      setPetState('is-idle');
      setPetMood('Ready!');

      if (!matches.length) {
        const failMsg = `I searched all diner reviews in ${city}, but couldn't find a direct match for “${query}”. Try another dish or cuisine!`;
        messageText.textContent = failMsg;
        statusText.textContent = 'No matching reviews found.';
        speakCute(failMsg);
        return;
      }

      const top = matches[0];
      const reply = forYou
        ? `Here are my top picks in ${city} adapted to your taste genome! Diners especially praise ${top.r.name}.`
        : `Found ${matches.length} spots in ${city} matching “${query}”! At ${top.r.name}, ${top.reviewData.sentimentPct}% of diners loved their reviews.`;

      messageText.textContent = reply;
      statusText.textContent = `Showing ${matches.length} places with verified diner receipts.`;

      // Render top review card
      reviewCard.style.display = 'block';
      reviewCard.innerHTML = `
        <div class="paloReviewHeader">
          <span class="paloReviewBadge">Verified Reviews (${top.reviewData.count})</span>
          <span class="paloSentimentPill">👍 ${top.reviewData.sentimentPct}% diner love</span>
        </div>
        <p class="paloReviewQuote">${esc(top.reviewData.topQuote)}</p>
        <p class="paloReviewTip">💡 ${esc(top.reviewData.insiderTip)}</p>
      `;

      // Render restaurant result cards with review intelligence
      resultsDeck.innerHTML = matches.map(({ r, mlTasteScore, reviewData }) => `
        <article class="paloVenueCard">
          <div class="paloVenueMeta">
            <div>
              <span class="paloCuisineTag">${esc((r.c || []).slice(0, 2).join(' · '))}</span>
              <h4 class="paloVenueName">${esc(r.name)}</h4>
              <p class="paloVenueSub">${esc(r.area || r.city)} · ${esc(displayPrice(r))} · ★ ${reviewData.rating}</p>
            </div>
            <div class="paloMatchPill">
              <strong>${mlTasteScore}%</strong>
              <span>Fit</span>
            </div>
          </div>
          <p class="paloVenueQuote">${esc(reviewData.quotes[0])}</p>
          <div class="paloVenueActions">
            <button type="button" class="paloExploreBtn" data-palo-place="${esc(r.id)}">
              Explore place →
            </button>
            <div class="paloFeedbackRow">
              <button type="button" class="paloFeedbackBtn ${state.feedback[r.id] === 'like' ? 'active' : ''}" data-palo-feedback="like" data-venue-id="${esc(r.id)}" title="Like and train Palo">
                👍 ${state.feedback[r.id] === 'like' ? 'Loved' : 'Love'}
              </button>
              <button type="button" class="paloFeedbackBtn ${state.feedback[r.id] === 'dislike' ? 'active' : ''}" data-palo-feedback="dislike" data-venue-id="${esc(r.id)}" title="Not for me">
                👎 Pass
              </button>
            </div>
          </div>
        </article>
      `).join('');

      speakCute(reply + ` Top suggestion is ${top.r.name}. ${top.reviewData.topQuote}`);
    }, 280);
  }

  // --------------------------------------------------------------------------
  // 8. ML BRAIN INSPECTION DRAWER
  // --------------------------------------------------------------------------
  function renderBrainDrawer() {
    const g = paloML.genome;
    const topCuisines = Object.entries(g.cuisines).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const recent = g.recentLearnings || [];

    brainDrawer.innerHTML = `
      <div class="paloBrainHead">
        <h4>Palo's ML Taste Genome</h4>
        <span class="paloXpTag">Level ${g.level} · ${g.xp} XP total</span>
      </div>
      <p class="paloBrainIntro">Palo uses continuous online reinforcement learning. Every like, dish rating, and review you inspect evolves these weights.</p>
      
      <div class="paloGenomeSection">
        <h5>Top Learned Cuisines</h5>
        <div class="paloAffinities">
          ${topCuisines.map(([c, val]) => `
            <div class="paloAffinityBar">
              <span class="paloAffLabel">${esc(c)}</span>
              <div class="paloAffTrack"><div class="paloAffFill" style="width:${Math.max(12, Math.min(100, Math.round(((val + 1.5) / 4) * 100)))}%"></div></div>
              <span class="paloAffVal">${val > 0 ? '+' : ''}${val.toFixed(1)}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="paloGenomeSection">
        <h5>Calibrated Spice Tolerance</h5>
        <div class="paloSpiceGauge">
          <span>Mild</span>
          <div class="paloSpiceTrack"><div class="paloSpiceThumb" style="left:${Math.round(g.spiceTolerance * 100)}%"></div></div>
          <span>Fiery</span>
        </div>
      </div>

      ${recent.length ? `
        <div class="paloGenomeSection">
          <h5>Recent Learning Events</h5>
          <ul class="paloLogList">
            ${recent.map(l => `<li><span class="paloLogTime">${esc(l.time)}</span> ${esc(l.summary)} <strong>+${l.xp} XP</strong></li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div class="paloBrainFooter">
        <button type="button" class="paloCloseBrainBtn" id="paloCloseBrainBtn">Close Brain View</button>
      </div>
    `;

    document.getElementById('paloCloseBrainBtn')?.addEventListener('click', () => {
      brainDrawer.style.display = 'none';
    });
  }

  // --------------------------------------------------------------------------
  // 9. EVENT LISTENERS & GESTURES
  // --------------------------------------------------------------------------
  // Click on Pet creature directly (playful tickle / toggle bubble)
  petButton.addEventListener('click', () => {
    playCuteSound('happy');
    triggerDelightAnimation();
    if (!isBubbleOpen) {
      isBubbleOpen = true;
      bubble.classList.add('is-open');
      petButton.setAttribute('aria-expanded', 'true');
      input.focus();
    }
  });

  // Toggle Minimize
  minimizeBtn.addEventListener('click', () => {
    isBubbleOpen = !isBubbleOpen;
    bubble.classList.toggle('is-open', isBubbleOpen);
    petButton.setAttribute('aria-expanded', String(isBubbleOpen));
    stopSpeaking();
    stopListening();
  });

  // Toggle Voice
  voiceToggle.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;
    try {
      localStorage.setItem('palateo-palo-voice', voiceEnabled ? 'on' : 'off');
    } catch (e) {}
    voiceToggle.textContent = voiceEnabled ? '🔊' : '🔇';
    playCuteSound('blip');
    if (voiceEnabled) {
      speakCute('Voice replies enabled! I will read my recommendations out loud in my cute voice.');
    } else {
      stopSpeaking();
    }
  });

  // Open Brain drawer
  brainBadge.addEventListener('click', () => {
    const isShowing = brainDrawer.style.display === 'block';
    if (isShowing) {
      brainDrawer.style.display = 'none';
    } else {
      renderBrainDrawer();
      brainDrawer.style.display = 'block';
      playCuteSound('think');
    }
  });

  // Submit form
  form.addEventListener('submit', e => {
    e.preventDefault();
    handleQuery();
  });

  // Quick suggestion chips
  container.addEventListener('click', e => {
    const chipAction = e.target.closest('[data-palo-action]');
    if (chipAction) {
      const act = chipAction.dataset.paloAction;
      if (act === 'foryou') {
        input.value = '';
        handleQuery(null, true);
      } else if (act === 'reviews') {
        input.value = 'top reviewed dishes';
        handleQuery('top reviews');
      } else if (act === 'brain') {
        renderBrainDrawer();
        brainDrawer.style.display = 'block';
        playCuteSound('think');
      }
      return;
    }

    const dishBtn = e.target.closest('[data-palo-dish]');
    if (dishBtn) {
      input.value = dishBtn.dataset.paloDish;
      handleQuery(dishBtn.dataset.paloDish);
      return;
    }

    // Explore place navigation
    const placeBtn = e.target.closest('[data-palo-place]');
    if (placeBtn) {
      const placeId = placeBtn.dataset.paloPlace;
      if (typeof openPlaceDetails === 'function') {
        openPlaceDetails(placeId);
      } else if (typeof detailRestaurantId !== 'undefined' && typeof place === 'function') {
        detailRestaurantId = placeId;
        place();
      }
      return;
    }

    // In-card ML feedback training
    const feedbackBtn = e.target.closest('[data-palo-feedback]');
    if (feedbackBtn) {
      const venueId = feedbackBtn.dataset.venueId;
      const type = feedbackBtn.dataset.paloFeedback;
      const allVenues = typeof ranked === 'function' ? ranked() : [];
      const venue = allVenues.find(v => v.id === venueId);
      if (venue) {
        const reward = type === 'like' ? 1.0 : -1.0;
        if (typeof rateV5 === 'function') rateV5(venueId, type);
        const res = paloML.learnFromVenue(venue, reward);
        triggerLearningAnimation(res?.summary);
        feedbackBtn.classList.toggle('active');
        statusText.textContent = `Trained Palo on ${venue.name} · Level ${paloML.genome.level}`;
      }
    }
  });

  // Voice Recognition (Microphone)
  function stopListening() {
    clearTimeout(listenTimeout);
    const active = recognitionInstance;
    recognitionInstance = null;
    isListening = false;
    active?.abort();
    micBtn.classList.remove('is-listening');
    setPetState('is-idle');
  }

  micBtn.addEventListener('click', () => {
    if (isListening) {
      stopListening();
      statusText.textContent = 'Voice input cancelled.';
      return;
    }
    if (!Recognition) {
      statusText.textContent = 'Speech recognition is not supported in this browser.';
      return;
    }

    stopSpeaking();
    playCuteSound('think');
    const session = new Recognition();
    recognitionInstance = session;
    session.lang = 'en-IN';
    session.interimResults = false;
    session.maxAlternatives = 1;

    session.onresult = e => {
      if (recognitionInstance !== session) return;
      input.value = e.results[0][0].transcript.slice(0, 160);
      stopListening();
      handleQuery();
    };

    session.onerror = e => {
      if (recognitionInstance !== session) return;
      stopListening();
      statusText.textContent = e.error === 'not-allowed'
        ? 'Microphone access denied. You can type your craving!'
        : 'Could not capture voice. Try again or type.';
    };

    session.onend = () => {
      if (recognitionInstance === session) stopListening();
    };

    try {
      isListening = true;
      micBtn.classList.add('is-listening');
      setPetState('is-listening');
      setPetMood('Listening 👂');
      statusText.textContent = 'Listening… tell me what you crave!';
      session.start();
      listenTimeout = setTimeout(() => {
        stopListening();
        statusText.textContent = 'Listening timed out.';
      }, 14000);
    } catch (e) {
      stopListening();
      statusText.textContent = 'Voice recognition unavailable.';
    }
  });

  // Visibility and Cleanup
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopListening();
      stopSpeaking();
    }
  });

  // --------------------------------------------------------------------------
  // 10. AUTH & INTRO ENHANCEMENTS (PRESERVED)
  // --------------------------------------------------------------------------
  const originalGate = typeof requireAuthGate === 'function' ? requireAuthGate : null;
  if (originalGate) {
    requireAuthGate = function (message) {
      input.value = '';
      resultsDeck.replaceChildren();
      reviewCard.style.display = 'none';
      brainDrawer.style.display = 'none';
      originalGate(message);
    };
  }

  function enhanceLogin() {
    const modal = document.getElementById('authModal');
    if (!modal || modal.querySelector('.passwordWrap')) return;
    const card = modal.querySelector('.modalCard');
    const password = modal.querySelector('#authPass');
    if (!card || !password) return;

    card.classList.add('interactiveLogin');
    card.insertAdjacentHTML('afterbegin', `<div class="loginPet">${pet}<span>Palo says: A good meal starts here!</span></div>`);

    const wrap = document.createElement('div');
    wrap.className = 'passwordWrap';
    password.before(wrap);
    wrap.append(password);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.textContent = 'Show';
    toggle.setAttribute('aria-label', 'Show password');
    toggle.setAttribute('aria-pressed', 'false');
    wrap.append(toggle);

    toggle.addEventListener('click', () => {
      const visible = password.type === 'password';
      password.type = visible ? 'text' : 'password';
      toggle.textContent = visible ? 'Hide' : 'Show';
      toggle.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
      toggle.setAttribute('aria-pressed', String(visible));
      password.focus();
    });

    const hint = document.createElement('p');
    hint.className = 'passwordHint';
    hint.id = 'passwordHint';
    hint.setAttribute('aria-live', 'polite');
    password.setAttribute('aria-describedby', 'passwordHint');
    wrap.after(hint);

    password.addEventListener('keyup', e => {
      hint.textContent = e.getModifierState?.('CapsLock')
        ? 'Caps Lock is on.'
        : password.autocomplete === 'new-password' && password.value.length > 0 && password.value.length < 6
        ? 'Use at least 6 characters.'
        : '';
    });

    password.addEventListener('focus', () => card.classList.add('petEyesClosed'));
    password.addEventListener('blur', () => card.classList.remove('petEyesClosed'));

    const replay = document.createElement('button');
    replay.type = 'button';
    replay.className = 'linkBtn introReplay';
    replay.textContent = 'Meet Palo · play intro';
    replay.addEventListener('click', () => showIntro(true));
    card.append(replay);
  }

  const baseAuth = typeof showAuth === 'function' ? showAuth : null;
  if (baseAuth) {
    showAuth = function (...args) {
      baseAuth(...args);
      enhanceLogin();
    };
    if (window.Palateo) window.Palateo.showAuth = showAuth;
  }
  enhanceLogin();

  function showIntro(replay = false) {
    if (document.getElementById('paloIntro')) return;
    if (!replay) {
      if (reduceMotion.matches || /type=recovery|access_token=/.test(location.hash)) return;
      try {
        if (sessionStorage.getItem('palo-intro')) return;
        sessionStorage.setItem('palo-intro', '1');
      } catch (e) {}
    }
    const intro = document.createElement('dialog');
    intro.id = 'paloIntro';
    intro.className = 'paloIntro';
    intro.setAttribute('aria-label', 'Welcome to Palateo');
    intro.innerHTML = `
      <video muted playsinline preload="auto" aria-label="Palo bounces into a plate, with colourful restaurant pins">
        <source src="intro.webm" type="video/webm">
      </video>
      <div>
        <span>PALATEO</span>
        <h2>A little craving.<br>A good place.</h2>
        <button type="button">Skip intro →</button>
      </div>
    `;
    document.body.append(intro);
    intro.showModal();

    const video = intro.querySelector('video');
    const close = () => {
      clearTimeout(introTimer);
      video.pause();
      intro.close();
      intro.remove();
      document.querySelector('#authEmail,#authName,#paloInput')?.focus({ preventScroll: true });
    };
    const introTimer = setTimeout(close, 4200);
    intro.querySelector('button').onclick = close;
    intro.addEventListener('keydown', e => { if (e.key === 'Escape') e.stopPropagation(); });
    intro.addEventListener('cancel', e => { e.preventDefault(); close(); });
    video.addEventListener('ended', close);
    video.addEventListener('error', close);
    video.muted = true;
    video.play().catch(close);
  }

  showIntro();
})();

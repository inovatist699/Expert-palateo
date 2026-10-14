/* ==========================================================================
   PALATEO AI CULINARY PET COMPANION (PALO)
   - Living animated on-screen vector mascot (not a blocking window modal!)
   - Cute pitched voice synthesis + procedural Web Audio chirps & chimes
   - Explicit account feedback trains a bounded taste ranking model
   - Catalogue-grounded suggestions and temporary conversation filters
   ========================================================================== */
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  // --------------------------------------------------------------------------
  // 1. PALO SVG CHARACTER TEMPLATE
  // --------------------------------------------------------------------------
  const paloCharacterSvg = `
    <div class="paloCreature" id="paloCreature" role="button" tabindex="0" aria-label="Palo, your lively AI food companion">
      <div class="paloVoiceHalo" aria-hidden="true"></div>
      <div class="paloSparkles" id="paloSparkles" aria-hidden="true"></div>
      <span class="palo" aria-hidden="true">
        <span class="paloLeaf"></span>
        <span class="paloFace">
          <i></i><i></i><b></b>
        </span>
        <span class="paloFoot left"></span>
        <span class="paloFoot right"></span>
      </span>
      <svg class="paloSvg" viewBox="0 0 100 100" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;" aria-hidden="true"></svg>
      <span class="paloMoodPill" id="paloMoodPill">Palo · Your food companion</span>
    </div>
  `;

  // Mini pet badge for header and login
  const pet = `<span class="palo" aria-hidden="true"><span class="paloLeaf"></span><span class="paloFace"><i></i><i></i><b></b></span><span class="paloFoot left"></span><span class="paloFoot right"></span></span>`;

  // --------------------------------------------------------------------------
  // 2. ACCOUNT TASTE SUMMARY
  // --------------------------------------------------------------------------
  class PaloMLTasteEngine {
    constructor() {
      this.aiLearnings = [];
      this.aiCuisines = {};
      this.aiVibes = {};
      this.aiDishes = {};
      this.aiXP = 0;
    }
    get genome(){
      const feedback=typeof state==='undefined'?{}:state.feedback||{},dishes=typeof state==='undefined'?{}:normalizeDishFeedback(state.dishFeedback),entries=Object.entries(feedback).filter(([,v])=>['like','dislike'].includes(v)),cuisines={};
      for(const [id,value] of entries){const r=activeRestaurant(id);for(const c of r?.c||[])cuisines[c]=(cuisines[c]||0)+(value==='like'?1:-1)}
      for(const [c,val] of Object.entries(this.aiCuisines)){cuisines[c]=(cuisines[c]||0)+val}
      const mergedDishes={...dishes,...this.aiDishes};
      const baseXP=entries.length+Object.keys(dishes).length;
      const totalXP=baseXP+this.aiXP;
      const recentLearnings=[
        ...entries.slice(-6).map(([id,v])=>({time:'Feedback',summary:v+': '+(activeRestaurant(id)?.name||'place'),xp:0})),
        ...this.aiLearnings.slice(-6)
      ].slice(-8);
      return {version:8,xp:totalXP,level:entries.length,title:'Personal taste model',totalInteractions:entries.length+this.aiLearnings.length,cuisines,vibes:this.aiVibes,priceSensitivity:{},reviewKeywords:{},dishWeights:mergedDishes,spiceTolerance:state.answers?.spice==='hot'?1:state.answers?.spice==='mild'?0:.5,recentLearnings,omniRouteConnected:this.omniRouteConnected===true};
    }
    saveGenome(){} // Preference storage and sync belong to the existing account store.
    learnFromVenue(venue){tasteModelCache=null;return {summary:'Updated preferences for '+venue.name,leveledUp:false}}
    learnFromDish(id,name){return {summary:'Updated dish preference: '+name,leveledUp:false}}
    learnFromWebSearch(insights){return this.learnFromOmniRoute(insights,'Web search')}
    learnFromOmniRoute(insights,query=''){
      return {summary:'Use Love or Pass to teach Palo your preferences.',leveledUp:false};
    }
    evaluateVenue(venue){return rec(venue).score}
    recalculateLevel(){return false}
  }
  const paloML=new PaloMLTasteEngine();

  // --------------------------------------------------------------------------
  // 3. PERSISTENT LONG-TERM EPISODIC MEMORY & ADAPTIVE LEARNING STORE
  // --------------------------------------------------------------------------
  class PaloMemoryStore {
    constructor(){this.owner=null;this._data={episodes:[]};}
    get data(){
      const owner=typeof currentUser==='undefined'?null:currentUser?.id||null;
      if(owner!==this.owner){
        this.owner=owner;this._data={episodes:[]};
        if(owner)try{
          const saved=JSON.parse(localStorage.getItem('palateo-palo-memory-v2:'+owner)||'null');
          if(saved&&Array.isArray(saved.episodes))this._data.episodes=saved.episodes.filter(e=>e&&Number.isFinite(e.time)&&e.time<=Date.now()&&Date.now()-e.time<30*86400000&&typeof e.query==='string').slice(-25).map(e=>({time:e.time,query:e.query.slice(0,120),topic:typeof e.topic==='string'?e.topic.slice(0,80):'',venue:typeof e.venue==='string'?e.venue.slice(0,100):null}));
        }catch{}
      }
      return this._data;
    }
    save(){const data=this.data;if(this.owner)try{localStorage.setItem('palateo-palo-memory-v2:'+this.owner,JSON.stringify(data))}catch{}}
    recordInteraction(query,recommendation,meta={}){
      const data=this.data;if(!this.owner||!String(query||'').trim())return;
      // Questions are recent topics, never implicit positive training labels.
      data.episodes=data.episodes.filter(e=>Date.now()-e.time<30*86400000);
      data.episodes.push({time:Date.now(),query:String(query).slice(0,120),topic:meta.isConversational?'':String(meta.dish||query).slice(0,80),venue:meta.venue?String(meta.venue).slice(0,100):null});
      data.episodes=data.episodes.slice(-25);this.save();
    }
    getMemorySummary(){
      const episodes=this.data.episodes.filter(e=>Date.now()-e.time<30*86400000),recentTopics=[...new Set(episodes.slice().reverse().map(e=>e.topic).filter(Boolean))].slice(0,3);
      return {persona:'Learning from your explicit feedback',recentTopics,topCravings:recentTopics.join(', '),recentVenue:episodes.at(-1)?.venue||null,lastInteraction:episodes.at(-1)?.query||null,totalEpisodes:episodes.length,autonomousCycles:0};
    }
    clear(){this.data.episodes=[];this.save();}
  }
  const paloMemory = new PaloMemoryStore();
  if (typeof window !== 'undefined') window.paloMemory = paloMemory;

  // --------------------------------------------------------------------------
  // 3.5 AUTONOMOUS CONTINUOUS LEARNING LOOP
  // --------------------------------------------------------------------------
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
      } else if (type === 'joy') {
        // Joyful multi-tone sparkling ascending arpeggio with shimmer (A5, C#6, E6, A6)
        const notes = [880, 1108.7, 1318.5, 1760];
        notes.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'triangle';
          const t = now + idx * 0.045;
          o.frequency.setValueAtTime(freq, t);
          o.frequency.exponentialRampToValueAtTime(freq * 1.05, t + 0.06);
          g.gain.setValueAtTime(0.08, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(t);
          o.stop(t + 0.12);
        });
      } else if (type === 'curious') {
        // Inquisitive upward pitch slide chirps
        const o1 = ctx.createOscillator();
        const g1 = ctx.createGain();
        o1.type = 'sine';
        o1.frequency.setValueAtTime(520, now);
        o1.frequency.exponentialRampToValueAtTime(780, now + 0.07);
        g1.gain.setValueAtTime(0.07, now);
        g1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        o1.connect(g1);
        g1.connect(ctx.destination);
        o1.start(now);
        o1.stop(now + 0.09);

        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.type = 'sine';
        o2.frequency.setValueAtTime(760, now + 0.095);
        o2.frequency.exponentialRampToValueAtTime(1180, now + 0.18);
        g2.gain.setValueAtTime(0.08, now + 0.095);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 0.21);
        o2.connect(g2);
        g2.connect(ctx.destination);
        o2.start(now + 0.095);
        o2.stop(now + 0.21);
      } else if (type === 'warm') {
        // Soothing warm harmonic chord (C5 + E5 soft bell)
        [523.25, 659.25].forEach(freq => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now);
          o.frequency.exponentialRampToValueAtTime(freq * 0.99, now + 0.24);
          g.gain.setValueAtTime(0.06, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(now);
          o.stop(now + 0.25);
        });
      } else if (type === 'playful') {
        // Fun staccato bouncy syncopated chirps
        const pNotes = [720, 940, 680, 1100];
        pNotes.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'triangle';
          const t = now + idx * 0.04;
          o.frequency.setValueAtTime(freq, t);
          g.gain.setValueAtTime(0.07, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(t);
          o.stop(t + 0.06);
        });
      } else if (type === 'gentle') {
        // Soft calming descending bell (G4 -> F4 soft sine)
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(440, now);
        o.frequency.exponentialRampToValueAtTime(392, now + 0.22);
        g.gain.setValueAtTime(0.06, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now);
        o.stop(now + 0.24);
      }
    } catch (e) {}
  }

  // Emotional Voice Profiles & Tone Modulation
  const EMOTION_VOICE_PROFILES = {
    joy: {
      pitch: 1.62,
      rate: 1.08,
      sound: 'joy',
      label: 'Excited! 🌟',
      petState: 'is-joyful',
      intros: [
        'Arrey waah waah! ',
        'Ohooo kya baat hai! ',
        'Maza aa gaya! ',
        'Wah bhai wah! '
      ]
    },
    curious: {
      pitch: 1.46,
      rate: 0.98,
      sound: 'curious',
      label: 'Curious 🧐',
      petState: 'is-curious',
      intros: [
        'Achaaa? Suno na! ',
        'Arrey sach me? Dekho na! ',
        'Kamaal ki baat hai! '
      ]
    },
    warm: {
      pitch: 1.38,
      rate: 0.95,
      sound: 'warm',
      label: 'Loving 🥰',
      petState: 'is-warm',
      intros: [
        'Aahaa! Dil khush ho gaya! ',
        'Wah ji wah, ekdum sukoon bhara swad! ',
        'Kitna pyara swad hai! '
      ]
    },
    playful: {
      pitch: 1.54,
      rate: 1.05,
      sound: 'playful',
      label: 'Teekha & Fun! 🌶️',
      petState: 'is-playful',
      intros: [
        'Oho boss! Sambhal ke! ',
        'Scene ekdum set hai! ',
        'Bawaal tadka lagega boss! '
      ]
    },
    gentle: {
      pitch: 1.34,
      rate: 0.92,
      sound: 'gentle',
      label: 'Caring 🤗',
      petState: 'is-gentle',
      intros: [
        'Koi baat nahi ji! ',
        'Bilkul fikar mat karo! ',
        'Haanji, maine note kar liya. '
      ]
    },
    friendly: {
      pitch: 1.48,
      rate: 1.02,
      sound: 'blip',
      label: 'Happy 😊',
      petState: 'is-speaking',
      intros: [
        'Arrey wah! ',
        'Namaste ji! '
      ]
    }
  };

  function detectEmotion(text, context = {}) {
    if (context.emotion && EMOTION_VOICE_PROFILES[context.emotion]) {
      return context.emotion;
    }
    const str = String(text || '').toLowerCase();

    // Dislike, pass, skip, comfort reassurance
    if (context.action === 'dislike' ||
        /^(not for me|pass|avoid|skip|hate|dislike|nahi pasand|bura lagta|koi baat nahi|fikar mat)/i.test(str) ||
        /(koi baat nahi|fikar mat|theek hai.*noted|avoid karte)/i.test(str)) {
      return 'gentle';
    }

    // Web search / learning / discovery
    if (context.isWebSearch || /(web search|learned from web|seekh liya|naya swad|online foodie|trending food|khoja)/i.test(str)) {
      return 'curious';
    }

    // Joy / celebratory / high match fit / love / biryani / iconic celebration
    if (context.action === 'like' ||
        /(waah waah|mazaa|lajawaab|ek number|fit 9|fida|mast biryani|dil se tareef|loved|leveled up|level \d+)/i.test(str)) {
      return 'joy';
    }

    // Spicy / party / night club / street hangout / teekha
    if (/(chatpata|teekha|tikha|tadka|mirchi|spicy|party club|nightclub|party|bawaal|jhakaas|scene|adda|gang|dosto ke sath)/i.test(str)) {
      return 'playful';
    }

    // Sweet / desserts / chai / tea / thali / sukoon / date / comfort
    if (/(kuch meetha|meetha|mithai|dessert|cheesecake|pastry|chai|kadak chai|filter coffee|sukoon|date night|romantic|thali|desi thali|ghar jaisa)/i.test(str)) {
      return 'warm';
    }

    return 'friendly';
  }

  let activeUtterance = null;
  function stopSpeaking() {
    activeUtterance = null;
    window.speechSynthesis?.cancel();
    setPetMood('Ready!');
    setPetState('is-idle');
  }

  // Format speech with cheerful Indian Hindi accent conversational markers & intonation
  function toIndianHindiAccentSpoken(text, emotion = 'friendly') {
    if (!text) return '';
    let spoken = String(text);
    const profile = EMOTION_VOICE_PROFILES[emotion] || EMOTION_VOICE_PROFILES.friendly;

    const hasIntro = /(arrey|arre|wah|bhai|haanji|dekho|bawaal|mast|jhakaas|lajawaab|swad|swaad|zaika|chahiye|khana|aahaa|oho|achaa|acha|koi baat|bilkul|shubh|phir milte|main hoon|aapka swagat|good morning|good afternoon|good evening|good night)/i.test(spoken);

    if (!hasIntro) {
      if (/^Here are my top picks/i.test(spoken)) {
        spoken = spoken.replace(/^Here are my top picks/i, 'Arrey wah! Dekho na, ye rahe mere top recommendations');
      } else if (/^Found (\d+) spots/i.test(spoken)) {
        spoken = spoken.replace(/^Found (\d+) spots/i, 'Arrey suno! $1 zabardast spots mile hain');
      } else if (/^I learned/i.test(spoken)) {
        spoken = 'Wah bhai wah! ' + spoken;
      } else if (/^Voice replies enabled/i.test(spoken)) {
        spoken = 'Arrey waah! Voice replies on ho gaye hain. Ab main apni cute awaaz me padh kar sunaunga!';
      } else {
        const intro = profile.intros[0] || 'Arrey wah! ';
        spoken = intro + spoken;
      }
    }
    return spoken;
  }

  function speakCute(text, emotion = 'auto') {
    stopSpeaking();
    if (!voiceEnabled || !window.speechSynthesis) return;

    const resolvedEmotion = emotion === 'auto'
      ? detectEmotion(text)
      : (EMOTION_VOICE_PROFILES[emotion] ? emotion : 'friendly');
    const profile = EMOTION_VOICE_PROFILES[resolvedEmotion] || EMOTION_VOICE_PROFILES.friendly;

    const spokenText = toIndianHindiAccentSpoken(text, resolvedEmotion);
    const speech = new SpeechSynthesisUtterance(spokenText);
    activeUtterance = speech;

    const voices = window.speechSynthesis.getVoices();
    // 1. High priority: Authentic native Hindi voices (hi-IN)
    const hindiVoice = voices.find(v => /(hindi|google\s*हिन्दी|google\s*hindi|swara|kalpana|hemant|lekha|madhur|neerja|geeta)/i.test(v.name) || /^hi(-in)?$/i.test(v.lang));
    // 2. High priority: Indian English voices (en-IN)
    const indianEnVoice = voices.find(v => /(india|indian|ravi|heera|veena|rishi|sangeeta|priya|kavya)/i.test(v.name) || /^en-in$/i.test(v.lang));
    // 3. Fallback voices
    const cuteFallback = voices.find(v => /(samantha|victoria|karen|tessa|moira|google uk english female|google us english)/i.test(v.name))
      || voices.find(v => /^en/i.test(v.lang))
      || null;

    const indianVoice = hindiVoice || indianEnVoice || cuteFallback;
    if (indianVoice) speech.voice = indianVoice;
    const isHindiUtterance = /(hai|kahan|batao|kuch|swad|mast|teekha|meetha|khana|pasand|bhai|arrey|dekho|zaika|khao|chahiye|badhiya|waah|aahaa|oho|acha)/i.test(spokenText);
    speech.lang = indianVoice?.lang || (isHindiUtterance ? 'hi-IN' : 'en-IN');

    // Emotion-modulated rate and pitch!
    speech.rate = profile.rate || 1.02; // Emotional cadence
    speech.pitch = 1.0 * (profile.pitch || 1.48); // Cute mascot pitch = 1.34 to 1.62 tuned to emotion

    speech.onstart = () => {
      if (activeUtterance !== speech) return;
      setPetState(profile.petState || 'is-speaking');
      setPetMood(profile.label || 'Talking 🎵');
      playCuteSound(profile.sound || 'blip');
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

  // Expose emotion voice engine for testing and external controllers
  window.paloEmotionEngine = {
    EMOTION_VOICE_PROFILES,
    detectEmotion,
    speakCute,
    playCuteSound,
    toIndianHindiAccentSpoken
  };

  // --------------------------------------------------------------------------
  // 4.5 PALO WEB SEARCH ENGINE (ONLINE CULINARY KNOWLEDGE & LIVE LEARNING)
  // --------------------------------------------------------------------------


  // --------------------------------------------------------------------------
  // 5. ON-SCREEN PET UI MOUNT (NON-BLOCKING DOCK & SPEECH BUBBLE)
  // --------------------------------------------------------------------------
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const paloContainerHtml = `
    <aside id="paloContainer" class="paloContainer" aria-label="Palo culinary pet companion">
      <!-- Living Character Pet (Click to tickle / expand) -->
      <div id="paloPetButton" class="paloPetWrapper" role="button" tabindex="0" aria-label="Talk to Palo, your culinary pet" aria-expanded="false">
        ${paloCharacterSvg}
      </div>

      <!-- Non-Blocking Speech Bubble & Recommendation Hub -->
      <div id="paloBubble" class="paloBubble" role="region" aria-label="Palo's conversation and recommendations">
        <div class="paloBubbleTail" aria-hidden="true"></div>
        <header class="paloBubbleHeader">
          <div class="paloIdentity">
            <span class="paloAvatarBadge" aria-hidden="true">${pet}</span>
            <div>
              <div class="paloTitleRow">
                <h3>Palo</h3>
                <span class="paloLiveDot" title="Palo is ready" aria-hidden="true"></span>
                <button type="button" class="paloBrainBadge" id="paloBrainBadge" title="Your taste memory">
                  <span id="paloLevelNum">0</span> reactions · <span id="paloXpNum">0</span> preferences
                </button>
              </div>
              <p class="paloSubtitle">Learns your taste · Remembers this conversation</p>
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
            Hi, I’m Palo. Tell me what sounds good. I can follow up with cheaper, quieter or less-spicy options.
          </p>
        </div>

        <!-- Live Cognitive Thinking Stream (Palo's Own Brain in Action!) -->
        <div id="paloThoughtBox" class="paloThoughtBox" style="display:none;">
          <div class="paloThoughtHeader" id="paloThoughtToggle" role="button" tabindex="0">
            <span class="paloThoughtBadge">🧠 Palo's Train of Thought</span>
            <span class="paloThoughtState" id="paloThoughtState">Reasoning active</span>
            <span class="paloThoughtChevron" id="paloThoughtChevron" aria-hidden="true">▾</span>
          </div>
          <div class="paloThoughtSteps" id="paloThoughtSteps"></div>
        </div>

        <!-- Latest Review Citation Card (Populated on recommendations) -->
        <div id="paloReviewHighlight" class="paloReviewCard" style="display:none;"></div>

        <!-- Live Web Search & ML Insight Card -->
        <div id="paloWebSearchResult" class="paloWebSearchCard" style="display:none;"></div>

        <!-- Quick Suggestions Chips (English & Hinglish) -->
        <div class="paloChipRail" aria-label="Quick requests"><button type="button" data-palo-action="foryou">Pick for me</button><button type="button" data-palo-dish="cheaper">Cheaper</button><button type="button" data-palo-dish="less spicy">Less spicy</button><button type="button" data-palo-dish="somewhere quiet">Quiet place</button><button type="button" data-palo-dish="show me different places">Other options</button><button type="button" data-palo-action="brain">Teach Palo</button></div>

        <!-- Results Deck -->
        <div id="paloResultsDeck" class="paloResultsDeck"></div>

        <!-- ML Brain Inspection Drawer -->
        <section id="paloBrainDrawer" class="paloBrainDrawer" style="display:none;" aria-label="Your taste memory"></section>

        <!-- Input Bar (Text + Voice Recognition) -->
        <form id="paloForm" class="paloForm">
          <div class="paloInputRow">
            <input id="paloInput" aria-label="Tell Palo what you want to eat" maxlength="160" placeholder="Ask for a dish, vibe, or craving…" autocomplete="off">
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
  const webSearchCard = document.getElementById('paloWebSearchResult');
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

  const thoughtBox = document.getElementById('paloThoughtBox');
  const thoughtSteps = document.getElementById('paloThoughtSteps');
  const thoughtToggle = document.getElementById('paloThoughtToggle');
  const thoughtState = document.getElementById('paloThoughtState');

  let isBubbleOpen = false;
  let isListening = false;
  let recognitionInstance = null;
  let listenTimeout = null;

  function updateBrainStats() {
    if (levelNum) levelNum.textContent = paloML.genome.level;
    if (xpNum) xpNum.textContent = paloML.genome.xp;
  }
  updateBrainStats();

  function setPetMood(text) {
    if (moodPill) moodPill.textContent = `Palo · ${text}`;
  }

  function setPetState(stateClass) {
    const creature = document.getElementById('paloCreature');
    if (!creature) return;
    creature.classList.remove(
      'is-idle', 'is-speaking', 'is-learning', 'is-listening', 'is-thinking', 'is-delighted',
      'is-joyful', 'is-curious', 'is-warm', 'is-playful', 'is-gentle'
    );
    if (stateClass) creature.classList.add(stateClass);
    if (stateClass && stateClass !== 'is-idle' && stateClass !== 'is-listening' && stateClass !== 'is-thinking') {
      creature.classList.add('is-speaking');
    }
  }

  function renderThoughtBox(thoughtChain) {
    if (!thoughtBox || !thoughtSteps) return;
    if (!thoughtChain || !thoughtChain.length) {
      thoughtBox.style.display = 'none';
      return;
    }
    thoughtBox.style.display = 'block';
    thoughtSteps.style.display = 'flex';
    if (thoughtState) thoughtState.textContent = `${thoughtChain.length}-step reasoning`;
    thoughtSteps.innerHTML = thoughtChain.map(step => `
      <div class="paloThoughtStep">
        <span class="paloThoughtIcon" aria-hidden="true">${esc(step.icon || '🧠')}</span>
        <div>
          <strong class="paloThoughtStage">${esc(step.stage)}</strong>
          <p class="paloThoughtDesc">${esc(step.text)}</p>
        </div>
      </div>
    `).join('');
  }

  const thoughtChevron = document.getElementById('paloThoughtChevron');
  thoughtToggle?.addEventListener('click', () => {
    if (thoughtSteps) {
      const isHidden = thoughtSteps.style.display === 'none';
      thoughtSteps.style.display = isHidden ? 'flex' : 'none';
      if (thoughtState) thoughtState.textContent = isHidden ? 'Expanded' : 'Collapsed';
      if (thoughtChevron) thoughtChevron.style.transform = isHidden ? 'none' : 'rotate(-90deg)';
    }
  });

  function updateChipRail(category = 'default') {
    const rail = container ? container.querySelector('.paloChipRail') : document.querySelector('.paloChipRail');
    if (!rail) return;
    if (category === 'venue') {
      rail.innerHTML = '<button type="button" data-palo-dish="why this place">Why this place?</button><button type="button" data-palo-dish="cheaper">Cheaper</button><button type="button" data-palo-dish="less spicy">Less spicy</button><button type="button" data-palo-dish="kuch meetha">Pair dessert</button><button type="button" data-palo-dish="somewhere quiet">Quiet vibe</button><button type="button" data-palo-dish="show me different places">Other options</button><button type="button" data-palo-action="brain">Teach Palo</button>';
    } else if (category === 'ai') {
      rail.innerHTML = '<button type="button" data-palo-action="foryou">Pick for me</button><button type="button" data-palo-action="trail">1-Day food trail</button><button type="button" data-palo-action="debate">Vada pav vs samosa pav</button><button type="button" data-palo-dish="kuch meetha">Kuch meetha</button><button type="button" data-palo-dish="midnight craving">Late night</button><button type="button" data-palo-action="joke">Food joke</button><button type="button" data-palo-action="brain">Teach Palo</button>';
    } else {
      rail.innerHTML = '<button type="button" data-palo-action="foryou">Pick for me</button><button type="button" data-palo-dish="cheaper">Cheaper</button><button type="button" data-palo-dish="less spicy">Less spicy</button><button type="button" data-palo-dish="somewhere quiet">Quiet place</button><button type="button" data-palo-dish="show me different places">Other options</button><button type="button" data-palo-action="brain">Teach Palo</button>';
    }
  }

  function handlePonder(){handleQuery('what can you do')}

  function triggerDelightAnimation() {
    setPetState('is-joyful');
    playCuteSound('joy');
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

  let conversation={owner:null,city:null,dish:'',budget:null,spice:null,mood:null,excluded:[],offset:0,results:[],turns:[]};
  function resetConversation(){paloML.omniRouteConnected=false;conversation={owner:currentUser?.id||null,city:cityName(),dish:'',budget:null,spice:null,mood:null,excluded:[],offset:0,results:[],turns:[]};document.getElementById('paloTranscript')?.replaceChildren();updateChipRail('default');}
  function rememberTurn(role,text){
    conversation.turns.push({role,text:String(text).slice(0,600)});conversation.turns=conversation.turns.slice(-8);
    let log=document.getElementById('paloTranscript');if(!log){log=document.createElement('div');log.id='paloTranscript';log.setAttribute('aria-label','Recent conversation');form.before(log)}
    log.replaceChildren();for(const turn of conversation.turns.slice(0,role==='assistant'?-1:undefined)){const p=document.createElement('p');p.className='paloTurn '+turn.role;p.textContent=(turn.role==='user'?'You: ':'Palo: ')+turn.text;log.append(p)}log.scrollTop=log.scrollHeight;
  }
  function paloTasteContext(){
    const likes=[],dislikes=[];
    for(const [id,value] of Object.entries(state.feedback||{})){const r=activeRestaurant(id);if(r&&['like','dislike'].includes(value))(value==='like'?likes:dislikes).push(r.name+': '+(r.c||[]).join(', '));}
    for(const d of availableCalibrationDishes()){const value=state.dishFeedback?.[d.id];if(value==='love'||value==='pass')(value==='love'?likes:dislikes).push(d.name);}
    return {likes:likes.slice(-8),dislikes:dislikes.slice(-8)};
  }
  async function requestPalo(options) {
    const owner=currentUser?.id, city=cityName();
    if(!owner)throw Error('Sign in required');
    const consentKey='palateo-palo-ai-consent:'+owner;
    if(localStorage.getItem(consentKey)!=='2026-10-14'){
      if(!window.confirm('Enable live AI answers? Palo will send your food question, recent conversation, city and taste likes/dislikes through OmniRoute to Groq, DuckDuckGo, OpenRouter or UncloseAI. Provider privacy policies apply. Choose Cancel to keep using local recommendations. You can withdraw this choice in Privacy and account.'))throw Error('Live AI permission not granted');
      if(currentUser?.id!==owner)throw Error('Account changed');
      localStorage.setItem(consentKey,'2026-10-14');
    }
    if(typeof isRailwayActive==='function'&&isRailwayActive()){
      const data=await railwayFetch('/api/palo',{...options,signal:AbortSignal.timeout(25000)});
      if(currentUser?.id!==owner||cityName()!==city)throw Error('Conversation changed');
      return {ok:true,json:async()=>data};
    }
    const {data:{session}}=await getSupabaseClient().auth.getSession();
    if(!session?.access_token || currentUser?.id!==owner) throw Error('Sign in required');
    const response=await fetch((window.PALATEO_WEB_ORIGIN||'')+'/api/palo',{...options,headers:{...options.headers,Authorization:'Bearer '+session.access_token},signal:AbortSignal.timeout(25000)});
    if(currentUser?.id!==owner || cityName()!==city) throw Error('Conversation changed');
    return response;
  }
  function replyPalo(text, emotion = 'friendly'){
    messageText.textContent=text;
    statusText.textContent='Local taste recommendations';
    rememberTurn('assistant',text);
    updateBrainStats();
    setPetState(emotion === 'friendly' ? 'is-idle' : (EMOTION_VOICE_PROFILES[emotion]?.petState || 'is-idle'));
    setPetMood(EMOTION_VOICE_PROFILES[emotion]?.label || 'Here to help');
    speakCute(text, emotion);
  }
  function conversationCandidates(){
    const q=conversation.dish.toLowerCase(),aliases={pizza:'Italian',pasta:'Italian',dosa:'SouthIndian',idli:'SouthIndian',noodles:'Asian',momos:'Asian',sushi:'Asian',biryani:'Punjabi',paneer:'Punjabi',thali:'Gujarati',dhokla:'Gujarati',coffee:'Cafe',chai:'Cafe',brownie:'Dessert','ice cream':'Dessert'};
    const cuisines=new Set(Object.entries(aliases).filter(([word])=>q.includes(word)).map(([,c])=>c));
    for(const [c,words] of Object.entries(cuisineAliases))if(words.some(w=>q.includes(w)))cuisines.add(c);
    const tokens=q.split(/\s+/).filter(t=>t.length>2&&!['want','some','eat','craving','like','please','find','with','food','restaurant','restaurants','something','give','would','near','where','have','can','you','the','for','and','recommend','places','place','me','show'].includes(t));
    const priceRanks={under_500:0,'500_1000':1,'1000_2000':2,'2000_plus':3};
    const meat=/\b(chicken|mutton|pork|fish|beef|seafood)\b/.test(q);
    if(meat&&['veg','eggetarian'].includes(state.answers.diet))return [];
    const candidates=ranked().filter(r=>state.feedback[r.id]!=='dislike'&&!r.matchBreakdown?.some(f=>f.label==='Dietary options'&&f.factor<0)).filter(r=>{
      if(meat&&!(r.dietaryOptions||[]).some(d=>/non.?veg|mixed|both/i.test(d)))return false;
      if(conversation.budget!==null&&(!Object.hasOwn(priceRanks,r.p)||priceRanks[r.p]>conversation.budget))return false;
      if(conversation.spice&&r.s!==conversation.spice)return false;
      if(conversation.mood&&!(r.a||[]).some(a=>( {quiet:['quiet','cozy','calm','peaceful'],date:['romantic','date','intimate'],family:['family','kid-friendly'],lively:['lively','vibrant','music']}[conversation.mood]||[]).some(w=>String(a).toLowerCase().includes(w))))return false;
      const evidence=[r.name,...r.c||[],...r.t||[],...(Array.isArray(r.review_insights)?r.review_insights:[])].join(' ').toLowerCase();
      if(conversation.excluded.some(t=>evidence.includes(t)))return false;
      return !tokens.length||Array.from(cuisines).some(c=>(r.c||[]).some(actual=>String(actual).toLowerCase().replace(/[^a-z]/g,'')===c.toLowerCase().replace(/[^a-z]/g,'')))||tokens.some(t=>evidence.includes(t));
    });
    // Diversify close-scoring options by cuisine and area, while keeping taste fit primary.
    const selected=[],pool=[...candidates];while(pool.length&&selected.length<30){pool.sort((a,b)=>{const score=r=>r.score-selected.reduce((n,x)=>n+(x.area===r.area?1.5:0)+((x.c||[])[0]===(r.c||[])[0]?1.5:0),0);return score(b)-score(a)});selected.push(pool.shift())}return selected;
  }
  function renderConversationResults(){
    const all=conversationCandidates(),start=conversation.offset%Math.max(1,all.length),matches=all.slice(start,start+3);conversation.results=matches;
    resultsDeck.innerHTML=matches.map(r=>`<article class="paloVenueCard"><div class="paloVenueMeta"><div><span class="paloCuisineTag">${esc((r.c||[]).join(' · '))}</span><h4 class="paloVenueName">${esc(r.name)}</h4><p class="paloVenueSub">${esc(r.area||r.city)} · ${esc(displayPrice(r))}</p></div><div class="paloMatchPill"><strong>${r.score}%</strong><span>Est. fit</span></div></div><p class="paloVenueQuote">${esc((r.why||[]).slice(0,3).join(' · '))}</p><div class="paloVenueActions"><button type="button" class="paloExploreBtn" data-palo-place="${esc(r.id)}">Explore place →</button><div class="paloFeedbackRow">${['like','dislike'].map(v=>`<button type="button" class="paloFeedbackBtn" data-palo-feedback="${v}" data-venue-id="${esc(r.id)}" aria-pressed="${state.feedback[r.id]===v}">${state.feedback[r.id]===v?'Undo ':''}${v==='like'?'Love':'Pass'}</button>`).join('')}</div></div></article>`).join('');
    return {matches,total:all.length};
  }
  let queryVersion=0;
  async function handleQuery(forcedQuery=null,forYou=false,isWebSearch=false){
    const version=++queryVersion, owner=currentUser?.id, searchCity=cityName();
    stopSpeaking();stopListening();reviewCard.style.display='none';if(webSearchCard)webSearchCard.style.display='none';thoughtBox.style.display='none';
    if(conversation.owner!==currentUser?.id||conversation.city!==cityName())resetConversation();
    const query=String(forcedQuery===null?input.value:forcedQuery).trim().slice(0,300),q=query.toLowerCase();
    if(!isReady()){replyPalo('Sign in and finish your taste quiz first. Then I can tailor these suggestions to you.');return}
    if(!query&&!forYou)return;rememberTurn('user',query||'Pick for my taste');input.value='';
    // Conversational Small Talk & Mascot Interaction Handlers
    // 1. How are you / Health / Wellbeing
    if (/\b(how are you|how('s| is) it going|how are you doing|how do you do|how have you been|kaise ho|kaisa hai|kya haal|kya haal hai|sab theek|sab kaisa|sab badhiya|all good)\b/i.test(q)) {
      renderThoughtBox([
        { stage: 'Friendly Greeting', icon: '👋', text: 'Recognized conversational check-in from user.' },
        { stage: 'Mascot State', icon: '🐾', text: `Feeling energetic and scanning culinary favorites in ${cityName()}.` },
        { stage: 'Appetite Check', icon: '🍽️', text: 'Inquiring about today’s mood and cravings.' }
      ]);
      const reply = 'Arrey ekdum mast aur energetic! 🐾 Bas aapke taste preferences aur cravings ko dhyan me rakhkar naye swad dhoondh raha hoon. Aap batao, aaj ka din kaisa raha? Kuch khaas khane ka mann hai?';
      replyPalo(reply, 'joy');
      paloMemory.recordInteraction(query, reply, { emotion: 'joy', isConversational: true });
      updateChipRail('ai');
      return;
    }

    // 2. Who are you / Identity / Creator / Purpose
    if (/\b(who are you|what('s| is) your name|who made you|tum kaun ho|aap kaun ho|what are you|tell me about yourself|apna intro)\b/i.test(q)) {
      renderThoughtBox([
        { stage: 'Mascot Identity', icon: '🐾', text: 'Palateo AI taste companion and food navigator.' },
        { stage: 'Memory & Learning', icon: '🧠', text: 'Continuous reinforcement learning from user loves and passes.' },
        { stage: 'Guidance Ready', icon: '✨', text: 'Ready to recommend personalized dining spots across India.' }
      ]);
      const reply = 'Main hoon Palo! 🐾 Palateo ka lively AI food pet companion. Main aapki taste journey yaad rakhta hoon, cravings ko samajhta hoon, aur aapke shehar ke sabse authentic spots dhoondhta hoon! Aap mujhse kisi bhi dish, cuisine ya vibe ke baare me pooch sakte ho.';
      replyPalo(reply, 'curious');
      paloMemory.recordInteraction(query, reply, { emotion: 'curious', isConversational: true });
      updateChipRail('ai');
      return;
    }

    // 3. What are you doing / What's up / Current activity
    if (/\b(what are you doing|kya kar rahe ho|what'?s up|wassup|sup\b|kya chal raha hai|what you doing|what are u doing)\b/i.test(q)) {
      renderThoughtBox([
        { stage: 'Activity Scan', icon: '🔍', text: `Ready to browse the restaurant catalogue in ${cityName()}.` },
        { stage: 'Flavor Readiness', icon: '🍲', text: 'Armed with taste profile to match immediate cravings.' }
      ]);
      const reply = 'Main aapke saved taste aur restaurant catalogue se suggestions dene ke liye ready hoon! Shaam ki chai ho ya midnight cravings—main hamesha ready hoon. Aap batao, aaj kya craving chal rahi hai?';
      replyPalo(reply, 'playful');
      paloMemory.recordInteraction(query, reply, { emotion: 'playful', isConversational: true });
      updateChipRail('ai');
      return;
    }

    // 4. Time greetings: Morning / Afternoon / Evening / Night
    if (/\b(good morning|shubh prabhat)\b/i.test(q)) {
      renderThoughtBox([
        { stage: 'Morning Sun', icon: '☀️', text: 'Greeting user at start of the day.' },
        { stage: 'Breakfast Tuning', icon: '☕', text: 'Recommending filter coffee, dosas, and energizing breakfast.' }
      ]);
      const reply = 'Shubh Prabhat! ☀️ Ekdum fresh shuruat ke liye garam filter coffee, crispy dosa ya poha ka plan banayein? Batao kya mann hai!';
      replyPalo(reply, 'warm');
      paloMemory.recordInteraction(query, reply, { emotion: 'warm', isConversational: true });
      updateChipRail('ai');
      return;
    }
    if (/\b(good afternoon|shubh dopahar)\b/i.test(q)) {
      renderThoughtBox([
        { stage: 'Midday Pulse', icon: '🍲', text: 'Recognizing midday lunch hour.' },
        { stage: 'Wholesome Meals', icon: '🥗', text: 'Proposing comfort thalis or nourishing bowls.' }
      ]);
      const reply = 'Good afternoon ji! 🍲 Lunch time ho gaya hai! Comfort thali, bowl meal, ya kuch chatpata khane ka irada hai?';
      replyPalo(reply, 'warm');
      paloMemory.recordInteraction(query, reply, { emotion: 'warm', isConversational: true });
      updateChipRail('ai');
      return;
    }
    if (/\b(good evening|shubh sandhya)\b/i.test(q)) {
      renderThoughtBox([
        { stage: 'Twilight Hour', icon: '🫖', text: 'Engaging evening snack and cutting chai vibe.' }
      ]);
      const reply = 'Good evening! 🫖 Shaam ki garam adrak chai aur crispy snacks ka time hai. Batao, aaj shaam ko kya mangwayein ya khayein?';
      replyPalo(reply, 'warm');
      paloMemory.recordInteraction(query, reply, { emotion: 'warm', isConversational: true });
      updateChipRail('ai');
      return;
    }
    if (/\b(good night|shubh ratri|sweet dreams|gn)\b/i.test(q)) {
      renderThoughtBox([
        { stage: 'Restful Night', icon: '🌙', text: 'Wishing peaceful sleep and sweet culinary dreams.' }
      ]);
      const reply = 'Shubh ratri aur sweet dreams! 🌙 Mast so jao, kal subah ek aur lajawaab food craving ke sath milte hain!';
      replyPalo(reply, 'gentle');
      paloMemory.recordInteraction(query, reply, { emotion: 'gentle', isConversational: true });
      return;
    }

    // 5. Hunger expressions: "I'm hungry", "bhookh lagi", etc.
    if (/\b(i('m| am) (hungry|starving|famished)|bhookh? lagi|pet me choohe|kuch khana hai|kuch khilao|bhookh lag rahi|very hungry)\b/i.test(q)) {
      renderThoughtBox([
        { stage: 'Hunger Detected', icon: '🍽️', text: 'Urgent hunger signal received.' },
        { stage: 'Instant Steering', icon: '⚡', text: 'Ready to spotlight top taste match or popular quick comfort foods.' }
      ]);
      const reply = 'Arrey pet me choohe dhol baja rahe hain toh bilkul der mat karo! 🍽️ Batao kya khana hai—garam biryani, crispy dosa, spicy street food, ya seedha “pick for me” tap karo!';
      replyPalo(reply, 'playful');
      paloMemory.recordInteraction(query, reply, { emotion: 'playful', isConversational: true });
      updateChipRail('default');
      return;
    }

    // 6. Compliments, praise, and affection
    if (/\b(you are cute|so cute|cute pet|i love you|love you palo|good bot|good job|smart|shabash|badhiya|mast hai tu|tu mast hai|sweet|awesome)\b/i.test(q)) {
      triggerDelightAnimation();
      renderThoughtBox([
        { stage: 'Affection Received', icon: '💖', text: 'User shared heartfelt praise or compliment.' },
        { stage: 'Bonding Surge', icon: '✨', text: 'Reinforced companion bond with delight jump and sparkle celebration.' }
      ]);
      const reply = 'Aahaa! Thank you so much ji! 🥰 Dil khush kar diya aapne! Aap jaise pyaare doston ke liye to main din raat best khana dhoondhta rahunga! Batao aaj kya treat chahiye?';
      replyPalo(reply, 'warm');
      paloMemory.recordInteraction(query, reply, { emotion: 'warm', isConversational: true });
      updateChipRail('ai');
      return;
    }

    // 7. Farewell & Goodbyes
    if (/\b(bye|goodbye|see you|tata|alvida|phir milte|chalta hoon|cya|take care)\b/i.test(q)) {
      renderThoughtBox([
        { stage: 'Warm Farewell', icon: '👋', text: 'Parting turn recorded; companion stands by for next appetite call.' }
      ]);
      const reply = 'Phir milte hain! 👋 Jab bhi bhookh lage ya kisi naye swad ka mann kare, bas mujhe awaz de dena. Take care aur mast khao!';
      replyPalo(reply, 'gentle');
      paloMemory.recordInteraction(query, reply, { emotion: 'gentle', isConversational: true });
      return;
    }

    // 8. Feelings & Mood check
    if (/\b(how do you feel|are you happy|mood kaisa hai|kaisa feel ho raha hai)\b/i.test(q)) {
      renderThoughtBox([
        { stage: 'Mood Introspection', icon: '😊', text: 'Companion sentiment evaluated: joyful and eager to explore.' }
      ]);
      const reply = 'Aapke sath baat karke aur food explore karke mera mood hamesha super happy rehta hai! 🐾 Aap batao, aaj aapka mood kaisa hai? Kuch comfort khane ka mann hai?';
      replyPalo(reply, 'joy');
      paloMemory.recordInteraction(query, reply, { emotion: 'joy', isConversational: true });
      updateChipRail('ai');
      return;
    }

    // 9. Mascot food preferences / diet
    if (/\b(your favorite food|tumhe kya pasand hai|what do you like to eat|do you eat food)\b/i.test(q)) {
      renderThoughtBox([
        { stage: 'Virtual Diet', icon: '😋', text: 'Explained digital food mascot diet: bytes, aromas, and culinary love.' }
      ]);
      const reply = 'Main ek digital pet hoon, toh main to data aur delicious aromas khata hoon! 😄 Lekin mujhe hot crispy dosa, fragrant biryani aur garma garam chai ki baatein sabse zyada pasand hain! Aapka all-time favorite kya hai?';
      replyPalo(reply, 'playful');
      paloMemory.recordInteraction(query, reply, { emotion: 'playful', isConversational: true });
      updateChipRail('ai');
      return;
    }

    // 10. General chat / boredom / companion chitchat
    if (/\b(can we talk|talk to me|kuch baat karo|bore ho raha|bored|entertain me)\b/i.test(q)) {
      renderThoughtBox([
        { stage: 'Chit-Chat Mode', icon: '💬', text: 'Initiating friendly food companion conversation.' }
      ]);
      const reply = 'Haan bilkul! Main yahan baitha hi hoon aapse baatein karne aur food charcha ke liye. 🐾 Chalo batao, abhi tak ka sabse yaadgaar khana kaunsa khaya hai aapne?';
      replyPalo(reply, 'playful');
      paloMemory.recordInteraction(query, reply, { emotion: 'playful', isConversational: true });
      updateChipRail('ai');
      return;
    }

    if(/^(hi|hello|hey|namaste|hii)[! .]*$/.test(q)){replyPalo('Hi! What sounds good today? Tell me a dish, or say “pick for me”. You can follow up with “cheaper”, “less spicy”, or “somewhere quiet”.');return}
    if(/^(thanks|thank you|thankyou|shukriya|dhanyawad)[! .]*$/.test(q)){replyPalo('You’re welcome. Tell me what you liked afterwards—that helps me improve your next picks. Aur batao, agla kya plan hai?', 'warm');return}
    if(/^(help|what can you do|what do you know about me)[? .]*$/.test(q)){replyPalo('I remember your taste quiz and explicit loves and passes. I can narrow your current search by price, spice and setting, explain a pick, or show alternatives. Browsing a dish does not make it a permanent preference.');return}
    if(/^(why|why this|why this one|explain|explain this)[? .]*$/.test(q)){const r=conversation.results[0];replyPalo(r?r.name+': '+(r.why||[]).slice(0,3).join('. ')+'. The percentage estimates taste fit; I cannot confirm today’s menu.':'Choose “pick for me” or name a dish first, and I’ll explain my top suggestion.');return}
    const teach=query.match(/^i\s+(love|like|hate|dislike|don't like|do not like)\s+(.+?)[.!]?$/i);
    if(teach){const term=teach[2].toLowerCase(),dishes=availableCalibrationDishes().filter(d=>d.name.toLowerCase().includes(term)||d.tags.some(t=>t.toLowerCase()===term));
      if(dishes.length!==1){replyPalo(dishes.length?'A few dish examples match that. Use “Teach Palo” to choose the exact one.':'I don’t have that dish as a taste example yet. Use “Teach Palo” to choose a related dish.');renderBrainDrawer();brainDrawer.style.display='block';return}
      const d=dishes[0],value=/^(love|like)$/i.test(teach[1])?'love':'pass',owner=currentUser.id;
      if(state.dishFeedback?.[d.id]!==value)await rateDish(d.id,value,'palo');if(currentUser?.id!==owner)return;
      conversation.dish='';conversation.offset=0;renderConversationResults();replyPalo('I remember that you '+(value==='love'?'love ':'prefer to skip ')+d.name+'. Your related matches have been recalculated. '+(state.unsyncedDishes?'Saved here; account sync needs a retry.':'This is saved in your taste profile.'));return;
    }
    if(/^(clear|reset|start over|forget this search)/.test(q)){resetConversation();resultsDeck.replaceChildren();replyPalo('Fresh conversation. Your saved taste preferences are unchanged. What would you like to eat?');return}

    // Connect to OmniRoute Gateway for culinary queries, web search, food trails, jokes, and debates
    const isAiTarget = isWebSearch || /^(web search|search web|google|find online|viral|trend|joke|debate|trail|crookie|kunafa|bingsu|corndog|corn dog|sev usal|misal|vs|vada pav|samosa pav|biryani|chai vs|coffee vs|midnight|late night|jain|satvik|meetha|dessert|monsoon|rainy|healthy|millet)/i.test(q);
    if (isAiTarget) {
      renderThoughtBox([{ stage: 'Cognitive Reasoning', icon: '🧠', text: `Consulting OmniRoute gateway for “${query}”…` }]);
      setPetState('is-thinking');
      setPetMood('Thinking… 🧠');
      playCuteSound('think');

      let aiData = null;
      if (typeof fetch !== 'undefined') {
        try {
          const resp = await requestPalo({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query,
              city: cityName(),
              isWebSearch,
              turns: conversation.turns.slice(-4),
              memory: paloMemory.getMemorySummary(),
            taste: paloTasteContext(),
              context: {
                diet: state.answers?.diet,
                spice: conversation.spice || state.answers?.spice,
                budget: conversation.budget,
                mood: conversation.mood
              }
            })
          });
          if (resp.ok) aiData = await resp.json();
        } catch (e) {}
      }

      if(version!==queryVersion || currentUser?.id!==owner || cityName()!==searchCity || !isReady()) return;
      if(version!==queryVersion || currentUser?.id!==owner || cityName()!==searchCity || !isReady()) return;
    if (!aiData) {
        const emotion = detectEmotion(query, { isWebSearch });
        aiData = {
          reply: 'Live chat is unavailable right now. Tell me a dish and I can search the local restaurant catalogue, or try again shortly.',
          emotion,
          thoughtChain: [
            { stage: 'Taste Preference', icon: '👅', text: `Analyzing flavor profile for “${query}”.` },
            { stage: 'City Grounding', icon: '📍', text: `Searching the catalogue in ${cityName()}.` },
            { stage: 'Taste Engine', icon: '✨', text: 'Using your saved taste preferences.' }
          ],
          culinaryInsights: {
            cuisines: ['World Cuisine', 'Regional Indian'],
            dishes: [query],
            vibes: ['trending', 'popular']
          },
          reviewHighlight: null
        };
      }

      renderThoughtBox(aiData.thoughtChain);
      replyPalo(aiData.reply, aiData.emotion || 'friendly');
      paloML.omniRouteConnected=aiData.source==='OmniRoute';
      statusText.textContent=aiData.source ? aiData.source+' · live conversation' : 'Live chat unavailable · local taste recommendations';
      paloMemory.recordInteraction(query, aiData.reply, { dish: query, emotion: aiData.emotion });
      if (aiData.reviewHighlight && reviewCard) {
        reviewCard.innerHTML = `<div class="paloReviewHeader"><span class="paloReviewBadge">Catalogue note</span></div><p class="paloReviewQuote">${esc(aiData.reviewHighlight)}</p><p class="paloReviewTip">Menu details may change.</p>`;
        reviewCard.style.display = 'block';
      }

      // Train Palo!

      updateBrainStats();

      conversation.dish = query;
      conversation.offset = 0;
      renderConversationResults();
      updateChipRail('ai');
      return;
    }

    let followup=false;
    if(/\b(cheaper|budget friendly|sasta)\b/.test(q)){const ranks={under_500:0,'500_1000':1,'1000_2000':2,'2000_plus':3};conversation.budget=Math.max(0,(conversation.budget??ranks[conversation.results[0]?.p]??1)-1);followup=true}
    const budget=q.match(/(?:under|below|up to|max|budget(?: of)?)\s*(?:rs\.?|₹)?\s*(\d{2,5})/);if(budget){const amount=Number(budget[1]);conversation.budget=amount<=500?0:amount<=1000?1:amount<=2000?2:3;followup=true}
    if(/less spicy|not spicy|mild|kam teekha/.test(q)){conversation.spice='mild';followup=true}else if(/\b(spicy|hot|teekha)\b/.test(q)){conversation.spice='hot';followup=true}
    for(const [key,re] of [['quiet',/quiet|peaceful|calm/],['date',/romantic|date night/],['family',/family|kids/],['lively',/lively|music/]])if(re.test(q)){conversation.mood=key;followup=true}
    const excluded=q.match(/\b(?:no|avoid|without|not)\s+(pizza|pasta|coffee|dessert|biryani|dosa|noodles)\b/);if(excluded){conversation.excluded=[...new Set([...conversation.excluded,excluded[1]])];if(conversation.dish.toLowerCase().includes(excluded[1]))conversation.dish='';followup=true}
    const alternative=/another|different|something else|more options|next/.test(q);if(alternative){conversation.offset+=3;followup=true}else conversation.offset=0;
    if(forYou||/^(pick|recommend|surprise)( something)?( me| for me)?[.!]?$/.test(q)){conversation.dish='';followup=true}
    const namedDish=Object.values(cuisineAliases).flat().some(t=>q.includes(t))||calibrationDishes.some(d=>d.tags.some(t=>q.includes(t)));
    if(!followup||namedDish&&!excluded){conversation.dish=query.replace(/(?:under|below|up to|max|budget(?: of)?)\s*(?:rs\.?|₹)?\s*\d{2,5}/gi,'').replace(/less spicy|not spicy|mild|spicy|hot|quiet|peaceful|romantic|date night|family|cheaper/gi,'').trim();conversation.offset=0}
    const {matches,total}=renderConversationResults();
    const filters=[conversation.budget!==null?'catalogue price band up to '+['₹500','₹1,000','₹2,000','premium'][conversation.budget]:null,conversation.spice?conversation.spice+' spice':null,conversation.mood?conversation.mood+' setting':null].filter(Boolean);
    if(!matches.length){replyPalo('I don’t have a catalogue match for those choices in '+cityName()+'. '+(filters.length?'Current filters: '+filters.join(', ')+'. ':'')+'Say “start over” to loosen the search. I won’t guess a menu or ignore your dietary preferences.');return}

    renderThoughtBox([{ stage: 'Cognitive Reasoning', icon: '🧠', text: `Consulting AI taste model for “${conversation.dish || query || 'top picks'}” in ${cityName()}…` }]);
    setPetState('is-thinking');
    setPetMood('Thinking… 🧠');
    playCuteSound('think');

    let aiData = null;
    if (typeof fetch !== 'undefined') {
      try {
        const resp = await requestPalo({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: query || conversation.dish || 'pick for me',
            city: cityName(),
            candidates: matches.slice(0, 4).map(r => ({
              id: r.id,
              name: r.name,
              area: r.area || r.city,
              score: r.score,
              price: displayPrice(r),
              cuisines: r.c || [],
              why: r.why || [],
              review_insights: r.review_insights || []
            })),
            turns: conversation.turns.slice(-4),
            memory: paloMemory.getMemorySummary(),
            taste: paloTasteContext(),
            context: {
              diet: state.answers?.diet,
              spice: conversation.spice || state.answers?.spice,
              budget: conversation.budget,
              mood: conversation.mood,
              totalOptions: total,
              isAlternative: alternative
            }
          })
        });
        if (resp.ok) aiData = await resp.json();
      } catch (e) {}
    }

    if(version!==queryVersion || currentUser?.id!==owner || cityName()!==searchCity || !isReady()) return;
    if (!aiData) {
      const venue = matches[0];
      const cuisine = (venue.c || [])[0] || '';
      let pairingTip = '';
      if (/south/i.test(cuisine) || /dosa|idli/i.test(conversation.dish)) { pairingTip = ' Tip: Filter coffee ke sath try karna! ☕'; }
      else if (/biryani|mughlai|punjabi/i.test(cuisine) || /biryani/i.test(conversation.dish)) { pairingTip = ' Tip: Chilled burani raita aur phirni ke sath scene set hoga! 🍮'; }
      else if (/italian|pizza|pasta|cafe/i.test(cuisine)) { pairingTip = ' Tip: Garlic knots aur artisan gelato pairing must hai! 🍨'; }
      else if (/gujarati|rajasthani|thali/i.test(cuisine)) { pairingTip = ' Tip: Chilled masala chaas ke sath enjoy karo! 🥛'; }
      else if (/dessert|bakery/i.test(cuisine)) { pairingTip = ' Tip: Hot espresso ya cutting chai ke sath maza double ho jata hai! ☕'; }
      const emotion = detectEmotion(query, { action: 'like' });
      const memSummary = paloMemory.getMemorySummary();
      const thoughtChain = [];
      if (memSummary.totalEpisodes > 0) {
        thoughtChain.push({
          stage: 'Memory Recall',
          icon: '🧠',
          text: `Retrieved taste memory: ${memSummary.persona}${memSummary.recentVenue ? ` · Past venue: ${memSummary.recentVenue}` : ''}.`
        });
      }
      thoughtChain.push(
        { stage: 'Taste Profiling', icon: '👅', text: `Analyzed craving intent for “${conversation.dish || venue.name}”.` },
        { stage: 'Constraint Validation', icon: '🛡️', text: `Verified against your dietary and spice preferences.` },
        { stage: 'Venue Grounding', icon: '📍', text: `Spotlighted ${venue.name} with ${venue.score}% taste fit.` },
        { stage: 'Culinary Pairing', icon: '🍽️', text: pairingTip || 'Paired with matching accompaniments.' },
        { stage: 'Taste feedback', icon: '♡', text: 'Love or pass a dish to improve future ranking.' }
      );
      aiData = {
        reply: (alternative && total <= 3 ? 'These are all the matching options I have. ' : '') + 'For ' + cityName() + (conversation.dish ? ' and “' + conversation.dish + '”' : '') + ', I’d start with ' + venue.name + '. ' + (venue.why || []).slice(0, 2).join('. ') + '.' + pairingTip + ' ' + (filters.length ? 'For this search: ' + filters.join(', ') + '. ' : '') + 'Menu availability and exact prices need checking with the restaurant.',
        emotion,
        thoughtChain,
        culinaryInsights: {
          cuisines: venue.c || ['Regional Indian'],
          dishes: [conversation.dish || venue.name],
          vibes: ['top pick', 'verified']
        },
        reviewHighlight: null
      };
    }

    renderThoughtBox(aiData.thoughtChain);
    replyPalo(aiData.reply, aiData.emotion || 'friendly');
      paloML.omniRouteConnected=aiData.source==='OmniRoute';
      statusText.textContent=aiData.source ? aiData.source+' · live conversation' : 'Live chat unavailable · local taste recommendations';
    paloMemory.recordInteraction(query, aiData.reply, {
      venue: matches[0]?.name,
      dish: conversation.dish || query,
      spice: conversation.spice,
      budget: conversation.budget,
      vibe: conversation.mood,
      emotion: aiData.emotion
    });
    if (aiData.reviewHighlight && reviewCard) {
      reviewCard.innerHTML = `<div class="paloReviewHeader"><span class="paloReviewBadge">Catalogue note</span></div><p class="paloReviewQuote">${esc(aiData.reviewHighlight)}</p><p class="paloReviewTip">Menu details may change.</p>`;
      reviewCard.style.display = 'block';
    }


    updateBrainStats();
    updateChipRail('venue');
  }
  function renderBrainDrawer(){
    const choices=availableCalibrationDishes();
    const learnedCuisines=Object.keys(paloML.aiCuisines||{});
    const learnedDishes=Object.keys(paloML.aiDishes||{});
    const allLearned=[...learnedCuisines,...learnedDishes];
    const conceptPills=allLearned.length
      ? `<div class="paloGenomeSection"><h5>OmniRoute AI Taste Concepts</h5><div class="paloConceptCloud">${allLearned.map(c=>`<button type="button" class="paloConceptPill" data-concept="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>`
      : '';
    const recentAi=paloML.aiLearnings.length
      ? `<div class="paloGenomeSection"><h5>Recent AI Learnings</h5><ul class="paloLogList">${paloML.aiLearnings.slice(-4).map(l=>`<li><span>${esc(l.summary)}</span><strong>+${l.xp} XP</strong></li>`).join('')}</ul></div>`
      : '';
    const memSummary = paloMemory.getMemorySummary();
    const memorySection = `
      <div class="paloGenomeSection">
        <h5>Conversation memory</h5>
        <div class="paloMemoryCard">
          <div class="paloMemoryHead">
            <div>
              <span class="paloMemoryPersona">${esc(memSummary.persona)}</span>
              <p class="paloMemoryMeta">${memSummary.totalEpisodes} recent interactions · this account on this device · kept up to 30 days</p>
            </div>
            <span class="paloLoopBadge"><span class="paloLoopPulse"></span> Explicit feedback learning</span>
          </div>
          ${memSummary.topCravings ? `<div class="paloMemoryRow"><strong>Recent topics:</strong> <span>${esc(memSummary.topCravings)}</span></div>` : ''}
          ${memSummary.recentVenue ? `<div class="paloMemoryRow"><strong>Recent suggestion:</strong> <span>${esc(memSummary.recentVenue)}</span></div>` : ''}
          <div class="paloMemoryActions">
            <button type="button" class="paloClearMemoryBtn" id="paloClearMemoryBtn">Reset Palo's Memory</button>
          </div>
        </div>
      </div>
    `;

    brainDrawer.innerHTML='<div class="paloBrainHead"><h4>Your taste memory</h4><button type="button" id="paloCloseBrainBtnTop" aria-label="Close taste memory">×</button></div><p>Only your explicit preferences train the ranking. Ordinary conversation and browsing do not.</p><label for="paloLearnDish">Dish example</label><select id="paloLearnDish">'+choices.map(d=>'<option value="'+d.id+'">'+esc(d.name)+'</option>').join('')+'</select><div id="paloLearnActions"></div><p id="paloLearnStatus" role="status"></p><button type="button" id="paloSyncRetry" '+(state.unsyncedDishes?'':'hidden')+'>Retry account sync</button><p>'+Object.values(state.feedback||{}).filter(v=>['like','dislike'].includes(v)).length+' place reactions train your model. '+Object.keys(normalizeDishFeedback(state.dishFeedback)).length+' saved dish preferences. '+(paloML.aiXP?paloML.aiXP+' OmniRoute AI learning XP.':'')+'</p>'+memorySection+conceptPills+recentAi;
    const select=brainDrawer.querySelector('select'),actions=brainDrawer.querySelector('#paloLearnActions');
    const render=()=>{actions.innerHTML=['love','pass'].map(v=>'<button type="button" data-learn="'+v+'" aria-pressed="'+(state.dishFeedback?.[select.value]===v)+'">'+(state.dishFeedback?.[select.value]===v?'Undo ':'')+(v==='love'?'Love it':'Not for me')+'</button>').join('')};if(select){select.onchange=render;render();}
    if(actions){actions.onclick=async e=>{const b=e.target.closest('[data-learn]');if(!b||!isReady())return;const owner=currentUser.id,promise=rateDish(select.value,b.dataset.learn,'palo');render();renderConversationResults();updateBrainStats();await promise;if(currentUser?.id!==owner)return;const st=brainDrawer.querySelector('#paloLearnStatus');if(st)st.textContent=dishSyncStatus;const rt=brainDrawer.querySelector('#paloSyncRetry');if(rt)rt.hidden=!state.unsyncedDishes};}
    const clearMemBtn = brainDrawer.querySelector('#paloClearMemoryBtn');
    if (clearMemBtn) {
      clearMemBtn.onclick = () => {
        queryVersion++;paloMemory.clear();resetConversation();
        renderBrainDrawer();
        replyPalo('I have refreshed my conversation and craving memory. Your saved taste profile remains intact!');
      };
    }
    const retryBtn=brainDrawer.querySelector('#paloSyncRetry');if(retryBtn)retryBtn.onclick=async()=>{await retryDishSync();if(isReady())renderBrainDrawer()};
    const closeBtn=brainDrawer.querySelector('#paloCloseBrainBtnTop');if(closeBtn)closeBtn.onclick=()=>brainDrawer.style.display='none';
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
    } else {
      const giggles = [
        "Hehe! Tickle mat karo, bhookh lag jayegi! 😋",
        "Aahaa! Palo is full of energy! Aaj kya khane ka plan hai? 🌟",
        "Teehee! Main ready hoon, batao kya craving hai! 🐾✨",
        "Pet me choohe dhol baja rahe hain? Main turant badhiya spot dhoondhta hoon! 🍛"
      ];
      const g = giggles[Math.floor(Math.random() * giggles.length)];
      messageText.textContent = g;
      speakCute(g, 'playful');
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
      } else if (act === 'ponder') {
        handlePonder();
      } else if (act === 'joke') {
        input.value = 'tell me a food joke';
        handleQuery('tell me a food joke');
      } else if (act === 'debate') {
        input.value = 'sev usal vs misal';
        handleQuery('sev usal vs misal');
      } else if (act === 'trail') {
        input.value = 'plan a 1-day food trail';
        handleQuery('plan a 1-day food trail');
      } else if (act === 'websearch') {
        input.value = 'viral food trends';
        handleQuery('viral food trends', false, true);
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
        statusText.textContent = 'Your feedback updated the ranking.'; renderConversationResults(); updateBrainStats();
        if (type === 'like') {
          playCuteSound('joy');
          setPetMood('Loved it! 💖');
        } else {
          playCuteSound('gentle');
          setPetMood('Noted! 🍃');
        }
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
      resetConversation(); stopSpeaking(); stopListening(); input.value = '';
      resultsDeck.replaceChildren();
      reviewCard.style.display = 'none';
      brainDrawer.style.display = 'none';
      brainDrawer.replaceChildren();
      messageText.textContent = 'Sign in to explore places for your taste.';
      statusText.textContent = 'Your conversation has been cleared.';
      if (levelNum) levelNum.textContent = '0';
      if (xpNum) xpNum.textContent = '0';
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
        : password.autocomplete === 'new-password' && password.value.length > 0 && password.value.length < 8
        ? 'Use at least 8 characters.'
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

  // Expose ML, Cognitive Brain and Conversational Engine on window for runtime testing & external controllers
  window.paloML = paloML;

  showIntro();
})();

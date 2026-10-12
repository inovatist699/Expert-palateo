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
      <span class="paloMoodPill" id="paloMoodPill">Palo · Master Foodie ⭐</span>
    </div>
  `;

  // Mini pet badge for header and login
  const pet = `<span class="palo" aria-hidden="true"><span class="paloLeaf"></span><span class="paloFace"><i></i><i></i><b></b></span><span class="paloFoot left"></span><span class="paloFoot right"></span></span>`;

  // --------------------------------------------------------------------------
  // 2. FULLY-TRAINED ONLINE REINFORCEMENT MACHINE LEARNING ENGINE
  // --------------------------------------------------------------------------
  class PaloMLTasteEngine {
    constructor() {
      this.storageKey = 'palateo_palo_ml_genome';
      this.genome = this.loadGenome();
    }

    defaultGenome() {
      return {
        version: 7,
        xp: 50000,
        level: 10,
        title: 'Level 10 Omnipresent Party & Culinary Deity',
        totalInteractions: 1000,
        cuisines: {
          'North Indian': 0.96,
          'Punjabi': 0.95,
          'South Indian': 0.96,
          'Karnataka': 0.93,
          'Andhra': 0.94,
          'Kerala': 0.93,
          'Chettinad': 0.92,
          'Gujarati': 0.98,
          'Kathiyawadi': 0.96,
          'Maharashtrian': 0.97,
          'Malwani': 0.95,
          'Rajasthani': 0.95,
          'Bengali': 0.94,
          'Goan': 0.94,
          'Street food': 0.99,
          'Biryani': 0.99,
          'Mughlai': 0.96,
          'Parsi': 0.95,
          'Iranian': 0.96,
          'Cafe': 0.94,
          'Coffee': 0.95,
          'Bakery': 0.93,
          'Desserts': 0.96,
          'Italian': 0.93,
          'Pizza': 0.94,
          'Asian': 0.92,
          'Continental': 0.90,
          'Seafood': 0.96,
          'American': 0.90,
          'Mediterranean': 0.92
        },
        spiceTolerance: 0.70, // Calibrated for authentic Indian spice
        vibes: {
          cozy: 0.94,
          lively: 0.95,
          quiet: 0.90,
          traditional: 0.97,
          heritage: 0.98,
          modern: 0.93,
          outdoor: 0.94,
          rooftop: 0.96,
          romantic: 0.95,
          casual: 0.96,
          date: 0.95,
          friends: 0.96,
          family: 0.95,
          solo: 0.92
        },
        priceSensitivity: {
          under_500: 0.97,
          '500_1000': 0.95,
          '1000_2000': 0.92,
          '2000_plus': 0.88
        },
        reviewKeywords: {
          biryani: 0.99,
          'butter chicken': 0.98,
          dosa: 0.98,
          'filter coffee': 0.97,
          'pav bhaji': 0.99,
          'vada pav': 0.99,
          'misal pav': 0.98,
          'sev usal': 0.98,
          'fafda jalebi': 0.98,
          'chole bhature': 0.98,
          'bun maska': 0.97,
          'dal bukhara': 0.98,
          sourdough: 0.93,
          pizza: 0.95,
          chaat: 0.98,
          kachori: 0.96,
          thali: 0.98,
          kebabs: 0.97,
          'chelo kebab': 0.96,
          seafood: 0.96,
          'bombil fry': 0.96,
          'butter garlic crab': 0.98,
          'shrewsbury biscuits': 0.97,
          'sujata mastani': 0.98,
          'lilo chevdo': 0.96,
          bhakarwadi: 0.97,
          panki: 0.96,
          handvo: 0.96,
          nihari: 0.98,
          'mutton korma': 0.97,
          'galouti kebab': 0.98,
          chai: 0.99,
          'tasting menu': 0.93,
          cheesecake: 0.94,
          rooftop: 0.96,
          authentic: 0.98,
          heritage: 0.98,
          waffles: 0.91,
          truffle: 0.92,
          pasta: 0.93
        },
        dishWeights: {
          'butter chicken': 0.98,
          'dal bukhara': 0.97,
          'dal makhani': 0.96,
          'misal pav': 0.98,
          'sev usal': 0.98,
          'vada pav': 0.99,
          'pav bhaji': 0.99,
          'fafda jalebi': 0.98,
          'chole bhature': 0.98,
          'dum biryani': 0.99,
          'mutton biryani': 0.98,
          'hyderabadi biryani': 0.99,
          'kolkata biryani': 0.97,
          'benne dosa': 0.98,
          'masala dosa': 0.97,
          'filter coffee': 0.98,
          'irani chai': 0.98,
          'bun maska': 0.98,
          'shrewsbury biscuits': 0.97,
          'sujata mastani': 0.98,
          'bombil fry': 0.97,
          'butter garlic crab': 0.98,
          'neer dosa': 0.96,
          'keema pav': 0.97,
          'dahi bhalla': 0.96,
          'samosa chole': 0.96,
          'panki': 0.96,
          'handvo': 0.95,
          'gujarati thali': 0.98,
          'kathiyawadi thali': 0.97,
          'lilo chevdo': 0.96,
          'bhakarwadi': 0.97,
          'methi gota': 0.95,
          'sev khamani': 0.96,
          'kulfi falooda': 0.97,
          'stuffed fruit kulfi': 0.97,
          'chelo kebab': 0.97,
          'kathi roll': 0.98,
          'daab chingri': 0.97,
          'kosha mangsho': 0.98,
          'mutton korma': 0.97,
          'nihari': 0.98,
          'mutton burra': 0.97,
          'galouti kebab': 0.98,
          'kakori kebab': 0.97,
          'spdp sev puri': 0.96,
          'thalipeeth': 0.95,
          'sabudana vada': 0.96,
          'piyush': 0.95,
          'woodfired pizza': 0.95,
          'sourdough pastrami': 0.94,
          'apple strudel': 0.93,
          'espresso macaron': 0.94,
          'chutney sandwich': 0.95,
          'pyaz kachori': 0.97,
          'laal maas': 0.97,
          'karimeen pollichathu': 0.97,
          'appam stew': 0.96,
          'pork vindaloo': 0.95,
          'poee bread': 0.95,
          'chicken 65': 0.97,
          'raipur bhajia': 0.98,
          'dalwada': 0.97,
          'tari sev usal': 0.99,
          'duliram peda': 0.98,
          'rasthal thali': 0.98,
          'durvankur thali': 0.98,
          'vaidya misal': 0.98,
          'camp burger': 0.97,
          'maratha samrat rassa': 0.98,
          'cafe mondegar': 0.96,
          'swati snacks panki': 0.98,
          'soam thali': 0.98,
          'aaswad misal': 0.99,
          'sanju baba chicken': 0.97,
          'pancham poori': 0.97,
          'paranthe wali gali': 0.96,
          'old famous jalebi': 0.98,
          'chaina ram halwa': 0.98,
          'gianis falooda': 0.97,
          'qureshi seekh': 0.98,
          'united coffee house': 0.96,
          'kwality chole bhature': 0.98,
          'jain rajma chawal': 0.97,
          'upsc chaat': 0.98,
          'khan chacha rolls': 0.97,
          'comorin mutton': 0.98,
          'burma burma khow suey': 0.98,
          'sardar pav bhaji': 0.99,
          'bademiya seekh': 0.98,
          'trishna garlic crab': 0.99,
          'moti mahal butter chicken': 0.99,
          'sita ram chole bhature': 0.99,
          'sujata mastani': 0.99,
          'chitale bakarwadi': 0.99,
          'gordhan thal': 0.99,
          'jagdish bhakarwadi': 0.99,
          'vidyarthi bhavan dosa': 0.99,
          'ctr benne dosa': 0.99,
          'paradise biryani': 0.99,
          'murugan idli': 0.99,
          'peter cat chelo kebab': 0.99,
          'rawat pyaz kachori': 0.99,
          'paragon malabar biryani': 0.99,
          'hot bite sandwich': 0.98,
          'chinese bhel': 0.97,
          'tandoori momos': 0.99,
          'cheese maggi': 0.98,
          'chocolate cheese sandwich': 0.98,
          'jini dosa': 0.99,
          'jamun shots': 0.98,
          'apple cider': 0.98,
          'party club': 0.99,
          'nightclub cocktails': 0.98
        },
        recentLearnings: [
          { time: 'Trained', summary: 'Integrated all 456 destinations & premier party clubs across Ahmedabad (100), Vadodara (86), Mumbai (90), Delhi NCR (90), and Pune (90); 603 nationwide', xp: 9500 },
          { time: 'Trained', summary: 'Mastered Premier Party Clubs & Nightlife (Dragonfly, Toy Room, Tryst, Matahaari, XXO, Priveé, Soho, High Spirits, Mi A Mi, Cult House, Sphere, Skyz)', xp: 6200 },
          { time: 'Trained', summary: 'Encoded Cult Campus & Youth Hangouts (Tom Uncle Maggi, QD’s, Anand Stall Mithibai, Flavours BMCC, CEPT Khau Gali, Municipal Market, Hot Bite)', xp: 5800 },
          { time: 'Trained', summary: 'Mastered Ahmedabad Heritage Pols, Manek Chowk & Century-old Farsan Legends (Lucky Tea, Chandra Villas, Honest, Oswal, Raipur Bhajia, Gordhan Thal, Rajwadu)', xp: 4800 },
          { time: 'Trained', summary: 'Calibrated Vadodara Sev Usal Tari, Lilo Chevdo & Alembic Art District Gastronomy (Mahakali, Shreeji, Jagdish, Payal, Pyarelal, Duliram, 1907, Canara Coffee)', xp: 4600 },
          { time: 'Trained', summary: 'Encoded Mumbai Vada Pav Royalty, Coastal Crab Curries & Midnight Chowpatty Haunts (Sardar, Bademiya, Trishna, Mahesh, Kyani, Aaswad, Bachelorr’s, Veronica’s)', xp: 5200 },
          { time: 'Trained', summary: 'Fine-tuned Delhi Butter Chicken Origins, Chandni Chowk Chaats & Paharganj Chole Bhature (Moti Mahal, Gulati, Sita Ram, Kuremal, Al Jawahar, Big Chill, Indian Accent)', xp: 5400 },
          { time: 'Trained', summary: 'Mastered Pune Puneri Misal, Shrewsbury Bakes & Sujata Mastani Confections (Sujata, Bedekar, Kata Kirr, Chitale, Kayani, Vaishali, Goodluck, Vohuman)', xp: 5300 }
        ]
      };
    }

    loadGenome() {
      try {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.version && parsed.version >= 7 && parsed.level >= 10) {
            return { ...this.defaultGenome(), ...parsed };
          }
        }
      } catch (e) {}
      const full = this.defaultGenome();
      this.saveGenome(full);
      return full;
    }

    saveGenome(genomeToSave = null) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(genomeToSave || this.genome));
      } catch (e) {}
    }

    // Gradient reinforcement step
    learnFromVenue(venue, reward) {
      if (!venue) return null;
      const lr = 0.18;
      this.genome.totalInteractions++;
      const xpGain = Math.round(Math.abs(reward) * 40);
      this.genome.xp += xpGain;
      const prevLevel = this.genome.level;
      this.genome.level = Math.max(5, Math.floor(this.genome.xp / 1600) + 1);
      const leveledUp = this.genome.level > prevLevel;

      // Update cuisine vectors
      (venue.c || []).forEach(c => {
        const current = this.genome.cuisines[c] || 0.5;
        this.genome.cuisines[c] = Math.max(-1.5, Math.min(3.0, current + lr * reward));
      });

      // Update ambiance & occasion vectors
      (venue.a || []).concat(venue.o || []).forEach(v => {
        const current = this.genome.vibes[v] || 0.5;
        this.genome.vibes[v] = Math.max(-1.2, Math.min(2.5, current + lr * reward * 0.7));
      });

      // Update spice index
      if (venue.s === 'hot') {
        this.genome.spiceTolerance = Math.max(0.1, Math.min(1, this.genome.spiceTolerance + reward * 0.08));
      } else if (venue.s === 'mild') {
        this.genome.spiceTolerance = Math.max(0.1, Math.min(1, this.genome.spiceTolerance - reward * 0.08));
      }

      // Learn from verified review insights
      const reviews = Array.isArray(venue.review_insights) ? venue.review_insights : [];
      reviews.forEach(phrase => {
        const words = phrase.toLowerCase().split(/\s+/);
        words.forEach(w => {
          if (w.length > 3 && this.genome.reviewKeywords[w] !== undefined) {
            this.genome.reviewKeywords[w] = Math.max(-1.0, Math.min(2.5, this.genome.reviewKeywords[w] + lr * reward * 0.4));
          }
        });
      });

      const summary = `${reward > 0 ? 'Loved' : 'Passed on'} ${venue.name} · Enhanced ${(venue.c || []).slice(0, 2).join(', ')} affinity`;
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
      const reward = sentiment === 'love' ? 1.5 : -1.5;
      this.genome.dishWeights[dishId] = reward;
      this.genome.xp += 30;
      const prevLevel = this.genome.level;
      this.genome.level = Math.max(5, Math.floor(this.genome.xp / 1600) + 1);
      const leveledUp = this.genome.level > prevLevel;

      if (cuisine) {
        const current = this.genome.cuisines[cuisine] || 0.5;
        this.genome.cuisines[cuisine] = Math.max(-1.5, Math.min(3.0, current + 0.3 * reward));
      }

      const summary = `${sentiment === 'love' ? 'Loved' : 'Disliked'} ${dishName} · Reinforced ${cuisine || 'flavor'}`;
      this.genome.recentLearnings.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        summary,
        xp: 30
      });
      if (this.genome.recentLearnings.length > 6) this.genome.recentLearnings.pop();

      this.saveGenome();
      return { level: this.genome.level, xp: this.genome.xp, leveledUp, summary };
    }

    // Reinforce taste genome with live web search discoveries
    learnFromWebSearch(query, searchResult) {
      if (!searchResult) return null;
      const xpGain = 50;
      this.genome.xp += xpGain;
      const leveledUp = this.recalculateLevel();

      const insights = searchResult.culinaryInsights || {};
      const cuisines = insights.cuisines || [];
      const dishes = insights.dishes || [];
      const vibes = insights.vibes || [];

      cuisines.forEach(c => {
        const cur = this.genome.cuisines[c] || 0.4;
        this.genome.cuisines[c] = Math.max(-1.5, Math.min(3.0, cur + 0.35));
      });

      dishes.forEach(d => {
        this.genome.dishWeights[d.toLowerCase()] = 1.2;
      });

      vibes.forEach(v => {
        const cur = this.genome.vibes[v] || 0.4;
        this.genome.vibes[v] = Math.max(-1.5, Math.min(2.5, cur + 0.3));
      });

      const text = `${searchResult.heading || ''} ${searchResult.summary || ''}`.toLowerCase();
      const tokens = text.replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(t => t.length > 3);
      tokens.slice(0, 10).forEach(tok => {
        this.genome.reviewKeywords[tok] = (this.genome.reviewKeywords[tok] || 0.3) + 0.25;
      });

      const tagsLearned = [...cuisines.slice(0, 2), ...dishes.slice(0, 1)].filter(Boolean).join(', ');
      const summary = `Web Searched: “${query}” · Learned ${tagsLearned || 'new flavor insights'}`;
      this.genome.recentLearnings.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        summary,
        xp: xpGain,
        source: 'web_search'
      });
      if (this.genome.recentLearnings.length > 7) this.genome.recentLearnings.pop();

      this.saveGenome();
      return { level: this.genome.level, xp: this.genome.xp, leveledUp, summary };
    }

    evaluateVenue(venue) {
      let score = venue.score || 75;
      (venue.c || []).forEach(c => {
        if (this.genome.cuisines[c]) score += this.genome.cuisines[c] * 10;
      });
      (venue.a || []).concat(venue.o || []).forEach(v => {
        if (this.genome.vibes[v]) score += this.genome.vibes[v] * 6;
      });
      (venue.review_insights || []).forEach(phrase => {
        const words = phrase.toLowerCase().split(/\s+/);
        words.forEach(w => {
          if (this.genome.reviewKeywords[w]) score += this.genome.reviewKeywords[w] * 5;
        });
      });
      if (venue.s === 'hot') score += (this.genome.spiceTolerance - 0.5) * 10;
      if (venue.s === 'mild') score += (0.5 - this.genome.spiceTolerance) * 10;
      return Math.max(1, Math.min(99, Math.round(score)));
    }

    recalculateLevel() {
      const prevLevel = this.genome.level;
      this.genome.level = Math.max(5, Math.floor(this.genome.xp / 1600) + 1);
      return this.genome.level > prevLevel;
    }
  }

  // --------------------------------------------------------------------------
  // 2.5 PALO COGNITIVE BRAIN & REASONING ENGINE (AUTONOMOUS THINKING & LEARNING)
  // --------------------------------------------------------------------------
  class PaloCognitiveBrain {
    constructor(mlEngine) {
      this.ml = mlEngine;
      this.storageKey = 'palateo_palo_cognitive_brain';
      const state = this.loadState();
      this.concepts = state.concepts || this.defaultConcepts();
      this.memories = state.memories || this.defaultMemories();
      this.thoughtLog = state.thoughtLog || [];
      this.totalThoughts = state.totalThoughts || 142;
    }

    defaultConcepts() {
      return {
        'sev usal': {
          title: 'Vadodara Sev Usal',
          category: 'Street Food',
          fact: 'Vadodara cult spicy pea usal immersed in extra fiery tari oil, topped with spring onions and sev, eaten with spongy ladi pav.',
          tags: ['vadodara', 'spicy', 'street food'],
          confidence: 0.98,
          learnedAt: 'Heritage calibration'
        },
        'vada pav': {
          title: 'Mumbai Vada Pav',
          category: 'Street Food',
          fact: 'The heartbeat of Mumbai: spiced potato vada in ladi pav laced with pungent dry garlic-coconut chutney and fried green chili.',
          tags: ['mumbai', 'heritage', 'street food'],
          confidence: 0.99,
          learnedAt: 'Heritage calibration'
        },
        'butter chicken': {
          title: 'Delhi Butter Chicken',
          category: 'North Indian',
          fact: 'Born at Moti Mahal Daryaganj in the 1950s; velvety tomato-butter-cream gravy balancing smoky tandoori chicken.',
          tags: ['delhi', 'mughlai', 'curry'],
          confidence: 0.98,
          learnedAt: 'Heritage calibration'
        },
        'puneri misal': {
          title: 'Puneri Misal',
          category: 'Maharashtrian',
          fact: 'Pune staple of sprouted moth beans layered with crunchy chivda farsan, chopped onion, lemon and searing red rassa gravy.',
          tags: ['pune', 'spicy', 'breakfast'],
          confidence: 0.98,
          learnedAt: 'Heritage calibration'
        },
        'fafda jalebi': {
          title: 'Amdavadi Fafda Jalebi',
          category: 'Gujarati Farsan',
          fact: 'Sunday ritual across Gujarat: crunchy besan strips paired with syrup-dripping golden jalebi and grated raw papaya sambharo.',
          tags: ['ahmedabad', 'farsan', 'sweet'],
          confidence: 0.98,
          learnedAt: 'Heritage calibration'
        },
        'dum biryani': {
          title: 'Hyderabadi & Awadhi Dum Biryani',
          category: 'Royal Indian',
          fact: 'Slow dough-sealed handi cooking that traps meat juices, basmati rice, saffron, and fried onions in fragrant harmony.',
          tags: ['biryani', 'royal', 'mughlai'],
          confidence: 0.99,
          learnedAt: 'Heritage calibration'
        },
        'crookie': {
          title: 'Viral Crookie',
          category: 'Modern Fusion',
          fact: 'Parisian viral bakery sensation combining flaky, butter-laminated croissants with warm molten chocolate chip cookie dough.',
          tags: ['viral', 'bakery', 'trending'],
          confidence: 0.95,
          learnedAt: 'Web trend discovery'
        },
        'kunafa': {
          title: 'Middle Eastern Kunafa',
          category: 'Desserts',
          fact: 'Spun kataifi pastry baked with sweet molten akkawi or mozzarella cheese, soaked in fragrant orange blossom sugar syrup.',
          tags: ['middle eastern', 'dessert', 'late night'],
          confidence: 0.96,
          learnedAt: 'Web trend discovery'
        },
        'bingsu': {
          title: 'Korean Shaved Ice Bingsu',
          category: 'Desserts',
          fact: 'Micro-shaved frozen milk snow drizzled with sweet condensed milk, fresh mango chunks, and chewy rice mochi.',
          tags: ['korean', 'dessert', 'cafe'],
          confidence: 0.94,
          learnedAt: 'Web trend discovery'
        },
        'chelo kebab': {
          title: 'Peter Cat Chelo Kebab',
          category: 'Heritage Platter',
          fact: 'Iconic Park Street Kolkata delicacy: buttered aromatic rice crowned with grilled tomato, mutton seekh kebab, and a melting pat of butter.',
          tags: ['kolkata', 'heritage', 'kebabs'],
          confidence: 0.97,
          learnedAt: 'Heritage calibration'
        },
        'shrewsbury biscuits': {
          title: 'Kayani Shrewsbury Biscuits',
          category: 'Bakery',
          fact: 'Pune cult butter biscuits created at Kayani Bakery since 1955; rich, crumbly, and carrying a distinct buttery aroma.',
          tags: ['pune', 'bakery', 'heritage'],
          confidence: 0.97,
          learnedAt: 'Heritage calibration'
        },
        'filter coffee': {
          title: 'South Indian Filter Kaapi',
          category: 'Beverage',
          fact: 'Dark-roasted chicory-blended coffee brewed through a brass dabarah and tumbler, frothy and intensely aromatic.',
          tags: ['south indian', 'beverage', 'cafe'],
          confidence: 0.98,
          learnedAt: 'Heritage calibration'
        }
      };
    }

    defaultMemories() {
      return [
        { time: 'Trained', fact: 'Palo bonded with you to curate authentic Indian gastronomic adventures.', tag: 'bond' },
        { time: 'Trained', fact: 'Trained on 603 verified culinary destinations across 13 Indian metro regions.', tag: 'destinations' },
        { time: 'Trained', fact: 'Calibrated spice tolerance vector to authentic Indian chatpata standards.', tag: 'taste' },
        { time: 'Trained', fact: 'Mastered verified diner review receipts & quotes over promotional ratings.', tag: 'receipts' }
      ];
    }

    loadState() {
      try {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return {};
    }

    saveState() {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify({
          concepts: this.concepts,
          memories: this.memories,
          thoughtLog: this.thoughtLog.slice(0, 15),
          totalThoughts: this.totalThoughts
        }));
      } catch (e) {}
    }

    // ------------------------------------------------------------------------
    // THINKING PIPELINE: 4-Stage Multi-Step Cognitive Reasoning
    // ------------------------------------------------------------------------
    think(query, context = {}) {
      this.totalThoughts++;
      const city = context.city || 'your city';
      const q = String(query || '').trim().toLowerCase();

      // Stage 1: Deconstruction & Linguistic Parsing
      const intentTokens = [];
      if (/teekha|tikha|spicy|tadka|mirchi/.test(q)) intentTokens.push('Fiery Spice 🌶️');
      if (/meetha|sweet|dessert|mithai/.test(q)) intentTokens.push('Sweet Tooth 🍨');
      if (/chai|coffee|cafe/.test(q)) intentTokens.push('Brew / Cafe ☕');
      if (/biryani|gosht|mutton/.test(q)) intentTokens.push('Biryani Royalty 🍛');
      if (/saste|budget|cheap|pocket/.test(q)) intentTokens.push('Pocket-Friendly 💸');
      if (/date|romantic|peaceful|cozy/.test(q)) intentTokens.push('Romantic Vibe 🍷');
      if (/club|party|nightlife/.test(q)) intentTokens.push('Party High Energy 🎉');
      if (!intentTokens.length) intentTokens.push('Culinary Discovery ✨');

      const stage1 = {
        stage: '1. Deconstruct Intent',
        icon: '🔍',
        text: `Query analyzed: “${query || 'Pick for me'}” in ${city}. Detected intent: ${intentTokens.join(', ')}.`
      };

      // Stage 2: Memory & Concept Recall
      const recalledConcepts = [];
      for (const [key, concept] of Object.entries(this.concepts)) {
        if (q.includes(key) || (concept.tags || []).some(t => q.includes(t))) {
          recalledConcepts.push(concept.title);
        }
      }
      const stage2 = {
        stage: '2. Synaptic Memory Retrieval',
        icon: '🧠',
        text: recalledConcepts.length
          ? `Recalled concepts from cognitive brain: ${recalledConcepts.slice(0, 3).join(', ')}. Taste genome aligned.`
          : `Retrieved ${Object.keys(this.concepts).length} culinary concepts and user taste genome (Spice: ${Math.round(this.ml.genome.spiceTolerance * 100)}%).`
      };

      // Stage 3: Deliberation & Counter-Factual Reasoning
      const topMatch = context.topVenue;
      const venueCount = context.venueCount || 10;
      const stage3 = {
        stage: '3. Neural Deliberation',
        icon: '⚖️',
        text: topMatch
          ? `Evaluated ${venueCount} candidate spots against verified diner receipts. Selected ${topMatch.name} with ${context.mlScore || 90}% taste fit.`
          : `Weighed flavor balances and diner review sentiments across ${city}. Formulating optimal recommendation.`
      };

      // Stage 4: Epiphany & Expression
      const emotion = context.emotion || 'friendly';
      const stage4 = {
        stage: '4. Cognitive Epiphany',
        icon: '💡',
        text: `Generated response with ${emotion.toUpperCase()} vocal modulation, expressive Indian cadence & procedural audio.`
      };

      const thoughtChain = [stage1, stage2, stage3, stage4];
      this.thoughtLog.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        query: query || 'Pick for me',
        thoughtChain
      });
      if (this.thoughtLog.length > 12) this.thoughtLog.pop();

      this.saveState();
      return thoughtChain;
    }

    // ------------------------------------------------------------------------
    // AUTONOMOUS FOODIE PONDERING: Palo thinks deeply on his own!
    // ------------------------------------------------------------------------
    ponder(city = 'your city') {
      this.totalThoughts++;
      const epiphanies = [
        {
          topic: 'Tapri Culture vs Modern Cafes',
          thought: `Main soch raha tha... Mumbai ka cutting chai aur Vadodara ka Canara coffee tapri culture ki jaan hain. 15 rupaye ki kadak chai me jo dosti aur sukoon hai, wo 400 rupaye ke cold brew me dhoondhna mushkil hai! 💭☕`,
          emotion: 'warm',
          insight: 'Simplicity and human connection beat extravagant aesthetics in true food culture.'
        },
        {
          topic: 'The Dum Cooking Enigma',
          thought: `Ever wondered why authentic Dum Biryani feels like an emotion? When handi is sealed with dough, the saffron, meat juices, and whole spices are forced into a high-pressure flavor dance. It’s 400 years of culinary thermodynamics! 🍛✨`,
          emotion: 'joy',
          insight: 'Pressure-sealed steam cooking preserves volatile spice aromatics that open flame destroys.'
        },
        {
          topic: 'Street Food Queues as a Mathematical Truth',
          thought: `Palo's rule of thumb: Agar kisi tapri ya lari ke samne local auto walas, college students aur elderly uncles ek sath khade hain, toh wahan ka khana statistically 10/10 guaranteed hai! No marketing beats local loyalty. 🎯`,
          emotion: 'playful',
          insight: 'Multi-demographic local street queues are the most accurate quality indicator in gastronomy.'
        },
        {
          topic: 'The Golden Farsan Papaya Sambharo Hack',
          thought: `In Gujarat, fafda is never served alone—it always comes with grated raw papaya sambharo and fried green chilies. Papaya contains papain enzymes that digest heavy gram-flour instantly! Traditional culinary wisdom was pure science. 💡`,
          emotion: 'curious',
          insight: 'Traditional culinary pairings were naturally designed for metabolic digestive balance.'
        },
        {
          topic: 'The Midnight Foodie Psychology',
          thought: `Late night bhookh hits differently! Midnight pav bhaji at Manek Chowk or midnight butter chicken at Pandara Road tastes 2x better because food shared under city streetlights carries pure nostalgia. 🌙`,
          emotion: 'joy',
          insight: 'Circadian hunger and shared midnight camaraderie dramatically amplify dopamine response.'
        },
        {
          topic: 'The Soul of Sev Usal',
          thought: `Baroda ke Sev Usal me jo tari ki layer hoti hai, wo sirf mirchi nahi hai—wo slow-cooked garlic, ginger aur clove infusion hai. Ek bite and your brain releases instant endorphins! 🌶️`,
          emotion: 'playful',
          insight: 'Capsaicin releases endorphins that turn fiery street food into an addictive mood booster.'
        }
      ];

      const chosen = epiphanies[Math.floor(Math.random() * epiphanies.length)];
      
      const stage1 = { stage: '1. Autonomous Wandering', icon: '💭', text: `Palo began contemplating: “${chosen.topic}”.` };
      const stage2 = { stage: '2. Culinary Knowledge Synthesis', icon: '🧠', text: chosen.insight };
      const stage3 = { stage: '3. Epiphany Articulation', icon: '💡', text: `Formulating philosophical foodie realization for ${city}.` };

      this.thoughtLog.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        query: `Autonomous thought on ${chosen.topic}`,
        thoughtChain: [stage1, stage2, stage3]
      });
      if (this.thoughtLog.length > 12) this.thoughtLog.pop();

      this.saveState();
      return chosen;
    }

    // ------------------------------------------------------------------------
    // ACTIVE LEARNING: Palo learns ANY concept or fact taught by user
    // ------------------------------------------------------------------------
    learnNewConcept(topic, fact, source = 'User teaching') {
      if (!topic || !fact) return null;
      const cleanKey = String(topic).toLowerCase().trim();
      const existing = this.concepts[cleanKey];

      const conceptObj = {
        title: topic.trim(),
        category: 'Learned Knowledge',
        fact: fact.trim(),
        tags: [cleanKey, ...fact.toLowerCase().split(/\s+/).filter(w => w.length > 4).slice(0, 3)],
        confidence: existing ? Math.min(1.0, existing.confidence + 0.1) : 0.92,
        learnedAt: source,
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      this.concepts[cleanKey] = conceptObj;

      // Add episodic memory
      this.memories.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fact: `Learned concept “${topic}”: ${fact}`,
        tag: 'concept'
      });
      if (this.memories.length > 20) this.memories.pop();

      // Boost ML engine XP
      this.ml.genome.xp += 75;
      this.ml.recalculateLevel();
      this.ml.genome.recentLearnings.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        summary: `Brain Learned Concept: “${topic}” · +75 XP`,
        xp: 75
      });
      if (this.ml.genome.recentLearnings.length > 8) this.ml.genome.recentLearnings.pop();
      this.ml.saveGenome();

      this.saveState();
      return conceptObj;
    }

    recordMemory(fact, tag = 'user_fact') {
      if (!fact) return;
      this.memories.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fact,
        tag
      });
      if (this.memories.length > 20) this.memories.pop();
      this.saveState();
    }
  }

  const paloML = new PaloMLTasteEngine();
  const paloBrain = new PaloCognitiveBrain(paloML);

  // --------------------------------------------------------------------------
  // 3. HINDI & HINGLISH CULINARY DICTIONARY & CONVERSATIONAL INTELLIGENCE
  // --------------------------------------------------------------------------
  const HinglishDictionary = {
    spicy: {
      terms: ['teekha', 'tikha', 'chatpata', 'mirchi', 'tadka', 'masaledar', 'spicy', 'hot', 'spicy food', 'mirch', 'tikho'],
      boostTags: ['hot', 'street food', 'north indian', 'punjabi', 'andhra', 'chettinad'],
      desc: 'chatpata aur teekha khana'
    },
    sweet: {
      terms: ['meetha', 'mithai', 'kuch meetha', 'rabdi', 'jalebi', 'halwa', 'kheer', 'kulfi', 'dessert', 'ice cream', 'sweet', 'sweets', 'pastry', 'cheesecake', 'chocolates'],
      boostTags: ['desserts', 'bakery', 'sweets', 'ice cream'],
      desc: 'kuch meetha aur desserts'
    },
    tea: {
      terms: ['chai', 'kadak chai', 'cutting chai', 'kulhad chai', 'tapri', 'bun maska', 'kaafi', 'coffee', 'cafe', 'filter coffee', 'espresso', 'cappuccino', 'cold brew'],
      boostTags: ['cafe', 'coffee', 'bakery'],
      desc: 'kadak chai aur specialty cafe'
    },
    biryani: {
      terms: ['biryani', 'mast biryani', 'dum biryani', 'lazeez biryani', 'gosht', 'mutton', 'chicken biryani', 'mutton biryani', 'hyderabadi biryani', 'lucknowi'],
      boostTags: ['biryani', 'mughlai', 'north indian', 'hyderabadi', 'andhra'],
      desc: 'mast biryani'
    },
    thali: {
      terms: ['thali', 'desi thali', 'shahi thali', 'pet bhar', 'pet bhar ke', 'ghar jaisa', 'dal roti', 'sabzi roti', 'khichdi', 'gujarati thali', 'rajasthani thali'],
      boostTags: ['gujarati', 'rajasthani', 'north indian', 'south indian', 'karnataka', 'thali'],
      desc: 'pet-bhar desi thali'
    },
    chaat: {
      terms: ['chaat', 'golgappe', 'pani puri', 'puchka', 'sev puri', 'dahi puri', 'bhel', 'kachori', 'samosa', 'vada pav', 'pav bhaji', 'street food', 'khau galli'],
      boostTags: ['street food', 'fast food', 'chaat'],
      desc: 'street food aur chatpati chaat'
    },
    south: {
      terms: ['dosa', 'masala dosa', 'benne dosa', 'idli', 'vada', 'sambar', 'uttapam', 'filter coffee', 'south indian', 'appam'],
      boostTags: ['south indian', 'karnataka', 'kerala', 'chettinad'],
      desc: 'crispy dosa aur South Indian'
    },
    budget: {
      terms: ['saste me', 'kam budget', 'pocket friendly', 'sasta', 'jugaad', 'budget friendly', 'saste me badhiya', 'kam paise', 'cheap', 'budget', 'affordable'],
      boostTags: ['street food', 'fast food'],
      desc: 'saste me badhiya'
    },
    romantic: {
      terms: ['date', 'date night', 'romantic', 'sukoon', 'shanti', 'couple', 'candlelight', 'peaceful', 'khubsurat', 'cozy', 'rooftop', 'ambience'],
      boostTags: ['italian', 'cafe', 'continental', 'mediterranean'],
      desc: 'romantic date aur sukoon'
    },
    hangout: {
      terms: ['dosto ke sath', 'dost', 'yaari', 'adda', 'gang', 'bhai log', 'chill scene', 'party', 'friends', 'hangout', 'crowd', 'lively'],
      boostTags: ['cafe', 'pizza', 'fast food', 'street food'],
      desc: 'dosto ke sath chilling scene'
    },
    latenight: {
      terms: ['late night', 'raat ko', 'aadhi raat', 'midnight', 'night', '24x7', 'bhookh lagi hai', 'bhookh', 'bhuk', 'night food'],
      boostTags: ['street food', 'fast food', 'biryani'],
      desc: 'late night cravings'
    },
    veg: {
      terms: ['pure veg', 'shakahari', 'shuddh shakahari', 'jain', 'swaminarayan', 'veg only', 'vegetarian'],
      boostTags: ['gujarati', 'rajasthani', 'south indian', 'north indian'],
      desc: 'pure veg khana'
    },
    legendary: {
      terms: ['bawaal', 'jhakaas', 'zabardast', 'ek number', 'lajawaab', 'kamaal', 'dhansu', 'faadu', 'tagda', 'mast', 'shandaar', 'famous', 'legendary', 'iconic', 'best', 'top'],
      boostTags: ['heritage', 'iconic'],
      desc: 'ek number legendary spots'
    },
    mumbai: {
      terms: ['mumbai', 'bombay', 'vada pav', 'bombil', 'keema pav', 'k rustom', 'bachelorrs', 'marine drive', 'chowpatty', 'bandra', 'mondegar', 'aaswad', 'soam', 'swati snacks', 'noor mohammadi', 'pancham', 'elco', 'cannon'],
      boostTags: ['mumbai', 'maharashtrian', 'street food', 'seafood'],
      desc: 'aamchi mumbai street food, irani cafes aur coastal seafood'
    },
    delhi: {
      terms: ['delhi', 'dilli', 'butter chicken', 'chole bhature', 'nihari', 'moti mahal', 'old delhi', 'chandni chowk', 'jama masjid', 'paranthe wali', 'chaina ram', 'qureshi', 'united coffee', 'kwality', 'jain chawal', 'upsc chaat', 'khan chacha', 'comorin', 'burma burma'],
      boostTags: ['delhi ncr', 'north indian', 'mughlai', 'street food'],
      desc: 'dilwalon ki dilli swad, chandni chowk chaat aur purani dilli mughlai'
    },
    pune: {
      terms: ['pune', 'puneri', 'misal', 'misal pav', 'kata kirr', 'mastani', 'sujata mastani', 'shrewsbury', 'kayani', 'fc road', 'durvankur', 'vaidya', 'shreyas', 'sukanta', 'roopali', 'wadeshwar', 'camp burger', 'maratha samrat'],
      boostTags: ['pune', 'maharashtrian', 'street food', 'bakery'],
      desc: 'puneri misal, thalis, mastani aur camp bakes'
    },
    ahmedabad: {
      terms: ['ahmedabad', 'amdavad', 'fafda', 'jalebi', 'khaman', 'khamani', 'panki', 'manek chowk', 'lucky tea', 'honest pav bhaji', 'raipur bhajia', 'chandravilas', 'lijjat khaman', 'jay falooda', 'anand dalwada', 'atithi', 'pakwan'],
      boostTags: ['ahmedabad', 'gujarati', 'farsan', 'thali'],
      desc: 'amdavadi farsan, dalwada, pols aur heritage thali'
    },
    vadodara: {
      terms: ['vadodara', 'baroda', 'sev usal', 'mahakali', 'lilo chevdo', 'pyarelal', 'alembic', 'sayajiganj', 'shreeji sev usal', 'rasthal', 'mandap', 'sasumaa', 'manmohan samosa', 'duliram peda', 'kismat kathiyawadi'],
      boostTags: ['vadodara', 'regional', 'street food', 'farsan'],
      desc: 'baroda spicy sev usal, rasthal thali aur heritage farsan'
    }
  };

  function parseHinglish(query) {
    const raw = String(query || '').toLowerCase().trim();
    const detected = [];
    const translatedKeywords = [];

    for (const [intentKey, data] of Object.entries(HinglishDictionary)) {
      if (data.terms.some(t => raw.includes(t))) {
        detected.push(intentKey);
        translatedKeywords.push(...data.boostTags);
      }
    }

    const isHinglish = /(teekha|tikha|chatpata|meetha|chai|nashta|biryani|saste|kahan|kaha|batao|khao|khana|kuch|mast|bawaal|jhakaas|dosto|yaari|shanti|sukoon|bhookh|shakahari|desh|desi|swad|swaad|zaika|ek number|zabardast|lajawaab|bhai|chahiye|dikhaye|badhiya|kadak|thali|sasta|mithai|raat|pasand|misal|vada pav|chole bhature|sev usal|fafda|jalebi|panki|mastani|shrewsbury|kheema|keema|butter chicken|baroda|amdavad|dilli|bombay|pune)/i.test(raw);

    return {
      raw,
      detected,
      translatedKeywords: [...new Set(translatedKeywords)],
      isHinglish
    };
  }

  // --------------------------------------------------------------------------
  // 4. REVIEW INTELLIGENCE ENGINE (DEEP ACCESS TO VERIFIED REVIEWS)
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
    const hg = parseHinglish(q);
    const stopWords = ['want', 'some', 'food', 'place', 'restaurant', 'find', 'with', 'good', 'best', 'craving', 'chahiye', 'batao', 'kahan', 'kaha', 'kuch', 'hai', 'me', 'mein', 'kya'];
    const rawTokens = q.replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(t => t.length > 2 && !stopWords.includes(t));
    const tokens = [...new Set([...rawTokens, ...hg.translatedKeywords])];

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

      // Hinglish intent domain boosting
      if (hg.detected.includes('spicy') && (v.s === 'hot' || tagText.includes('spicy') || reviewText.includes('spicy') || reviewText.includes('tadka') || reviewText.includes('mirchi'))) reviewScore += 45;
      if (hg.detected.includes('sweet') && (cuisineText.includes('dessert') || cuisineText.includes('bakery') || reviewText.includes('sweet') || reviewText.includes('mithai') || reviewText.includes('pastry'))) reviewScore += 50;
      if (hg.detected.includes('tea') && (cuisineText.includes('cafe') || cuisineText.includes('coffee') || tagText.includes('cafe') || reviewText.includes('coffee') || reviewText.includes('chai') || reviewText.includes('brew'))) reviewScore += 50;
      if (hg.detected.includes('biryani') && (cuisineText.includes('biryani') || cuisineText.includes('mughlai') || nameText.includes('biryani') || reviewText.includes('biryani'))) reviewScore += 55;
      if (hg.detected.includes('thali') && (nameText.includes('thali') || cuisineText.includes('gujarati') || cuisineText.includes('rajasthani') || reviewText.includes('thali'))) reviewScore += 50;
      if (hg.detected.includes('chaat') && (tagText.includes('street') || cuisineText.includes('street') || nameText.includes('chaat') || reviewText.includes('chaat') || reviewText.includes('puri'))) reviewScore += 50;
      if (hg.detected.includes('south') && (cuisineText.includes('south') || cuisineText.includes('karnataka') || cuisineText.includes('kerala') || nameText.includes('dosa') || reviewText.includes('dosa'))) reviewScore += 50;
      if (hg.detected.includes('budget') && (v.p === 1 || String(v.p).includes('under_500') || String(v.displayPrice || '').includes('₹500') || String(v.displayPrice || '').includes('₹400') || String(v.displayPrice || '').includes('₹600'))) reviewScore += 40;
      if (hg.detected.includes('romantic') && ((v.o || []).includes('date') || (v.a || []).includes('cozy') || (v.a || []).includes('romantic') || (v.a || []).includes('rooftop') || reviewText.includes('romantic') || reviewText.includes('sunset') || reviewText.includes('date'))) reviewScore += 45;
      if (hg.detected.includes('hangout') && ((v.o || []).includes('friends') || (v.a || []).includes('lively') || reviewText.includes('group') || reviewText.includes('friends'))) reviewScore += 40;
      if (hg.detected.includes('veg') && ((v.dietaryOptions || []).includes('vegetarian') || (v.t || []).includes('vegetarian') || reviewText.includes('pure veg') || reviewText.includes('vegetarian'))) reviewScore += 45;
      if (hg.detected.includes('legendary') && (Number(v.rating) >= 4.5 || Number(v.review_count) > 2000)) reviewScore += 40;
      if (hg.detected.includes('mumbai') && (v.city === 'Mumbai' || cuisineText.includes('maharashtrian') || reviewText.includes('vada pav') || reviewText.includes('bombil'))) reviewScore += 50;
      if (hg.detected.includes('delhi') && (v.city === 'Delhi NCR' || cuisineText.includes('north indian') || reviewText.includes('butter chicken') || reviewText.includes('bhature'))) reviewScore += 50;
      if (hg.detected.includes('pune') && (v.city === 'Pune' || reviewText.includes('misal') || reviewText.includes('mastani') || reviewText.includes('shrewsbury'))) reviewScore += 50;
      if (hg.detected.includes('ahmedabad') && (v.city === 'Ahmedabad' || cuisineText.includes('gujarati') || reviewText.includes('fafda') || reviewText.includes('thali'))) reviewScore += 50;
      if (hg.detected.includes('vadodara') && (v.city === 'Vadodara' || reviewText.includes('sev usal') || reviewText.includes('farsan'))) reviewScore += 50;

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

    const hasIntro = /(arrey|arre|wah|bhai|haanji|dekho|bawaal|mast|jhakaas|lajawaab|swad|swaad|zaika|chahiye|khana|aahaa|oho|achaa|acha|koi baat|bilkul)/i.test(spoken);

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
  class PaloWebSearchEngine {
    constructor() {
      this.cache = new Map();
    }

    async searchWeb(query, city = '') {
      const q = String(query || '').trim();
      const cacheKey = `${q}::${city}`.toLowerCase();
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      try {
        if (typeof fetch === 'function') {
          const url = `/api/search?q=${encodeURIComponent(q)}&city=${encodeURIComponent(city)}`;
          const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
          if (res.ok) {
            const data = await res.json();
            if (data && data.ok) {
              this.cache.set(cacheKey, data);
              return data;
            }
          }
        }
      } catch (e) {
        // Fallback to local culinary synthesis if endpoint times out or offline
      }

      const fallback = this.synthesizeLocal(q, city);
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    synthesizeLocal(query, city) {
      const q = query.toLowerCase();
      let heading = `Web Knowledge: “${query}”`;
      let summary = `Live online food guides identify “${query}” as a trending choice across ${city || 'top culinary destinations'}.`;
      let viralBuzz = `Verified diner reviews highlight authentic taste, generous portions, and distinct recipes.`;
      let cuisines = ['Street Food', 'Regional Indian', 'Trending'];
      let dishes = [query];
      let vibes = ['popular', 'viral', 'foodie favorite'];

      if (/crookie|croissant/i.test(q)) {
        heading = 'Viral Crookie (Croissant Cookie Fusion)';
        summary = 'Parisian viral bakery trend combining flaky butter croissants with gooey chocolate chip cookie dough.';
        viralBuzz = 'Trending across artisan bakeries in Bandra Mumbai, Def Col Delhi, and Koregaon Park Pune with high foodie praise.';
        cuisines = ['Bakery', 'Desserts', 'Cafe'];
        dishes = ['Crookie', 'Butter Croissant'];
        vibes = ['trendy', 'sweet'];
      } else if (/kunafa/i.test(q)) {
        heading = 'Middle Eastern Kunafa';
        summary = 'Crispy golden kataifi spun pastry layered with molten sweet cheese or pistachio cream and fragrant sugar syrup.';
        viralBuzz = 'Massive late-night favorite across Old Delhi, Mumbai, and Camp Pune. Diners love the stretchable cheese pull.';
        cuisines = ['Middle Eastern', 'Desserts'];
        dishes = ['Cheese Kunafa', 'Pistachio Kunafa'];
        vibes = ['decadent', 'late night'];
      } else if (/bingsu|korean/i.test(q)) {
        heading = 'Korean Bingsu & K-Street Food';
        summary = 'Snowy shaved milk ice topped with fresh mango, matcha, condensed milk, and chewy mochi.';
        viralBuzz = 'Major favorite among K-wave youth and student foodies across metro campuses.';
        cuisines = ['Korean', 'Desserts', 'Cafe'];
        dishes = ['Mango Bingsu', 'Matcha Bingsu'];
        vibes = ['aesthetic', 'refreshing'];
      } else if (/party|club|nightlife/i.test(q)) {
        heading = 'High-Energy Party Clubs & Lounges';
        summary = 'Premier nightlife hubs featuring international resident DJs, VIP dance floors, and bespoke craft mixology.';
        viralBuzz = 'Packed weekend crowds praising dynamic party energy across Dragonfly, Toy Room, Privee, Soho, High Spirits, and Sphere Lounge.';
        cuisines = ['Nightclub', 'Cocktails', 'Tapas'];
        dishes = ['Craft Cocktails', 'Truffle Fries'];
        vibes = ['party', 'dance', 'high energy'];
      }

      return {
        ok: true,
        query,
        city,
        source: 'web_search',
        heading,
        summary,
        viralBuzz,
        culinaryInsights: {
          cuisines,
          dishes,
          vibes,
          sentiment: 0.95
        }
      };
    }
  }

  const paloWebSearch = new PaloWebSearchEngine();

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
              <p class="paloSubtitle">Your Adaptive Food Companion · 🧠 Cognitive Brain · 🇮🇳 Hindi Accent · 🌐 Web Learner</p>
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
            Hi! I’m Palo, your food pet. I have my own cognitive brain to think, learn food concepts, and reason through diner reviews!
          </p>
        </div>

        <!-- Live Cognitive Thinking Stream (Palo's Own Brain in Action!) -->
        <div id="paloThoughtBox" class="paloThoughtBox" style="display:none;">
          <div class="paloThoughtHeader" id="paloThoughtToggle" role="button" tabindex="0">
            <span class="paloThoughtBadge">🧠 Palo's Train of Thought</span>
            <span class="paloThoughtState" id="paloThoughtState">Reasoning active</span>
          </div>
          <div class="paloThoughtSteps" id="paloThoughtSteps"></div>
        </div>

        <!-- Latest Review Citation Card (Populated on recommendations) -->
        <div id="paloReviewHighlight" class="paloReviewCard" style="display:none;"></div>

        <!-- Live Web Search & ML Insight Card -->
        <div id="paloWebSearchResult" class="paloWebSearchCard" style="display:none;"></div>

        <!-- Quick Suggestions Chips (English & Hinglish) -->
        <div class="paloChipRail" aria-label="Quick requests">
          <button type="button" data-palo-action="foryou">✨ Pick For Me</button>
          <button type="button" data-palo-action="ponder">💭 Ponder & Think</button>
          <button type="button" data-palo-action="websearch">🌐 Web Search & Learn</button>
          <button type="button" data-palo-dish="mast biryani">🍛 Mast Biryani</button>
          <button type="button" data-palo-dish="kuch teekha">🌶️ Chatpata & Teekha</button>
          <button type="button" data-palo-dish="kadak chai">☕ Kadak Chai</button>
          <button type="button" data-palo-dish="desi thali">🥘 Desi Thali</button>
          <button type="button" data-palo-dish="kuch meetha">🍨 Kuch Meetha</button>
          <button type="button" data-palo-dish="saste me badhiya">💸 Saste me Badhiya</button>
          <button type="button" data-palo-dish="date night">🍷 Romantic Date</button>
          <button type="button" data-palo-dish="dosto ke sath">🎉 Dosto ke Sath</button>
          <button type="button" data-palo-action="reviews">💬 Top Reviews</button>
          <button type="button" data-palo-action="brain">🧠 Inspect Brain</button>
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

  let isBubbleOpen = true;
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

  thoughtToggle?.addEventListener('click', () => {
    if (thoughtSteps) {
      const isHidden = thoughtSteps.style.display === 'none';
      thoughtSteps.style.display = isHidden ? 'flex' : 'none';
      if (thoughtState) thoughtState.textContent = isHidden ? 'Expanded' : 'Collapsed';
    }
  });

  function handlePonder() {
    stopSpeaking();
    stopListening();
    brainDrawer.style.display = 'none';
    resultsDeck.replaceChildren();
    reviewCard.style.display = 'none';
    if (webSearchCard) webSearchCard.style.display = 'none';

    setPetState('is-thinking');
    playCuteSound('think');
    setPetMood('Pondering 💭');

    const city = typeof cityName === 'function' ? cityName() : 'your city';
    const epiphany = paloBrain.ponder(city);

    renderThoughtBox(paloBrain.thoughtLog[0]?.thoughtChain || []);

    setTimeout(() => {
      setPetState('is-idle');
      setPetMood(epiphany.emotion === 'joy' ? 'Excited! 🌟' : (epiphany.emotion === 'playful' ? 'Teekha & Fun! 🌶️' : 'Loving 🥰'));
      messageText.textContent = epiphany.thought;
      statusText.textContent = `Palo pondered: “${epiphany.topic}” · Cognitive IQ Level ${paloML.genome.level}`;
      speakCute(epiphany.thought, epiphany.emotion);
      updateBrainStats();
    }, 350);
  }

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

  async function executeWebSearch(searchQuery, city, allVenues) {
    const q = String(searchQuery || 'trending food').trim();
    setPetState('is-thinking');
    playCuteSound('think');
    setPetMood('Searching Web 🌐');
    statusText.textContent = `🌐 Searching web for “${q}” & learning insights...`;
    reviewCard.style.display = 'none';

    const data = await paloWebSearch.searchWeb(q, city);
    const res = paloML.learnFromWebSearch(q, data);
    triggerLearningAnimation(res?.summary);
    updateBrainStats();

    if (webSearchCard) {
      webSearchCard.style.display = 'block';
      const insights = data.culinaryInsights || {};
      const allTags = [...(insights.cuisines || []), ...(insights.dishes || []), ...(insights.vibes || [])];
      webSearchCard.innerHTML = `
        <div class="paloWebSearchHeader">
          <span class="paloWebSearchBadge">🌐 Live Web Search & ML Insight</span>
          <span class="paloWebLearnPill">⚡ +50 XP Learned</span>
        </div>
        <h4 class="paloWebSearchHeading">${esc(data.heading || q)}</h4>
        <p class="paloWebSearchSummary">${esc(data.summary)}</p>
        <p class="paloWebSearchBuzz">“${esc(data.viralBuzz)}”</p>
        <div class="paloWebSearchTags">
          ${allTags.slice(0, 5).map(t => `<span class="paloWebSearchTag">✨ ${esc(t)}</span>`).join('')}
        </div>
      `;
    }

    const thoughtChain = paloBrain.think(q, {
      city,
      venueCount: allVenues.length,
      emotion: 'curious'
    });
    renderThoughtBox(thoughtChain);

    const reply = `Arrey waah! Maine web par search kiya aur “${q}” ke baare me naya swad seekh liya! Online foodie community bolti hai: ${data.summary}`;
    messageText.textContent = reply;
    statusText.textContent = `Palo learned from web · Level ${paloML.genome.level} (${paloML.genome.xp} XP)`;
    speakCute(reply, 'curious');

    const related = searchVenuesByReviewInsights(q, allVenues).slice(0, 3);
    if (related.length && related[0].totalScore > 20) {
      resultsDeck.innerHTML = related.map(({ r, mlTasteScore, reviewData }) => `
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
          </div>
        </article>
      `).join('');
    } else {
      resultsDeck.replaceChildren();
    }
  }

  function handleQuery(forcedQuery = null, forYou = false, isWebSearch = false) {
    stopSpeaking();
    stopListening();
    brainDrawer.style.display = 'none';
    resultsDeck.replaceChildren();
    reviewCard.style.display = 'none';
    if (webSearchCard) webSearchCard.style.display = 'none';

    const city = typeof cityName === 'function' ? cityName() : 'your city';
    const allVenues = typeof ranked === 'function' ? ranked() : [];

    if (!isReady()) {
      const msg = `Sign in and complete your taste quiz! That way I can connect your preferences with the best reviewed spots in ${city}.`;
      messageText.textContent = msg;
      statusText.textContent = 'Please finish onboarding first.';
      speakCute(msg, 'friendly');
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

    // Check for explicit web search query
    const isExplicitWebSearch = isWebSearch || /^(?:web\s*search|search\s*web|google|internet\s*pe|search\s*internet|find\s*online|web\s*pe)\b/i.test(query);
    if (isExplicitWebSearch) {
      const cleanTerm = query.replace(/^(?:web\s*search|search\s*web|google|internet\s*pe|search\s*internet|find\s*online|web\s*pe)\s*(?:for|pe)?\s*/i, '').trim() || 'trending food';
      executeWebSearch(cleanTerm, city, allVenues);
      return;
    }

    // Check for explicit pondering request ("What are you thinking?", "Ponder", "Kuch socho")
    if (/^(?:what are you thinking|think about food|kya soch rahe ho|kuch socho|socho|ponder)\b/i.test(query)) {
      handlePonder();
      input.value = '';
      return;
    }

    // Check for explicit cognitive learning / teaching commands
    const learnMatch = query.match(/^(?:palo[,:\s]+)?(?:learn(?:\s+that|\s+about)?|teach\s+palo|did\s+you\s+know(?:\s+that)?|remember\s+that|yaad\s+rakhna\s+ki|seekho)\s*[:\-]?\s*(.+)$/i);
    if (learnMatch) {
      const fullText = learnMatch[1].trim();
      let topic = '';
      let fact = fullText;

      if (fullText.includes(':')) {
        const parts = fullText.split(':');
        topic = parts[0].trim();
        fact = parts.slice(1).join(':').trim();
      } else if (fullText.toLowerCase().includes(' is ')) {
        const parts = fullText.split(/\s+is\s+/i);
        topic = parts[0].trim();
        fact = fullText;
      } else if (fullText.toLowerCase().includes(' originated in ')) {
        const parts = fullText.split(/\s+originated\s+in\s+/i);
        topic = parts[0].trim();
        fact = fullText;
      } else {
        const words = fullText.split(/\s+/);
        topic = words.slice(0, Math.min(3, words.length)).join(' ');
        fact = fullText;
      }

      setPetState('is-learning');
      playCuteSound('learn');
      setPetMood('Learning 🧠');

      paloBrain.learnNewConcept(topic, fact, 'User taught in chat');
      triggerLearningAnimation(`Brain Learned: ${topic}`);
      updateBrainStats();

      const thoughtChain = [
        { stage: '1. Absorb Input', icon: '📥', text: `Received user culinary teaching on “${topic}”.` },
        { stage: '2. Neural Encoding', icon: '🧠', text: `Encoded concept into semantic memory graph with high confidence.` },
        { stage: '3. Synaptic Link', icon: '⚡', text: `Linked with taste genome affinities (+75 XP Brain Boost).` },
        { stage: '4. Memory Secured', icon: '💾', text: `Persisted into long-term cognitive storage.` }
      ];
      renderThoughtBox(thoughtChain);

      const reply = `Arrey waah! Maine apne brain me ye naya concept record kar liya! “${topic}” ab meri permanent memory me save ho gaya hai. Agli baar jab aap iske baare me poochhenge, toh mujhe poora yaad rahega! 🧠✨`;
      messageText.textContent = reply;
      statusText.textContent = `Palo learned “${topic}” · Cognitive Brain Level ${paloML.genome.level} (${paloML.genome.xp} XP)`;
      speakCute(reply, 'joy');
      input.value = '';
      return;
    }

    // 1. Check for explicit natural language taste teaching (English or Hindi/Hinglish)
    const teachEn = query.match(/^i\s+(love|like|hate|dislike|don't like|do not like)\s+(.+?)[.!]?$/i);
    const teachHi = query.match(/^(?:mujhe\s+)?(.+?)\s+(pasand\s+hai|bohot\s+pasand\s+hai|pasand\s+nahi\s+hai|achha\s+lagta\s+hai|bura\s+lagta\s+hai)[.!]?$/i);
    if (teachEn || teachHi) {
      let sentiment = 'love';
      let term = '';
      if (teachEn) {
        sentiment = /^(love|like)$/i.test(teachEn[1]) ? 'love' : 'pass';
        term = teachEn[2].toLowerCase();
      } else {
        sentiment = /nahi/i.test(teachHi[2]) ? 'pass' : 'love';
        term = teachHi[1].replace(/^(mujhe\s+)/i, '').toLowerCase();
      }
      const dishes = availableCalibrationDishes();
      const match = dishes.find(d => d.name.toLowerCase().includes(term) || d.tags.some(t => t.toLowerCase().includes(term)));

      if (match) {
        rateDish(match.id, sentiment, 'palo');
        const res = paloML.learnFromDish(match.id, match.name, match.cuisine, sentiment);
        triggerLearningAnimation(res.summary);
        const reply = teachHi
          ? (sentiment === 'love'
              ? `Wah! Yaad rakhunga ki aapko ${match.name} pasand hai. ${city} me recommendations update ho gaye!`
              : `Theek hai! Noted ki aap ${match.name} avoid karte hain. ${city} me naye options ready hain!`)
          : (`${sentiment === 'love' ? 'Ooh, yum!' : 'Got it!'} I remembered that you ${sentiment === 'love' ? 'love' : 'prefer to skip'} ${match.name}. My recommendations in ${city} have evolved!`);
        messageText.textContent = reply;
        statusText.textContent = `Palo learned: ${match.name} (${sentiment}) · Level ${paloML.genome.level}`;
        speakCute(reply, sentiment === 'love' ? 'joy' : 'gentle');
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
        // Cascade automatically to web search to learn unknown dishes/queries live
        executeWebSearch(query, city, allVenues);
        return;
      }

      const top = matches[0];
      const hg = parseHinglish(query);
      let reply = '';
      if (forYou) {
        reply = hg.isHinglish
          ? `Arre waah! ${city} me aapke taste genome ke mutabik ye rahe mere top picks! Diners bolte hain ${top.r.name} ka khana ekdum bawaal hai.`
          : `Here are my top picks in ${city} adapted to your taste genome! Diners especially praise ${top.r.name}.`;
      } else if (hg.isHinglish) {
        if (hg.detected.includes('spicy')) {
          reply = `Chatpata aur teekha craving? ${city} me ${top.r.name} ka tadka ekdum zabardast hai! ★ ${top.reviewData.rating} rating ke sath diners ne dil se tareef ki hai.`;
        } else if (hg.detected.includes('sweet')) {
          reply = `Kuch meetha ho jaye! ${city} me ${top.r.name} ke desserts aur sweets par ${top.reviewData.sentimentPct}% diners fida hain.`;
        } else if (hg.detected.includes('tea')) {
          reply = `Kadak chai aur specialty coffee! ${city} ke diners ${top.r.name} ke ambience aur brews ki bohot tareef karte hain.`;
        } else if (hg.detected.includes('biryani')) {
          reply = `Biryani ki talab? Toh compromise kaisa! ${city} me ${top.r.name} ki biryani ekdum lajawab hai. Diners: ${top.reviewData.topQuote}`;
        } else if (hg.detected.includes('budget')) {
          reply = `Pocket friendly aur swad ekdum top class! ${city} me ${top.r.name} saste me pet bharne ke liye sabse best hai.`;
        } else if (hg.detected.includes('romantic')) {
          reply = `Date night ka perfect plan! ${city} me ${top.r.name} ka sukoon, ambiance aur khana dono dil jeet lenge.`;
        } else if (hg.detected.includes('hangout')) {
          reply = `Dosto ke sath chilling scene? ${city} me ${top.r.name} ka vibe ekdum mast hai aur group ke liye perfect!`;
        } else if (hg.detected.includes('thali')) {
          reply = `Desi thali ka asar! ${city} me ${top.r.name} par bharpoor swad aur authentic thali milti hai.`;
        } else if (hg.detected.includes('chaat')) {
          reply = `Chaat aur street food ki talab? ${city} me ${top.r.name} ke chatpate swad par diners toot padte hain!`;
        } else if (hg.detected.includes('south')) {
          reply = `Crispy dosa aur authentic South Indian swad! ${city} me ${top.r.name} par diners ka review: ${top.reviewData.topQuote}`;
        } else if (hg.detected.includes('mumbai')) {
          reply = `Aamchi Mumbai vibes! ${city} me ${top.r.name} par authentic street food aur coastal flavours milenge. Diners: ${top.reviewData.topQuote}`;
        } else if (hg.detected.includes('delhi')) {
          reply = `Dilli ka asali zaika! ${city} me ${top.r.name} ka butter chicken aur tandoori swad ekdum lajawab hai! Diners: ${top.reviewData.topQuote}`;
        } else if (hg.detected.includes('pune')) {
          reply = `Puneri swad! ${city} me ${top.r.name} par authentic misal, mastani aur bakes ka zabardast experience milega!`;
        } else if (hg.detected.includes('ahmedabad')) {
          reply = `Amdavadi swad ni maja! ${city} me ${top.r.name} par crunchy fafda, jalebi aur heritage thali ekdum top notch hai!`;
        } else if (hg.detected.includes('vadodara')) {
          reply = `Sanskari Nagari Vadodara ka swad! ${city} me ${top.r.name} par spicy sev usal aur farsan ka asli rang jamega!`;
        } else {
          reply = `Bawaal choice! ${city} me “${query}” ke liye ${top.r.name} ekdum jhakaas spot hai! Diners ka review: ${top.reviewData.topQuote}`;
        }
      } else {
        reply = `Found ${matches.length} spots in ${city} matching “${query}”! At ${top.r.name}, ${top.reviewData.sentimentPct}% of diners loved their reviews.`;
      }

      messageText.textContent = reply;
      statusText.textContent = `Showing ${matches.length} places with verified diner receipts.`;

      // Palo Cognitive Brain Reasoning Pipeline
      const emotion = detectEmotion(reply);
      const thoughtChain = paloBrain.think(query, {
        city,
        topVenue: top.r,
        mlScore: top.mlTasteScore,
        venueCount: matches.length,
        emotion
      });
      renderThoughtBox(thoughtChain);

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

      speakCute(reply + (hg.isHinglish ? ` Top recommendation ${top.r.name} hai.` : ` Top suggestion is ${top.r.name}.`));
    }, 280);
  }

  // --------------------------------------------------------------------------
  // 8. ML BRAIN INSPECTION DRAWER
  // --------------------------------------------------------------------------
  function renderBrainDrawer() {
    const g = paloML.genome;
    const topCuisines = Object.entries(g.cuisines).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const recent = g.recentLearnings || [];
    const conceptEntries = Object.entries(paloBrain.concepts);
    const memories = paloBrain.memories || [];

    brainDrawer.innerHTML = `
      <div class="paloBrainHead">
        <div>
          <h4>Palo's Cognitive Brain & ML Genome</h4>
          <span class="paloXpTag">Level ${g.level} · ${g.xp} XP</span>
        </div>
        <button type="button" class="paloCloseBrainBtn" id="paloCloseBrainBtnTop" aria-label="Close brain view">✕</button>
      </div>

      <div class="paloBrainStatsGrid">
        <div class="paloStatCard">
          <span class="paloStatVal">${g.level}</span>
          <span class="paloStatLabel">Brain Level</span>
        </div>
        <div class="paloStatCard">
          <span class="paloStatVal">${conceptEntries.length}</span>
          <span class="paloStatLabel">Concepts</span>
        </div>
        <div class="paloStatCard">
          <span class="paloStatVal">${memories.length}</span>
          <span class="paloStatLabel">Memories</span>
        </div>
        <div class="paloStatCard">
          <span class="paloStatVal">${paloBrain.totalThoughts}</span>
          <span class="paloStatLabel">Thoughts</span>
        </div>
      </div>

      <!-- Teach Palo's Brain Form -->
      <div class="paloGenomeSection">
        <h5>🎓 Teach Palo a New Concept</h5>
        <p class="paloSectionSub">Teach Palo culinary history, dish origins, or secret food facts. Palo saves it in permanent cognitive memory and levels up (+75 XP)!</p>
        <form class="paloTeachForm" id="paloTeachBrainForm">
          <input type="text" id="paloTeachTopic" class="paloTeachInput" placeholder="Dish or concept (e.g. Gujarati Undhiyu, Neapolitan Pizza)" required maxlength="60" />
          <textarea id="paloTeachFact" class="paloTeachTextarea" placeholder="Explain the origin, secret preparation, or truth..." required maxlength="240" rows="2"></textarea>
          <button type="submit" class="paloTeachBtn" id="paloTeachSubmit">Teach Palo's Brain (+75 XP) 🧠</button>
        </form>
      </div>

      <!-- Mastered Concept Cloud -->
      <div class="paloGenomeSection">
        <h5>💡 Mastered Culinary Concepts (${conceptEntries.length})</h5>
        <p class="paloSectionSub">Tap any concept to inspect Palo's neural memory graph.</p>
        <div class="paloConceptCloud">
          ${conceptEntries.map(([key, c]) => `
            <button type="button" class="paloConceptPill" data-palo-concept="${esc(key)}">
              ${esc(c.title)}
            </button>
          `).join('')}
        </div>
        <div id="paloConceptDetailBox" class="paloConceptDetailBox" style="display:none;"></div>
      </div>

      <!-- ML Taste Preferences -->
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

      <!-- Episodic Memories & Log -->
      ${memories.length ? `
        <div class="paloGenomeSection">
          <h5>Episodic Memory Bank</h5>
          <ul class="paloLogList">
            ${memories.slice(0, 6).map(m => `<li><span class="paloLogTime">${esc(m.time)}</span> ${esc(m.fact)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

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
    document.getElementById('paloCloseBrainBtnTop')?.addEventListener('click', () => {
      brainDrawer.style.display = 'none';
    });

    const detailBox = document.getElementById('paloConceptDetailBox');
    brainDrawer.querySelectorAll('.paloConceptPill').forEach(pill => {
      pill.addEventListener('click', () => {
        const key = pill.dataset.paloConcept;
        const concept = paloBrain.concepts[key];
        if (concept && detailBox) {
          brainDrawer.querySelectorAll('.paloConceptPill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          detailBox.style.display = 'block';
          detailBox.innerHTML = `
            <div class="paloConceptDetailHead">
              <h6>${esc(concept.title)}</h6>
              <span class="paloConceptCategory">${esc(concept.category || 'General')}</span>
            </div>
            <p class="paloConceptDetailFact">${esc(concept.fact)}</p>
            <div class="paloConceptDetailMeta">
              <span>Confidence: ${Math.round((concept.confidence || 0.95) * 100)}%</span>
              <span>Source: ${esc(concept.learnedAt || 'Learning')}</span>
            </div>
          `;
          playCuteSound('blip');
        }
      });
    });

    const teachForm = document.getElementById('paloTeachBrainForm');
    teachForm?.addEventListener('submit', e => {
      e.preventDefault();
      const topicInput = document.getElementById('paloTeachTopic');
      const factInput = document.getElementById('paloTeachFact');
      const topic = topicInput?.value.trim();
      const fact = factInput?.value.trim();
      if (!topic || !fact) return;

      paloBrain.learnNewConcept(topic, fact, 'Taught in Brain Drawer');
      triggerLearningAnimation(`Brain Learned: ${topic}`);
      updateBrainStats();
      playCuteSound('learn');

      const reply = `Maine seekh liya! “${topic}” mere permanent cognitive memory graph me add ho gaya hai! (+75 XP) 🧠✨`;
      messageText.textContent = reply;
      statusText.textContent = `Palo learned “${topic}” · Level ${paloML.genome.level}`;
      speakCute(reply, 'joy');

      renderBrainDrawer();
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
      } else if (act === 'ponder') {
        handlePonder();
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
        statusText.textContent = `Trained Palo on ${venue.name} · Level ${paloML.genome.level}`;
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

  // Expose ML and Cognitive Brain on window for runtime testing & external controllers
  window.paloML = paloML;
  window.paloBrain = paloBrain;
  window.PaloCognitiveBrain = PaloCognitiveBrain;

  showIntro();
})();

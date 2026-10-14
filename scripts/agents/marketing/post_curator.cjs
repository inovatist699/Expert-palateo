const BaseAgent = require('../core/agent_base.cjs');
const path = require('node:path');
const fs = require('node:fs');

class PostCuratorAgent extends BaseAgent {
  constructor() {
    super(
      'marketing:post_curator',
      'Instagram Post & Carousel Curator',
      'Curates editorial dining guides, designs high-engagement Instagram carousels, and crafts conversion-focused captions.'
    );
  }

  async execute(context = {}) {
    const root = this.config.root;
    const outputDir = path.join(root, 'marketing/output/posts');
    fs.mkdirSync(outputDir, { recursive: true });

    const postBlueprints = [
      {
        id: 'bengaluru_craft_guide',
        city: 'Bengaluru',
        title: '5 Craft Dining Spots in Bengaluru That Redefine Flavor',
        slides: [
          { slide: 1, type: 'cover', headline: '5 Craft Dining Spots in Bengaluru', sub: 'Curated by Palateo Taste Intelligence' },
          { slide: 2, type: 'venue', name: 'Lupa', area: 'MG Road', tag: 'European Elegance & House Charcuterie' },
          { slide: 3, type: 'venue', name: 'Toast & Tonic', area: 'Richmond Town', tag: 'East Asian Botanical Cocktails' },
          { slide: 4, type: 'venue', name: 'The Rameshwaram Cafe', area: 'Indiranagar', tag: 'Iconic Ghee Roast Podi Dosa' },
          { slide: 5, type: 'cta', headline: 'What is your dining persona?', sub: 'Take the 60s Taste Quiz at palateo.in (Link in Bio)' }
        ],
        caption: `Bengaluru's culinary landscape moves fast, but true craft dining stands apart. 🍽️✨

Here are 5 handpicked culinary institutions where ingredients, ambiance, and taste alignment meet perfection:

1. 🍷 Lupa (MG Road) - House cured charcuterie and timeless European culinary craft.
2. 🍸 Toast & Tonic (Richmond Town) - Botanical cocktails paired with local artisan produce.
3. 🧈 The Rameshwaram Cafe (Indiranagar) - The legendary ghee podi benchmark.

Food isn't one-size-fits-all. Discover where your taste vector points you at the link in our bio! 📲

#BengaluruFoodies #BangaloreEats #Palateo #TasteQuiz #CraftDining #GourmetIndia #FoodDiscovery #IndiranagarEats #BangaloreRestaurants`,
        tags: ['#BengaluruFoodies', '#BangaloreEats', '#Palateo', '#TasteQuiz', '#CraftDining']
      },
      {
        id: 'taste_science_breakdown',
        city: 'All Metros',
        title: 'The Science of Personal Taste: Why You Love What You Love',
        slides: [
          { slide: 1, type: 'cover', headline: 'Why Generic Food Recommendations Fail You', sub: 'The Palateo Taste Model Explained' },
          { slide: 2, type: 'concept', headline: 'The 4 Pillars of Flavor Alignment', sub: 'Spice Sensitivity • Texture Bias • Umami Weight • Price Ergonomics' },
          { slide: 3, type: 'concept', headline: 'Feedback That Adapts in Real-Time', sub: 'Unlike static 5-star reviews, Palateo learns from what you love and pass.' },
          { slide: 4, type: 'cta', headline: 'Find your dining vector today', sub: 'Free on web at palateo.in &bull; Link in Bio' }
        ],
        caption: `Ever been dragged to a 4.8-star restaurant by friends only to be completely underwhelmed? 🙃

That's because popularity does not equal personal compatibility. 

At Palateo, our taste intelligence evaluates 8 multidimensional dining axes—from spice tolerance to textural preference—to find places tailored to *your* unique palate.

Take the free 60-second Taste Quiz at palateo.in (link in bio)! ⚡

#FoodPsychology #FoodTech #Palateo #TasteQuiz #FoodDiscovery #CuratedDining #SmartDining #GourmetFoodie`,
        tags: ['#FoodPsychology', '#FoodTech', '#Palateo', '#TasteQuiz', '#SmartDining']
      }
    ];

    const blueprint = context.blueprint || postBlueprints[Math.floor(Math.random() * postBlueprints.length)];
    const postId = `post_${Date.now()}_${blueprint.id}`;
    const postDir = path.join(outputDir, postId);
    fs.mkdirSync(postDir, { recursive: true });

    this.log(`Curating Instagram Carousel: "${blueprint.title}"...`);

    // Generate Slide 1 Cover Graphic (1080x1350 4:5 Portrait format)
    const coverSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="1080" height="1350">
  <defs>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
    <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f97316" />
      <stop offset="100%" stop-color="#ec4899" />
    </linearGradient>
  </defs>
  <rect width="1080" height="1350" fill="url(#cardBg)" />
  
  <!-- Subtle Grid Lines -->
  <line x1="80" y1="160" x2="1000" y2="160" stroke="rgba(255,255,255,0.08)" stroke-width="2" />
  
  <!-- Header -->
  <text x="80" y="120" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="700" fill="#f97316" letter-spacing="3">PALATEO EDITORIAL</text>
  <text x="1000" y="120" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="#64748b" text-anchor="end">SWIPE &rarr;</text>

  <!-- Big Title -->
  <text x="80" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="68" font-weight="800" fill="#ffffff">
    ${blueprint.slides[0].headline}
  </text>
  <text x="80" y="520" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="500" fill="#94a3b8">
    ${blueprint.slides[0].sub}
  </text>

  <!-- Graphic Centerpiece -->
  <rect x="80" y="600" width="920" height="520" rx="30" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" stroke-width="2" />
  <circle cx="540" cy="840" r="120" fill="url(#titleGrad)" opacity="0.8" />
  <text x="540" y="865" font-size="90" text-anchor="middle">🍽️</text>

  <!-- Footer -->
  <text x="540" y="1240" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="600" fill="#f8fafc" text-anchor="middle">
    Swipe for full recommendations &bull; Link in bio
  </text>
</svg>
    `.trim();

    const coverPath = path.join(postDir, 'slide_1_cover.svg');
    fs.writeFileSync(coverPath, coverSvg, 'utf8');

    const manifest = {
      id: postId,
      aspectRatio: '4:5',
      resolution: '1080x1350',
      title: blueprint.title,
      slidesCount: blueprint.slides.length,
      slides: blueprint.slides,
      caption: blueprint.caption,
      hashtags: blueprint.tags,
      assets: {
        coverSvg: coverPath
      },
      createdAt: new Date().toISOString()
    };

    fs.writeFileSync(path.join(postDir, 'post_manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
    this.log(`Instagram Carousel package created at ${postDir}`, 'success');
    this.eventBus.emit('marketing:post_created', manifest);

    return {
      postId,
      postDir,
      title: blueprint.title,
      caption: blueprint.caption,
      coverSvgPath: coverPath
    };
  }
}

module.exports = PostCuratorAgent;

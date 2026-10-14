const BaseAgent = require('../core/agent_base.cjs');
const path = require('node:path');
const fs = require('node:fs');

class StoryEngineAgent extends BaseAgent {
  constructor() {
    super(
      'marketing:story_engine',
      'Instagram Story Engine',
      'Creates daily engaging 9:16 Instagram Stories with interactive polls, foodie trivia, and curated restaurant spotlights.'
    );
  }

  async execute(context = {}) {
    const root = this.config.root;
    const outputDir = path.join(root, 'marketing/output/stories');
    fs.mkdirSync(outputDir, { recursive: true });

    const storyTypes = [
      {
        type: 'poll',
        question: 'Which dining vibe wins your Friday night?',
        optionA: 'Cozy Speakeasy 🍸',
        optionB: 'Lively Rooftop 🌆',
        linkSticker: 'https://palateo.in',
        tags: ['#FoodiePoll', '#WeekendVibes', '#Palateo']
      },
      {
        type: 'spotlight',
        headline: 'Hidden Gem of the Day',
        venue: 'The Bombay Canteen (Mumbai)',
        cuisine: 'Modern Regional Indian',
        highlight: 'Wild Mushroom Khichdi & Guava Cocktail',
        linkSticker: 'https://palateo.in/app/',
        tags: ['#MumbaiEats', '#CuratedDining', '#Palateo']
      },
      {
        type: 'quiz',
        question: 'Can your taste buds handle true Kolhapuri spice?',
        optionA: 'Bring the fire 🔥',
        optionB: 'Mild only, please 🥛',
        linkSticker: 'https://palateo.in',
        tags: ['#TasteQuiz', '#IndianFood', '#SpiceTolerance']
      }
    ];

    const selected = storyTypes[Math.floor(Math.random() * storyTypes.length)];
    const storyId = `story_${Date.now()}_${selected.type}`;
    const storyDir = path.join(outputDir, storyId);
    fs.mkdirSync(storyDir, { recursive: true });

    this.log(`Generating Instagram Story (${selected.type}): "${selected.question || selected.headline}"...`);

    // Generate 1080x1920 SVG Story Graphic
    const storySvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="50%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#311042" />
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f97316" />
      <stop offset="100%" stop-color="#ec4899" />
    </linearGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#bg)" />

  <!-- Top Brand Tag -->
  <text x="540" y="220" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" fill="#f97316" letter-spacing="4" text-anchor="middle">PALATEO DAILY</text>
  
  <!-- Headline -->
  <text x="540" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="60" font-weight="800" fill="#ffffff" text-anchor="middle">
    ${selected.headline || selected.question}
  </text>

  <!-- Interactive Card Center -->
  <rect x="100" y="520" width="880" height="880" rx="40" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" stroke-width="2" />

  ${selected.type === 'poll' || selected.type === 'quiz' ? `
    <!-- Poll Option 1 -->
    <rect x="180" y="680" width="720" height="160" rx="30" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
    <text x="540" y="775" font-family="system-ui, -apple-system, sans-serif" font-size="38" font-weight="700" fill="#ffffff" text-anchor="middle">
      ${selected.optionA}
    </text>

    <!-- Poll Option 2 -->
    <rect x="180" y="900" width="720" height="160" rx="30" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
    <text x="540" y="995" font-family="system-ui, -apple-system, sans-serif" font-size="38" font-weight="700" fill="#ffffff" text-anchor="middle">
      ${selected.optionB}
    </text>
  ` : `
    <!-- Spotlight Details -->
    <text x="540" y="700" font-size="90" text-anchor="middle">⭐</text>
    <text x="540" y="820" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" fill="#ffffff" text-anchor="middle">
      ${selected.venue}
    </text>
    <text x="540" y="900" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="600" fill="#f97316" text-anchor="middle">
      ${selected.cuisine}
    </text>
    <text x="540" y="980" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="#94a3b8" text-anchor="middle">
      Must-Try: ${selected.highlight}
    </text>
  `}

  <!-- Link Sticker CTA -->
  <rect x="220" y="1500" width="640" height="120" rx="60" fill="url(#glow)" />
  <text x="540" y="1575" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="800" fill="#ffffff" text-anchor="middle">
    🔗 Tap Link for Full Guide
  </text>

  <text x="540" y="1700" font-family="system-ui, -apple-system, sans-serif" font-size="26" fill="#64748b" text-anchor="middle">
    Take your personal taste quiz at palateo.in
  </text>
</svg>
    `.trim();

    const svgPath = path.join(storyDir, 'story_card.svg');
    fs.writeFileSync(svgPath, storySvg, 'utf8');

    const manifest = {
      id: storyId,
      aspectRatio: '9:16',
      resolution: '1080x1920',
      type: selected.type,
      data: selected,
      assets: {
        storySvg: svgPath
      },
      linkSticker: selected.linkSticker,
      createdAt: new Date().toISOString()
    };

    fs.writeFileSync(path.join(storyDir, 'story_manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
    this.log(`Story generated at ${storyDir}`, 'success');
    this.eventBus.emit('marketing:story_created', manifest);

    return {
      storyId,
      storyDir,
      svgPath,
      manifest
    };
  }
}

module.exports = StoryEngineAgent;

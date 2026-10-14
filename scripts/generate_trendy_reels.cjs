#!/usr/bin/env node

/**
 * PALATEO VIRAL REELS GENERATOR
 * Generates high-converting, trendy 9:16 Instagram Reels with multi-scene storyboards,
 * viral hooks, audio pairings, and interactive HTML preview players.
 */

const ReelDirectorAgent = require('./agents/marketing/reel_director.cjs');
const path = require('node:path');
const fs = require('node:fs');

async function main() {
  console.log('\n========================================================');
  console.log('   🔥 PALATEO TRENDY INSTAGRAM REELS GENERATOR');
  console.log('========================================================\n');

  const director = new ReelDirectorAgent();
  const results = await director.generateAllTrendingFormats();

  console.log('\n' + '='.repeat(56));
  console.log(' 🌟 GENERATED TRENDY REELS BATCH:');
  console.log('='.repeat(56));

  for (const r of results) {
    console.log(`\n• [${r.archetype}] ${r.title}`);
    console.log(`  Directory: ${r.reelDir}`);
    console.log(`  Preview:   file:///${r.previewHtmlPath.replace(/\\/g, '/')}`);
    console.log(`  Trigger:   Comment "${r.commentTrigger}" to trigger DM link`);
  }

  // Create an index HTML to preview all generated reels in one place
  const reelsIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Palateo Trendy Reels Campaign Hub</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #090d16;
      color: #f8fafc;
      font-family: system-ui, -apple-system, sans-serif;
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .header {
      text-align: center;
      max-width: 800px;
      margin-bottom: 40px;
    }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      background: rgba(249, 115, 22, 0.15);
      color: #f97316;
      font-weight: 700;
      font-size: 13px;
      margin-bottom: 12px;
    }
    h1 { font-size: 36px; font-weight: 800; margin-bottom: 12px; }
    p { color: #94a3b8; font-size: 16px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      max-width: 1200px;
      width: 100%;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 20px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, border-color 0.2s;
    }
    .card:hover {
      transform: translateY(-4px);
      border-color: #f97316;
    }
    .card-preview {
      width: 100%;
      height: 280px;
      background: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .card-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .card-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: space-between;
    }
    .card-archetype {
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 700;
      color: #f97316;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }
    .card-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 16px;
      color: #ffffff;
    }
    .btn {
      display: inline-block;
      text-align: center;
      background: #f97316;
      color: #fff;
      font-weight: 700;
      text-decoration: none;
      padding: 12px 20px;
      border-radius: 12px;
      margin-top: 16px;
      transition: background 0.2s;
    }
    .btn:hover { background: #ea580c; }
  </style>
</head>
<body>
  <div class="header">
    <div class="badge">MARKETING SWARM &bull; INSTAGRAM REEL DIRECTOR</div>
    <h1>Palateo Viral Reels Hub</h1>
    <p>Hand-crafted 9:16 Instagram Reels scripted with 0-3s retention hooks, multi-scene storyboards, and interactive preview players.</p>
  </div>

  <div class="grid">
    ${results.map(r => `
      <div class="card">
        <div class="card-preview">
          <img src="${path.relative(path.join(director.config.root, 'marketing/output/reels'), r.thumbnailPath).replace(/\\/g, '/')}" alt="Thumbnail">
        </div>
        <div class="card-content">
          <div>
            <div class="card-archetype">${r.archetype}</div>
            <div class="card-title">${r.title}</div>
            <p style="font-size: 13px; color: #94a3b8;">Trigger: Comment "<strong>${r.commentTrigger}</strong>" &bull; 5 Visual Scenes</p>
          </div>
          <a class="btn" href="${path.relative(path.join(director.config.root, 'marketing/output/reels'), r.previewHtmlPath).replace(/\\/g, '/')}" target="_blank">
            ▶ Preview Reel in Mobile Player
          </a>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

  const hubPath = path.join(director.config.root, 'marketing/output/reels/index.html');
  fs.writeFileSync(hubPath, reelsIndexHtml, 'utf8');

  console.log(`\n🎉 Campaign Hub created at: file:///${hubPath.replace(/\\/g, '/')}\n`);
}

main().catch(console.error);

const BaseAgent = require('../core/agent_base.cjs');
const path = require('node:path');
const fs = require('node:fs');

class InstagramPublisherAgent extends BaseAgent {
  constructor() {
    super(
      'marketing:instagram_publisher',
      'Instagram Graph API Publisher',
      'Orchestrates the media upload container lifecycle, schedules content for peak engagement, and publishes Reels, Stories, and Carousels.'
    );
  }

  async execute(context = {}) {
    const root = this.config.root;
    const igConfig = this.config.env?.instagram || {};
    const accountId = igConfig.accountId;
    const accessToken = igConfig.accessToken;
    const graphVersion = igConfig.graphVersion || 'v21.0';
    const isLive = this.config.env.mode === 'live' && accountId && accessToken;

    const queueDir = path.join(root, 'marketing/queue/ready_to_publish');
    const publishedDir = path.join(root, 'marketing/published');
    fs.mkdirSync(queueDir, { recursive: true });
    fs.mkdirSync(publishedDir, { recursive: true });

    const item = context.item || {
      type: 'carousel',
      title: 'Bengaluru Craft Dining Guide',
      caption: 'Bengaluru culinary craft dining guide #Palateo #TasteQuiz',
      mediaUrl: 'https://palateo.in/resources/og-image.png'
    };

    const publishReport = {
      timestamp: new Date().toISOString(),
      mode: isLive ? 'live_instagram_graph_api' : 'simulated_queue_dry_run',
      accountId: accountId || 'NOT_CONFIGURED',
      status: 'pending',
      itemType: item.type,
      publishedId: null
    };

    this.log(`Initiating publishing workflow for [${item.type}] "${item.title || 'Untitled'}"...`);

    if (!isLive) {
      this.log('Mode: SIMULATED / DRY-RUN (To publish live to Instagram, set INSTAGRAM_ACCOUNT_ID and META_ACCESS_TOKEN in .env.agents.local)', 'info');

      const queueFile = path.join(queueDir, `publish_${Date.now()}_${item.type}.json`);
      const queueData = {
        ...item,
        queuedAt: new Date().toISOString(),
        scheduledFor: this.calculateOptimalPostingTime(),
        status: 'queued_ready_for_dispatch'
      };
      fs.writeFileSync(queueFile, JSON.stringify(queueData, null, 2), 'utf8');

      publishReport.status = 'queued';
      publishReport.queueFile = queueFile;
      publishReport.scheduledFor = queueData.scheduledFor;
      this.log(`Post packaged & queued for optimal posting window: ${queueData.scheduledFor}`, 'success');
      this.eventBus.emit('marketing:queued', publishReport);
      return publishReport;
    }

    // Live Publishing Flow via Meta Instagram Graph API
    try {
      this.log(`Step 1: Creating Instagram media container on Graph API ${graphVersion}...`);
      const containerEndpoint = `https://graph.facebook.com/${graphVersion}/${accountId}/media`;
      
      const payload = {
        access_token: accessToken,
        caption: item.caption
      };

      if (item.type === 'reel') {
        payload.media_type = 'REELS';
        payload.video_url = item.videoUrl || item.mediaUrl;
        payload.share_to_feed = true;
      } else if (item.type === 'story') {
        payload.media_type = 'STORIES';
        payload.image_url = item.imageUrl || item.mediaUrl;
      } else {
        payload.image_url = item.imageUrl || item.mediaUrl;
      }

      const containerRes = await fetch(containerEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const containerData = await containerRes.json();
      if (!containerRes.ok || !containerData.id) {
        throw new Error(`Media container creation failed: ${JSON.stringify(containerData)}`);
      }

      const containerId = containerData.id;
      this.log(`Media container created: ${containerId}. Checking readiness...`);

      // Step 2: Poll container status
      let ready = false;
      for (let attempt = 0; attempt < 10; attempt++) {
        await new Promise(r => setTimeout(r, 3000));
        const statusRes = await fetch(`https://graph.facebook.com/${graphVersion}/${containerId}?fields=status_code&access_token=${accessToken}`);
        const statusData = await statusRes.json();
        if (statusData.status_code === 'FINISHED') {
          ready = true;
          break;
        } else if (statusData.status_code === 'ERROR') {
          throw new Error(`Instagram container processing failed: ${JSON.stringify(statusData)}`);
        }
      }

      if (!ready) {
        throw new Error('Timed out waiting for Instagram media container to finish processing.');
      }

      // Step 3: Publish container
      this.log(`Step 3: Publishing media container ${containerId}...`);
      const publishEndpoint = `https://graph.facebook.com/${graphVersion}/${accountId}/media_publish`;
      const pubRes = await fetch(publishEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: accessToken
        })
      });

      const pubData = await pubRes.json();
      if (!pubRes.ok || !pubData.id) {
        throw new Error(`Publish execution failed: ${JSON.stringify(pubData)}`);
      }

      publishReport.status = 'published_live';
      publishReport.publishedId = pubData.id;
      this.log(`Successfully published to Instagram! Post ID: ${pubData.id}`, 'success');

      // Save record to published history
      const receiptFile = path.join(publishedDir, `published_${pubData.id}.json`);
      fs.writeFileSync(receiptFile, JSON.stringify({ item, pubData, publishedAt: new Date().toISOString() }, null, 2));

      this.eventBus.emit('marketing:published', publishReport);
      return publishReport;
    } catch (err) {
      this.log(`Live Instagram publish failed: ${err.message}`, 'error');
      publishReport.status = 'error';
      publishReport.error = err.message;
      throw err;
    }
  }

  calculateOptimalPostingTime() {
    const now = new Date();
    const lunchWindow = new Date(now);
    lunchWindow.setHours(12, 30, 0, 0);

    const dinnerWindow = new Date(now);
    dinnerWindow.setHours(19, 30, 0, 0);

    if (now < lunchWindow) return lunchWindow.toISOString();
    if (now < dinnerWindow) return dinnerWindow.toISOString();

    const tomorrowLunch = new Date(lunchWindow);
    tomorrowLunch.setDate(tomorrowLunch.getDate() + 1);
    return tomorrowLunch.toISOString();
  }
}

module.exports = InstagramPublisherAgent;

function personCard(p){
  const on = state.follows.includes(p.id);
  return `<article class="card appleGlassCard friendCard" id="friend-${esc(p.id)}">
    <div class="socialUser">
      <div class="avatar">${p.avatar}</div>
      <div class="friendInfo">
        <h3>${esc(p.name)}</h3>
        <p class="friendMeta">${esc(p.city)} · <span class="tasteMatchBadge">⚡ ${p.match}% Match</span></p>
      </div>
      <button type="button" class="btn follow ${on?'on':''}" data-action="follow" data-person-id="${esc(p.id)}">${on?'Following ✓':'Connect +'}</button>
    </div>
    <p class="feedNote friendBio">${esc(p.bio)}</p>
    <div class="tags"><span class="tag">${esc(p.taste)}</span></div>
  </article>`;
}

function social(){
  const city = cityName();
  const followsCount = state.follows ? state.follows.length : 0;
  document.getElementById('root').innerHTML = `
    <section class="screen social-screen" id="friendsCircleScreen">
      <!-- 1. Apple Glass Coming Soon Banner -->
      <div class="friendsHeroCard appleGlassCard">
        <div class="comingSoonBannerRow">
          <div class="comingSoonPill">
            <span class="comingSoonDot"></span>
            <span>COMING SOON · INTERACTIVE PREVIEW</span>
          </div>
          <span class="navBetaPill">V2 PREVIEW</span>
        </div>
        <h1>Palateo Friends Circle</h1>
        <p class="friendsHeroSubtitle">Connect with local food lovers in ${esc(city)} who share your culinary DNA. Compare palates before booking group dinners, join curated food crawls, and see verified taste receipts. Preview the experience below while we prepare the full release!</p>
        
        <div class="statGrid friendsStatsGrid">
          <div class="stat appleGlassStat">
            <b>${people.length}</b>
            <span>Foodie Profiles</span>
          </div>
          <div class="stat appleGlassStat">
            <b>${followsCount}</b>
            <span>Your Connections</span>
          </div>
          <div class="stat appleGlassStat">
            <b>4</b>
            <span>Active Food Crawls</span>
          </div>
        </div>
      </div>

      <!-- 2. Interactive Food Crawls Section (From FriendsCircleScreen.kt) -->
      <div class="section friendsSectionHeader">
        <div>
          <h2>Shared Food Crawls</h2>
          <span class="sectionSubtext">Group culinary adventures in ${esc(city)}</span>
        </div>
        <span class="previewBadge">Community Preview</span>
      </div>
      <div class="foodCrawlsGrid">
        <div class="card appleGlassCard foodCrawlCard">
          <div class="crawlHeader">
            <span class="crawlEmoji">🌙</span>
            <div class="crawlTitleWrap">
              <h3>Old City Midnight Savory & Sweet Crawl</h3>
              <p class="crawlMeta">4 Stops · 10:30 PM - 1:00 AM · Heritage Quarter</p>
            </div>
          </div>
          <p class="crawlDesc">From historic spiced pav and bun maska to hot jalebi-fafda and saffron kulfi under the stars.</p>
          <div class="crawlFooter">
            <span class="crawlParticipants">👥 6 food lovers joined</span>
            <button type="button" class="btn secondary crawlJoinBtn" onclick="alert('Food Crawls are coming soon in the Palateo V2 release! You will be notified when spots open.')">Join Crawl (Preview)</button>
          </div>
        </div>

        <div class="card appleGlassCard foodCrawlCard">
          <div class="crawlHeader">
            <span class="crawlEmoji">☕</span>
            <div class="crawlTitleWrap">
              <h3>Sunday Morning Specialty Coffee & Sourdough Trail</h3>
              <p class="crawlMeta">3 Stops · 9:00 AM - 12:00 PM · Cafe Quarter</p>
            </div>
          </div>
          <p class="crawlDesc">Exploring anaerobic single-origin pour-overs, flaky almond croissants, and wood-fired breakfast sourdough.</p>
          <div class="crawlFooter">
            <span class="crawlParticipants">👥 4 food lovers joined</span>
            <button type="button" class="btn secondary crawlJoinBtn" onclick="alert('Food Crawls are coming soon in the Palateo V2 release! You will be notified when spots open.')">Join Crawl (Preview)</button>
          </div>
        </div>
      </div>

      <!-- 3. Close Taste Matches Section -->
      <div class="section friendsSectionHeader">
        <div>
          <h2>Close Palate Matches in ${esc(city)}</h2>
          <span class="sectionSubtext">Discover people whose taste profiles align with yours</span>
        </div>
        <span class="previewBadge">Live Profiles</span>
      </div>
      <div class="peopleGrid">${people.map(personCard).join('')}</div>

      <!-- 4. More Ways to Explore -->
      <div class="section friendsSectionHeader">
        <div>
          <h2>Coming in Palateo V2</h2>
          <span class="sectionSubtext">Social dining features currently in development</span>
        </div>
        <span class="previewBadge">In Development</span>
      </div>
      <div class="peopleGrid">
        <div class="card appleGlassCard comingSoonFeatureCard">
          <div class="featureIcon">⚔️</div>
          <h3>Palate Clash · Group Dining Solver</h3>
          <p class="feedNote">Compare palates with friends or your partner before booking to find the exact sweet spot restaurant where everyone's dietary needs and flavor preferences are met.</p>
          <span class="featureTag">Palate Clash · Previewing</span>
        </div>
        <div class="card appleGlassCard comingSoonFeatureCard">
          <div class="featureIcon">📚</div>
          <h3>Collaborative Taste Lists</h3>
          <p class="feedNote">Build and share living lists like “Hidden Sourdough Gems” or “Late Night Spice Runs” with friends across Indian metros.</p>
          <span class="featureTag">Shared Lists · Previewing</span>
        </div>
      </div>
    </section>
  `;
}


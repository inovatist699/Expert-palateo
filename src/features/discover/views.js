let popularViewMode = 'spots';

function setPopularViewMode(mode){
  popularViewMode = mode;
  const btnSpots = document.getElementById('viewModeSpots');
  const btnTrails = document.getElementById('viewModeTrails');
  const spotsSec = document.getElementById('popularSpotsSection');
  const trailsSec = document.getElementById('popularTrailsSection');
  if(btnSpots){
    btnSpots.classList.toggle('active', mode==='spots');
    btnSpots.setAttribute('aria-pressed', String(mode==='spots'));
  }
  if(btnTrails){
    btnTrails.classList.toggle('active', mode==='trails');
    btnTrails.setAttribute('aria-pressed', String(mode==='trails'));
  }
  if(spotsSec) spotsSec.style.display = mode==='spots' ? 'block' : 'none';
  if(trailsSec) trailsSec.style.display = mode==='trails' ? 'block' : 'none';
}

function selectCuratedTrail(cuisineFilter){
  setPopularViewMode('spots');
  setDiscoverCuisine(cuisineFilter);
}

function discover(){
  const city = cityName();
  const totalSpots = ranked().length;
  document.getElementById('root').innerHTML = `
    <section class="screen discover-screen" id="curatedPopularScreen">
      <!-- 1. Apple Glass Top Header -->
      <div class="popularTopHeader appleGlassCard">
        <div class="popularTitleRow">
          <div class="popularIconFlame" aria-hidden="true">🔥</div>
          <div>
            <h1>Popular in ${esc(city)}</h1>
            <p class="popularSubtitle">${totalSpots} dining places listed on palateo.in/app</p>
          </div>
        </div>

        <!-- 2. View Mode Switcher: Trending Spots vs Curated Trails -->
        <div class="popularViewModeSwitcher" role="group" aria-label="Choose popular view mode">
          <button type="button" class="viewTab ${popularViewMode==='spots'?'active':''}" id="viewModeSpots" aria-pressed="${popularViewMode==='spots'}" onclick="setPopularViewMode('spots')">🔥 Trending Spots</button>
          <button type="button" class="viewTab ${popularViewMode==='trails'?'active':''}" id="viewModeTrails" aria-pressed="${popularViewMode==='trails'}" onclick="setPopularViewMode('trails')">🎪 Curated Trails</button>
        </div>
      </div>

      <!-- 3. Curated Trails Section -->
      <div id="popularTrailsSection" class="popularTrailsSection" style="display:${popularViewMode==='trails'?'block':'none'};">
        <div class="section">
          <div>
            <h2>Signature Culinary Trails</h2>
            <span class="sectionSubtext">Handcrafted walking & dining journeys in ${esc(city)}</span>
          </div>
          <span class="previewBadge">Curated</span>
        </div>
        <div class="curatedTrailsList">
          <div class="card appleGlassCard trailCard" onclick="selectCuratedTrail('Cafe')">
            <div class="trailHeader">
              <span class="trailIcon">☕</span>
              <div class="trailInfo">
                <h3>Specialty Coffee & Artisan Roastery Crawl</h3>
                <p class="trailMeta">5 Stops · Pour-overs, Aeropress, Cold Brews & Sourdough</p>
              </div>
            </div>
            <p class="trailDesc">Hand-picked specialty cafes with single-origin beans, precision roasts, and quiet courtyards.</p>
            <div class="trailActions">
              <span class="trailPill">Specialty Brews</span>
              <button type="button" class="btn primary trailExploreBtn">Explore Spots (${ranked().filter(r=>[...(r.c||[]),...(r.t||[])].some(c=>/cafe|coffee/i.test(c))).length}) →</button>
            </div>
          </div>

          <div class="card appleGlassCard trailCard" onclick="selectCuratedTrail('Dessert')">
            <div class="trailHeader">
              <span class="trailIcon">🥐</span>
              <div class="trailInfo">
                <h3>Artisan Bakeries & French Patisserie Walk</h3>
                <p class="trailMeta">4 Stops · Laminated Croissants, Macarons & Sourdough</p>
              </div>
            </div>
            <p class="trailDesc">Flaky 72-hour cultured butter viennoiserie, craft chocolate desserts, and warm brioche.</p>
            <div class="trailActions">
              <span class="trailPill">Bakery & Patisserie</span>
              <button type="button" class="btn primary trailExploreBtn">Explore Spots (${ranked().filter(r=>[...(r.c||[]),...(r.t||[])].some(c=>/bakery|dessert|sweet/i.test(c))).length}) →</button>
            </div>
          </div>

          <div class="card appleGlassCard trailCard" onclick="selectCuratedTrail('Italian')">
            <div class="trailHeader">
              <span class="trailIcon">🍕</span>
              <div class="trailInfo">
                <h3>Woodfired Sourdough Pizza & Handcrafted Pasta</h3>
                <p class="trailMeta">4 Stops · San Marzano, Fresh Burrata & Handmade Gnocchi</p>
              </div>
            </div>
            <p class="trailDesc">Charred blistered crusts, Italian cheeses, and comforting traditional pasta dishes.</p>
            <div class="trailActions">
              <span class="trailPill">Woodfired & Italian</span>
              <button type="button" class="btn primary trailExploreBtn">Explore Spots (${ranked().filter(r=>[...(r.c||[]),...(r.t||[])].some(c=>/italian|pizza|pasta/i.test(c))).length}) →</button>
            </div>
          </div>

          <div class="card appleGlassCard trailCard" onclick="selectCuratedTrail('Gujarati')">
            <div class="trailHeader">
              <span class="trailIcon">👑</span>
              <div class="trailInfo">
                <h3>Heritage Regional & Iconic Thali Experience</h3>
                <p class="trailMeta">5 Stops · Royal Feasts, Farsan, Kathiyawadi & Historic Flavors</p>
              </div>
            </div>
            <p class="trailDesc">Time-honored multi-course regional dining celebrated across generations.</p>
            <div class="trailActions">
              <span class="trailPill">Heritage Regional</span>
              <button type="button" class="btn primary trailExploreBtn">Explore Spots (${ranked().filter(r=>[...(r.c||[]),...(r.t||[])].some(c=>/gujarati|thali|regional/i.test(c))).length}) →</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Trending Spots Section -->
      <div id="popularSpotsSection" class="popularSpotsSection" style="display:${popularViewMode==='spots'?'block':'none'};">
        ${travelRangeNote()}
        <div class="discoverTools">
          <input class="search" id="q" aria-label="Search restaurants" placeholder="Restaurant, cuisine, area…" value="${esc(discoverQuery)}" data-action="filter">
          <label class="sortControl">Sort by
            <select id="discoverSort" aria-label="Sort restaurants" data-action="sort">
              <option value="match">Best match</option>
              <option value="rating">Top rated</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>

        <div class="filterChips" role="group" aria-label="Filter by cuisine or place type">
          <button type="button" class="filterChip ${discoverCuisine==='all'?'active':''}" id="filter-all" aria-pressed="${discoverCuisine==='all'}" data-action="cuisine" data-cuisine="all">All Popular</button>
          <button type="button" class="filterChip ${discoverCuisine==='Cafe'?'active':''}" id="filter-cafe" aria-pressed="${discoverCuisine==='Cafe'}" data-action="cuisine" data-cuisine="Cafe">☕ Cafés</button>
          <button type="button" class="filterChip ${discoverCuisine==='Dessert'?'active':''}" id="filter-dessert" aria-pressed="${discoverCuisine==='Dessert'}" data-action="cuisine" data-cuisine="Dessert">🥖 Bakeries</button>
          <button type="button" class="filterChip ${discoverCuisine==='Italian'?'active':''}" id="filter-italian" aria-pressed="${discoverCuisine==='Italian'}" data-action="cuisine" data-cuisine="Italian">🍕 Pizza & Italian</button>
          <button type="button" class="filterChip ${discoverCuisine==='Gujarati'?'active':''}" id="filter-gujarati" aria-pressed="${discoverCuisine==='Gujarati'}" data-action="cuisine" data-cuisine="Gujarati">🍽️ Regional</button>
          <button type="button" class="filterChip ${discoverCuisine==='Restaurant'?'active':''}" id="filter-restaurant" aria-pressed="${discoverCuisine==='Restaurant'}" data-action="cuisine" data-cuisine="Restaurant">🍷 Fine Dining</button>
          <button type="button" class="filterChip ${discoverCuisine==='Fast food'?'active':''}" id="filter-fast-food" aria-pressed="${discoverCuisine==='Fast food'}" data-action="cuisine" data-cuisine="Fast food">🍢 Quick Bites</button>
        </div>

        <div class="section discoverSummary">
          <h2>Trending Spots in ${esc(city)}</h2>
          <span id="resultCount"></span>
        </div>
        <div id="list" class="restaurantGrid"></div>
      </div>
    </section>
  `;
  drawDiscover();
}

function setDiscoverCuisine(cuisine){
  discoverCuisine=cuisine;
  document.querySelectorAll('.filterChip').forEach(button=>{
    const selected=button.id==='filter-'+(cuisine==='all'?'all':String(cuisine).toLowerCase().replace(/[^a-z0-9]+/g,'-'));
    button.classList.toggle('active',selected);
    button.setAttribute('aria-pressed',String(selected));
  });
  drawDiscover();
}

function drawDiscover(query){
  const input=document.getElementById('q'),list=document.getElementById('list');
  if(!list)return;
  if(query!==undefined)discoverQuery=String(query??'');
  const raw=String(query??input?.value??discoverQuery).trim(),needle=raw.toLowerCase(),sort=document.getElementById('discoverSort')?.value||'match';
  let matches=ranked().filter(r=>{
    const searchable=[r.name,r.area,r.address,r.city,...(r.c||[]),...(r.t||[])].filter(Boolean).join(' ').toLowerCase();
    const textMatches=!needle||searchable.includes(needle);
    const cuisineMatches=discoverCuisine==='all'||[...(r.c||[]),...(r.t||[])].some(c=>String(c).toLowerCase().includes(discoverCuisine.toLowerCase()));
    return textMatches&&cuisineMatches;
  });
  if(sort==='rating')matches.sort((a,b)=>(b.rating??-1)-(a.rating??-1)||b.score-a.score);
  if(sort==='name')matches.sort((a,b)=>a.name.localeCompare(b.name));
  list.innerHTML=matches.length?matches.map(card).join(''):'<div class="empty"><h2>No places found</h2><p>Try another search or clear a filter to see more '+esc(cityName())+'-area places.</p></div>';
  const count=document.getElementById('resultCount');
  if(count)count.textContent=matches.length===1?'1 place':matches.length+' places';
  if(searchEventTimer)clearTimeout(searchEventTimer);
  if(currentUser&&raw)searchEventTimer=setTimeout(()=>logEvent('search',{query_length:Math.min(raw.length,120),results:matches.length}),700);
}

function filter(query){drawDiscover(query)}


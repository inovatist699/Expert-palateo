function home(){
const allRanked=ranked();
let filtered=allRanked;
const visitedCount=allRanked.filter(r=>state.feedback[r.id]==='visited').length;

if(homeCuisine!=='all'){
  filtered=allRanked.filter(r=>{
    if(homeCuisine==='Visited') return state.feedback[r.id]==='visited';
    if(homeCuisine==='Saved') return state.saves.includes(r.id);
    if(homeCuisine==='Open Now') return true;
    const pool=[...(r.c||[]),...(r.t||[])].map(x=>String(x).toLowerCase());
    if(homeCuisine==='Cafe')return pool.some(x=>x.includes('cafe')||x.includes('coffee'));
    if(homeCuisine==='Dessert')return pool.some(x=>x.includes('dessert')||x.includes('ice cream')||x.includes('gelato')||x.includes('kulfi')||x.includes('bakery')||x.includes('sweet'));
    if(homeCuisine==='Gujarati')return pool.some(x=>x.includes('gujarati')||x.includes('thali')||x.includes('kathiyawadi'));
    if(homeCuisine==='Italian')return pool.some(x=>x.includes('italian')||x.includes('pizza')||x.includes('pasta'));
    if(homeCuisine==='Fine dining')return (r.p==='1000_2000'||r.p==='2000_plus')||pool.some(x=>x.includes('premium')||x.includes('fine dining'));
    return pool.some(x=>x.includes(homeCuisine.toLowerCase()));
  });
}

function resolveCalloutText(spot, city){
  const dishes = (spot && typeof resolveBestDishes === 'function') ? resolveBestDishes(spot) : [];
  if (dishes.length && dishes[0].name) return `gotta try the ${dishes[0].name.toLowerCase()}!`;
  if (city === 'Vadodara') return 'gotta get hot sev usal & dalwada!';
  if (city === 'Ahmedabad') return 'gotta try the artisan pour-over & maska bun!';
  if (city === 'Mumbai') return 'gotta get a spicy Sicilian slice!';
  if (city === 'Delhi NCR' || city === 'Delhi') return 'gotta try the fluffy Himalayan pancakes!';
  if (city === 'Bengaluru') return 'gotta get benne dosa & estate filter kaapi!';
  return 'gotta get a spicy Sicilian slice!';
}

if(minMatchThreshold>0){
  filtered=filtered.filter(r=>r.score>=minMatchThreshold);
}

if(adventureMode==='discover'){
  filtered=[...filtered].sort((a,b)=>{
    const aGem=(a.rating>=4.5&&(a.review_count||0)<2000)?1:0;
    const bGem=(b.rating>=4.5&&(b.review_count||0)<2000)?1:0;
    return (bGem*15+b.score)-(aGem*15+a.score);
  });
} else if(adventureMode==='familiar'){
  filtered=[...filtered].sort((a,b)=>{
    return (((b.review_count||0)>3000?10:0)+b.score) - (((a.review_count||0)>3000?10:0)+a.score);
  });
}

if(promptQuery.trim()){
  const terms=promptQuery.toLowerCase().split(/\s+/).filter(t=>t.length>1);
  filtered=filtered.filter(r=>{
    const dishes=typeof resolveBestDishes==='function'?resolveBestDishes(r):[];
    const textPool=[
      r.name, r.area, r.city,
      ...(r.c||[]), ...(r.t||[]), ...(r.a||[]), ...(r.o||[]),
      ...(r.review_insights||[]),
      r.why?.join(' '),
      ...dishes.map(d=>d.name+' '+d.category+' '+(d.description||''))
    ].join(' ').toLowerCase();
    return terms.some(t=>textPool.includes(t));
  });
}

const topPick=filtered[0];
const selectedIndex=filtered.findIndex(r=>r.id===selectedPinId);
if(selectedIndex>=homeLimit)homeLimit=selectedIndex+1;
const rs=filtered.slice(0,homeLimit);
const showMoreButton=(homeView!=='dishes'&&filtered.length>rs.length)?`<div class="homeMoreAction"><button class="btn secondary" type="button" data-action="load-more-home">Show more recommendations (${filtered.length-rs.length} more) ↓</button></div>`:'';

const viewTabs=`<div class="viewSwitcher" role="group" aria-label="Choose recommendation view">
<button type="button" class="viewTab ${homeView==='map'?'active':''}" aria-pressed="${homeView==='map'}" data-action="home-view" data-view="map">🗺️ 3D Palate Map</button>
<button type="button" class="viewTab ${homeView==='feed'?'active':''}" aria-pressed="${homeView==='feed'}" data-action="home-view" data-view="feed">🍱 Studio Cards</button>
<button type="button" class="viewTab ${homeView==='dishes'?'active':''}" aria-pressed="${homeView==='dishes'}" data-action="home-view" data-view="dishes">⭐ Best Dishes</button>
<button type="button" class="viewTab ${homeView==='trails'?'active':''}" aria-pressed="${homeView==='trails'}" data-action="home-view" data-view="trails">🎪 Food Trails</button>
</div>`;

const studioControlBar=`<div class="studioControlBar">
  <div class="studioHeaderRow">
    <div class="studioModelPill" title="Google AI Studio Gemini 3.5 Flash Model Active">
      <span class="studioLiveDot"></span>
      <span class="studioModelName">Google AI Studio · Gemini 3.5 Flash</span>
      <span class="studioModelStatus">Active</span>
    </div>
    <div class="studioMetaStats">
      <span class="studioStatChip">T: 0.7</span>
      <span class="studioStatChip">Vectors: ${allRanked.length} spots</span>
      <button type="button" class="studioTunerToggleBtn ${studioTunerOpen?'active':''}" data-action="toggle-tuner" aria-label="Toggle parameter tuning console" aria-expanded="${studioTunerOpen}">
        <svg class="smallIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6"/></svg>
        <span>Parameters</span>
      </button>
    </div>
  </div>

  ${studioTunerOpen?`
  <div class="studioTunerPanel" id="studioTunerPanel">
    <div class="tunerGrid">
      <div class="tunerGroup">
        <label class="tunerLabel">Min Palate Fit: <strong>${minMatchThreshold>0 ? minMatchThreshold+'%+' : 'All Matches'}</strong></label>
        <div class="tunerPills" role="group" aria-label="Filter minimum match percentage">
          <button type="button" class="tunerPill ${minMatchThreshold===0?'active':''}" data-action="set-min-match" data-val="0">All</button>
          <button type="button" class="tunerPill ${minMatchThreshold===60?'active':''}" data-action="set-min-match" data-val="60">60%+</button>
          <button type="button" class="tunerPill ${minMatchThreshold===75?'active':''}" data-action="set-min-match" data-val="75">75%+ (Strict)</button>
          <button type="button" class="tunerPill ${minMatchThreshold===85?'active':''}" data-action="set-min-match" data-val="85">85%+ (Elite)</button>
        </div>
      </div>
      <div class="tunerGroup">
        <label class="tunerLabel">Adventure Dial: <strong>${adventureMode==='discover'?'Hidden Gems':adventureMode==='familiar'?'Familiar Comforts':'Balanced'}</strong></label>
        <div class="tunerPills" role="group" aria-label="Discovery sampling mode">
          <button type="button" class="tunerPill ${adventureMode==='balanced'?'active':''}" data-action="set-adventure" data-mode="balanced">Balanced</button>
          <button type="button" class="tunerPill ${adventureMode==='familiar'?'active':''}" data-action="set-adventure" data-mode="familiar">Familiar</button>
          <button type="button" class="tunerPill ${adventureMode==='discover'?'active':''}" data-action="set-adventure" data-mode="discover">Explore Gems</button>
        </div>
      </div>
    </div>
  </div>`:''}

  <div class="studioPromptConsole">
    <div class="studioPromptInputWrapper">
      <span class="studioPromptSparkle" aria-hidden="true">✦</span>
      <input type="text" class="studioPromptInput" id="studioPromptInput" placeholder="Prompt your palate: e.g. 'Pour over & sourdough' or 'Quiet work cafe with wifi'..." value="${esc(promptQuery)}" data-action="prompt-input" aria-label="Palate AI Prompt">
      ${promptQuery?`<button type="button" class="studioPromptClearBtn" data-action="clear-prompt" aria-label="Clear prompt">✕</button>`:''}
      <button type="button" class="studioPromptRunBtn" data-action="run-prompt" aria-label="Run prompt search">Run ↵</button>
    </div>
    <div class="studioPromptChips" role="group" aria-label="Quick prompt templates">
      <button type="button" class="promptChip ${promptQuery==='Specialty Coffee & Sourdough'?'active':''}" data-action="apply-prompt" data-prompt="Specialty Coffee & Sourdough">☕ Specialty Coffee & Sourdough</button>
      <button type="button" class="promptChip ${promptQuery==='Quiet Work Cafe'?'active':''}" data-action="apply-prompt" data-prompt="Quiet Work Cafe">🌿 Quiet Work Cafe</button>
      <button type="button" class="promptChip ${promptQuery==='Woodfired Pizza & Pasta'?'active':''}" data-action="apply-prompt" data-prompt="Woodfired Pizza & Pasta">🍕 Woodfired Pizza</button>
      <button type="button" class="promptChip ${promptQuery==='Romantic Date Night'?'active':''}" data-action="apply-prompt" data-prompt="Romantic Date Night">🍸 Romantic Date Night</button>
      <button type="button" class="promptChip ${promptQuery==='Authentic Regional Thali'?'active':''}" data-action="apply-prompt" data-prompt="Authentic Regional Thali">🌶️ Regional Thali</button>
      <button type="button" class="promptChip ${promptQuery==='Artisanal Gelato & Bakes'?'active':''}" data-action="apply-prompt" data-prompt="Artisanal Gelato & Bakes">🍨 Gelato & Bakes</button>
    </div>
  </div>
</div>`;

const filterPills=`<div class="filterChips homeFilterChips" role="group" aria-label="Filter recommendations by category">
<button type="button" class="filterChip ${homeCuisine==='all'?'active':''}" aria-pressed="${homeCuisine==='all'}" data-action="home-cuisine" data-cuisine="all">For you</button>
<button type="button" class="filterChip ${homeCuisine==='Cafe'?'active':''}" aria-pressed="${homeCuisine==='Cafe'}" data-action="home-cuisine" data-cuisine="Cafe">Cafés</button>
<button type="button" class="filterChip ${homeCuisine==='Dessert'?'active':''}" aria-pressed="${homeCuisine==='Dessert'}" data-action="home-cuisine" data-cuisine="Dessert">Desserts</button>
<button type="button" class="filterChip ${homeCuisine==='Gujarati'?'active':''}" aria-pressed="${homeCuisine==='Gujarati'}" data-action="home-cuisine" data-cuisine="Gujarati">Regional</button>
<button type="button" class="filterChip ${homeCuisine==='Italian'?'active':''}" aria-pressed="${homeCuisine==='Italian'}" data-action="home-cuisine" data-cuisine="Italian">Italian</button>
<button type="button" class="filterChip ${homeCuisine==='Fine dining'?'active':''}" aria-pressed="${homeCuisine==='Fine dining'}" data-action="home-cuisine" data-cuisine="Fine dining">Fine dining</button>
<button type="button" class="filterChip ${homeCuisine==='Visited'?'active':''}" aria-pressed="${homeCuisine==='Visited'}" data-action="home-cuisine" data-cuisine="Visited">Visited</button>
<button type="button" class="filterChip ${homeCuisine==='Saved'?'active':''}" aria-pressed="${homeCuisine==='Saved'}" data-action="home-cuisine" data-cuisine="Saved">Saved</button>
</div>`;

const selectedVenue=selectedPinId?allRanked.find(r=>r.id===selectedPinId):null;
const mappedPlaces=filtered.filter(r=>hasCoordinates(r));
const calloutText = resolveCalloutText(selectedVenue || topPick, cityName());
const calloutBanner = `<div class="zestFloatingCallout" aria-hidden="true"><div class="zestCalloutBubble"><span class="zestCalloutSparkle">✨</span><strong>${esc(calloutText)}</strong></div><div class="zestCalloutPointer"></div></div>`;
const floatingMapPills = `<div class="zestFloatingMapPills" role="group" aria-label="Quick map category filters">
  <button type="button" class="zestMapPill special" data-action="navigate" data-page="ask" title="Open Ask Palateo AI advisor">
    <span class="pillIcon">💬</span><span class="pillLabel">ask palateo</span><span class="navBetaPill">BETA</span>
  </button>
  <button type="button" class="zestMapPill special" data-action="navigate" data-page="social" title="View Friends Circle preview">
    <span class="pillIcon">👥</span><span class="pillLabel">friends</span><span class="navComingSoonPill">SOON</span>
  </button>
  <button type="button" class="zestMapPill ${homeCuisine==='Cafe'?'active':''}" data-action="home-cuisine" data-cuisine="${homeCuisine==='Cafe'?'all':'Cafe'}">
    <span class="pillIcon">☕</span><span class="pillLabel">cafes</span>
  </button>
  <button type="button" class="zestMapPill ${homeCuisine==='Dessert'?'active':''}" data-action="home-cuisine" data-cuisine="${homeCuisine==='Dessert'?'all':'Dessert'}">
    <span class="pillIcon">🥐</span><span class="pillLabel">bakeries</span>
  </button>
  <button type="button" class="zestMapPill ${homeCuisine==='Italian'?'active':''}" data-action="home-cuisine" data-cuisine="${homeCuisine==='Italian'?'all':'Italian'}">
    <span class="pillIcon">🍕</span><span class="pillLabel">pizza</span>
  </button>
  <button type="button" class="zestMapPill ${homeCuisine==='Fine dining'?'active':''}" data-action="home-cuisine" data-cuisine="${homeCuisine==='Fine dining'?'all':'Fine dining'}">
    <span class="pillIcon">🍷</span><span class="pillLabel">fine dine</span>
  </button>
  <button type="button" class="zestMapPill ${homeCuisine==='Open Now'?'active':''}" data-action="home-cuisine" data-cuisine="${homeCuisine==='Open Now'?'all':'Open Now'}">
    <span class="pillIcon">🟢</span><span class="pillLabel">open now</span>
  </button>
</div>`;

const discoverySheetHeader = `<div class="zestBottomDiscoverySheetHeader">
  <div class="sheetDragHandle" aria-hidden="true"><span class="sheetPillBar"></span></div>
  <div class="sheetCityPickerRow">
    <div class="sheetCityTag">
      <span class="sheetCityIcon">📍</span>
      <span class="sheetCityLabel">${esc(cityName())}</span>
      <span class="sheetSpotCount">(${filtered.length} spots)</span>
    </div>
    <div class="sheetQuickSearch">
      <input type="text" class="sheetSearchInput" placeholder="Quick filter ${esc(cityName())}..." value="${esc(promptQuery)}" data-action="prompt-input" aria-label="Quick search in ${esc(cityName())}">
    </div>
  </div>
</div>`;

const mapComponent=`<div class="zestMapContainer" id="zestMapContainer"><div class="zestMapStage ${map3d?'is3d':''}" id="zestMapStage"><div class="homeMapToolbar">${viewTabs}<button type="button" class="homeSearch" data-action="navigate" data-page="discover" aria-label="Search restaurants in ${esc(cityName())}"><svg class="smallIcon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><span>Search</span></button></div>${floatingMapPills}${calloutBanner}<div class="zestMapLegend"><span><i style="background:#20373b"></i> 80%+ match</span><span><i style="background:#ffc64f"></i> Visited</span><span><i style="background:#519cab"></i> Saved</span></div>${renderZestMapSvg(mappedPlaces,cityName(),selectedPinId)}<div class="zestMapControls"><button type="button" class="zestMapBtn zestMapBtn3d ${map3d?'active':''}" data-action="toggle-3d" aria-label="Toggle map perspective" aria-pressed="${map3d}" title="${map3d?'Switch to flat view':'Switch to perspective view'}">${map3d?'3D':'2D'}</button><button type="button" class="zestMapBtn" data-action="zoom-in" aria-label="Zoom in">+</button><button type="button" class="zestMapBtn" data-action="zoom-out" aria-label="Zoom out">−</button><button type="button" class="zestMapBtn" data-action="zoom-reset" aria-label="Reset zoom"><svg class="smallIcon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6"/><path d="M12 2v5m0 10v5M2 12h5m10 0h5"/></svg></button></div></div>${selectedVenue?renderZestSheet(selectedVenue):''}<p class="mapNotice">${mappedPlaces.length} places mapped · ${visitedCount} visited. Illustrative area overview; use Directions for navigation.</p></div>`;

const emptyMessage=homeCuisine==='Visited'
  ?'<div class="empty"><h2>Your Dining Map is waiting</h2><p>Tap “I visited” on places you’ve tried in '+esc(cityName())+' to automatically build your personal dining map.</p></div>'
  :homeCuisine==='Saved'
  ?'<div class="empty"><h2>No saved spots yet</h2><p>Tap “Save” on any restaurant to pin your shortlist to your Palate Map.</p></div>'
  :'<div class="empty"><h2>No matches in this category</h2><p>Try switching to “For you” or adjusting your taste preferences in your Palate tab.</p></div>';

const cardsContent=rs.length?rs.map(card).join(''):emptyMessage;

let mainContent='';
if(homeView==='map'){
  mainContent=`${mapComponent}<div class="homeRecommendations">${discoverySheetHeader}<div class="section"><h1>For you</h1>${topPick?`<div class="confidence">${topPick.score}%<small> top taste match</small></div>`:`<span>${filtered.length} places</span>`}</div>${filterPills}<div class="restaurantGrid" aria-label="Recommendations for your taste">${cardsContent}</div>${showMoreButton}${travelRangeNote()}<p class="homeEstimateNote">Matches are estimates from your taste quiz and feedback.</p></div>`;
} else if(homeView==='dishes'){
  mainContent=`<div class="homeListToolbar">${viewTabs}<button type="button" class="homeSearch" data-action="navigate" data-page="discover">Search places</button></div><div class="homeRecommendations"><div class="section"><h1>⭐ Best Dishes & Cafe Highlights</h1><span>${filtered.length} curated venues in ${esc(cityName())}</span></div>${renderBestDishesShowcase(filtered)}</div>`;
} else if(homeView==='trails'){
  mainContent=`<div class="homeListToolbar">${viewTabs}<button type="button" class="homeSearch" data-action="navigate" data-page="discover">Search places</button></div><div class="homeRecommendations">${typeof renderCuratedTrails==='function'?renderCuratedTrails(filtered):''}</div>`;
} else {
  mainContent=`<div class="homeListToolbar">${viewTabs}<button type="button" class="homeSearch" data-action="navigate" data-page="discover">Search places</button></div><div class="homeRecommendations"><div class="section"><h1>For you</h1>${topPick?`<div class="confidence">${topPick.score}%<small> top taste match</small></div>`:`<span>${filtered.length} places</span>`}</div>${filterPills}<div class="restaurantGrid" aria-label="Recommendations for your taste">${cardsContent}</div>${showMoreButton}${travelRangeNote()}<p class="homeEstimateNote">Matches are estimates from your taste quiz and feedback.</p></div>`;
}

document.getElementById('root').innerHTML=`<section class="screen home-screen ${homeView==='map'?'homeMapView':'homeListView'}">${studioControlBar}${mainContent}</section>`;
}
function summaryChips(){let a=state.answers||{};return [...preferredCuisines(a).map(x=>cuisineLabels[x]||x),a.diet&&a.diet!=='any'?dietLabel(a.diet):null,a.budget?price(a.budget):null,...preferredVibes(a),a.spice].filter(Boolean).map(x=>`<span class="chip">${esc(x)}</span>`).join('')}

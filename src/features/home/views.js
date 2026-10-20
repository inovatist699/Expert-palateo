function home(){
const allRanked=ranked();
const topPick=allRanked[0];
let filtered=allRanked;
const visitedCount=allRanked.filter(r=>state.feedback[r.id]==='visited').length;
if(homeCuisine!=='all'){
  filtered=allRanked.filter(r=>{
    if(homeCuisine==='Visited') return state.feedback[r.id]==='visited';
    if(homeCuisine==='Saved') return state.saves.includes(r.id);
    const pool=[...(r.c||[]),...(r.t||[])].map(x=>String(x).toLowerCase());
    if(homeCuisine==='Cafe')return pool.some(x=>x.includes('cafe')||x.includes('coffee'));
    if(homeCuisine==='Dessert')return pool.some(x=>x.includes('dessert')||x.includes('ice cream')||x.includes('gelato')||x.includes('kulfi')||x.includes('bakery')||x.includes('sweet'));
    if(homeCuisine==='Gujarati')return pool.some(x=>x.includes('gujarati')||x.includes('thali')||x.includes('kathiyawadi'));
    if(homeCuisine==='Italian')return pool.some(x=>x.includes('italian')||x.includes('pizza')||x.includes('pasta'));
    if(homeCuisine==='Fine dining')return (r.p==='1000_2000'||r.p==='2000_plus')||pool.some(x=>x.includes('premium')||x.includes('fine dining'));
    return pool.some(x=>x.includes(homeCuisine.toLowerCase()));
  });
}
const selectedIndex=filtered.findIndex(r=>r.id===selectedPinId);
if(selectedIndex>=homeLimit)homeLimit=selectedIndex+1;
const rs=homeView==='map'?filtered:filtered.slice(0,homeLimit);
const showMoreButton=filtered.length>rs.length?`<div class="homeMoreAction"><button class="btn secondary" type="button" data-action="load-more-home">Show more recommendations (${filtered.length-rs.length} more) ↓</button></div>`:'';

const viewTabs=`<div class="viewSwitcher" role="group" aria-label="Choose recommendation view">
<button type="button" class="viewTab ${homeView==='map'?'active':''}" aria-pressed="${homeView==='map'}" data-action="home-view" data-view="map">Map</button>
<button type="button" class="viewTab ${homeView==='feed'?'active':''}" aria-pressed="${homeView==='feed'}" data-action="home-view" data-view="feed">Full list</button>
</div>`;

const filterPills=`<div class="filterChips homeFilterChips" role="group" aria-label="Filter recommendations by category">
<button type="button" class="filterChip ${homeCuisine==='all'?'active':''}" aria-pressed="${homeCuisine==='all'}" data-action="home-cuisine" data-cuisine="all">All places</button>
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
const mapComponent=`<div class="zestMapContainer" id="zestMapContainer"><div class="zestMapStage" id="zestMapStage"><div class="homeMapToolbar">${viewTabs}<button type="button" class="homeSearch" data-action="navigate" data-page="discover" aria-label="Search restaurants in ${esc(cityName())}"><svg class="smallIcon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><span>Search</span></button></div><div class="zestMapLegend"><span><i style="background:#20373b"></i> 80%+ match</span><span><i style="background:#ffc64f"></i> Visited</span><span><i style="background:#519cab"></i> Saved</span></div>${renderStreetMap(mappedPlaces)}<div class="zestMapControls"><button type="button" class="zestMapBtn" data-action="zoom-in" aria-label="Zoom in">+</button><button type="button" class="zestMapBtn" data-action="zoom-out" aria-label="Zoom out">−</button><button type="button" class="zestMapBtn" data-action="zoom-reset" aria-label="Reset zoom"><svg class="smallIcon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6"/><path d="M12 2v5m0 10v5M2 12h5m10 0h5"/></svg></button></div></div>${selectedVenue?renderZestSheet(selectedVenue):''}<p class="mapNotice">${mappedPlaces.length} places mapped · ${visitedCount} visited. Illustrative area overview; use Directions for navigation.</p></div>`;

const emptyMessage=pureVegOnly?'<div class="empty"><h2>No listed pure veg matches</h2><p>Try another category or turn off Pure veg. Your dietary preference and travel range still apply.</p></div>':homeCuisine==='Visited'
  ?'<div class="empty"><h2>Your Dining Map is waiting</h2><p>Tap “I visited” on places you’ve tried in '+esc(cityName())+' to automatically build your personal dining map.</p></div>'
  :homeCuisine==='Saved'
  ?'<div class="empty"><h2>No saved spots yet</h2><p>Tap “Save” on any restaurant to pin your shortlist to your Palate Map.</p></div>'
  :'<div class="empty"><h2>No matches in this category</h2><p>Try switching to “For you” or adjusting your taste preferences in your Palate tab.</p></div>';

const cardsContent=rs.length?rs.map(card).join(''):emptyMessage;

document.getElementById('root').innerHTML=`<section class="screen home-screen ${homeView==='map'?'homeMapView':'homeListView'}">${homeView==='map'?mapComponent:`<div class="homeListToolbar">${viewTabs}<button type="button" class="homeSearch" data-action="navigate" data-page="discover">Search places</button></div>`}<div class="homeRecommendations"><div class="section"><h1>For you</h1>${topPick?`<div class="confidence">${topPick.score}%<small> top taste match</small></div>`:`<span>${filtered.length} places</span>`}</div>${filterPills}${dietaryFilterNote()}<div class="restaurantGrid" aria-label="Recommendations for your taste">${cardsContent}</div>${showMoreButton}${travelRangeNote()}<p class="homeEstimateNote">Matches are estimates from your taste quiz and feedback.</p></div></section>`
}
function summaryChips(){let a=state.answers||{};return [...preferredCuisines(a).map(x=>cuisineLabels[x]||x),a.diet&&a.diet!=='any'?dietLabel(a.diet):null,a.budget?price(a.budget):null,...preferredVibes(a),a.spice].filter(Boolean).map(x=>`<span class="chip">${esc(x)}</span>`).join('')}

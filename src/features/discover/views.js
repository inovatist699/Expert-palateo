let studioPopularTab='spots';
let studioSearchOpen=false;
function discover(){
 document.getElementById('root').innerHTML=`<section class="screen discover-screen studioPopular"><header class="studioPageHeader"><div><h1>${studioIcon('fire')} Popular in ${esc(cityName())}</h1><p>${ranked().length} food places listed on palateo.in/app</p></div>${studioCity()}</header>
 <div class="studioSegments" role="group" aria-label="Popular view"><button type="button" data-studio-popular="spots" aria-pressed="${studioPopularTab==='spots'}">${studioIcon('fire')} Popular Spots</button><button type="button" data-studio-popular="trails" aria-pressed="${studioPopularTab==='trails'}">${studioIcon('map')} Food Trails</button></div>
 <div class="studioPopularFilters" role="group" aria-label="Filter popular places">${pureVegFilterControl()}${[['all','All Popular'],['rated','★ Top Rated (4.8+)'],['Cafe','Cafés'],['Late night cafe','Late Night Cafés'],['Gujarati','Regional'],['Italian','Italian']].map(([value,label])=>`<button type="button" data-studio-filter="${value}" aria-pressed="${discoverCuisine===value}">${label}</button>`).join('')}</div>
 <div class="studioSearchToggle"><button type="button" data-studio-toggle-search aria-expanded="${studioSearchOpen}" aria-controls="studioSearchControls">${studioIcon('search')} ${studioSearchOpen?'Close search':'Search & sort'}</button></div><div id="studioSearchControls" class="discoverTools ${studioSearchOpen?'':'hide'}"><input id="q" class="search" aria-label="Search restaurants" placeholder="Search cafes, dishes, areas…" value="${esc(discoverQuery)}" data-action="filter"><select id="discoverSort" aria-label="Sort restaurants" data-action="sort"><option value="match" ${discoverSort==='match'?'selected':''}>Taste match</option><option value="distance" ${discoverSort==='distance'?'selected':''} ${userLocation?'':'disabled'}>Nearest to me</option><option value="rating" ${discoverSort==='rating'?'selected':''}>Top rated</option><option value="name" ${discoverSort==='name'?'selected':''}>Name A–Z</option></select></div>${dietaryFilterNote()}${travelRangeNote()}<div id="resultCount" class="studioResults" role="status"></div><div id="list" class="restaurantGrid"></div></section>`;
 drawDiscover();
}
function drawDiscover(query){
 const list=document.getElementById('list');if(!list)return;
 if(query!==undefined)discoverQuery=String(query??'');
 const needle=(query??document.getElementById('q')?.value??discoverQuery).trim().toLowerCase();
 let matches=ranked().filter(r=>(!needle||[r.name,r.area,...(r.c||[]),...(r.review_insights||[])].join(' ').toLowerCase().includes(needle))&&(discoverCuisine==='all'||(discoverCuisine==='rated'?r.rating>=4.8:discoverCuisine==='Late night cafe'?isLateNightCafe(r):(r.c||[]).some(c=>c.toLowerCase().includes(discoverCuisine.toLowerCase())))));
 const sort=document.getElementById('discoverSort')?.value;
 if(sort==='rating')matches.sort((a,b)=>b.rating-a.rating||compareRecommendations(a,b));
 if(sort==='distance')matches.sort((a,b)=>(a.distanceKm??Infinity)-(b.distanceKm??Infinity)||compareRecommendations(a,b));
 if(sort==='name')matches.sort((a,b)=>a.name.localeCompare(b.name));
 document.getElementById('resultCount').textContent=matches.length+' places · Matches are estimates';
 if(studioPopularTab==='trails'){
  list.innerHTML=matches.length?`<section class="studioTrail"><h2>A food trail in ${esc(cityName())}</h2><p>A suggested shortlist from your taste matches. Check opening times before heading out.</p>${matches.slice(0,3).map((r,i)=>`<div class="studioTrailStop"><b>${i+1}</b><div><h3>${esc(r.name)}</h3><p>${esc(r.area)} · ${esc(displayPrice(r))}</p></div><button type="button" data-action="open-place" data-rest-id="${esc(r.id)}">Details →</button></div>`).join('')}</section>`:'<p class="empty">No places match these filters.</p>';return;
 }
 list.innerHTML=matches.length?studioRestaurantCard(matches[0],1)+(matches.length>1?`<h2 class="studioLeaderboard">More matches in ${esc(cityName())}<small>${matches.length} places</small></h2>`:'')+matches.slice(1).map((r,i)=>studioRestaurantCard(r,i+2)).join(''):'<div class="empty"><h2>No places found</h2><p>Try another search or clear a filter.</p></div>';
}

function setDiscoverCuisine(cuisine){
discoverCuisine=cuisine;
document.querySelectorAll('[data-action="cuisine"]').forEach(button=>{const selected=button.id==='filter-'+(cuisine==='all'?'all':String(cuisine).toLowerCase().replace(/[^a-z0-9]+/g,'-'));button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected))});
drawDiscover();
}
function filter(query){drawDiscover(query)}

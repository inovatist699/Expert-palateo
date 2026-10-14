function discover(){
document.getElementById('root').innerHTML=`<section class="screen discover-screen"><div class="hero"><div class="eyebrow">A little inspiration</div><h1>Find your next favourite.</h1><p>Search cafés and restaurants in ${cityName()}. Filter by what you’re craving and see how each place fits your palate.</p></div>${travelRangeNote()}<div class="discoverTools"><input class="search" id="q" aria-label="Search restaurants" placeholder="Restaurant, cuisine, area…" value="${esc(discoverQuery)}" data-action="filter"><label class="sortControl">Sort by<select id="discoverSort" aria-label="Sort restaurants" data-action="sort"><option value="match" ${discoverSort==='match'?'selected':''}>Best match</option><option value="distance" ${discoverSort==='distance'?'selected':''} ${userLocation?'':'disabled'}>Nearest to me</option><option value="rating" ${discoverSort==='rating'?'selected':''}>Top rated</option><option value="name" ${discoverSort==='name'?'selected':''}>Name A–Z</option></select></label></div><div class="filterChips" role="group" aria-label="Filter recommendations">${pureVegFilterControl()}<button type="button" class="filterChip ${discoverCuisine==='all'?'active':''}" id="filter-all" aria-pressed="${discoverCuisine==='all'}" data-action="cuisine" data-cuisine="all">For you</button><button type="button" class="filterChip ${discoverCuisine==='Cafe'?'active':''}" id="filter-cafe" aria-pressed="${discoverCuisine==='Cafe'}" data-action="cuisine" data-cuisine="Cafe">Cafés</button><button type="button" class="filterChip ${discoverCuisine==='Dessert'?'active':''}" id="filter-dessert" aria-pressed="${discoverCuisine==='Dessert'}" data-action="cuisine" data-cuisine="Dessert">Desserts</button><button type="button" class="filterChip ${discoverCuisine==='Restaurant'?'active':''}" id="filter-restaurant" aria-pressed="${discoverCuisine==='Restaurant'}" data-action="cuisine" data-cuisine="Restaurant">Restaurants</button><button type="button" class="filterChip ${discoverCuisine==='Fast food'?'active':''}" id="filter-fast-food" aria-pressed="${discoverCuisine==='Fast food'}" data-action="cuisine" data-cuisine="Fast food">Quick bites</button><button type="button" class="filterChip ${discoverCuisine==='Food court'?'active':''}" id="filter-food-court" aria-pressed="${discoverCuisine==='Food court'}" data-action="cuisine" data-cuisine="Food court">Food courts</button><button type="button" class="filterChip ${discoverCuisine==='Gujarati'?'active':''}" id="filter-gujarati" aria-pressed="${discoverCuisine==='Gujarati'}" data-action="cuisine" data-cuisine="Gujarati">Gujarati</button><button type="button" class="filterChip ${discoverCuisine==='Italian'?'active':''}" id="filter-italian" aria-pressed="${discoverCuisine==='Italian'}" data-action="cuisine" data-cuisine="Italian">Italian</button><button type="button" class="filterChip ${discoverCuisine==='Indian'?'active':''}" id="filter-indian" aria-pressed="${discoverCuisine==='Indian'}" data-action="cuisine" data-cuisine="Indian">Indian</button></div>${dietaryFilterNote()}<div class="section discoverSummary"><h2>Rated places around ${cityName()}</h2><span id="resultCount"></span></div><div id="list" class="restaurantGrid"></div></section>`;
drawDiscover();
}
function setDiscoverCuisine(cuisine){
discoverCuisine=cuisine;
document.querySelectorAll('[data-action="cuisine"]').forEach(button=>{const selected=button.id==='filter-'+(cuisine==='all'?'all':String(cuisine).toLowerCase().replace(/[^a-z0-9]+/g,'-'));button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected))});
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
if(sort==='distance')matches.sort((a,b)=>(a.distanceKm??Infinity)-(b.distanceKm??Infinity)||compareRecommendations(a,b));
list.innerHTML=matches.length?matches.map(card).join(''):'<div class="empty"><h2>No matching places found</h2><p>Try another search or turn off a filter. Your dietary preference and travel range still apply; places without matching dietary information are hidden.</p></div>';
const count=document.getElementById('resultCount');
if(count)count.textContent=matches.length===1?'1 place':matches.length+' places';
if(searchEventTimer)clearTimeout(searchEventTimer);
if(currentUser&&raw)searchEventTimer=setTimeout(()=>logEvent('search',{query_length:Math.min(raw.length,120),results:matches.length}),700);
}
function filter(query){drawDiscover(query)}

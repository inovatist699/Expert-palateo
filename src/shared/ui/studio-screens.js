// Match the supplied mobile reference while keeping the existing state and service handlers.
const studioPaloContainer=document.getElementById('paloContainer');
const studioPaloForm=document.getElementById('paloForm');
const studioIcons={map:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2zM9 3v16M15 5v16"/>',fire:'<path d="M13 3c1 5-5 5-3 10 2-1 3-3 3-4 5 4 5 12-1 12-7 0-9-8-5-12 0 3 1 4 2 4-1-5 3-6 4-10Z"/>',friends:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6m2 4a5 5 0 0 1 2 4v2"/>',spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM21 2v4m-2-2h4"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',save:'<path d="M6 3h12v18l-6-4-6 4Z"/>',arrow:'<path d="m3 10 18-7-7 18-3-8Z"/>',check:'<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>',search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',food:'<path d="M4 3v6c0 3 6 3 6 0V3M7 3v18M20 21V3c-5 1-5 10 0 10"/>',pin:'<path d="M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/>'};
function studioIcon(name){return '<svg class="studioIcon" viewBox="0 0 24 24" aria-hidden="true">'+(studioIcons[name]||studioIcons.spark)+'</svg>'}
function studioCity(){return `<div class="studioCityControls"><div class="studioCityRow"><label class="studioCity">${studioIcon('pin')}<select aria-label="Choose city" data-action="city-select">${Object.keys(cityCenters).map(c=>`<option ${c===cityName()?'selected':''}>${esc(c)}</option>`).join('')}</select></label><button type="button" class="studioLocate" data-action="location" ${locationRequestPending?'disabled':''} aria-busy="${locationRequestPending}">${studioIcon('arrow')}<span>Use your location</span></button></div><p class="studioLocationStatus" data-location-status role="status">${esc(locationStatusMessage)}</p></div>`}
let studioPaloVisible=true;
try{studioPaloVisible=localStorage.getItem('palateo-palo-visible')!=='false'}catch{}
function studioPaloToggle(){return `<button type="button" class="studioPaloToggle" role="switch" aria-checked="${studioPaloVisible}" data-studio-palo-toggle aria-label="Show Pal-O on screen">${studioIcon('spark')}<span>Pal-O</span><i aria-hidden="true"></i></button>`}
function studioSetPaloVisible(visible){
 studioPaloVisible=visible;document.body.dataset.paloVisible=String(visible);
 try{localStorage.setItem('palateo-palo-visible',String(visible))}catch{}
 document.querySelectorAll('[data-studio-palo-toggle]').forEach(button=>button.setAttribute('aria-checked',String(visible)));
}
function studioCategory(r){return (r.c||[]).some(x=>/cafe|coffee/i.test(x))?'Artisanal Cafe':(r.c||[])[0]||'Restaurant'}
function studioHighlight(r){return r.review_insights?.[0]||r.description||(r.c||[]).slice(0,2).join(' & ')||'Discover this spot'}
function studioRestaurantCard(r,rank=0){
 const id=esc(r.id),saved=state.saves.includes(r.id),feedback=state.feedback[r.id],visited=feedback==='visited';
 return `<article class="card restaurant-card studioCard ${rank?'studioRankedCard':''}" data-place-id="${id}" id="card-${id}">
 <div class="studioCardMedia"><button type="button" class="photo" data-action="open-place" data-rest-id="${id}" aria-label="Explore ${esc(r.name)}">${photo(r)}</button>
 <div class="studioPhotoTop"><span class="studioStatus ${rank?'studioRank':''}">${rank?'#'+rank+' TASTE MATCH':'Hours unverified'}</span><span class="studioPhotoControls"><button type="button" data-rest-action="maps" data-rest-id="${id}" aria-label="Directions to ${esc(r.name)}">${studioIcon('arrow')}</button><button type="button" class="venueSave" data-rest-action="save" data-rest-id="${id}" aria-pressed="${saved}" aria-label="${saved?'Remove saved':'Save'} ${esc(r.name)}">${studioIcon('save')}</button></span></div>
 ${visited?'<span class="studioVisitedBadge">✓ Visited by you</span>':''}<div class="studioPhotoBottom"><span>${studioIcon('food')}${esc(studioCategory(r))}</span><strong>${esc(displayPrice(r))}</strong></div></div>
 <div class="studioCardBody"><div class="studioNameRow"><h3 class="restname"><button type="button" class="restnameButton" data-action="open-place" data-rest-id="${id}">${esc(r.name)}</button></h3><span class="studioRating"><b>★</b> ${Number(r.rating).toFixed(1)} <small>(${Number(r.review_count||0).toLocaleString()})</small></span></div>
 <div class="studioMetaRow"><span>${esc(r.area||r.city)} · ${esc((r.c||[]).slice(0,2).join(', '))}</span><span class="studioMatch" title="Estimated from your taste preferences">ϟ ${r.score}% Match</span></div>
 <p class="studioKnown"><strong>✧ Known for:</strong> ${esc(studioHighlight(r))}</p>
 <div class="actions studioCardActions"><button type="button" data-rest-action="like" data-rest-id="${id}" aria-pressed="${feedback==='like'}" aria-label="${feedback==='like'?'Undo like':'Like'} ${esc(r.name)}">${studioIcon('heart')}${feedback==='like'?'Liked':'Like'}</button><button type="button" data-rest-action="visited" data-rest-id="${id}" aria-pressed="${visited}" aria-label="${visited?'Undo visited':'I visited'} ${esc(r.name)}">${studioIcon('check')}${visited?'Visited ✓':'+ Visited'}</button><button type="button" class="studioDetails" data-action="open-place" data-rest-id="${id}">${studioIcon('food')}${rank?'View Spot & Menu':'Details'}</button></div></div></article>`;
}
card=r=>studioRestaurantCard(r);

const studioMapHome=home;
home=function(){
 studioMapHome();
 const screen=document.querySelector('.home-screen');if(!screen)return;
 screen.querySelector('.tasteTuning')?.remove();
 const sheet=screen.querySelector('.homeRecommendations'),header=sheet?.querySelector('.section'),controls=header?.querySelector('.railControls');
 if(header)header.innerHTML=studioCity()+`<span class="studioSpotCount">${ranked().length} spots</span><button class="studioSearch" type="button" data-studio-search aria-label="Search restaurants">${studioIcon('search')}</button>`;
 if(header){const browsing=document.createElement('div');browsing.className='studioBrowseRow';browsing.innerHTML=`<h2>${sheet.querySelectorAll('.studioCard').length} places to explore</h2>`;if(controls)browsing.append(controls);header.after(browsing)}
 const filters=screen.querySelector('.homeFilterChips'),toolbar=screen.querySelector('.homeMapToolbar');
 if(filters&&toolbar){filters.insertAdjacentHTML('afterbegin',`${studioPaloToggle()}<button type="button" class="filterChip" data-action="navigate" data-page="ask">${studioIcon('spark')} Ask Pal-O <span class="studioBadge">Beta</span></button><button type="button" class="filterChip" data-action="navigate" data-page="social">${studioIcon('friends')} Friends <span class="studioBadge">Soon</span></button>`);toolbar.replaceChildren(filters)}
 sheet?.querySelector('.homeEstimateNote')?.remove();
};

let studioPopularTab='spots';
let studioSearchOpen=false;
discover=function(){
 document.getElementById('root').innerHTML=`<section class="screen discover-screen studioPopular"><header class="studioPageHeader"><div><h1>${studioIcon('fire')} Popular in ${esc(cityName())}</h1><p>${ranked().length} food places listed on palateo.in/app</p></div>${studioCity()}</header>
 <div class="studioSegments" role="group" aria-label="Popular view"><button type="button" data-studio-popular="spots" aria-pressed="${studioPopularTab==='spots'}">${studioIcon('fire')} Popular Spots</button><button type="button" data-studio-popular="trails" aria-pressed="${studioPopularTab==='trails'}">${studioIcon('map')} Food Trails</button></div>
 <div class="studioPopularFilters" role="group" aria-label="Filter popular places">${[['all','All Popular'],['rated','★ Top Rated (4.8+)'],['Cafe','Cafés'],['Gujarati','Regional'],['Italian','Italian']].map(([value,label])=>`<button type="button" data-studio-filter="${value}" aria-pressed="${discoverCuisine===value}">${label}</button>`).join('')}</div>
 <div class="studioSearchToggle"><button type="button" data-studio-toggle-search aria-expanded="${studioSearchOpen}" aria-controls="studioSearchControls">${studioIcon('search')} ${studioSearchOpen?'Close search':'Search & sort'}</button></div><div id="studioSearchControls" class="discoverTools ${studioSearchOpen?'':'hide'}"><input id="q" class="search" aria-label="Search restaurants" placeholder="Search cafes, dishes, areas…" value="${esc(discoverQuery)}" data-action="filter"><select id="discoverSort" aria-label="Sort restaurants" data-action="sort"><option value="match">Taste match</option><option value="rating">Top rated</option><option value="name">Name A–Z</option></select></div><div id="resultCount" class="studioResults" role="status"></div><div id="list" class="restaurantGrid"></div></section>`;
 drawDiscover();
};
drawDiscover=function(query){
 const list=document.getElementById('list');if(!list)return;
 if(query!==undefined)discoverQuery=String(query??'');
 const needle=(query??document.getElementById('q')?.value??discoverQuery).trim().toLowerCase();
 let matches=ranked().filter(r=>(!needle||[r.name,r.area,...(r.c||[]),...(r.review_insights||[])].join(' ').toLowerCase().includes(needle))&&(discoverCuisine==='all'||(discoverCuisine==='rated'?r.rating>=4.8:(r.c||[]).some(c=>c.toLowerCase().includes(discoverCuisine.toLowerCase())))));
 const sort=document.getElementById('discoverSort')?.value;
 if(sort==='rating')matches.sort((a,b)=>b.rating-a.rating||b.score-a.score);
 if(sort==='name')matches.sort((a,b)=>a.name.localeCompare(b.name));
 document.getElementById('resultCount').textContent=matches.length+' places · Matches are estimates';
 if(studioPopularTab==='trails'){
  list.innerHTML=matches.length?`<section class="studioTrail"><h2>A food trail in ${esc(cityName())}</h2><p>A suggested shortlist from your taste matches. Check opening times before heading out.</p>${matches.slice(0,3).map((r,i)=>`<div class="studioTrailStop"><b>${i+1}</b><div><h3>${esc(r.name)}</h3><p>${esc(r.area)} · ${esc(displayPrice(r))}</p></div><button type="button" data-action="open-place" data-rest-id="${esc(r.id)}">Details →</button></div>`).join('')}</section>`:'<p class="empty">No places match these filters.</p>';return;
 }
 list.innerHTML=matches.length?studioRestaurantCard(matches[0],1)+(matches.length>1?`<h2 class="studioLeaderboard">Leaderboard: Top Rated in ${esc(cityName())}<small>${matches.length} places</small></h2>`:'')+matches.slice(1).sort((a,b)=>b.rating-a.rating).map((r,i)=>studioRestaurantCard(r,i+2)).join(''):'<div class="empty"><h2>No places found</h2><p>Try another search or clear a filter.</p></div>';
};

let studioFriendsTab='radar';
social=function(){
 const samples=people.slice(0,3),venues=ranked();
 const cards=samples.map((p,i)=>{const r=venues[i];return `<article class="studioFriend"><div class="studioFriendTop"><span class="studioAvatar">${esc(p.avatar)}</span><div><h3>${esc(p.name)} <small>@${esc(p.name.toLowerCase().replaceAll(' ',''))}</small></h3><p>Sample profile · ${esc(cityName())}</p></div><span class="studioMatch">ϟ ${p.match}% Twin</span></div>${r?`<div class="studioFriendSpot"><span class="studioSampleLabel">SAMPLE DISCOVERY</span><b>${esc(r.name)}</b><p>${esc(p.bio)}</p></div>`:''}<div class="actions"><button type="button" disabled>${studioIcon('pin')} Ping · Soon</button>${r?`<button type="button" class="studioDetails" data-action="open-place" data-rest-id="${esc(r.id)}">${studioIcon('food')} View Cafe</button>`:''}</div></article>`}).join('');
 const activity=samples.map((p,i)=>{const r=venues[i];return `<article class="studioCircleActivity"><span class="studioAvatar">${esc(p.avatar)}</span><div><h3>${esc(p.name)} <small>Sample activity</small></h3><p>Discovered ${esc(r?.name||'a new favorite')} in ${esc(cityName())}</p><span class="studioMatch">${p.match}% taste twin</span></div><button type="button" disabled aria-label="Cheer — coming soon">${studioIcon('heart')}</button></article>`}).join('');
 const crawl=venues.slice(0,3);
 document.getElementById('root').innerHTML=`<section class="screen social-screen studioSocial"><header class="studioPageHeader"><div><h1>Palateo Circle</h1><p>Your people. Your palate. Your next spot.</p></div><button type="button" class="studioAdd" disabled aria-label="Add friends — coming soon">+ Add</button></header><div class="studioCircleLaunch"><span class="studioBadge">Coming soon</span><span>Friends & food, together</span></div><div class="studioSegments" role="group" aria-label="Circle preview tabs">${[['radar','Live Radar'],['activity','Activity Feed'],['crawls','Food Crawls']].map(([key,label])=>`<button type="button" data-studio-friends="${key}" aria-pressed="${studioFriendsTab===key}">${label}</button>`).join('')}</div><div class="studioCommunityNote"><strong>Meet your future food circle</strong><p>Explore a preview of taste twins, shared discoveries and food crawls. Sample profiles only; friends, live locations and invites are coming soon.</p></div>${studioFriendsTab==='radar'?cards:studioFriendsTab==='activity'?activity:`<section class="studioCircleCrawl"><div class="studioCrawlPhoto">${crawl[0]?photo(crawl[0]):''}<span class="studioBadge">Sample food crawl</span></div><div class="studioCrawlBody"><h2>The ${esc(cityName())} taste trail</h2><p>Three stops. One hungry squad.</p><ol>${crawl.map(r=>`<li><strong>${esc(r.name)}</strong><span>${esc(r.area||r.city)} · ${esc(displayPrice(r))}</span></li>`).join('')}</ol><button type="button" class="studioDetails" disabled>Join squad · Coming soon</button></div></section>`}</section>`;
};

function ask(){
 const a=state.answers||{};
 document.getElementById('root').innerHTML=`<section class="screen studioAsk"><header class="studioAskHeader"><div><h1>Ask Pal-O <span class="studioBadge">Beta</span></h1><p>Your culinary companion</p></div>${studioPaloToggle()}</header><div class="studioDna"><span>${studioIcon('spark')}</span><div><strong>Active Palate DNA: ${esc((preferredCuisines(a).map(x=>cuisineLabels[x]||x)).join(' & ')||'Your taste')}</strong><p>${esc(a.spice||'medium')} spice · ${esc(dietLabel(a.diet))} · ${esc(cityName())}</p></div></div><div id="studioPaloHost"></div><h2>Suggested Questions</h2><div class="studioSuggestions">${['Find a cozy cafe in '+cityName(),'Recommend a dish for my spice preference','Compare my top two restaurant matches','Plan a food trail for me','Find coffee and desserts nearby'].map(q=>`<button type="button" data-studio-question="${esc(q)}">${studioIcon('spark')}${esc(q)}</button>`).join('')}</div></section>`;
 const palo=studioPaloContainer;if(palo){document.getElementById('studioPaloHost').append(palo);document.getElementById('paloBubble')?.classList.add('is-open');document.getElementById('paloInput')?.setAttribute('aria-label','Ask Pal-o about cafes, dishes or hidden gems')}
 const screen=document.querySelector('.studioAsk'),suggestions=screen.querySelector('.studioSuggestions'),suggestionHeading=screen.querySelector('h2');
 const prompt=document.createElement('div');prompt.className='studioAskPrompt';screen.querySelector('.studioDna').after(prompt);if(studioPaloForm)prompt.append(studioPaloForm);
 const host=document.getElementById('studioPaloHost');host.before(suggestionHeading,suggestions);const responseHeading=document.createElement('h2');responseHeading.textContent='Palate AI Recommendation';host.before(responseHeading);
}

const studioOriginalProfile=profile;
profile=function(){
 studioOriginalProfile();
 const screen=document.querySelector('.profile-screen'),a=state.answers||{};if(!screen)return;
 screen.querySelector('.tasteProfileHeader p').textContent='Teach Palateo AI your culinary DNA & flavor rules';
 screen.querySelector('.profileMonogram')?.remove();
 const sync=screen.querySelector('.cloudSyncBadge');if(sync)sync.textContent=backendReady?'Account connected · Supabase':'Local preview · Cloud sync not tested';
 const visits=screen.querySelector('.passportVisitsBadge');if(visits)visits.textContent=(Number(state.ai?.visits)||0)+' Visited';
 const summary=screen.querySelector('.profileTasteSummary'),r=ranked()[0];
 if(summary)summary.outerHTML=`<section class="studioGenome">${r?`<div class="studioGenomePhoto">${photo(r)}</div>`:''}<div><small>CURRENT TASTE GENOME</small><h2>${esc(preferredCuisines(a).map(x=>cuisineLabels[x]||x).join(' & ')||'Your Culinary Explorer')}</h2><p>Active in ${esc(cityName())} · ${feedbackCount()} taste signals trained</p></div></section><section class="studioPreferences"><h2>1. Spice Tolerance Meter</h2><p class="studioSpiceLabel">${esc(a.spice||'medium')} spice</p><input type="range" min="0" max="2" step="1" value="${['mild','medium','hot'].indexOf(a.spice)}" data-studio-spice aria-label="Spice tolerance"><h2>2. Dietary Philosophy</h2>${studioPreferenceChoices('diet')}<h2>3. Favorite Regional Cuisines</h2><p>Choose the cuisine you crave most</p>${studioPreferenceChoices('cuisine')}<h2>4. Your Favorite Vibes</h2>${studioPreferenceChoices('mood')}</section>`;
 screen.querySelector('.profileStats')?.remove();
 const filters=screen.querySelector('.studioFilters');if(filters)screen.querySelector('.studioPreferences')?.after(filters);
 screen.querySelector('.tasteProfileHeader')?.insertAdjacentHTML('afterend',`<div class="studioCompanionSetting"><div><strong>Pal-O on your screen</strong><p>Show the floating companion while you explore.</p></div>${studioPaloToggle()}</div>`);
};
function studioPreferenceChoices(key){const q=questions.find(q=>q.k===key),selected=key==='cuisine'?preferredCuisines():key==='mood'?preferredVibes():[state.answers[key]];return `<div class="studioChoices">${q.o.map(([v,label])=>`<button type="button" data-studio-preference="${key}" data-value="${esc(v)}" aria-pressed="${selected.includes(v)}">${selected.includes(v)?'✓ ':''}${esc(label)}</button>`).join('')}</div>`}
function studioSetPreference(key,value){
 const q=questions.find(q=>q.k===key);if(!q?.o.some(([v])=>v===value))return;
 const owner=currentUser?.id;
 if(key==='cuisine'||key==='mood'){
  const values=key==='cuisine'?preferredCuisines():preferredVibes(),next=values.includes(value)?values.filter(v=>v!==value):[...values,value];
  if(!next.length)return;
  state.answers[key==='cuisine'?'cuisines':'vibes']=next;state.answers[key]=next[0];
 }else state.answers[key]=value;
 persist();profile();feedbackSyncQueue=feedbackSyncQueue.catch(()=>{}).then(async()=>{if(!owner||currentUser?.id!==owner)return;try{await syncTaste()}catch{if(currentUser?.id===owner)toast('Saved on this device; cloud sync failed.')}});return feedbackSyncQueue;
}

const studioOriginalPlace=place;
place=function(){
 studioOriginalPlace();const r=activeRestaurant(detailRestaurantId),screen=document.querySelector('.place-screen');if(!r||!screen)return;
 const id=esc(r.id),visited=state.feedback[r.id]==='visited';
 screen.querySelector('.placeBody>.tags')?.insertAdjacentHTML('afterend',`<section class="studioVisit ${visited?'isVisited':''}">${studioIcon('check')}<div><h2>${visited?'You Have Visited This Cafe ✓':'Have You Visited This Cafe?'}</h2><p>${visited?'Stamped in your Palate Passport':'Tap to count your visit & add to Palate Passport'}</p></div><button type="button" data-rest-action="visited" data-rest-id="${id}" aria-pressed="${visited}">${visited?'Visited ✓':'+ Visited'}</button></section>`);
 const breakdown=screen.querySelector('.placeBreakdown');if(breakdown){breakdown.querySelector('h2').textContent='Why Palate AI Picked This';const details=document.createElement('details');details.className='studioDeepDive';details.innerHTML='<summary>✧ AI Deep Dive</summary>';const factors=breakdown.querySelector('.matchFactors');if(factors)details.append(factors);breakdown.append(details)}
 screen.querySelector('.placeAbout h2').textContent='About This Spot';
 const calibration=screen.querySelector('.placeDishes h2');if(calibration&&!calibration.querySelector('.betaBadge'))calibration.insertAdjacentHTML('beforeend',' <span class="betaBadge">Beta</span>');
 const about=screen.querySelector('.placeAbout>p');if(about&&!r.description&&r.review_insights?.length)about.textContent=r.name+' in '+(r.area||r.city)+', '+r.review_insights.join(', ')+'.';
 screen.insertAdjacentHTML('beforeend',`<div class="studioDetailDock"><button type="button" data-rest-action="visited" data-rest-id="${id}" aria-pressed="${visited}">${studioIcon('check')}${visited?'Visited ✓':'+ Mark Visited'}</button><button type="button" data-rest-action="maps" data-rest-id="${id}">${studioIcon('arrow')}Get Directions</button></div>`);
};

document.addEventListener('click',event=>{
 const el=event.target instanceof Element?event.target.closest('[data-studio-popular],[data-studio-filter],[data-studio-friends],[data-studio-question],[data-studio-preference],[data-studio-search],[data-studio-toggle-search]'):null;if(!el)return;
 if(el.hasAttribute('data-studio-search')){studioSearchOpen=true;go('discover');document.getElementById('q')?.focus()}
 if(el.hasAttribute('data-studio-toggle-search')){studioSearchOpen=!studioSearchOpen;discover();if(studioSearchOpen)document.getElementById('q')?.focus();else document.querySelector('[data-studio-toggle-search]')?.focus()}
 if(el.dataset.studioPopular){studioPopularTab=el.dataset.studioPopular;discover()}
 if(el.dataset.studioFilter){discoverCuisine=el.dataset.studioFilter;discover()}
 if(el.dataset.studioFriends){studioFriendsTab=el.dataset.studioFriends;social()}
 if(el.dataset.studioQuestion){const input=document.getElementById('paloInput');if(input){input.value=el.dataset.studioQuestion;document.getElementById('paloForm')?.requestSubmit();input.focus()}}
 if(el.dataset.studioPreference)studioSetPreference(el.dataset.studioPreference,el.dataset.value);
});
document.addEventListener('change',event=>{if(event.target.matches('[data-studio-spice]'))studioSetPreference('spice',['mild','medium','hot'][Number(event.target.value)])});
document.addEventListener('click',event=>{
 const toggle=event.target instanceof Element?event.target.closest('[data-studio-palo-toggle],[data-studio-palo-hide]'):null;
 if(toggle)studioSetPaloVisible(toggle.hasAttribute('data-studio-palo-hide')?false:!studioPaloVisible);
},true);
const studioPet=document.getElementById('paloPetButton');
studioPet?.setAttribute('aria-label','Open Ask Pal-O — beta');
studioPet?.removeAttribute('aria-expanded');
studioPet?.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();go('ask')},true);
studioPet?.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopImmediatePropagation();go('ask')}},true);
if(studioPaloContainer){const hide=document.createElement('button');hide.type='button';hide.className='studioPaloHide';hide.dataset.studioPaloHide='';hide.setAttribute('aria-label','Hide Pal-O');hide.textContent='×';studioPaloContainer.append(hide)}
const studioNav=[['home','map','Map'],['discover','fire','Popular'],['social','friends','Friends'],['ask','spark','Ask Pal-O'],['profile','heart','You']];
const studioGo=go;
go=function(destination,options){
 // Move the existing node before replacing root so its listeners and conversation survive.
 if(studioPaloForm&&studioPaloContainer&&!studioPaloContainer.contains(studioPaloForm))studioPaloContainer.querySelector('#paloBubble').append(studioPaloForm);
 if(studioPaloContainer&&document.getElementById('root').contains(studioPaloContainer))document.body.append(studioPaloContainer);
 studioGo(destination,options);
 document.body.dataset.page=page;
};
document.getElementById('nav').innerHTML=studioNav.map(([key,icon,label])=>`<button type="button" data-action="navigate" data-page="${key}" id="n-${key}" aria-label="${label}${key==='social'?' — coming soon':key==='ask'?' — beta':''}"><b>${studioIcon(icon)}</b><span>${label}</span>${key==='social'||key==='ask'?`<small class="studioNavBadge">${key==='social'?'Coming soon':'Beta'}</small>`:''}</button>`).join('');
document.body.classList.add('studioApp');
studioSetPaloVisible(studioPaloVisible);
document.getElementById('paloMinimizeBtn')?.click();
if(currentUser&&hasLegalConsent(currentUser)&&hasTasteProfile())go(page);

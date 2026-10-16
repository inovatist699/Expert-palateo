// Match the supplied mobile reference while keeping the existing state and service handlers.
const studioPaloContainer=document.getElementById('paloContainer');
const studioPaloForm=document.getElementById('paloForm');
let studioPaloVisible=true;
try{studioPaloVisible=localStorage.getItem('palateo-palo-visible')!=='false'}catch{}
function studioPaloToggle(){return `<button type="button" class="studioPaloToggle" role="switch" aria-checked="${studioPaloVisible}" data-studio-palo-toggle aria-label="Show Pal-O on screen">${studioIcon('spark')}<span>Pal-O</span><i aria-hidden="true"></i></button>`}
function studioSetPaloVisible(visible){
 studioPaloVisible=visible;document.body.dataset.paloVisible=String(visible);
 try{localStorage.setItem('palateo-palo-visible',String(visible))}catch{}
 document.querySelectorAll('[data-studio-palo-toggle]').forEach(button=>button.setAttribute('aria-checked',String(visible)));
}
const studioMapHome=home;
home=function(){
 studioMapHome();
 const screen=document.querySelector('.home-screen');if(!screen)return;
 const sheet=screen.querySelector('.homeRecommendations'),header=sheet?.querySelector('.section'),controls=header?.querySelector('.railControls');
 if(header)header.innerHTML=studioCity()+`<span class="studioSpotCount">${ranked().length} spots</span><button class="studioSearch" type="button" data-studio-search aria-label="Search restaurants">${studioIcon('search')}</button>`;
 if(header){const browsing=document.createElement('div');browsing.className='studioBrowseRow';browsing.innerHTML=`<h2>${sheet.querySelectorAll('.studioCard').length} places to explore</h2>`;if(controls)browsing.append(controls);header.after(browsing)}
 const filters=screen.querySelector('.homeFilterChips'),toolbar=screen.querySelector('.homeMapToolbar');
 if(filters&&toolbar){filters.insertAdjacentHTML('afterbegin',`${studioPaloToggle()}<button type="button" class="filterChip" data-action="navigate" data-page="ask">${studioIcon('spark')} Ask Pal-O <span class="studioBadge">Beta</span></button><button type="button" class="filterChip" data-action="navigate" data-page="social">${studioIcon('friends')} Friends <span class="studioBadge">Soon</span></button>`);toolbar.replaceChildren(filters)}
 sheet?.querySelector('.homeEstimateNote')?.remove();
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

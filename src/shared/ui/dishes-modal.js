/* ==========================================================================
   PALATEO GOOGLE STUDIO DISHES MODAL & SHOWCASE COMPONENT
   - Modal dialog for restaurant menu highlights
   - Best dishes showcase grid and interactive category filters
   - Studio parameter tuning and prompt search helpers
   ========================================================================== */

let promptQuery = '';
let minMatchThreshold = 0;
let studioTunerOpen = false;
let selectedDishCategory = 'all';
let activeDishModalVenue = null;
let adventureMode = 'balanced';

function renderDishesModalHtml(r){
  const id = esc(r.id);
  const dishes = resolveBestDishes(r);
  const place = esc(r.area || r.city || cityName());
  return `<div class="modal dishesModal" id="dishesModal" role="dialog" aria-modal="true" aria-labelledby="dishesModalTitle">
    <div class="modalBackdrop" data-action="close-dishes-modal"></div>
    <div class="modalCard dishesModalCard">
      <div class="dishesModalHeader">
        <div>
          <div class="studioModelPill" style="margin-bottom:8px">
            <span class="studioLiveDot"></span>
            <span>Gemini-Palate-1.5 Verified Menu</span>
          </div>
          <h2 id="dishesModalTitle">${esc(r.name)}</h2>
          <p class="dishesModalSubtitle">${place} · ${esc(displayPrice(r))} · ★ ${Number(r.rating).toFixed(1)}</p>
        </div>
        <button type="button" class="dishesModalCloseBtn" id="dishesModalClose" data-action="close-dishes-modal" aria-label="Close dishes dialog">✕</button>
      </div>
      <div class="dishesModalContent">
        <p class="studioHint">Handcrafted signature dishes and crowd-favorite recommendations compiled from diner sentiment and menu telemetry.</p>
        <div class="dishesList">
          ${dishes.map(d=>`
            <div class="dishModalItem">
              <div class="dishModalItemHead">
                <div class="dishModalTitleRow">
                  <span class="dishDietBadge ${d.dietary?.toLowerCase().includes('non-veg')?'nonVeg':d.dietary?.toLowerCase().includes('egg')?'egg':'veg'}" title="${esc(d.dietary)}">●</span>
                  <strong class="dishModalName">${esc(d.name)}</strong>
                </div>
                <div class="dishModalMeta">
                  <span class="dishModalCategory">${esc(d.category)}</span>
                  <span class="dishModalPrice">${esc(d.price)}</span>
                </div>
              </div>
              <p class="dishModalDesc">${esc(d.description)}</p>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="dishesModalFooter">
        <button type="button" class="btn secondary" data-action="close-dishes-modal">Close</button>
        <button type="button" class="btn secondary" data-action="open-place" data-rest-id="${id}">Full Cafe Details →</button>
        <button type="button" class="btn green" data-rest-action="maps" data-rest-id="${id}">Directions ↗</button>
      </div>
    </div>
  </div>`;
}

function openDishesModal(id){
  const r = activeRestaurant(id);
  if(!r) return;
  activeDishModalVenue = r;
  document.getElementById('dishesModal')?.remove();
  document.body.insertAdjacentHTML('beforeend', renderDishesModalHtml(r));
  document.getElementById('dishesModalClose')?.focus();
}

function closeDishesModal(){
  activeDishModalVenue = null;
  document.getElementById('dishesModal')?.remove();
}

function renderBestDishesShowcase(venues){
  const allDishes = [];
  venues.forEach(r => {
    const dishes = resolveBestDishes(r);
    dishes.forEach(d => {
      allDishes.push({ dish: d, venue: r });
    });
  });

  let displayedDishes = allDishes;
  if(selectedDishCategory !== 'all'){
    displayedDishes = allDishes.filter(item => {
      const cat = item.dish.category.toLowerCase();
      if(selectedDishCategory==='coffee') return cat.includes('coffee')||cat.includes('brew');
      if(selectedDishCategory==='bakes') return cat.includes('bake')||cat.includes('sourdough')||cat.includes('croissant');
      if(selectedDishCategory==='breakfast') return cat.includes('breakfast')||cat.includes('brunch')||cat.includes('egg');
      if(selectedDishCategory==='mains') return cat.includes('main')||cat.includes('pizza')||cat.includes('pasta')||cat.includes('sandwich')||cat.includes('plate')||cat.includes('seafood');
      if(selectedDishCategory==='desserts') return cat.includes('dessert')||cat.includes('gelato')||cat.includes('pastry');
      return true;
    });
  }

  const categoryChips = `<div class="filterChips dishCategoryChips" role="group" aria-label="Filter dishes by category">
    <button type="button" class="filterChip ${selectedDishCategory==='all'?'active':''}" data-action="set-dish-category" data-category="all">All Dishes (${allDishes.length})</button>
    <button type="button" class="filterChip ${selectedDishCategory==='coffee'?'active':''}" data-action="set-dish-category" data-category="coffee">☕ Coffee & Brews</button>
    <button type="button" class="filterChip ${selectedDishCategory==='bakes'?'active':''}" data-action="set-dish-category" data-category="bakes">🥐 Bakes & Sourdough</button>
    <button type="button" class="filterChip ${selectedDishCategory==='breakfast'?'active':''}" data-action="set-dish-category" data-category="breakfast">🍳 Breakfast & Brunch</button>
    <button type="button" class="filterChip ${selectedDishCategory==='mains'?'active':''}" data-action="set-dish-category" data-category="mains">🍕 Mains & Specialties</button>
    <button type="button" class="filterChip ${selectedDishCategory==='desserts'?'active':''}" data-action="set-dish-category" data-category="desserts">🍨 Desserts & Gelato</button>
  </div>`;

  if(!displayedDishes.length){
    return `${categoryChips}<div class="empty"><h2>No dishes match this category</h2><p>Switch to “All Dishes” or adjust your Palate Prompt above.</p></div>`;
  }

  const gridHtml = `<div class="dishesShowcaseGrid" aria-label="Best dishes across ${esc(cityName())}">
    ${displayedDishes.slice(0, 36).map(({dish,venue})=>`
      <article class="dishShowcaseCard">
        <div class="dishShowcaseTop">
          <div class="dishShowcaseHeader">
            <span class="dishDietBadge ${dish.dietary?.toLowerCase().includes('non-veg')?'nonVeg':dish.dietary?.toLowerCase().includes('egg')?'egg':'veg'}">●</span>
            <strong class="dishShowcaseName">${esc(dish.name)}</strong>
          </div>
          <span class="dishShowcasePrice">${esc(dish.price)}</span>
        </div>
        <p class="dishShowcaseDesc">${esc(dish.description)}</p>
        <div class="dishShowcaseVenue">
          <div class="dishShowcaseVenueInfo">
            <span class="dishVenueName">${esc(venue.name)}</span>
            <span class="dishVenueArea">${esc(venue.area||venue.city)} · ★ ${Number(venue.rating).toFixed(1)}</span>
          </div>
          <div class="dishShowcaseActions">
            <button type="button" class="btn secondary smallBtn" data-action="open-dishes-modal" data-rest-id="${esc(venue.id)}" aria-label="All dishes at ${esc(venue.name)}">All Menu →</button>
            <button type="button" class="btn green smallBtn" data-rest-action="maps" data-rest-id="${esc(venue.id)}" aria-label="Directions to ${esc(venue.name)}">Directions ↗</button>
          </div>
        </div>
      </article>
    `).join('')}
  </div>`;

  return `${categoryChips}${gridHtml}`;
}

function toggleStudioTuner(){
  studioTunerOpen = !studioTunerOpen;
  home();
}
function setMinMatch(val){
  minMatchThreshold = val;
  homeLimit = 12;
  home();
}
function setAdventureMode(mode){
  adventureMode = mode;
  homeLimit = 12;
  home();
}
function applyPrompt(text){
  promptQuery = text;
  homeLimit = 12;
  home();
}
function runPrompt(){
  const input = document.getElementById('studioPromptInput');
  if(input) promptQuery = input.value.trim();
  homeLimit = 12;
  home();
}
function clearPrompt(){
  promptQuery = '';
  homeLimit = 12;
  home();
}
function setDishCategory(cat){
  selectedDishCategory = cat;
  home();
}

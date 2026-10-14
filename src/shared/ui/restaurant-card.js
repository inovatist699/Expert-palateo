function photo(r){const fallback='<svg class="venuePlaceholder" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V9h16v12M3 9l3-6h12l3 6M8 21v-7h8v7M3 9h18"/></svg>';const imgUrl=(r.photo&&r.photo.startsWith('https://'))?r.photo:resolveVenuePhoto(r);if(!imgUrl)return fallback;try{const url=new URL(imgUrl,location.href);if((url.protocol!=='https:'&&url.origin!==location.origin)||url.username||url.password)return fallback;return fallback+'<img src="'+esc(url.href)+'" alt="" loading="lazy" decoding="async">'}catch(e){return fallback}}

function categoryGlyph(c, cat){
  const pool = [cat, ...(c||[])].join(' ').toLowerCase();
  if (pool.includes('bakery') || pool.includes('dessert') || pool.includes('patisserie')) return '🥖';
  if (pool.includes('cafe') || pool.includes('coffee') || pool.includes('roaster')) return '☕';
  if (pool.includes('pizza') || pool.includes('sourdough') || pool.includes('italian')) return '🍕';
  if (pool.includes('fine') || pool.includes('wine') || pool.includes('lounge')) return '🍷';
  if (pool.includes('gujarati') || pool.includes('thali') || pool.includes('regional')) return '👑';
  if (pool.includes('street') || pool.includes('snack') || pool.includes('chaat')) return '🍢';
  if (pool.includes('veg')) return '🌿';
  return '🍽️';
}

function card(r){
  const saved=state.saves.includes(r.id),f=state.feedback[r.id],id=esc(r.id);
  const place=r.area||r.city||cityName(),rating=Number(r.rating).toFixed(1),reviews=Number(r.review_count)||0;
  const dishes=typeof resolveBestDishes==='function'?resolveBestDishes(r):[];
  const topDishes=dishes.slice(0, 3);
  const mainCat=(r.c&&r.c.length)?r.c[0]:'Food Spot';
  const glyph=categoryGlyph(r.c, r.category||mainCat);
  const isVisited=f==='visited';
  const isLiked=f==='like';

  return `<article class="card restaurant-card appleGlassCard ${isVisited?'is-visited':''}" data-place-id="${id}" id="card-${id}">
    <div class="resthead">
      <button type="button" class="photo" data-action="open-place" data-rest-id="${id}" aria-label="Explore ${esc(r.name)}">
        ${photo(r)}
        <div class="photoCardTopBadges">
          <span class="appleGlassLiveOpenBadge"><i class="liveDot"></i>Open Now</span>
          <span class="appleGlassRatingBadge"><b class="star">★</b> ${rating}</span>
        </div>
      </button>
      <div class="venueHeading">
        <div class="venueCategoryRow">
          <span class="appleGlassCategoryBadge"><span class="catEmoji">${glyph}</span> ${esc(mainCat)}</span>
          ${isVisited ? '<span class="visitedStampBadge">✓ VISITED</span>' : ''}
        </div>
        <h3 class="restname"><button type="button" class="restnameButton" data-action="open-place" data-rest-id="${id}">${esc(r.name)}</button></h3>
        <div class="meta">${esc(place)} · ${esc(displayPrice(r))} · ★ ${rating}${reviews?" ("+reviews.toLocaleString()+")":""}</div>
      </div>
      <div class="match ${r.score>=75?"strong":r.score>=50?"mixed":"low"}" title="Estimated taste fit from your quiz and feedback">
        <b>⚡ ${r.score}%</b><span>PALATE MATCH</span>
      </div>
    </div>
    <div class="tags">${[...new Set([...(r.c||[]),...(r.t||[])])].slice(0,3).map(x=>`<span class="tag">${esc(x)}</span>`).join("")}</div>
    <p class="fitReason"><b>Why it fits</b> · ${esc(r.why[0])}</p>
    <div class="cardBestDishes">
      <div class="cardBestDishesHeader">
        <span class="cardBestDishesTitle">⭐ BEST DISHES</span>
        <button type="button" class="viewAllDishesBtn" data-action="open-dishes-modal" data-rest-id="${id}">View menu highlights (${dishes.length}) →</button>
      </div>
      <div class="cardDishesList">${topDishes.map(d=>`<div class="cardDishItem" data-action="open-dishes-modal" data-rest-id="${id}" role="button" tabindex="0"><div class="cardDishInfo"><span class="cardDishDiet ${d.dietary?.toLowerCase().includes('non-veg')?'nonVeg':d.dietary?.toLowerCase().includes('egg')?'egg':'veg'}">●</span><span class="cardDishName">${esc(d.name)}</span></div><span class="cardDishPrice">${esc(d.price)}</span></div>`).join('')}</div>
    </div>
    <details class="why">
      <summary>Your match explained</summary>
      <p>${esc(r.why.join(" · "))}<br><br>An estimate from your quiz and active feedback. Tap a selected rating again to undo it. Venue details and prices can change; confirm before visiting.</p>
    </details>
    <div class="actions">
      <button type="button" data-rest-action="like" data-rest-id="${id}" aria-pressed="${isLiked}" aria-label="${isLiked?'Unlike':'Like'} ${esc(r.name)}">${isLiked?'♥ Undo like':'♡ Like'}</button>
      <button type="button" data-rest-action="dislike" data-rest-id="${id}" aria-pressed="${f==='dislike'}" aria-label="${f==='dislike'?'Undo not for me':'Not for me'}: ${esc(r.name)}">${f==='dislike'?'Undo pass':'Not for me'}</button>
      <button type="button" class="dark ${saved?'is-saved':''}" data-rest-action="save" data-rest-id="${id}" aria-label="${saved?'Remove':'Save'} ${esc(r.name)}">${saved?'Saved ✓':'Save'}</button>
    </div>
    <div class="actions">
      <button type="button" class="${isVisited?'visitedActiveBtn':''}" data-rest-action="visited" data-rest-id="${id}" aria-pressed="${isVisited}" aria-label="${isVisited?'Undo visited':'I visited'}: ${esc(r.name)}">${isVisited?'Undo visit':'I visited'}</button>
      <button type="button" data-action="view-pin" data-rest-id="${id}" aria-label="Locate ${esc(r.name)} on your map">On map</button>
      <button type="button" data-rest-action="maps" data-rest-id="${id}" aria-label="Directions to ${esc(r.name)}">Directions ↗</button>
    </div>
  </article>`;
}


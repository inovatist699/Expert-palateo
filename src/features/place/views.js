function place(){
 const raw=activeRestaurant(detailRestaurantId);if(!raw){detailRestaurantId=null;page='home';home();return}
 const r=rec(raw),id=esc(r.id),f=state.feedback[r.id],saved=state.saves.includes(r.id),dishes=availableCalibrationDishes().filter(d=>dishAffinity(r,d)>0).slice(0,3);
 const tags=[...new Set([...(r.c||[]),...(r.a||[])])].filter(Boolean).slice(0,6);
 const cuisines=(r.c||[]).filter(x=>!['Restaurant','Cafe'].includes(x));
  const isVisited=f==='visited';
  const isPureVeg=r.isPureVeg || (r.dietaryOptions&&r.dietaryOptions.some(x=>String(x).toLowerCase().includes('veg')&&!String(x).toLowerCase().includes('non')));
  const mainVibe=r.a&&r.a.length?r.a[0]:'Vibrant Dining';

  document.getElementById('root').innerHTML=`<article class="screen place-screen appleGlassPlaceScreen" aria-labelledby="placeTitle">
    <div class="placeHero appleGlassCard">
      <div class="placeHeroPhoto" aria-hidden="true">
        ${photo(r)}
        <div class="photoCardTopBadges">
          <span class="appleGlassLiveOpenBadge"><i class="liveDot"></i>Open Now</span>
          <span class="appleGlassRatingBadge"><b class="star">★</b> ${Number(r.rating).toFixed(1)}</span>
        </div>
      </div>
      <div class="placeHeroControls">
        <button type="button" id="placeBack" class="appleGlassControlBtn" data-action="close-place" aria-label="Back to places">← Back</button>
        <div class="placeHeroRightActions">
          <button type="button" class="appleGlassControlBtn ${isVisited?'isVisitedActive':''}" data-rest-action="visited" data-rest-id="${id}" aria-pressed="${isVisited}" aria-label="${isVisited?'Undo visited':'I visited'}: ${esc(r.name)}">${isVisited?'✓ Visited':'Passport ✓'}</button>
          <button type="button" class="appleGlassControlBtn ${saved?'isSavedActive':''}" data-rest-action="save" data-rest-id="${id}" aria-pressed="${saved}" aria-label="${saved?'Remove saved':'Save'} ${esc(r.name)}">${saved?'Saved ✓':'Save'}</button>
        </div>
      </div>
      <div class="placeHeroTitle">
        <div>
          <h1 id="placeTitle">${esc(r.name)}</h1>
          <p>${esc(r.area||r.city)} · ${esc(r.city||cityName())}</p>
        </div>
        <div class="placeMatch appleGlassMatchHero">
          <strong>⚡ ${r.score}%</strong>
          <span>PALATE MATCH</span>
        </div>
      </div>
    </div>

    <div class="placeBody">
      <!-- Quick Stats & Badges Bar -->
      <div class="placeQuickStats appleGlassCard">
        <div class="quickStatItem">
          <span class="quickStatIcon">★</span>
          <strong>${Number(r.rating).toFixed(1)}</strong>
          <span class="quickStatSub">(${r.review_count?Number(r.review_count).toLocaleString():'0'} reviews)</span>
        </div>
        <div class="quickStatItem">
          <span class="quickStatPrice">${esc(displayPrice(r))}</span>
          <span class="quickStatSub">· approx for two</span>
        </div>
      </div>

      <!-- Category, Vibe & Dietary Chips -->
      <div class="tags placeTagsRow">
        ${tags.map(x=>`<span class="tag appleGlassTag">${esc(x)}</span>`).join('')}
        <span class="tag appleGlassTag vibeTag">✨ ${esc(mainVibe)}</span>
        ${isPureVeg ? '<span class="tag appleGlassTag vegTag">🌱 Pure Veg</span>' : ''}
      </div>

      <!-- Palate Passport Tracker Status Banner -->
      <div class="placePassportStatusCard appleGlassCard ${isVisited?'isVisitedBanner':''}" data-rest-action="visited" data-rest-id="${id}" role="button" tabindex="0" aria-label="Toggle visited status">
        <div class="passportStatusLeft">
          <span class="passportStatusIcon">${isVisited?'✓':'✨'}</span>
          <div>
            <strong>${isVisited?'Tracked in your Palate Passport':'Have you visited this place?'}</strong>
            <p>${isVisited?'Your taste engine includes this venue in your dining history. Tap to undo.':'Tap to mark as visited and refine your dining passport in '+esc(cityName())}</p>
          </div>
        </div>
        <button type="button" class="btn ${isVisited?'secondary':'primary'}" data-rest-action="visited" data-rest-id="${id}">${isVisited?'Undo visit':'I visited ✓'}</button>
      </div>

      <!-- Match Breakdown Section -->
      <section class="placeBreakdown appleGlassCard">
        <h2>Your palate match</h2>
        <p class="placeBreakdownWhy">${esc(r.why.join(' · '))}.</p>
        <div class="matchFactors">
          ${r.matchBreakdown.map(x=>`<div><span>${esc(x.label)}</span><strong class="${x.factor>.45?'fit':x.factor<-.45?'conflict':'unknown'}">${x.factor>.45?'Good fit':x.factor<-.45?'Different preference':'Limited detail'}</strong></div>`).join('')}
        </div>
        <p class="placeCaveat">An estimate from your quiz, dish preferences and place feedback. It is not a guarantee that you will enjoy a place.</p>
      </section>

      <!-- About Section -->
      <section class="placeAbout appleGlassCard">
        <h2>About</h2>
        <p>${esc(r.description||`${r.name} is listed in ${r.area||r.city||cityName()}${cuisines.length?' with '+cuisines.join(', ')+' cuisine':''}.`)}</p>
        ${r.a?.length?`<p><strong>Atmosphere</strong> · ${r.a.map(esc).join(', ')}</p>`:''}
        ${r.dietaryOptions?.length?`<p><strong>Dietary information</strong> · ${r.dietaryOptions.map(x=>esc(String(x).replaceAll('_',' '))).join(', ')}</p>`:'<p class="placeCaveat">Dietary options are not verified. Check with the venue for allergies or dietary requirements.</p>'}
        <div class="placeAddress">
          <strong>Location &amp; Directions</strong>
          <p>${esc(r.address||[r.area,r.city||cityName()].filter(Boolean).join(', '))}</p>
          <button type="button" class="btn primary" data-rest-action="maps" data-rest-id="${id}">Get directions ↗</button>
        </div>
        <p class="placeCaveat">Hours and current menu are not verified. Confirm with the venue before visiting.</p>
      </section>

      <!-- Live Dish Calibration Section -->
      <section class="placeDishes appleGlassCard" aria-labelledby="placeDishTitle">
        <h2 id="placeDishTitle">Live dish calibration</h2>
        <p class="studioHint">Rate these flavour examples to refine your match. They are not confirmed menu items at this venue.</p>
        ${dishes.length?dishes.map(d=>`<div class="placeDish"><div><h3>${esc(d.name)}</h3><p>${esc(d.description)}</p></div>${dishButtons(d)}</div>`).join(''):'<p>We don’t have enough cuisine detail to choose dish examples here. Use the taste studio to calibrate your preferences.</p>'}
        <button type="button" class="dishRetry" data-action="dish-retry" ${state.unsyncedDishes?'':'hidden'}>Retry cloud sync</button>
        <p class="calibrationStatus" role="status">${esc(dishSyncStatus||'Tap the same selected choice to undo it.')}</p>
        <button type="button" class="linkBtn" data-action="navigate" data-page="profile">Open taste studio →</button>
      </section>

      <!-- Bottom Place Feedback Actions -->
      <section class="placeFeedback appleGlassCard">
        <h2>How does this place feel?</h2>
        <div class="actions">
          <button type="button" data-rest-action="like" data-rest-id="${id}" aria-pressed="${f==='like'}">${f==='like'?'Undo like':'Like this place'}</button>
          <button type="button" data-rest-action="dislike" data-rest-id="${id}" aria-pressed="${f==='dislike'}">${f==='dislike'?'Undo pass':'Not for me'}</button>
          <button type="button" data-rest-action="visited" data-rest-id="${id}" aria-pressed="${f==='visited'}">${f==='visited'?'Undo visit':'I visited'}</button>
        </div>
      </section>
    </div>
  </article>`;
}

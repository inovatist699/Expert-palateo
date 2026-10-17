function renderPassedPlaces(){
 const passed=Object.entries(state.feedback||{}).filter(([,value])=>value==='dislike').map(([id])=>activeRestaurant(id)).filter(Boolean);
 return `<details class="card appleGlassCard"><summary data-passed-summary>Passed places (${passed.length})</summary><p class="feedNote">These places are hidden from recommendations. Show one again to undo its pass and update your learned tastes.</p>${passed.map(r=>`<div class="row"><span>${esc(r.name)} · ${esc(r.city||cityName())}</span><button type="button" class="btn secondary" data-rest-action="dislike" data-rest-id="${esc(r.id)}" aria-label="Undo pass for ${esc(r.name)}">Show again</button></div>`).join('')||'<p class="feedNote">No passed places.</p>'}</details>`;
}
function renderPassportModal(){
  const visited=getActiveCatalog().filter(r=>state.feedback[r.id]==='visited').map(r=>rec(r));
  return `<div class="passportModalBackdrop" id="passportModalBackdrop" role="dialog" aria-modal="true" aria-labelledby="passportModalTitle">
    <div class="passportModalCard appleGlassCard">
      <div class="passportModalHeader">
        <div>
          <div class="passportModalBadge">✦ PALATE PASSPORT</div>
          <h2 id="passportModalTitle">Places You Have Visited</h2>
          <p>${visited.length} culinary stamp${visited.length===1?'':'s'} recorded in ${esc(cityName())}</p>
        </div>
        <button type="button" class="passportModalClose" data-action="close-passport" aria-label="Close passport">×</button>
      </div>
      <div class="passportPlacesList">
        ${visited.length ? visited.map(r=>{
          const openInfo=getVenueOpenStatus(r);
          return `<div class="passportPlaceItem" data-place-id="${esc(r.id)}">
            <div class="passportPlacePhoto">${photo(r)}</div>
            <div class="passportPlaceInfo">
              <div class="passportPlaceTop">
                <span class="passportStamp">✓ Stamped Visit</span>
                <span class="passportRating">★ ${Number(r.rating).toFixed(1)}</span>
              </div>
              <h3 class="passportPlaceName">${esc(r.name)}</h3>
              <p class="passportPlaceMeta">${esc(r.area||r.city)} · ${esc(displayPrice(r))}</p>
              <div class="passportStatusRow">
                <span class="passportOpenStatus ${openInfo.isOpen===null?'':openInfo.isOpen?'open':'closed'}">${openInfo.isOpen===null?'':openInfo.isOpen?'🟢 ':'🔴 '}${esc(openInfo.statusText)}</span>
              </div>
              <div class="passportPlaceActions">
                <button type="button" class="btn primary small" data-action="open-place" data-rest-id="${esc(r.id)}">Details →</button>
                <button type="button" class="btn secondary small" data-rest-action="maps" data-rest-id="${esc(r.id)}">Directions ↗</button>
              </div>
            </div>
          </div>`;
        }).join('') : `
          <div class="passportEmpty">
            <div class="passportEmptyIcon">🗺️</div>
            <h3>No Stamped Visits Yet</h3>
            <p>Whenever you dine at a café, bistro or restaurant in ${esc(cityName())}, tap <strong>"+ Mark Visited"</strong> to stamp your official Palate Passport!</p>
            <button type="button" class="btn primary" data-action="close-passport">Explore Recommendations →</button>
          </div>
        `}
      </div>
    </div>
  </div>`;
}

function showPalatePassportModal(){
  document.getElementById('passportModalBackdrop')?.remove();
  document.body.insertAdjacentHTML('beforeend',renderPassportModal());
  document.querySelector('.passportModalClose')?.focus();
}

function profile(){
  const a=state.answers||{},ai=state.ai||{likes:0,dislikes:0,visits:0,signals:{}};
  const currentBudget = a.budget || '';
  const currentDist = userLocation?String(a.distance ?? 'any'):'any';

  document.getElementById('root').innerHTML=`<section class="screen profile-screen" id="tasteStudioScreen">
    <!-- 1. Palate Genome Studio Header (From TasteStudioScreen.kt) -->
    <header class="tasteProfileHeader">
      <div class="profileMonogram" aria-hidden="true">✦</div>
      <div>
        <h1>Palate Genome Studio</h1>
        <p>Teach Palateo AI your culinary DNA &amp; flavor rules · Shaped by ${feedbackCount()} place ratings and ${Object.keys(normalizeDishFeedback(state.dishFeedback)).length} dish preferences.</p>
      </div>
    </header>

    <!-- 2. Palate Passport Visited Card & Cloud Sync Status (Tap to view visited places) -->
    <div class="card appleGlassCard palatePassportCard" data-action="open-passport" role="button" tabindex="0" aria-label="Open Palate Passport to view visited places" style="cursor:pointer;">
      <div class="passportCardContent">
        <div class="passportIconWrap">✨</div>
        <div class="passportInfo">
          <strong>Palate Passport <span class="passportTapHint">Tap to view visited spots →</span></strong>
          <p>Your tracked café, bistro &amp; restaurant visits in ${esc(cityName())}</p>
        </div>
      </div>
      <div class="passportBadges">
        <span class="passportVisitsBadge">🗺️ ${Number(ai.visits)||0} spots visited</span>
        <span class="cloudSyncBadge">☁️ Supabase Cloud Sync Active</span>
      </div>
    </div>

    <!-- 3. Palate Summary Card -->
    <div class="profileTasteSummary appleGlassCard">
      <h2>Your Taste DNA</h2>
      <div class="chips">${summaryChips()}</div>
      <p>Cuisine, spice and vibe preferences set the baseline. Dish feedback refines your matches in real-time.</p>
    </div>

    <!-- 4. Stats Grid -->
    <div class="statGrid profileStats">
      <div class="stat appleGlassStat"><b>${Number(ai.likes)||0}</b><span>likes</span></div>
      <div class="stat appleGlassStat"><b>${Number(ai.dislikes)||0}</b><span>passes</span></div>
      <div class="stat appleGlassStat" data-action="open-passport" role="button" tabindex="0" style="cursor:pointer;" title="View Visited Spots"><b>${Number(ai.visits)||0}</b><span>visits ↗</span></div>
      <div class="stat appleGlassStat"><b>${state.saves.length}</b><span>saved</span></div>
    </div>

    <button type="button" class="profileSavedLink" data-action="navigate" data-page="saved">
      <span>Saved places</span>
      <span>${state.saves.length} places →</span>
    </button>

    <div class="card appleGlassCard studioFilters" aria-label="Taste Genome Studio filters">
          <!-- Budget Selector (You section only) -->
          <div class="prefInteractiveGroup">
            <div class="prefLabelRow">
              <strong>Budget tier (optional)</strong>
              <span class="prefCurrentVal">${currentBudget?price(currentBudget):'Any budget'}</span>
            </div>
            <div class="budgetChoicePills" role="group" aria-label="Budget tier">
              ${[
                ['', 'Any budget'],
                ['under_500', 'Under ₹500'],
                ['500_1000', '₹500–₹1,000'],
                ['1000_2000', '₹1,000–₹2,000'],
                ['2000_plus', '₹2,000+']
              ].map(([val, lbl]) => `<button type="button" class="budgetPill ${currentBudget===val?'active':''}" aria-pressed="${currentBudget===val}" data-action="set-profile-budget" data-budget="${val}">${lbl}</button>`).join('')}
            </div>
          </div>

          <!-- Distance Filter (You section only) -->
          <div class="prefInteractiveGroup">
            <div class="prefLabelRow">
              <strong>Distance filter (optional)</strong>
              <span class="prefCurrentVal">${currentDist==='any'?'Anywhere in '+esc(cityName()):currentDist+' km'}</span>
            </div>
            <label for="profileDistance">Maximum distance</label>
            <input type="range" class="spiceMeter" id="profileDistance" min="0" max="51" step="1" value="${currentDist==='any'?51:Number(currentDist)}" aria-valuetext="${currentDist==='any'?'50+ km — anywhere in '+esc(cityName()):currentDist+' km'}" data-action="profile-distance">
            <div class="spiceMeterEnds"><span>0 km</span><span>50+ km · Anywhere in ${esc(cityName())}</span></div>
            <button type="button" class="distPill ${currentDist==='any'?'active':''}" aria-pressed="${currentDist==='any'}" data-action="set-profile-distance" data-distance="any">No distance limit</button>
            <p class="studioHint" id="profileDistanceHint">Optional. Choose 50+ for anywhere in ${esc(cityName())}. A shorter range needs your location. Without access, we show anywhere in this city.</p>
            <p class="studioFilterStatus" data-location-status role="status">${esc(locationStatusMessage)}</p>
          </div>

    </div>

    <div class="section"><h2>What you’ve taught us</h2><span>Active feedback</span></div>
        ${renderPassedPlaces()}
        <details class="card appleGlassCard learnedSignals">
          <summary>See learned taste signals</summary>
          ${Object.entries(ai.signals||{}).sort((x,y)=>y[1]-x[1]).slice(0,8).map(x=>`<div class="row"><strong>${esc(x[0])}</strong><span>${x[1]>0?'+':''}${Number(x[1]).toFixed(1)}</span></div>`).join('')||'<p class="feedNote">Rate a few places to start building your taste profile.</p>'}
        </details>
        <p class="feedNote">Taste matches are estimated from your sensory preferences, dish feedback, and verified receipts.</p>


    <!-- 6. Quick Dish Calibration Deck (From TasteStudioScreen.kt) -->
    ${renderCalibrationDeck()}

    <!-- 7. Privacy & Account Settings -->
    <details class="card appleGlassCard profilePrivacy">
      <summary>Privacy and account</summary>
      <p class="feedNote">For a copy or correction of your data, account deletion, consent withdrawal, or a privacy complaint, contact Aayush Mittal at palateo.com@gmail.com from your registered email. We may verify account ownership. Never send your password.</p>
      <div class="privacyActions">
        <button class="btn secondary" type="button" data-action="revoke-ai">Withdraw live AI permission</button>
        <button class="btn" type="button" data-action="delete-account">Delete my account</button>
        <a href="/support/">Help and support</a>
        <a href="mailto:palateo.com@gmail.com?subject=Palateo%20privacy%20request">Send a privacy request</a>
        <a href="/privacy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        <a href="/terms/" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>
      </div>
      <p class="feedNote">Signing out clears your Palateo preferences and profile details from this browser. Delete your account here to remove your cloud data.</p>
    </details>
  </section>`;
}

function closePalatePassportModal(){
 document.getElementById('passportModalBackdrop')?.remove();
 document.querySelector('[data-action="open-passport"]')?.focus();
}

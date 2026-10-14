function place(){
 const raw=activeRestaurant(detailRestaurantId);if(!raw){detailRestaurantId=null;page='home';home();return}
 const r=rec(raw),id=esc(r.id),f=state.feedback[r.id],saved=state.saves.includes(r.id);
 const openInfo=getVenueOpenStatus(r);
 const cuisines=(r.c||[]).filter(x=>!['Restaurant','Cafe'].includes(x));
 const primaryCategory=(r.c&&r.c.find(x=>!['Restaurant'].includes(x)))||'Artisanal Cafe';
 const categoryEmoji=r.emoji||(r.c?.includes('Cafe')?'☕':r.c?.includes('Desserts')||r.c?.includes('Dessert')?'🍰':'🍽️');

 const insights=Array.isArray(r.review_insights)&&r.review_insights.length?r.review_insights:[];
 const rawDishes=(r.signatureDishes&&r.signatureDishes.length)?r.signatureDishes:(insights.length?insights.slice(0,3).map((ins,idx)=>({
   id:r.id+'-dish-'+idx,
   name:ins.split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' '),
   price:r.p==='under_500'?'₹56':r.p==='500_1000'?'₹180':'₹320',
   description:`Signature crowd favourite highlighted in ${r.name} reviews`,
   tasteHighlight:ins.toLowerCase(),
   isVeg:!((r.dietaryOptions||[]).includes('non_veg')||(r.dietaryOptions||[]).includes('non_vegetarian'))
 })):availableCalibrationDishes().filter(d=>dishAffinity(r,d)>0).slice(0,2).map(d=>({
   id:d.id,
   name:d.name,
   price:r.p==='under_500'?'₹56':r.p==='500_1000'?'₹180':'₹320',
   description:d.description,
   tasteHighlight:d.name.toLowerCase(),
   isVeg:true
 })));

 const aboutSummary=r.description||`${r.name} in ${r.area||r.city||cityName()}.${insights.length?' '+insights.slice(0,2).join(', '):(cuisines.length?' '+cuisines.join(', '):'')}`;

 document.getElementById('root').innerHTML=`<article class="screen place-screen" aria-labelledby="placeTitle">
  <div class="placeHero">
    <div class="placeHeroPhoto" aria-hidden="true">${photo(r)}</div>
    <div class="placeHeroControls">
      <button type="button" id="placeBack" data-action="close-place" aria-label="Back to places">← Back</button>
      <button type="button" data-rest-action="save" data-rest-id="${id}" aria-pressed="${saved}" aria-label="${saved?'Remove saved':'Save'} ${esc(r.name)}">${saved?'Saved ✓':'Save'}</button>
    </div>
    <div class="placeHeroTitle">
      <div>
        <h1 id="placeTitle">${esc(r.name)}</h1>
        <p>${esc(r.area||r.city)} · ${esc(r.city||cityName())}</p>
      </div>
      <div class="placeMatch">
        <strong>${r.score}%</strong>
        <span>Palate match</span>
      </div>
    </div>
  </div>

  <div class="placeBody">
    <section class="aboutSpotSection" aria-labelledby="aboutSpotHeading">
      <h2 id="aboutSpotHeading" class="spotSectionHeading">About This Spot</h2>
      <p class="spotDescriptionText">${esc(aboutSummary)}</p>
      
      <div class="aboutSpotCard">
        <div class="aboutSpotHeader">
          <span class="aboutSpotCategoryBadge">${categoryEmoji} ${esc(primaryCategory)}</span>
          <span class="aboutSpotStatusPill ${openInfo.isOpen?'isOpen':'isClosed'}">
            <span class="statusDot"></span> ${esc(openInfo.statusText)}
          </span>
        </div>

        <div class="aboutSpotRow">
          <span class="rowIcon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </span>
          <span>${esc(openInfo.timingText)}</span>
        </div>

        <div class="aboutSpotRow">
          <span class="rowIcon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#fbbf24" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
          </span>
          <span>${esc(r.address||[r.area,r.city||cityName()].filter(Boolean).join(', '))}</span>
        </div>

        <div class="aboutSpotFooter">
          <span class="aboutSpotRating">⭐ ${Number(r.rating).toFixed(1)} <span>(${Number(r.review_count||0).toLocaleString()})</span></span>
          <span class="aboutSpotVerified">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="#ea4335" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg> Google Maps Verified
          </span>
        </div>
      </div>
    </section>

    <section class="signatureDishesSection" aria-labelledby="placeDishTitle">
      <h2 id="placeDishTitle">Signature Dishes &amp; Palate Match</h2>
      <p class="subtitle">Rate dishes to dynamically train your personal Palate Genome</p>

      <div class="signatureDishesDeck">
        ${rawDishes.map(d=>{
          const ratedVal=state.dishFeedback?.[d.id];
          const isLoved=ratedVal==='love';
          const isPassed=ratedVal==='pass';
          return `<div class="spotDishCard" data-dish-id="${esc(d.id)}">
            <div class="dishCardHead">
              <div class="dishTitleArea">
                <span class="${d.isVeg?'vegDot':'nonVegDot'}" aria-label="${d.isVeg?'Vegetarian':'Non-vegetarian'}"></span>
                <h3 class="dishName">${esc(d.name)}</h3>
              </div>
              <span class="dishPrice">${esc(d.price||'₹56')}</span>
            </div>
            <p class="dishDesc">${esc(d.description)}</p>
            <div class="dishCardActions">
              <span class="dishHighlightPill">✨ ${esc(d.tasteHighlight||d.name.toLowerCase())}</span>
              <div class="dishVoteArea">
                <span>Taste it?</span>
                <button type="button" class="dishVoteBtn thumbUp ${isLoved?'active':''}" data-action="dish-rate" data-dish-id="${esc(d.id)}" data-dish-value="love" data-source="detail" aria-pressed="${isLoved}" aria-label="Love ${esc(d.name)}">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="${isLoved?'#fbbf24':'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                </button>
                <button type="button" class="dishVoteBtn thumbDown ${isPassed?'active':''}" data-action="dish-rate" data-dish-id="${esc(d.id)}" data-dish-value="pass" data-source="detail" aria-pressed="${isPassed}" aria-label="Pass on ${esc(d.name)}">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="${isPassed?'#ef4444':'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>
                </button>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>

      <p class="calibrationStatus" role="status">${esc(dishSyncStatus||'Tap thumbs up or thumbs down to train your Palate Genome.')}</p>
    </section>

    <section class="placeBreakdown">
      <h2>Your palate match (${r.score}%)</h2>
      <p>${esc(r.why.join(' · '))}.</p>
      <div class="matchFactors">
        ${r.matchBreakdown.map(x=>`<div><span>${esc(x.label)}</span><strong class="${x.factor>.45?'fit':x.factor<-.45?'conflict':'unknown'}">${x.factor>.45?'Good fit':x.factor<-.45?'Different preference':'Limited detail'}</strong></div>`).join('')}
      </div>
    </section>

    <div class="spotStickyActionBar">
      <button type="button" class="btnVisited ${f==='visited'?'active':''}" data-rest-action="visited" data-rest-id="${id}" aria-pressed="${f==='visited'}">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>${f==='visited'?'✓ Visited':'+ Mark Visited'}</span>
      </button>
      <button type="button" class="btnDirections" data-rest-action="maps" data-rest-id="${id}">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        <span>Get Directions</span>
      </button>
    </div>
  </div>
 </article>`;
}

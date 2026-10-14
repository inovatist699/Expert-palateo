function profile(){
 const a=state.answers||{},ai=state.ai||{likes:0,dislikes:0,visits:0,signals:{}};
 const allRanked=ranked();
 const visitedCount=allRanked.filter(r=>state.feedback[r.id]==='visited').length;
 const persona=typeof resolvePalatePersona==='function'?resolvePalatePersona():'Flavour Explorer';
 const spiceVal=a.spice==='hot'?3:a.spice==='mild'?1:2;
 const spiceLabel=spiceVal===1?'Mild & Gentle (European / Coconut mild)':spiceVal===2?'Balanced Masala (Classic street & cafe spice)':'Fiery Desi Spice 🔥 (Gongura, Andhra, Ghee Roast)';

 const diets=[
   {key:'vegetarian',label:'🌱 Pure Veg'},
   {key:'eggetarian',label:'🥚 Eggetarian'},
   {key:'any',label:'🍖 Non-Veg'},
   {key:'vegan',label:'🥬 Vegan'},
   {key:'jain',label:'🌾 Jain'}
 ];

 const cuisineOptions=[
   'South Indian Gourmet','Craft Breweries','Coastal Seafood','Modern Progressive','Old Delhi Mughlai','Artisanal Coffee','Regional Thali','Continental Tapas'
 ];

 const vibeOptions=[
   'Lively Craft Brewery','Aesthetic Courtyard','Chic Rooftop','Heritage Breakfast Spot','Tropical Garden','Ultra-Chic Fine Dining'
 ];

 const activeCuisines=[...(preferredCuisines(a)||[])];
 const activeVibes=[...(preferredVibes(a)||[])];

 document.getElementById('root').innerHTML=`<section class="screen profile-screen tasteStudioScreen" id="tasteStudioScreen">
   <!-- Header matching TasteStudioScreen.kt -->
   <header class="tasteProfileHeader appleGlassHeader">
     <div class="profileMonogram" aria-hidden="true">✦</div>
     <div class="tasteHeaderInfo">
       <h1>Palate Genome Studio</h1>
       <p>Teach Palateo AI your culinary DNA &amp; flavor rules · Shaped by ${feedbackCount()} place ratings and ${Object.keys(normalizeDishFeedback(state.dishFeedback)).length} dish preferences.</p>
     </div>
   </header>

   <!-- Palate Passport Visited tracker card -->
   <div class="palatePassportCard appleGlassCard" data-action="navigate" data-page="home">
     <div class="passportLeft">
       <span class="passportEmoji">✨</span>
       <div>
         <strong>Palate Passport</strong>
         <p>Your tracked cafe &amp; restaurant visits across ${esc(cityName())}</p>
       </div>
     </div>
     <span class="passportCountBadge">${visitedCount} Visited</span>
   </div>

   <!-- Cloud Sync Status Pill -->
   <div class="cloudSyncPill">
     <span class="cloudDot"></span>
     <span class="cloudStatusText">☁️ Supabase Cloud Sync Active · Local Room Engine Ready</span>
   </div>

   <!-- Current Taste Genome Hero Card -->
   <div class="genomeHeroCard appleGlassCard">
     <div class="genomeTag">CURRENT TASTE GENOME</div>
     <div class="genomePersonaTitle">${esc(persona)}</div>
     <div class="genomeMeta">Active in ${esc(cityName())} · ${feedbackCount()} taste signals trained</div>
   </div>

   <!-- Studio Interactive Preferences Grid -->
   <div class="tasteStudioGrid">
     <!-- 1. Spice Tolerance Meter -->
     <div class="studioSectionCard appleGlassCard">
       <div class="studioSectionHeader">
         <h3>1. Spice Tolerance Meter</h3>
         <span class="studioActiveVal" id="spiceLabelDisplay">${esc(spiceLabel)}</span>
       </div>
       <div class="spicePillsRow" role="group" aria-label="Spice tolerance level">
         <button type="button" class="studioChoicePill ${spiceVal===1?'active':''}" data-action="set-studio-spice" data-spice="mild">1 · Mild &amp; Gentle</button>
         <button type="button" class="studioChoicePill ${spiceVal===2?'active':''}" data-action="set-studio-spice" data-spice="medium">2 · Balanced Masala</button>
         <button type="button" class="studioChoicePill ${spiceVal===3?'active':''}" data-action="set-studio-spice" data-spice="hot">3 · Fiery Desi 🔥</button>
       </div>
     </div>

     <!-- 2. Dietary Philosophy -->
     <div class="studioSectionCard appleGlassCard">
       <div class="studioSectionHeader">
         <h3>2. Dietary Philosophy</h3>
         <span class="studioSubnote">Filter venues respecting your dining ethics</span>
       </div>
       <div class="dietaryPillsRow" role="group" aria-label="Dietary preference">
         ${diets.map(d => `<button type="button" class="studioChoicePill ${a.diet===d.key?'active':''}" data-action="set-studio-diet" data-diet="${d.key}">${esc(d.label)}</button>`).join('')}
       </div>
     </div>

     <!-- 3. Favorite Regional Cuisines -->
     <div class="studioSectionCard appleGlassCard">
       <div class="studioSectionHeader">
         <h3>3. Favorite Regional Cuisines</h3>
         <span class="studioSubnote">Tap to toggle cuisines you crave most</span>
       </div>
       <div class="chipsPillsRow" role="group" aria-label="Favorite cuisines">
         ${cuisineOptions.map(c => {
           const isSel = activeCuisines.some(x => x.toLowerCase().includes(c.toLowerCase().split(' ')[0]));
           return `<button type="button" class="studioChoiceChip ${isSel?'active':''}" data-action="set-studio-cuisine" data-cuisine="${esc(c)}">${isSel?'✓ ':''}${esc(c)}</button>`;
         }).join('')}
       </div>
     </div>

     <!-- 4. Ambiance & Dining Vibes -->
     <div class="studioSectionCard appleGlassCard">
       <div class="studioSectionHeader">
         <h3>4. Ambiance &amp; Dining Vibes</h3>
         <span class="studioSubnote">Atmosphere preferences for your table</span>
       </div>
       <div class="chipsPillsRow" role="group" aria-label="Dining vibes">
         ${vibeOptions.map(v => {
           const isSel = activeVibes.some(x => x.toLowerCase().includes(v.toLowerCase().split(' ')[0]));
           return `<button type="button" class="studioChoiceChip ${isSel?'active':''}" data-action="set-studio-vibe" data-vibe="${esc(v)}">${isSel?'✨ ':''}${esc(v)}</button>`;
         }).join('')}
       </div>
     </div>
   </div>

   <!-- Profile Taste Summary for contract preservation -->
   <div class="profileTasteSummary appleGlassCard">
     <h2>Your taste preferences</h2>
     <div class="chips">${summaryChips()}</div>
     <p>Cuisine, spice and vibe preferences set the starting point. Dish feedback refines your matches.</p>
   </div>

   <!-- Stats Grid -->
   <div class="statGrid profileStats">
     <div class="stat"><b>${Number(ai.likes)||0}</b><span>likes</span></div>
     <div class="stat"><b>${Number(ai.dislikes)||0}</b><span>passes</span></div>
     <div class="stat"><b>${Number(ai.visits)||0}</b><span>visits</span></div>
     <div class="stat"><b>${state.saves.length}</b><span>saved</span></div>
   </div>

   <button type="button" class="profileSavedLink" data-action="navigate" data-page="saved">
     <span>Saved places</span>
     <span>${state.saves.length} places →</span>
   </button>

   <!-- Profile Columns -->
   <div class="profileColumns">
     <div>
       <div class="section"><h2>Your preferences</h2><span>Taste quiz</span></div>
       <div class="card">${[['Cuisine',a.cuisine||'Not set'],['Dietary preference',dietLabel(a.diet)],['Budget',price(a.budget)],['Vibe',a.mood||'Not set'],['Occasion',a.occasion||'Not set'],['Spice',a.spice||'Not set']].map(x=>`<div class="row"><strong>${x[0]}</strong><span>${esc(x[1])}</span></div>`).join('')}</div>
       <button class="btn primary profileRetake" type="button" data-action="reset-taste">Retake taste quiz</button>
     </div>
     <div>
       <div class="section"><h2>What you’ve taught us</h2><span>Active feedback</span></div>
       <details class="card learnedSignals">
         <summary>See learned taste signals</summary>
         ${Object.entries(ai.signals||{}).sort((x,y)=>y[1]-x[1]).slice(0,8).map(x=>`<div class="row"><strong>${esc(x[0])}</strong><span>${x[1]>0?'+':''}${Number(x[1]).toFixed(1)}</span></div>`).join('')||'<p class="feedNote">Rate a few places to start building your taste profile.</p>'}
       </details>
       <p class="feedNote">Taste matches are estimates from your preferences and feedback.</p>
     </div>
   </div>

   ${renderCalibrationDeck()}

   <details class="card profilePrivacy">
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

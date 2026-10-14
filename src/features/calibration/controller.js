function dishButtons(d,source='detail'){
 const selected=state.dishFeedback?.[d.id];
 return `<div class="dishFeedbackActions"><button type="button" data-action="dish-rate" data-dish-id="${d.id}" data-dish-value="pass" data-source="${source}" aria-pressed="${selected==='pass'}" aria-label="${selected==='pass'?'Undo pass':'Pass'}: ${esc(d.name)}">${selected==='pass'?'Undo pass':'Pass'}</button><button type="button" data-action="dish-rate" data-dish-id="${d.id}" data-dish-value="love" data-source="${source}" aria-pressed="${selected==='love'}" aria-label="${selected==='love'?'Undo love':'Love it'}: ${esc(d.name)}">${selected==='love'?'Undo love':'Love it'}</button></div>`;
}
function renderCalibrationDeck(){
 const dishes=availableCalibrationDishes(),d=dishes[dishCalibrationIndex%dishes.length],feedback=normalizeDishFeedback(state.dishFeedback),rated=dishes.filter(x=>feedback[x.id]);
 const example=ranked().find(r=>dishAffinity(r,d)>0);
 return `<section class="dishCalibration" aria-labelledby="calibrationTitle"><h2 id="calibrationTitle">Live dish calibration <span class="betaBadge">BETA</span></h2><p class="studioHint">Love a flavour or give it a pass. Your estimated matches update immediately.</p><div class="calibrationDish"><span class="calibrationProgress">${rated.length} active preferences · ${dishCalibrationIndex%dishes.length+1} of ${dishes.length}</span><h3 id="calibrationDishName" tabindex="-1">${esc(d.name)}</h3><p>${esc(d.description)}</p>${dishButtons(d,'deck')}<button type="button" class="dishSkip" data-action="dish-next">Skip this dish →</button></div>${lastCalibratedDish&&feedback[lastCalibratedDish]?`<button type="button" class="linkBtn" data-action="dish-undo" data-dish-id="${lastCalibratedDish}">Undo last dish feedback</button>`:''}<button type="button" class="dishRetry" data-action="dish-retry" ${state.unsyncedDishes?'':'hidden'}>Retry cloud sync</button><p class="calibrationStatus" role="status">${esc(dishSyncStatus||'Dish choices sync with your account.')}</p>${example?`<div class="calibrationMatch"><span>${esc(example.name)}</span><strong>${example.score}% estimated match</strong></div>`:''}<p class="studioHint">These are taste examples, not confirmed menu items. Venue matches use the cuisine and tags we have.</p>${rated.length?`<details class="ratedDishes"><summary>Edit ${rated.length} rated dishes</summary>${rated.map(x=>`<div class="ratedDish"><strong>${esc(x.name)}</strong>${dishButtons(x,'edit')}</div>`).join('')}</details>`:''}</section>`;
}
async function rateDish(id,value,source='detail'){
 if(!hasTasteProfile()||!calibrationDishes.some(d=>d.id===id)||!['love','pass'].includes(value))return;
 state.dishFeedback=normalizeDishFeedback(state.dishFeedback);
 const removed=state.dishFeedback[id]===value;
 if(removed)delete state.dishFeedback[id];else state.dishFeedback[id]=value;
 const revision=++dishRevision,ownerId=currentUser.id;
 state.unsyncedDishes=true;lastCalibratedDish=removed?null:id;dishSyncStatus='Matches recalculated · saving your dish preferences…';
 if(source==='deck'&&!removed)dishCalibrationIndex++;
 persist();updateMode();go(page,{keepScroll:true});
 if(source==='deck')document.getElementById('calibrationDishName')?.focus({preventScroll:true});
 else document.querySelector('[data-action="dish-rate"][data-dish-id="'+id+'"][data-dish-value="'+value+'"]')?.focus({preventScroll:true});
 feedbackSyncQueue=feedbackSyncQueue.catch(()=>{}).then(async()=>{
  if(currentUser?.id!==ownerId)return;
  let synced=false;
  try{await syncTaste();synced=true}catch(error){console.warn('Dish preferences did not sync');window.reportPalateoError?.('dish_sync_failed')}
  if(currentUser?.id!==ownerId||dishRevision!==revision)return;
  state.unsyncedDishes=!synced;dishSyncStatus=synced?'Matches updated · dish preferences saved to your account.':'Saved on this device · cloud sync failed. Retry when online.';persist();updateMode();
  const status=document.querySelector('.calibrationStatus');if(status)status.textContent=dishSyncStatus;
  const retry=document.querySelector('[data-action="dish-retry"]');if(retry)retry.hidden=synced;
  if(!synced)toast(dishSyncStatus);
 });
 return feedbackSyncQueue;
}
async function retryDishSync(){
 const ownerId=currentUser?.id,revision=dishRevision;if(!hasTasteProfile())return;
 feedbackSyncQueue=feedbackSyncQueue.catch(()=>{}).then(async()=>{
  if(currentUser?.id!==ownerId)return;
  const retry=document.querySelector('[data-action="dish-retry"]');if(retry)retry.disabled=true;
  let synced=false;try{await syncTaste();synced=true}catch(error){console.warn('Dish preferences did not sync')}
  if(currentUser?.id!==ownerId||dishRevision!==revision)return;
  state.unsyncedDishes=!synced;dishSyncStatus=synced?'Dish preferences synced to your account.':'Still saved on this device. Check your connection and retry.';persist();updateMode();
  const status=document.querySelector('.calibrationStatus');if(status)status.textContent=dishSyncStatus;
  if(retry){retry.disabled=false;retry.hidden=synced}
 });
 return feedbackSyncQueue;
}


let feedbackSyncQueue=Promise.resolve();
async function rateV5(id,t){
 const r=activeRestaurant(id);if(!r||!['like','dislike','visited'].includes(t))return;
 const removed=state.feedback[id]===t,ownerId=currentUser?.id;
 learn(r,removed?null:t);state.unsyncedFeedback=state.unsyncedFeedback||{};state.unsyncedFeedback[id]=removed?null:t;persist();go(page,{keepScroll:true});
 if(t==='dislike'&&page==='profile')document.querySelector('[data-passed-summary]')?.focus({preventScroll:true});
 // Keep cloud history ordered while allowing an immediate undo in the UI.
 feedbackSyncQueue=feedbackSyncQueue.catch(()=>{}).then(async()=>{
  if(currentUser?.id!==ownerId)return;
  let cloudOk=true;
  if(currentUser){try{cloudOk=r.dbId?(await syncInteraction(r,t,{removed})):true;if(currentUser?.id!==ownerId)return;if(cloudOk)await syncTaste()}catch(error){cloudOk=false;console.warn('feedback sync',error);window.reportPalateoError?.('feedback_sync_failed')}}
  if(currentUser?.id!==ownerId)return;
  if((state.feedback[id]||null)!==(removed?null:t))return;
  if(cloudOk)delete state.unsyncedFeedback[id];
  persist();
  const message=removed?'Rating removed · Your palate was updated':t==='like'?'Palate updated ❤️':t==='visited'?'Visit learned ✓':'Hidden from recommendations · Undo in Palate → Passed places';
  toast(currentUser&&!cloudOk?'Saved on this device; cloud sync failed.':message);
 });
 return feedbackSyncQueue;
}

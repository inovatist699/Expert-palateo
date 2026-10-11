function rate(id,t){const r=activeRestaurant(id)||catalog.find(x=>x.id===id);learn(r,t);toast(t==='like'?'Palate updated ❤️':t==='visited'?'Visit learned ✓':'We’ll show you less like this');go(page)}
function saveRest(id){const i=state.saves.indexOf(id);if(i>=0){state.saves.splice(i,1);toast('Removed from saved')}else{state.saves.push(id);toast('Saved ♥')}persist();go(page)}
function follow(id){const i=state.follows.indexOf(id);if(i>=0){state.follows.splice(i,1);toast('Connection removed')}else{state.follows.push(id);toast('Connected ✨')}persist();go('social')}
function maps(id){const r=activeRestaurant(id)||catalog.find(x=>x.id===id);if(!r)return;window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(r.name+' '+(r.area||r.city||selectedCity)+' '+(r.city||selectedCity)),'_blank','noopener,noreferrer')}
function resetTaste(){state.onboarded=false;state.retakeInProgress=true;state.answers={};state.onboardingStep=0;persist();onboard(0)}


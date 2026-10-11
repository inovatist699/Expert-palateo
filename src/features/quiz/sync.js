async function finishV5(){
 if(!currentUser||authRequired){requireAuthGate();return}
 if(!hasTasteAnswers()){go('home');toast('Answer every taste question to build your palate.');return}
 state.onboarded=true;state.retakeInProgress=false;state.onboardingStep=null;rebuildLearning();persist();
 let syncOk=!currentUser;if(currentUser)try{await syncTaste();syncOk=true}catch(e){syncOk=false;console.warn('taste sync',e)}
 document.getElementById('nav').classList.remove('hide');go('home');
 toast(!currentUser?'Your palate is ready — sign in anytime to sync':syncOk?'Your palate is synced ✨':'Saved on this device; cloud sync failed.');
}

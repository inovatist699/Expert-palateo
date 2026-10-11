async function initV5(){
 // The app opens directly; no blocking brand intro.
 const authFragment=new URLSearchParams(location.hash?.slice(1)||'');
 passwordRecovery=authFragment.get('type')==='recovery';
updateCityPicker();
if(!state.answers||typeof state.answers!=='object')state.answers={};
if(!state.feedback||typeof state.feedback!=='object')state.feedback={};
if(!Array.isArray(state.saves))state.saves=[];
if(!Array.isArray(state.follows))state.follows=[];
if(!state.ai||typeof state.ai!=='object')state.ai={likes:0,dislikes:0,visits:0,signals:{}};
if(!state.ai.signals||typeof state.ai.signals!=='object')state.ai.signals={};
state.dishFeedback=normalizeDishFeedback(state.dishFeedback);
 try{currentUser=await ensureBackend();backendReady=!!currentUser;authRequired=!currentUser||!hasLegalConsent(currentUser);startAuthListener();if(currentUser&&hasLegalConsent(currentUser)&&!state.retakeInProgress)await loadCloudState()}
 catch(error){backendReady=false;useAccount(null);authRequired=true;console.warn('Supabase authentication is unavailable',error);window.reportPalateoError?.('auth_connection_failed');updateMode();requireAuthGate('Palateo could not reach sign-in right now. Check your connection and retry.')}
 if(authFragment.has('error')){passwordRecovery=false;requireAuthGate('This email link is invalid or expired. Request a new email below.');return}
 if(!currentUser){requireAuthGate();return}
 if(passwordRecovery){showPasswordRecovery();return}
 if(!hasLegalConsent(currentUser)){requireLegalConsent();return}
 authRequired=false;
 if(new URL(location.href).searchParams.get('quiz')==='1'){state.retakeInProgress=true;state.onboarded=false;persist();onboard(0);return}
 if(!state.onboarded){const savedStep=Number.isInteger(state.onboardingStep)?state.onboardingStep:Math.max(0,questions.findIndex(q=>!state.answers[q.k]));onboard(savedStep<0?questions.length-1:savedStep)}
else{document.getElementById('nav').classList.remove('hide');go('home')}
}
window.Palateo={connectBackend:ensureBackend,signIn:signInV5,signUp:signUpV5,signOut:signOutV5,showAuth,ranked,rate:rateV5,saveRest:saveV5};
document.addEventListener('error',event=>{if(event.target instanceof HTMLImageElement&&event.target.closest('.photo,.zestSheetPhoto,.placeHeroPhoto'))event.target.hidden=true},true);
document.addEventListener('keydown',event=>{const pin=event.target instanceof Element?event.target.closest('[data-action="select-pin"]'):null;if(pin&&(event.key==='Enter'||event.key===' ')){event.preventDefault();pin.dispatchEvent(new MouseEvent('click',{bubbles:true}))}});
initV5();


function startAuthListener(){
if(!supabaseClient||supabaseAuthListenerReady)return;
supabaseAuthListenerReady=true;
 supabaseClient.auth.onAuthStateChange((_event,session)=>{
 useAccount(session?.user||null);updateMode();
 if(_event==='PASSWORD_RECOVERY'){passwordRecovery=true;setTimeout(showPasswordRecovery,0);return}
 if(passwordRecovery)return;
 if(!currentUser){requireAuthGate('Sign in to continue.');return}
 if(!hasLegalConsent(currentUser)){requireLegalConsent();return}
 authRequired=false;
  if(!['INITIAL_SESSION','SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(_event))return;
  if(!state.retakeInProgress)setTimeout(async()=>{if(state.retakeInProgress)return;await loadCloudState();if(state.retakeInProgress)return;if(state.onboarded)go(page);else onboard(Number.isInteger(state.onboardingStep)?state.onboardingStep:0)},0);
});
}

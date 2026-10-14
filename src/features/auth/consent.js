const LEGAL_VERSION='2026-10-14';
let legalConsentBusy=false;
function consentControls(){return '<div class="consentNotice"><p>Your account details, taste choices and activity are used for sign-in, personalised recommendations and cloud sync. Location is optional. Read the policies before choosing.</p><label class="consentChoice"><input id="legalTerms" type="checkbox" required><span>I agree to the <a href="/terms/" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>.</span></label><label class="consentChoice"><input id="legalPrivacy" type="checkbox" required><span>I consent to the account, recommendation and sync processing described in the <a href="/privacy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>. I can withdraw this consent by contacting Palateo.</span></label><p class="consentHelp">If you are under 18, use Palateo with a parent or guardian’s knowledge and permission.</p></div>'}
function readLegalConsent(){return {terms:document.getElementById('legalTerms')?.checked===true,privacy:document.getElementById('legalPrivacy')?.checked===true}}
function legalMetadata(consent){
 if(consent?.terms!==true)throw new Error('Please read and accept the Terms & Conditions.');
 if(consent?.privacy!==true)throw new Error('Please read the Privacy Policy and choose whether to consent.');
 return {palateo_legal_version:LEGAL_VERSION,palateo_legal_accepted_at:new Date().toISOString(),palateo_privacy_consent:true};
}
function hasLegalConsent(user){const m=user?.user_metadata||{};return m.palateo_legal_version===LEGAL_VERSION&&m.palateo_privacy_consent===true}
function useAccount(user){
 const id=user?.id||null;
 if(state.userId!==id||(!user&&(state.profile||state.onboarded))){state={selectedCity,userId:id,answers:{},feedback:{},dishFeedback:{},saves:[],follows:[],ai:{likes:0,dislikes:0,visits:0,signals:{}}};userLocation=null;dishRevision++;dishCalibrationIndex=0;dishSyncStatus='';lastCalibratedDish=null;detailRestaurantId=null}
 currentUser=user;backendReady=!!user;authRequired=!user||!hasLegalConsent(user);state.userId=id;state.backendConnected=!!supabaseClient;
 if(user&&['auth','consent'].includes(page))page='home';
 persist();
}
function requireLegalConsent(){
 authRequired=true;page='consent';document.getElementById('nav')?.classList.add('hide');
 document.getElementById('root').innerHTML='<section class="authGate"><div class="eyebrow">Your privacy matters</div><h1>Your palate, your choice.</h1><p>Review how Palateo uses your data before continuing. You can read both policies without signing in.</p></section>';
 document.getElementById('authModal')?.remove();
 document.body.insertAdjacentHTML('beforeend','<div class="modal authRequired" id="authModal" role="dialog" aria-modal="true" aria-labelledby="legalTitle"><div class="modalCard"><div class="eyebrow">Policies · 14 October 2026</div><h2 id="legalTitle">Before you continue</h2><form data-action="legal-submit">'+consentControls()+'<div class="status" id="legalStatus" aria-live="polite"></div><div class="modalActions"><button class="btn secondary" type="button" data-action="legal-decline">Sign out</button><button class="btn green" type="submit" id="legalSubmit">Accept and continue</button></div></form><p class="legalLinks">Questions? <a href="mailto:palateo.com@gmail.com">Contact Palateo</a></p></div></div>');
 document.getElementById('legalTerms')?.focus();
}
async function acceptLegalConsent(){
 if(legalConsentBusy)return;
 const status=document.getElementById('legalStatus'),button=document.getElementById('legalSubmit');
 try{
  const metadata=legalMetadata(readLegalConsent());if(!currentUser)throw new Error('Sign in again to continue.');
  legalConsentBusy=true;if(button)button.disabled=true;if(status){status.dataset.kind='loading';status.textContent='Saving your choice…'}
  if(isRailwayActive()){
   const data=await railwayFetch('/api/auth/update-user',{method:'POST',body:JSON.stringify(metadata)});
   if(!data.status)throw Error('Your choice was not saved. Please retry.');
   const user=await betterAuthGetSession();if(!user)throw Error('Please sign in again.');
   useAccount(user);closeAuth();await initV5();toast('Your choice has been saved.');return;
  }
  const {data,error}=await getSupabaseClient().auth.updateUser({data:metadata});if(error)throw error;if(!data?.user)throw new Error('Your choice was not saved. Please try again.');
  useAccount(data.user);await logEvent('legal_consent',{version:LEGAL_VERSION});closeAuth();await initV5();toast('Your choice has been saved.');
 }catch(error){if(status){status.dataset.kind='error';status.textContent=error.message||'Could not save your choice. Please try again.'}}
 finally{legalConsentBusy=false;if(button)button.disabled=false}
}



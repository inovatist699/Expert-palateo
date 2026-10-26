async function signInV5(email,password){
if(isRailwayActive()){
const user=await betterAuthSignIn(email,password);
authRequired=!hasLegalConsent(user);
backendReady=true;
if(!hasLegalConsent(user)){updateMode();requireLegalConsent();return}
const md=user.user_metadata||{};
const profilePayload={id:user.id,display_name:md.full_name||md.name||email.split('@')[0],phone:md.phone||null,email:user.email||email};
state.profile={name:profilePayload.display_name,phone:profilePayload.phone||'',email:profilePayload.email||''};
state.userId=user.id;state.backendConnected=true;persist();
const cloudLoaded=state.retakeInProgress?true:await loadRailwayCloudState();
updateMode();closeAuth();document.getElementById('nav')?.classList.remove('hide');go('home');
toast(cloudLoaded?'Welcome back ✨':'Signed in, but some cloud data could not sync.');
return;
}
const client=getSupabaseClient();
const {data,error}=await client.auth.signInWithPassword({email,password});
if(error)throw error;
 useAccount(data.session?.user||data.user||null);
 if(!data.session||!currentUser)throw new Error('Sign-in did not return an active session. Confirm your email, then try again.');
 authRequired=!hasLegalConsent(currentUser);
 backendReady=true;
 if(!hasLegalConsent(currentUser)){updateMode();requireLegalConsent();return}
const md=currentUser.user_metadata||{};
const profilePayload={id:currentUser.id,display_name:md.full_name||md.name||email.split('@')[0],phone:md.phone||null,email:currentUser.email||email};
state.profile={name:profilePayload.display_name,phone:profilePayload.phone||'',email:profilePayload.email||''};
let profileSyncOk=true;try{const {error:pe}=await client.from('profiles').upsert(profilePayload,{onConflict:'id'});if(pe)throw pe;}catch(e){profileSyncOk=false;console.warn('profile sync',e);}
state.userId=currentUser.id;state.backendConnected=true;persist();
 const cloudLoaded=state.retakeInProgress?true:await loadCloudState();
updateMode();closeAuth();document.getElementById('nav').classList.remove('hide');go('home');
toast(profileSyncOk&&cloudLoaded?'Welcome back ✨':'Signed in, but some cloud data could not sync.');
}
async function signUpV5(name,phone,email,password,consent){
if(isRailwayActive()){
const user=await betterAuthSignUp(name,phone,email,password,consent);
authRequired=false;backendReady=true;
await logEvent('account_created',{has_phone:!!phone,has_email:!!email});
updateMode();closeAuth();document.getElementById('nav')?.classList.remove('hide');onboard(0);
toast('Account created — build your palate next ✓');
return;
}
const metadata=legalMetadata(consent);
const client=getSupabaseClient();
const {data,error}=await client.auth.signUp({email,password,options:{emailRedirectTo:'https://palateo.in/app/',data:{name,full_name:name,phone,...metadata}}});
if(error)throw error;
if(!data?.user)throw new Error('Supabase did not return a new user. Please try again.');
const profile={name,phone,email};
useAccount(data.session?.user||null);
if(currentUser)state.profile=profile;state.backendConnected=true;
state.userId=currentUser?.id||null;persist();
if(!data.session||!currentUser){
updateMode();
showAuth('login','Account created. Confirm your email, then sign in.');
return;
}
const profilePayload={id:currentUser.id,display_name:name,phone:phone||null,email:email||null,onboarding_completed:!!state.onboarded};
let syncOk=true;
try{const {error:pe}=await client.from('profiles').upsert(profilePayload,{onConflict:'id'});if(pe){syncOk=false;console.warn('profile sync',pe);}}catch(e){syncOk=false;console.warn('profile sync',e);}
state.userId=currentUser.id;persist();
  if(!state.retakeInProgress&&!(await loadCloudState()))syncOk=false;
await logEvent('account_created',{has_phone:!!phone,has_email:!!email});
  updateMode();closeAuth();document.getElementById('nav').classList.remove('hide');onboard(0);toast(syncOk?'Account created — build your palate next ✓':'Account created; profile sync needs attention');
}
async function signOutV5(){
if(isRailwayActive()){
await betterAuthSignOut();
state.backendConnected=false;persist();updateMode();requireAuthGate('You’ve signed out. Sign in again to use Palateo.');
return;
}
try{
const {error}=await supabaseClient.auth.signOut();if(error)throw error;
useAccount(null);state.backendConnected=false;persist();updateMode();requireAuthGate('You’ve signed out. Sign in again to use Palateo.');
}catch(error){console.warn('sign out',error);toast('Could not reach Palateo right now. Try signing out again.')}
}
async function verifyWithTruecaller(options={}){
 let tcResult=null;
 const phoneInput=options.phone||null;

 if(!phoneInput&&window.PalateoNative?.truecaller){
  const isAvail=await window.PalateoNative.truecaller.isAvailable().catch(()=>false);
  if(isAvail){
   tcResult=await window.PalateoNative.truecaller.verifyMobile(options).catch(err=>{
    console.warn('[Truecaller Native] Failed:', err);
    return null;
   });
  }
 }
 if(!phoneInput&&!tcResult){
  if(options.code){
   tcResult={authorizationCode:options.code,codeVerifier:options.codeVerifier||''};
  }else if(typeof location!=='undefined'&&/localhost|127\.0\.0\.1|preview/i.test(location.host)&&!/Android/i.test(navigator.userAgent)){
   tcResult={authorizationCode:'mock_truecaller_preview_'+Date.now(),codeVerifier:'mock_verifier'};
  }
 }
 const endpoint=isRailwayActive()?'/api/auth/truecaller':'/api/truecaller';
 let verifyData=null;
 if(phoneInput){
  const payload={phone:phoneInput,name:options.name||'Palateo Foodie'};
  if(isRailwayActive()){
   verifyData=await railwayFetch('/api/auth/truecaller',{
    method:'POST',
    body:JSON.stringify(payload)
   });
  }else{
   const res=await fetch(endpoint,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
   });
   if(!res.ok){
    const errBody=await res.json().catch(()=>({}));
    throw new Error(errBody.error||'Mobile verification could not be completed.');
   }
   verifyData=await res.json();
  }
 }else if(tcResult&&tcResult.authorizationCode){
  const payload={
   code:tcResult.authorizationCode,
   codeVerifier:tcResult.codeVerifier,
   clientId:'palateo_android_client_id'
  };
  if(isRailwayActive()){
   verifyData=await railwayFetch('/api/auth/truecaller',{
    method:'POST',
    body:JSON.stringify(payload)
   });
  }else{
   const res=await fetch(endpoint,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
   });
   if(!res.ok){
    const errBody=await res.json().catch(()=>({}));
    throw new Error(errBody.error||'Truecaller verification could not be completed.');
   }
   verifyData=await res.json();
  }
 }else{
  if(typeof showMobileVerificationModal==='function'){
   showMobileVerificationModal(document.getElementById('authPhone')?.value||'');
   return null;
  }
  throw new Error('Please enter your mobile number for verification.');
 }
 if(!verifyData||!verifyData.user){
  throw new Error('Verification completed but no user session was returned.');
 }
 const user=verifyData.user;
 useAccount(user);
 authRequired=false;
 backendReady=true;
 if(verifyData.token&&typeof window!=='undefined'&&window.localStorage){
  betterAuthToken=verifyData.token;
  window.localStorage.setItem('better_auth_token',verifyData.token);
 }
 state.profile={
  name:user.name||user.display_name||options.name||'Palateo Foodie',
  phone:verifyData.phone||user.phone||phoneInput||'',
  email:user.email||''
 };
 state.userId=user.id;
 state.backendConnected=true;
 persist();
 await logEvent('account_verified_truecaller',{has_phone:true,provider:'truecaller'});
 updateMode();
 closeAuth();
 document.getElementById('mobileVerifyModal')?.remove?.();
 document.getElementById('nav')?.classList.remove('hide');
 if(!state.onboarded){
  onboard(0);
 }else{
  go('home');
 }
 toast('Mobile verified with Truecaller ✨');
 return user;
}

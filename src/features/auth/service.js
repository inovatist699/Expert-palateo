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
async function truecallerRequest(body,action=''){
 const response=await fetch('https://palateo.in/api/truecaller'+(body?(action?'?action='+action:''):'?action=config'),{
  method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},
  ...(body?{body:JSON.stringify(body)}:{}),cache:'no-store',signal:AbortSignal.timeout(30000)
 });
 const result=await response.json();
 if(!response.ok)throw new Error(result.error||'Truecaller is unavailable. Use email sign-in.');
 return result;
}
async function refreshTruecallerButtons(){
 const buttons=Array.from(document.querySelectorAll('[data-action="truecaller-verify"]'));
 if(!buttons.length||isRailwayActive())return;
 try{
  const config=await truecallerRequest();
  const available=(!currentUser||config.linking===true)&&(window.PalateoNative?.truecaller?config.android===true:config.web===true&&/Android/i.test(navigator.userAgent));
  for(const button of buttons)if(button.isConnected)button.hidden=!available;
  const help=document.querySelector('[data-truecaller-help]');if(help)help.hidden=!available;
 }catch{/* Email remains available when optional verification cannot be reached. */}
}
async function verifyWithTruecaller({link=false,reauthenticate=false}={}){
 if(isRailwayActive())throw new Error('Truecaller requires Palateo’s shared account service. Use email sign-in.');
 const config=await truecallerRequest(),native=window.PalateoNative?.truecaller;
 if(native?config.android!==true:config.web!==true||!/Android/i.test(navigator.userAgent))throw new Error('Truecaller sign-in is unavailable here. Please sign in with email.');
 const owner=currentUser?.id;
 if(link&&!owner)throw new Error('Sign in to your existing account before linking Truecaller.');
 if(link&&config.linking!==true)throw new Error('Truecaller account linking is not available yet.');
 const bytes=crypto.getRandomValues(new Uint8Array(32));
 const nonce=btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 let result;
 if(native){
  await native.prepare();
  if(!await native.isAvailable())throw new Error('Install or open Truecaller on this Android device, or use email sign-in.');
  const verification=await native.verifyMobile();
  result=await truecallerRequest({authorizationCode:verification.authorizationCode,codeVerifier:verification.codeVerifier,nonce});
 }else{
  const flow=await truecallerRequest({nonce},'web-start');
  const query=new URLSearchParams({type:'btmsheet',requestNonce:flow.requestId,partnerKey:flow.partnerKey,
   partnerName:'Palateo',lang:'en',privacyUrl:'https://palateo.in/privacy/',termsUrl:'https://palateo.in/terms/',
   loginPrefix:'continue',loginSuffix:'signin',ctaPrefix:'continuewith',skipOption:'useanothermethod',ttl:'60000'});
  window.location.href='truecallersdk://truesdk/web_verify?'+query;
  for(let attempt=0;attempt<20;attempt++){
   await new Promise(resolve=>setTimeout(resolve,3000));
   if(currentUser?.id!==owner)throw new Error('Account changed. Please start verification again.');
   result=await truecallerRequest({requestId:flow.requestId,completionSecret:flow.completionSecret,nonce},'web-poll');
   if(result.status!=='waiting')break;
  }
  if(result?.status==='waiting')throw new Error('Truecaller verification timed out. Try again or use email sign-in.');
 }
 if(currentUser?.id!==owner)throw new Error('Account changed. Please start verification again.');
 if(result.provider!=='custom:palateo-truecaller'||typeof result.idToken!=='string')throw new Error('Truecaller returned an invalid verification response.');
 const client=getSupabaseClient(),credentials={provider:result.provider,token:result.idToken,nonce};
 const {data,error}=link?await client.auth.linkIdentity(credentials):await client.auth.signInWithIdToken(credentials);
 if(error)throw error;
 if(!data?.session||!data.user?.id)throw new Error('Truecaller did not return an active Palateo session. Use email sign-in.');
 if((link||reauthenticate)&&data.user.id!==owner){
  await client.auth.signOut({scope:'local'});useAccount(null);
  throw new Error('Truecaller belongs to a different account. Sign in again to continue.');
 }
 useAccount(data.user);
 if(reauthenticate)return data.user;
 if(!hasLegalConsent(currentUser)){updateMode();requireLegalConsent();return data.user}
 closeAuth();await initV5();
 toast(link?'Truecaller linked to this account.':'Signed in with Truecaller.');
 return data.user;
}

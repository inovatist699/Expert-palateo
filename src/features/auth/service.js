async function signInV5(email,password){
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
try{
const {error}=await supabaseClient.auth.signOut();if(error)throw error;
useAccount(null);state.backendConnected=false;persist();updateMode();requireAuthGate('You’ve signed out. Sign in again to use Palateo.');
}catch(error){console.warn('sign out',error);toast('Could not reach Palateo right now. Try signing out again.')}
}

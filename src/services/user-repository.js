async function logEvent(eventName,metadata={}){
 if(!currentUser||!backendReady)return false;
 try{
  const {error}=await supabaseClient.from('app_events').insert({user_id:currentUser.id,event_name:eventName,metadata});
  if(error)throw error;
  return true;
 }catch(error){console.warn('event sync',error);return false;}
}
async function syncTaste(){
 if(!currentUser)throw new Error('Sign in to sync your taste profile.');
 if(!hasTasteAnswers())throw new Error('Complete your taste profile before syncing it.');
 const owner=currentUser,a=state.answers||{};
 const payload={user_id:owner.id,cuisines:a.cuisine?{primary:a.cuisine,favorites:preferredCuisines(a)}:{},spice_level:a.spice||null,budget:a.budget||null,ambience:a.mood?{primary:a.mood,favorites:preferredVibes(a)}:{},occasions:a.occasion?{primary:a.occasion}:{},priorities:{...(a.priority?{primary:a.priority}:{}),dietary_preference:a.diet||'any',dish_feedback:normalizeDishFeedback(state.dishFeedback)},max_distance_km:a.distance==='any'?null:Number(a.distance||5),confidence:Number(state.confidence??0),taste_vector:state.ai?.signals||{}};
 const {error}=await supabaseClient.from('taste_profiles').upsert(payload);
 if(error)throw error;
 if(currentUser?.id!==owner.id)throw new Error('Account changed during taste sync.');
 const {data:profile,error:profileError}=await supabaseClient.from('profiles').update({onboarding_completed:true}).eq('id',owner.id).select('id').maybeSingle();
 if(profileError)throw profileError;
 if(currentUser?.id!==owner.id)throw new Error('Account changed during taste sync.');
 if(!profile){
  const {error:upsertErr}=await supabaseClient.from('profiles').upsert({id:owner.id,email:owner.email,display_name:owner.user_metadata?.full_name||owner.email?.split('@')[0]||'Palateo User',onboarding_completed:true},{onConflict:'id'});
  if(upsertErr)throw upsertErr;
 }
 if(currentUser?.id!==owner.id)throw new Error('Account changed during taste sync.');
 await logEvent('onboarding_complete',{answer_count:Object.keys(a).length});
 return true;
}
async function syncInteraction(rest,type,metadata={}){
 if(!currentUser||!rest?.dbId)return false;
 const {error}=await supabaseClient.from('interactions').insert({user_id:currentUser.id,restaurant_id:rest.dbId,type,source:'palateo_v5',metadata});
 if(error)throw error;
 return true;
}
async function syncSave(rest,saved){
 if(!currentUser)throw new Error('Sign in to sync your saved places.');
 if(!rest?.dbId)throw new Error('This place is not available in the cloud catalogue.');
 const result=saved?await supabaseClient.from('saved_restaurants').upsert({user_id:currentUser.id,restaurant_id:rest.dbId}):await supabaseClient.from('saved_restaurants').delete().eq('user_id',currentUser.id).eq('restaurant_id',rest.dbId);
 if(result.error)throw result.error;
 return true;
}
async function loadAllRows(query){
 const rows=[];
 for(let offset=0;;offset+=500){
  const {data,error}=await query.range(offset,offset+499);
  if(error)return {data:null,error};
  rows.push(...(data||[]));if(!data||data.length<500)return {data:rows,error:null};
 }
}
async function loadCloudState(){
 if(!currentUser)return false;
 const requestUserId=currentUser.id;
 const requestAnswers=state.answers;
 const requestFeedbackRevision=feedbackRevision;
 const requestDishRevision=dishRevision;
 try{
  const [profileResult,tasteResult,savesResult,interactionsResult]=await Promise.all([
   supabaseClient.from('profiles').select('display_name,phone,email,profile_photo_url,bio').eq('id',currentUser.id).maybeSingle(),
   supabaseClient.from('taste_profiles').select('*').eq('user_id',currentUser.id).maybeSingle(),
   loadAllRows(supabaseClient.from('saved_restaurants').select('restaurant_id').eq('user_id',currentUser.id).order('restaurant_id')),
   loadAllRows(supabaseClient.from('interactions').select('restaurant_id,type,metadata,created_at').eq('user_id',currentUser.id).order('created_at',{ascending:true}).order('id'))
  ]);
  for(const result of [profileResult,tasteResult,savesResult,interactionsResult])if(result.error)throw result.error;
   if(currentUser?.id!==requestUserId||state.userId!==requestUserId)return false;
   const profile=profileResult.data,t=tasteResult.data,sv=savesResult.data||[],ix=interactionsResult.data||[];
  if(profile)state.profile={name:profile.display_name||'',phone:profile.phone||'',email:profile.email||currentUser?.email||'',photo:profile.profile_photo_url||'',bio:profile.bio||''};
  if(t&&!state.retakeInProgress&&state.answers===requestAnswers){
   state.confidence=Number(t.confidence||state.confidence||82);
   const a={};
   if(t.cuisines?.primary)a.cuisine=t.cuisines.primary;
   if(Array.isArray(t.cuisines?.favorites))a.cuisines=t.cuisines.favorites.filter(x=>Object.hasOwn(cuisineAliases,x));
   if(t.spice_level)a.spice=t.spice_level;
   if(t.budget)a.budget=t.budget;
   if(t.ambience?.primary)a.mood=t.ambience.primary;
   if(Array.isArray(t.ambience?.favorites))a.vibes=t.ambience.favorites.filter(x=>['quiet','lively','date','family'].includes(x));
   if(t.occasions?.primary)a.occasion=t.occasions.primary;
   if(t.priorities?.primary)a.priority=t.priorities.primary;
   if(t.priorities?.dietary_preference)a.diet=t.priorities.dietary_preference;
    if(t.max_distance_km===null)a.distance='any';else if(t.max_distance_km!==undefined)a.distance=String(t.max_distance_km);
   if(hasTasteAnswers(a)){state.answers=a;state.onboarded=true;state.ai=state.ai||{likes:0,dislikes:0,visits:0,signals:{}};state.ai.signals=t.taste_vector||state.ai.signals||{}}
   else if(!hasTasteProfile()){state.onboarded=false;state.answers={...a,...state.answers}}
  }
  state.cloudSaves=sv.map(x=>x.restaurant_id);
  if(t&&dishRevision===requestDishRevision&&!state.unsyncedDishes)state.dishFeedback=normalizeDishFeedback(t.priorities?.dish_feedback);
  if(dbCatalog.length){const ids=new Set(state.cloudSaves),localOnly=state.saves.filter(id=>!dbCatalog.some(r=>r.id===id));state.saves=[...new Set([...dbCatalog.filter(r=>ids.has(r.dbId)).map(r=>r.id),...localOnly])];}
  if(dbCatalog.length&&feedbackRevision===requestFeedbackRevision){const byDb=new Map(dbCatalog.map(r=>[r.dbId,r]));for(const r of dbCatalog)delete state.feedback[r.id];for(const row of ix){const r=byDb.get(row.restaurant_id);if(r&&['like','dislike','visited'].includes(row.type)){if(row.metadata?.removed===true)delete state.feedback[r.id];else state.feedback[r.id]=row.type;}}}
  Object.assign(state.feedback,state.unsyncedFeedback||{});
  rebuildLearning();
  persist();
  return true;
 }catch(error){console.warn('cloud load',error);window.reportPalateoError?.('cloud_load_failed');return false;}
}

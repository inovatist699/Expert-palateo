function makeSupabaseClient(url,key){
  return window.supabase.createClient(url,key,{
    auth:{
      autoRefreshToken:true,
      persistSession:true,
      detectSessionInUrl:true,
      storage:palateoAuthStorage
    }
  });
}

function getSupabaseClient(){
if(!window.supabase)throw new Error('Supabase library did not load. Check your internet connection and try again.');
if(!supabaseClient)supabaseClient=makeSupabaseClient(PALATEO_SUPABASE_URL,PALATEO_SUPABASE_PUBLISHABLE_KEY);
return supabaseClient;
}

async function connectBackend(url,publishableKey){
if(!window.supabase) throw new Error('Supabase library is not loaded in this standalone build.');
supabaseClient=makeSupabaseClient(url,publishableKey);
const {data:{session}}=await supabaseClient.auth.getSession();
const user=session?.user||null;
state.backendConnected=true;state.userId=user?.id||null;persist();
document.getElementById('mode').textContent='Supabase connected';toast('Backend connected ✓');
return user;
}
window.Palateo = Object.assign(window.Palateo || {}, { connectBackend, connectRailway, ranked, rate:rateV5, saveRest:saveV5 });


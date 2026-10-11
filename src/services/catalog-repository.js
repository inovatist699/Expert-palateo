/* ===== PALATEO V5 SUPABASE CONNECTED LAYER ===== */
const PALATEO_SUPABASE_URL = "https://ntuaqcnbhqtbhbnnobmm.supabase.co";
const PALATEO_SUPABASE_PUBLISHABLE_KEY = "sb_publishable__YWaFqDXVc-R_UlEl5DVcQ_ust-d4vp";
let backendReady=false, currentUser=null, dbCatalog=[];
function normalizeDbRestaurant(r){
const known=["Restaurant","Cafe","Fast food","Food court"];
const types=[...new Set([...(r.tags||[]),...(r.cuisines||[])].filter(x=>known.includes(x)))];
if(!types.length)types.push(/\b(cafe|coffee|tea\s+(?:lounge|house|room))\b/i.test(r.name||"")?"Cafe":"Restaurant");
const cuisines=[...new Set([...types,...(r.cuisines||[])])],placeTags=[...new Set([...(r.tags||[]),...types])];
const emoji=types.includes("Cafe")?"☕":types.includes("Fast food")?"🥪":types.includes("Food court")?"🍜":"🍽️";
const stableId=(r.external_provider==='palateo-curated'||r.external_provider==='palateo_demo'||(r.external_place_id&&!r.external_place_id.startsWith('node/')))?r.external_place_id:r.id;
  return {id:stableId,dbId:r.id,name:r.name,area:r.area||r.city||"Ahmedabad",address:r.address||"",city:r.city||"Ahmedabad",latitude:r.latitude,longitude:r.longitude,c:cuisines,p:r.price??null,displayPrice:r.price_display||undefined,rating:r.rating==null?null:Number(r.rating),review_count:r.review_count,ratingSource:r.external_place_id?.startsWith('dno-')?'Swiggy Dineout':r.external_place_id?.startsWith('zom-')?'Zomato':null,t:placeTags,a:r.ambience_tags||[],o:r.occasion_tags||[],s:r.spice_profile||null,dietaryOptions:Array.isArray(r.dietary_options)?r.dietary_options:[],business_status:r.business_status||r.businessStatus||r.operational_status||r.status||null,permanently_closed:r.permanently_closed??r.is_permanently_closed??false,emoji,description:typeof r.description==='string'?r.description:'',photo:resolveVenuePhoto(r),maps:r.maps||r.maps_url||("https://www.google.com/maps/search/?api=1&query="+encodeURIComponent((r.name||"")+" "+(r.area||"")+" "+(r.city||selectedCity))),review_insights:Array.isArray(r.review_insights)?r.review_insights:[],why:["Place matched to your palate"]};
}
function updateMode(){
const modeButton=document.getElementById('mode');
if(!modeButton)return;
modeButton.textContent=currentUser?'Account connected':'Sign in required';
modeButton.setAttribute('aria-label',currentUser?'Sign out of Palateo':'Sign in to sync your palate');
modeButton.title=currentUser?'Sign out of your Palateo account':'Sign in to sync your palate across devices';
}
async function ensureBackend(){
getSupabaseClient();
const {data:{session},error}=await supabaseClient.auth.getSession();
if(error){console.warn(error);window.reportPalateoError?.('auth_session_failed');}
useAccount(session?.user||null);
state.backendConnected=true;
persist();
const {data:rests,error:re}=await loadAllRows(supabaseClient.from('restaurant_catalog').select('*').order('rating',{ascending:false}).order('id'));
if(!re&&rests?.length){dbCatalog=rests.map(normalizeDbRestaurant);state.dbCatalog=true;}
if(re)window.reportPalateoError?.('catalog_load_failed');
updateMode();
return currentUser;
}
function activeRestaurant(id){
 const found=dbCatalog.find(x=>x.id===id)||catalog.find(x=>x.id===id)||vadodaraCatalog.find(x=>x.id===id)||allMetroVenues.find(x=>x.id===id)||null;
 if(!found)return null;
 if(!found.dbId&&dbCatalog.length){
  const match=dbCatalog.find(x=>x.id===id||(x.name&&found.name&&x.name.trim().toLowerCase()===found.name.trim().toLowerCase()&&(x.city||'').toLowerCase()===(found.city||selectedCity).toLowerCase()));
  if(match?.dbId)found.dbId=match.dbId;
 }
 return found;
}

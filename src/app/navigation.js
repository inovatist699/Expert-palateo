function go(p,{keepScroll=false}={}){
if(!currentUser){requireAuthGate();return}
if(!hasLegalConsent(currentUser)){requireLegalConsent();return}
if(!['home','discover','ask','social','saved','profile','place'].includes(p))p='home';
 if(!hasTasteProfile()){const missing=questions.findIndex(q=>!q.o.some(([value])=>value===state.answers?.[q.k]));onboard(missing<0?questions.length-1:missing);return}
document.getElementById('nav').classList.remove('hide');
const previousSort=keepScroll?document.getElementById('discoverSort')?.value:null;
const focusedAction=keepScroll?document.activeElement?.getAttribute('data-rest-action'):null;
const focusedRestaurant=keepScroll?document.activeElement?.getAttribute('data-rest-id'):null;
if(!keepScroll)window.scrollTo(0,0);
if(p!=='place')window.history?.replaceState({palateoPage:p},'');
page=p;
document.querySelectorAll('.nav button').forEach(x=>{x.classList.remove('active');x.removeAttribute('aria-current')});
const activeNav=document.getElementById('n-'+(p==='place'?detailOrigin:p));
activeNav?.classList.add('active');activeNav?.setAttribute('aria-current','page');
({home,discover,ask,social,saved,profile,place}[p])();
if(typeof syncPaloPage==='function')syncPaloPage(p);
if(keepScroll){
 if(p==='discover'&&previousSort){document.getElementById('discoverSort').value=previousSort;drawDiscover()}
 if(focusedAction&&focusedRestaurant){Array.from(document.querySelectorAll('[data-rest-action]')).find(button=>button.getAttribute('data-rest-action')===focusedAction&&button.getAttribute('data-rest-id')===focusedRestaurant)?.focus({preventScroll:true})}
}
if(currentUser&&backendReady)logEvent('screen_view',{screen:p});
}
function setHomeCuisine(cuisine){
homeCuisine=cuisine;
homeLimit=12;
home();
}
function loadMoreHome(){
homeLimit+=12;
home();
}
const CITY_MAP_BOUNDS={
  Ahmedabad:{minLat:22.985,maxLat:23.070,minLon:72.490,maxLon:72.605},
  Vadodara:{minLat:22.250,maxLat:22.345,minLon:73.125,maxLon:73.245},
  Mumbai:{minLat:18.910,maxLat:19.080,minLon:72.810,maxLon:72.860},
  'Delhi NCR':{minLat:28.510,maxLat:28.630,minLon:77.140,maxLon:77.270},
  Bengaluru:{minLat:12.920,maxLat:12.995,minLon:77.580,maxLon:77.660},
  Hyderabad:{minLat:17.380,maxLat:17.460,minLon:78.380,maxLon:78.520},
  Chennai:{minLat:13.010,maxLat:13.095,minLon:80.230,maxLon:80.290},
  Kolkata:{minLat:22.510,maxLat:22.590,minLon:88.330,maxLon:88.385},
  Pune:{minLat:18.500,maxLat:18.555,minLon:73.820,maxLon:73.920},
  Jaipur:{minLat:26.875,maxLat:26.935,minLon:75.770,maxLon:75.835},
  Kochi:{minLat:9.920,maxLat:9.985,minLon:76.220,maxLon:76.305},
  Goa:{minLat:15.550,maxLat:15.625,minLon:73.720,maxLon:73.800},
  Chandigarh:{minLat:30.710,maxLat:30.765,minLon:76.760,maxLon:76.820}
};

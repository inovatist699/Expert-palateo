function getActiveCatalog(){const source=[...dbCatalog,...catalog,...vadodaraCatalog,...allMetroVenues],seen=new Set();return source.filter(r=>{const city=r.city||'Ahmedabad';if(city!==selectedCity)return false;const key=(r.name||'').trim().toLowerCase()+'|'+city.toLowerCase();if(seen.has(key))return false;seen.add(key);return true})}
function travelRangeNote(){
 const value=state.answers?.distance,range=Number(value);if(value==null||value===''||!Number.isFinite(range)||range<0)return '';
 return '<p class="feedNote">'+(userLocation?'Showing places within '+range+' km in a straight line from your location. Places without coordinates are hidden.':'Allow location access using “Use my location” to apply your travel range. Currently browsing the whole city.')+'</p>';
}
function validCoordinate(value,max){return (typeof value==='number'||typeof value==='string'&&value.trim()!=='')&&Number.isFinite(Number(value))&&Math.abs(Number(value))<=max}
function venueDistanceKm(r){
 if(!userLocation||!validCoordinate(userLocation.lat,90)||!validCoordinate(userLocation.lon,180)||!hasCoordinates(r))return null;
 const lat=Number(r.latitude),lon=Number(r.longitude);
 const rad=x=>x*Math.PI/180,dLat=rad(lat-userLocation.lat),dLon=rad(lon-userLocation.lon);
 const a=Math.sin(dLat/2)**2+Math.cos(rad(userLocation.lat))*Math.cos(rad(lat))*Math.sin(dLon/2)**2;
 return 6371*2*Math.atan2(Math.sqrt(Math.min(1,a)),Math.sqrt(Math.max(0,1-a)));
}
function withinTravelRange(r){const value=state.answers?.distance,range=Number(value);if(!userLocation||value==null||value===''||!Number.isFinite(range)||range<0)return true;const km=venueDistanceKm(r);return km!==null&&km<=range}

let profileDistanceRevision=0;
function persistProfileFilters(){
 const owner=currentUser?.id;persist();
 feedbackSyncQueue=feedbackSyncQueue.catch(()=>{}).then(async()=>{if(!owner||currentUser?.id!==owner)return;try{await syncTaste()}catch{if(currentUser?.id===owner)toast('Filters saved on this device; cloud sync failed.')}});
}
async function setProfileDistance(km){
 if(!Number.isInteger(km)||km<0||km>51)return;
 const owner=currentUser?.id,city=cityName(),revision=++profileDistanceRevision;
 const located=km===51||!!userLocation||await useMyLocation({changeCity:false});
 if(currentUser?.id!==owner||cityName()!==city||revision!==profileDistanceRevision)return;
 state.answers.distance=located&&km!==51?String(km):'any';persistProfileFilters();
 if(page==='profile'){profile();document.getElementById('profileDistance')?.focus({preventScroll:true})}else if(currentUser)go(page);
 if(!located)toast('Location unavailable — showing anywhere in '+cityName());
}

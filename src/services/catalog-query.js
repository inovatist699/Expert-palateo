function getActiveCatalog(){const source=[...dbCatalog,...catalog,...vadodaraCatalog,...allMetroVenues],seen=new Set();return source.filter(r=>{const city=r.city||'Ahmedabad';if(city!==selectedCity)return false;const key=(r.name||'').trim().toLowerCase()+'|'+city.toLowerCase();if(seen.has(key))return false;seen.add(key);return true})}
function travelRangeNote(){
 const range=Number(state.answers?.distance);if(!Number.isFinite(range)||range<=0)return '';
 return '<p class="feedNote">'+(userLocation?'Showing places within '+range+' km in a straight line from your location. Places without coordinates are hidden.':'Allow location access using “Use my location” to apply your travel range. Currently browsing the whole city.')+'</p>';
}
function venueDistanceKm(r){
 const valid=(value,max)=>(typeof value==='number'||typeof value==='string'&&value.trim()!=='')&&Number.isFinite(Number(value))&&Math.abs(Number(value))<=max;
 if(!userLocation||!valid(userLocation.lat,90)||!valid(userLocation.lon,180)||!valid(r.latitude,90)||!valid(r.longitude,180))return null;
 const lat=Number(r.latitude),lon=Number(r.longitude);
 const rad=x=>x*Math.PI/180,dLat=rad(lat-userLocation.lat),dLon=rad(lon-userLocation.lon);
 const a=Math.sin(dLat/2)**2+Math.cos(rad(userLocation.lat))*Math.cos(rad(lat))*Math.sin(dLon/2)**2;
 return 6371*2*Math.atan2(Math.sqrt(Math.min(1,a)),Math.sqrt(Math.max(0,1-a)));
}
function withinTravelRange(r){const range=Number(state.answers?.distance);if(!userLocation||!Number.isFinite(range)||range<=0)return true;const km=venueDistanceKm(r);return km!==null&&km<=range}

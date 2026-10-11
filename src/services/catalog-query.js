function getActiveCatalog(){const source=[...dbCatalog,...catalog,...vadodaraCatalog,...allMetroVenues],seen=new Set();return source.filter(r=>{const city=r.city||'Ahmedabad';if(city!==selectedCity)return false;const key=(r.name||'').trim().toLowerCase()+'|'+city.toLowerCase();if(seen.has(key))return false;seen.add(key);return true})}
function travelRangeNote(){
 const range=Number(state.answers?.distance);if(!Number.isFinite(range)||range<=0)return '';
 return '<p class="feedNote">'+(userLocation?'Showing places with known coordinates within '+range+' km. Select your city again to browse the whole city.':'Allow location access using “Use my location” to apply your travel range. Currently browsing the whole city.')+'</p>';
}
function withinTravelRange(r){
 const range=Number(state.answers?.distance);
 if(!userLocation||!Number.isFinite(range)||range<=0)return true;
 if(r.latitude==null||r.longitude==null)return false;
 const lat=Number(r.latitude),lon=Number(r.longitude);if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)return false;
 const rad=x=>x*Math.PI/180,dLat=rad(lat-userLocation.lat),dLon=rad(lon-userLocation.lon);
 const a=Math.sin(dLat/2)**2+Math.cos(rad(userLocation.lat))*Math.cos(rad(lat))*Math.sin(dLon/2)**2;
 return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(Math.max(0,1-a)))<=range;
}

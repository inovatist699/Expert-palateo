function cityName(){return selectedCity}
function updateCityPicker(){
 const select=document.getElementById('citySelect');if(select)select.value=selectedCity;
  const cityMap=[['Ahmedabad','cityAhmedabad'],['Vadodara','cityVadodara'],['Mumbai','cityMumbai'],['Delhi NCR','cityDelhiNCR'],['Bengaluru','cityBengaluru'],['Hyderabad','cityHyderabad'],['Chennai','cityChennai'],['Kolkata','cityKolkata'],['Pune','cityPune'],['Jaipur','cityJaipur'],['Kochi','cityKochi'],['Goa','cityGoa'],['Chandigarh','cityChandigarh']];
  for(const [city,id] of cityMap){const button=document.getElementById(id);if(button){const active=city===selectedCity;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))}}
}
let locationRequestPending=false,locationStatusMessage='',locationRequestId=0,locationPromise=null,resolveLocationRequest=null;
function updateLocationStatus(message){
 locationStatusMessage=message;
 document.querySelectorAll('#cityPickerStatus,[data-location-status]').forEach(node=>node.textContent=message);
 document.querySelectorAll('[data-action="location"]').forEach(button=>{button.disabled=locationRequestPending;button.setAttribute('aria-busy',String(locationRequestPending))});
}
function setCity(city){
 if(!cityCenters[city])return;
 resolveLocationRequest?.(false);resolveLocationRequest=null;locationPromise=null;
 locationRequestId++;locationRequestPending=false;selectedCity=city;userLocation=null;discoverSort='match';state.selectedCity=city;homeLimit=12;homeCuisine='all';selectedPinId=null;
 state.answers.distance='any';
 persist();updateCityPicker();locationStatusMessage=city+' selected';if(currentUser)go(page);updateLocationStatus(locationStatusMessage);
}
function useMyLocation({changeCity=true}={}){
 if(locationRequestPending)return locationPromise;
 if(!navigator.geolocation&&!window.PalateoNative){updateLocationStatus('Location is unavailable in this browser. Showing anywhere in '+cityName()+'.');return Promise.resolve(false)}
 const requestId=++locationRequestId,owner=currentUser?.id;
 locationPromise=new Promise(resolve=>{resolveLocationRequest=resolve});const result=locationPromise;
 locationRequestPending=true;updateLocationStatus('Requesting your location…');
 const finish=(message,located=false)=>{locationRequestPending=false;updateLocationStatus(message);resolveLocationRequest?.(located);resolveLocationRequest=null;locationPromise=null};
 const fail=message=>{const hadLocation=!!userLocation;userLocation=null;discoverSort='match';finish(message);if(hadLocation&&currentUser)go(page)};
 const onError=error=>{if(requestId!==locationRequestId)return;if(currentUser?.id!==owner){finish('Location request cancelled.');return}fail([1,'OS-PLUG-GLOC-0003'].includes(error?.code)?'Location permission was declined. Choose a city manually.':'Could not get your location. Choose a city manually.')};
 const locate=window.PalateoNative?((ok,fail,options)=>window.PalateoNative.getCurrentPosition(options).then(ok,fail)):navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);
 try{locate(position=>{
  if(requestId!==locationRequestId)return;
  if(currentUser?.id!==owner){finish('Location request cancelled.');return}
  const lat=position?.coords?.latitude,lon=position?.coords?.longitude;
  if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180){fail('Could not get your location. Choose a city manually.');return}
  const rad=x=>x*Math.PI/180,distance=center=>{const dLat=rad(center[0]-lat),dLon=rad(center[1]-lon),a=Math.sin(dLat/2)**2+Math.cos(rad(lat))*Math.cos(rad(center[0]))*Math.sin(dLon/2)**2;return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(Math.max(0,1-a)))},nearest=Object.entries(cityCenters).map(([city,center])=>({city,km:distance(center)})).sort((a,b)=>a.km-b.km)[0];
  if(nearest.km>75){fail('You are outside our city coverage. Choose a city manually.');return}
  if(changeCity){if(selectedCity!==nearest.city)state.answers.distance='any';selectedCity=nearest.city;state.selectedCity=selectedCity;homeLimit=12;homeCuisine='all';selectedPinId=null}
  userLocation={lat,lon};persist();locationRequestPending=false;locationStatusMessage='Using your location · '+selectedCity;
  updateCityPicker();if(changeCity&&currentUser)go(page);finish(locationStatusMessage,true);
  if(typeof fitStreetPlaces==='function')fitStreetPlaces(550);
 },onError,{enableHighAccuracy:false,timeout:10000,maximumAge:300000})}catch(error){onError(error)}
 return result;
}

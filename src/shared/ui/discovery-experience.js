// Google Maps integration and shared card interactions.
const googleMapStyles = {
  roadmap: {
    version: 8,
    sources: {
      'google-roadmap': {
        type: 'raster',
        tiles: [
          'https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          'https://mt2.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          'https://mt3.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
        ],
        tileSize: 256,
        attribution: '&copy; <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Google Maps</a>'
      }
    },
    layers: [
      {
        id: 'google-roadmap-layer',
        type: 'raster',
        source: 'google-roadmap',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  },
  satellite: {
    version: 8,
    sources: {
      'google-satellite': {
        type: 'raster',
        tiles: [
          'https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          'https://mt2.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          'https://mt3.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
        ],
        tileSize: 256,
        attribution: '&copy; <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Google Maps</a>'
      }
    },
    layers: [
      {
        id: 'google-satellite-layer',
        type: 'raster',
        source: 'google-satellite',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  },
  terrain: {
    version: 8,
    sources: {
      'google-terrain': {
        type: 'raster',
        tiles: [
          'https://mt0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
          'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
          'https://mt2.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
          'https://mt3.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
        ],
        tileSize: 256,
        attribution: '&copy; <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Google Maps</a>'
      }
    },
    layers: [
      {
        id: 'google-terrain-layer',
        type: 'raster',
        source: 'google-terrain',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  },
  hybrid: {
    version: 8,
    sources: {
      'google-hybrid': {
        type: 'raster',
        tiles: [
          'https://mt0.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          'https://mt2.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          'https://mt3.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
        ],
        tileSize: 256,
        attribution: '&copy; <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Google Maps</a>'
      }
    },
    layers: [
      {
        id: 'google-hybrid-layer',
        type: 'raster',
        source: 'google-hybrid',
        minzoom: 0,
        maxzoom: 22
      }
    ]
  }
};
let currentGoogleMapStyle = 'roadmap';
const palateoStreetStyle = googleMapStyles.roadmap;
let streetMap=null,streetMapCity=null,streetMarkers=[],mapLibraryPromise=null;
const mapMotion=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches;
function disposeStreetMap(){if(streetMap){streetMap.remove();streetMap=null}streetMarkers=[];streetMapCity=null}
function loadMapLibrary(){
 if(window.maplibregl)return Promise.resolve();
 if(!mapLibraryPromise)mapLibraryPromise=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='maplibre-gl.js';script.onload=resolve;script.onerror=()=>{mapLibraryPromise=null;script.remove();reject(new Error('Map renderer could not load'))};document.head.append(script)});
 return mapLibraryPromise;
}
function updateStreetMarkers(){
 if(!streetMap)return;
 streetMarkers.forEach(m=>m.remove());streetMarkers=[];
 streetPlaces.forEach((r,index)=>{
  if(!hasCoordinates(r))return;
  const wrap=document.createElement('div'),button=document.createElement('button');
  button.type='button';button.className='zestPin restaurantMarker'+(selectedPinId===r.id?' active':'');button.dataset.action='select-pin';button.dataset.restId=r.id;
  const pinKind=r.c?.includes('Dessert')?'dessert':r.c?.includes('Cafe')?'cafe':r.c?.includes('Gujarati')?'regional':'food';button.dataset.kind=pinKind;
  button.setAttribute('aria-label',pinKind+' · '+r.name+' · '+r.score+'% match');button.setAttribute('aria-pressed',String(selectedPinId===r.id));
  button.innerHTML='<span class="markerDot"></span><span class="markerScore">'+r.score+'%</span>'+(index===0?'<span class="markerName">'+esc(r.name)+'</span>':'');
  wrap.append(button);streetMarkers.push(new maplibregl.Marker({element:wrap,anchor:'bottom'}).setLngLat([Number(r.longitude),Number(r.latitude)]).addTo(streetMap));
 });
 if(userLocation){const dot=document.createElement('div');dot.className='studioUserLocation';dot.setAttribute('role','img');dot.setAttribute('aria-label','Your approximate location');streetMarkers.push(new maplibregl.Marker({element:dot}).setLngLat([userLocation.lon,userLocation.lat]).addTo(streetMap))}
}
function fitStreetPlaces(duration=0){
 if(!streetMap)return;
 if(userLocation){streetMap.easeTo({center:[userLocation.lon,userLocation.lat],zoom:14,duration:mapMotion()?duration:0,pitch:0,bearing:0});return}
 const coords=streetPlaces.filter(hasCoordinates).map(r=>[Number(r.longitude),Number(r.latitude)]);
 if(coords.length){const bounds=coords.reduce((b,c)=>b.extend(c),new maplibregl.LngLatBounds(coords[0],coords[0]));streetMap.fitBounds(bounds,{padding:{top:90,bottom:60,left:70,right:90},maxZoom:14,duration:mapMotion()?duration:0,pitch:0,bearing:0})}
 else{const c=cityCenters[cityName()]||cityCenters.Ahmedabad;streetMap.jumpTo({center:[c[1],c[0]],zoom:12,pitch:0})}
}
function mapUnavailable(){
 const status=document.querySelector('.streetMapStatus');if(!status)return;
 status.classList.add('mapFailed');status.innerHTML='Street map could not load. Browse places below or <button type="button" data-street-retry>retry the map</button>.';
}
async function mountStreetMap(host){
 if(streetMap&&streetMapCity!==cityName())disposeStreetMap();
 if(streetMap){host.replaceWith(streetMap.getContainer());requestAnimationFrame(()=>streetMap?.resize());updateStreetMarkers();document.querySelector('.streetMapStatus')?.remove();if(selectedPinId)showStreetPlace(selectedPinId);return}
 try{
  await loadMapLibrary();if(!host.isConnected||document.getElementById('streetMap')!==host)return;
  const c=cityCenters[cityName()]||cityCenters.Ahmedabad;
  streetMap=new maplibregl.Map({container:host,style:googleMapStyles.roadmap,center:[c[1],c[0]],zoom:12.5,pitch:0,attributionControl:{compact:true},maxPitch:0,dragRotate:false,touchPitch:false,antialias:true,scrollZoom:false,cooperativeGestures:true,renderWorldCopies:false});
  streetMapCity=cityName();streetMap.addControl(new maplibregl.ScaleControl({maxWidth:90,unit:'metric'}),'bottom-left');
  const map=streetMap;
  const timeout=setTimeout(()=>{if(streetMap===map&&!map.loaded())mapUnavailable()},15000);
  map.once('load',()=>{clearTimeout(timeout);if(streetMap!==map)return;document.querySelector('.streetMapStatus')?.remove();updateStreetMarkers();if(selectedPinId)showStreetPlace(selectedPinId);else fitStreetPlaces()});
  map.on('error',event=>{if(!map.isStyleLoaded())mapUnavailable()});
 }catch(error){disposeStreetMap();mapUnavailable()}
}
const tasteHomeWithMap=home;
home=function(){
 tasteHomeWithMap();
 const host=document.getElementById('streetMap');
 if(!host){disposeStreetMap();return}
 const container=document.getElementById('zestMapContainer');container.classList.add('streetMapFrame');
 const legend=container.querySelector('.zestMapLegend');if(legend)legend.innerHTML='<span><i style="background:#d8613d"></i>Food</span><span><i style="background:#2875bb"></i>Cafés</span><span><i style="background:#9753a8"></i>Desserts</span><span><i style="background:#28845a"></i>Regional</span>';
 const notice=container.querySelector('.mapNotice');if(notice)notice.textContent=streetPlaces.filter(hasCoordinates).length+' recommendations mapped · Select a pin to explore. Directions opens Google Maps.';
 mountStreetMap(host);
};
const navigateWithStreetMap=go;
go=function(destination,options){if(destination!=='home')disposeStreetMap();navigateWithStreetMap(destination,options)};
function showStreetPlace(id){
 const r=streetPlaces.find(r=>r.id===id);if(!r)return;
 selectedPinId=id;document.getElementById('zestMapSheet')?.remove();document.getElementById('zestMapContainer').insertAdjacentHTML('beforeend',renderZestSheet(r));updateStreetMarkers();
 if(streetMap){const zoom=Math.max(streetMap.getZoom(),14);streetMap.easeTo({center:[Number(r.longitude),Number(r.latitude)],zoom,pitch:0,offset:innerWidth>=840?[140,0]:[0,-80],duration:mapMotion()?700:0})}
 document.querySelector('.zestSheetClose')?.focus({preventScroll:true});
}
document.addEventListener('click',event=>{
 const control=event.target.closest('[data-action],[data-street-retry]');if(!control)return;
 if(control.hasAttribute('data-street-retry')){event.preventDefault();disposeStreetMap();home();return}
 if(!streetMap||!document.querySelector('.streetMapFrame'))return;
 const action=control.dataset.action;
 if(!['select-pin','close-pin','zoom-in','zoom-out','zoom-reset'].includes(action))return;
 event.preventDefault();event.stopImmediatePropagation();
 if(action==='select-pin'){placePreviewOrigin='select-pin';showStreetPlace(control.dataset.restId)}
 if(action==='close-pin'){const id=selectedPinId;selectedPinId=null;document.getElementById('zestMapSheet')?.remove();updateStreetMarkers();document.querySelector('.restaurantMarker[data-rest-id="'+CSS.escape(id)+'"]')?.focus({preventScroll:true})}

 if(action==='zoom-in'||action==='zoom-out')streetMap.easeTo({zoom:streetMap.getZoom()+(action==='zoom-in'?1:-1),duration:mapMotion()?240:0});
 if(action==='zoom-reset')fitStreetPlaces(550);
},true);

(() => {
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 const pointer = matchMedia('(hover: hover) and (pointer: fine)');
 let frame = 0;
 let pending = null;
 let opening = null;
 const orbitTimers = new WeakMap();
 function orbit(card) {
  clearTimeout(orbitTimers.get(card));
  card.classList.remove('is-orbiting');
  void card.offsetWidth;
  card.classList.add('is-orbiting');
  orbitTimers.set(card,setTimeout(()=>card.classList.remove('is-orbiting'),650));
 }
 document.addEventListener('click', event => {
  const target = event.target instanceof Element ? event.target : null;
  const card = target?.closest('.restaurant-card,.zestMapSheet');
  if (opening) {
   clearTimeout(opening.timer);
   opening.card.classList.remove('is-opening');
   opening.screen?.classList.remove('is-leaving');
   opening = null;
  }
  if (!card || target.closest('[data-action="close-pin"]')) return;
  const entry = target.closest('[data-action="open-place"]');
  const bodyClick = !target.closest('button,a,details,summary,input,select');
  const id = card.dataset.placeId || card.querySelector('[data-rest-id]')?.dataset.restId;
  if ((entry || bodyClick) && id && !motion.matches) {
   event.preventDefault();
   event.stopImmediatePropagation();
   orbit(card);
   card.classList.add('is-opening');
   const screen = card.closest('.screen');
   screen?.classList.add('is-leaving');
   const trigger = entry || card.querySelector('[data-action="open-place"]');
   opening = {card,screen,timer:setTimeout(()=>{
    opening = null;
    card.classList.remove('is-opening');
    screen?.classList.remove('is-leaving');
    if (card.isConnected) openPlaceDetails(id,trigger);
   },520)};
   return;
  }
  if (bodyClick && card.matches('.zestMapSheet') && id) {
   event.preventDefault();event.stopImmediatePropagation();openPlaceDetails(id,null);return;
  }
  requestAnimationFrame(()=>{
   const current = card.id ? document.getElementById(card.id) : card;
   if (current?.isConnected) orbit(current);
  });
 },true);
 document.addEventListener('pointermove', event => {
  if (motion.matches || !pointer.matches || event.pointerType === 'touch') return;
  const card = event.target instanceof Element ? event.target.closest('.restaurant-card,.zestMapSheet') : null;
  if (!card) return;
  pending = {card, x:event.clientX, y:event.clientY};
  if (frame) return;
  frame = requestAnimationFrame(() => {
   frame = 0;
   if (!pending) return;
   const {card, x, y} = pending;
   pending = null;
   if (!card.isConnected || !card.matches(':hover') || motion.matches || !pointer.matches) return;
   const rect = card.getBoundingClientRect();
   card.style.setProperty('--glow-x', `${x - rect.left}px`);
   card.style.setProperty('--glow-y', `${y - rect.top}px`);
   card.style.setProperty('--tilt-x', `${(0.5-(y-rect.top)/rect.height)*5}deg`);
   card.style.setProperty('--tilt-y', `${((x-rect.left)/rect.width-0.5)*5}deg`);
  });
 });
 document.addEventListener('pointerout', event => {
  const card = event.target instanceof Element ? event.target.closest('.restaurant-card,.zestMapSheet') : null;
  if (!card || (event.relatedTarget instanceof Node && card.contains(event.relatedTarget))) return;
  if (pending?.card === card) pending = null;
  card.style.removeProperty('--glow-x');
  card.style.removeProperty('--glow-y');
  card.style.removeProperty('--tilt-x');
  card.style.removeProperty('--tilt-y');
 });
})();

if(document.querySelector(".home-screen"))home();

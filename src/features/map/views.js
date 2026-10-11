function projectCoords(lat,lon,city){
 const bounds=CITY_MAP_BOUNDS[city]||CITY_MAP_BOUNDS['Ahmedabad'];
 const width=640,height=380;
 const clampedLat=Math.max(bounds.minLat,Math.min(bounds.maxLat,Number(lat)||bounds.minLat));
 const clampedLon=Math.max(bounds.minLon,Math.min(bounds.maxLon,Number(lon)||bounds.minLon));
 const x=((clampedLon-bounds.minLon)/(bounds.maxLon-bounds.minLon))*(width-70)+35;
 const y=(1-(clampedLat-bounds.minLat)/(bounds.maxLat-bounds.minLat))*(height-60)+30;
 return {x:Math.round(x),y:Math.round(y)};
}
const CITY_MAP_THEMES={
 Ahmedabad:{
  river:`<path d="M 430,10 Q 415,170 405,230 T 380,370" stroke="url(#riverGrad)" stroke-width="16" fill="none" opacity="0.8" stroke-linecap="round"/><path d="M 430,10 Q 415,170 405,230 T 380,370" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.45" stroke-dasharray="10 14" stroke-linecap="round"/>`,
  label:`<text x="415" y="310" font-family="Plus Jakarta Sans, sans-serif" font-size="9" font-weight="700" fill="#3b8266" letter-spacing="1.5" opacity="0.85">SABARMATI RIVER</text>`,
  neighborhoods:[{name:'Sindhu Bhavan',x:110,y:110},{name:'Bodakdev',x:150,y:145},{name:'Satellite / Prahlad',x:160,y:245},{name:'Navrangpura',x:320,y:160},{name:'C.G. Road',x:330,y:200},{name:'Ellisbridge',x:370,y:230},{name:'Old City Heritage',x:500,y:205}]
 },
 Vadodara:{
  river:`<path d="M 370,10 Q 360,180 380,240 T 365,370" stroke="url(#riverGrad)" stroke-width="14" fill="none" opacity="0.8" stroke-linecap="round"/><path d="M 370,10 Q 360,180 380,240 T 365,370" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.45" stroke-dasharray="8 12" stroke-linecap="round"/>`,
  label:`<text x="390" y="310" font-family="Plus Jakarta Sans, sans-serif" font-size="9" font-weight="700" fill="#3b8266" letter-spacing="1.5" opacity="0.85">VISHWAMITRI RIVER</text>`,
  neighborhoods:[{name:'Alkapuri',x:230,y:195},{name:'Sayajiganj',x:350,y:190},{name:'Race Course',x:190,y:150},{name:'Old City / Raopura',x:490,y:220}]
 },
 Mumbai:{
  river:`<path d="M 90,10 Q 140,160 80,260 T 130,370" stroke="url(#riverGrad)" stroke-width="20" fill="none" opacity="0.85" stroke-linecap="round"/><path d="M 90,10 Q 140,160 80,260 T 130,370" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.5" stroke-dasharray="10 14" stroke-linecap="round"/>`,
  label:`<text x="40" y="240" font-family="Plus Jakarta Sans, sans-serif" font-size="9" font-weight="700" fill="#3b8266" letter-spacing="1.5" opacity="0.85" transform="rotate(-75 40 240)">ARABIAN SEA COAST</text>`,
  neighborhoods:[{name:'Bandra West',x:200,y:90},{name:'Lower Parel',x:260,y:185},{name:'BKC Hub',x:450,y:140},{name:'Fort / Kala Ghoda',x:290,y:305},{name:'Marine Drive',x:180,y:295}]
 },
 'Delhi NCR':{
  river:`<path d="M 520,10 Q 480,150 510,250 T 490,370" stroke="url(#riverGrad)" stroke-width="16" fill="none" opacity="0.8" stroke-linecap="round"/><path d="M 520,10 Q 480,150 510,250 T 490,370" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.45" stroke-dasharray="8 12" stroke-linecap="round"/>`,
  label:`<text x="500" y="320" font-family="Plus Jakarta Sans, sans-serif" font-size="9" font-weight="700" fill="#3b8266" letter-spacing="1.5" opacity="0.85">YAMUNA RIVER</text>`,
  neighborhoods:[{name:'Connaught Place',x:340,y:95},{name:'Chanakyapuri',x:190,y:150},{name:'Lodhi Road',x:370,y:180},{name:'Vasant Vihar',x:160,y:250},{name:'GK 2 / South Ex',x:410,y:295}]
 },
 Bengaluru:{
  river:`<ellipse cx="440" cy="140" rx="48" ry="24" fill="url(#riverGrad)" opacity="0.8"/><ellipse cx="440" cy="140" rx="36" ry="16" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="6 8" opacity="0.5"/>`,
  label:`<text x="440" y="180" font-family="Plus Jakarta Sans, sans-serif" font-size="8.5" font-weight="700" fill="#3b8266" letter-spacing="1.5" opacity="0.85" text-anchor="middle">ULSOOR LAKE</text>`,
  neighborhoods:[{name:'Indiranagar',x:490,y:120},{name:'MG Road',x:310,y:170},{name:'Lavelle Road',x:230,y:210},{name:'Koramangala',x:380,y:310},{name:'Jayanagar',x:200,y:320}]
 },
 Hyderabad:{
  river:`<ellipse cx="400" cy="170" rx="55" ry="32" fill="url(#riverGrad)" opacity="0.8"/><ellipse cx="140" cy="190" rx="35" ry="18" fill="url(#riverGrad)" opacity="0.75"/><ellipse cx="400" cy="170" rx="42" ry="22" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="8 10" opacity="0.5"/>`,
  label:`<text x="400" y="218" font-family="Plus Jakarta Sans, sans-serif" font-size="8.5" font-weight="700" fill="#3b8266" letter-spacing="1.5" opacity="0.85" text-anchor="middle">HUSSAIN SAGAR</text>`,
  neighborhoods:[{name:'Jubilee Hills',x:140,y:130},{name:'Banjara Hills',x:250,y:180},{name:'RTC X Roads',x:490,y:210},{name:'Hitec City',x:85,y:250},{name:'Old City / Charminar',x:370,y:325}]
 },
 Chennai:{
  river:`<path d="M 540,10 Q 510,180 530,270 T 520,370" stroke="url(#riverGrad)" stroke-width="22" fill="none" opacity="0.85" stroke-linecap="round"/><path d="M 540,10 Q 510,180 530,270 T 520,370" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.5" stroke-dasharray="10 14" stroke-linecap="round"/>`,
  label:`<text x="560" y="180" font-family="Plus Jakarta Sans, sans-serif" font-size="9" font-weight="700" fill="#3b8266" letter-spacing="1.5" opacity="0.85" transform="rotate(85 560 180)">BAY OF BENGAL · MARINA</text>`,
  neighborhoods:[{name:'Nungambakkam',x:200,y:130},{name:'Royapettah',x:350,y:175},{name:'Alwarpet',x:240,y:260},{name:'Marina Promenade',x:480,y:140},{name:'Besant Nagar',x:320,y:330}]
 },
 Kolkata:{
  river:`<path d="M 120,10 Q 150,170 110,250 T 140,370" stroke="url(#riverGrad)" stroke-width="18" fill="none" opacity="0.8" stroke-linecap="round"/><path d="M 120,10 Q 150,170 110,250 T 140,370" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.45" stroke-dasharray="8 12" stroke-linecap="round"/>`,
  label:`<text x="145" y="310" font-family="Plus Jakarta Sans, sans-serif" font-size="9" font-weight="700" fill="#3b8266" letter-spacing="1.5" opacity="0.85">HOOGHLY RIVER</text>`,
  neighborhoods:[{name:'New Market',x:310,y:120},{name:'Park Street',x:320,y:190},{name:'Victoria Memorial',x:210,y:210},{name:'Ballygunge',x:390,y:295},{name:'Salt Lake',x:520,y:110}]
 },
 Pune:{
  river:`<path d="M 50,130 Q 240,110 380,180 T 600,160" stroke="url(#riverGrad)" stroke-width="15" fill="none" opacity="0.8" stroke-linecap="round"/><path d="M 50,130 Q 240,110 380,180 T 600,160" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.45" stroke-dasharray="8 12" stroke-linecap="round"/>`,
  label:`<text x="360" y="145" font-family="Plus Jakarta Sans, sans-serif" font-size="8.5" font-weight="700" fill="#3b8266" letter-spacing="1.5" opacity="0.85">MULA-MUTHA RIVER</text>`,
  neighborhoods:[{name:'Koregaon Park',x:480,y:135},{name:'Kalyani Nagar',x:510,y:85},{name:'Shivaji Nagar',x:280,y:170},{name:'Prabhat Road',x:160,y:270},{name:'FC Road',x:210,y:210}]
 },
 Jaipur:{
  river:`<rect x="290" y="120" width="70" height="40" rx="14" fill="url(#riverGrad)" opacity="0.75"/><rect x="295" y="125" width="60" height="30" rx="10" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="6 8" opacity="0.5"/>`,
  label:`<text x="325" y="175" font-family="Plus Jakarta Sans, sans-serif" font-size="8.5" font-weight="700" fill="#3b8266" letter-spacing="1.5" opacity="0.85" text-anchor="middle">CENTRAL PARK</text>`,
  neighborhoods:[{name:'C-Scheme',x:280,y:195},{name:'Central Park',x:325,y:105},{name:'Narain Niwas',x:400,y:270},{name:'Civil Lines',x:150,y:210},{name:'Hawa Mahal / Walled City',x:490,y:130}]
 },
 Kochi:{
  river:`<path d="M 280,10 Q 310,180 270,260 T 320,370" stroke="url(#riverGrad)" stroke-width="20" fill="none" opacity="0.8" stroke-linecap="round"/><path d="M 280,10 Q 310,180 270,260 T 320,370" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.45" stroke-dasharray="8 12" stroke-linecap="round"/>`,
  label:`<text x="290" y="320" font-family="Plus Jakarta Sans, sans-serif" font-size="8.5" font-weight="700" fill="#3b8266" letter-spacing="1.5" opacity="0.85">COCHIN HARBOUR / BACKWATERS</text>`,
  neighborhoods:[{name:'Fort Kochi',x:140,y:165},{name:'Mattancherry',x:190,y:230},{name:'Willingdon Island',x:330,y:220},{name:'MG Road Ernakulam',x:480,y:160},{name:'Marine Drive',x:430,y:105}]
 },
 Goa:{
  river:`<path d="M 50,10 Q 120,60 180,50 T 320,30" stroke="url(#riverGrad)" stroke-width="16" fill="none" opacity="0.8" stroke-linecap="round"/><path d="M 90,50 Q 80,190 70,360" stroke="url(#riverGrad)" stroke-width="22" fill="none" opacity="0.85" stroke-linecap="round"/><path d="M 90,50 Q 80,190 70,360" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.5" stroke-dasharray="10 14" stroke-linecap="round"/>`,
  label:`<text x="145" y="45" font-family="Plus Jakarta Sans, sans-serif" font-size="8.5" font-weight="700" fill="#3b8266" letter-spacing="1.5" opacity="0.85">CHAPORA RIVER</text>`,
  neighborhoods:[{name:'Vagator Cliff',x:170,y:115},{name:'Anjuna Coast',x:190,y:210},{name:'Assagao Village',x:430,y:165},{name:'Calangute',x:250,y:310},{name:'Siolim',x:390,y:85}]
 },
 Chandigarh:{
  river:`<ellipse cx="500" cy="100" rx="50" ry="26" fill="url(#riverGrad)" opacity="0.8"/><ellipse cx="500" cy="100" rx="38" ry="18" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="6 8" opacity="0.5"/>`,
  label:`<text x="500" y="140" font-family="Plus Jakarta Sans, sans-serif" font-size="8.5" font-weight="700" fill="#3b8266" letter-spacing="1.5" opacity="0.85" text-anchor="middle">SUKHNA LAKE</text>`,
  neighborhoods:[{name:'Sector 9',x:380,y:140},{name:'Sector 7',x:470,y:220},{name:'Sector 17 Plaza',x:240,y:200},{name:'Sector 35',x:190,y:300},{name:'Rock Garden / Lake',x:510,y:60}]
 }
};
function hasCoordinates(r){return r.latitude!=null&&r.longitude!=null&&Number.isFinite(Number(r.latitude))&&Number.isFinite(Number(r.longitude))&&Math.abs(Number(r.latitude))<=90&&Math.abs(Number(r.longitude))<=180}
function renderZestMapSvg(places,city,selectedId){
 const theme=CITY_MAP_THEMES[city]||CITY_MAP_THEMES['Ahmedabad'];
 const width=640,height=380;
 const riverPath=theme.river;
 const riverLabel=theme.label;
 const neighborhoods=theme.neighborhoods;
 const labelsSvg=neighborhoods.map(n=>`<g class="zestMapAreaLabel"><rect x="${n.x-40}" y="${n.y-11}" width="80" height="18" rx="9" fill="#ffffff" opacity="0.75" stroke="#d5e3da" stroke-width="0.8"/><text x="${n.x}" y="${n.y+1}" font-family="Plus Jakarta Sans, sans-serif" font-size="9.5" font-weight="800" fill="#2d523e" text-anchor="middle" dominant-baseline="central" letter-spacing="0.3">${esc(n.name)}</text></g>`).join('');
 // shortcut: blocks and paths illustrate the area overview; use geographic tiles before offering street navigation.
 const mapPlane=`<defs><linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8fc2cf"/><stop offset="50%" stop-color="#519cab"/><stop offset="100%" stop-color="#519cab"/></linearGradient><filter id="groundBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2"/></filter><filter id="pinPop" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#0b593f" flood-opacity="0.2"/></filter></defs><rect width="${width}" height="${height}" fill="#c3e7f1"/><g class="zestMapBlocks" fill="#d7edf3"><path d="M0 0H145V80H0ZM178 0H325V72H178ZM374 0H530V80H374ZM567 0H640V97H567ZM0 112H125V209H0ZM163 112H297V199H163ZM365 110H483V199H365ZM542 123H640V217H542ZM0 249H145V380H0ZM184 248H311V380H184ZM363 246H498V380H363ZM548 254H640V380H548Z"/></g><g class="zestMapPaths" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M-20 94 157 98 327 87 535 103 660 113M-20 231 147 225 317 217 510 233 660 242M153-20 145 110 153 220 165 400M342-20 322 108 338 225 331 400M547-20 523 110 518 228 529 400M-20 343 660 39" stroke="#f8fff8" stroke-width="10"/><path d="M-20 94 157 98 327 87 535 103 660 113M-20 231 147 225 317 217 510 233 660 242M153-20 145 110 153 220 165 400M342-20 322 108 338 225 331 400M547-20 523 110 518 228 529 400M-20 343 660 39" stroke="#93bec8" stroke-width="1"/></g>`;
 const pinsSvg=places.map(r=>{
   if(r.latitude==null||r.longitude==null)return '';
   const pt=projectCoords(r.latitude,r.longitude,city);
   const isSelected=selectedId===r.id;
   const isVisited=state.feedback[r.id]==='visited';
   const isSaved=state.saves.includes(r.id);
   const pinClass=['zestPin',isSelected?'active':'',isVisited?'visited':'',isSaved?'saved':''].filter(Boolean).join(' ');
   const pulse=isSelected?`<circle cx="${pt.x}" cy="${pt.y-4}" class="zestPinPulse" stroke="#137d57" fill="none"/>`:''
   const badge=isVisited?'✓':isSaved?'♥':`${r.score}%`;
   const fill=isVisited?'#ffc64f':isSaved?'#519cab':r.score>=80?'#20373b':'#519cab';
   const halo=r.score>=80?`<circle cx="${pt.x}" cy="${pt.y-4}" r="${isSelected?20:16}" class="zestPinGlow" stroke="${fill}" stroke-width="1.5" fill="none"/>`:'';
   return `<g class="${pinClass}" data-action="select-pin" data-rest-id="${esc(r.id)}" role="button" tabindex="0" aria-label="${esc(r.name)} · ${r.score}% match"><ellipse cx="${pt.x}" cy="${pt.y+13}" rx="${isSelected?15:11}" ry="${isSelected?5:3.5}" fill="rgba(8,38,24,0.2)" filter="url(#groundBlur)"/><line x1="${pt.x}" y1="${pt.y-2}" x2="${pt.x}" y2="${pt.y+11}" stroke="#20373b" stroke-width="2.5" stroke-linecap="round" opacity="0.9"/>${pulse}${halo}<circle cx="${pt.x}" cy="${pt.y-4}" r="${isSelected?16:13}" class="zestPinCircle" style="fill:${fill};" filter="url(#pinPop)"/><circle cx="${pt.x}" cy="${pt.y-4}" r="4" fill="#ffffff"/><rect x="${pt.x-15}" y="${pt.y+9}" width="30" height="13" rx="6.5" fill="#20373b" stroke="rgba(255,255,255,0.25)" stroke-width="0.5" opacity="0.94"/><text x="${pt.x}" y="${pt.y+17.5}" font-family="Plus Jakarta Sans, sans-serif" font-size="7.5" font-weight="800" text-anchor="middle" fill="#ffffff">${badge}</text></g>`;
 }).join('');
 return `<svg class="zestMapSvg" style="transform:scale(${mapZoom})" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Illustrative area overview of restaurants in ${esc(city)}">${mapPlane}${riverPath}${riverLabel}${labelsSvg}${pinsSvg}</svg>`;
}
function renderZestSheet(r){
 if(!r)return '';
 const saved=state.saves.includes(r.id),f=state.feedback[r.id],id=esc(r.id),reviews=Number(r.review_count)||0;
 return `<div class="zestMapSheet" id="zestMapSheet" role="region" aria-label="Selected Palate Map place details"><div class="zestSheetHead"><div class="zestSheetPhoto" aria-hidden="true">${photo(r)}</div><button type="button" class="zestSheetClose" data-action="close-pin" aria-label="Close preview">×</button><div class="zestSheetInfo"><div class="zestSheetBadge">${r.score}% estimated taste match</div><h3 class="zestSheetTitle">${esc(r.name)}</h3><div class="zestSheetMeta">${esc(r.area||r.city)} · ${esc(displayPrice(r))}<br>★ ${Number(r.rating).toFixed(1)}${reviews?' · '+reviews.toLocaleString()+' ratings':''}${r.ratingSource?' · '+esc(r.ratingSource):''}</div></div></div><div class="zestSheetReceipt"><p class="zestSheetWhy"><b>Why it fits</b> · ${esc(r.why[0])}</p><p class="zestSheetCaveat">An estimate from your quiz and feedback. Confirm venue details before visiting.</p></div><div class="zestSheetActions actions"><button type="button" data-rest-action="like" data-rest-id="${id}" aria-pressed="${f==='like'}" aria-label="${f==='like'?'Unlike':'Like'} ${esc(r.name)}">${f==='like'?'♥ Undo like':'♡ Like'}</button><button type="button" data-rest-action="dislike" data-rest-id="${id}" aria-pressed="${f==='dislike'}" aria-label="${f==='dislike'?'Undo not for me':'Not for me'}: ${esc(r.name)}">${f==='dislike'?'Undo pass':'Not for me'}</button><button type="button" data-rest-action="save" data-rest-id="${id}" class="dark" aria-label="${saved?'Remove':'Save'} ${esc(r.name)}">${saved?'Saved ✓':'Save'}</button></div><div class="zestSheetActions actions"><button type="button" data-rest-action="visited" data-rest-id="${id}" aria-pressed="${f==='visited'}" aria-label="${f==='visited'?'Undo visited':'I visited'}: ${esc(r.name)}">${f==='visited'?'Undo visit':'I visited'}</button><button type="button" data-rest-action="maps" data-rest-id="${id}" aria-label="Directions to ${esc(r.name)}">Directions ↗</button><button type="button" data-action="scroll-to-card" data-rest-id="${id}">View card</button></div></div>`;
}

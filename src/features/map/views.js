function hasCoordinates(r){return r.latitude!=null&&r.longitude!=null&&Number.isFinite(Number(r.latitude))&&Number.isFinite(Number(r.longitude))&&Math.abs(Number(r.latitude))<=90&&Math.abs(Number(r.longitude))<=180}
function concreteReason(r,factor){
 const a=state.answers;
 const labels={Cuisine:(cuisineLabels[a.cuisine]||questions.find(q=>q.k==='cuisine').o.find(([v])=>v===a.cuisine)?.[1]||a.cuisine)+' cuisine preference',Price:'Price bracket fits your budget','Dietary options':a.diet==='eggetarian'?'Listed options align with your diet':dietLabel(a.diet)+' options noted',Ambience:questions.find(q=>q.k==='mood').o.find(([v])=>v===a.mood)?.[1]+' setting',Occasion:questions.find(q=>q.k==='occasion').o.find(([v])=>v===a.occasion)?.[1]+' occasion fit','Spice level':a.spice+' spice preference',Value:'Lower price bracket',Experience:'Distinctive setting noted'};
 return labels[factor.label]||factor.label;
}
function renderStreetMap(places){streetPlaces=places;return '<div id="streetMap" class="streetMap" aria-label="Street map of restaurant recommendations"></div><p class="streetMapStatus" role="status">Loading street map…</p>'};
function renderZestSheet(r){
 const id=esc(r.id);
 const reason=(r.matchBreakdown||[]).filter(x=>x.factor>.45).sort((a,b)=>b.weight-a.weight).slice(0,2).map(x=>concreteReason(r,x)).join(' · ');
 return `<div class="zestMapSheet" id="zestMapSheet" role="region" data-place-id="${id}" aria-label="Selected Palate Map place details"><div class="zestSheetPhoto">${photo(r)}</div><button type="button" class="zestSheetClose" data-action="close-pin" aria-label="Close preview">×</button><div class="mapPlaceBody"><span class="mapPlaceMatch">${r.score}% taste fit</span><h3>${esc(r.name)}</h3><p>${esc(r.area||r.city)} · ${esc(displayPrice(r))}</p><p class="mapPlaceReason">${esc(reason||'Limited detail for this match')}</p><div class="venuePrimary"><button type="button" class="btn primary" data-action="open-place" data-rest-id="${id}">Details →</button><button type="button" class="venueDirections" data-rest-action="maps" data-rest-id="${id}">Directions ↗</button></div><button type="button" class="mapVisited" data-rest-action="visited" data-rest-id="${id}" aria-pressed="${state.feedback[r.id]==='visited'}">${state.feedback[r.id]==='visited'?'Undo visit':'I visited this place'}</button></div></div>`;
}

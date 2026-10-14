// Local extension of the existing renderer and ranking engine.
const originalHome=home;
const tuneLabels={mood:'Tonight',cuisine:'Cuisine',budget:'Comfortable spend',diet:'Dietary preference',spice:'Spice',occasion:'Company',priority:'Prioritise'};
function tasteSelect(key){
 const q=questions.find(q=>q.k===key);
 return `<label class="tasteField">${tuneLabels[key]}<select data-taste="${key}" aria-label="${tuneLabels[key]}">${q.o.map(([v,label])=>`<option value="${esc(v)}" ${state.answers[key]===v?'selected':''}>${esc(label)}</option>`).join('')}</select></label>`;
}
function tastePanel(){
 const moods=questions.find(q=>q.k==='mood').o;
 return `<section class="tasteTuning" aria-labelledby="tasteHeading"><div class="tasteIntro"><div><h1 id="tasteHeading">Where are we eating?</h1><p>Set the mood. Find a place that fits.</p></div><button type="button" class="tasteReset" data-taste-reset>Reset taste</button></div><fieldset class="moodSegments"><legend>Tonight</legend><div class="moodOptions">${moods.map(([v,label])=>`<label><input type="radio" name="tonight" data-taste="mood" value="${v}" ${state.answers.mood===v?'checked':''}><span>${esc(label)}</span></label>`).join('')}</div></fieldset><div class="tasteFields">${tasteSelect('cuisine')}</div><details class="moreTaste"><summary>More preferences</summary><div class="tasteFields">${['diet','spice','occasion','priority'].map(tasteSelect).join('')}</div></details><p class="tasteStatus" role="status" aria-live="polite" aria-atomic="true">${ranked().length} places ranked for your taste. Matches are estimates.</p></section>`;
}
home=function(){
 originalHome();
 const screen=document.querySelector('.home-screen');if(!screen)return;
 screen.insertAdjacentHTML('afterbegin',tastePanel());
 const heading=screen.querySelector('.homeRecommendations h1');if(heading)heading.outerHTML='<h2>Places for your plans</h2>';
 const confidence=screen.querySelector('.confidence');if(confidence)confidence.outerHTML='<span class="recommendationCount">Sorted by taste fit · '+esc(cityName())+'</span>';
 screen.querySelector('.homeEstimateNote')?.remove();
 screen.querySelector('.homeFilterChips [data-cuisine="all"]').textContent='All places';
};
function concreteReason(r,factor){
 const a=state.answers;
 const labels={Cuisine:(cuisineLabels[a.cuisine]||questions.find(q=>q.k==='cuisine').o.find(([v])=>v===a.cuisine)?.[1]||a.cuisine)+' cuisine preference',Price:'Price bracket fits your budget','Dietary options':a.diet==='eggetarian'?'Listed options align with your diet':dietLabel(a.diet)+' options noted',Ambience:questions.find(q=>q.k==='mood').o.find(([v])=>v===a.mood)?.[1]+' setting',Occasion:questions.find(q=>q.k==='occasion').o.find(([v])=>v===a.occasion)?.[1]+' occasion fit','Spice level':a.spice+' spice preference',Value:'Lower price bracket',Experience:'Distinctive setting noted'};
 return labels[factor.label]||factor.label;
}
card=function(r){
 const saved=state.saves.includes(r.id),feedback=state.feedback[r.id],id=esc(r.id);
 const factors=r.matchBreakdown||[];
 const reasons=factors.filter(x=>x.factor>.45).sort((a,b)=>b.weight-a.weight).slice(0,2).map(x=>concreteReason(r,x));
 if(feedback)reasons.unshift(feedback==='like'?'You liked this place':feedback==='visited'?'You visited this place':'Your pass lowers this match');
 if(!reasons.length)reasons.push('Limited alignment with your current preferences');
 return `<article class="card restaurant-card" data-place-id="${id}" id="card-${id}"><div class="resthead"><button type="button" class="photo" data-action="open-place" data-rest-id="${id}" aria-label="Explore ${esc(r.name)}">${photo(r)}</button><div class="match" title="Estimated taste fit"><b>${r.score}%</b><span>taste fit</span></div><button type="button" class="venueSave" data-rest-action="save" data-rest-id="${id}" aria-pressed="${saved}" aria-label="${saved?'Remove':'Save'} ${esc(r.name)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4Z"/></svg></button><div class="venueHeading"><h3 class="restname"><button type="button" class="restnameButton" data-action="open-place" data-rest-id="${id}">${esc(r.name)}</button></h3><div class="meta">${esc(r.area||r.city||cityName())} · ${esc(displayPrice(r))}</div><div class="venueRating">${Number(r.rating).toFixed(1)} <span>/ 5 · ${Number(r.review_count||0).toLocaleString()} ratings${r.ratingSource?' · '+esc(r.ratingSource):''}</span></div></div></div><div class="fitReasons"><ul>${reasons.slice(0,2).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><details class="why"><summary>Why ${r.score}%?</summary><dl>${factors.map(x=>`<div><dt>${esc(x.label)}</dt><dd>${x.factor>.45?'Fits':x.factor<-.45?'Differs':x.factor===0?'Not verified':'Partial fit'}</dd></div>`).join('')}</dl><p>Your preferences set the score; likes, passes and dish feedback adjust it. An estimate, not a guarantee. Confirm dietary options and prices with the venue.</p></details><div class="venuePrimary"><button type="button" class="btn primary" data-action="open-place" data-rest-id="${id}" aria-label="Details for ${esc(r.name)}">Explore place →</button><button type="button" class="venueDirections" data-rest-action="maps" data-rest-id="${id}" aria-label="Directions to ${esc(r.name)}">Directions ↗</button></div><div class="actions tasteFeedback" role="group" aria-label="Feedback for ${esc(r.name)}"><button type="button" data-rest-action="like" data-rest-id="${id}" aria-pressed="${feedback==='like'}" aria-label="${feedback==='like'?'Undo like':'Like'} ${esc(r.name)}">${feedback==='like'?'Undo like':'Like'}</button><button type="button" data-rest-action="dislike" data-rest-id="${id}" aria-pressed="${feedback==='dislike'}" aria-label="${feedback==='dislike'?'Undo pass':'Not for me'} ${esc(r.name)}">${feedback==='dislike'?'Undo pass':'Not for me'}</button><button type="button" data-action="view-pin" data-rest-id="${id}" aria-label="Locate ${esc(r.name)} on your map">On map</button></div></article>`;
};
function refreshTaste(control,message){
 persist();const owner=currentUser?.id;feedbackSyncQueue=feedbackSyncQueue.catch(()=>{}).then(async()=>{if(owner&&currentUser?.id===owner)try{await syncTaste()}catch{toast('Saved on this device; cloud sync failed.')}});
 const panel=document.querySelector('.tasteTuning'),scroll=window.scrollY,expanded=panel.querySelector('.moreTaste').open;
 home();
 document.querySelector('.tasteTuning').replaceWith(panel);
 panel.querySelectorAll('[data-taste]').forEach(el=>{if(el.type==='radio')el.checked=el.value===state.answers[el.dataset.taste];else el.value=state.answers[el.dataset.taste]});
 panel.querySelector('.moreTaste').open=expanded;
 panel.querySelector('.tasteStatus').textContent=message+' '+ranked().length+' places re-ranked. Matches are estimates.';
 control.focus({preventScroll:true});window.scrollTo(0,scroll);
 const list=document.querySelector('.restaurantGrid');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)list?.animate([{opacity:.6},{opacity:1}],{duration:180,easing:'ease-out'});
}
document.addEventListener('change',event=>{
 const control=event.target.closest('[data-taste]');if(!control)return;
 const q=questions.find(q=>q.k===control.dataset.taste),option=q?.o.find(([v])=>v===control.value);if(!option)return;
 state.answers[q.k]=option[0];selectedPinId=null;
 refreshTaste(control,option[1]+' selected.');
});
document.addEventListener('click',event=>{
 const reset=event.target.closest('[data-taste-reset]');if(!reset)return;
 state.answers=Object.fromEntries(questions.map(q=>[q.k,q.o[0][0]]));selectedPinId=null;
 refreshTaste(reset,'Default preferences restored.');
});

const palateoStreetStyle={"version":8,"sources":{"ne2_shaded":{"maxzoom":6,"tileSize":256,"tiles":["https://tiles.openfreemap.org/natural_earth/ne2sr/{z}/{x}/{y}.png"],"type":"raster"},"openmaptiles":{"type":"vector","url":"https://tiles.openfreemap.org/planet"}},"sprite":"https://tiles.openfreemap.org/sprites/ofm_f384/ofm","glyphs":"https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf","layers":[{"id":"background","type":"background","paint":{"background-color":"#f2f3f5"}},{"id":"natural_earth","type":"raster","source":"ne2_shaded","maxzoom":7,"paint":{"raster-opacity":["interpolate",["exponential",1.5],["zoom"],0,0.6,6,0.1]}},{"id":"park","type":"fill","source":"openmaptiles","source-layer":"park","paint":{"fill-color":"#d5e6c8","fill-opacity":0.7,"fill-outline-color":"rgba(95, 208, 100, 1)"}},{"id":"park_outline","type":"line","source":"openmaptiles","source-layer":"park","paint":{"line-color":"rgba(228, 241, 215, 1)","line-dasharray":[1,1.5]}},{"id":"landuse_residential","type":"fill","source":"openmaptiles","source-layer":"landuse","maxzoom":12,"filter":["==",["get","class"],"residential"],"paint":{"fill-color":["interpolate",["linear"],["zoom"],9,"hsla(0,3%,85%,0.84)",12,"hsla(35,57%,88%,0.49)"]}},{"id":"landcover_wood","type":"fill","source":"openmaptiles","source-layer":"landcover","filter":["==",["get","class"],"wood"],"paint":{"fill-antialias":false,"fill-color":"hsla(98,61%,72%,0.7)","fill-opacity":0.4}},{"id":"landcover_grass","type":"fill","source":"openmaptiles","source-layer":"landcover","filter":["==",["get","class"],"grass"],"paint":{"fill-antialias":false,"fill-color":"rgba(176, 213, 154, 1)","fill-opacity":0.3}},{"id":"landcover_ice","type":"fill","source":"openmaptiles","source-layer":"landcover","filter":["==",["get","class"],"ice"],"paint":{"fill-antialias":false,"fill-color":"rgba(224, 236, 236, 1)","fill-opacity":0.8}},{"id":"landcover_wetland","type":"fill","source":"openmaptiles","source-layer":"landcover","minzoom":12,"filter":["==",["get","class"],"wetland"],"paint":{"fill-antialias":true,"fill-opacity":0.8,"fill-pattern":"wetland_bg_11","fill-translate-anchor":"map"}},{"id":"landuse_pitch","type":"fill","source":"openmaptiles","source-layer":"landuse","filter":["==",["get","class"],"pitch"],"paint":{"fill-color":"#DEE3CD"}},{"id":"landuse_track","type":"fill","source":"openmaptiles","source-layer":"landuse","filter":["==",["get","class"],"track"],"paint":{"fill-color":"#DEE3CD"}},{"id":"landuse_cemetery","type":"fill","source":"openmaptiles","source-layer":"landuse","filter":["==",["get","class"],"cemetery"],"paint":{"fill-color":"hsl(75,37%,81%)"}},{"id":"landuse_hospital","type":"fill","source":"openmaptiles","source-layer":"landuse","filter":["==",["get","class"],"hospital"],"paint":{"fill-color":"#fde"}},{"id":"landuse_school","type":"fill","source":"openmaptiles","source-layer":"landuse","filter":["==",["get","class"],"school"],"paint":{"fill-color":"rgb(236,238,204)"}},{"id":"waterway_tunnel","type":"line","source":"openmaptiles","source-layer":"waterway","filter":["==",["get","brunnel"],"tunnel"],"paint":{"line-color":"#a0c8f0","line-dasharray":[3,3],"line-gap-width":["interpolate",["linear"],["zoom"],12,0,20,6],"line-opacity":1,"line-width":["interpolate",["exponential",1.4],["zoom"],8,1,20,2]}},{"id":"waterway_river","type":"line","source":"openmaptiles","source-layer":"waterway","filter":["all",["==",["get","class"],"river"],["!=",["get","brunnel"],"tunnel"]],"layout":{"line-cap":"round"},"paint":{"line-color":"#a0c8f0","line-width":["interpolate",["exponential",1.2],["zoom"],11,0.5,20,6]}},{"id":"waterway_other","type":"line","source":"openmaptiles","source-layer":"waterway","filter":["all",["!=",["get","class"],"river"],["!=",["get","brunnel"],"tunnel"]],"layout":{"line-cap":"round"},"paint":{"line-color":"#a0c8f0","line-width":["interpolate",["exponential",1.3],["zoom"],13,0.5,20,6]}},{"id":"water","type":"fill","source":"openmaptiles","source-layer":"water","filter":["!=",["get","brunnel"],"tunnel"],"paint":{"fill-color":"#b2d8f3"}},{"id":"landcover_sand","type":"fill","source":"openmaptiles","source-layer":"landcover","filter":["==",["get","class"],"sand"],"paint":{"fill-color":"rgba(247, 239, 195, 1)"}},{"id":"aeroway_fill","type":"fill","source":"openmaptiles","source-layer":"aeroway","minzoom":11,"filter":["match",["geometry-type"],["MultiPolygon","Polygon"],true,false],"paint":{"fill-color":"rgba(229, 228, 224, 1)","fill-opacity":0.7}},{"id":"aeroway_runway","type":"line","source":"openmaptiles","source-layer":"aeroway","minzoom":11,"filter":["all",["match",["geometry-type"],["LineString","MultiLineString"],true,false],["==",["get","class"],"runway"]],"paint":{"line-color":"#f0ede9","line-width":["interpolate",["exponential",1.2],["zoom"],11,3,20,16]}},{"id":"aeroway_taxiway","type":"line","source":"openmaptiles","source-layer":"aeroway","minzoom":11,"filter":["all",["match",["geometry-type"],["LineString","MultiLineString"],true,false],["==",["get","class"],"taxiway"]],"paint":{"line-color":"#f0ede9","line-width":["interpolate",["exponential",1.2],["zoom"],11,0.5,20,6]}},{"id":"tunnel_motorway_link_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","class"],"motorway"],["==",["get","ramp"],1],["==",["get","brunnel"],"tunnel"]],"layout":{"line-join":"round"},"paint":{"line-color":"#d6dbdf","line-dasharray":[0.5,0.25],"line-width":["interpolate",["exponential",1.2],["zoom"],12,1,13,3,14,4,20,15]}},{"id":"tunnel_service_track_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"tunnel"],["match",["get","class"],["service","track"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"#cfcdca","line-dasharray":[0.5,0.25],"line-width":["interpolate",["exponential",1.2],["zoom"],15,1,16,4,20,11]}},{"id":"tunnel_link_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","ramp"],1],["==",["get","brunnel"],"tunnel"]],"layout":{"line-join":"round"},"paint":{"line-color":"#d6dbdf","line-width":["interpolate",["exponential",1.2],["zoom"],12,1,13,3,14,4,20,15]}},{"id":"tunnel_street_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"tunnel"],["match",["get","class"],["street","street_limited"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"#cfcdca","line-opacity":["interpolate",["linear"],["zoom"],12,0,12.5,1],"line-width":["interpolate",["exponential",1.2],["zoom"],12,0.5,13,1,14,4,20,15]}},{"id":"tunnel_secondary_tertiary_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"tunnel"],["match",["get","class"],["secondary","tertiary"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"#d6dbdf","line-width":["interpolate",["exponential",1.2],["zoom"],8,1.5,20,17]}},{"id":"tunnel_trunk_primary_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"tunnel"],["match",["get","class"],["primary","trunk"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"#d6dbdf","line-width":["interpolate",["exponential",1.2],["zoom"],5,0.4,6,0.7,7,1.75,20,22]}},{"id":"tunnel_motorway_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","class"],"motorway"],["!=",["get","ramp"],1],["==",["get","brunnel"],"tunnel"]],"layout":{"line-join":"round"},"paint":{"line-color":"#d6dbdf","line-dasharray":[0.5,0.25],"line-width":["interpolate",["exponential",1.2],["zoom"],5,0.4,6,0.7,7,1.75,20,22]}},{"id":"tunnel_path_pedestrian","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["match",["geometry-type"],["LineString","MultiLineString"],true,false],["==",["get","brunnel"],"tunnel"],["match",["get","class"],["path","pedestrian"],true,false]],"paint":{"line-color":"hsl(0,0%,100%)","line-dasharray":[1,0.75],"line-width":["interpolate",["exponential",1.2],["zoom"],14,0.5,20,10]}},{"id":"tunnel_motorway_link","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","class"],"motorway"],["==",["get","ramp"],1],["==",["get","brunnel"],"tunnel"]],"layout":{"line-join":"round"},"paint":{"line-color":"#ffffff","line-width":["interpolate",["exponential",1.2],["zoom"],12.5,0,13,1.5,14,2.5,20,11.5]}},{"id":"tunnel_service_track","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"tunnel"],["match",["get","class"],["service","track"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"#fff","line-width":["interpolate",["exponential",1.2],["zoom"],15.5,0,16,2,20,7.5]}},{"id":"tunnel_link","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","ramp"],1],["==",["get","brunnel"],"tunnel"]],"layout":{"line-join":"round"},"paint":{"line-color":"#ffffff","line-width":["interpolate",["exponential",1.2],["zoom"],12.5,0,13,1.5,14,2.5,20,11.5]}},{"id":"tunnel_minor","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"tunnel"],["match",["get","class"],["minor"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"#fff","line-width":["interpolate",["exponential",1.2],["zoom"],13.5,0,14,2.5,20,11.5]}},{"id":"tunnel_secondary_tertiary","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"tunnel"],["match",["get","class"],["secondary","tertiary"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"#ffffff","line-width":["interpolate",["exponential",1.2],["zoom"],6.5,0,7,0.5,20,10]}},{"id":"tunnel_trunk_primary","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"tunnel"],["match",["get","class"],["primary","trunk"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"#ffffff","line-width":["interpolate",["exponential",1.2],["zoom"],5,0,7,1,20,18]}},{"id":"tunnel_motorway","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","class"],"motorway"],["!=",["get","ramp"],1],["==",["get","brunnel"],"tunnel"]],"layout":{"line-join":"round"},"paint":{"line-color":"#ffffff","line-width":["interpolate",["exponential",1.2],["zoom"],5,0,7,1,20,18]}},{"id":"tunnel_major_rail","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"tunnel"],["match",["get","class"],["rail"],true,false]],"paint":{"line-color":"#bbb","line-width":["interpolate",["exponential",1.4],["zoom"],14,0.4,15,0.75,20,2]}},{"id":"tunnel_major_rail_hatching","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"tunnel"],["==",["get","class"],"rail"]],"paint":{"line-color":"#bbb","line-dasharray":[0.2,8],"line-width":["interpolate",["exponential",1.4],["zoom"],14.5,0,15,3,20,8]}},{"id":"tunnel_transit_rail","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"tunnel"],["match",["get","class"],["transit"],true,false]],"paint":{"line-color":"#bbb","line-width":["interpolate",["exponential",1.4],["zoom"],14,0.4,15,0.75,20,2]}},{"id":"tunnel_transit_rail_hatching","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"tunnel"],["==",["get","class"],"transit"]],"paint":{"line-color":"#bbb","line-dasharray":[0.2,8],"line-width":["interpolate",["exponential",1.4],["zoom"],14.5,0,15,3,20,8]}},{"id":"road_area_pattern","type":"fill","source":"openmaptiles","source-layer":"transportation","filter":["match",["geometry-type"],["MultiPolygon","Polygon"],true,false],"paint":{"fill-pattern":"pedestrian_polygon"}},{"id":"road_motorway_link_casing","type":"line","source":"openmaptiles","source-layer":"transportation","minzoom":12,"filter":["all",["match",["get","brunnel"],["bridge","tunnel"],false,true],["==",["get","class"],"motorway"],["==",["get","ramp"],1]],"layout":{"line-cap":"round","line-join":"round"},"paint":{"line-color":"#d6dbdf","line-width":["interpolate",["exponential",1.2],["zoom"],12,1,13,3,14,4,20,15]}},{"id":"road_service_track_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["match",["get","brunnel"],["bridge","tunnel"],false,true],["match",["get","class"],["service","track"],true,false]],"layout":{"line-cap":"round","line-join":"round"},"paint":{"line-color":"#cfcdca","line-width":["interpolate",["exponential",1.2],["zoom"],15,1,16,4,20,11]}},{"id":"road_link_casing","type":"line","source":"openmaptiles","source-layer":"transportation","minzoom":13,"filter":["all",["match",["get","brunnel"],["bridge","tunnel"],false,true],["match",["get","class"],["motorway","path","pedestrian","service","track"],false,true],["==",["get","ramp"],1]],"layout":{"line-cap":"round","line-join":"round"},"paint":{"line-color":"#d6dbdf","line-width":["interpolate",["exponential",1.2],["zoom"],12,1,13,3,14,4,20,15]}},{"id":"road_minor_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["match",["geometry-type"],["LineString","MultiLineString"],true,false],["match",["get","brunnel"],["bridge","tunnel"],false,true],["match",["get","class"],["minor"],true,false],["!=",["get","ramp"],1]],"layout":{"line-cap":"round","line-join":"round"},"paint":{"line-color":"#cfcdca","line-opacity":["interpolate",["linear"],["zoom"],12,0,12.5,1],"line-width":["interpolate",["exponential",1.2],["zoom"],12,0.5,13,1,14,4,20,20]}},{"id":"road_secondary_tertiary_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["match",["get","brunnel"],["bridge","tunnel"],false,true],["match",["get","class"],["secondary","tertiary"],true,false],["!=",["get","ramp"],1]],"layout":{"line-cap":"round","line-join":"round"},"paint":{"line-color":"#d6dbdf","line-width":["interpolate",["exponential",1.2],["zoom"],8,1.5,20,17]}},{"id":"road_trunk_primary_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["match",["get","brunnel"],["bridge","tunnel"],false,true],["match",["get","class"],["primary","trunk"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"#d6dbdf","line-width":["interpolate",["exponential",1.2],["zoom"],5,0.4,6,0.7,7,1.75,20,22]}},{"id":"road_motorway_casing","type":"line","source":"openmaptiles","source-layer":"transportation","minzoom":5,"filter":["all",["match",["get","brunnel"],["bridge","tunnel"],false,true],["==",["get","class"],"motorway"],["!=",["get","ramp"],1]],"layout":{"line-cap":"round","line-join":"round"},"paint":{"line-color":"#d6dbdf","line-width":["interpolate",["exponential",1.2],["zoom"],5,0.4,6,0.7,7,1.75,20,22]}},{"id":"road_path_pedestrian","type":"line","source":"openmaptiles","source-layer":"transportation","minzoom":14,"filter":["all",["match",["geometry-type"],["LineString","MultiLineString"],true,false],["match",["get","brunnel"],["bridge","tunnel"],false,true],["match",["get","class"],["path","pedestrian"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"hsl(0,0%,100%)","line-dasharray":[1,0.7],"line-width":["interpolate",["exponential",1.2],["zoom"],14,1,20,10]}},{"id":"road_motorway_link","type":"line","source":"openmaptiles","source-layer":"transportation","minzoom":12,"filter":["all",["match",["get","brunnel"],["bridge","tunnel"],false,true],["==",["get","class"],"motorway"],["==",["get","ramp"],1]],"layout":{"line-cap":"round","line-join":"round"},"paint":{"line-color":"#ffffff","line-width":["interpolate",["exponential",1.2],["zoom"],12.5,0,13,1.5,14,2.5,20,11.5]}},{"id":"road_service_track","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["match",["get","brunnel"],["bridge","tunnel"],false,true],["match",["get","class"],["service","track"],true,false]],"layout":{"line-cap":"round","line-join":"round"},"paint":{"line-color":"#fff","line-width":["interpolate",["exponential",1.2],["zoom"],15.5,0,16,2,20,7.5]}},{"id":"road_link","type":"line","source":"openmaptiles","source-layer":"transportation","minzoom":13,"filter":["all",["match",["get","brunnel"],["bridge","tunnel"],false,true],["==",["get","ramp"],1],["match",["get","class"],["motorway","path","pedestrian","service","track"],false,true]],"layout":{"line-cap":"round","line-join":"round"},"paint":{"line-color":"#ffffff","line-width":["interpolate",["exponential",1.2],["zoom"],12.5,0,13,1.5,14,2.5,20,11.5]}},{"id":"road_minor","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["match",["geometry-type"],["LineString","MultiLineString"],true,false],["match",["get","brunnel"],["bridge","tunnel"],false,true],["match",["get","class"],["minor"],true,false]],"layout":{"line-cap":"round","line-join":"round"},"paint":{"line-color":"#fff","line-width":["interpolate",["exponential",1.2],["zoom"],13.5,0,14,2.5,20,18]}},{"id":"road_secondary_tertiary","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["match",["get","brunnel"],["bridge","tunnel"],false,true],["match",["get","class"],["secondary","tertiary"],true,false]],"layout":{"line-cap":"round","line-join":"round"},"paint":{"line-color":"#ffffff","line-width":["interpolate",["exponential",1.2],["zoom"],6.5,0,8,0.5,20,13]}},{"id":"road_trunk_primary","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["match",["get","brunnel"],["bridge","tunnel"],false,true],["match",["get","class"],["primary","trunk"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"#ffffff","line-width":["interpolate",["exponential",1.2],["zoom"],5,0,7,1,20,18]}},{"id":"road_motorway","type":"line","source":"openmaptiles","source-layer":"transportation","minzoom":5,"filter":["all",["match",["get","brunnel"],["bridge","tunnel"],false,true],["==",["get","class"],"motorway"],["!=",["get","ramp"],1]],"layout":{"line-cap":"round","line-join":"round"},"paint":{"line-color":["interpolate",["linear"],["zoom"],5,"#ffffff",6,"#fc8"],"line-width":["interpolate",["exponential",1.2],["zoom"],5,0,7,1,20,18]}},{"id":"road_major_rail","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["match",["get","brunnel"],["bridge","tunnel"],false,true],["==",["get","class"],"rail"]],"paint":{"line-color":"#bbb","line-width":["interpolate",["exponential",1.4],["zoom"],14,0.4,15,0.75,20,2]}},{"id":"road_major_rail_hatching","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["match",["get","brunnel"],["bridge","tunnel"],false,true],["==",["get","class"],"rail"]],"paint":{"line-color":"#bbb","line-dasharray":[0.2,8],"line-width":["interpolate",["exponential",1.4],["zoom"],14.5,0,15,3,20,8]}},{"id":"road_transit_rail","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["match",["get","brunnel"],["bridge","tunnel"],false,true],["==",["get","class"],"transit"]],"paint":{"line-color":"#bbb","line-width":["interpolate",["exponential",1.4],["zoom"],14,0.4,15,0.75,20,2]}},{"id":"road_transit_rail_hatching","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["match",["get","brunnel"],["bridge","tunnel"],false,true],["==",["get","class"],"transit"]],"paint":{"line-color":"#bbb","line-dasharray":[0.2,8],"line-width":["interpolate",["exponential",1.4],["zoom"],14.5,0,15,3,20,8]}},{"id":"road_one_way_arrow","type":"symbol","source":"openmaptiles","source-layer":"transportation","minzoom":16,"filter":["==",["get","oneway"],1],"layout":{"icon-image":"arrow","symbol-placement":"line"}},{"id":"road_one_way_arrow_opposite","type":"symbol","source":"openmaptiles","source-layer":"transportation","minzoom":16,"filter":["==",["get","oneway"],-1],"layout":{"icon-image":"arrow","icon-rotate":180,"symbol-placement":"line"}},{"id":"bridge_motorway_link_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","class"],"motorway"],["==",["get","ramp"],1],["==",["get","brunnel"],"bridge"]],"layout":{"line-join":"round"},"paint":{"line-color":"#d6dbdf","line-width":["interpolate",["exponential",1.2],["zoom"],12,1,13,3,14,4,20,15]}},{"id":"bridge_service_track_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"bridge"],["match",["get","class"],["service","track"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"#cfcdca","line-width":["interpolate",["exponential",1.2],["zoom"],15,1,16,4,20,11]}},{"id":"bridge_link_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","class"],"link"],["==",["get","brunnel"],"bridge"]],"layout":{"line-join":"round"},"paint":{"line-color":"#d6dbdf","line-width":["interpolate",["exponential",1.2],["zoom"],12,1,13,3,14,4,20,15]}},{"id":"bridge_street_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"bridge"],["match",["get","class"],["street","street_limited"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"hsl(36,6%,74%)","line-opacity":["interpolate",["linear"],["zoom"],12,0,12.5,1],"line-width":["interpolate",["exponential",1.2],["zoom"],12,0.5,13,1,14,4,20,25]}},{"id":"bridge_path_pedestrian_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["match",["geometry-type"],["LineString","MultiLineString"],true,false],["==",["get","brunnel"],"bridge"],["match",["get","class"],["path","pedestrian"],true,false]],"paint":{"line-color":"hsl(35,6%,80%)","line-dasharray":[1,0],"line-width":["interpolate",["exponential",1.2],["zoom"],14,1.5,20,18]}},{"id":"bridge_secondary_tertiary_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"bridge"],["match",["get","class"],["secondary","tertiary"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"#d6dbdf","line-width":["interpolate",["exponential",1.2],["zoom"],8,1.5,20,17]}},{"id":"bridge_trunk_primary_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"bridge"],["match",["get","class"],["primary","trunk"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"#d6dbdf","line-width":["interpolate",["exponential",1.2],["zoom"],5,0.4,6,0.7,7,1.75,20,22]}},{"id":"bridge_motorway_casing","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","class"],"motorway"],["!=",["get","ramp"],1],["==",["get","brunnel"],"bridge"]],"layout":{"line-join":"round"},"paint":{"line-color":"#d6dbdf","line-width":["interpolate",["exponential",1.2],["zoom"],5,0.4,6,0.7,7,1.75,20,22]}},{"id":"bridge_path_pedestrian","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["match",["geometry-type"],["LineString","MultiLineString"],true,false],["==",["get","brunnel"],"bridge"],["match",["get","class"],["path","pedestrian"],true,false]],"paint":{"line-color":"hsl(0,0%,100%)","line-dasharray":[1,0.3],"line-width":["interpolate",["exponential",1.2],["zoom"],14,0.5,20,10]}},{"id":"bridge_motorway_link","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","class"],"motorway"],["==",["get","ramp"],1],["==",["get","brunnel"],"bridge"]],"layout":{"line-join":"round"},"paint":{"line-color":"#ffffff","line-width":["interpolate",["exponential",1.2],["zoom"],12.5,0,13,1.5,14,2.5,20,11.5]}},{"id":"bridge_service_track","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"bridge"],["match",["get","class"],["service","track"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"#fff","line-width":["interpolate",["exponential",1.2],["zoom"],15.5,0,16,2,20,7.5]}},{"id":"bridge_link","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","class"],"link"],["==",["get","brunnel"],"bridge"]],"layout":{"line-join":"round"},"paint":{"line-color":"#ffffff","line-width":["interpolate",["exponential",1.2],["zoom"],12.5,0,13,1.5,14,2.5,20,11.5]}},{"id":"bridge_street","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"bridge"],["match",["get","class"],["minor"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"#fff","line-width":["interpolate",["exponential",1.2],["zoom"],13.5,0,14,2.5,20,18]}},{"id":"bridge_secondary_tertiary","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"bridge"],["match",["get","class"],["secondary","tertiary"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"#ffffff","line-width":["interpolate",["exponential",1.2],["zoom"],6.5,0,7,0.5,20,10]}},{"id":"bridge_trunk_primary","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","brunnel"],"bridge"],["match",["get","class"],["primary","trunk"],true,false]],"layout":{"line-join":"round"},"paint":{"line-color":"#ffffff","line-width":["interpolate",["exponential",1.2],["zoom"],5,0,7,1,20,18]}},{"id":"bridge_motorway","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","class"],"motorway"],["!=",["get","ramp"],1],["==",["get","brunnel"],"bridge"]],"layout":{"line-join":"round"},"paint":{"line-color":"#ffffff","line-width":["interpolate",["exponential",1.2],["zoom"],5,0,7,1,20,18]}},{"id":"bridge_major_rail","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","class"],"rail"],["==",["get","brunnel"],"bridge"]],"paint":{"line-color":"#bbb","line-width":["interpolate",["exponential",1.4],["zoom"],14,0.4,15,0.75,20,2]}},{"id":"bridge_major_rail_hatching","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","class"],"rail"],["==",["get","brunnel"],"bridge"]],"paint":{"line-color":"#bbb","line-dasharray":[0.2,8],"line-width":["interpolate",["exponential",1.4],["zoom"],14.5,0,15,3,20,8]}},{"id":"bridge_transit_rail","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","class"],"transit"],["==",["get","brunnel"],"bridge"]],"paint":{"line-color":"#bbb","line-width":["interpolate",["exponential",1.4],["zoom"],14,0.4,15,0.75,20,2]}},{"id":"bridge_transit_rail_hatching","type":"line","source":"openmaptiles","source-layer":"transportation","filter":["all",["==",["get","class"],"transit"],["==",["get","brunnel"],"bridge"]],"paint":{"line-color":"#bbb","line-dasharray":[0.2,8],"line-width":["interpolate",["exponential",1.4],["zoom"],14.5,0,15,3,20,8]}},{"id":"building","type":"fill","source":"openmaptiles","source-layer":"building","minzoom":13,"maxzoom":14,"paint":{"fill-color":"#e4e5e6","fill-outline-color":["interpolate",["linear"],["zoom"],13,"hsla(35,6%,79%,0.32)",14,"hsl(35,6%,79%)"]}},{"id":"boundary_3","type":"line","source":"openmaptiles","source-layer":"boundary","minzoom":5,"filter":["all",[">=",["get","admin_level"],3],["<=",["get","admin_level"],6],["!=",["get","maritime"],1],["!=",["get","disputed"],1],["!",["has","claimed_by"]]],"paint":{"line-color":"hsl(0,0%,70%)","line-dasharray":[1,1],"line-width":["interpolate",["linear",1],["zoom"],7,1,11,2]}},{"id":"boundary_2","type":"line","source":"openmaptiles","source-layer":"boundary","filter":["all",["==",["get","admin_level"],2],["!=",["get","maritime"],1],["!=",["get","disputed"],1],["!",["has","claimed_by"]]],"layout":{"line-cap":"round","line-join":"round"},"paint":{"line-color":"hsl(248,1%,41%)","line-opacity":["interpolate",["linear"],["zoom"],0,0.4,4,1],"line-width":["interpolate",["linear"],["zoom"],3,1,5,1.2,12,3]}},{"id":"boundary_disputed","type":"line","source":"openmaptiles","source-layer":"boundary","filter":["all",["!=",["get","maritime"],1],["==",["get","disputed"],1]],"paint":{"line-color":"hsl(248,1%,41%)","line-dasharray":[1,2],"line-width":["interpolate",["linear"],["zoom"],3,1,5,1.2,12,3]}},{"id":"waterway_line_label","type":"symbol","source":"openmaptiles","source-layer":"waterway","minzoom":10,"filter":["match",["geometry-type"],["LineString","MultiLineString"],true,false],"layout":{"symbol-placement":"line","symbol-spacing":350,"text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"]," ",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Italic"],"text-letter-spacing":0.2,"text-max-width":5,"text-size":14},"paint":{"text-color":"#74aee9","text-halo-color":"rgba(255,255,255,0.7)","text-halo-width":1.5}},{"id":"water_name_point_label","type":"symbol","source":"openmaptiles","source-layer":"water_name","filter":["match",["geometry-type"],["MultiPoint","Point"],true,false],"layout":{"text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"],"\n",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Italic"],"text-letter-spacing":0.2,"text-max-width":5,"text-size":["interpolate",["linear"],["zoom"],0,10,8,14]},"paint":{"text-color":"#495e91","text-halo-color":"rgba(255,255,255,0.7)","text-halo-width":1.5}},{"id":"water_name_line_label","type":"symbol","source":"openmaptiles","source-layer":"water_name","filter":["match",["geometry-type"],["LineString","MultiLineString"],true,false],"layout":{"symbol-placement":"line","symbol-spacing":350,"text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"]," ",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Italic"],"text-letter-spacing":0.2,"text-max-width":5,"text-size":14},"paint":{"text-color":"#495e91","text-halo-color":"rgba(255,255,255,0.7)","text-halo-width":1.5}},{"id":"poi_r20","type":"symbol","source":"openmaptiles","source-layer":"poi","minzoom":17,"filter":["all",["match",["geometry-type"],["MultiPoint","Point"],true,false],[">=",["get","rank"],20]],"layout":{"icon-image":["match",["get","subclass"],["florist","furniture"],["get","subclass"],["get","class"]],"text-anchor":"top","text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"],"\n",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Italic"],"text-max-width":9,"text-offset":[0,0.6],"text-size":12},"paint":{"text-color":"#666","text-halo-blur":0.5,"text-halo-color":"#ffffff","text-halo-width":1}},{"id":"poi_r7","type":"symbol","source":"openmaptiles","source-layer":"poi","minzoom":16,"filter":["all",["match",["geometry-type"],["MultiPoint","Point"],true,false],[">=",["get","rank"],7],["<",["get","rank"],20]],"layout":{"icon-image":["match",["get","subclass"],["florist","furniture"],["get","subclass"],["get","class"]],"text-anchor":"top","text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"],"\n",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Italic"],"text-max-width":9,"text-offset":[0,0.6],"text-size":12},"paint":{"text-color":"#666","text-halo-blur":0.5,"text-halo-color":"#ffffff","text-halo-width":1}},{"id":"poi_r1","type":"symbol","source":"openmaptiles","source-layer":"poi","minzoom":15,"filter":["all",["match",["geometry-type"],["MultiPoint","Point"],true,false],[">=",["get","rank"],1],["<",["get","rank"],7]],"layout":{"icon-image":["match",["get","subclass"],["florist","furniture"],["get","subclass"],["get","class"]],"text-anchor":"top","text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"],"\n",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Italic"],"text-max-width":9,"text-offset":[0,0.6],"text-size":12},"paint":{"text-color":"#666","text-halo-blur":0.5,"text-halo-color":"#ffffff","text-halo-width":1}},{"id":"poi_transit","type":"symbol","source":"openmaptiles","source-layer":"poi","filter":["match",["get","class"],["airport","bus","rail"],true,false],"layout":{"icon-image":["to-string",["get","class"]],"icon-size":0.7,"text-anchor":"left","text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"],"\n",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Italic"],"text-max-width":9,"text-offset":[0.9,0],"text-size":12},"paint":{"text-color":"#2e5a80","text-halo-blur":0.5,"text-halo-color":"#ffffff","text-halo-width":1}},{"id":"highway-name-path","type":"symbol","source":"openmaptiles","source-layer":"transportation_name","minzoom":15.5,"filter":["==",["get","class"],"path"],"layout":{"symbol-placement":"line","text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"]," ",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Regular"],"text-rotation-alignment":"map","text-size":["interpolate",["linear"],["zoom"],13,12,14,13]},"paint":{"text-color":"hsl(30,23%,62%)","text-halo-color":"#f8f4f0","text-halo-width":0.5}},{"id":"highway-name-minor","type":"symbol","source":"openmaptiles","source-layer":"transportation_name","minzoom":15,"filter":["all",["match",["geometry-type"],["LineString","MultiLineString"],true,false],["match",["get","class"],["minor","service","track"],true,false]],"layout":{"symbol-placement":"line","text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"]," ",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Regular"],"text-rotation-alignment":"map","text-size":["interpolate",["linear"],["zoom"],13,12,14,13]},"paint":{"text-color":"#666","text-halo-blur":0.5,"text-halo-width":1}},{"id":"highway-name-major","type":"symbol","source":"openmaptiles","source-layer":"transportation_name","minzoom":12.2,"filter":["match",["get","class"],["primary","secondary","tertiary","trunk"],true,false],"layout":{"symbol-placement":"line","text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"]," ",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Regular"],"text-rotation-alignment":"map","text-size":["interpolate",["linear"],["zoom"],13,12,14,13]},"paint":{"text-color":"#666","text-halo-blur":0.5,"text-halo-width":1}},{"id":"highway-shield-non-us","type":"symbol","source":"openmaptiles","source-layer":"transportation_name","minzoom":8,"filter":["all",["<=",["get","ref_length"],6],["match",["geometry-type"],["LineString","MultiLineString"],true,false],["match",["get","network"],["us-highway","us-interstate","us-state"],false,true]],"layout":{"icon-image":["concat","road_",["get","ref_length"]],"icon-rotation-alignment":"viewport","icon-size":1,"symbol-placement":["step",["zoom"],"point",11,"line"],"symbol-spacing":200,"text-field":["to-string",["get","ref"]],"text-font":["Noto Sans Regular"],"text-rotation-alignment":"viewport","text-size":10}},{"id":"highway-shield-us-interstate","type":"symbol","source":"openmaptiles","source-layer":"transportation_name","minzoom":7,"filter":["all",["<=",["get","ref_length"],6],["match",["geometry-type"],["LineString","MultiLineString"],true,false],["match",["get","network"],["us-interstate"],true,false]],"layout":{"icon-image":["concat",["get","network"],"_",["get","ref_length"]],"icon-rotation-alignment":"viewport","icon-size":1,"symbol-placement":["step",["zoom"],"point",7,"line",8,"line"],"symbol-spacing":200,"text-field":["to-string",["get","ref"]],"text-font":["Noto Sans Regular"],"text-rotation-alignment":"viewport","text-size":10}},{"id":"road_shield_us","type":"symbol","source":"openmaptiles","source-layer":"transportation_name","minzoom":9,"filter":["all",["<=",["get","ref_length"],6],["match",["geometry-type"],["LineString","MultiLineString"],true,false],["match",["get","network"],["us-highway","us-state"],true,false]],"layout":{"icon-image":["concat",["get","network"],"_",["get","ref_length"]],"icon-rotation-alignment":"viewport","icon-size":1,"symbol-placement":["step",["zoom"],"point",11,"line"],"symbol-spacing":200,"text-field":["to-string",["get","ref"]],"text-font":["Noto Sans Regular"],"text-rotation-alignment":"viewport","text-size":10}},{"id":"airport","type":"symbol","source":"openmaptiles","source-layer":"aerodrome_label","minzoom":10,"filter":["all",["has","iata"]],"layout":{"icon-image":"airport_11","icon-size":1,"text-anchor":"top","text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"],"\n",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Regular"],"text-max-width":9,"text-offset":[0,0.6],"text-optional":true,"text-padding":2,"text-size":12},"paint":{"text-color":"#666","text-halo-blur":0.5,"text-halo-color":"#ffffff","text-halo-width":1}},{"id":"label_other","type":"symbol","source":"openmaptiles","source-layer":"place","minzoom":8,"filter":["match",["get","class"],["city","continent","country","state","town","village"],false,true],"layout":{"text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"],"\n",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Italic"],"text-letter-spacing":0.1,"text-max-width":9,"text-size":["interpolate",["linear"],["zoom"],8,9,12,10],"text-transform":"uppercase"},"paint":{"text-color":"#333","text-halo-blur":1,"text-halo-color":"#fff","text-halo-width":1}},{"id":"label_village","type":"symbol","source":"openmaptiles","source-layer":"place","minzoom":9,"filter":["==",["get","class"],"village"],"layout":{"icon-allow-overlap":true,"icon-image":["step",["zoom"],"circle_11_black",10,""],"icon-optional":false,"icon-size":0.2,"text-anchor":"bottom","text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"],"\n",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Regular"],"text-max-width":8,"text-size":["interpolate",["exponential",1.2],["zoom"],7,10,11,12]},"paint":{"text-color":"#000","text-halo-blur":1,"text-halo-color":"#fff","text-halo-width":1}},{"id":"label_town","type":"symbol","source":"openmaptiles","source-layer":"place","minzoom":6,"filter":["==",["get","class"],"town"],"layout":{"icon-allow-overlap":true,"icon-image":["step",["zoom"],"circle_11_black",10,""],"icon-optional":false,"icon-size":0.2,"text-anchor":"bottom","text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"],"\n",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Regular"],"text-max-width":8,"text-size":["interpolate",["exponential",1.2],["zoom"],7,12,11,14]},"paint":{"text-color":"#000","text-halo-blur":1,"text-halo-color":"#fff","text-halo-width":1}},{"id":"label_state","type":"symbol","source":"openmaptiles","source-layer":"place","minzoom":5,"maxzoom":8,"filter":["==",["get","class"],"state"],"layout":{"text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"],"\n",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Italic"],"text-letter-spacing":0.2,"text-max-width":9,"text-size":["interpolate",["linear"],["zoom"],5,10,8,14],"text-transform":"uppercase"},"paint":{"text-color":"#333","text-halo-blur":1,"text-halo-color":"#fff","text-halo-width":1}},{"id":"label_city","type":"symbol","source":"openmaptiles","source-layer":"place","minzoom":3,"filter":["all",["==",["get","class"],"city"],["!=",["get","capital"],2]],"layout":{"icon-allow-overlap":true,"icon-image":["step",["zoom"],"circle_11_black",9,""],"icon-optional":false,"icon-size":0.4,"text-anchor":"bottom","text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"],"\n",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Regular"],"text-max-width":8,"text-offset":[0,-0.1],"text-size":["interpolate",["exponential",1.2],["zoom"],4,11,7,13,11,18]},"paint":{"text-color":"#000","text-halo-blur":1,"text-halo-color":"#fff","text-halo-width":1}},{"id":"label_city_capital","type":"symbol","source":"openmaptiles","source-layer":"place","minzoom":3,"filter":["all",["==",["get","class"],"city"],["==",["get","capital"],2]],"layout":{"icon-allow-overlap":true,"icon-image":["step",["zoom"],"circle_11_black",9,""],"icon-optional":false,"icon-size":0.5,"text-anchor":"bottom","text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"],"\n",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Bold"],"text-max-width":8,"text-offset":[0,-0.2],"text-size":["interpolate",["exponential",1.2],["zoom"],4,12,7,14,11,20]},"paint":{"text-color":"#000","text-halo-blur":1,"text-halo-color":"#fff","text-halo-width":1}},{"id":"label_country_3","type":"symbol","source":"openmaptiles","source-layer":"place","minzoom":2,"maxzoom":9,"filter":["all",["==",["get","class"],"country"],[">=",["get","rank"],3]],"layout":{"text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"],"\n",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Bold"],"text-max-width":6.25,"text-size":["interpolate",["linear"],["zoom"],3,9,7,17]},"paint":{"text-color":"#000","text-halo-blur":1,"text-halo-color":"#fff","text-halo-width":1}},{"id":"label_country_2","type":"symbol","source":"openmaptiles","source-layer":"place","maxzoom":9,"filter":["all",["==",["get","class"],"country"],["==",["get","rank"],2]],"layout":{"text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"],"\n",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Bold"],"text-max-width":6.25,"text-size":["interpolate",["linear"],["zoom"],2,9,5,17]},"paint":{"text-color":"#000","text-halo-blur":1,"text-halo-color":"#fff","text-halo-width":1}},{"id":"label_country_1","type":"symbol","source":"openmaptiles","source-layer":"place","maxzoom":9,"filter":["all",["==",["get","class"],"country"],["==",["get","rank"],1]],"layout":{"text-field":["case",["has","name:nonlatin"],["concat",["get","name:latin"],"\n",["get","name:nonlatin"]],["coalesce",["get","name_en"],["get","name"]]],"text-font":["Noto Sans Bold"],"text-max-width":6.25,"text-size":["interpolate",["linear"],["zoom"],1,9,4,17]},"paint":{"text-color":"#000","text-halo-blur":1,"text-halo-color":"#fff","text-halo-width":1}}]};

function createDarkMapStyle(base){
  try {
    const d = JSON.parse(JSON.stringify(base));
    d.layers.forEach(l => {
      if(l.id === 'background') l.paint = Object.assign({}, l.paint, {'background-color':'#0d191c'});
      else if(l.id.includes('park') || l.id.includes('wood') || l.id.includes('grass')){
        if(l.paint && l.paint['fill-color']) l.paint['fill-color'] = '#0e2621';
        if(l.paint && l.paint['line-color']) l.paint['line-color'] = '#163830';
      } else if(l.id.includes('water')){
        if(l.paint && l.paint['fill-color']) l.paint['fill-color'] = '#122e3b';
        if(l.paint && l.paint['line-color']) l.paint['line-color'] = '#194154';
      } else if(l.id.includes('building')){
        if(l.paint && l.paint['fill-color']) l.paint['fill-color'] = '#14252a';
      } else if(l.id.includes('casing')){
        if(l.paint && l.paint['line-color']) l.paint['line-color'] = '#213a42';
      } else if(l.type === 'line' && (l.id.includes('road') || l.id.includes('tunnel') || l.id.includes('bridge'))){
        if(l.paint && l.paint['line-color']) l.paint['line-color'] = '#182d33';
      } else if(l.type === 'symbol'){
        if(l.paint && l.paint['text-color']) l.paint['text-color'] = '#8ca3a6';
        if(l.paint && l.paint['text-halo-color']) l.paint['text-halo-color'] = '#0d191c';
      }
    });
    return d;
  } catch(e) { return base; }
}
const palateoDarkStyle = createDarkMapStyle(palateoStreetStyle);
let currentMapTheme = 'explore';

let streetMap=null,streetMapCity=null,streetPlaces=[],streetMarkers=[],mapLibraryPromise=null;
const mapMotion=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches;
function disposeStreetMap(){if(streetMap){streetMap.remove();streetMap=null}streetMarkers=[];streetMapCity=null}
function loadMapLibrary(){
 if(window.maplibregl)return Promise.resolve();
 if(!mapLibraryPromise)mapLibraryPromise=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='maplibre-gl.js';script.onload=resolve;script.onerror=()=>{mapLibraryPromise=null;script.remove();reject(new Error('Map renderer could not load'))};document.head.append(script)});
 return mapLibraryPromise;
}
renderZestMapSvg=function(places){streetPlaces=places.slice(0,homeLimit);return '<div id="streetMap" class="streetMap" aria-label="Street map of restaurant recommendations"></div><p class="streetMapStatus" role="status">Loading street map…</p>'};
renderZestSheet=function(r){
 const id=esc(r.id);
 const openStatus=getVenueOpenStatus(r);
 const statusClass=openStatus.isOpen?'isOpen':'isClosed';
 const isSaved=state.saves&&state.saves.includes(r.id);
 const reviewCount=formatReviewCount(r.review_count||450);
 const ratingVal=Number(r.rating||4.5).toFixed(1);
 const matchScore=r.score||85;
 const categories=(r.c&&r.c.length?r.c:['Cafe','Coffee']).slice(0,2).join(', ');
 
 let catBadge='☕ Artisanal Cafe';
 const cPool=[...(r.c||[]),...(r.t||[])].map(x=>String(x).toLowerCase());
 if(cPool.some(x=>x.includes('dessert')||x.includes('bakery')||x.includes('waffle')||x.includes('crepe')||x.includes('ice cream'))){
   catBadge='🥐 Bakery & Desserts';
 } else if(cPool.some(x=>x.includes('gujarati')||x.includes('rajasthani')||x.includes('regional')||x.includes('thali')||x.includes('punjabi'))){
   catBadge='🍽️ Regional Cuisine';
 } else if(cPool.some(x=>x.includes('italian')||x.includes('pizza')||x.includes('pasta'))){
   catBadge='🍕 Artisanal Italian';
 } else if(r.p==='2000_plus'||r.p==='1000_2000'){
   catBadge='✨ Fine Dining';
 }
 
 let priceText=r.displayPrice||'';
 if(!priceText.includes('for two')){
   if(r.p==='under_500') priceText='₹400 for two';
   else if(r.p==='500_1000') priceText='₹1,200 for two';
   else if(r.p==='1000_2000') priceText='₹1,600 for two';
   else if(r.p==='2000_plus') priceText='₹2,500 for two';
   else priceText='₹800 for two';
 }
 
 let mustOrderText = r.mustOrder || r.mustTry;
 if(!mustOrderText && r.review_insights && r.review_insights.length){
   mustOrderText = titleCase(r.review_insights[0]);
 }
 if(!mustOrderText && r.highlights && r.highlights.length){
   mustOrderText = titleCase(r.highlights[0]);
 }
 if(!mustOrderText) mustOrderText = 'Inspiring Cafe Concept';

 return `<div class="zestMapSheet" id="zestMapSheet" role="region" data-place-id="${id}" aria-label="Selected Palate Map place details">
  <div class="zestSheetTopBar">
   <button type="button" class="zestCityDropdownBtn" data-action="toggle-city-picker" aria-label="Change city">
    <span>📍</span> <span>${esc(cityName())}</span> <span style="font-size:10px;opacity:.8">▾</span>
   </button>
   <div style="display:flex;align-items:center;gap:8px">
    <span class="zestSheetCountBadge">${streetPlaces.length} spots</span>
    <button type="button" class="zestSheetSearchBtn" data-action="navigate" data-page="discover" aria-label="Search places">
     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
    </button>
   </div>
  </div>
  <div class="zestCardImageContainer" data-action="open-place" data-rest-id="${id}">
   ${photo(r)}
   <span class="zestCardStatusPill ${statusClass}">
    ${openStatus.isOpen ? '🟢 Open Now · Closes ' + openStatus.closeTimeStr : '🔴 Closed · Opens ' + openStatus.openTimeStr}
   </span>
   <div class="zestCardTopActions">
    <button type="button" class="zestCardCircleBtn navBtn" data-rest-action="maps" data-rest-id="${id}" aria-label="Directions to ${esc(r.name)}" title="Directions">
     <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="m3 11 19-9-9 19-2-8-8-2z"/></svg>
    </button>
    <button type="button" class="zestCardCircleBtn saveBtn" data-rest-action="save" data-rest-id="${id}" aria-pressed="${isSaved}" aria-label="${isSaved?'Remove':'Save'} ${esc(r.name)}" title="${isSaved?'Remove from saved':'Save'}">
     <svg width="14" height="14" viewBox="0 0 24 24" fill="${isSaved?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M6 3h12v18l-6-4-6 4Z"/></svg>
    </button>
   </div>
   <span class="zestCardBottomBadgeLeft">${esc(catBadge)}</span>
   <span class="zestCardBottomBadgeRight">${esc(priceText)}</span>
  </div>
  <div class="zestCardBody" data-action="open-place" data-rest-id="${id}">
   <div class="zestCardRow1">
    <h3 class="zestCardTitle">${esc(r.name)}</h3>
    <span class="zestCardRating">★ ${ratingVal} <small>(${esc(reviewCount)})</small></span>
   </div>
   <div class="zestCardRow2">
    <span class="zestCardSubtitle">${esc(r.area||r.city)} • ${esc(categories)}</span>
    <span class="zestCardMatchPill">⚡ ${matchScore}% Match</span>
   </div>
   <div class="zestCardMustOrder">
    <span>✨</span> <strong>Must Order:</strong> <span>${esc(mustOrderText)}</span>
   </div>
  </div>
 </div>`;
};
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
}
function fitStreetPlaces(duration=0){
 if(!streetMap)return;
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
  streetMap=new maplibregl.Map({container:host,style:currentMapTheme==='dark'?palateoDarkStyle:palateoStreetStyle,center:[c[1],c[0]],zoom:12.5,pitch:0,attributionControl:false,maxPitch:0,dragRotate:false,touchPitch:false,antialias:true,scrollZoom:false,cooperativeGestures:true,renderWorldCopies:false});
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
  if(!container.querySelector('.mapThemeToggle')){
    container.insertAdjacentHTML('beforeend',`
      <div class="mapWeatherWidget" aria-label="Current weather">
        <span class="weatherSun">☀️</span>
        <span class="weatherTemp">31°</span>
        <span class="weatherAqi">AQI 42</span>
      </div>
      <div class="mapThemeToggle" role="group" aria-label="Map theme">
        <button type="button" class="mapThemeBtn ${currentMapTheme==='explore'?'active':''}" data-action="set-map-theme" data-theme="explore">☀️ Explore</button>
        <button type="button" class="mapThemeBtn ${currentMapTheme==='dark'?'active':''}" data-action="set-map-theme" data-theme="dark">🌙 Dark</button>
      </div>
    `);
  }

 const legend=container.querySelector('.zestMapLegend');if(legend)legend.innerHTML='<span><i style="background:#d8613d"></i>Food</span><span><i style="background:#2875bb"></i>Cafés</span><span><i style="background:#9753a8"></i>Desserts</span><span><i style="background:#28845a"></i>Regional</span>';
 const notice=container.querySelector('.mapNotice');if(notice)notice.textContent=streetPlaces.filter(hasCoordinates).length+' recommendations mapped · Select a pin to explore. Directions opens your navigation app.';
 container.querySelector('[data-action="toggle-3d"]')?.remove();
 mountStreetMap(host);
 const rail=document.querySelector('.homeMapView .restaurantGrid');
 if(rail){
  const controls=document.createElement('div');controls.className='railControls';controls.innerHTML='<button type="button" data-rail-step="-1" aria-label="Previous places" disabled>←</button><button type="button" data-rail-step="1" aria-label="Next places">→</button>';
  document.querySelector('.homeRecommendations>.section').append(controls);
  const boundaries=()=>{controls.querySelector('[data-rail-step="-1"]').disabled=rail.scrollLeft<=1;controls.querySelector('[data-rail-step="1"]').disabled=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-2};
  rail.addEventListener('scroll',boundaries,{passive:true});requestAnimationFrame(boundaries);
 }
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
 const step=event.target.closest('[data-rail-step]');
 if(step){const rail=document.querySelector('.homeMapView .restaurantGrid');if(rail)rail.scrollBy({left:Number(step.dataset.railStep)*(rail.firstElementChild.getBoundingClientRect().width+20),behavior:mapMotion()?'smooth':'instant'});return}
 const control=event.target.closest('[data-action],[data-street-retry]');if(!control)return;
 if(control.hasAttribute('data-street-retry')){event.preventDefault();disposeStreetMap();home();return}
 if(!streetMap||!document.querySelector('.streetMapFrame'))return;
 const action=control.dataset.action;
  if(action==='set-map-theme'){
    const theme = control.dataset.theme;
    if(theme && theme !== currentMapTheme){
      currentMapTheme = theme;
      const c = document.getElementById('zestMapContainer');
      if(c) c.toggleAttribute('data-map-dark', currentMapTheme === 'dark');
      document.querySelectorAll('.mapThemeBtn').forEach(b => b.classList.toggle('active', b.dataset.theme === currentMapTheme));
      if(streetMap){
        streetMap.setStyle(currentMapTheme === 'dark' ? palateoDarkStyle : palateoStreetStyle);
        streetMap.once('styledata', () => { updateStreetMarkers(); });
      }
    }
    return;
  }
  if(action==='toggle-city-picker'){
    const current = cityName();
    const cities = ['Ahmedabad', 'Vadodara', 'Mumbai', 'Pune', 'Delhi NCR'];
    let picker = document.getElementById('mapCityPickerModal');
    if(picker){ picker.remove(); return; }
    picker = document.createElement('div');
    picker.id = 'mapCityPickerModal';
    picker.className = 'mapCityPickerModal';
    picker.innerHTML = `<div class="mapCityPickerCard">
      <div class="mapCityPickerHead"><h3>Select City</h3><button type="button" data-action="close-map-city-picker">×</button></div>
      <div class="mapCityList">
        ${cities.map(c => `<button type="button" class="mapCityBtn ${c===current?'active':''}" data-action="pick-map-city" data-city="${esc(c)}">📍 ${esc(c)}</button>`).join('')}
      </div>
    </div>`;
    document.getElementById('zestMapContainer')?.append(picker);
    return;
  }
  if(action==='close-map-city-picker'){
    document.getElementById('mapCityPickerModal')?.remove();
    return;
  }
  if(action==='pick-map-city'){
    const city = control.dataset.city;
    document.getElementById('mapCityPickerModal')?.remove();
    if(city && cityCenters[city]){
      setCity(city);
    }
    return;
  }

  if(!['select-pin','close-pin','toggle-3d','zoom-in','zoom-out','zoom-reset'].includes(action))return;
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

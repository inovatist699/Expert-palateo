let detailReturnScroll=0,detailReturnRail=0;
function openPlaceDetails(id,trigger){
 const r=activeRestaurant(id);if(!r||!isQualifiedVenue(r))return;
 if(page!=='place')window.history?.pushState({palateoPlace:id,origin:page},'');
 detailOrigin=page==='place'?detailOrigin:page;detailRestaurantId=id;
 detailReturnScroll=window.scrollY||0;detailReturnRail=document.querySelector('.homeMapView .restaurantGrid')?.scrollLeft||0;
 detailTrigger=trigger?.classList.contains('photo')?'photo':trigger?.dataset?.action==='open-place'?'title':'sheet';
 go('place');document.getElementById('placeBack')?.focus({preventScroll:true});
}
function closePlaceDetails(fromHistory=false){
 if(!fromHistory&&window.history?.state?.palateoPlace){window.history.back();return}
 const id=detailRestaurantId;detailRestaurantId=null;go(detailOrigin);
 const rail=document.querySelector('.homeMapView .restaurantGrid');if(rail)rail.scrollLeft=detailReturnRail;
 window.scrollTo(0,detailReturnScroll);
 const trigger=document.querySelector('[id="card-'+id+'"] '+(detailTrigger==='photo'?'.photo':'.restnameButton'));
 trigger?.focus({preventScroll:true});
}
window.addEventListener?.('popstate',event=>{if(event.state?.palateoPlace){detailOrigin=event.state.origin||'home';detailRestaurantId=event.state.palateoPlace;go('place');document.getElementById('placeBack')?.focus({preventScroll:true})}else if(page==='place'){detailOrigin=event.state?.palateoPage||detailOrigin;closePlaceDetails(true)}else if(event.state?.palateoPage)go(event.state.palateoPage)});

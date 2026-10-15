let state=load(), page='home', supabaseClient=null, discoverCuisine='all', discoverQuery='', homeCuisine='all', homeLimit=12, searchEventTimer=null, authRequired=true, homeView='map', selectedPinId=null, mapZoom=1, map3d=false;
let selectedCity=state.selectedCity&&cityCenters[state.selectedCity]?state.selectedCity:'Ahmedabad',userLocation=null,pureVegOnly=false,discoverSort='match';

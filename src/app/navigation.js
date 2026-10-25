function go(p,{keepScroll=false}={}){
if(!currentUser){requireAuthGate();return}
if(!hasLegalConsent(currentUser)){requireLegalConsent();return}
if(!['home','discover','social','saved','profile','place','ask'].includes(p))p='home';
 if(!hasTasteProfile()){const missing=questions.findIndex(q=>!q.o.some(([value])=>value===state.answers?.[q.k]));onboard(missing<0?questions.length-1:missing);return}
document.getElementById('nav').classList.remove('hide');
const previousSort=keepScroll?document.getElementById('discoverSort')?.value:null;
const focusedAction=keepScroll?document.activeElement?.getAttribute('data-rest-action'):null;
const focusedRestaurant=keepScroll?document.activeElement?.getAttribute('data-rest-id'):null;
const previousRail=keepScroll?document.querySelector?.('.homeMapView .restaurantGrid'):null;
const previousSheet=keepScroll?document.querySelector?.('.homeRecommendations'):null;
const previousScroll=keepScroll?window.scrollY:0,sheetScroll=previousSheet?.scrollTop||0;
const anchor=previousRail&&(Array.from(previousRail.children).find(card=>card.dataset.placeId===focusedRestaurant)||Array.from(previousRail.children).find(card=>card.getBoundingClientRect().right>previousRail.getBoundingClientRect().left+13));
const railPosition=previousRail?{id:anchor?.dataset.placeId,offset:anchor?anchor.getBoundingClientRect().left-previousRail.getBoundingClientRect().left:0,left:previousRail.scrollLeft,top:previousRail.scrollTop,horizontal:previousRail.scrollWidth>previousRail.clientWidth+1,sheetOffset:anchor&&previousSheet?anchor.getBoundingClientRect().top-previousSheet.getBoundingClientRect().top:0}:null;
if(!keepScroll)window.scrollTo(0,0);
if(p!=='place')window.history?.replaceState({palateoPage:p},'');
page=p;
document.querySelectorAll('.nav button').forEach(x=>{x.classList.remove('active');x.removeAttribute('aria-current')});
const activeNav=document.getElementById('n-'+(p==='place'?detailOrigin:p));
activeNav?.classList.add('active');activeNav?.setAttribute('aria-current','page');
if(p==='ask'&&typeof ask==='function')ask();else ({home,discover,social,saved,profile,place}[p]||home)();
if(p==='profile')refreshTruecallerButtons();
if(keepScroll){
 if(p==='discover'&&previousSort){document.getElementById('discoverSort').value=previousSort;drawDiscover()}
 if(railPosition){
  const rail=document.querySelector('.homeMapView .restaurantGrid'),card=rail&&Array.from(rail.children).find(card=>card.dataset.placeId===railPosition.id);
  if(rail){rail.scrollLeft=card?rail.scrollLeft+card.getBoundingClientRect().left-rail.getBoundingClientRect().left-railPosition.offset:railPosition.left;rail.scrollTop=railPosition.top}
 }
 const sheet=document.querySelector?.('.homeRecommendations');if(sheet)sheet.scrollTop=sheetScroll;
 if(railPosition&&!railPosition.horizontal&&sheet){const card=Array.from(document.querySelector('.homeMapView .restaurantGrid')?.children||[]).find(card=>card.dataset.placeId===railPosition.id);if(card)sheet.scrollTop+=card.getBoundingClientRect().top-sheet.getBoundingClientRect().top-railPosition.sheetOffset}
 if((window.scrollY||0)!==(previousScroll||0))window.scrollTo(0,previousScroll||0);
 if(focusedAction&&focusedRestaurant){Array.from(document.querySelectorAll('[data-rest-action]')).find(button=>button.getAttribute('data-rest-action')===focusedAction&&button.getAttribute('data-rest-id')===focusedRestaurant)?.focus({preventScroll:true})}
}
if(currentUser&&backendReady)logEvent('screen_view',{screen:p});
}
function setHomeCuisine(cuisine){
homeCuisine=cuisine;
homeLimit=12;
home();
}
function loadMoreHome(){
homeLimit+=12;
home();
}

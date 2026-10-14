let placePreviewOrigin='select-pin';
function focusPlacePreview(){
 const rail=document.querySelector('.homeMapView .restaurantGrid'),card=document.getElementById('card-'+selectedPinId);
 if(rail&&card){
  const railBox=rail.getBoundingClientRect(),cardBox=card.getBoundingClientRect();
  rail.scrollLeft+=cardBox.left-railBox.left;
 }
 document.querySelector('#zestMapSheet .zestSheetClose')?.focus({preventScroll:true});
}
function closePlacePreview(){
 const id=selectedPinId;selectedPinId=null;home();
 [...document.querySelectorAll('[data-action="'+placePreviewOrigin+'"]')].find(el=>el.dataset.restId===id)?.focus({preventScroll:true});
}
document.addEventListener('click',event=>{
 const target=event.target instanceof Element?event.target:null,control=target?.closest('[data-action]');
 if(!target)return;
 if(control?.dataset.action==='auth-backdrop'){
  if(control===target&&control.dataset.required!=='true')closeAuth();
  return;
 }
 if(!control)return;
 const d=control.dataset,step=Number(d.step);
 switch(d.action){
  case 'mode': currentUser?signOutV5():showAuth(); break;
  case 'city': setCity(d.city); break;
  case 'location': useMyLocation(); break;
  case 'navigate': if(['home','discover','ask','social','saved','profile'].includes(d.page))go(d.page); break;
  case 'open-dishes-modal': if(d.restId)openDishesModal(d.restId); break;
  case 'close-dishes-modal': closeDishesModal(); break;
  case 'apply-prompt': if(d.prompt)applyPrompt(d.prompt); break;
  case 'run-prompt': runPrompt(); break;
  case 'clear-prompt': clearPrompt(); break;
  case 'toggle-tuner': toggleStudioTuner(); break;
  case 'set-min-match': setMinMatch(Number(d.val)); break;
  case 'set-adventure': if(d.mode)setAdventureMode(d.mode); break;
  case 'set-dish-category': if(d.category)setDishCategory(d.category); break;
  case 'set-studio-spice': if(d.spice){state.answers=state.answers||{};state.answers.spice=d.spice;savePreferences();rebuildLearning();profile();} break;
  case 'set-studio-diet': if(d.diet){state.answers=state.answers||{};state.answers.diet=d.diet;savePreferences();rebuildLearning();profile();} break;
  case 'set-studio-cuisine': if(d.cuisine){state.answers=state.answers||{};state.answers.cuisine=d.cuisine;savePreferences();rebuildLearning();profile();} break;
  case 'set-studio-vibe': if(d.vibe){state.answers=state.answers||{};state.answers.mood=d.vibe;savePreferences();rebuildLearning();profile();} break;
  case 'toggle-palo': if(typeof togglePaloCompanion==='function')togglePaloCompanion(control); break;
  case 'ask-prompt': if(d.prompt&&typeof submitAskPrompt==='function')submitAskPrompt(d.prompt); break;
  case 'pick': if(Number.isInteger(step)&&questions.some(q=>q.k===d.key))pick(d.key,d.value,step); break;
  case 'onboard-step': if(Number.isInteger(step))onboard(step); break;
  case 'next-step': if(Number.isInteger(step))nextQ(step); break;
  case 'cuisine': setDiscoverCuisine(d.cuisine); break;
  case 'home-cuisine': if(d.cuisine)setHomeCuisine(d.cuisine); break;
  case 'load-more-home': loadMoreHome(); break;
  case 'home-view': if(d.view){homeView=d.view;home();document.querySelector('[data-action="home-view"][data-view="'+d.view+'"]')?.focus({preventScroll:true})} break;
  case 'select-pin': if(d.restId){placePreviewOrigin='select-pin';if(selectedPinId===d.restId)closePlacePreview();else{selectedPinId=d.restId;home();focusPlacePreview()}} break;
  case 'close-pin': closePlacePreview(); break;
  case 'zoom-in': zoomMap(0.2); break;
  case 'zoom-out': zoomMap(-0.2); break;
  case 'zoom-reset': resetMapZoom(); break;
  case 'toggle-3d': map3d=!map3d; home();document.querySelector('[data-action="toggle-3d"]')?.focus({preventScroll:true}); break;
  case 'view-pin': if(d.restId){placePreviewOrigin='view-pin';selectedPinId=d.restId;homeView='map';go('home');document.getElementById('zestMapContainer')?.scrollIntoView({behavior:'smooth',block:'start'});focusPlacePreview()} break;
  case 'open-place': if(d.restId)openPlaceDetails(d.restId,control); break;
  case 'close-place': closePlaceDetails(); break;
  case 'dish-rate': rateDish(d.dishId,d.dishValue,d.source); break;
  case 'dish-undo': if(state.dishFeedback?.[d.dishId])rateDish(d.dishId,state.dishFeedback[d.dishId],'edit'); break;
  case 'dish-next': dishCalibrationIndex++;go('profile',{keepScroll:true});document.getElementById('calibrationDishName')?.focus({preventScroll:true}); break;
  case 'dish-retry': retryDishSync(); break;
  case 'scroll-to-card': if(d.restId){const el=document.getElementById('card-'+d.restId);if(el){el.scrollIntoView({behavior:'smooth',block:'center'});el.classList.add('flashCard');setTimeout(()=>el.classList.remove('flashCard'),1800)}} break;
  case 'follow': if(d.personId)follow(d.personId); break;
  case 'revoke-ai': if(currentUser){localStorage.removeItem('palateo-palo-ai-consent:'+currentUser.id);toast('Live AI permission withdrawn. Local recommendations remain available.')} break;
  case 'delete-account': showAccountDeletion(); break;
  case 'cancel-deletion': if(!accountDeletionBusy){document.getElementById('accountDeletionDialog')?.remove();document.querySelector('[data-action="delete-account"]')?.focus()} break;
  case 'reset-taste': resetTaste(); break;
  case 'close-auth': closeAuth(); break;
  case 'legal-decline': signOutV5(); break;
  case 'auth-mode': if(d.authMode==='login'||d.authMode==='signup')showAuth(d.authMode); break;
  case 'auth-email': if(['recovery','signup'].includes(d.emailType))sendAuthEmail(d.emailType); break;
 }
});
document.addEventListener('input',event=>{
 const target=event.target;
 if(!(target instanceof Element))return;
 if(target.dataset.action==='filter')filter(target.value);
 if(target.dataset.action==='prompt-input')promptQuery=target.value;
 if(target.dataset.action==='spice-slider')pick('spice',['mild','medium','hot'][Number(target.value)],Number(target.dataset.step));
});
document.addEventListener('change',event=>{
 const target=event.target;
 if(!(target instanceof Element))return;
 if(target.dataset.action==='sort')drawDiscover();
 if(target.dataset.action==='city-select')setCity(target.value);
});
document.addEventListener('submit',event=>{
 const form=event.target;
 if(form.dataset.action==='ask-query-form'){event.preventDefault();const inp=form.querySelector('input');const val=inp?.value?.trim();if(val&&typeof submitAskPrompt==='function'){inp.value='';submitAskPrompt(val);}return;}
 if(form.dataset.action==='confirm-account-deletion'){event.preventDefault();deletePalateoAccount();return;}
 if(form.dataset.action==='password-reset'){event.preventDefault();resetAccountPassword();return;}
 if(form.dataset.action==='legal-submit'){event.preventDefault();acceptLegalConsent();return;}
 if(form.dataset.authMode==='login'||form.dataset.authMode==='signup'){event.preventDefault();submitAuth(form.dataset.authMode);return;}
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(document.getElementById('dishesModal')){event.preventDefault();closeDishesModal();return;}if(document.getElementById('authModal'))closeAuth();else if(page==='place'){event.preventDefault();closePlaceDetails()}else if(document.getElementById('zestMapSheet')){event.preventDefault();closePlacePreview()}}});
document.addEventListener('click',event=>{const target=event.target instanceof Element?event.target:null,card=target?.closest('.restaurant-card');if(card&&!target.closest('button,a,details,summary,input'))openPlaceDetails(card.dataset.placeId,card.querySelector('[data-action="open-place"]'))});
document.addEventListener('click',event=>{
const target=event.target instanceof Element?event.target:null,button=target?.closest('[data-rest-action]');
if(!button)return;
const id=button.getAttribute('data-rest-id'),action=button.getAttribute('data-rest-action');
let task;
if(action==='like')task=rate(id,'like');
if(action==='dislike')task=rate(id,'dislike');
if(action==='visited')task=rate(id,'visited');
if(action==='save')task=saveRest(id);
if(action==='maps')task=maps(id);
Promise.resolve(task).catch(error=>{console.warn('Restaurant action',error);toast('This action did not sync to your account. Please try again when online.')});
});

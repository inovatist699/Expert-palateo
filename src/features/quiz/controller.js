function dietLabel(value){return ({veg:'Vegetarian',eggetarian:'Eggetarian',nonveg:'Non-vegetarian',any:'All foods'})[value]||'Not set'}
function hasTasteAnswers(answers=state.answers){return questions.every(q=>q.o.some(([value])=>value===answers?.[q.k]))}
function hasTasteProfile(){return !!currentUser&&state.userId===currentUser.id&&state.onboarded===true&&!state.retakeInProgress&&hasTasteAnswers()}
function init(){updateCityPicker();if(!state.answers)state.answers={};if(!state.feedback)state.feedback={};if(!state.saves)state.saves=[];if(!state.follows)state.follows=[];if(!state.onboarded){onboard(0)}else{document.getElementById('nav').classList.remove('hide');go('home')}}
function calculateArchetype(a=state.answers||{}){
  if(a.spice==='hot')return {title:'Spice Frontier Trailblazer',emoji:'🌶️',desc:'Craves bold heat, regional curries, and unapologetic spice intensity.'};
  if(a.cuisine==='Cafe'||a.mood==='quiet')return {title:'Third-Wave Café Connoisseur',emoji:'☕',desc:'Tranquil corners, single-origin pour-overs, and artisan sourdough bakes.'};
  if(a.priority==='unique')return {title:'Heritage Gastronomy Pioneer',emoji:'🏛️',desc:'Cherishes century-old institutions, cultural recipes, and evocative spaces.'};
  if(a.budget==='2000_plus')return {title:'Haute Cuisine Epicurean',emoji:'🍸',desc:'Dines for progressive tasting menus, signature mixology, and polished luxury.'};
  if(a.diet==='veg')return {title:'Plant & Pure-Ghee Purist',emoji:'🌿',desc:'Celebrates rich traditional vegetarian feasts, crisp dosas, and slow-churned butter.'};
  return {title:'Modern Metropolitan Gourmand',emoji:'✨',desc:'Explores neighborhood bistros, wood-fired pizzas, and vibrant social tables.'};
}
function onboard(i){
 if(!currentUser){requireAuthGate();return}
 if(!hasLegalConsent(currentUser)){requireLegalConsent();return}
 i=Number.isInteger(i)?Math.max(0,Math.min(i,questions.length-1)):0;
 state.onboardingStep=i;persist();
 document.getElementById('nav').classList.add('hide');
const q=questions[i],v=state.answers[q.k],selected=q.k==='cuisine'?preferredCuisines():q.k==='mood'?preferredVibes():[v];
window.scrollTo(0,0);
document.getElementById('root').innerHTML=`<section class="screen onboarding-screen" aria-label="Taste profile setup"><div class="tasteStep"><span>Your taste quiz · ${i+1} of ${questions.length}</span><span class="tasteCityIndicator">${esc(cityName())}</span></div><div class="progress" role="progressbar" aria-label="Taste profile progress" aria-valuemin="1" aria-valuemax="${questions.length}" aria-valuenow="${i+1}"><i style="width:${((i+1)/questions.length)*100}%"></i></div><h1 class="question" id="tasteQuestion" tabindex="-1">${q.k==='distance'?'How far would you go?':q.q}</h1><p class="tasteHint">${q.k==='distance'?'Distance filters apply when you allow location access.':q.k==='cuisine'||q.k==='mood'?'Choose all that feel like you. You can edit these later.':'Choose what feels right. You can edit this in your taste studio.'}</p>${q.k==='spice'?`<label class="spiceMeterLabel" for="quizSpice">Spice tolerance</label><input type="range" class="spiceMeter" id="quizSpice" min="0" max="2" step="1" value="${Math.max(0,['mild','medium','hot'].indexOf(v))}" aria-valuetext="${esc(v||'Not chosen')}" data-action="spice-slider" data-step="${i}"><div class="spiceMeterEnds"><span>Mild & gentle</span><span>Fiery spice</span></div>`:''}<div class="choices studioChoices" role="group" aria-labelledby="tasteQuestion">${q.o.map(a=>`<button type="button" class="choice ${selected.includes(a[0])?'active':''}" aria-pressed="${selected.includes(a[0])}" data-action="pick" data-key="${esc(q.k)}" data-value="${esc(a[0])}" data-step="${i}"><span>${q.k==='distance'&&a[0]==='any'?'Anywhere in '+cityName():a[1]}</span><small aria-hidden="true">${selected.includes(a[0])?'✓':''}</small></button>`).join('')}</div><div class="tasteActions">${i?'<button type="button" class="btn secondary" data-action="onboard-step" data-step="'+(i-1)+'">← Back</button>':''}<button type="button" class="btn primary" id="tasteContinue" ${v?'':'disabled'} data-action="next-step" data-step="${i}">${i===questions.length-1?'Save & see matches':'Continue →'}</button></div><p class="quizTrust">Your answers shape your recommendations. You can edit them anytime.</p></section>`;
document.getElementById('tasteQuestion').focus({preventScroll:true});
}
function pick(k,v,i){
 if(!questions[i]||questions[i].k!==k||!questions[i].o.some(([value])=>value===v))return;
 let selected=[v];
 if(k==='cuisine'||k==='mood'){
  const key=k==='cuisine'?'cuisines':'vibes',old=k==='cuisine'?preferredCuisines():preferredVibes();
  selected=old.includes(v)?old.filter(x=>x!==v):[...old,v];
  state.answers={...state.answers,[key]:selected,[k]:selected[0]};
 }else state.answers={...state.answers,[k]:v};
 persist();
 document.querySelectorAll('.onboarding-screen .choice').forEach(button=>{const active=selected.includes(button.dataset.value);button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));button.querySelector('small').textContent=active?'✓':''});
 const slider=document.getElementById('quizSpice');if(slider){slider.value=String(Math.max(0,['mild','medium','hot'].indexOf(v)));slider.setAttribute('aria-valuetext',v==='depends'?'Depends on the dish':v);}
 document.getElementById('tasteContinue').disabled=!state.answers[k];
}
function nextQ(i){i<questions.length-1?onboard(i+1):finishV5()}
function resetTaste(){state.onboarded=false;state.retakeInProgress=true;state.answers={};state.onboardingStep=0;persist();onboard(0)}


/* Palateo's small, browser-native food companion. No microphone starts automatically. */
(() => {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const pet='<span class="palo" aria-hidden="true"><span class="paloLeaf"></span><span class="paloFace"><i></i><i></i><b></b></span><span class="paloFoot left"></span><span class="paloFoot right"></span></span>';
 let recognition=null,listening=false,voice=true,utterance=null,lastReply='',listenTimer,personal=false;
 try{voice=localStorage.getItem('palateo-palo-voice')!=='off'}catch{}
 const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 document.body.insertAdjacentHTML('beforeend',`<button type="button" id="petLauncher" class="petLauncher" aria-label="Talk to Palo, your food companion" aria-haspopup="dialog">${pet}<span>Ask Palo</span></button><dialog id="petDialog" class="petDialog" aria-labelledby="petTitle"><header>${pet}<div><span class="petEyebrow">YOUR FOOD COMPANION</span><h2 id="petTitle">What's the craving?</h2></div><button type="button" data-pet-close aria-label="Close food companion">×</button></header><p class="petGreeting">I'm Palo. Tell me a dish, and I'll find places to explore in your selected city.</p><div class="petSuggestions" aria-label="Try a dish"><button type="button" data-dish="pizza">Pizza</button><button type="button" data-dish="masala dosa">Dosa</button><button type="button" data-dish="coffee">Coffee</button><button type="button" data-dish="biryani">Biryani</button></div><form id="petForm"><label for="dishRequest">What would you like to eat?</label><div class="petInputRow"><input id="dishRequest" maxlength="160" placeholder="I'm craving spicy noodles…" autocomplete="off" required><button type="submit" aria-label="Find restaurants for this dish">→</button></div></form><div class="petVoiceControls"><button type="button" id="petMic" aria-pressed="false">${Recognition?'Speak your craving':'Voice input unavailable'}</button><button type="button" id="petVoice" aria-pressed="false">Read replies: off</button></div><p class="petPrivacy">Voice is optional. Your browser may send audio to its speech service. Typed requests stay in this app.</p><p id="petStatus" role="status" aria-live="polite" aria-atomic="true">Try a dish or cuisine to get started.</p><div id="petResults"></div></dialog>`);
 const dialog=document.getElementById('petDialog'),launcher=document.getElementById('petLauncher'),status=document.getElementById('petStatus'),results=document.getElementById('petResults'),input=document.getElementById('dishRequest'),mic=document.getElementById('petMic'),voiceButton=document.getElementById('petVoice');
 mic.disabled=!Recognition;voiceButton.disabled=!('speechSynthesis' in window);
 voiceButton.textContent='Read replies: '+(voice?'on':'off');voiceButton.setAttribute('aria-pressed',String(voice));
 dialog.querySelector('.petGreeting').textContent="I'm Palo. I learn from the dishes and places you love or pass. Your taste quiz is my starting point.";
 dialog.querySelector('.petSuggestions').insertAdjacentHTML('beforebegin','<div class="paloModes"><button type="button" id="paloForYou">Pick for my taste</button><button type="button" id="paloTeach">Teach Palo</button></div><section id="paloMemory" aria-label="Your food taste" hidden></section>');
 const memory=document.getElementById('paloMemory');
 const ready=()=>currentUser&&!authRequired&&hasTasteProfile();
 function renderMemory(){
  if(!ready()){memory.innerHTML='<p>Sign in and finish your taste quiz to build your food memory.</p>';return}
  const dishes=availableCalibrationDishes(),learned=dishes.filter(d=>state.dishFeedback?.[d.id]);
  memory.innerHTML='<h3>What I know about your taste</h3><p>'+esc(preferredCuisines().map(c=>cuisineLabels[c]||c).join(', '))+' · '+esc(state.answers.spice)+' spice · '+esc(dietLabel(state.answers.diet))+'</p><p>'+learned.length+' dish preferences · '+Object.keys(state.feedback||{}).length+' place reactions. Change any choice to teach me again.</p><label for="paloDish">Teach me a dish</label><select id="paloDish">'+dishes.map(d=>'<option value="'+d.id+'">'+esc(d.name)+'</option>').join('')+'</select><div id="paloDishActions"></div><p id="paloLearningStatus" role="status"></p>';
  const select=memory.querySelector('select');select.onchange=renderDishActions;renderDishActions();
 }
 function renderDishActions(){const id=memory.querySelector('select')?.value,d=calibrationDishes.find(d=>d.id===id);if(!d)return;memory.querySelectorAll('p')[1].textContent=availableCalibrationDishes().filter(d=>state.dishFeedback?.[d.id]).length+' dish preferences · '+Object.keys(state.feedback||{}).length+' place reactions. Change any choice to teach me again.';memory.querySelector('#paloDishActions').innerHTML=['love','pass'].map(v=>'<button type="button" data-palo-learn="'+v+'" data-dish-id="'+id+'" aria-pressed="'+(state.dishFeedback?.[id]===v)+'">'+(state.dishFeedback?.[id]===v?'Undo ':'')+(v==='love'?'Love it':'Not for me')+'</button>').join('')}
 document.getElementById('paloTeach').onclick=()=>{memory.hidden=!memory.hidden;if(!memory.hidden){renderMemory();speak('Teach me a dish you love, or one you would pass. I’ll remember it for your next recommendations.')}};
 document.getElementById('paloForYou').onclick=()=>{personal=true;input.value='';ask()};
 memory.addEventListener('click',async e=>{
  const button=e.target.closest('[data-palo-learn]');if(!button||!ready())return;
  const id=button.dataset.dishId,value=button.dataset.paloLearn,owner=currentUser.id,removed=state.dishFeedback?.[id]===value,d=calibrationDishes.find(d=>d.id===id);
  const saved=rateDish(id,value,'palo'),revision=dishRevision;renderDishActions();dialog.classList.remove('delighted');void dialog.offsetWidth;dialog.classList.add('delighted');
  personal=true;input.value='';ask();memory.querySelector('#paloLearningStatus').textContent='Taste updated. Saving…';
  await saved;if(currentUser?.id!==owner||dishRevision!==revision)return;
  const message=(removed?'Forgot that preference for ':value==='love'?'I’ll favour flavours related to ':'I’ll reduce matches related to ')+d.name+'. '+(state.unsyncedDishes?'Saved on this device; cloud sync needs a retry.':'Saved to your taste profile.');
  memory.querySelector('#paloLearningStatus').textContent=message;speak(message);
 });
 const normalize=s=>String(s||'').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim();
 const contains=(text,term)=>(' '+text+' ').includes(' '+normalize(term)+' ');
 function handleRequest(){
  const query=input.value.trim(),teaching=query.match(/^i\s+(love|like|hate|dislike|don't like|do not like)\s+(.+?)[.!]?$/i);
  if(teaching&&ready()){
   const words=normalize(teaching[2]),matches=availableCalibrationDishes().filter(d=>contains(words,d.name)||d.tags.some(t=>contains(words,t)));
   memory.hidden=false;renderMemory();
   if(matches.length===1){const d=matches[0],value=/^(love|like)$/i.test(teaching[1])?'love':'pass';memory.querySelector('select').value=d.id;renderDishActions();if(state.dishFeedback?.[d.id]!==value)memory.querySelector('[data-palo-learn="'+value+'"]').click();else{personal=true;input.value='';ask();speak('I already remember that preference for '+d.name+'. Here are my picks.')}return}
   lastReply=matches.length?'I found a few related dishes. Choose the one you mean in Teach Palo.':'I don’t have that dish in my taste examples yet. Choose a related dish in Teach Palo.';status.textContent=lastReply;speak(lastReply);return;
  }
  personal=/^(recommend|pick|surprise)( me| for me| something)?$/i.test(query);ask();
 }
 // shortcut: cuisine matches suggest places to check, not confirmed menu availability; upgrade when menu data exists.
 function dishMatches(query){
  const q=normalize(query),extra={pizza:'Italian',pasta:'Italian',dosa:'SouthIndian',idli:'SouthIndian',noodles:'Asian',momos:'Asian',dumplings:'Asian',sushi:'Asian',biryani:'Punjabi',paneer:'Punjabi',chicken:'Punjabi',thali:'Gujarati',dhokla:'Gujarati',coffee:'Cafe',chai:'Cafe',brownie:'Dessert','ice cream':'Dessert',dessert:'Dessert'};
  const cuisines=new Set(Object.entries(extra).filter(([dish])=>contains(q,dish)).map(([,c])=>c));
  for(const [key,aliases] of Object.entries(cuisineAliases))if(aliases.some(a=>contains(q,a)))cuisines.add(key);
  for(const d of calibrationDishes)if(contains(q,d.name)||d.tags.some(t=>contains(q,t)))cuisines.add(d.cuisine);
  const tokens=q.split(' ').filter(t=>t.length>2&&!['want','some','eat','craving','like','please','find','with','food','restaurant','restaurants','something','give','would','spicy','mild','near','where','have','can','you','the','for','and'].includes(t));
  if(!tokens.length)return [];
  const diet=state.answers.diet,asksMeat=/\b(chicken|mutton|fish|beef|pork|prawn|seafood)\b/.test(q);
  if(asksMeat&&(diet==='veg'||diet==='eggetarian'))return [];
  return ranked().filter(r=>!r.matchBreakdown?.some(f=>f.label==='Dietary options'&&f.factor<0)).filter(r=>!asksMeat||(r.dietaryOptions||[]).some(d=>/non.?veg|mixed|both/i.test(d))).map(r=>{
   const evidence=normalize([r.name,r.description,typeof r.review_insights==='string'?r.review_insights:JSON.stringify(r.review_insights||''),...(r.t||[])].join(' '));
   const exact=tokens.some(t=>contains(evidence,t));
   const cuisine=Array.from(cuisines).some(c=>(r.c||[]).some(v=>(cuisineAliases[c]||[c]).some(a=>normalize(v).includes(a))));
   return {r,exact,cuisine};
  }).filter(x=>x.exact||x.cuisine).sort((a,b)=>b.r.score-a.r.score||Number(b.exact)-Number(a.exact)).slice(0,3);
 }
 function stopSpeech(){utterance=null;window.speechSynthesis?.cancel();dialog.classList.remove('speaking');launcher.classList.remove('speaking')}
 function speak(text){stopSpeech();if(!voice||!window.speechSynthesis)return;const speech=new SpeechSynthesisUtterance(text);utterance=speech;const voices=window.speechSynthesis.getVoices();speech.voice=voices.find(v=>/^en-IN/i.test(v.lang))||voices.find(v=>/^en-/i.test(v.lang))||null;speech.lang=speech.voice?.lang||'en-IN';speech.rate=.98;speech.pitch=1.12;speech.onstart=()=>{if(utterance!==speech)return;dialog.classList.add('speaking');launcher.classList.add('speaking')};speech.onend=()=>{if(utterance===speech)stopSpeech()};speech.onerror=e=>{if(utterance!==speech)return;stopSpeech();if(e.error!=='canceled'&&e.error!=='interrupted')status.textContent=lastReply+' Spoken reply unavailable; read the results below.'};window.speechSynthesis.speak(speech)}
 function stopListening(){clearTimeout(listenTimer);const active=recognition;recognition=null;listening=false;active?.abort();mic.textContent=Recognition?'Speak your craving':'Voice input unavailable';mic.setAttribute('aria-pressed','false');dialog.classList.remove('listening')}
 function ask(){
  stopListening();stopSpeech();results.replaceChildren();
  if(!ready()){lastReply='Sign in and finish your taste quiz first. Then I can match your craving with your preferences.';status.textContent=lastReply;speak(lastReply);return}
  const query=input.value.trim().slice(0,160);if(!query&&!personal){input.focus();return}
  const found=personal?ranked().filter(r=>state.feedback[r.id]!=='dislike'&&!r.matchBreakdown?.some(f=>f.label==='Dietary options'&&f.factor<0)).slice(0,3).map(r=>({r,exact:false})):dishMatches(query);
  lastReply=found.length?`Here are ${found.length} places to explore in ${cityName()} for “${query}”. Check the menu with the restaurant before you go.`:`I couldn't find a fit for “${query}” in ${cityName()} with your taste preferences. Try another dish or adjust your diet and city.`;
  if(personal)lastReply=found.length?'These are my picks in '+cityName()+', using your quiz, dish preferences and place reactions.':'No suitable places in this city yet. Try changing your city or preferences.';
  status.textContent=lastReply;
  for(const {r,exact} of found){const row=document.createElement('article');row.className='petResult';row.innerHTML=`<span>${esc((r.c||[]).slice(0,2).join(' · '))}</span><h3>${esc(r.name)}</h3><p>${esc(r.area||r.city)} · ${esc(displayPrice(r))}</p><p>${personal?'Selected from your current taste ranking.':exact?'Related words appear in our catalogue notes.':'Matches the cuisine associated with your craving.'} ${r.score}% estimated taste fit.</p><button type="button" data-pet-place="${esc(r.id)}">Explore place →</button>`;results.append(row)}
  for(const row of results.querySelectorAll('.petResult')){const id=row.querySelector('[data-pet-place]').dataset.petPlace,r=found.find(x=>x.r.id===id).r;const why=document.createElement('p');why.className='paloWhy';why.textContent=(r.why||[]).slice(0,2).join(' · ');row.append(why);row.insertAdjacentHTML('beforeend','<div class="paloPlaceFeedback">'+['like','dislike'].map(v=>'<button type="button" data-palo-rate="'+v+'" data-rest-id="'+esc(id)+'" aria-pressed="'+(state.feedback[id]===v)+'">'+(state.feedback[id]===v?'Undo ':'')+(v==='like'?'Like this':'Not for me')+'</button>').join('')+'</div>')}
  speak(lastReply+(found[0]?' My first suggestion is '+found[0].r.name+'. '+(found[0].r.why||[]).slice(0,2).join('. '):''));
 }
 launcher.addEventListener('click',()=>{dialog.showModal();if(input.value.trim()||personal)ask();else speak('Hi, I’m Palo. Tell me what you’re craving, or let me pick something for your taste.');if(!memory.hidden)renderMemory();input.focus();launcher.setAttribute('aria-expanded','true')});
 dialog.addEventListener('close',()=>{stopListening();stopSpeech();launcher.setAttribute('aria-expanded','false');launcher.focus()});
 dialog.addEventListener('keydown',e=>{if(e.key==='Escape')e.stopPropagation()});
 dialog.addEventListener('click',e=>{if(e.target.closest('[data-pet-close]'))dialog.close();const dish=e.target.closest('[data-dish]');if(dish){personal=false;input.value=dish.dataset.dish;ask()}const place=e.target.closest('[data-pet-place]');if(place){dialog.close();openPlaceDetails(place.dataset.petPlace)}const reaction=e.target.closest('[data-palo-rate]');if(reaction&&ready()){rateV5(reaction.dataset.restId,reaction.dataset.paloRate);ask();if(!memory.hidden)renderMemory()}});
 document.getElementById('petForm').addEventListener('submit',e=>{e.preventDefault();handleRequest()});
 voiceButton.addEventListener('click',()=>{voice=!voice;try{localStorage.setItem('palateo-palo-voice',voice?'on':'off')}catch{}voiceButton.setAttribute('aria-pressed',String(voice));voiceButton.textContent='Read replies: '+(voice?'on':'off');if(voice)speak(lastReply||'Hi, I’m Palo. What would you like to eat?');else stopSpeech()});
 mic.addEventListener('click',()=>{
  if(listening){stopListening();status.textContent='Listening stopped. You can type your craving.';return}
  if(!Recognition)return;stopSpeech();const session=new Recognition();recognition=session;session.lang='en-IN';session.interimResults=false;session.maxAlternatives=1;
  session.onresult=e=>{if(recognition!==session)return;input.value=e.results[0][0].transcript.slice(0,160);stopListening();handleRequest()};
  session.onerror=e=>{if(recognition!==session)return;stopListening();status.textContent=e.error==='not-allowed'?'Microphone access was declined. Type your craving below.':'Voice could not hear you. Try again or type your craving.'};
  session.onend=()=>{if(recognition===session){stopListening();status.textContent='Listening finished. Try again or type your craving.'}};
  try{listening=true;mic.textContent='Stop listening';mic.setAttribute('aria-pressed','true');dialog.classList.add('listening');status.textContent='Listening… tell me a dish.';session.start();listenTimer=setTimeout(()=>{stopListening();status.textContent='Listening timed out. Try again or type your craving.'},15000)}catch{stopListening();status.textContent='Voice is unavailable here. Type your craving instead.'}
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stopListening();stopSpeech()}});
 const originalGate=requireAuthGate;requireAuthGate=function(message){if(dialog.open)dialog.close();input.value='';results.replaceChildren();memory.replaceChildren();memory.hidden=true;personal=false;lastReply='';originalGate(message)};
 function enhanceLogin(){
  const modal=document.getElementById('authModal');if(!modal||modal.querySelector('.passwordWrap'))return;
  const card=modal.querySelector('.modalCard'),password=modal.querySelector('#authPass');if(!password)return;
  card.classList.add('interactiveLogin');card.insertAdjacentHTML('afterbegin',`<div class="loginPet">${pet}<span>A good meal starts here.</span></div>`);
  card.querySelector('.eyebrow').textContent='YOUR PALATE, REMEMBERED';
  const wrap=document.createElement('div');wrap.className='passwordWrap';password.before(wrap);wrap.append(password);
  const toggle=document.createElement('button');toggle.type='button';toggle.textContent='Show';toggle.setAttribute('aria-label','Show password');toggle.setAttribute('aria-pressed','false');wrap.append(toggle);
  toggle.addEventListener('click',()=>{const visible=password.type==='password';password.type=visible?'text':'password';toggle.textContent=visible?'Hide':'Show';toggle.setAttribute('aria-label',visible?'Hide password':'Show password');toggle.setAttribute('aria-pressed',String(visible));password.focus()});
  const hint=document.createElement('p');hint.className='passwordHint';hint.id='passwordHint';hint.setAttribute('aria-live','polite');password.setAttribute('aria-describedby','passwordHint');wrap.after(hint);
  password.addEventListener('keyup',e=>{hint.textContent=e.getModifierState?.('CapsLock')?'Caps Lock is on.':password.autocomplete==='new-password'&&password.value.length>0&&password.value.length<6?'Use at least 6 characters.':''});
  password.addEventListener('focus',()=>card.classList.add('petEyesClosed'));password.addEventListener('blur',()=>card.classList.remove('petEyesClosed'));
  const replay=document.createElement('button');replay.type='button';replay.className='linkBtn introReplay';replay.textContent='Meet Palo · play intro';replay.addEventListener('click',()=>showIntro(true));card.append(replay);
 }
 const baseAuth=showAuth;showAuth=function(...args){baseAuth(...args);enhanceLogin()};window.Palateo.showAuth=showAuth;enhanceLogin();
 function showIntro(replay=false){
  if(document.getElementById('paloIntro'))return;
  if(!replay){if(reduce.matches||/type=recovery|access_token=/.test(location.hash))return;try{if(sessionStorage.getItem('palo-intro'))return;sessionStorage.setItem('palo-intro','1')}catch{}}
  const intro=document.createElement('dialog');intro.id='paloIntro';intro.className='paloIntro';intro.setAttribute('aria-label','Welcome to Palateo');intro.innerHTML='<video muted playsinline preload="auto" aria-label="Palo bounces into a plate, with colourful restaurant pins"> <source src="intro.webm" type="video/webm"></video><div><span>PALATEO</span><h2>A little craving.<br>A good place.</h2><button type="button">Skip intro →</button></div>';document.body.append(intro);intro.showModal();
  const video=intro.querySelector('video'),close=()=>{clearTimeout(timer);video.pause();intro.close();intro.remove();document.querySelector('#authEmail,#authName,#petLauncher')?.focus({preventScroll:true})};
  const timer=setTimeout(close,4200);intro.querySelector('button').onclick=close;intro.addEventListener('keydown',e=>{if(e.key==='Escape')e.stopPropagation()});intro.addEventListener('cancel',e=>{e.preventDefault();close()});video.addEventListener('ended',close);video.addEventListener('error',close);video.muted=true;video.play().catch(close);
 }
 showIntro();
})();

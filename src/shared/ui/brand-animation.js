function initLogoReveal(){
 const el=document.getElementById('palateoLogoReveal');
 if(!el)return;
 let dismissTimer=null;
 function dismiss(quick){
  if(quick&&el.classList?.add){
   el.classList.add('is-skipping');
   setTimeout(()=>{if(el.classList?.add)el.classList.add('dismissed');if(el.classList?.remove)el.classList.remove('is-active','is-skipping','replaying')},260);
  } else {
   if(el.classList?.add)el.classList.add('dismissed');
   if(el.classList?.remove)el.classList.remove('is-active','is-skipping','replaying');
  }
  try{if(window.sessionStorage)sessionStorage.setItem('palateo_revealed_v2','true')}catch(e){}
 }
 if(typeof window.matchMedia==='function'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){if(el.classList?.add)el.classList.add('dismissed');return}
 try{if(window.sessionStorage&&sessionStorage.getItem('palateo_revealed_v2')==='true'){if(el.classList?.add)el.classList.add('dismissed');return}}catch(e){}
 if(el.classList?.add)el.classList.add('is-active');
 const skipBtn=document.getElementById('revealSkipBtn');
 if(skipBtn&&typeof skipBtn.addEventListener==='function')skipBtn.addEventListener('click',e=>{if(e&&e.stopPropagation)e.stopPropagation();dismiss(true)});
 if(typeof el.addEventListener==='function')el.addEventListener('click',()=>dismiss(true));
 if(typeof window.addEventListener==='function')window.addEventListener('keydown',e=>{if(e&&(e.key==='Escape'||e.key===' '||e.key==='Enter'))dismiss(true)},{once:true});
 dismissTimer=setTimeout(()=>dismiss(false),3050);
 window.replayLogoReveal=function(){
  if(!el)return;
  clearTimeout(dismissTimer);
  if(el.classList?.remove)el.classList.remove('dismissed','is-skipping','is-active','replaying');
  void el.offsetWidth;
  if(el.classList?.add)el.classList.add('is-active');
  dismissTimer=setTimeout(()=>dismiss(false),3050);
 };
 const logo=(typeof document.querySelector==='function')?document.querySelector('.logo'):null;
 if(logo&&typeof logo.addEventListener==='function'){logo.style.cursor='pointer';logo.title='Palateo - Click to replay intro';logo.addEventListener('click',()=>window.replayLogoReveal())}
}

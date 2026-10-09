const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Aayush/Documents/Codex/playwright-cli/node_modules/.pnpm/playwright-core@1.64.0-alpha-1790635538000/node_modules/playwright-core');
const root=path.resolve(__dirname,'..'),output=path.join(root,'outputs');
const {contrast}=require('./check-design-colors.cjs');
const base=process.env.PALATEO_CHECK_URL||'http://127.0.0.1:8771';
const account=JSON.parse(fs.readFileSync(path.join(__dirname,'palateo_cloudflare_pages/.env.auth-check.local'),'utf8'));
async function checkContrast(locator,label){
 const [foreground,background]=await locator.evaluate(el=>{
  const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);
  const color=getComputedStyle(el).color;let current=el,background='';
  while(current){const value=getComputedStyle(current).backgroundColor;if(value!=='rgba(0, 0, 0, 0)'&&value!=='transparent'){background=value;break}current=current.parentElement}
  const hex=s=>'#'+rgb(s).map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
  return [hex(color),hex(background||'rgb(195, 231, 241)')];
 });
 assert.ok(contrast(foreground,background)>=4.5,label+' computed text contrast');
}
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 if(base==='http://127.0.0.1:8771'){
  await page.goto(base+'/design-preview');
  assert.equal(await page.locator('figure img').count(),7,'Local gallery must include every reviewed mobile screen');
  for(const key of ['home','details','quiz','spice','calibration','profile','waitlist'])assert.equal((await context.request.get(base+'/preview-image/'+key)).status(),200);
  assert.equal((await context.request.get(base+'/preview-image/unknown')).status(),404,'Gallery must reject arbitrary files');
  await page.screenshot({path:path.join(output,'design-preview-gallery.png')});
 }
 await page.goto(base+'/app/');
 await page.getByLabel('Email address',{exact:true}).fill(account.email);
 await page.getByLabel('Password',{exact:true}).fill(account.password);
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await page.locator('.home-screen').waitFor({timeout:30000});
 await checkContrast(page.locator('.mode'),'App account status');
 await checkContrast(page.locator('.nav button.active'),'App active navigation');
 assert.equal(await page.locator('.homeMapView').count(),1,'Home must start with the map');
 assert.equal(await page.locator('.zestMapSvg>rect').evaluate(el=>getComputedStyle(el).fill),'rgb(195, 231, 241)','Map must match the waitlist LightBlue plane');
 assert.equal(await page.locator('.zestMapPaths').count(),1,'Map must include the illustrative white paths');
 const candidate=page.locator('.restaurant-card').last();
 const id=await candidate.getAttribute('id');
 const before=Number((await candidate.locator('.match b').innerText()).replace('%',''));
 await candidate.locator('[data-rest-action=like]').click();
 const selected=page.locator('[id="'+id+'"]');
 await selected.locator('[data-rest-action=like][aria-pressed=true]').waitFor();
 const liked=Number((await selected.locator('.match b').innerText()).replace('%',''));
 assert.ok(liked>before,'Like must increase a non-maximal match');
 await selected.locator('[data-rest-action=like]').click();
 await selected.locator('[data-rest-action=like][aria-pressed=false]').waitFor();
 assert.equal(Number((await selected.locator('.match b').innerText()).replace('%','')),before,'Undo must restore the exact prior score');
 const linkedPin=page.locator('.zestPin[data-rest-id="'+id.replace('card-','')+'"]');
 if(await linkedPin.count()){
  await linkedPin.click();
  await page.locator('.zestMapSheet').waitFor();
  assert.ok(await selected.evaluate(el=>{const railBox=el.closest('.restaurantGrid').getBoundingClientRect(),cardBox=el.getBoundingClientRect();return cardBox.left>=railBox.left-2&&cardBox.right<=railBox.right+2}),'Selecting a pin must reveal its matching carousel card');
  await page.getByRole('button',{name:'Close preview',exact:true}).click();
 }
 const tailPin=page.locator('.zestPin').last(),tailId=await tailPin.getAttribute('data-rest-id');
 await tailPin.click();
 const tailCard=page.locator('[id="card-'+tailId+'"]');
 await tailCard.waitFor();
 assert.ok(await tailCard.evaluate(el=>{const railBox=el.closest('.restaurantGrid').getBoundingClientRect(),cardBox=el.getBoundingClientRect();return cardBox.left>=railBox.left-2&&cardBox.right<=railBox.right+2}),'Pins beyond the initial card limit must also reveal their card');
 await page.getByRole('button',{name:'Close preview',exact:true}).click();
 await page.locator('.restaurantGrid').evaluate(el=>el.scrollLeft=0);
 await page.waitForLoadState('networkidle');
 await page.locator('.toast.show').waitFor({state:'hidden'});
 await page.evaluate(()=>scrollTo(0,0));
 await page.screenshot({path:path.join(output,'redesign-app-desktop.png')});
 for(const width of [375,320]){
  await page.setViewportSize({width,height:812});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'App must not overflow at '+width);
  const firstPhoto=await page.locator('.restaurant-card .photo').first().boundingBox();
  assert.ok(firstPhoto.y+firstPhoto.height<742,'A place preview must be reachable above the mobile navigation at '+width);
  await page.screenshot({path:path.join(output,'redesign-app-'+width+'.png')});
 }
 await page.locator('#citySelect').selectOption('Vadodara');
 await page.locator('.home-screen').waitFor();
 await page.getByRole('button',{name:'Map',exact:true}).click();
 await page.locator('.zestMapContainer').waitFor();
 const firstPin=page.locator('.zestPin').first();
 const pinId=await firstPin.getAttribute('data-rest-id');
 await firstPin.focus();await firstPin.press('Enter');
 await page.locator('.zestMapSheet').waitFor();
 assert.equal(await page.locator('.zestSheetClose').evaluate(el=>el===document.activeElement),true,'Opening details must move keyboard focus into the sheet');
 await page.locator('.toast.show').waitFor({state:'hidden'});
 await checkContrast(page.locator('.zestMapSheet .actions .dark'),'Map sheet Save');
 await page.screenshot({path:path.join(output,'redesign-map-mobile.png')});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Map must not overflow');
 await page.locator('.zestSheetClose').press('Escape');
 assert.equal(await page.locator('.zestPin[data-rest-id="'+pinId+'"]').evaluate(el=>el===document.activeElement),true,'Escape must restore the originating pin');
 const openedPlaceId=await page.locator('.restaurant-card .photo').first().getAttribute('data-rest-id');
 await page.locator('.restaurant-card .photo').first().click();
 await page.locator('.place-screen').waitFor();
 await page.getByRole('heading',{name:'About',exact:true}).waitFor();
 assert.ok(await page.locator('.placeAddress').innerText(),'Place details must expose available location information');
 for(const width of [320,375,1440]){
  await page.setViewportSize({width,height:width===1440?1000:812});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Place details must not overflow at '+width);
  await page.screenshot({path:path.join(output,'redesign-place-'+width+'.png'),fullPage:true});
 }
 const dish=page.locator('.placeDishes [data-action=dish-rate][data-dish-value=love]').first();
 assert.ok(await dish.count(),'A venue with cuisine information must provide dish calibration examples');
 const dishId=await dish.getAttribute('data-dish-id');
 const dishBefore=Number((await page.locator('.placeMatch strong').innerText()).replace('%',''));
 const dishResponse=page.waitForResponse(r=>r.url().includes('/rest/v1/taste_profiles')&&r.request().method()==='POST');
 await dish.click();
 assert.equal((await dishResponse).ok(),true,'Dish feedback must be accepted by Supabase');
 await page.locator('.calibrationStatus').filter({hasText:'saved to your account'}).waitFor();
 const dishLoved=Number((await page.locator('.placeMatch strong').innerText()).replace('%',''));
 assert.ok(dishLoved>=dishBefore,'Dish love must not decrease a related estimate');
 await page.evaluate(()=>localStorage.removeItem('palateo_final_v1'));
 await page.reload();
 await page.locator('.home-screen').waitFor({timeout:30000});
 await page.getByRole('button',{name:'Palate',exact:true}).click();
 await page.locator('.ratedDishes').waitFor();
 await page.locator('.ratedDishes summary').click();
 const restoredDish=page.locator('.ratedDishes [data-action=dish-rate][data-dish-id="'+dishId+'"][data-dish-value=love]');
 assert.equal(await restoredDish.getAttribute('aria-pressed'),'true','Dish choices must restore from Supabase after clearing local preferences');
 await restoredDish.click();
 await page.locator('.calibrationStatus').filter({hasText:'saved to your account'}).waitFor();
 await page.getByRole('button',{name:'Home',exact:true}).click();
 await page.evaluate(id=>openPlaceDetails(id,null),openedPlaceId);
 await page.locator('.place-screen').waitFor();
 assert.equal(Number((await page.locator('.placeMatch strong').innerText()).replace('%','')),dishBefore,'Cloud-persisted dish undo must restore the exact previous venue estimate');
 await page.locator('#placeBack').click();await page.locator('.home-screen').waitFor();
 await page.setViewportSize({width:375,height:812});
 await page.locator('.restaurant-card .photo').first().click();
 await page.locator('#placeBack').press('Escape');
 await page.locator('.home-screen').waitFor();
 assert.equal(await page.locator('.restaurant-card .photo').first().evaluate(el=>el===document.activeElement),true,'Closing place details must restore the card trigger');
 await page.locator('.restaurant-card .restnameButton').first().click();
 await page.goBack();
 await page.locator('.home-screen').waitFor();
 assert.equal(await page.locator('.restaurant-card .restnameButton').first().evaluate(el=>el===document.activeElement),true,'Browser Back must restore the exact title trigger');
 await page.goForward();
 await page.locator('.place-screen').waitFor();
 const heroImage=page.locator('.placeHeroPhoto img');
 if(await heroImage.count()){assert.equal(await heroImage.evaluate(img=>new Promise(resolve=>{img.addEventListener('error',()=>resolve(img.hidden),{once:true});img.src='/unavailable-hero-photo.jpg'})),true,'Hero must hide failed images');assert.ok(await page.locator('.placeHeroPhoto .venuePlaceholder').isVisible())}
 await page.locator('#placeBack').click();
 await page.locator('.home-screen').waitFor();
 const secondPlaceId=await page.locator('.restaurant-card').last().getAttribute('data-place-id');
 await page.locator('.restaurant-card .restnameButton').first().click();
 await page.getByRole('button',{name:'Saved',exact:true}).click();
 await page.locator('.saved-screen').waitFor();
 await page.evaluate(id=>openPlaceDetails(id,null),secondPlaceId);
 await page.locator('.place-screen').waitFor();
 await page.goBack();await page.locator('.saved-screen').waitFor();
 assert.equal(await page.evaluate(()=>history.state.palateoPage),'saved','Leaving details through navigation must replace abandoned place markers');
 await page.goBack();await page.locator('.home-screen').waitFor();
 await page.goForward();await page.locator('.saved-screen').waitFor();
 await page.goForward();await page.locator('.place-screen').waitFor();
 await page.locator('#placeBack').click();await page.locator('.saved-screen').waitFor();
 await page.getByRole('button',{name:'Home',exact:true}).click();
 await page.getByRole('button',{name:'Full list',exact:true}).click();
 assert.equal(await page.locator('.homeListView').count(),1,'Full list must remain available');
 assert.equal(await page.getByRole('button',{name:'Full list',exact:true}).evaluate(el=>el===document.activeElement),true,'View controls must preserve keyboard focus');
 await page.getByRole('button',{name:'People',exact:true}).click();
 await page.locator('.social-screen').waitFor();
 await checkContrast(page.locator('.follow').first(),'People Connect');
 await page.locator('.follow').first().hover();
 await checkContrast(page.locator('.follow').first(),'People Connect hover');
 await page.getByRole('button',{name:'Palate',exact:true}).click();
 await page.locator('.profileTasteSummary').waitFor();
 await page.screenshot({path:path.join(output,'redesign-profile-mobile.png')});
 await page.locator('.dishCalibration').scrollIntoViewIfNeeded();
 await page.screenshot({path:path.join(output,'redesign-calibration-mobile.png')});
 await page.goto(base+'/app/?quiz=1');
 await page.locator('.onboarding-screen').waitFor({timeout:30000});
 await page.setViewportSize({width:375,height:812});
 await page.screenshot({path:path.join(output,'redesign-quiz-mobile.png')});
 for(let i=0;i<8;i++){
  await page.locator('[data-step="'+i+'"][data-action=pick]').first().waitFor();
  const selected=page.locator('.choice[aria-pressed=true]');
  if(await selected.count()===0)await page.locator('.choice').first().click();
  assert.equal(await page.locator('#tasteContinue').isEnabled(),true);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Quiz must not overflow');
  if(i===1){
   const cuisine=page.locator('.choice[data-value="Cafe"]');
   const prior=await cuisine.getAttribute('aria-pressed');
   await cuisine.click();await cuisine.click();
   assert.equal(await cuisine.getAttribute('aria-pressed'),prior,'Cuisine chips must toggle without losing prior choices');
   await checkContrast(page.locator('.choice[aria-pressed=true]').first(),'Quiz selected cuisine');
   await checkContrast(page.locator('#tasteContinue'),'Quiz Continue');
   await page.locator('.tasteActions .secondary').hover();
   await checkContrast(page.locator('.tasteActions .secondary'),'Quiz Back hover');
   await page.locator('#tasteQuestion').hover();
   await page.screenshot({path:path.join(output,'redesign-quiz-cuisines.png')});
  }
  if(i===4){
   await page.locator('#quizSpice').waitFor();
   await page.screenshot({path:path.join(output,'redesign-quiz-spice.png')});
  }
  await page.locator('#tasteContinue').click();
 }
 await page.locator('.home-screen').waitFor({timeout:30000});
 await page.goto(base+'/app/');
 await page.locator('.home-screen').waitFor({timeout:30000});
 await page.waitForLoadState('networkidle');
 assert.equal(await page.locator('#authModal').count(),0,'Session and cloud quiz must persist on reopening');
 const venueImage=page.locator('.restaurant-card .photo img').first();
 await venueImage.scrollIntoViewIfNeeded();
 assert.equal(await venueImage.evaluate(img=>new Promise(resolve=>{img.addEventListener('error',()=>resolve(img.hidden),{once:true});img.src='/unavailable-test-photo.jpg'})),true,'An image error must hide that failed image');
 assert.ok(await page.locator('.restaurant-card .venuePlaceholder').first().isVisible(),'An unavailable image must retain a visible venue placeholder');
 await page.goto(base+'/');
 await page.locator('#waitlist-form').waitFor();
 await page.setViewportSize({width:1440,height:1000});
 await page.locator('.site-header .nav-story').hover();
 await checkContrast(page.locator('.site-header .nav-story'),'Waitlist header link hover');
 await page.locator('.site-header .nav-cta').hover();
 await checkContrast(page.locator('.site-header .nav-cta'),'Waitlist header CTA hover');
 await page.locator('h1').hover();
 await checkContrast(page.locator('.hero-actions .button-primary'),'Waitlist primary action');
 await checkContrast(page.locator('.quiz-copy .button-dark'),'Waitlist quiz action');
 await checkContrast(page.locator('.sample-note'),'Waitlist light-section note');
 await checkContrast(page.locator('#waitlist-form input[type=email]'),'Waitlist email field');
 for(const [width,height] of [[1440,1000],[375,812],[320,812]]){
  await page.setViewportSize({width,height});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Waitlist must not overflow at '+width);
  await page.screenshot({path:path.join(output,'redesign-waitlist-'+width+'.png'),fullPage:true});
 }
 assert.deepEqual(errors,[],'No app runtime errors');
 if(base==='http://127.0.0.1:8771'){
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(base+'/design-preview');
  await page.locator('figure img').last().waitFor();
  await page.waitForLoadState('networkidle');
  await page.screenshot({path:path.join(output,'design-preview-gallery.png')});
 }
 console.log(JSON.stringify({status:'PASS',realSupabaseSignIn:true,quizCompleted:true,sessionRestored:true,like:{before,liked,undone:before},dish:{before:dishBefore,loved:dishLoved,cloudRestored:true,undone:true},placeAbout:true,responsiveWidths:[320,375,1440],runtimeErrors:errors}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e.message);process.exitCode=1});

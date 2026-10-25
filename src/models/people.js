const people=[
 {
  id:'p1',
  name:'Aarav Shah',
  city:'Ahmedabad',
  taste:'Gujarati • premium • quiet',
  match:94,
  avatar:'AS',
  bio:'Heritage food, quiet dinners & discovering regional umami.',
  likes:['gujarati-thali','dhokla','wood-fired-pizza','filter-coffee','truffle-pasta'],
  dislikes:['chilli-noodles','arrabbiata-pasta'],
  cuisines:['Gujarati','Italian','Cafe'],
  spice:'mild',
  priority:'food',
  recommendedDish:'Wood-fired vegetable pizza',
  persona:'Heritage Umami & Slow Dining'
 },
 {
  id:'p2',
  name:'Riya Mehta',
  city:'Ahmedabad',
  taste:'Cafe • Italian • cozy',
  match:91,
  avatar:'RM',
  bio:'Specialty coffee, sourdough brunches and hidden cafe finds.',
  likes:['filter-coffee','sourdough-toast','wood-fired-pizza','truffle-pasta','crispy-falafel'],
  dislikes:['dum-biryani','paneer-tikka','chilli-noodles'],
  cuisines:['Cafe','Italian','Dessert'],
  spice:'mild',
  priority:'ambience',
  recommendedDish:'Sourdough & coffee',
  persona:'Artisanal Cafe & Sourdough Purist'
 },
 {
  id:'p3',
  name:'Kabir Patel',
  city:'Ahmedabad',
  taste:'Global • lively • friends',
  match:87,
  avatar:'KP',
  bio:'Always chasing high-heat wok dishes, tandoor grills and vibrant dinners.',
  likes:['chilli-noodles','arrabbiata-pasta','paneer-tikka','dum-biryani','paneer-kurchan'],
  dislikes:['dhokla','idli','chocolate-brownie'],
  cuisines:['Asian','Punjabi','Italian'],
  spice:'hot',
  priority:'unique',
  recommendedDish:'Chilli garlic noodles',
  persona:'High-Heat Wok & Tandoor Adventurer'
 },
 {
  id:'p4',
  name:'Ananya Joshi',
  city:'Ahmedabad',
  taste:'Gujarati • family • value',
  match:84,
  avatar:'AJ',
  bio:'Comforting regional staples, crisp dosas and family tables.',
  likes:['gujarati-thali','masala-dosa','idli','veg-dumplings','dhokla'],
  dislikes:['arrabbiata-pasta','chilli-noodles'],
  cuisines:['Gujarati','SouthIndian','Asian'],
  spice:'mild',
  priority:'value',
  recommendedDish:'Masala dosa',
  persona:'Regional Fermented & Comfort Classic'
 },
 {
  id:'p5',
  name:'Dev Malhotra',
  city:'Ahmedabad',
  taste:'Italian • date night • premium',
  match:82,
  avatar:'DM',
  bio:'Handmade pastas, wood-fired blistering, dark cocoa and evening dates.',
  likes:['wood-fired-pizza','arrabbiata-pasta','chocolate-brownie','truffle-pasta','matcha-gelato'],
  dislikes:['gujarati-thali','idli'],
  cuisines:['Italian','Dessert','Cafe'],
  spice:'medium',
  priority:'ambience',
  recommendedDish:'Truffle & wild mushroom pasta',
  persona:'Continental Indulgence & Craft Sweets'
 }
];

function getDishNameById(id){
 if(typeof calibrationDishes==='undefined')return id;
 const d=calibrationDishes.find(x=>x.id===id);
 return d?d.name:id;
}

function computeTasteTwinScore(userLikes,userDislikes,userAnswers,person){
 const agreedLikes=person.likes.filter(id=>userLikes.includes(id));
 const agreedDislikes=person.dislikes.filter(id=>userDislikes.includes(id));
 const conflictLikes=person.likes.filter(id=>userDislikes.includes(id));
 const conflictDislikes=person.dislikes.filter(id=>userLikes.includes(id));
 const conflicts=conflictLikes.length+conflictDislikes.length;

 const prefCuisines=typeof preferredCuisines==='function'?preferredCuisines(userAnswers):[];
 const sharedCuisines=person.cuisines.filter(c=>prefCuisines.includes(c));
 const cuisineScore=sharedCuisines.length?8:0;

 const userSpice=userAnswers?.spice||'medium';
 const spiceScore=userSpice===person.spice?6:((userSpice==='mild'&&person.spice==='hot')||(userSpice==='hot'&&person.spice==='mild'))?-8:0;

 const feedbackWeight=agreedLikes.length*6+agreedDislikes.length*4-conflicts*7;
 const baseMatch=76;
 const raw=baseMatch+feedbackWeight+cuisineScore+spiceScore;
 const dynamicMatch=Math.max(52,Math.min(98,Math.round(raw)));

 return {
  dynamicMatch,
  agreedLikes,
  agreedDislikes,
  conflicts,
  sharedCuisines
 };
}

function getRankedTasteTwins(){
 if(typeof state==='undefined'||!state?.answers)return people.map(p=>({...p,dynamicMatch:p.match,agreedLikes:[],agreedDislikes:[],agreedLikeNames:[],agreedDislikeNames:[]}));
 const feedback=typeof normalizeDishFeedback==='function'?normalizeDishFeedback(state.dishFeedback):{};
 const userLikes=Object.entries(feedback).filter(([,v])=>v==='love').map(([k])=>k);
 const userDislikes=Object.entries(feedback).filter(([,v])=>v==='pass').map(([k])=>k);

 return people.map(person=>{
  const scoreData=computeTasteTwinScore(userLikes,userDislikes,state.answers,person);
  const agreedLikeNames=scoreData.agreedLikes.map(getDishNameById);
  const agreedDislikeNames=scoreData.agreedDislikes.map(getDishNameById);

  let twinReason='';
  if(agreedLikeNames.length&&agreedDislikeNames.length){
   twinReason=`Both love ${agreedLikeNames[0]} & pass on ${agreedDislikeNames[0]}`;
  }else if(agreedLikeNames.length){
   twinReason=`Both love ${agreedLikeNames.slice(0,2).join(' & ')}`;
  }else if(scoreData.sharedCuisines.length){
   twinReason=`Shared passion for ${scoreData.sharedCuisines.join(' & ')}`;
  }else{
   twinReason=`${person.spice} spice & ${person.cuisines[0]} dining affinity`;
  }

  return {
   ...person,
   dynamicMatch:scoreData.dynamicMatch,
   agreedLikes:scoreData.agreedLikes,
   agreedDislikes:scoreData.agreedDislikes,
   agreedLikeNames,
   agreedDislikeNames,
   twinReason
  };
 }).sort((a,b)=>b.dynamicMatch-a.dynamicMatch);
}

function depictCollaborativeTaste(){
 const twins=getRankedTasteTwins();
 const topTwin=twins[0]||people[0];
 const feedback=typeof normalizeDishFeedback==='function'?normalizeDishFeedback(state.dishFeedback):{};
 const ratedIds=new Set(Object.keys(feedback));

 const predictions=[];
 for(const twin of twins.slice(0,3)){
  const weight=twin.dynamicMatch/100;
  for(const dishId of twin.likes){
   if(!ratedIds.has(dishId)){
    const existing=predictions.find(p=>p.dishId===dishId);
    if(existing){
     existing.score+=weight;
     if(!existing.twins.includes(twin.name))existing.twins.push(twin.name);
    }else{
     predictions.push({
      dishId,
      name:getDishNameById(dishId),
      score:weight,
      twins:[twin.name]
     });
    }
   }
  }
 }
 predictions.sort((a,b)=>b.score-a.score);

 return {
  personaTitle:topTwin.persona||'Culinary Explorer',
  topTwin,
  allTwins:twins,
  consensusScore:Math.round(twins.slice(0,3).reduce((sum,t)=>sum+t.dynamicMatch,0)/3),
  predictedLoves:predictions.slice(0,3),
  communitySummary:`Your like/dislike pattern closely matches ${topTwin.name} (${topTwin.dynamicMatch}% twin). Diners with your palate prioritize ${topTwin.taste.toLowerCase()}.`
 };
}


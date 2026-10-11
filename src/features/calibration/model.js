const cuisineAliases={Gujarati:['gujarati','kathiyawadi'],Punjabi:['punjabi','north indian','mughlai'],Italian:['italian','pizza','pasta','continental','european'],Cafe:['cafe','coffee','bakery'],SouthIndian:['south indian','dosa','idli'],Asian:['asian','chinese','thai','pan asian'],Dessert:['dessert','desserts','ice cream','gelato','bakery','sweets']};
const cuisineLabels={Gujarati:'Gujarati',Punjabi:'North Indian',Italian:'Italian & continental',Cafe:'Café & coffee',SouthIndian:'South Indian',Asian:'Asian',Dessert:'Desserts'};
const calibrationDishes=[
 {id:'gujarati-thali',name:'Gujarati thali',description:'A little sweet, a little savoury, with a variety of textures.',cuisine:'Gujarati',tags:['thali','regional'],diet:'veg',spice:'mild'},
 {id:'dhokla',name:'Dhokla',description:'Soft, tangy steamed bites with a light tempering.',cuisine:'Gujarati',tags:['snacks','street food'],diet:'veg',spice:'mild'},
 {id:'paneer-tikka',name:'Paneer tikka',description:'Smoky grilled paneer with a warming masala.',cuisine:'Punjabi',tags:['paneer','tandoor','grill'],diet:'veg',spice:'medium'},
 {id:'butter-chicken',name:'Butter chicken',description:'A rich, creamy tomato curry with gently spiced chicken.',cuisine:'Punjabi',tags:['chicken','curry'],diet:'nonveg',spice:'mild'},
 {id:'masala-dosa',name:'Masala dosa',description:'A crisp fermented crepe, potato filling and savoury accompaniments.',cuisine:'SouthIndian',tags:['dosa','breakfast'],diet:'veg',spice:'medium'},
 {id:'idli',name:'Idli & sambar',description:'Soft steamed rice cakes with a tangy lentil stew.',cuisine:'SouthIndian',tags:['idli','breakfast'],diet:'veg',spice:'mild'},
 {id:'wood-fired-pizza',name:'Wood-fired vegetable pizza',description:'A crisp crust, roasted vegetables and melted cheese.',cuisine:'Italian',tags:['pizza','wood fired'],diet:'veg',spice:'mild'},
 {id:'arrabbiata-pasta',name:'Arrabbiata pasta',description:'Tomato, garlic and chilli with a bold, savoury finish.',cuisine:'Italian',tags:['pasta'],diet:'veg',spice:'hot'},
 {id:'chilli-noodles',name:'Chilli garlic noodles',description:'Wok-tossed vegetables, garlic and a sharper chilli kick.',cuisine:'Asian',tags:['noodles','wok','chinese'],diet:'veg',spice:'hot'},
 {id:'veg-dumplings',name:'Vegetable dumplings',description:'Soft wrappers, savoury vegetables and a light dipping sauce.',cuisine:'Asian',tags:['dumplings','momos'],diet:'veg',spice:'mild'},
 {id:'filter-coffee',name:'Filter coffee',description:'A deep roasted coffee flavour with a smooth milky finish.',cuisine:'Cafe',tags:['coffee','filter coffee'],diet:'veg',spice:'mild'},
 {id:'sourdough-toast',name:'Sourdough & coffee',description:'A tangy, crisp toast alongside an aromatic cup.',cuisine:'Cafe',tags:['coffee','sourdough','bakery'],diet:'veg',spice:'mild'},
 {id:'chocolate-brownie',name:'Eggless chocolate brownie',description:'An eggless cocoa brownie with a soft centre and a sweet finish.',cuisine:'Dessert',tags:['chocolate','brownie'],diet:'veg',spice:'mild'},
 {id:'masala-omelette',name:'Masala omelette',description:'Eggs with onion, tomato and warming spices. A taste example, not a verified menu item.',cuisine:'Cafe',tags:['egg','breakfast'],diet:'egg',spice:'medium'},
 {id:'dum-biryani',name:'Chicken dum biryani',description:'Aromatic rice, layered spices and slow-cooked chicken.',cuisine:'Punjabi',tags:['biryani','chicken'],diet:'nonveg',spice:'hot'}
];
let dishCalibrationIndex=0,lastCalibratedDish=null,dishRevision=0,dishSyncStatus='',detailRestaurantId=null,detailOrigin='home',detailTrigger=null;
function normalizeDishFeedback(value){
 if(!value||typeof value!=='object'||Array.isArray(value))return {};
 return Object.fromEntries(calibrationDishes.filter(d=>['love','pass'].includes(value[d.id])).map(d=>[d.id,value[d.id]]));
}
function preferredCuisines(a=state.answers){
 const favorites=Array.isArray(a?.cuisines)?a.cuisines.filter(x=>Object.hasOwn(cuisineAliases,x)):[];
 return [...new Set(favorites.length?favorites:[a?.cuisine].filter(Boolean))];
}
function preferredVibes(a=state.answers){
 const favorites=Array.isArray(a?.vibes)?a.vibes.filter(x=>['quiet','lively','date','family'].includes(x)):[];
 return [...new Set(favorites.length?favorites:[a?.mood].filter(Boolean))];
}
function cuisineFits(r,key){
 const values=[...(r.c||[]),...(r.t||[])].map(x=>String(x).toLowerCase());
 return values.some(x=>(cuisineAliases[key]||[String(key).toLowerCase()]).some(term=>x.includes(term)));
}
function availableCalibrationDishes(){const diet=state.answers?.diet;return calibrationDishes.filter(d=>diet==='veg'?d.diet==='veg':diet==='eggetarian'?d.diet!=='nonveg':true)}
function dishAffinity(r,d){
 if(!cuisineFits(r,d.cuisine))return 0;
 const tags=[...(r.t||[]),...(r.c||[])].map(x=>String(x).toLowerCase());
 const specific=tags.some(x=>d.tags.some(tag=>x.includes(tag)));
 return specific?1:.7;
}
function dishAdjustment(r){
 const feedback=normalizeDishFeedback(state.dishFeedback);
 let sum=0,weight=0;
 for(const d of availableCalibrationDishes()){
  if(!feedback[d.id])continue;
  const affinity=dishAffinity(r,d);if(!affinity)continue;
  sum+=(feedback[d.id]==='love'?1:-1)*affinity;weight+=affinity;
 }
 // shortcut: cuisine/tag similarity approximates dish fit; upgrade when verified menu-level features are available.
 return weight?Math.max(-8,Math.min(8,8*sum/(1+weight))):0;
}

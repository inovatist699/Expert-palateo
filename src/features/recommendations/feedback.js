let feedbackRevision=0;
function restaurantFeatures(r){return [...new Set([...(r.c||[]),...(r.t||[]),...(r.a||[]),...(r.o||[]),...(r.review_insights||[])].map(x=>String(x).trim().toLowerCase()).filter(Boolean))]}
function feedbackCount(){return (state.ai?.likes||0)+(state.ai?.dislikes||0)+(state.ai?.visits||0)}
function rebuildLearning(){
 tasteModelCache=null;
 state.ai={likes:0,dislikes:0,visits:0,signals:{}};
 for(const [id,type] of Object.entries(state.feedback||{})){
  const r=activeRestaurant(id);if(!r||!['like','dislike','visited'].includes(type))continue;
  state.ai[type==='like'?'likes':type==='dislike'?'dislikes':'visits']++;
  const delta=type==='dislike'?-1.5:type==='visited'?2:1;
  for(const feature of restaurantFeatures(r))state.ai.signals[feature]=(state.ai.signals[feature]||0)+delta;
 }
 // Legacy cloud field stores answer completeness, never a claim of model accuracy.
 state.confidence=Math.round(100*questions.filter(q=>q.o.some(([value])=>value===state.answers?.[q.k])).length/questions.length);
}
function learn(r,type){
 feedbackRevision++;
 if(type)state.feedback[r.id]=type;else delete state.feedback[r.id];
 rebuildLearning();persist();
}

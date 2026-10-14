const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
new vm.Script(fs.readFileSync(path.join(__dirname,'../src/features/companion/controller.js'),'utf8'));
const italian={id:'a',c:['Italian'],t:['pizza'],a:['quiet'],o:['date'],p:'500_1000',s:'mild'},other={id:'b',c:['Gujarati'],t:['thali'],a:['lively'],o:['family'],p:'under_500',s:'hot'};
const state={feedback:{}},ctx=vm.createContext({state,currentUser:{id:'one'},activeRestaurant:id=>({a:italian,b:other}[id]),assert,italian,other});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/features/recommendations/learner.js'),'utf8'),ctx);
vm.runInContext(`
const candidate={...italian,id:'new'};
assert.equal(tasteModelAdjustment(candidate),0);
state.feedback.a='like';const liked=tasteModelAdjustment(candidate);assert.ok(liked>0&&liked<=6);
assert.equal(tasteModelAdjustment(italian),0);
assert.ok(tasteModelAdjustment({...other,id:'different'})<liked);
assert.equal(tasteModelAdjustment(candidate),liked);
state.feedback.a='dislike';assert.ok(tasteModelAdjustment(candidate)<0);
delete state.feedback.a;assert.equal(tasteModelAdjustment(candidate),0);
state.feedback.a='like';assert.equal(tasteModelAdjustment(candidate),liked);
currentUser={id:'two'};state.feedback={};assert.equal(tasteModelAdjustment(candidate),0);
assert.deepEqual(tasteFeatures({c:['ITALIAN','italian']}),['cuisine:italian']);
`,ctx);
console.log('PASS: cold start, similarity generalisation, negative learning, bounds, no direct-feedback double count, determinism, exact undo and account reset');

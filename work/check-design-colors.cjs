const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const styles=file=>fs.readFileSync(path.join(__dirname,'palateo_cloudflare_pages',file),'utf8');
const token=(css,name)=>Array.from(css.matchAll(new RegExp('--'+name+':\\s*(#[0-9a-fA-F]{6})','g'))).at(-1)?.[1];
const app=styles('app/theme.css'),waitlist=styles('waitlist.css');
for(const [name,value] of Object.entries({bg:'#c3e7f1',card:'#edf7fa',ink:'#20373b',muted:'#315e68',green:'#315e68',green2:'#519cab',gold:'#ffc64f','control-line':'#315e68'}))assert.equal(token(app,name),value,'App '+name+' source token');
for(const [name,value] of Object.entries({navy:'#20373b',teal:'#315159',aqua:'#ffc64f',white:'#edf7fa',soft:'#c3e7f1',moonstone:'#519cab'}))assert.equal(token(waitlist,name),value,'Waitlist '+name+' source token');
const luminance=hex=>{const c=hex.replace('#','').match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722};
const contrast=(a,b)=>{const values=[luminance(a),luminance(b)].sort((x,y)=>y-x);return (values[0]+.05)/(values[1]+.05)};
const pairs=[
 ['app text','#20373b','#c3e7f1',4.5],['app muted','#315e68','#dbeef4',4.5],
 ['saffron action','#20373b','#ffc64f',4.5],['dark navigation','#c3e7f1','#20373b',4.5],
 ['control boundary','#315e68','#edf7fa',3],['light focus','#20373b','#c3e7f1',3],
 ['dark focus','#ffc64f','#20373b',3],['map focus','#20373b','#c3e7f1',3],
 ['light copy','#315e68','#edf7fa',4.5],['moonstone avatar','#112c31','#519cab',4.5],
 ['success','#2f6251','#edf7fa',4.5],['error','#9b3f38','#edf7fa',4.5]
];
for(const [name,foreground,background,minimum] of pairs)assert.ok(contrast(foreground,background)>=minimum,name+' contrast');
console.log('PASS: shared app/waitlist palette text, action, selection, semantic and focus contrast');
module.exports={contrast};

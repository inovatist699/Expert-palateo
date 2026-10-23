function esc(s){return String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[x]))}
function toast(t){const x=document.getElementById('toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1800)}
function price(p){return ({'under_500':'Under ₹500','500_1000':'₹500–₹1,000','1000_2000':'₹1,000–₹2,000','2000_plus':'₹2,000+'})[p]||'Price varies'}
function displayPrice(r){return r.displayPrice||price(r.p)}
function getISTDate(){
  try {
    const s = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    return new Date(s);
  } catch (e) {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (330 * 60000));
  }
}
function parseTimeStr(value){
 if(typeof value!=='string')return null;
 const m=value.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
 if(!m||(!m[2]&&!m[3]))return null;
 let h=Number(m[1]);const minute=Number(m[2]||0),mer=(m[3]||'').toUpperCase();
 if(minute>59||(mer?(h<1||h>12):h>23))return null;
 if(mer==='PM'&&h<12)h+=12;if(mer==='AM'&&h===12)h=0;
 return h*60+minute;
}
function getVenueOpenStatus(r){
 const unknown={isOpen:null,statusText:'Hours unverified',timingText:'Confirm opening hours with the venue.',openTimeStr:null,closeTimeStr:null};
 const hours=r?.openTiming||r?.hours||r?.timing;
 if(typeof hours!=='string')return unknown;
 if(/^(?:open\s*)?(?:24\s*hours|24\/7)$/i.test(hours.trim()))return {isOpen:true,statusText:'Listed as open 24 hours',timingText:hours.trim(),openTimeStr:null,closeTimeStr:null};
 const parts=hours.split(/\s*[–—-]\s*|\s+to\s+/i);if(parts.length!==2)return unknown;
 const [openTimeStr,closeTimeStr]=parts.map(x=>x.trim()),openMin=parseTimeStr(openTimeStr),closeMin=parseTimeStr(closeTimeStr);
 if(openMin===null||closeMin===null||openMin===closeMin)return unknown;
 const ist=getISTDate(),now=ist.getHours()*60+ist.getMinutes();
 const isOpen=closeMin>openMin?now>=openMin&&now<closeMin:now>=openMin||now<closeMin;
 return {isOpen,statusText:isOpen?'Within listed hours · Closes '+closeTimeStr:'Outside listed hours · Opens '+openTimeStr,timingText:hours.trim()+' · Confirm with the venue',openTimeStr,closeTimeStr};
}
function formatReviewCount(count){
  const n = Number(count || 0);
  if(n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}
function titleCase(str){
  if(!str) return '';
  return String(str).split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}
function isLateNightCafe(r){
  if(!r) return false;
  const pool = [...(r.c || []), ...(r.t || [])].map(x => String(x).toLowerCase());
  const isCafeLike = pool.some(x =>
    x.includes('cafe') || x.includes('coffee') || x.includes('chai') ||
    x.includes('tea') || x.includes('bakery') || x.includes('dessert') ||
    x.includes('ice cream') || x.includes('kulfi') || x.includes('falooda') ||
    x.includes('bistro') || x.includes('beverage') || x.includes('shakes') ||
    x.includes('lounge') || x.includes('diner') || x.includes('bakes') ||
    x.includes('snack') || x.includes('patisserie')
  );
  if(!isCafeLike) return false;

  const corpus = [
    ...pool,
    ...(r.review_insights || []),
    r.why || '',
    r.hours || r.openTiming || '',
    r.name || '',
    r.area || ''
  ].join(' ').toLowerCase();

  if (/late\s*night|midnight|night\s*owl|open\s*late|after\s*hours|post[- ]midnight|wee\s*hours|24\s*hours|24\/7|night\s*market|night\s*dessert|night\s*buzz|night\s*hub|nightlife|night\s*out|night\s*food|night\s*stall|night\s*hangout|evening\s*hangout|night\s*cafe|night\s*tea|night\s*icon/i.test(corpus)) {
    return true;
  }

  const hoursStr = String(r.hours || r.openTiming || '').toLowerCase();
  if (/(?:11:30\s*pm|11:45\s*pm|12(?::\d{2})?\s*(?:am|midnight)|[1-5](?::\d{2})?\s*am|24\s*hours)/i.test(hoursStr)) {
    return true;
  }

  return false;
}

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
  let hours = r && (r.openTiming || r.hours || r.timing);
  let openTimeStr = null, closeTimeStr = null;
  let isVerified = false;

  if (typeof hours === 'string' && hours.trim()) {
    const trimmed = hours.trim();
    if (/^(?:open\s*)?(?:24\s*hours|24\/7)$/i.test(trimmed)) {
      return {
        isOpen: true,
        statusText: 'Listed as open 24 hours',
        timingText: trimmed + ' · Confirmed with venue',
        openTimeStr: '12:00 AM',
        closeTimeStr: '11:59 PM',
        isVerified: true
      };
    }
    const parts = trimmed.split(/\s*[–—-]\s*|\s+to\s+/i);
    if (parts.length === 2) {
      const [oStr, cStr] = parts.map(x => x.trim());
      const oMin = parseTimeStr(oStr), cMin = parseTimeStr(cStr);
      if (oMin !== null && cMin !== null && oMin !== cMin) {
        openTimeStr = oStr;
        closeTimeStr = cStr;
        isVerified = true;
      }
    }
  }

  // When hours are unverified or missing, make workable using IST standard dining timings
  if (!openTimeStr || !closeTimeStr) {
    const pool = [...(r?.c || []), ...(r?.t || [])].map(x => String(x).toLowerCase()).join(' ');
    const isCafe = pool.includes('cafe') || pool.includes('coffee') || pool.includes('dessert') || pool.includes('bakery') || pool.includes('tea');
    openTimeStr = isCafe ? '10:00 AM' : '11:00 AM';
    closeTimeStr = isCafe ? '11:00 PM' : '11:30 PM';
    isVerified = false;
  }

  const openMin = parseTimeStr(openTimeStr);
  const closeMin = parseTimeStr(closeTimeStr);
  const ist = getISTDate();
  const now = ist.getHours() * 60 + ist.getMinutes();
  const isOpen = closeMin > openMin ? (now >= openMin && now < closeMin) : (now >= openMin || now < closeMin);

  const statusText = isOpen ? `Open Now · Closes ${closeTimeStr}` : `Closed · Opens ${openTimeStr}`;
  const timingText = isVerified
    ? `${openTimeStr} – ${closeTimeStr} · Confirm with venue`
    : `${openTimeStr} – ${closeTimeStr} (IST) · Standard hours · Confirm with venue`;

  return {
    isOpen,
    statusText,
    timingText,
    openTimeStr,
    closeTimeStr,
    isVerified
  };
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

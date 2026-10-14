function esc(s){return String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[x]))}
function toast(t){const x=document.getElementById('toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1800)}
function price(p){return ({'under_500':'Under ₹500','500_1000':'₹500–₹1,000','1000_2000':'₹1,000–₹2,000','2000_plus':'₹2,000+'})[p]||'Price varies'}
function displayPrice(r){return r.displayPrice||price(r.p)}
function getISTDate(){
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (330 * 60000));
}
function parseTimeStr(tStr){
  if(!tStr) return null;
  const m = tStr.trim().match(/(\d+)(?::(\d+))?\s*(AM|PM)?/i);
  if(!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2] || '0', 10);
  const mer = (m[3] || '').toUpperCase();
  if(mer === 'PM' && h < 12) h += 12;
  if(mer === 'AM' && h === 12) h = 0;
  return h * 60 + min;
}
function getVenueOpenStatus(r){
  const ist = getISTDate();
  const currentMinutes = ist.getHours() * 60 + ist.getMinutes();
  let openTiming = r.openTiming || r.hours || r.timing;
  if(!openTiming){
    const pool = [...(r.c||[]), ...(r.t||[])].map(x => String(x).toLowerCase()).join(' ');
    if(pool.includes('cafe') || pool.includes('coffee') || pool.includes('dessert') || pool.includes('bakery')) {
      openTiming = '11:00 AM – 11:30 PM';
    } else {
      openTiming = '11:00 AM – 11:30 PM';
    }
  }
  const parts = openTiming.split(/[–—\-]| to /i);
  let openTimeStr = '11:00 AM', closeTimeStr = '11:30 PM';
  if(parts.length >= 2){
    openTimeStr = parts[0].trim();
    closeTimeStr = parts[1].trim();
  }
  const openMin = parseTimeStr(openTimeStr) ?? (11 * 60);
  const closeMin = parseTimeStr(closeTimeStr) ?? (23 * 60 + 30);
  let isOpen = false;
  if(closeMin > openMin){
    isOpen = currentMinutes >= openMin && currentMinutes < closeMin;
  } else {
    isOpen = currentMinutes >= openMin || currentMinutes < closeMin;
  }
  const statusText = isOpen ? `Open Now · Closes ${closeTimeStr}` : `Closed · Opens ${openTimeStr}`;
  const timingText = `${openTimeStr} – ${closeTimeStr} (${statusText})`;
  return { isOpen, statusText, timingText, openTimeStr, closeTimeStr };
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

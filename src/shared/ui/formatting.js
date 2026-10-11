function esc(s){return String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[x]))}
function toast(t){const x=document.getElementById('toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1800)}
function price(p){return ({'under_500':'Under ₹500','500_1000':'₹500–₹1,000','1000_2000':'₹1,000–₹2,000','2000_plus':'₹2,000+'})[p]||'Price varies'}
function displayPrice(r){return r.displayPrice||price(r.p)}

const form = document.getElementById('waitlist-form');
const status = document.getElementById('form-status');
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), {threshold: 0.1});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  const scene = document.querySelector('.scene');
  if (matchMedia('(pointer: fine)').matches) {
    scene.addEventListener('pointermove', event => {
      const box = scene.getBoundingClientRect();
      scene.style.setProperty('--rx', ((event.clientY - box.top) / box.height - .5) * -12 + 'deg');
      scene.style.setProperty('--ry', ((event.clientX - box.left) / box.width - .5) * 14 + 'deg');
    });
    scene.addEventListener('pointerleave', () => { scene.style.setProperty('--rx','0deg'); scene.style.setProperty('--ry','0deg'); });
  }
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('button');
  if (button.disabled) return;
  button.disabled = true; status.classList.remove('error'); status.textContent = 'Saving your seat…';
  try {
    const response = await fetch('/api/waitlist', {method:'POST', headers:{'Content-Type':'application/json'},body:JSON.stringify({email:form.email.value.trim(),city:form.city.value,consent:form.consent.checked,website:form.website.value}),signal:AbortSignal.timeout(35000)});
    if (!response.ok) throw new Error(response.status === 429 ? 'We’re getting a lot of interest. Please try again in a minute.' : 'Couldn’t save your seat. Please try again shortly.');
    status.textContent = 'You’re on the list. We’ll be in touch when Palateo opens. ✦';
    form.reset(); button.textContent = 'You’re on the list ✓';
    setTimeout(() => { button.textContent = 'Join the waitlist ↗'; button.disabled = false; }, 4000);
  } catch (error) {
    if (['TypeError','TimeoutError'].includes(error.name)) window.reportPalateoError?.('waitlist_network_failed');
    status.classList.add('error'); status.textContent = error.name === 'TimeoutError' ? 'The connection took too long. Please try again.' : error.message;
    button.disabled = false;
  }
});

const motionToggle = document.getElementById('motion-toggle');
motionToggle.addEventListener('click', () => {
 const paused = document.body.classList.toggle('motion-paused');
 motionToggle.setAttribute('aria-pressed', String(paused)); motionToggle.textContent = paused ? 'Resume motion' : 'Pause motion';
});

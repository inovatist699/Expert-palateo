const form = document.getElementById('waitlist-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const button = form.querySelector('button[type="submit"]');
  const label = button.querySelector('.submit-label');
  if (button.disabled) return;
  button.disabled = true;
  form.setAttribute('aria-busy', 'true');
  label.textContent = 'Saving your seat…';
  status.classList.remove('error');
  status.textContent = 'Adding you to the waitlist…';
  try {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: form.email.value.trim(), city: form.city.value, consent: form.consent.checked, website: form.website.value}),
      signal: AbortSignal.timeout(35000)
    });
    if (!response.ok) throw new Error(response.status === 429 ? 'Please wait a minute, then try again.' : 'We couldn’t save your seat. Please try again shortly.');
    status.textContent = 'You’re on the list. We’ll email you with Palateo launch updates.';
    form.reset();
  } catch (error) {
    if (['TypeError', 'TimeoutError'].includes(error.name)) window.reportPalateoError?.('waitlist_network_failed');
    status.classList.add('error');
    status.textContent = ['TimeoutError', 'TypeError'].includes(error.name) ? 'We couldn’t connect. Check your connection and try again.' : error.message;
  } finally {
    button.disabled = false;
    form.removeAttribute('aria-busy');
    label.textContent = 'Join the waitlist';
  }
});

const scene = document.querySelector('.scene');
const motionToggle = document.getElementById('motion-toggle');
motionToggle.addEventListener('click', () => {
  const paused = document.body.classList.toggle('motion-paused');
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.textContent = paused ? 'Resume motion' : 'Pause motion';
});
if (scene && matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  scene.addEventListener('pointermove', event => {
    if (document.body.classList.contains('motion-paused')) return;
    const box = scene.getBoundingClientRect();
    scene.style.setProperty('--rx', ((event.clientY - box.top) / box.height - .5) * -5 + 'deg');
    scene.style.setProperty('--ry', ((event.clientX - box.left) / box.width - .5) * 7 + 'deg');
  });
  scene.addEventListener('pointerleave', () => {
    scene.style.setProperty('--rx', '0deg');
    scene.style.setProperty('--ry', '0deg');
  });
}

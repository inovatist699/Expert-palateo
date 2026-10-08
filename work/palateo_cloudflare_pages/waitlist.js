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
if (motionToggle) {
  motionToggle.addEventListener('click', () => {
   const paused = document.body.classList.toggle('motion-paused');
   motionToggle.setAttribute('aria-pressed', String(paused)); motionToggle.textContent = paused ? 'Resume motion' : 'Pause motion';
  });
}

// Interactive Quiz Demo Widget Controller (Replacing Plaid UI with Taste Quiz)
(function initQuizDemo() {
  const widget = document.getElementById('interactiveQuizWidget');
  if (!widget) return;
  const demoState = { spice: 'balanced', vibe: 'speakeasy', city: 'Mumbai' };

  const cityMatches = {
    'Mumbai': { name: 'The Bombay Canteen', area: 'Lower Parel, Mumbai · Progressive Indian', score: '98%' },
    'Delhi NCR': { name: 'Indian Accent', area: 'The Lodhi, Delhi · Modern Gastronomy', score: '99%' },
    'Bengaluru': { name: 'Toit Brewpub', area: 'Indiranagar, Bengaluru · Craft Beer & Woodfired Pizza', score: '97%' },
    'Hyderabad': { name: 'Roastery Coffee House', area: 'Banjara Hills, Hyderabad · Specialty Roastery', score: '98%' },
    'Chennai': { name: 'Dakshin', area: 'Alwarpet, Chennai · Iconic Coastal & South Indian', score: '98%' },
    'Kolkata': { name: 'Peter Cat', area: 'Park Street, Kolkata · Iconic Chelo Kebab & Sizzlers', score: '97%' },
    'Pune': { name: 'Malaka Spice', area: 'Koregaon Park, Pune · Southeast Asian Eclectic', score: '96%' },
    'Ahmedabad': { name: 'Under The Neem Trees', area: 'Bodakdev, Ahmedabad · Alfresco Dining', score: '98%' },
    'Vadodara': { name: 'The Brewery at Alembic', area: 'Alembic City, Vadodara · Heritage Industrial Bistro', score: '97%' },
    'Jaipur': { name: 'Bar Palladio', area: 'Narain Niwas, Jaipur · Regal Italian & Cocktails', score: '99%' },
    'Kochi': { name: 'Kashi Art Cafe', area: 'Fort Kochi · Bohemian Art & Single-Origin Coffee', score: '96%' },
    'Goa': { name: 'Gunpowder', area: 'Assagao, Goa · Peninsular Coastal & Garden Cocktails', score: '98%' },
    'Chandigarh': { name: 'Virgin Courtyard', area: 'Sector 7, Chandigarh · Mediterranean Courtyard', score: '97%' }
  };

  const archetypes = {
    'speakeasy': { name: 'The Progressive Cocktail Explorer', desc: 'You prioritize culinary technique, ambient speakeasy energy, and craft beverage pairings.' },
    'cozy': { name: 'The Hidden Gem Connoisseur', desc: 'You love intimate courtyards, artisanal pour-overs, and low-key dining away from the crowds.' },
    'heritage': { name: 'The Heritage Culinary Devotee', desc: 'You celebrate timeless regional recipes, royal thalis, and legendary institutions with deep roots.' },
    'rooftop': { name: 'The Skyline Gastronomy Chaser', desc: 'You thrive in high-energy alfresco spaces with panoramic city views and inventive global bites.' }
  };

  function update() {
    const arch = archetypes[demoState.vibe] || archetypes.speakeasy;
    const match = cityMatches[demoState.city] || cityMatches['Mumbai'];
    const nameEl = document.getElementById('archetypeName');
    const descEl = document.getElementById('archetypeDesc');
    const venueEl = document.getElementById('matchedVenueName');
    const areaEl = document.getElementById('matchedVenueArea');
    const scoreBadge = document.querySelector('.match-score-badge');
    if (nameEl) nameEl.textContent = arch.name;
    if (descEl) descEl.textContent = arch.desc;
    if (venueEl) venueEl.textContent = match.name;
    if (areaEl) areaEl.textContent = match.area;
    if (scoreBadge) scoreBadge.textContent = match.score + ' Match';
  }

  widget.querySelectorAll('.quiz-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.parentElement;
      const group = parent.dataset.group;
      parent.querySelectorAll('.quiz-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (group === 'spice') demoState.spice = btn.dataset.spice;
      if (group === 'vibe') demoState.vibe = btn.dataset.vibe;
      if (group === 'city') demoState.city = btn.dataset.city;
      update();
    });
  });
})();

(function initLandingLogoReveal() {
  const el = document.getElementById('palateoLogoReveal');
  if (!el) return;
  let dismissTimer = null;
  function dismiss(quick) {
    if (quick && el.classList && el.classList.add) {
      el.classList.add('is-skipping');
      setTimeout(() => {
        if (el.classList && el.classList.add) el.classList.add('dismissed');
        if (el.classList && el.classList.remove) el.classList.remove('is-active', 'is-skipping', 'replaying');
      }, 260);
    } else {
      if (el.classList && el.classList.add) el.classList.add('dismissed');
      if (el.classList && el.classList.remove) el.classList.remove('is-active', 'is-skipping', 'replaying');
    }
    try { sessionStorage.setItem('palateo_revealed_v2', 'true'); } catch(e) {}
  }
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (el.classList && el.classList.add) el.classList.add('dismissed');
    return;
  }
  try {
    if (sessionStorage.getItem('palateo_revealed_v2') === 'true') {
      if (el.classList && el.classList.add) el.classList.add('dismissed');
      return;
    }
  } catch(e) {}
  if (el.classList && el.classList.add) el.classList.add('is-active');
  const skipBtn = document.getElementById('revealSkipBtn');
  if (skipBtn) skipBtn.addEventListener('click', (e) => { e.stopPropagation(); dismiss(true); });
  el.addEventListener('click', () => dismiss(true));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') dismiss(true);
  }, { once: true });
  dismissTimer = setTimeout(() => dismiss(false), 3050);
  window.replayLogoReveal = function() {
    if (!el) return;
    clearTimeout(dismissTimer);
    if (el.classList && el.classList.remove) el.classList.remove('dismissed', 'is-skipping', 'is-active', 'replaying');
    void el.offsetWidth;
    if (el.classList && el.classList.add) el.classList.add('is-active');
    dismissTimer = setTimeout(() => dismiss(false), 3050);
  };
  const brand = document.querySelector('.brand');
  if (brand) {
    brand.style.cursor = 'pointer';
    brand.title = 'Palateo - Replay intro';
    brand.addEventListener('click', (e) => {
      if (location.pathname === '/' || location.pathname === '/index.html') {
        e.preventDefault();
        window.replayLogoReveal();
      }
    });
  }
})();

/* ==========================================================================
   PALATEO CURATED FOOD TRAILS (GOOGLE AI STUDIO COMPONENT)
   - Faithfully adapted from CuratedCollectionsScreen.kt (Zest TasteTrail India)
   - Handpicked culinary journeys with Palate DNA sensory notes
   ========================================================================== */

const CURATED_FOOD_TRAILS = [
  {
    id: "craft_beer_trail",
    title: "Bengaluru Craft Breweries & Sourdough Trail",
    subtitle: "Microbreweries, rooftop sundowners, and Neapolitan bakes",
    city: "Bengaluru",
    iconEmoji: "🍺",
    tasteDescription: "Crisp craft ales, smoky woodfired sourdough, and southern spice cocktail pairings.",
    vibe: "Lively Craft Brewery",
    tags: ["Craft Beer", "Sourdough", "Rooftop"]
  },
  {
    id: "spicy_biryani_quest",
    title: "Fiery Masala & Authentic Biryani Quest",
    subtitle: "High spice tolerance only: Gongura, Dum Biryanis & Ghee Roast",
    city: "Hyderabad & Bengaluru",
    iconEmoji: "🌶️",
    tasteDescription: "Intense desi heat, pure cow ghee, green chillies, and aromatic slow-cooked dum biryani.",
    vibe: "Legendary Institution",
    tags: ["High Spice", "Ghee Roast", "Dum Biryani"]
  },
  {
    id: "aesthetic_cafes_trail",
    title: "Artisanal Pour-overs & Garden Courtyards",
    subtitle: "Chic aesthetic cafes, single-origin roasts, and quiet work spaces",
    city: "Mumbai & Bengaluru",
    iconEmoji: "☕",
    tasteDescription: "Bright single-origin coffees, handmade laminated pastries, and serene open-air courtyards.",
    vibe: "Aesthetic Courtyard",
    tags: ["Artisanal Coffee", "Single Origin", "Quiet Work"]
  },
  {
    id: "heritage_legends_trail",
    title: "Legendary Heritage Trails & Nostalgic Institutions",
    subtitle: "Over 75+ years of cult culinary heritage across India",
    city: "All India",
    iconEmoji: "🏛️",
    tasteDescription: "Authentic woodfire tandoors, secret family garam masalas, and iconic generational dining.",
    vibe: "Heritage Classic",
    tags: ["Heritage", "Iconic Institution", "Generational"]
  },
  {
    id: "coastal_seafood_safari",
    title: "Coastal Seafood & Toddy Fermentation Safari",
    subtitle: "Mangalorean squid ghee roast, Karavalli fish curry, and appam lace",
    city: "Goa & Coastal Karnataka",
    iconEmoji: "🦞",
    tasteDescription: "Tangy kokum, roasted Byadgi chillies, freshly grated coconut, and delicate steamed rice hoppers.",
    vibe: "Tropical Garden",
    tags: ["Seafood", "Kokum", "Appam"]
  }
];

function renderCuratedTrails(venues = []){
  const currentCity = cityName();
  return `
    <div class="curatedTrailsContainer">
      <div class="curatedTrailsHero">
        <div class="curatedTrailsHeader">
          <span class="curatedBadge">✨ AI Studio Collections</span>
          <h2>Curated Food Trails</h2>
          <p>Handpicked culinary journeys tailored to your taste radar in ${esc(currentCity)} and across India.</p>
        </div>
      </div>

      <div class="curatedTrailsGrid" role="feed" aria-label="Curated food trail collections">
        ${CURATED_FOOD_TRAILS.map((trail, index) => {
          // Find matching venues from current catalog if available
          const matchingVenues = venues.filter(v => {
            const pool = [v.name, v.area, v.city, ...(v.c||[]), ...(v.t||[])].join(' ').toLowerCase();
            return trail.tags.some(tag => pool.includes(tag.toLowerCase()));
          }).slice(0, 3);

          return `
            <article class="curatedTrailCard" id="trail-${trail.id}">
              <div class="trailCardTop">
                <div class="trailIcon">${trail.iconEmoji}</div>
                <div class="trailMeta">
                  <span class="trailCityBadge">${esc(trail.city)}</span>
                  <h3 class="trailTitle">${esc(trail.title)}</h3>
                  <p class="trailSubtitle">${esc(trail.subtitle)}</p>
                </div>
              </div>

              <div class="trailDnaNotes">
                <span class="trailDnaLabel">PALATE DNA SENSORY NOTES</span>
                <p class="trailDnaText">${esc(trail.tasteDescription)}</p>
              </div>

              ${matchingVenues.length ? `
                <div class="trailVenuesPreview">
                  <span class="trailVenuesTitle">Curated Stops on this trail:</span>
                  <div class="trailVenueChips">
                    ${matchingVenues.map(mv => `
                      <button type="button" class="trailVenueChip" data-action="open-place" data-rest-id="${esc(mv.id)}">
                        <span>📍 ${esc(mv.name)}</span>
                        <small>${mv.score}% match</small>
                      </button>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <div class="trailActions">
                <button type="button" class="btn secondary trailExploreBtn" data-action="apply-prompt" data-prompt="${esc(trail.title)}">
                  <span>Explore this trail</span> →
                </button>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

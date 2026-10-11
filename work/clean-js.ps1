$path = "$PSScriptRoot/palateo_cloudflare_pages/app/index.html"
$text = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# Replace any garbled text safely
$idx = $text.IndexOf('const categoryChips=')
if ($idx -gt 0) {
    $idxEnd = $text.IndexOf('return `${categoryChips}${gridHtml}`;', $idx)
    if ($idxEnd -gt 0) {
        $idxEnd += 'return `${categoryChips}${gridHtml}`;'.Length
        $before = $text.Substring(0, $idx)
        $after = $text.Substring($idxEnd)
        
        $cleanSection = @'
const categoryChips=`<div class="filterChips dishCategoryChips" role="group" aria-label="Filter dishes by category">
    <button type="button" class="filterChip ${selectedDishCategory==='all'?'active':''}" data-action="set-dish-category" data-category="all">All Dishes (${allDishes.length})</button>
    <button type="button" class="filterChip ${selectedDishCategory==='coffee'?'active':''}" data-action="set-dish-category" data-category="coffee">Coffee & Brews</button>
    <button type="button" class="filterChip ${selectedDishCategory==='bakes'?'active':''}" data-action="set-dish-category" data-category="bakes">Bakes & Sourdough</button>
    <button type="button" class="filterChip ${selectedDishCategory==='breakfast'?'active':''}" data-action="set-dish-category" data-category="breakfast">Breakfast & Brunch</button>
    <button type="button" class="filterChip ${selectedDishCategory==='mains'?'active':''}" data-action="set-dish-category" data-category="mains">Mains & Specialties</button>
    <button type="button" class="filterChip ${selectedDishCategory==='desserts'?'active':''}" data-action="set-dish-category" data-category="desserts">Desserts & Gelato</button>
  </div>`;

  if(!displayedDishes.length){
    return `${categoryChips}<div class="empty"><h2>No dishes match this category</h2><p>Switch to "All Dishes" or adjust your Palate Prompt above.</p></div>`;
  }

  const gridHtml=`<div class="dishesShowcaseGrid" aria-label="Best dishes across ${esc(cityName())}">
    ${displayedDishes.slice(0, 36).map(({dish,venue})=>`
      <article class="dishShowcaseCard">
        <div class="dishShowcaseTop">
          <div class="dishShowcaseHeader">
            <span class="dishDietBadge ${dish.dietary?.toLowerCase().includes('non-veg')?'nonVeg':dish.dietary?.toLowerCase().includes('egg')?'egg':'veg'}">●</span>
            <strong class="dishShowcaseName">${esc(dish.name)}</strong>
          </div>
          <span class="dishShowcasePrice">${esc(dish.price)}</span>
        </div>
        <p class="dishShowcaseDesc">${esc(dish.description)}</p>
        <div class="dishShowcaseVenue">
          <div class="dishShowcaseVenueInfo">
            <span class="dishVenueName">${esc(venue.name)}</span>
            <span class="dishVenueArea">${esc(venue.area||venue.city)} · ★ ${Number(venue.rating).toFixed(1)}</span>
          </div>
          <div class="dishShowcaseActions">
            <button type="button" class="btn secondary smallBtn" data-action="open-dishes-modal" data-rest-id="${esc(venue.id)}" aria-label="All dishes at ${esc(venue.name)}">All Menu →</button>
            <button type="button" class="btn green smallBtn" data-rest-action="maps" data-rest-id="${esc(venue.id)}" aria-label="Directions to ${esc(venue.name)}">Directions ↗</button>
          </div>
        </div>
      </article>
    `).join('')}
  </div>`;

  return `${categoryChips}${gridHtml}`;
'@
        $text = $before + $cleanSection + $after
        [System.IO.File]::WriteAllText($path, $text, [System.Text.Encoding]::UTF8)
        Write-Host "Cleaned categoryChips and dishesShowcaseGrid successfully!"
    }
}

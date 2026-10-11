$path = "$PSScriptRoot/palateo_cloudflare_pages/app/index.html"
$text = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$signatureSection = @'
<section class="placeSignatureDishes"><h2>Signature Dishes & Menu Highlights</h2><div class="dishesList">${resolveBestDishes(r).map(d=>`<div class="dishModalItem"><div class="dishModalItemHead"><div class="dishModalTitleRow"><span class="dishDietBadge ${d.dietary?.toLowerCase().includes('non-veg')?'nonVeg':d.dietary?.toLowerCase().includes('egg')?'egg':'veg'}">●</span><strong class="dishModalName">${esc(d.name)}</strong></div><div class="dishModalMeta"><span class="dishModalCategory">${esc(d.category)}</span><span class="dishModalPrice">${esc(d.price)}</span></div></div><p class="dishModalDesc">${esc(d.description)}</p></div>`).join('')}</div></section>
'@

if (-not $text.Contains('placeSignatureDishes')) {
    $target = '<section class="placeDishes"'
    $replacement = $signatureSection + '<section class="placeDishes"'
    $text = $text.Replace($target, $replacement)
    [System.IO.File]::WriteAllText($path, $text, [System.Text.Encoding]::UTF8)
    Write-Host "Injected placeSignatureDishes into place()."
} else {
    Write-Host "placeSignatureDishes already present."
}

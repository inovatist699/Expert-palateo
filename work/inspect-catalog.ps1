$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
# Look for getActiveCatalog or activeCatalog or venues
$idx = $appHtml.IndexOf("function getActiveCatalog")
if ($idx -ge 0) {
    Write-Host $appHtml.Substring($idx, 1500)
} else {
    Write-Host "getActiveCatalog not found!"
    # Search for allMetroVenues
    $idx2 = $appHtml.IndexOf("allMetroVenues")
    if ($idx2 -ge 0) {
        Write-Host "allMetroVenues found at $idx2"
        Write-Host $appHtml.Substring($idx2, 1000)
    }
}

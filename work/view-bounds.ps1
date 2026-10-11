$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$idx = $appHtml.IndexOf("const CITY_MAP_BOUNDS={")
Write-Host "CITY_MAP_BOUNDS at $idx"
if ($idx -ge 0) {
    Write-Host $appHtml.Substring($idx, 1200)
}

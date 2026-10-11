$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$idx = $appHtml.IndexOf("function updateCityPicker")
if ($idx -lt 0) { $idx = $appHtml.IndexOf("updateCityPicker") }
if ($idx -ge 0) {
    Write-Host $appHtml.Substring($idx - 200, 1500)
}

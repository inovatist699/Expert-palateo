$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$idx = $appHtml.IndexOf("const mapComponent=")
if ($idx -lt 0) { $idx = $appHtml.IndexOf("mapComponent") }
Write-Host "mapComponent at $idx"
if ($idx -ge 0) {
    Write-Host $appHtml.Substring($idx, 1500)
}

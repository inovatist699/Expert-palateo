$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$idx = $appHtml.IndexOf("--bg: #f9f8f5")
Write-Host "Index of '--bg: #f9f8f5' in app/index.html: $idx"
if ($idx -ge 0) {
    Write-Host $appHtml.Substring($idx, 200)
}

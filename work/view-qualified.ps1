$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$idx = $appHtml.IndexOf("function isQualifiedVenue")
if ($idx -ge 0) {
    Write-Host $appHtml.Substring($idx, 600)
} else {
    Write-Host "isQualifiedVenue not found"
}

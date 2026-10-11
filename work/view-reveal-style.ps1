$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$idx = $appHtml.IndexOf('<style id="palateo-logo-reveal-and-theme">')
if ($idx -ge 0) {
    Write-Host $appHtml.Substring($idx, [Math]::Min(2500, $appHtml.Length - $idx))
}

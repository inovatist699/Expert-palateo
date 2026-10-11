$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$idx = $appHtml.IndexOf("function go(")
Write-Host "go() at $idx"
if ($idx -ge 0) {
    Write-Host $appHtml.Substring($idx, 1200)
}

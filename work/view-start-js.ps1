$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$idx = $appHtml.IndexOf("async function start")
if ($idx -lt 0) { $idx = $appHtml.IndexOf("function start") }
if ($idx -lt 0) { $idx = $appHtml.IndexOf("init()") }
Write-Host "Start at $idx"
if ($idx -ge 0) {
    Write-Host $appHtml.Substring($idx, 1500)
}

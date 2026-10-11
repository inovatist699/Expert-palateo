$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$lines = $appHtml -split "`r?`n"
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'function onboard|function renderTaste|quiz|plaid|bank|archetype') {
        Write-Host "Line $($i+1): $($lines[$i].Trim())"
    }
}

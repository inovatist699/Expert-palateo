$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$lines = $appHtml -split "`r?`n"
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'CITY_MAP_BOUNDS') {
        Write-Host "Found at line $($i+1): $($lines[$i])"
        for ($j = $i; $j -le [Math]::Min($lines.Length - 1, $i + 16); $j++) {
            Write-Host "$($j+1): $($lines[$j])"
        }
        break
    }
}

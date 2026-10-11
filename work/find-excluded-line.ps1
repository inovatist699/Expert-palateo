$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$lines = $appHtml -split "`r?`n"
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'function isExcludedVenue') {
        Write-Host "Found at line $($i+1): $($lines[$i])"
        for ($j = [Math]::Max(0, $i - 2); $j -le [Math]::Min($lines.Length - 1, $i + 12); $j++) {
            Write-Host "$($j+1): $($lines[$j])"
        }
    }
}

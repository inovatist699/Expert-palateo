$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$lines = $appHtml -split "`r?`n"
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'function requireAuthGate') {
        Write-Host "Found at line $($i+1)"
        for ($j = $i; $j -le [Math]::Min($lines.Length - 1, $i + 10); $j++) {
            Write-Host "$($j+1): $($lines[$j])"
        }
        break
    }
}

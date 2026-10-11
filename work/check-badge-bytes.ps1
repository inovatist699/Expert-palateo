$bytes = [System.IO.File]::ReadAllBytes("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$text = [System.Text.Encoding]::UTF8.GetString($bytes)
$idx = $text.IndexOf("const badge=isVisited?")
if ($idx -ge 0) {
    $slice = $text.Substring($idx, 80)
    Write-Host "Slice: $slice"
    $sliceBytes = [System.Text.Encoding]::UTF8.GetBytes($slice)
    $hex = ($sliceBytes | ForEach-Object { '{0:X2}' -f $_ }) -join ' '
    Write-Host "Hex: $hex"
}

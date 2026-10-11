$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$idx = 0
while ($true) {
    $found = $appHtml.IndexOf("cityPicker", $idx)
    if ($found -lt 0) { break }
    Write-Host "Found 'cityPicker' at $found"
    $start = [Math]::Max(0, $found - 50)
    $len = [Math]::Min(300, $appHtml.Length - $start)
    Write-Host $appHtml.Substring($start, $len)
    Write-Host "----------------------------------"
    $idx = $found + 10
}

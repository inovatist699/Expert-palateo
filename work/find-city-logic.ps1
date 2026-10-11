$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$idx = $appHtml.IndexOf('cityPicker')
Write-Host "cityPicker at $idx"

$pattern = "pick-city|switchCity|cityName|activeCity|currentCity"
$matches = [regex]::Matches($appHtml, $pattern)
$unique = $matches | Select-Object -ExpandProperty Value -Unique
foreach ($u in $unique) {
    Write-Host "Found token: $u"
}


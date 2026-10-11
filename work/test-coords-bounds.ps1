$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")

# Extract CITY_MAP_BOUNDS from appHtml directly
$bounds = @{
  Ahmedabad = @{ minLat = 22.985; maxLat = 23.070; minLon = 72.490; maxLon = 72.605 }
  Vadodara = @{ minLat = 22.250; maxLat = 22.345; minLon = 73.125; maxLon = 73.245 }
  Mumbai = @{ minLat = 18.910; maxLat = 19.080; minLon = 72.810; maxLon = 72.860 }
  'Delhi NCR' = @{ minLat = 28.510; maxLat = 28.630; minLon = 77.140; maxLon = 77.270 }
  Bengaluru = @{ minLat = 12.920; maxLat = 12.995; minLon = 77.580; maxLon = 77.660 }
  Hyderabad = @{ minLat = 17.380; maxLat = 17.460; minLon = 78.380; maxLon = 78.520 }
  Chennai = @{ minLat = 13.010; maxLat = 13.095; minLon = 80.230; maxLon = 80.290 }
  Kolkata = @{ minLat = 22.510; maxLat = 22.590; minLon = 88.330; maxLon = 88.385 }
  Pune = @{ minLat = 18.500; maxLat = 18.555; minLon = 73.820; maxLon = 73.920 }
  Jaipur = @{ minLat = 26.875; maxLat = 26.935; minLon = 75.770; maxLon = 75.835 }
  Kochi = @{ minLat = 9.920; maxLat = 9.985; minLon = 76.220; maxLon = 76.305 }
  Goa = @{ minLat = 15.550; maxLat = 15.625; minLon = 73.720; maxLon = 73.800 }
  Chandigarh = @{ minLat = 30.710; maxLat = 30.765; minLon = 76.760; maxLon = 76.820 }
}

# Test venues in allMetroVenues
$pattern = "\{id:'([^']+)',name:'([^']+)',[^}]*city:'([^']+)',latitude:([0-9.]+),longitude:([0-9.]+)"
$matches = [regex]::Matches($appHtml, $pattern)
Write-Host "Matched venues with coords: $($matches.Count)"
foreach ($m in $matches) {
    $id = $m.Groups[1].Value
    $name = $m.Groups[2].Value
    $city = $m.Groups[3].Value
    $lat = [double]$m.Groups[4].Value
    $lon = [double]$m.Groups[5].Value

    if ($bounds.ContainsKey($city)) {
        $b = $bounds[$city]
        $clamped = $false
        if ($lat -lt $b.minLat -or $lat -gt $b.maxLat) { $clamped = $true }
        if ($lon -lt $b.minLon -or $lon -gt $b.maxLon) { $clamped = $true }
        if ($clamped) {
            Write-Warning "Clamped: $name ($city) at lat=$lat (range $($b.minLat)-$($b.maxLat)), lon=$lon (range $($b.minLon)-$($b.maxLon))"
        }
    }
}

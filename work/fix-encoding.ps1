$path = "$PSScriptRoot/palateo_cloudflare_pages/app/index.html"
$bytes = [System.IO.File]::ReadAllBytes($path)
$text = [System.Text.Encoding]::UTF8.GetString($bytes)

# Replace common UTF-8 mojibake patterns
$map = @{
    'Â·' = '·'
    'â˜…' = '★'
    'â­ ' = '⭐'
    'â†’' = '→'
    'â™¥' = '♥'
    'â™¡' = '♡'
    'âœ“' = '✓'
    'â†—' = '↗'
    'â— ' = '●'
    'â‚¹' = '\u20B9'
    'Ã©' = 'e'
    'Ã¨' = 'e'
}

foreach ($key in $map.Keys) {
    $text = $text.Replace($key, $map[$key])
}

[System.IO.File]::WriteAllText($path, $text, [System.Text.Encoding]::UTF8)
Write-Host "Cleaned all mojibake in $path"

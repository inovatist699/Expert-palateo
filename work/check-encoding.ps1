$bytes = [System.IO.File]::ReadAllBytes("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$textUtf8 = [System.Text.Encoding]::UTF8.GetString($bytes)
$countRepl = ([regex]::Matches($textUtf8, [char]0xFFFD)).Count
Write-Host "U+FFFD count in app/index.html (UTF8): $countRepl"
$countQ = ([regex]::Matches($textUtf8, '')).Count
Write-Host "'' literal count in app/index.html: $countQ"

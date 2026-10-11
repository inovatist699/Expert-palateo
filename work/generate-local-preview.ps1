$indexPath = "$PSScriptRoot/palateo_cloudflare_pages/app/index.html"
$localPreviewPath = "$PSScriptRoot/palateo_cloudflare_pages/app/local-preview.html"

$content = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)

# Convert root-relative paths to relative paths for direct file:/// browsing
$content = $content.Replace('href="/app/theme.css"', 'href="theme.css"')
$content = $content.Replace('href="/favicon.svg"', 'href="../favicon.svg"')
$content = $content.Replace('src="/monitoring.js"', 'src="../monitoring.js"')

[System.IO.File]::WriteAllText($localPreviewPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "Generated standalone local preview file at $localPreviewPath"

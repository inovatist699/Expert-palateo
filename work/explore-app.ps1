$html = [System.IO.File]::ReadAllText("$PSScriptRoot/palateo_cloudflare_pages/app/index.html")

$idx = $html.IndexOf('const viewTabs=')
if ($idx -gt 0) {
    Write-Host $html.Substring($idx, 1500)
}
















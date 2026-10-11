$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$matches = [regex]::Matches($appHtml, '<style([^>]*)>')
foreach ($m in $matches) {
    Write-Host "Style tag: $($m.Value) at index $($m.Index)"
}

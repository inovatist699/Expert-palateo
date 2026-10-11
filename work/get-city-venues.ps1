$appHtml = [System.IO.File]::ReadAllText("c:/Users/Aayush/Documents/ChatGPT/Palateo/work/palateo_cloudflare_pages/app/index.html")
$idxStart = $appHtml.IndexOf("const vadodaraCatalog=[")
if ($idxStart -ge 0) {
    $idxEnd = $appHtml.IndexOf("];", $idxStart)
    $sub = $appHtml.Substring($idxStart, $idxEnd - $idxStart + 2)
    $matches = [regex]::Matches($sub, "name:\s*'([^']+)'[^}]*area:\s*'([^']+)'")
    Write-Host "Vadodara venues: $($matches.Count)"
    $matches | ForEach-Object { Write-Host "  - $($_.Groups[1].Value) ($($_.Groups[2].Value))" }
}

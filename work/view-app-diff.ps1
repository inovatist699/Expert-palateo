$diff = git diff --no-color work/palateo_cloudflare_pages/app/index.html
Write-Host "app/index.html diff lines: $($diff.Length)"
$diff | Select-Object -First 100 | ForEach-Object { Write-Host $_ }

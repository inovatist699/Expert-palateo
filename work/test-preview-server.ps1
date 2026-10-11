$serverJob = Start-Job -FilePath "$PSScriptRoot/start-preview.ps1" -ArgumentList 8099
Start-Sleep -Seconds 2
try {
    $res = Invoke-WebRequest -Uri 'http://127.0.0.1:8099/app/' -UseBasicParsing -TimeoutSec 3
    Write-Host "HTTP Status: $($res.StatusCode) | Content length: $($res.Content.Length)"
    if ($res.Content.Contains('Gemini-Palate-1.5')) {
        Write-Host "PASS: Found Gemini-Palate-1.5 in preview response!" -ForegroundColor Green
    }
    if ($res.Content.Contains('BEST_DISHES_REGISTRY')) {
        Write-Host "PASS: Found BEST_DISHES_REGISTRY in preview response!" -ForegroundColor Green
    }
    if ($res.Content.Contains('cardBestDishes')) {
        Write-Host "PASS: Found cardBestDishes in preview response!" -ForegroundColor Green
    }
} finally {
    Stop-Job $serverJob
    Remove-Job $serverJob
}

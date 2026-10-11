$c = [System.IO.File]::ReadAllText('C:\Users\Aayush\.gemini\antigravity\brain\026bc6b2-5188-48b9-bb96-44afe40f48e6\.system_generated\steps\25\content.md')
Write-Host "Total length: $($c.Length)"
$lines = $c -split "`r?`n"
Write-Host "Total lines: $($lines.Length)"
Write-Host "=== First 20 lines ==="
$lines[0..19] | ForEach-Object { Write-Host $_ }
Write-Host "=== Last 20 lines ==="
$lines[($lines.Length - 20)..($lines.Length - 1)] | ForEach-Object { Write-Host $_ }


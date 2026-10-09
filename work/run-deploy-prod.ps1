$nodeBin = "C:\Users\Aayush\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
$env:PATH = "$nodeBin;$env:PATH"
Write-Host "Running deploy-prod.cjs with node $($nodeBin)\node.exe..."
& "$nodeBin\node.exe" "$PSScriptRoot\deploy-prod.cjs"

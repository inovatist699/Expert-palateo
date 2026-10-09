$nodeBin = "C:\Users\Aayush\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
$env:PATH = "$nodeBin;$env:PATH"
& "$nodeBin\node.exe" "$PSScriptRoot\check-palateo-live.cjs"

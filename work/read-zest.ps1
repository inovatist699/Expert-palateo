$path = 'C:\Users\Aayush\.gemini\antigravity\brain\2eb8a45d-205f-44b9-9786-0cd9ea58375d\.system_generated\steps\23\content.md'
$t = [System.IO.File]::ReadAllText($path)
$styleEnd = $t.LastIndexOf('</style>')
Write-Host "Style end at: $styleEnd, total length: $($t.Length)"
if ($styleEnd -gt 0) {
    Write-Host "Characters after style: $($t.Length - $styleEnd)"
    Write-Host $t.Substring($styleEnd, [Math]::Min(3000, $t.Length - $styleEnd))
} else {
    Write-Host "No </style> tag found"
}




# Local HTTP server using native .NET HttpListener (no node/python required)
param([int]$Port = 8080)

$root = (Resolve-Path "$PSScriptRoot/palateo_cloudflare_pages").Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$Port/")

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host " Palateo Local Preview Server is LIVE! " -ForegroundColor Green
    Write-Host " URL: http://127.0.0.1:$Port/app/ " -ForegroundColor Yellow
    Write-Host " Waitlist: http://127.0.0.1:$Port/ " -ForegroundColor Yellow
    Write-Host " Serving files from: $root " -ForegroundColor Gray
    Write-Host " Press Ctrl+C in this terminal to stop the preview server. " -ForegroundColor Cyan
    Write-Host "==========================================================" -ForegroundColor Cyan

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        $rawUrl = $req.RawUrl
        $path = $rawUrl.Split('?')[0]
        if ($path.EndsWith('/')) { $path += 'index.html' }
        if ($path -eq '' -or $path -eq '/') { $path = '/index.html' }

        $localPath = [System.IO.Path]::Combine($root, $path.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar))

        if ([System.IO.File]::Exists($localPath)) {
            $ext = [System.IO.Path]::GetExtension($localPath).ToLowerInvariant()
            $mime = switch ($ext) {
                '.html' { 'text/html; charset=utf-8' }
                '.css'  { 'text/css; charset=utf-8' }
                '.js'   { 'application/javascript; charset=utf-8' }
                '.json' { 'application/json; charset=utf-8' }
                '.svg'  { 'image/svg+xml' }
                '.png'  { 'image/png' }
                '.jpg'  { 'image/jpeg' }
                '.jpeg' { 'image/jpeg' }
                default { 'application/octet-stream' }
            }
            $res.ContentType = $mime
            $res.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")

            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $res.OutputStream.Write($msg, 0, $msg.Length)
        }
        $res.OutputStream.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}

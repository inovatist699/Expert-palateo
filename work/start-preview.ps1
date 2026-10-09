# Robust Local HTTP server using native .NET HttpListener
param([int]$Port = 8080)

$root = (Resolve-Path "$PSScriptRoot/palateo_cloudflare_pages").Path
$listener = New-Object System.Net.HttpListener

# Bind 127.0.0.1 and localhost
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
try {
    $listener.Prefixes.Add("http://localhost:$Port/")
} catch {
    # localhost prefix may require admin URL reservation on some machines; 127.0.0.1 always succeeds
}

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host " Palateo Local Preview Server is LIVE! " -ForegroundColor Green
    Write-Host " Primary App URL: http://127.0.0.1:$Port/app/ " -ForegroundColor Yellow
    Write-Host " Localhost URL:   http://localhost:$Port/app/ " -ForegroundColor Yellow
    Write-Host " Waitlist URL:    http://127.0.0.1:$Port/ " -ForegroundColor Yellow
    Write-Host " Serving files from: $root " -ForegroundColor Gray
    Write-Host " Press Ctrl+C in this terminal to stop the preview server. " -ForegroundColor Cyan
    Write-Host "==========================================================" -ForegroundColor Cyan

    while ($listener.IsListening) {
        $res = $null
        try {
            $context = $listener.GetContext()
            $req = $context.Request
            $res = $context.Response

            $method = $req.HttpMethod
            $rawUrl = $req.RawUrl
            $path = $rawUrl.Split('?')[0]

            # Common CORS headers
            $res.Headers.Add("Access-Control-Allow-Origin", "*")
            $res.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")

            # Handle OPTIONS preflight
            if ($method -eq 'OPTIONS') {
                $res.StatusCode = 204
                $res.Headers.Add("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
                $res.Headers.Add("Access-Control-Allow-Headers", "*")
                $res.ContentLength64 = 0
                $res.Close()
                continue
            }

            # Normalize root and folder paths
            if ($path -eq '' -or $path -eq '/') { 
                $path = '/index.html' 
            } elseif ($path -eq '/app') {
                $res.StatusCode = 301
                $res.RedirectLocation = "/app/"
                $res.Headers.Add("Location", "/app/")
                $res.ContentLength64 = 0
                $res.Close()
                continue
            } elseif ($path -eq '/app/') {
                $path = '/app/index.html'
            }

            $localPath = [System.IO.Path]::Combine($root, $path.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar))

            if ([System.IO.Directory]::Exists($localPath)) {
                $idx = [System.IO.Path]::Combine($localPath, "index.html")
                if ([System.IO.File]::Exists($idx)) { $localPath = $idx }
            }

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
                    '.webp' { 'image/webp' }
                    '.ico'  { 'image/x-icon' }
                    '.woff' { 'font/woff' }
                    '.woff2'{ 'font/woff2' }
                    '.ttf'  { 'font/ttf' }
                    default { 'application/octet-stream' }
                }
                $res.ContentType = $mime
                $res.StatusCode = 200

                $bytes = [System.IO.File]::ReadAllBytes($localPath)
                $res.ContentLength64 = $bytes.Length

                # Only write body for non-HEAD requests
                if ($method -ne 'HEAD') {
                    $res.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $res.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
                $res.ContentType = "text/plain; charset=utf-8"
                $res.ContentLength64 = $msg.Length

                if ($method -ne 'HEAD') {
                    $res.OutputStream.Write($msg, 0, $msg.Length)
                }
            }
            $res.Close()
        } catch {
            Write-Warning "Request processing error: $_"
        } finally {
            if ($res -ne $null) {
                try { $res.Close() } catch {}
            }
        }
    }
} catch {
    Write-Error "Server fatal error: $_"
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}

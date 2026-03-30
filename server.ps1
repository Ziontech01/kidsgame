$port = if ($env:PORT) { $env:PORT } else { 5500 }
$root = $PSScriptRoot

$mimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".ico"  = "image/x-icon"
  ".svg"  = "image/svg+xml"
  ".json" = "application/json"
  ".gif"  = "image/gif"
  ".woff" = "font/woff"
  ".woff2"= "font/woff2"
  ".mp3"  = "audio/mpeg"
  ".wav"  = "audio/wav"
}

# Use raw TcpListener instead of HttpListener to avoid
# the .NET ProtocolViolationException / ContentLength bug.
$tcp = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
$tcp.Start()
Write-Host "Serving $root on http://localhost:$port"

while ($true) {
  try {
    $client = $tcp.AcceptTcpClient()
    $stream = $client.GetStream()
    $stream.ReadTimeout  = 5000
    $stream.WriteTimeout = 5000

    # Read the raw HTTP request (just need the first line for the path)
    $buf = New-Object byte[] 4096
    $n   = $stream.Read($buf, 0, $buf.Length)
    if ($n -eq 0) { $client.Close(); continue }

    $raw         = [System.Text.Encoding]::UTF8.GetString($buf, 0, $n)
    $requestLine = ($raw -split "`r`n")[0]          # e.g. "GET /index.html HTTP/1.1"
    $parts       = $requestLine -split ' '
    $path        = if ($parts.Length -ge 2) { $parts[1] } else { "/" }
    if ($path -eq "/" -or $path -eq "") { $path = "/index.html" }

    # Strip query string
    $path = ($path -split '\?')[0]

    # Resolve file on disk
    $rel  = $path.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
    $file = Join-Path $root $rel

    if ((Test-Path $file -PathType Leaf)) {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ext   = [System.IO.Path]::GetExtension($file).ToLower()
      $mime  = if ($mimeTypes[$ext]) { $mimeTypes[$ext] } else { "application/octet-stream" }
      $hdr   = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`nCache-Control: no-cache`r`n`r`n"
    } else {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
      $hdr   = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
    }

    $hdrBytes = [System.Text.Encoding]::ASCII.GetBytes($hdr)
    $stream.Write($hdrBytes, 0, $hdrBytes.Length)
    $stream.Write($bytes,    0, $bytes.Length)
    $stream.Flush()
    $client.Close()

  } catch {
    Write-Host "Error: $_"
    try { $client.Close() } catch {}
  }
}

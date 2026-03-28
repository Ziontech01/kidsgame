$port = if ($env:PORT) { $env:PORT } else { 5500 }
$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving $root on http://localhost:$port"

$mimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".ico"  = "image/x-icon"
  ".svg"  = "image/svg+xml"
  ".json" = "application/json"
}

while ($listener.IsListening) {
  $ctx  = $listener.GetContext()
  $req  = $ctx.Request
  $res  = $ctx.Response
  $path = $req.Url.LocalPath
  if ($path -eq "/" -or $path -eq "") { $path = "/index.html" }
  $file = Join-Path $root $path.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)

  # Disable keep-alive so connection closes after each response,
  # removing any dependency on ContentLength being declared upfront.
  $res.KeepAlive = $false

  try {
    if (Test-Path $file -PathType Leaf) {
      $ext   = [System.IO.Path]::GetExtension($file)
      $mime  = if ($mimeTypes[$ext]) { $mimeTypes[$ext] } else { "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $res.StatusCode      = 200
      $res.ContentType     = $mime
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $res.StatusCode      = 404
      $res.ContentType     = "text/plain"
      $res.ContentLength64 = $msg.Length
      $res.OutputStream.Write($msg, 0, $msg.Length)
    }
  } catch {
    Write-Host "Error serving $path : $_"
    try { $res.Abort() } catch {}
  } finally {
    try { $res.OutputStream.Close() } catch {}
  }
}

try {
  $resp = Invoke-WebRequest -Uri 'http://localhost:5219/api/yeu-thich' -TimeoutSec 5 -UseBasicParsing
  Write-Host "Status: $($resp.StatusCode)"
  Write-Host "Body: $($resp.Content)"
} catch {
  Write-Host "Error: $($_.Exception.Message)"
}
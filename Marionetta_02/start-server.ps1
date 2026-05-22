$port = 8000
$root = Split-Path -Parent $PSCommandPath
cd $root
Write-Host "Server su http://localhost:$port"
Write-Host "Apri il browser e vai su http://localhost:$port"
Start-Process "http://localhost:$port/index.html"
python -m http.server $port
pause

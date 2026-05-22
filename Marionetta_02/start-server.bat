@echo off
cd /d "%~dp0"
echo Avvio server su http://localhost:8000
echo Apri il browser e vai su http://localhost:8000
echo Premi CTRL+C per fermare il server
echo.
C:\Users\Mario Paolino\AppData\Local\Programs\Python\Python313\python.exe -m http.server 8000 --bind 127.0.0.1
echo.
echo Il server non si e' avviato. Premi un tasto.
pause

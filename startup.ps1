wt --window 0 -p "Windows Powershell" -d "$pwd" powershell -noExit "npm run dev"
wt --window 0 -p "Windows Powershell" -d "$pwd" powershell -noExit "(.\backend\backend_venv\Scripts\Activate.ps1) -OR (cd .\backend\) -OR (python server.py)"
# Start up the next js project
wt --window 0 -p "Windows Powershell" -d "$pwd" powershell -noExit "npm run dev"

# Start up the local flask server
wt --window 0 -p "Windows Powershell" -d "$pwd" powershell -noExit "(.\backend\backend_venv\Scripts\Activate.ps1) -OR (cd .\backend\) -OR (python server.py)"
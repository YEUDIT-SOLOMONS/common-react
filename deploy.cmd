@echo off
cd /d "%~dp0"
echo === Building ===
call npm run build || goto :error
echo === Deploying ===
call npx --yes firebase-tools deploy --only hosting --project rent-photo || goto :error
echo.
echo Done: https://common-react-714c4.web.app
pause
exit /b 0
:error
echo.
echo Something failed - see the messages above.
pause
exit /b 1

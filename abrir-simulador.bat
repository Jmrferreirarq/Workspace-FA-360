@echo off
echo ========================================
echo   FA-360 - Abrir Simulador
echo ========================================
echo.
echo Abrindo simulador no navegador...
echo URL: http://localhost:3000/calculator#/calculator
echo.

start http://localhost:3000/calculator#/calculator

echo.
echo Navegador aberto!
echo Se o servidor nao estiver a correr, execute: start-server.bat
echo.
pause

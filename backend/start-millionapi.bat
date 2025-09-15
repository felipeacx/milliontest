@echo off
echo Stopping any existing API processes...
taskkill /f /im RealEstate.API.exe 2>nul
taskkill /f /im millionapi.exe 2>nul

echo Starting Million API...
dotnet run

pause
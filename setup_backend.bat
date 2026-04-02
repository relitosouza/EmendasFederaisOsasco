@echo off
echo [1/2] Instalando dependencias do Python...
pip install -r backend/requirements.txt
if %errorlevel% neq 0 (
    echo ERRO: Pip nao encontrado ou erro na instalacao. Verifique se o Python esta no PATH.
    pause
    exit /b %errorlevel%
)
echo [2/2] Sucesso! Agora voce pode rodar o backend.
pause

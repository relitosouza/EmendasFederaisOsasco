@echo off
echo Iniciando Servidor Portal das Emendas...
cd backend
python main.py
if %errorlevel% neq 0 (
    echo [INFO] Tentando com o comando 'py'...
    py main.py
)
if %errorlevel% neq 0 (
    echo [ERRO] O servidor nao conseguiu subir. Verifique se o Python esta instalado ou se a porta 8000 esta em uso.
)
pause

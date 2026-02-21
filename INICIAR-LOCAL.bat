@echo off
echo ========================================
echo DFC Analyzer - Iniciar Local
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Verificando Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo.
    echo Por favor, instale o Node.js:
    echo https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo Node.js encontrado!
node --version
echo.

echo [2/3] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERRO ao instalar dependencias!
    pause
    exit /b 1
)
echo.

echo [3/3] Iniciando servidor...
echo.
echo ========================================
echo Servidor rodando em:
echo http://localhost:3060
echo ========================================
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

call npm run dev

pause

@echo off
echo Starting Prisma Database Server...
start "Prisma Dev DB" cmd /k "npx prisma dev"

echo Waiting for database to initialize before seeding...
timeout /t 5 /nobreak > nul
echo Seeding the database with your new products...
call npx prisma db seed

echo Starting Next.js Development Server...
start "Next.js Server" cmd /k "npm run dev"

echo.
echo Both services are starting up in separate windows!
echo You can view your website at http://localhost:3000 once it is ready.
echo.
pause

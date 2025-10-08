@echo off
echo 🚀 Creating MongoDB Backup Files
echo ================================
echo.

echo 📄 Creating JSON backup...
mongosh "mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db" --eval "db.restaurants.find().forEach(printjson)" > backup-restaurants.json

echo 📊 Creating CSV backup...
copy restaurants.csv backup-restaurants.csv

echo 🗃️ Creating MongoDB dump...
mongodump --uri "mongodb+srv://melanyriveralores:hola1234@cluster0.tz1hgep.mongodb.net/tattler-db" --collection restaurants --out backup-dump

echo.
echo ✅ Backup files created:
echo    - backup-restaurants.json (JSON format)
echo    - backup-restaurants.csv (CSV format)  
echo    - backup-dump/ (MongoDB dump folder)
echo.
pause
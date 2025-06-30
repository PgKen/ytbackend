#!/bin/bash

# -----------------------------
# Deploy script for ytbackend
# -----------------------------
# ปรับ APP_DIR ให้ตรงกับ path จริงบน server
APP_DIR="$(cd "$(dirname "$0")" && pwd)"
NODE_ENV="production"

cd "$APP_DIR" || exit 1

echo "[1] ติดตั้ง dependencies (production only)"
npm install --production

# ตรวจสอบ .env
if [ ! -f .env ]; then
  echo "[2] ไม่พบไฟล์ .env กรุณาสร้างไฟล์ .env ก่อน deploy"
  exit 1
fi

echo "[3] Restart ด้วย PM2 (ถ้ามี ecosystem.config.js)"
if [ -f ecosystem.config.js ]; then
  npx pm2 startOrReload ecosystem.config.js --env production
else
  npx pm2 restart index.js --name ytbackend || npx pm2 start index.js --name ytbackend
fi

echo "[4] ตรวจสอบสถานะ PM2"
npx pm2 status

echo "Deploy เสร็จสมบูรณ์!"

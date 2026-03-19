#!/bin/bash
# deploy-backend.sh
# Idempotent script to deploy the backend on AWS EC2

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting Backend Deployment..."

# 0. Idempotent System Dependencies Installation (Git, Node.js)
if ! command -v git &> /dev/null || ! command -v npm &> /dev/null
then
    echo "Installing System Dependencies (Git, Node.js)..."
    if command -v dnf &> /dev/null; then
        sudo dnf install -y git nodejs
    elif command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y git nodejs npm
    fi
fi

# 1. Idempotent directory creation
mkdir -p ~/shopsmart

# 2. Idempotent repository setup (Clone or Pull)
cd ~/shopsmart
if [ ! -d ".git" ]; then
  echo "Cloning repository..."
  git clone https://github.com/Raman-Luhach/shopsmart.git .
else
  echo "Pulling latest changes..."
  git checkout -- .
  git pull origin main
fi

# 3. Idempotent dependency installation
cd server
echo "Installing backend dependencies..."
npm ci

# 4. Idempotent environment setup for PM2
if ! command -v pm2 &> /dev/null
then
    echo "PM2 could not be found, installing globally..."
    sudo npm install -g pm2
fi

# 5. Idempotent service start/restart
echo "Deploying backend service..."
# Try to restart, if it fails (not running), then start it
pm2 restart shopsmart-backend || pm2 start src/index.js --name "shopsmart-backend"
pm2 save

echo "Backend deployment completed successfully!"

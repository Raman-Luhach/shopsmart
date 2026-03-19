#!/bin/bash
# deploy-backend.sh
# Idempotent script to deploy the backend on AWS EC2

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting Backend Deployment..."

# 1. Idempotent System Dependencies Installation (Node.js)
if ! command -v npm &> /dev/null
then
    echo "Node.js not found. Installing..."
    if command -v dnf &> /dev/null; then
        sudo dnf install -y nodejs
    elif command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y nodejs npm
    fi
fi

# 2. Idempotent dependency installation
cd ~/shopsmart/server
echo "Installing backend dependencies..."
npm ci

# 3. Idempotent environment setup for PM2
if ! command -v pm2 &> /dev/null
then
    echo "PM2 not found, installing globally..."
    sudo npm install -g pm2
fi

# 4. Idempotent service start/restart
echo "Deploying backend service..."
pm2 restart shopsmart-backend || pm2 start src/index.js --name "shopsmart-backend"
pm2 save

echo "Backend deployment completed successfully!"

#!/bin/bash
# deploy-frontend.sh
# Idempotent script to deploy the frontend on AWS EC2

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting Frontend Deployment..."

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

# 2. Idempotent dependency installation & build
cd ~/shopsmart/client
echo "Installing frontend dependencies..."
npm ci

echo "Building frontend for production..."
export VITE_API_URL=$VITE_API_URL
npm run build

# 3. Idempotent environment setup for Serving Static Files
if ! command -v serve &> /dev/null
then
    echo "serve not found, installing globally..."
    sudo npm install -g serve
fi

if ! command -v pm2 &> /dev/null
then
    echo "PM2 not found, installing globally..."
    sudo npm install -g pm2
fi

# 4. Idempotent service start/restart
echo "Deploying frontend service (serve on port 5173)..."
pm2 restart shopsmart-frontend || pm2 start serve --name "shopsmart-frontend" -- -s dist -l 5173
pm2 save

echo "Frontend deployment completed successfully!"

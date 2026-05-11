#!/bin/bash

# Configuration
PROJECT_DIR="/home/irfanras/service-tap"
LOG_FILE="$PROJECT_DIR/deployment.log"

echo "------------------------------------------" >> $LOG_FILE
echo "Deployment started at: $(date)" >> $LOG_FILE

# Navigate to project directory
cd $PROJECT_DIR || { echo "Failed to navigate to project directory" >> $LOG_FILE; exit 1; }

# Activate cPanel Node.js Environment
source /home/irfanras/nodevenv/service-tap/20/bin/activate && cd $PROJECT_DIR

# Pull latest changes
echo "Pulling latest changes from main..." >> $LOG_FILE
git fetch --all >> $LOG_FILE 2>&1
git reset --hard origin/main >> $LOG_FILE 2>&1

# Copy pre-built files to server's public folder
echo "Updating public folder from client/dist..." >> $LOG_FILE
cp -r client/dist/* public/ >> $LOG_FILE 2>&1

# Install any new server dependencies
echo "Installing server dependencies..." >> $LOG_FILE
cd $PROJECT_DIR/server && npm install --production >> $LOG_FILE 2>&1
cd $PROJECT_DIR

# Restart the Node.js app (cPanel Passenger method)
echo "Restarting Node.js app..." >> $LOG_FILE
mkdir -p $PROJECT_DIR/tmp
touch $PROJECT_DIR/tmp/restart.txt >> $LOG_FILE 2>&1

# Also try PM2 if it's available
if command -v pm2 &> /dev/null; then
  pm2 restart all >> $LOG_FILE 2>&1
fi

echo "Deployment finished at: $(date)" >> $LOG_FILE
echo "------------------------------------------" >> $LOG_FILE

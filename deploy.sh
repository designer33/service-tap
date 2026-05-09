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
git pull origin main >> $LOG_FILE 2>&1

# Build Client (Skipped on server, using local build)
# echo "Building client..." >> $LOG_FILE
# cd client || exit 1
# npm install >> $LOG_FILE 2>&1
# npm run build >> $LOG_FILE 2>&1

# Copy pre-built files to server's public folder
echo "Updating public folder from client/dist..." >> $LOG_FILE
cp -r client/dist/* public/ >> $LOG_FILE 2>&1
cp -r client/public/* public/ >> $LOG_FILE 2>&1

echo "Deployment finished at: $(date)" >> $LOG_FILE
echo "------------------------------------------" >> $LOG_FILE

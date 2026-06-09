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

# public/ is committed to git — git reset already updated it.
# No cp needed; avoids overwriting new bundles with stale client/dist files.

# Install root dependencies
echo "Installing root dependencies..." >> $LOG_FILE
cd $PROJECT_DIR && npm install --production >> $LOG_FILE 2>&1

# Install server dependencies
echo "Installing server dependencies..." >> $LOG_FILE
cd $PROJECT_DIR/server && npm install --production >> $LOG_FILE 2>&1
cd $PROJECT_DIR

# Run database connectivity diagnostics
echo "Running database connectivity diagnostics..." >> $LOG_FILE
NODE_BIN="/home/irfanras/nodevenv/service-tap/20/bin/node"
if [ -f "$NODE_BIN" ]; then
  $NODE_BIN $PROJECT_DIR/server/test_connectivity.js >> $LOG_FILE 2>&1
else
  node $PROJECT_DIR/server/test_connectivity.js >> $LOG_FILE 2>&1
fi

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

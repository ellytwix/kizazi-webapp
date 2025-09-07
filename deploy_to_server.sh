#!/bin/bash

# Kizazi Social Media Platform - Server Deployment Script
# This script updates the server with the latest code changes

echo "🚀 Starting Kizazi Social Media Platform deployment..."

# Set variables
SERVER_USER="root"
SERVER_HOST="srv944928.ssh.ssh-cloud.com"
SERVER_PATH="/var/www/kizazi"
BACKUP_PATH="/var/www/kizazi-backup-$(date +%Y%m%d_%H%M%S)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Deployment Information:${NC}"
echo "Server: $SERVER_HOST"
echo "Path: $SERVER_PATH"
echo "Backup: $BACKUP_PATH"
echo ""

# Function to run commands on server
run_ssh() {
    ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "$1"
}

# Function to check if command was successful
check_success() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1 failed${NC}"
        exit 1
    fi
}

echo -e "${YELLOW}🔄 Step 1: Creating backup of current deployment...${NC}"
run_ssh "cp -r $SERVER_PATH $BACKUP_PATH"
check_success "Backup created"

echo -e "${YELLOW}🔄 Step 2: Pulling latest code from repository...${NC}"
run_ssh "cd $SERVER_PATH && git pull origin main"
check_success "Code updated from repository"

echo -e "${YELLOW}🔄 Step 3: Installing/updating dependencies...${NC}"
run_ssh "cd $SERVER_PATH && npm install"
check_success "Dependencies updated"

echo -e "${YELLOW}🔄 Step 4: Building frontend...${NC}"
run_ssh "cd $SERVER_PATH && npm run build"
check_success "Frontend built successfully"

echo -e "${YELLOW}🔄 Step 5: Copying built files to web directory...${NC}"
run_ssh "sudo cp -r $SERVER_PATH/dist/* /var/www/html/kizazi-webapp/dist/"
check_success "Frontend files deployed"

echo -e "${YELLOW}🔄 Step 6: Setting correct permissions...${NC}"
run_ssh "sudo chown -R www-data:www-data /var/www/html/kizazi-webapp/dist/"
check_success "Permissions set"

echo -e "${YELLOW}🔄 Step 7: Restarting backend services...${NC}"
run_ssh "cd $SERVER_PATH/server && pm2 restart kizazi-backend"
check_success "Backend restarted"

echo -e "${YELLOW}🔄 Step 8: Testing backend health...${NC}"
run_ssh "curl -s https://www.kizazisocial.com/api/health | head -1"
check_success "Backend health check"

echo -e "${YELLOW}🔄 Step 9: Reloading Nginx configuration...${NC}"
run_ssh "sudo nginx -t && sudo systemctl reload nginx"
check_success "Nginx reloaded"

echo -e "${YELLOW}🔄 Step 10: Checking service status...${NC}"
run_ssh "pm2 status"
run_ssh "sudo systemctl status nginx --no-pager -l"

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo "✅ Code updated from repository"
echo "✅ Dependencies installed"
echo "✅ Frontend built and deployed"
echo "✅ Backend services restarted"
echo "✅ Nginx configuration reloaded"
echo "✅ All services are running"
echo ""
echo -e "${BLUE}🌐 Your updated application is now live at:${NC}"
echo "https://www.kizazisocial.com"
echo ""
echo -e "${BLUE}📱 New Features Deployed:${NC}"
echo "• Interactive calendar with clickable dates"
echo "• Instagram-style analytics dashboard"
echo "• Photo and video upload functionality"
echo "• Enhanced post scheduling system"
echo "• Mobile-responsive design"
echo ""
echo -e "${YELLOW}💡 If you encounter any issues, you can restore from backup:${NC}"
echo "ssh $SERVER_USER@$SERVER_HOST 'sudo cp -r $BACKUP_PATH/* $SERVER_PATH/'"

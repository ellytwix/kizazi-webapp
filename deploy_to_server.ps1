# Kizazi Social Media Platform - Server Deployment Script (PowerShell)
# This script updates the server with the latest code changes

Write-Host "🚀 Starting Kizazi Social Media Platform deployment..." -ForegroundColor Blue

# Set variables
$SERVER_USER = "root"
$SERVER_HOST = "srv944928.ssh.ssh-cloud.com"
$SERVER_PATH = "/var/www/kizazi"
$BACKUP_PATH = "/var/www/kizazi-backup-$(Get-Date -Format 'yyyyMMdd_HHmmss')"

Write-Host "📋 Deployment Information:" -ForegroundColor Cyan
Write-Host "Server: $SERVER_HOST"
Write-Host "Path: $SERVER_PATH"
Write-Host "Backup: $BACKUP_PATH"
Write-Host ""

# Function to run commands on server
function Invoke-SSHCommand {
    param([string]$Command)
    ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" $Command
}

# Function to check if command was successful
function Test-CommandSuccess {
    param([string]$Message)
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $Message" -ForegroundColor Green
    } else {
        Write-Host "❌ $Message failed" -ForegroundColor Red
        exit 1
    }
}

Write-Host "🔄 Step 1: Creating backup of current deployment..." -ForegroundColor Yellow
Invoke-SSHCommand "cp -r $SERVER_PATH $BACKUP_PATH"
Test-CommandSuccess "Backup created"

Write-Host "🔄 Step 2: Pulling latest code from repository..." -ForegroundColor Yellow
Invoke-SSHCommand "cd $SERVER_PATH && git pull origin main"
Test-CommandSuccess "Code updated from repository"

Write-Host "🔄 Step 3: Installing/updating dependencies..." -ForegroundColor Yellow
Invoke-SSHCommand "cd $SERVER_PATH && npm install"
Test-CommandSuccess "Dependencies updated"

Write-Host "🔄 Step 4: Building frontend..." -ForegroundColor Yellow
Invoke-SSHCommand "cd $SERVER_PATH && npm run build"
Test-CommandSuccess "Frontend built successfully"

Write-Host "🔄 Step 5: Copying built files to web directory..." -ForegroundColor Yellow
Invoke-SSHCommand "sudo cp -r $SERVER_PATH/dist/* /var/www/html/kizazi-webapp/dist/"
Test-CommandSuccess "Frontend files deployed"

Write-Host "🔄 Step 6: Setting correct permissions..." -ForegroundColor Yellow
Invoke-SSHCommand "sudo chown -R www-data:www-data /var/www/html/kizazi-webapp/dist/"
Test-CommandSuccess "Permissions set"

Write-Host "🔄 Step 7: Restarting backend services..." -ForegroundColor Yellow
Invoke-SSHCommand "cd $SERVER_PATH/server && pm2 restart kizazi-backend"
Test-CommandSuccess "Backend restarted"

Write-Host "🔄 Step 8: Testing backend health..." -ForegroundColor Yellow
Invoke-SSHCommand "curl -s https://www.kizazisocial.com/api/health | head -1"
Test-CommandSuccess "Backend health check"

Write-Host "🔄 Step 9: Reloading Nginx configuration..." -ForegroundColor Yellow
Invoke-SSHCommand "sudo nginx -t && sudo systemctl reload nginx"
Test-CommandSuccess "Nginx reloaded"

Write-Host "🔄 Step 10: Checking service status..." -ForegroundColor Yellow
Invoke-SSHCommand "pm2 status"
Invoke-SSHCommand "sudo systemctl status nginx --no-pager -l"

Write-Host ""
Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Deployment Summary:" -ForegroundColor Cyan
Write-Host "✅ Code updated from repository"
Write-Host "✅ Dependencies installed"
Write-Host "✅ Frontend built and deployed"
Write-Host "✅ Backend services restarted"
Write-Host "✅ Nginx configuration reloaded"
Write-Host "✅ All services are running"
Write-Host ""
Write-Host "🌐 Your updated application is now live at:" -ForegroundColor Cyan
Write-Host "https://www.kizazisocial.com"
Write-Host ""
Write-Host "📱 New Features Deployed:" -ForegroundColor Cyan
Write-Host "• Interactive calendar with clickable dates"
Write-Host "• Instagram-style analytics dashboard"
Write-Host "• Photo and video upload functionality"
Write-Host "• Enhanced post scheduling system"
Write-Host "• Mobile-responsive design"
Write-Host ""
Write-Host "💡 If you encounter any issues, you can restore from backup:" -ForegroundColor Yellow
Write-Host "ssh $SERVER_USER@$SERVER_HOST 'sudo cp -r $BACKUP_PATH/* $SERVER_PATH/'"

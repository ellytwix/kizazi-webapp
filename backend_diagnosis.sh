#!/bin/bash
echo "=== BACKEND DIAGNOSIS ==="

# Check if PM2 is running kizazi-backend
echo "--- 1. PM2 Status ---"
pm2 status | grep kizazi || echo "No kizazi processes found in PM2"

# Check PM2 logs for errors
echo -e "\n--- 2. Recent Backend Logs ---"
pm2 logs kizazi-backend --lines 20 --nostream 2>/dev/null || echo "Cannot get PM2 logs"

# Check if backend process is running on any port
echo -e "\n--- 3. Backend Process Check ---"
netstat -tlnp | grep :3000 || echo "No process listening on port 3000"
netstat -tlnp | grep :5000 || echo "No process listening on port 5000"

# Check if we can start backend manually
echo -e "\n--- 4. Testing Manual Backend Start ---"
cd /var/www/kizazi/server
echo "Current directory: $(pwd)"
echo "Files in server directory:"
ls -la

# Check if package.json exists and has correct structure
echo -e "\n--- 5. Package.json Check ---"
if [ -f package.json ]; then
    echo "✅ package.json exists"
    echo "Node version: $(node --version)"
    echo "NPM version: $(npm --version)"
    cat package.json | grep -E '"type":|"main":|"scripts":'
else
    echo "❌ package.json not found!"
fi

# Check if .env file exists
echo -e "\n--- 6. Environment Variables ---"
if [ -f .env ]; then
    echo "✅ .env exists"
    echo "Environment variables (sensitive data hidden):"
    grep -E "PORT|NODE_ENV|FRONTEND_URL" .env || echo "Key variables missing"
else
    echo "❌ .env file not found!"
fi

# Try a quick backend start test
echo -e "\n--- 7. Quick Start Test ---"
timeout 10s node server.js 2>&1 | head -10 || echo "Backend failed to start or timed out"

echo -e "\n=== DIAGNOSIS COMPLETE ==="

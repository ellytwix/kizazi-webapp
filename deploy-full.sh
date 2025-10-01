#!/bin/bash
# Full deployment script for KizaziSocial
# This ensures complete synchronization between local and server

echo "🚀 KIZAZI FULL DEPLOYMENT SCRIPT"
echo "================================"

# Navigate to project directory
cd /var/www/kizazi || exit 1

# Step 1: Git operations
echo "📥 1. Pulling latest changes from GitHub..."
git fetch --all
git reset --hard origin/main
git pull origin main

# Step 2: Install dependencies if package.json changed
echo "📦 2. Checking for dependency updates..."
if git diff HEAD@{1} --name-only | grep -E "(package\.json|package-lock\.json)"; then
    echo "Dependencies changed, running npm install..."
    npm install
else
    echo "No dependency changes detected."
fi

# Step 3: Build the frontend
echo "🔨 3. Building frontend..."
npm run build

# Step 4: Clear old deployment and sync new build
echo "🔄 4. Deploying to web root (/var/www/html)..."
# Ensure web root exists
sudo mkdir -p /var/www/html
# Remove old files completely
sudo rm -rf /var/www/html/*
# Copy new build
sudo cp -r dist/* /var/www/html/
# Set proper permissions
sudo chown -R www-data:www-data /var/www/html/

# Step 5: Restart backend
echo "🔄 5. Restarting backend server..."
cd server
pm2 restart kizazi-backend --update-env
cd ..

# Step 6: Clear Nginx cache and reload
echo "🔄 6. Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

# Step 7: Verify deployment
echo "✅ 7. Verifying deployment..."
echo "Checking for PostCreator in bundle..."
grep -q "Add Photo" /var/www/html/assets/*.js && echo "✅ Media upload buttons found" || echo "❌ Media upload buttons NOT found"

echo "Checking backend health..."
curl -s https://www.kizazisocial.com/api/health | jq '.' || echo "❌ Backend health check failed"

# Step 8: Show current versions
echo "📊 8. Current deployment info:"
echo "Git commit: $(git rev-parse HEAD)"
echo "Build time: $(date)"
echo "Backend status:"
pm2 status kizazi-backend

echo ""
echo "🎯 DEPLOYMENT COMPLETE!"
echo "====================="
echo "Please check:"
echo "1. Clear browser cache (Ctrl+Shift+R)"
echo "2. Test in incognito mode"
echo "3. Check browser console for errors"

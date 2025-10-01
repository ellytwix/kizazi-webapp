#!/bin/bash
# Diagnostic script to identify deployment issues

echo "🔍 KIZAZI SERVER DIAGNOSTICS"
echo "============================"

# 1. Check current directory and git status
echo "📍 1. Current location and git status:"
pwd
git remote -v
git status
git log --oneline -n 5

echo ""
echo "📊 2. Check if latest commit is deployed:"
CURRENT_COMMIT=$(git rev-parse HEAD)
echo "Current commit: $CURRENT_COMMIT"

# 3. Check environment variables
echo ""
echo "🔐 3. Environment variables check:"
if [ -f "server/.env" ]; then
    echo "✅ .env file exists"
    grep -E "GEMINI_API_KEY|META_APP" server/.env | sed 's/=.*/=***HIDDEN***/'
else
    echo "❌ .env file NOT found!"
fi

# 4. Check build files
echo ""
echo "📦 4. Build files check:"
if [ -d "dist" ]; then
    echo "✅ dist/ directory exists"
    echo "Latest files in dist/assets:"
    ls -lt dist/assets/ | head -5
else
    echo "❌ dist/ directory NOT found!"
fi

# 5. Check deployed files
echo ""
echo "🌐 5. Deployed files check:"
if [ -d "/var/www/html" ]; then
    echo "✅ Web root exists: /var/www/html"
    echo "Latest files in web root:"
    ls -lt /var/www/html/assets/ | head -5
    
    # Check if PostCreator code is in bundle
    echo ""
    echo "Checking for PostCreator code:"
    grep -l "Add Photo" /var/www/html/assets/*.js 2>/dev/null || echo "❌ 'Add Photo' not found in deployed JS"
    grep -l "handleMediaUpload" /var/www/html/assets/*.js 2>/dev/null || echo "❌ 'handleMediaUpload' not found in deployed JS"
else
    echo "❌ Web root NOT found!"
fi

# 6. Compare source vs deployed
echo ""
echo "🔄 6. Source vs Deployed comparison:"
if [ -f "dist/index.html" ] && [ -f "/var/www/html/index.html" ]; then
    diff -q dist/index.html /var/www/html/index.html || echo "⚠️  index.html files differ!"
else
    echo "❌ Cannot compare - missing files"
fi

# 7. Backend status
echo ""
echo "🔧 7. Backend service check:"
pm2 list
pm2 logs kizazi-backend --lines 10 --nostream

# 8. Test API endpoints
echo ""
echo "🌐 8. API endpoint tests:"
echo "Testing health endpoint:"
curl -s https://www.kizazisocial.com/api/health | jq '.' || echo "❌ Health check failed"

echo ""
echo "Testing Gemini endpoint (should fail with 'Prompt required'):"
curl -s -X POST https://www.kizazisocial.com/api/gemini/generate \
  -H "Content-Type: application/json" \
  -d '{}' | jq '.' || echo "❌ Gemini endpoint not responding"

# 9. Nginx configuration
echo ""
echo "⚙️  9. Nginx configuration:"
nginx -t 2>&1
grep -A 5 "location /" /etc/nginx/sites-available/kizazi 2>/dev/null || echo "Cannot read nginx config"

echo ""
echo "🎯 DIAGNOSTICS COMPLETE"
echo "====================="

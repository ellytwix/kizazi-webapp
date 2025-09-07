#!/bin/bash

echo "🔍 KIZAZI SERVER DEBUG SCRIPT"
echo "=============================="

echo ""
echo "📂 1. Checking build assets..."
echo "Latest build files:"
ls -lt /var/www/html/kizazi-webapp/dist/assets/ | head -10

echo ""
echo "📄 2. Checking index.html..."
echo "Current index.html references:"
grep -E "(index-|assets/)" /var/www/html/kizazi-webapp/dist/index.html

echo ""
echo "🔍 3. Checking PostCreator in bundle..."
echo "Searching for PostCreator and media upload code in latest JS file:"
LATEST_JS=$(ls -t /var/www/html/kizazi-webapp/dist/assets/index-*.js | head -1)
echo "Checking file: $LATEST_JS"

if grep -q "Add Photo" "$LATEST_JS"; then
    echo "✅ 'Add Photo' text found in bundle"
else
    echo "❌ 'Add Photo' text NOT found in bundle"
fi

if grep -q "Add Video" "$LATEST_JS"; then
    echo "✅ 'Add Video' text found in bundle"
else
    echo "❌ 'Add Video' text NOT found in bundle"
fi

if grep -q "type.*file" "$LATEST_JS"; then
    echo "✅ File input found in bundle"
else
    echo "❌ File input NOT found in bundle"
fi

if grep -q "handleMediaUpload" "$LATEST_JS"; then
    echo "✅ handleMediaUpload function found in bundle"
else
    echo "❌ handleMediaUpload function NOT found in bundle"
fi

echo ""
echo "🌐 4. Testing backend API..."
echo "Backend health check:"
curl -s https://www.kizazisocial.com/api/health | jq '.status' 2>/dev/null || echo "API not responding properly"

echo ""
echo "🔄 5. Checking PM2 status..."
pm2 list

echo ""
echo "📊 6. Checking nginx access logs (last 5 entries)..."
tail -5 /var/log/nginx/access.log | grep -E "(js|css|html)"

echo ""
echo "❗ 7. Checking nginx error logs (last 10 entries)..."
tail -10 /var/log/nginx/error.log

echo ""
echo "=============================="
echo "🎯 DEBUGGING COMPLETE"
echo ""
echo "Next steps:"
echo "1. Run this script on your server"
echo "2. Copy the debug-components.js content"
echo "3. Paste and run it in browser console on live site"
echo "4. Compare results with local testing"

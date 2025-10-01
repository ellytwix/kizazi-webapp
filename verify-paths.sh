#!/bin/bash
# Script to verify deployment paths and identify mismatches

echo "🔍 PATH VERIFICATION SCRIPT"
echo "=========================="

# Check all possible deployment locations
echo "📂 Checking deployment paths:"
echo ""

# Path 1: Original location
echo "1. /var/www/html/"
if [ -d "/var/www/html" ]; then
    echo "   ✅ EXISTS"
    echo "   Last modified: $(stat -c %y /var/www/html/index.html 2>/dev/null || echo 'No index.html')"
    echo "   Asset count: $(ls /var/www/html/assets/*.js 2>/dev/null | wc -l) JS files"
else
    echo "   ❌ NOT FOUND"
fi

# Path 2: Possible dist subfolder
echo ""
echo "2. /var/www/html/dist/"
if [ -d "/var/www/html/dist" ]; then
    echo "   ⚠️  EXISTS (This might be the problem!)"
    echo "   Last modified: $(stat -c %y /var/www/html/dist/index.html 2>/dev/null || echo 'No index.html')"
    echo "   Asset count: $(ls /var/www/html/dist/assets/*.js 2>/dev/null | wc -l) JS files"
else
    echo "   ✅ NOT FOUND (Good)"
fi

# Path 3: Check document root from nginx
echo ""
echo "3. Nginx document root:"
NGINX_ROOT=$(grep -E "root\s+" /etc/nginx/sites-available/kizazi 2>/dev/null | awk '{print $2}' | tr -d ';' | head -1)
echo "   Configured as: $NGINX_ROOT"
if [ -n "$NGINX_ROOT" ] && [ -d "$NGINX_ROOT" ]; then
    echo "   ✅ EXISTS"
    echo "   Contains: $(ls $NGINX_ROOT | head -5 | tr '\n' ' ')"
else
    echo "   ❌ NOT FOUND or not readable"
fi

# Check for nested dist folders
echo ""
echo "🔍 Checking for nested dist folders:"
find /var/www/html -name "dist" -type d 2>/dev/null | head -10

# Compare file sizes to detect old vs new
echo ""
echo "📊 File size comparison:"
echo "Source dist/:"
du -sh dist/* 2>/dev/null | head -5
echo ""
echo "Deployed location:"
du -sh /var/www/html/* 2>/dev/null | grep -v "dist" | head -5

# Check actual served content
echo ""
echo "🌐 Testing actual served content:"
echo "Fetching homepage..."
curl -s https://www.kizazisocial.com/ | grep -o '<script.*src="[^"]*"' | head -3
echo ""
echo "Checking for pricing text (should show 10k TSh):"
curl -s https://www.kizazisocial.com/ | grep -o "10k\|TSh\|pricing" | head -5 || echo "No pricing text found"

echo ""
echo "🎯 VERIFICATION COMPLETE"

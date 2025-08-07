#!/bin/bash
set -e
cd /var/www/kizazi/server

echo "======================================="
echo "🔍 COMPREHENSIVE BACKEND FUNCTIONALITY TEST"
echo "======================================="

# 1. Check environment variables
echo "--- 1. CHECKING ENVIRONMENT VARIABLES ---"
if [ -f .env ]; then
    echo "✅ .env file exists"
    echo "Environment variables:"
    grep -E "GEMINI_API_KEY|JWT_SECRET|PORT|NODE_ENV" .env || echo "❌ Key variables missing"
    
    # Check if Gemini API key is set
    if grep -q "GEMINI_API_KEY=" .env; then
        GEMINI_KEY=$(grep "GEMINI_API_KEY=" .env | cut -d'=' -f2)
        if [ -n "$GEMINI_KEY" ] && [ "$GEMINI_KEY" != "your-gemini-api-key-here" ]; then
            echo "✅ Gemini API key is set"
        else
            echo "❌ Gemini API key is empty or placeholder"
        fi
    else
        echo "❌ Gemini API key not found in .env"
    fi
else
    echo "❌ .env file not found!"
fi

# 2. Test basic backend connectivity
echo -e "\n--- 2. TESTING BASIC BACKEND CONNECTIVITY ---"
if curl -s http://localhost:5000/api/ping > /dev/null; then
    echo "✅ Backend ping successful"
    curl -s http://localhost:5000/api/ping | python3 -m json.tool 2>/dev/null || curl -s http://localhost:5000/api/ping
else
    echo "❌ Backend ping failed"
fi

# 3. Test Gemini API directly
echo -e "\n--- 3. TESTING GEMINI API DIRECTLY ---"
echo "Testing AI content generation:"

GEMINI_TEST_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Write a short social media post about coffee"}' \
  http://localhost:5000/api/gemini/generate)

echo "Gemini Response:"
echo "$GEMINI_TEST_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$GEMINI_TEST_RESPONSE"

if echo "$GEMINI_TEST_RESPONSE" | grep -q "text"; then
    echo "✅ Gemini API is working"
else
    echo "❌ Gemini API failed"
fi

# 4. Test account registration
echo -e "\n--- 4. TESTING ACCOUNT REGISTRATION ---"
REG_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"testuser@example.com","password":"testpass123"}' \
  http://localhost:5000/api/auth/register)

echo "Registration Response:"
echo "$REG_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REG_RESPONSE"

if echo "$REG_RESPONSE" | grep -q "token"; then
    echo "✅ Account registration is working"
else
    echo "❌ Account registration failed"
fi

# 5. Test account login (with demo account)
echo -e "\n--- 5. TESTING ACCOUNT LOGIN ---"
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"eliyatwisa@gmail.com","password":"12345678"}' \
  http://localhost:5000/api/auth/login)

echo "Login Response:"
echo "$LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$LOGIN_RESPONSE"

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo "✅ Account login is working"
else
    echo "❌ Account login failed"
fi

# 6. Test analytics export
echo -e "\n--- 6. TESTING ANALYTICS EXPORT ---"
if curl -s http://localhost:5000/api/analytics/export/csv | head -2 | grep -q "Date,Platform"; then
    echo "✅ Analytics CSV export is working"
else
    echo "❌ Analytics CSV export failed"
fi

# 7. Check PM2 status and logs
echo -e "\n--- 7. PM2 STATUS AND RECENT LOGS ---"
pm2 status | grep kizazi || echo "❌ PM2 process not found"

echo "Recent error logs:"
pm2 logs kizazi-backend --lines 10 --nostream --err 2>/dev/null | tail -5 || echo "No recent errors"

echo "Recent output logs:"
pm2 logs kizazi-backend --lines 10 --nostream --out 2>/dev/null | tail -5 || echo "No recent output"

# 8. Summary
echo -e "\n======================================="
echo "📋 TEST SUMMARY"
echo "======================================="

# Quick test summary
PING_OK=$(curl -s http://localhost:5000/api/ping | grep -q "ok" && echo "✅" || echo "❌")
GEMINI_OK=$(echo "$GEMINI_TEST_RESPONSE" | grep -q "text" && echo "✅" || echo "❌")
REG_OK=$(echo "$REG_RESPONSE" | grep -q "token" && echo "✅" || echo "❌")
LOGIN_OK=$(echo "$LOGIN_RESPONSE" | grep -q "token" && echo "✅" || echo "❌")

echo "Backend Ping:        $PING_OK"
echo "Gemini AI:           $GEMINI_OK"
echo "Account Registration: $REG_OK"
echo "Account Login:       $LOGIN_OK"

echo -e "\n🔧 RECOMMENDED FIXES:"

if [ "$GEMINI_OK" = "❌" ]; then
    echo "1. Fix Gemini API key configuration"
fi

if [ "$REG_OK" = "❌" ] || [ "$LOGIN_OK" = "❌" ]; then
    echo "2. Fix authentication system"
fi

if [ "$PING_OK" = "❌" ]; then
    echo "3. Restart backend server"
fi

echo -e "\n✅ Test completed!"

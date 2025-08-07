#!/bin/bash
set -e
cd /var/www/kizazi/server

echo "🔑 TESTING GEMINI API KEY DIRECTLY"
echo "=================================="

# Get the API key from .env
if [ -f .env ]; then
    GEMINI_KEY=$(grep "GEMINI_API_KEY=" .env | cut -d'=' -f2 | tr -d '"' | tr -d "'")
    
    if [ -n "$GEMINI_KEY" ] && [ "$GEMINI_KEY" != "your-gemini-api-key-here" ]; then
        echo "✅ Found Gemini API key: ${GEMINI_KEY:0:10}..."
        
        # Test the API key directly with Google's API
        echo "Testing API key with Google Generative AI API..."
        
        DIRECT_TEST=$(curl -s -X POST \
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$GEMINI_KEY" \
          -H 'Content-Type: application/json' \
          -d '{
            "contents": [{
              "parts": [{
                "text": "Say hello in one word"
              }]
            }]
          }')
        
        echo "Direct API Response:"
        echo "$DIRECT_TEST" | python3 -m json.tool 2>/dev/null || echo "$DIRECT_TEST"
        
        if echo "$DIRECT_TEST" | grep -q "candidates"; then
            echo "✅ GEMINI API KEY IS VALID AND WORKING!"
        else
            echo "❌ GEMINI API KEY IS INVALID OR BLOCKED"
            if echo "$DIRECT_TEST" | grep -q "API_KEY_INVALID"; then
                echo "   Reason: Invalid API key"
            elif echo "$DIRECT_TEST" | grep -q "quota"; then
                echo "   Reason: Quota exceeded"
            fi
        fi
    else
        echo "❌ Gemini API key is not set or is placeholder"
    fi
else
    echo "❌ .env file not found"
fi

echo -e "\n🔧 If API key is invalid, get a new one from:"
echo "   https://makersuite.google.com/app/apikey"

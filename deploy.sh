#!/bin/bash

# Deployment script for kizazisocial.com
echo "🚀 Starting deployment to kizazisocial.com..."

# Build the project
echo "📦 Building project..."
npm run build

# Upload to server using rsync (more reliable than scp)
echo "📤 Uploading to server..."
rsync -avz --delete dist/ root@kizazisocial.com:/var/www/html/

echo "✅ Deployment complete!"
echo "🌐 Your privacy policy is now live at: https://kizazisocial.com/privacy"

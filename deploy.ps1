# PowerShell deployment script for kizazisocial.com
Write-Host "🚀 Starting deployment to kizazisocial.com..." -ForegroundColor Green

# Build the project
Write-Host "📦 Building project..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    # Upload using SCP (requires confirmation)
    Write-Host "📤 Uploading to server..." -ForegroundColor Yellow
    Write-Host "Note: You may need to type 'yes' to confirm the server connection" -ForegroundColor Cyan
    
    scp -r dist/* root@kizazisocial.com:/var/www/html/
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Deployment complete!" -ForegroundColor Green
        Write-Host "🌐 Your privacy policy is now live at: https://kizazisocial.com/privacy" -ForegroundColor Green
    } else {
        Write-Host "❌ Upload failed. Please check your server credentials." -ForegroundColor Red
    }
} else {
    Write-Host "❌ Build failed. Please check for errors." -ForegroundColor Red
}

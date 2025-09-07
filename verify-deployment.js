#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Checks if all components are properly deployed
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Verifying Deployment...\n');

// Check if PostCreator exists and has photo/video upload
const checkPostCreator = () => {
  const postCreatorPath = 'src/components/PostCreator.jsx';
  
  if (!fs.existsSync(postCreatorPath)) {
    console.log('❌ PostCreator.jsx NOT FOUND');
    return false;
  }
  
  const content = fs.readFileSync(postCreatorPath, 'utf8');
  
  // Check for media upload functionality
  const hasMediaUpload = content.includes('handleMediaUpload');
  const hasFileInput = content.includes('type="file"');
  const hasVideoSupport = content.includes('isVideo');
  
  console.log('📁 PostCreator.jsx:', hasMediaUpload && hasFileInput && hasVideoSupport ? '✅ FOUND with media upload' : '❌ Missing media upload features');
  
  if (!hasMediaUpload) console.log('   - Missing: handleMediaUpload function');
  if (!hasFileInput) console.log('   - Missing: file input element');
  if (!hasVideoSupport) console.log('   - Missing: video support');
  
  return hasMediaUpload && hasFileInput && hasVideoSupport;
};

// Check if App.jsx uses PostCreator correctly
const checkAppJsx = () => {
  const appPath = 'src/App.jsx';
  
  if (!fs.existsSync(appPath)) {
    console.log('❌ App.jsx NOT FOUND');
    return false;
  }
  
  const content = fs.readFileSync(appPath, 'utf8');
  
  // Check for PostCreator import and usage
  const hasImport = content.includes("import PostCreator from './components/PostCreator'");
  const hasUsage = content.includes('<PostCreator onPostCreated');
  const hasModal = content.includes('showPostModal');
  
  console.log('📄 App.jsx:', hasImport && hasUsage && hasModal ? '✅ CORRECTLY integrated' : '❌ Integration issues');
  
  if (!hasImport) console.log('   - Missing: PostCreator import');
  if (!hasUsage) console.log('   - Missing: PostCreator component usage');
  if (!hasModal) console.log('   - Missing: modal state management');
  
  return hasImport && hasUsage && hasModal;
};

// Check Meta configuration
const checkMetaConfig = () => {
  const metaConfigPath = 'src/config/meta.js';
  
  if (!fs.existsSync(metaConfigPath)) {
    console.log('❌ meta.js NOT FOUND');
    return false;
  }
  
  const content = fs.readFileSync(metaConfigPath, 'utf8');
  const hasAppIds = content.includes('1254207229501657') && content.includes('1442447900331004');
  
  console.log('⚙️  Meta Config:', hasAppIds ? '✅ CONFIGURED with correct App IDs' : '❌ Missing App IDs');
  
  return hasAppIds;
};

// Check environment file
const checkEnvFile = () => {
  const envPath = 'server/.env';
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file NOT FOUND');
    return false;
  }
  
  const content = fs.readFileSync(envPath, 'utf8');
  const hasMetaId = content.includes('META_APP_ID=1254207229501657');
  const hasInstagramId = content.includes('INSTAGRAM_APP_ID=1442447900331004');
  
  console.log('🔐 Environment:', hasMetaId && hasInstagramId ? '✅ CONFIGURED with App IDs' : '❌ Missing App IDs');
  
  return hasMetaId && hasInstagramId;
};

// Run all checks
console.log('==================================');
const postCreatorOk = checkPostCreator();
const appJsxOk = checkAppJsx();
const metaConfigOk = checkMetaConfig();
const envFileOk = checkEnvFile();

console.log('\n==================================');
console.log('📊 DEPLOYMENT SUMMARY:');
console.log('==================================');

if (postCreatorOk && appJsxOk && metaConfigOk && envFileOk) {
  console.log('🎉 ALL COMPONENTS PROPERLY DEPLOYED');
  console.log('✅ Photo/Video upload should be working');
  console.log('✅ Meta API should be configured');
  console.log('');
  console.log('🚀 Next steps:');
  console.log('   1. Build and deploy: npm run build');
  console.log('   2. Copy files to server');
  console.log('   3. Restart backend with: pm2 restart kizazi-backend --update-env');
} else {
  console.log('⚠️  DEPLOYMENT ISSUES DETECTED');
  console.log('❌ Some components are missing or misconfigured');
  console.log('');
  console.log('🔧 Required actions:');
  if (!postCreatorOk) console.log('   - Fix PostCreator component');
  if (!appJsxOk) console.log('   - Fix App.jsx integration');
  if (!metaConfigOk) console.log('   - Fix Meta configuration');
  if (!envFileOk) console.log('   - Run: node setup-env.mjs');
}

console.log('\n==================================');

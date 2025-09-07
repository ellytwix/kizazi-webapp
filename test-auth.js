// Quick authentication test script for browser console
// Run this on https://kizazisocial.com to test authentication

console.log('🔍 AUTHENTICATION DEBUG TEST');
console.log('=================================');

// 1. Check stored tokens
const token = localStorage.getItem('kizazi_token');
const user = localStorage.getItem('kizazi_user');
const userId = localStorage.getItem('userId');

console.log('📋 Stored Authentication Data:');
console.log('Token:', token ? `${token.substring(0, 20)}...` : 'NOT FOUND');
console.log('User:', user ? JSON.parse(user) : 'NOT FOUND');
console.log('User ID:', userId || 'NOT FOUND');

// 2. Test API call manually
async function testAPI() {
  console.log('\n🧪 Testing API Call...');
  
  try {
    const response = await fetch('/api/social/accounts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      credentials: 'include'
    });
    
    console.log('📡 API Response Status:', response.status);
    console.log('📡 API Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Success:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ API Error:', errorText);
    }
  } catch (error) {
    console.log('💥 API Request Failed:', error);
  }
}

// 3. Test backend health
async function testHealth() {
  console.log('\n🏥 Testing Backend Health...');
  
  try {
    const response = await fetch('/api/health');
    const data = await response.json();
    console.log('✅ Backend Health:', data);
  } catch (error) {
    console.log('❌ Backend Health Failed:', error);
  }
}

// 4. Check user authentication flow
function checkAuthFlow() {
  console.log('\n🔐 Authentication Flow Check:');
  
  if (!token) {
    console.log('❌ No token found - User needs to login');
    console.log('🔧 Solution: Try logging in again');
    return false;
  }
  
  if (!user) {
    console.log('❌ No user data found');
    console.log('🔧 Solution: Login process might be incomplete');
    return false;
  }
  
  console.log('✅ Basic auth data present');
  return true;
}

// Run all tests
console.log('\n🚀 Running Authentication Tests...');
const hasBasicAuth = checkAuthFlow();

if (hasBasicAuth) {
  testAPI();
}

testHealth();

console.log('\n=================================');
console.log('📊 Test Complete - Check results above');
console.log('🔧 If API fails with 401, try logging in again');
console.log('🔧 If health fails, backend might be down');

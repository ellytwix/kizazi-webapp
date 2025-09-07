// Debug Script - Checks if components are properly built
// Run this in browser console on the live site

console.log('🔍 DEBUGGING COMPONENTS...');

// Check if PostCreator component exists in the bundle
const scripts = Array.from(document.querySelectorAll('script[src*="index-"]'));
console.log('📦 Main script:', scripts[0]?.src);

// Check for media upload elements
setTimeout(() => {
  // First check if we're in the correct page
  console.log('📍 Current URL:', window.location.href);
  
  // Check for Create Post button
  const createPostButtons = document.querySelectorAll('button');
  const createPostBtn = Array.from(createPostButtons).find(btn => 
    btn.textContent.includes('New Post') || btn.textContent.includes('Create')
  );
  console.log('🔘 Create Post button found:', !!createPostBtn);
  
  if (createPostBtn) {
    console.log('🎯 Clicking Create Post button...');
    createPostBtn.click();
    
    // Wait for modal to appear
    setTimeout(() => {
      // Check for media upload elements
      const fileInputs = document.querySelectorAll('input[type="file"]');
      const photoButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
        btn.textContent.includes('Add Photo') || btn.textContent.includes('Photo')
      );
      const videoButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
        btn.textContent.includes('Add Video') || btn.textContent.includes('Video')
      );
      
      console.log('📁 File inputs found:', fileInputs.length);
      console.log('📸 Photo buttons found:', photoButtons.length);
      console.log('🎥 Video buttons found:', videoButtons.length);
      
      if (fileInputs.length === 0 && photoButtons.length === 0) {
        console.log('❌ ISSUE: No media upload elements found in modal');
        console.log('🔍 Modal content:', document.querySelector('.fixed.inset-0')?.innerHTML || 'No modal found');
      } else {
        console.log('✅ Media upload elements found successfully!');
      }
    }, 1000);
  }
}, 2000);

// Check for any JavaScript errors
window.addEventListener('error', (e) => {
  console.log('❌ JavaScript Error:', e.message, e.filename, e.lineno);
});

// Check React mounting
if (window.React) {
  console.log('⚛️ React is loaded');
} else {
  console.log('❌ React not found');
}

console.log('📊 Debug script loaded. Check console for results...');

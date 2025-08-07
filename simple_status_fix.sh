#!/bin/bash
set -e
cd /var/www/kizazi

echo "=== ADDING STATUS INDICATOR - SIMPLE METHOD ==="

# Backup current file
cp src/App.jsx src/App.jsx.backup

# Find and replace the BackendStatus component with enhanced version
echo "--- Updating BackendStatus component ---"

# Create the new component in a separate file first
cat > new_backend_status.txt <<'NEW_STATUS'
const BackendStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        await apiService.request('/ping');
        setIsOnline(true);
        console.log('✅ Backend ping successful');
      } catch (error) {
        console.error('❌ Backend ping failed:', error);
        setIsOnline(false);
      }
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 left-4 z-[9999] flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
      {!isOnline && (
        <div className="bg-red-600 text-white px-3 py-1 rounded-lg shadow-lg text-xs">
          Backend Unreachable
        </div>
      )}
    </div>
  );
};
NEW_STATUS

# Use Python to safely replace the component (more reliable than awk/sed)
python3 << 'PYTHON_SCRIPT'
import re

# Read the current App.jsx
with open('src/App.jsx', 'r') as f:
    content = f.read()

# Read the new BackendStatus component
with open('new_backend_status.txt', 'r') as f:
    new_component = f.read()

# Replace the old BackendStatus component with the new one
# Pattern matches from "const BackendStatus = () => {" to the closing "};"
pattern = r'const BackendStatus = \(\) => \{.*?\n\};'
replacement = new_component

# Perform the replacement
new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write back to file
with open('src/App.jsx', 'w') as f:
    f.write(new_content)

print("✅ BackendStatus component updated successfully")
PYTHON_SCRIPT

# Clean up temp file
rm new_backend_status.txt

# Build the frontend
echo "--- Building frontend ---"
npm run build --silent
chown -R www-data:www-data dist
chmod -R 755 dist

echo ""
echo "✅ STATUS INDICATOR ADDED SUCCESSFULLY!"
echo "   🟢 Green pulsing circle = Backend online"
echo "   🔴 Red circle + 'Backend Unreachable' = Backend offline"
echo ""
echo "Hard refresh your browser to see the status indicator in top-left corner!"

#!/bin/bash
set -e
cd /var/www/kizazi

echo "=== ADDING STATUS INDICATOR ===

# Create a completely new App.jsx with status indicator
echo "--- Creating updated App.jsx with status indicator ---"
cp src/App.jsx src/App.jsx.backup

# Use a simpler replacement method
cat > temp_status_component.js << 'STATUS_COMPONENT'
// Enhanced Backend Status Component with green/red indicator
const BackendStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        await apiService.request('/ping');
        setIsOnline(true);
      } catch (error) {
        console.error('Backend check failed:', error);
        setIsOnline(false);
      }
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 left-4 z-[9999] flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${
        isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'
      }`} />
      {!isOnline && (
        <div className="bg-red-600 text-white px-3 py-1 rounded-lg shadow-lg text-xs">
          Backend Unreachable
        </div>
      )}
    </div>
  );
};
STATUS_COMPONENT

# Replace the old BackendStatus component
awk '
/^const BackendStatus = \(\) => \{/ {
  while (getline && !/^\};$/) continue
  while ((getline line < "temp_status_component.js") > 0) print line
  close("temp_status_component.js")
  next
}
{print}
' src/App.jsx > src/App.jsx.new

mv src/App.jsx.new src/App.jsx
rm temp_status_component.js

echo "--- Building frontend ---"
npm run build --silent
chown -R www-data:www-data dist

echo "✅ STATUS INDICATOR ADDED!"
echo "   🟢 Green circle = Backend working"  
echo "   🔴 Red circle + message = Backend down"

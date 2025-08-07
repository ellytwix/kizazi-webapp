#!/bin/bash
set -e
cd /var/www/kizazi

echo "=== ADDING STATUS INDICATOR TO FRONTEND ==="

# Update App.jsx to add status indicator and fix backend connection
echo "--- Updating App.jsx with status indicator ---"
sed -i '0,/const BackendStatus = () => {/{s//const BackendStatus = () => {\
  const [isOnline, setIsOnline] = useState(true);\
  const [lastCheck, setLastCheck] = useState(null);\
  \
  useEffect(() => {\
    const checkStatus = async () => {\
      try {\
        const response = await apiService.request("\/ping");\
        setIsOnline(true);\
        setLastCheck(new Date().toLocaleTimeString());\
        console.log("✅ Backend ping successful:", response);\
      } catch (error) {\
        console.error("❌ Backend ping failed:", error);\
        setIsOnline(false);\
        setLastCheck(new Date().toLocaleTimeString());\
      }\
    };\
    \
    checkStatus();\
    const interval = setInterval(checkStatus, 30000); \/\/ Check every 30 seconds\
    return () => clearInterval(interval);\
  }, []);\
\
  return (\
    <div className="fixed top-4 left-4 z-[9999] flex items-center gap-2">\
      <div className={`w-3 h-3 rounded-full ${\
        isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"\
      }`} \/>\
      {!isOnline && (\
        <div className="bg-red-600 text-white px-3 py-1 rounded-lg shadow-lg text-xs">\
          Backend Unreachable\
        <\/div>\
      )}\
    <\/div>\
  );/{;}' src/App.jsx

echo "--- Building frontend ---"
npm run build --silent
chown -R www-data:www-data dist
chmod -R 755 dist

echo ""
echo "✅ FRONTEND UPDATED!"
echo "✅ Added green/red status indicator in top left"
echo "✅ Enhanced backend connection checking"
echo ""

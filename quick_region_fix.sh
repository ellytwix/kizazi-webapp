#!/bin/bash
set -e
cd /var/www/kizazi

echo "▶︎ Injecting “Switch Region” button (demo-mode only) …"
# Adds the button in the header and hides it when the user is authenticated.
sed -i '/Demo Mode Indicators/{
/Switch Mode/ a\
              <button\
                onClick={() => { localStorage.removeItem("selectedRegion"); window.location.reload(); }}\
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${isDashboard ? "bg-white\/20 text-white hover:bg-white\/30" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}\
              >🌍 Switch Region<\/button>
}' src/App.jsx

echo "▶︎ Ensure button disappears once user logs in …"
# Wrap Demo section (Switch Mode + Demo badge + new button) so it renders ONLY when !user
sed -i '/{isDemoMode && (/c\          {isDemoMode && !user && (' src/App.jsx

echo "▶︎ Tidy up sidebar “Support” spacing + vibrant background …"
sed -i 's/bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900/bg-gradient-to-b from-indigo-900 via-slate-900 to-indigo-900/' src/App.jsx
sed -i 's/absolute bottom-4 left-4 right-4/mt-auto px-4 pb-8/' src/App.jsx

echo "▶︎ Add colour-brand icons to Upcoming Posts …"
# Replace simple Instagram block with colour-badge component (only if not already present)
grep -q "SocialMediaIcon" src/App.jsx || sed -i '/function SocialMediaIcon/,${
/default:/i\   case "instagram":\n      return (<div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"><Instagram size={size} className="text-white" \/><\/div>);\n   case "facebook":\n      return (<div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600"><Facebook size={size} className="text-white" \/><\/div>);\n   case "twitter":\n   case "x":\n      return (<div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black"><Hash size={size} className="text-white" \/><\/div>);\n   case "linkedin":\n      return (<div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-700"><Linkedin size={size} className="text-white" \/><\/div>);
}' src/App.jsx

echo "▶︎ Re-building frontend …"
npm run build --silent

echo "▶︎ Fixing permissions and restarting backend …"
chown -R www-data:www-data dist
chmod -R 755 dist
pm2 restart kizazi-backend

echo -e "\n✅ All done!\nHard-refresh the browser (Ctrl-Shift-R) and you’ll see:\n• 🌍 Switch Region button in demo mode (upper-right)\n• Button disappears once logged-in\n• Sidebar vibrant gradient + proper spacing\n• Coloured Instagram / Facebook / X / LinkedIn badges\n"

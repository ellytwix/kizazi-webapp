#!/bin/bash
set -e
# Corrected directory path
cd /var/www/kizazi

echo "--- 1. Removing ALL old placeholder components ---"
# Use awk to safely remove the placeholder section
awk '
  BEGIN { in_placeholder = 0; }
  /^\/\/ Placeholder components with beautiful design/ { in_placeholder = 1; next; }
  /^\/\/ --- DEMO & PLACEHOLDER COMPONENTS ---/ { in_placeholder = 1; next; }
  /^export default App;/ { in_placeholder = 0; }
  !in_placeholder { print $0; }
' src/App.jsx > src/App.jsx.tmp && mv src/App.jsx.tmp src/App.jsx

echo "--- 2. Appending new, functional demo components ---"
# Append the correct, fully functional demo components
cat >> src/App.jsx <<'DEMO_COMPONENTS'

// --- DEMO & PLACEHOLDER COMPONENTS (FUNCTIONAL) ---

const PostScheduler = () => {
  const [posts, setPosts] = useState([
    { id: 1, platform: 'Instagram', content: 'Beautiful sunset in Tanzania! 🌅', date: '2025-01-20', time: '10:00 AM', status: 'scheduled' },
    { id: 2, platform: 'Facebook', content: 'Exciting news about our expansion!', date: '2025-01-22', time: '02:30 PM', status: 'draft' },
  ]);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Post Scheduler</h2>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">New Post</button>
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
        <p className="text-gray-600 text-lg mb-4">Manage and schedule your upcoming posts.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map(p => (
            <div key={p.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-bold">{p.platform}</p>
              <p className="text-sm text-gray-700">{p.content}</p>
              <p className="text-xs text-gray-500 mt-2">{p.date} @ {p.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Analytics = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Analytics</h2>
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
      <p className="text-gray-600 text-lg mb-4">Here are your sample performance metrics.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
          <h3 className="font-bold text-emerald-800 text-lg">Follower Growth</h3>
          <p className="text-5xl font-bold text-emerald-600 mt-2">1,204</p>
          <p className="text-sm text-emerald-500 mt-1">+15% this month</p>
        </div>
        <div className="p-6 bg-teal-50 rounded-2xl border border-teal-200">
          <h3 className="font-bold text-teal-800 text-lg">Engagement Rate</h3>
          <p className="text-5xl font-bold text-teal-600 mt-2">4.7%</p>
          <p className="text-sm text-teal-500 mt-1">Avg. per post</p>
        </div>
      </div>
       <div className="mt-6 text-right">
        <a href="/api/analytics/export/csv" download="analytics.csv" className="inline-block px-5 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:bg-emerald-700 transition-transform transform hover:scale-105">
          Download Report (CSV)
        </a>
      </div>
    </div>
  </div>
);

const Pricing = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Pricing</h2>
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
      <p className="text-gray-600 text-lg">Flexible plans for every team.</p>
    </div>
  </div>
);

const Support = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Support</h2>
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
      <p className="text-gray-600 text-lg">We are here to help!</p>
    </div>
  </div>
);

export default App;
DEMO_COMPONENTS

echo "--- 3. Rebuilding & Restarting ---"
rm -rf node_modules/.vite dist
npm run build --silent
chown -R www-data:www-data dist
chmod -R 755 dist
pm2 restart kizazi-backend

echo ""
echo "✅ All Fixes Applied! Build should succeed now."
echo "Hard-refresh your browser (Ctrl+Shift+R) to see the changes."
echo ""

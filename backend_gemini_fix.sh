#!/bin/bash
set -e
cd /var/www/kizazi

# 1️⃣  trust proxy
grep -q "app.set(\"trust proxy\"" server/server.js || \
  sed -i '0,/const app = express();/s//const app = express();\napp.set("trust proxy", 1);/' server/server.js

# 2️⃣  .env – gemini key
grep -q '^GEMINI_API_KEY=' server/.env && sed -i 's/^GEMINI_API_KEY=.*/GEMINI_API_KEY=AIzaSyATLpq1VbluD6L2UXqytnLvrYU2UAdEhgc/' server/.env \
  || echo 'GEMINI_API_KEY=AIzaSyATLpq1VbluD6L2UXqytnLvrYU2UAdEhgc' >> server/.env

# 3️⃣  install sdk (once)
npm --prefix server i @google/generative-ai@^0.4.0 --save > /dev/null 2>&1

# 4️⃣  Gemini route file
cat > server/routes/gemini.js <<'NODE'
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate', async (req, res) => {
  const { prompt = 'Hello from KizaziSocial' } = req.body || {};
  try {
    const model  = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    res.json({ success: true, text: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gemini error', error: err.message });
  }
});
export default router;
NODE

# 5️⃣  mount route (import + app.use) – add only once
grep -q "routes/gemini.js" server/server.js || \
  sed -i "/routes\/socialMedia.js/a import geminiRoutes from './routes/gemini.js';" server/server.js

grep -q "app.use('/api/gemini'" server/server.js || \
  sed -i "/app.use(.*socialMediaRoutes);/a app.use('/api/gemini', geminiRoutes);" server/server.js

# 6️⃣  create admin via API (handles hashing)
TOKEN=$(curl -s -X POST http://127.0.0.1:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Elly Twix","email":"eliyatwisa@gmail.com","password":"12345678"}' | jq -r '.token // empty') || true
[[ -n "$TOKEN" ]] && echo "✅ Admin user created/updated."

# 7️⃣  build & restart
npm run build --silent
chown -R www-data:www-data dist && chmod -R 755 dist
pm2 restart kizazi-backend
echo -e "\n✅  DONE\nLog in with  eliyatwisa@gmail.com / 12345678\nTest Gemini:\n  curl -X POST https://kizazisocial.com/api/gemini/generate -H 'Content-Type: application/json' -d '{\"prompt\":\"Write a tweet about KizaziSocial\"}'\n"

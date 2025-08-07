#!/bin/bash
set -e
cd /var/www/kizazi

echo "🔑 1)  store Gemini key"
grep -q '^GEMINI_API_KEY=' server/.env || echo 'GEMINI_API_KEY=AIzaSyATLpq1VbluD6L2UXqytnLvrYU2UAdEhgc' >> server/.env

echo "📦 2)  install google generative-ai sdk"
npm --prefix server i @google/generative-ai@^0.4.0 --save

echo "🔧 3)  trust proxy once"
grep -q 'trust proxy' server/server.js || \
  sed -i '0,/const app = express();/s//const app = express();\napp.set("trust proxy", 1);/' server/server.js

echo "🌐 4)  add gemini route"
cat > server/routes/gemini.js <<'NODE'
import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();

const router = express.Router();
const genAI  = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate', async (req,res) => {
  const { prompt } = req.body;
  try{
    const model  = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt || 'Hello from KizaziSocial');
    const text   = result.response.text();
    res.json({ success:true, text });
  }catch(err){
    console.error(err);
    res.status(500).json({ success:false, message:'Gemini error', error:err.message });
  }
});
export default router;
NODE

echo "🔗 5)  mount route in server.js"
grep -q "routes/gemini" server/server.js || \
  sed -i '/import socialMediaRoutes/a import geminiRoutes from '\''./routes/gemini.js'\'';' server/server.js

grep -q "app.use('/api/gemini'" server/server.js || \
  sed -i '/app.use(.*socialMediaRoutes)/a app.use('/"api/gemini\"", geminiRoutes);' server/server.js

echo "👤 6)  upsert admin user"
cat > tmp_upsert.mjs <<'NODE'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './server/models/User.js';
dotenv.config({path:'./server/.env'});
await mongoose.connect(process.env.MONGODB_URI);
const admin = await User.findOneAndUpdate(
  { email:'eliyatwisa@gmail.com' },
  { name:'Elly Twix', role:'admin', password:'12345678' },
  { upsert:true, new:true, setDefaultsOnInsert:true }
);
console.log('✅ admin id:',admin._id); await mongoose.disconnect();
NODE
node tmp_upsert.mjs && rm tmp_upsert.mjs

echo "🏗️ 7)  build frontend & restart backend"
npm run build --silent
chown -R www-data:www-data dist && chmod -R 755 dist
pm2 restart kizazi-backend

echo -e "\n✅ DONE!\n•  Admin login:  eliyatwisa@gmail.com / 12345678\n•  Gemini endpoint:  POST /api/gemini/generate  {prompt:\"your text\"}\n"

#!/bin/bash
set -e
cd /var/www/kizazi

echo "🔧 1)  add trust proxy if missing …"
grep -q "trust proxy" server/server.js || \
  sed -i '0,/const app = express();/s//const app = express();\napp.set("trust proxy", 1);/' server/server.js

echo "👤 2)  upsert admin user …"
node <<'NODE'
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" });
import User from "./server/models/User.js";

await mongoose.connect(process.env.MONGODB_URI);
const filter = { email: "eliyatwisa@gmail.com" };
const update = {
  name: "Elly Twix",
  email: "eliyatwisa@gmail.com",
  role: "admin",
  password: "12345678"
};
const opts   = { upsert: true, new: true, setDefaultsOnInsert: true };
const admin  = await User.findOneAndUpdate(filter, update, opts);
console.log("✅  admin user id:", admin._id);
await mongoose.disconnect();
NODE

echo "🔑 3)  ensure OpenAI key placeholder …"
grep -q OPENAI_API_KEY server/.env || echo "OPENAI_API_KEY=" >> server/.env

echo "🚀 4)  rebuild frontend & restart backend …"
npm run build --silent
chown -R www-data:www-data dist && chmod -R 755 dist
pm2 restart kizazi-backend

echo -e "\n✅ All fixed!\n• Login / register should no longer throw network-error\n• Admin account ready – credentials:\n  email   : eliyatwisa@gmail.com\n  password: 12345678\n• Set your real OpenAI key in   server/.env   when you’re ready\n"

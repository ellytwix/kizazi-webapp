import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://eliyatwisa:Kizazi%402025%23@kizazi.bsqw4lj.mongodb.net/?retryWrites=true&w=majority&appName=KIZAZI';

console.log('Testing MongoDB connection...');
console.log('URI:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  });

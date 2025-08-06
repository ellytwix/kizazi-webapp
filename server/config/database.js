import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kizazi';
    
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    await mongoose.connect(mongoURI, options);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📍 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('📡 MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('📴 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    
    // Log specific connection errors
    if (error.name === 'MongoNetworkError') {
      console.error('🌐 Network error: Check if MongoDB is running and accessible');
    } else if (error.name === 'MongooseServerSelectionError') {
      console.error('🔍 Server selection error: Check MongoDB URI and network connectivity');
    } else if (error.name === 'MongoParseError') {
      console.error('📝 URI parse error: Check MongoDB connection string format');
    }
    
    process.exit(1);
  }
};

// Health check function
export const checkDBHealth = async () => {
  try {
    await mongoose.connection.db.admin().ping();
    return {
      status: 'healthy',
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      readyState: mongoose.connection.readyState,
      readyStateText: getReadyStateText(mongoose.connection.readyState)
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      readyState: mongoose.connection.readyState,
      readyStateText: getReadyStateText(mongoose.connection.readyState)
    };
  }
};

// Helper function to get readable connection state
const getReadyStateText = (state) => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[state] || 'unknown';
};

// Database initialization function for development
export const initializeDatabase = async () => {
  try {
    // Create indexes for better performance
    await mongoose.connection.db.collection('posts').createIndex({ user: 1, scheduledDate: 1 });
    await mongoose.connection.db.collection('posts').createIndex({ status: 1, scheduledDate: 1 });
    await mongoose.connection.db.collection('posts').createIndex({ platform: 1, scheduledDate: 1 });
    await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
    
    console.log('📊 Database indexes created successfully');
    
    // Log database statistics
    const stats = await mongoose.connection.db.stats();
    console.log(`📈 Database stats:`, {
      collections: stats.collections,
      documents: stats.objects,
      dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
      storageSize: `${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`
    });
    
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
};

export default connectDB;
import mongoose from 'mongoose';

// Centralized MongoDB config. Uses process.env.DBURL (e.g. mongodb://user:pass@host:port/dbname)
const connectDB = async () => {
  if (!process.env.DBURL) {
    console.error('DBURL environment variable is not set. Aborting DB connection.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.DBURL, {
      // useUnifiedTopology and useNewUrlParser are defaults in modern mongoose
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`MongoDB connection failed: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
export { mongoose };

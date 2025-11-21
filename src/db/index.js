// Compatibility re-export: delegate to new config which exports connectDB and mongoose
import connectDBConfig, { mongoose } from '../config/db.js';

const connectDB = connectDBConfig;

export default connectDB;
export { mongoose };
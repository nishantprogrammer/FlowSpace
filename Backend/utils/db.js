import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if(!process.env.MONGODB_URI) {
       console.log('No MONGODB_URI found. Mocking DB connection...');
       return;
    }
    
    // Debugging what Render is actually seeing:
    const maskedURI = process.env.MONGODB_URI.replace(/:([^:@]{4,})@/, ':****@');
    console.log(`[DEBUG] Attempting to connect to: ${maskedURI}`);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
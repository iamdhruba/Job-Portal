import "dotenv/config";
import mongoose from "mongoose";

const conn = process.env.MONGODB_URI;
const nodeEnv = process.env.NODE_ENV || "development";

export async function connectDB() {
    try {
        await mongoose.connect(conn, {
            // Connection pool options
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
        console.log(`MongoDB connected in ${nodeEnv} mode`);
        
        // Connection event handlers
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        
        // Gracefully close connection on process termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

import mongoose from "mongoose";

const conn = process.env.MONGODB_URI;

export async function connectDB() {
    await mongoose.connect(conn);
    console.log("MongoDB connected");
}

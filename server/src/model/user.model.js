import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: [true, "Username already exists"],
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email already exists"],
    },
    password: {
        type: String,
        required: true,
    },
});

export const User = mongoose.model("User", userSchema);

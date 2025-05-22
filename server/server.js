import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database/index.js";
import router from "./src/routes/user.route.js";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    cors({
        origin: "http://localhost:3000", // Replace with '*' to allow all origins
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true, // If you need cookies/auth headers
    })
);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "success",
    });
});

connectDB();

app.use("/user", router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;

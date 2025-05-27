import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database/index.js";
import userRouter from "./src/routes/user.route.js";
import jobRouter from "./src/routes/job.route.js";
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
        origin: ["http://localhost:5000", "http://localhost:5173"], // Allow both ports for dev
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "success",
    });
});

connectDB();

app.use("/api/users", userRouter); // Changed to be more specific
app.use("/api/jobs", jobRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;

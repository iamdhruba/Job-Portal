import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./database/index.js";
import userRouter from "./src/routes/user.route.js";
import jobRouter from "./src/routes/job.route.js";
import applyRouter from "./src/routes/apply.route.js";
import appStatusRouter from "./src/routes/status.route.js";
import { errorHandler, notFound } from "./src/middlewares/errorHandler.js";
import { rateLimiter } from "./src/middlewares/rateLimiter.js";
import logger, { requestLogger, errorLogger } from './utils/logger.js'; // ✅ Correct import
import { swaggerUi, specs } from "./src/docs/swagger.js";
import analytics from "./src/middlewares/analytics.js";
import path from "path";

dotenv.config();
const app = express();

// Middleware
app.use(helmet());
app.use(rateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || ["http://localhost:5000", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
  exposedHeaders: ["Authorization"],
}));

// Logging & analytics
app.use(requestLogger);
app.use(analytics);

// Static for uploads
app.use("/uploads", express.static(path.resolve("uploads")));

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "success" });
});

connectDB();
app.use("/api/users", userRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/apply", applyRouter);
app.use("/api/status", appStatusRouter);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// 404 handler
app.use(notFound);

// Error logging & handler
app.use(errorLogger);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;

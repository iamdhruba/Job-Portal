import express from "express";
import { registerUser, loginUser } from "../controller/user.controller.js";
import { hashPassword } from "../middlewares/passwordHash.js";

const router = express.Router();

router.post("/register", hashPassword, registerUser);
router.post("/login", loginUser);

export default router;

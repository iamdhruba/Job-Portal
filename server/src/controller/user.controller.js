import * as userViewModel from "../view/user.viewmodel.js";
import { generateToken, generateRefreshToken } from "../../utils/jwtUtils.js";
import bcrypt from "bcrypt";
import { User } from "../model/user.model.js";
import validator from "validator";
import logger from "../../utils/logger.js";
import { setInCache, deleteFromCache } from "../../utils/cache.js";

// Validate email format
const validateEmail = (email) => {
    return validator.isEmail(email);
};

// Validate password strength
const validatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number, one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

// Validate name (at least 2 characters, only letters, spaces, hyphens, and apostrophes)
const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    return nameRegex.test(name) && name.length >= 2;
};

// Validate company name (at least 2 characters, letters, numbers, spaces, hyphens, apostrophes, periods, and ampersands)
const validateCompanyName = (company) => {
    const companyRegex = /^[a-zA-Z0-9\s\-'.&]+$/;
    return companyRegex.test(company) && company.length >= 2;
};

/**
 * @swagger
 * /api/users/register/candidate:
 *   post:
 *     summary: Register a new candidate
 *     description: Register a new candidate user with name, email, and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Candidate registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Validation error or candidate already exists
 *       500:
 *         description: Internal server error
 */
// Register as candidate
export const registerCandidate = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                status: false,
                message: "Name, email and password are required",
            });
        }

        // Validate email format
        if (!validateEmail(email)) {
            return res.status(400).json({
                status: false,
                message: "Please provide a valid email address",
            });
        }

        // Validate name
        if (!validateName(name)) {
            return res.status(400).json({
                status: false,
                message: "Name must be at least 2 characters long and contain only letters, spaces, hyphens, and apostrophes",
            });
        }

        // Validate password strength
        if (!validatePassword(password)) {
            return res.status(400).json({
                status: false,
                message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            });
        }

        // Check if candidate already exists
        const existing = await User.findOne({ email, role: "candidate" });
        if (existing) {
            return res.status(400).json({
                status: false,
                message: "Candidate already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: "candidate",
        });
        await newUser.save();

        const token = generateToken({
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
        });

        const refreshToken = generateRefreshToken({
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
        });

        res.status(201).json({
            status: true,
            message: "Candidate registered successfully",
            data: newUser,
            token,
            refreshToken,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
};

// Register as recruiter
export const registerRecruiter = async (req, res) => {
    try {
        const { company, email, password } = req.body;
        
        // Validate required fields
        if (!company || !email || !password) {
            return res.status(400).json({
                status: false,
                message: "Company name, email and password are required",
            });
        }

        // Validate email format
        if (!validateEmail(email)) {
            return res.status(400).json({
                status: false,
                message: "Please provide a valid email address",
            });
        }

        // Validate company name
        if (!validateCompanyName(company)) {
            return res.status(400).json({
                status: false,
                message: "Company name must be at least 2 characters long and contain only letters, numbers, spaces, hyphens, apostrophes, periods, and ampersands",
            });
        }

        // Validate password strength
        if (!validatePassword(password)) {
            return res.status(400).json({
                status: false,
                message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            });
        }

        // Check if recruiter already exists
        const existing = await User.findOne({ email, role: "recruiter" });
        if (existing) {
            return res.status(400).json({
                status: false,
                message: "Recruiter already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: company,
            email,
            password: hashedPassword,
            role: "recruiter",
        });
        await newUser.save();

        const token = generateToken({
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
        });

        const refreshToken = generateRefreshToken({
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
        });

        res.status(201).json({
            status: true,
            message: "Recruiter registered successfully",
            data: newUser,
            token,
            refreshToken,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
};

/**
 * @swagger
 * /api/users/login/candidate:
 *   post:
 *     summary: Login as a candidate
 *     description: Authenticate a candidate user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
// Login as candidate
export const loginCandidate = async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({
            status: false,
            message: "Email and password are required",
        });
    }

    // Validate email format
    if (!validateEmail(email)) {
        return res.status(400).json({
            status: false,
            message: "Please provide a valid email address",
        });
    }

    try {
        const user = await User.findOne({ email, role: "candidate" });

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password",
            });
        }

        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });

        const refreshToken = generateRefreshToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });

        res.status(200).json({
            status: true,
            message: "Login successful",
            data: user,
            token,
            refreshToken,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
};

// Login as recruiter
export const loginRecruiter = async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({
            status: false,
            message: "Email and password are required",
        });
    }

    // Validate email format
    if (!validateEmail(email)) {
        return res.status(400).json({
            status: false,
            message: "Please provide a valid email address",
        });
    }

    try {
        const user = await User.findOne({ email, role: "recruiter" });

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password",
            });
        }

        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });

        const refreshToken = generateRefreshToken({
            id: user._id,
            email: user.email,
            role: user.role,
        });

        res.status(200).json({
            status: true,
            message: "Login successful",
            data: user,
            token,
            refreshToken,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
};

// Refresh token
export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({
            status: false,
            message: "Refresh token is required",
        });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        
        // Generate new tokens
        const token = generateToken({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        });

        const newRefreshToken = generateRefreshToken({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        });

        res.status(200).json({
            status: true,
            message: "Token refreshed successfully",
            token,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({
            status: false,
            message: "Invalid refresh token",
        });
    }
};

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude password field
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

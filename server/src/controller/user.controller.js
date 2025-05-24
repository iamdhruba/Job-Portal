import * as userViewModel from "../view/user.view.js";
import { generateToken } from "../../utils/jwtUtils.js";
import bcrypt from "bcrypt";
import { User } from "../model/user.model.js";

// Register as candidate
export const registerCandidate = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                status: false,
                message: "Name, email and password are required",
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

        res.status(201).json({
            status: true,
            message: "Candidate registered successfully",
            data: newUser,
            token,
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
        if (!company || !email || !password) {
            return res.status(400).json({
                status: false,
                message: "Company name, email and password are required",
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

        res.status(201).json({
            status: true,
            message: "Recruiter registered successfully",
            data: newUser,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
};

// Login as candidate
export const loginCandidate = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: false,
            message: "Email and password are required",
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

        res.status(200).json({
            status: true,
            message: "Login successful",
            data: user,
            token,
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

    if (!email || !password) {
        return res.status(400).json({
            status: false,
            message: "Email and password are required",
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

        res.status(200).json({
            status: true,
            message: "Login successful",
            data: user,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
};

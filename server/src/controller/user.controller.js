import * as userViewModel from "../view/user.view.js";
import { generateToken } from "../../utils/jwtUtils.js";
import bcrypt from "bcrypt";
import { User } from "../model/user.model.js";

export const registerUser = async (req, res) => {
    try {
        // console.log("Request body", req.body);
        const newUser = await userViewModel.registerUser(req.body);

        const token = generateToken({
            id: newUser._id,
            email: newUser.email,
        });

        res.status(201).json({
            status: true,
            message: "User created successfully",
            data: newUser,
            token,
        });
    } catch (error) {
        console.log(error);
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if ((!username && !email) || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({
            $or: [{ username: username }, { email: email }],
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Enter valid password",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Enter valid password",
            });
        }

        const token = generateToken({
            id: user._id,
            email: user.email,
            username: user.username,
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

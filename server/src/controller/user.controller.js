import * as userViewModel from "../view/user.view.js";
import { generateToken } from "../../utils/jwtUtils.js";
import bcrypt from "bcrypt";
import { User } from "../model/user.model.js";

export const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: "Email and password are required",
            });
        }

        const newUser = await userViewModel.registerUser({ email, password });

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
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: false,
            message: "Email and password are required",
        });
    }

    try {
        const user = await User.findOne({ email });

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

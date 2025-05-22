import { User } from "../model/user.model.js";

export const duplicateEmail = async (req, res, next) => {
    try {
        const { email } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                status: "error",
                message: "Email already exists",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error while checking email",
        });
    }
};

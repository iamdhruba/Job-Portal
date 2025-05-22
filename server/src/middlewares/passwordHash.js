import bcrypt from "bcrypt";

export const hashPassword = async (req, res, next) => {
    const { password } = req.body;

    if (!password || password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long",
        });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        req.body.password = hashedPassword;

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error hashing password",
        });
    }
};

import bcrypt from "bcrypt";

export const hashPassword = async (req, res, next) => {
    const { password, confirmpassword } = req.body;

    if (!password || !confirmpassword) {
        return res.status(400).json({
            success: false,
            message: "Password and confirm password are required",
        });
    }

    if (password !== confirmpassword) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match",
        });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        req.body.password = hashedPassword;
        req.body.confirmpassword = hashedPassword;

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error hashing password",
        });
    }
};

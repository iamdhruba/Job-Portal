export const validateUserInput = (req, res, next) => {
    const { username, email, password, confirmpassword } = req.body;

    if (!username || !email || !password || !confirmpassword) {
        return res.status(400).json({
            success: false,
            error: "All fields are required",
        });
    }

    if (password !== confirmpassword) {
        return res.status(400).json({
            success: false,
            error: "Passwords do not match",
        });
    }

    next();
};

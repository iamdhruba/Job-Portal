export const passwordCheck = (req, res, next) => {
    const { password } = req.body;

    const minLength = 8;
    const upperCase = /[A-Z]/.test(password);
    const lowerCase = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const symbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return res.status(400).json({
            status: "error",
            message: "Password must be at least 8 characters long",
        });
    }

    if (!upperCase) {
        return res.status(400).json({
            status: "error",
            message: "Password must have at least one upper case letter",
        });
    }

    if (!lowerCase) {
        return res.status(400).json({
            status: "error",
            message: "Password must have at least one lower case letter",
        });
    }

    if (!number) {
        return res.status(400).json({
            status: "error",
            message: "Password must have at least one number",
        });
    }

    if (!symbol) {
        return res.status(400).json({
            status: "error",
            message: "Password must have at least one symbol",
        });
    }

    next();
};

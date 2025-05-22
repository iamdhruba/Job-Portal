export const emptyPassword = async (req, res, next) => {
    try {
        const { password } = req.body;

        if (!password || password.trim() === "") {
            return res.status(200).json({
                success: true,
                message: "Password cannot be empty.",
            });
        }
        next();
    } catch (error) {
        console.log(error);
    }
};

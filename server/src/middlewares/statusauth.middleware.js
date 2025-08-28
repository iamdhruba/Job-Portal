export const isAuthenticated = (req, res, next) => {
    if (req.user) return next();
    return res.status(401).json({ message: "Unauthorized" });
};

export const isRecruiter = (req, res, next) => {
    if (req.user && req.user.role === "recruiter") return next();
    return res.status(403).json({ message: "Forbidden: Recruiter only" });
};

export const isJobSeeker = (req, res, next) => {
    if (req.user.role === "jobseeker") return next();
    return res.status(403).json({ message: "Forbidden: Job seeker only" });
};

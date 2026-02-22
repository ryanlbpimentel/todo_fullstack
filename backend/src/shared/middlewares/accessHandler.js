function access(required_level) {
    return function (req, res, next) {

        if (!req.user) return res.status(401).json({ error: "User not authenticated" });

        const perm = req.user.permission_level;

        if (Number(perm) < Number(required_level)) return res.status(403).json({ error: "User not authorized to access this resource" });

        next();
    }
}

export default access
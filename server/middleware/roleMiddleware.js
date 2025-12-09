// Middleware to check if user has one of the required roles
// Usage: verifyRole(['admin', 'logistics'])
// OR verifyRole('admin')

const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }

        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
        }

        next();
    };
};

module.exports = verifyRole;

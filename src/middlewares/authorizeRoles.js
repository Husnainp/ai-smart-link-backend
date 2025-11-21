// middlewares/authorizeRole.js
import { ApiError } from '../utils/ApiError.js';

 const authorizeRoles = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        console.log(userRole,allowedRoles,"....................................")
        
        if (!allowedRoles.includes(userRole)) {
            return next(new ApiError(403, 'Access denied: insufficient permissions'));
        }
        next();
    };
};

export default authorizeRoles;
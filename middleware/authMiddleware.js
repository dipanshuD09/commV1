import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new error('token failed');
        }
    }else {
        res.status(401);
        throw new Error('unauthorized access, no token');
    }
});

// Admin access
const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin === true){
        next();
    }else {
        res.status(401);
        throw new Error('Access Denied');
    }
}

export {protect, admin};
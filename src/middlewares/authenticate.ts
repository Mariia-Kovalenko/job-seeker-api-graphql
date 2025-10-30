import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');
import UserModel from '../models/User';
import { User } from '../types';

declare module 'express-serve-static-core' {
    interface Request {
      user?: User | null; // Specify User type
    }
}  

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        req.user = null;
        return next();
    }

    const token = authHeader.split(' ')[1];
    // console.log('received token in authenticate middleware', token);

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        const foundUser = await UserModel.findById(verified.id);
        if (!foundUser) {
            return res.status(400).json({ message: 'User not found' });
        }
        
        // Check if the token matches the stored token
        if (foundUser.token !== token) {
            return res.status(400).json({ message: 'User logged out' });
        }
        // console.log('found user in authenticate middleware', foundUser);
        console.log('compared token', foundUser.token, token);

        req.user = verified;

        console.log('req.user in authenticate middleware', req.user);
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

export default authenticate;
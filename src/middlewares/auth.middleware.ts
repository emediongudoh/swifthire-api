import { Request as ExpressRequest, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

// Interface for the request object
interface Request extends ExpressRequest {
    user?: {
        _id: string;
    };
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const header = req.header('Authorization');

        if (!header || !header.startsWith('Bearer ')) {
            return next(
                createHttpError(
                    401,
                    'Authorization header missing or malformed'
                )
            );
        }

        // Extract token by removing 'Bearer ' prefix
        const token = header.replace('Bearer ', '');

        // Verify and decode the JWT
        jwt.verify(token, process.env.JWT_SECRET!, (error, decoded) => {
            if (error || !decoded || typeof decoded !== 'object') {
                return next(createHttpError(401, 'Invalid or expired token'));
            }

            req.user = { _id: decoded._id as string };
            next();
        });
    } catch (error) {
        next(error);
    }
};

import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import createHttpError from 'http-errors';

// Models import
import User, { IUser, UserRole } from '../models/user.model';

// Register
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { fullname, email, password, role } = req.body;

        // Check if username length is at least 2 characters long
        const isValidFullname = validator.isLength(fullname, { min: 2 });
        if (!isValidFullname) {
            throw createHttpError.BadRequest(
                'Your fullname needs to be at least 2 characters long'
            );
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            throw createHttpError.BadRequest(
                'The email address you entered is not valid'
            );
        }

        // Check if email is already in use
        const emailExist = await User.findOne({ email });
        if (emailExist) {
            throw createHttpError.BadRequest(
                'This email address is already in use'
            );
        }

        // Validate password manually against the schema constraints
        const isValidPassword =
            /[a-z]/.test(password) &&
            /[A-Z]/.test(password) &&
            /\d/.test(password) &&
            password.length >= 8;

        if (!isValidPassword) {
            throw createHttpError.BadRequest(
                'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one digit'
            );
        }

        // Validate user role
        const validRoles = Object.values(UserRole);
        if (!validRoles.includes(role)) {
            throw createHttpError.BadRequest('Invalid user role');
        }

        // Create and save the user
        const user: IUser = await User.create({
            fullname,
            email,
            password,
            role,
        });

        // Return the newly registered user
        res.status(201).json({
            _id: user._id.toString(),
            fullname: user.fullname,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        next(error);
    }
};

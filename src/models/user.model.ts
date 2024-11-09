import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';

// Define user roles
export enum UserRole {
    SERVICE_PROVIDER = 'SERVICE_PROVIDER',
    CUSTOMER = 'CUSTOMER',
}

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    fullname: string;
    email: string;
    password: string;
    role: UserRole;
}

const userSchema: Schema<IUser> = new Schema(
    {
        fullname: {
            type: String,
            required: [true, 'Fullname is required'],
            unique: true,
            minLength: [
                2,
                'Your fullname needs to be at least 2 characters long',
            ],
        },
        email: {
            type: String,
            required: [true, 'Email address is required'],
            unique: true,
            lowercase: true,
            validate: [
                validator.isEmail,
                'The email address you entered is not valid',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [
                8,
                'Your password needs to be at least 8 characters long',
            ],
            validate: {
                validator: function (value) {
                    return (
                        /[a-z]/.test(value) && // at least one lowercase letter
                        /[A-Z]/.test(value) && // at least one uppercase letter
                        /\d/.test(value) // at least one digit
                    );
                },
                message:
                    'Password must contain at least one lowercase letter, one uppercase letter, and one digit',
            },
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.CUSTOMER,
        },
    },
    { collection: 'users', timestamps: true }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;

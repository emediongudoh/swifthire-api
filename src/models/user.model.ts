import mongoose, { Schema, Document, CallbackError } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

// Define user roles
export enum UserRole {
    PROVIDER = 'Provider',
    SEEKER = 'Seeker',
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
            default: UserRole.SEEKER,
        },
    },
    { collection: 'users', timestamps: true }
);

// Hash password on presave using `bcryptjs`
userSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error as CallbackError);
    }
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;

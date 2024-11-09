import jwt from 'jsonwebtoken';

interface ITokenPayload {
    [key: string]: any;
}

export const generateToken = (payload: ITokenPayload, expiresIn: string) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });
};

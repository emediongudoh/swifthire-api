'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.authMiddleware = void 0;
const http_errors_1 = __importDefault(require('http-errors'));
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const authMiddleware = async (req, res, next) => {
    try {
        const header = req.header('Authorization');
        if (!header || !header.startsWith('Bearer ')) {
            return next(
                (0, http_errors_1.default)(
                    401,
                    'Authorization header missing or malformed'
                )
            );
        }
        // Extract token by removing 'Bearer ' prefix
        const token = header.replace('Bearer ', '');
        // Verify and decode the JWT
        jsonwebtoken_1.default.verify(
            token,
            process.env.JWT_SECRET,
            (error, decoded) => {
                if (error || !decoded || typeof decoded !== 'object') {
                    return next(
                        (0, http_errors_1.default)(
                            401,
                            'Invalid or expired token'
                        )
                    );
                }
                req.user = { _id: decoded._id };
                next();
            }
        );
    } catch (error) {
        next(error);
    }
};
exports.authMiddleware = authMiddleware;

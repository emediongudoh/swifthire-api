'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const winston_1 = __importDefault(require('winston'));
// This snippet defines a Winston format that converts error messages into a format where their stack traces are used as messages
const enumerateErrorFormat = winston_1.default.format(info => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});
// This snippet creates a Winston logger that configures different logging levels and formats based on the environment, uses custom error formatting, and outputs logs to the console with errors directed to stderr
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: winston_1.default.format.combine(
        enumerateErrorFormat(),
        process.env.NODE_ENV === 'development'
            ? winston_1.default.format.colorize()
            : winston_1.default.format.uncolorize(),
        winston_1.default.format.splat(),
        winston_1.default.format.printf(
            ({ level, message }) => `${level}: ${message}`
        )
    ),
    transports: [
        new winston_1.default.transports.Console({
            stderrLevels: ['error'],
        }),
    ],
});
exports.default = logger;

'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const dotenv_1 = __importDefault(require('dotenv'));
const morgan_1 = __importDefault(require('morgan'));
const helmet_1 = __importDefault(require('helmet'));
const express_mongo_sanitize_1 = __importDefault(
    require('express-mongo-sanitize')
);
const cookie_parser_1 = __importDefault(require('cookie-parser'));
const compression_1 = __importDefault(require('compression'));
const cors_1 = __importDefault(require('cors'));
const express_fileupload_1 = __importDefault(require('express-fileupload'));
// Configs import
const logger_config_1 = __importDefault(require('./configs/logger.config'));
// Create express app
const app = (0, express_1.default)();
// Load env variables
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
// HTTP request logger middleware
if (process.env.NODE_ENV !== 'production') {
    app.use((0, morgan_1.default)('dev'));
}
// Secure express apps with various HTTP headers
app.use((0, helmet_1.default)());
// Parse JSON request body
app.use(express_1.default.json());
// Parse JSON request url
app.use(express_1.default.urlencoded({ extended: true }));
// Sanitize user-supplied data to prevent MongoDB operator injection
app.use((0, express_mongo_sanitize_1.default)());
// Enable cookie parser
app.use((0, cookie_parser_1.default)());
// Node.js compression middleware
app.use((0, compression_1.default)());
// Setup CORS
app.use((0, cors_1.default)());
// Simple express file upload middleware that wraps around `Busboy`
app.use((0, express_fileupload_1.default)({ useTempFiles: true }));
// Test route
app.post('/', (req, res) => {
    res.send(req.body);
});
// Start the dev server
let server = app.listen(PORT, () => {
    logger_config_1.default.info(`Server listening on port ${PORT}`);
});
// Terminate server on error
const exitHandler = () => {
    if (server) {
        logger_config_1.default.info(`Terminate the server on port ${PORT}`);
        process.exit(1);
    } else {
        process.exit(1);
    }
};
// Handle unexpected error
const unexpectedErrorHandler = err => {
    logger_config_1.default.error(err);
    exitHandler();
};
// Listen for server error logs
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
// Terminate server gracefully
process.on('SIGTERM', () => {
    if (server) {
        logger_config_1.default.info(`Terminate the server on port ${PORT}`);
        process.exit(1);
    }
});

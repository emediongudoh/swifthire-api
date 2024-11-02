import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import createHttpError from 'http-errors';

// Configs import
import logger from './configs/logger.config';

// Create express app
const app = express();

// Load env variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// HTTP request logger middleware
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Secure express apps with various HTTP headers
app.use(helmet());

// Parse JSON request body
app.use(express.json());

// Parse JSON request url
app.use(express.urlencoded({ extended: true }));

// Sanitize user-supplied data to prevent MongoDB operator injection
app.use(mongoSanitize());

// Enable cookie parser
app.use(cookieParser());

// Node.js compression middleware
app.use(compression());

// Setup CORS
app.use(cors());

// Simple express file upload middleware that wraps around `Busboy`
app.use(fileUpload({ useTempFiles: true }));

// Test route
app.post('/', (req: Request, res: Response) => {
    res.send(req.body);
});

// Start the dev server
let server = app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
});

// Catch all incoming 404 Not Found error
app.use(async (req, res, next) => {
    next(
        createHttpError.NotFound(
            'The requested resource could not be found on this server'
        )
    );
});

// Handle HTTP errors
app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    });
});

// Terminate server on error
const exitHandler = () => {
    if (server) {
        logger.info(`Terminate the server on port ${PORT}`);
        process.exit(1);
    } else {
        process.exit(1);
    }
};

// Handle unexpected error
const unexpectedErrorHandler = (err: unknown) => {
    logger.error(err);
    exitHandler();
};

// Listen for server error logs
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

// Terminate server gracefully
process.on('SIGTERM', () => {
    if (server) {
        logger.info(`Terminate the server on port ${PORT}`);
        process.exit(1);
    }
});

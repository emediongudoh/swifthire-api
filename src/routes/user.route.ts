import express from 'express';

// Controller imports
import { checkEmail, login, register } from '../controllers/user.controller';

// Create express router
const router = express.Router();

// Register endpoint
router.post('/register', register);

// Login endpoint
router.post('/login', login);

// Check email endpoint
router.post('/check-email', checkEmail);

export default router;

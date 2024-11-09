import express from 'express';

// Controller imports
import { login, register } from '../controllers/user.controller';

// Create express router
const router = express.Router();

// Register endpoint
router.post('/register', register);

// Login endpoint
router.post('/login', login);

export default router;

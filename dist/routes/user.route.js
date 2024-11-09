'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
// Controller imports
const user_controller_1 = require('../controllers/user.controller');
// Create express router
const router = express_1.default.Router();
// Register endpoint
router.post('/register', user_controller_1.register);
// Login endpoint
router.post('/login', user_controller_1.login);
exports.default = router;

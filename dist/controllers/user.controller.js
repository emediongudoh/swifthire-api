'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              var desc = Object.getOwnPropertyDescriptor(m, k);
              if (
                  !desc ||
                  ('get' in desc
                      ? !m.__esModule
                      : desc.writable || desc.configurable)
              ) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k];
                      },
                  };
              }
              Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, 'default', {
                  enumerable: true,
                  value: v,
              });
          }
        : function (o, v) {
              o['default'] = v;
          });
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (
                    k !== 'default' &&
                    Object.prototype.hasOwnProperty.call(mod, k)
                )
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.login = exports.register = void 0;
const validator_1 = __importDefault(require('validator'));
const http_errors_1 = __importDefault(require('http-errors'));
const bcryptjs_1 = __importDefault(require('bcryptjs'));
// Models import
const user_model_1 = __importStar(require('../models/user.model'));
// Utils import
const token_util_1 = require('../utils/token.util');
// Register
const register = async (req, res, next) => {
    try {
        const { fullname, email, password, role } = req.body;
        // Check if username length is at least 2 characters long
        const isValidFullname = validator_1.default.isLength(fullname, {
            min: 2,
        });
        if (!isValidFullname) {
            throw http_errors_1.default.BadRequest(
                'Your fullname needs to be at least 2 characters long'
            );
        }
        // Validate email format
        if (!validator_1.default.isEmail(email)) {
            throw http_errors_1.default.BadRequest(
                'The email address you entered is not valid'
            );
        }
        // Check if email is already in use
        const emailExist = await user_model_1.default.findOne({ email });
        if (emailExist) {
            throw http_errors_1.default.BadRequest(
                'This email address is already in use'
            );
        }
        // Validate password manually against the schema constraints
        const isValidPassword =
            /[a-z]/.test(password) &&
            /[A-Z]/.test(password) &&
            /\d/.test(password) &&
            password.length >= 8;
        if (!isValidPassword) {
            throw http_errors_1.default.BadRequest(
                'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one digit'
            );
        }
        // Validate user role
        const validRoles = Object.values(user_model_1.UserRole);
        if (!validRoles.includes(role)) {
            throw http_errors_1.default.BadRequest('Invalid user role');
        }
        // Create and save the user
        const user = await user_model_1.default.create({
            fullname,
            email,
            password,
            role,
        });
        // Generate JWT
        const token = (0, token_util_1.generateToken)(
            { _id: user._id.toString() },
            '7d'
        );
        // Return the newly registered user
        res.status(201).json({
            _id: user._id.toString(),
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        next(error);
    }
};
exports.register = register;
// Login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Check if email is valid
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            throw http_errors_1.default.BadRequest(
                'No account found for this email address. Retry again'
            );
        }
        // Check if password is correct
        const correctPass = await bcryptjs_1.default.compare(
            password,
            user.password
        );
        if (!correctPass) {
            throw http_errors_1.default.BadRequest(
                'Incorrect password. Retry again'
            );
        }
        // Generate JWT
        const token = (0, token_util_1.generateToken)(
            { _id: user._id.toString() },
            '7d'
        );
        // Return the logged-in user
        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        next(error);
    }
};
exports.login = login;

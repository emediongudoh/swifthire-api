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
exports.UserRole = void 0;
const mongoose_1 = __importStar(require('mongoose'));
const validator_1 = __importDefault(require('validator'));
const bcryptjs_1 = __importDefault(require('bcryptjs'));
// Define user roles
var UserRole;
(function (UserRole) {
    UserRole['PROVIDER'] = 'Provider';
    UserRole['SEEKER'] = 'Seeker';
})(UserRole || (exports.UserRole = UserRole = {}));
const userSchema = new mongoose_1.Schema(
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
                validator_1.default.isEmail,
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
            const salt = await bcryptjs_1.default.genSalt(12);
            const hashedPassword = await bcryptjs_1.default.hash(
                this.password,
                salt
            );
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error);
    }
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;

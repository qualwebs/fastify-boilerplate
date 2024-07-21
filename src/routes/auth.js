const LoginController = require('../controllers/auth/LoginController');
const SignupController = require('../controllers/auth/SignupController');
const VerificationController = require('../controllers/auth/VerificationController');
const ResetPasswordController = require('../controllers/auth/ResetPasswordController');

const signupSchema = {
    type: 'object',
    required: ['email', 'password', 'name'],
    properties: {
        name: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        password: {
            type: 'string'
        }
    },
    errorMessage: {
        required: {
            name: 'Name is a required field.', // specify error message for when the
            email: 'Email is a required field.', // property is missing from input
            password: 'Password is a required field.' // property is missing from input
        }
    }
}

const otpVerificationSchema = {
    type: 'object',
    required: ['email', 'otp'],
    properties: {
        otp: {
            type: 'number'
        },
        email: {
            type: 'string'
        }
    },
    errorMessage: {
        required: {
            otp: 'OTP is a required field.', // specify error message for when the
            email: 'Email is a required field.', // property is missing from input
        }
    }
}

async function userRoutes(app) {
    app.post('/signup', {schema: {body: signupSchema}}, SignupController.store);
    app.patch('/otp',{schema: {body: otpVerificationSchema}}, VerificationController.update);
    app.post('/otp', VerificationController.store);
    app.post('/login', LoginController.store);
    app.patch('/password', ResetPasswordController.replace);
}

module.exports = userRoutes;

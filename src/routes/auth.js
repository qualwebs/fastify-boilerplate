const LoginController = require('../controllers/auth/LoginController');
const SignupController = require('../controllers/auth/SignupController');
const VerificationController = require('../controllers/auth/VerificationController');

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

async function userRoutes(app) {
    app.post('/signup', {schema: {body: signupSchema}}, SignupController.store);
    app.post('/login', LoginController.store);
}

module.exports = userRoutes;

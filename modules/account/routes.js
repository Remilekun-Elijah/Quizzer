const api = require('express').Router();
const controller = require('../../controllers/account');
const Middlewares = require('../../middlewares/authorization')


api.post('/signup', controller.createUser);
api.get('/verify', controller.verifyAccount);
api.post('/resend-verification-email', Middlewares.validateAuthorization, controller.resendVerificationEmail);
api.post('/login', controller.login);
api.post('/change-password', Middlewares.validateAuthorization, controller.changePassword);

// api.post('/verify-email', controller.verifyEmail);
// api.post('/forgot-password', controller.forgotPassword);
// api.post('/reset-password', controller.resetPassword);
// api.post('/change-password', controller.changePassword);
// api.post('/change-password-by-token', controller.changePasswordByToken);


module.exports = api
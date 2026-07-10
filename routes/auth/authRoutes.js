
const {registerController,loginController,signInController,signUpController,logoutController,changePasswordController,handleChangePasswordController,forgotPasswordController,handleForgotPasswordController,verifyOtpController,handleVerifyOtpController,resetPasswordController,handleResetPasswordController} = require('../../controller/auth/authController')
const authRouter = require('express').Router();

function redirectIfAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.redirect('/pages/dashboard');
    }
    return next();
}

function requireAuth(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/auth/login');
}

authRouter.get('/register', registerController);
authRouter.post('/signUp', signUpController);
authRouter.post('/signIn', signInController);
authRouter.get('/login', redirectIfAuthenticated, loginController);
authRouter.get('/forgot-password', forgotPasswordController);
authRouter.post('/forgot-password', handleForgotPasswordController);
authRouter.get('/verify-otp/:id', verifyOtpController);
authRouter.post('/verify-otp', handleVerifyOtpController);
authRouter.get('/reset-password/:id', resetPasswordController);
authRouter.post('/reset-password', handleResetPasswordController);
authRouter.get('/changePassword', requireAuth, changePasswordController);
authRouter.post('/changePassword', requireAuth, handleChangePasswordController);
authRouter.get('/logout', logoutController);

module.exports = {authRouter};
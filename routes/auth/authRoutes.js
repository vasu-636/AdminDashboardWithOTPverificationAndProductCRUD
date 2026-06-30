
const {registerController , loginController,signInController, signUpController, logoutController} = require('../../controller/auth/authController')
const authRouter = require('express').Router();

function redirectIfAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.redirect('/pages/dashboard');
    }
    return next();
}

authRouter.get('/register',registerController);
authRouter.post('/signUp',signUpController)
authRouter.post('/signIn',signInController)
authRouter.get('/login', redirectIfAuthenticated, loginController);
authRouter.get('/logout', logoutController);

module.exports = {authRouter};
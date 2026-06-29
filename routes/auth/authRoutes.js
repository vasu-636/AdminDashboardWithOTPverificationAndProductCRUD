
const {registerController , loginController,signInController, signUpController, logoutController} = require('../../controller/auth/authController')
const authRouter = require('express').Router();

authRouter.get('/register',registerController);
authRouter.post('/signUp',signUpController)
authRouter.post('/signIn',signInController)
authRouter.get('/login',loginController);
authRouter.get('/logout', logoutController);

module.exports = {authRouter};
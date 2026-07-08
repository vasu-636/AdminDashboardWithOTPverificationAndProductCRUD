const bcrypt = require('bcrypt');
const passport = require('../../middleware/passport');
const User = require('../../models/UserModel/userModel');
const SALT_ROUNDS = 10;

const registerController = (req, res) => {
    console.log('Register Page Loaded Successfully!');
    res.render('register');
};

const signInController = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Error in signInController', err);
        }

        if (!user) {
            console.log('Login failed:', info?.message || 'Invalid credentials');
            return res.redirect('/auth/register');
        }

        req.logIn(user, (loginErr) => {
            if (loginErr) {
                console.error('Login error', loginErr);
            }
            req.user = user;
            return res.redirect('/pages/dashboard');
        });
    })(req, res, next);
};

const signUpController = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        console.log('User Added Successfully! User ---> ', user);
        return res.redirect('/auth/login');
    } catch (error) {
        console.log('Something Went Wrong .............', error);
    }
};

const logoutController = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error', err);
            return next(err);
        }

        req.session.destroy((sessionErr) => {
            if (sessionErr) {
                console.error('Session destroy error', sessionErr);
            }

            res.clearCookie('userId');
            res.clearCookie('connect.sid');
            console.log('Logout Done Successfully!');
            return res.redirect('/auth/login');
        });
    });
};

const changePasswordController = (req, res) => {
    console.log('Change Password Page Loaded Successfully!');
    res.render('changePassowrd', { error: null });
};

const forgotPasswordController = (req, res) => {
    res.render('forgot-password', { error: null, success: null });
};

const handleForgotPasswordController = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.render('forgot-password', { error: 'Please enter your email address.', success: null });
    }

    try {
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.render('forgot-password', {
                error: 'No user found with that email address.',
                success: null
            });
        }

        return res.redirect(`/auth/reset-password/${user._id}`);
    } catch (error) {
        console.error('Error in forgot password flow', error);
        return res.render('forgot-password', { error: 'Unable to process reset request. Please try again.', success: null });
    }
};

const resetPasswordController = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).exec();
        if (!user) {
            return res.render('reset-password', { error: 'Invalid user.', success: null, userId: null });
        }

        return res.render('reset-password', { error: null, success: null, userId: user._id });
    } catch (error) {
        console.error('Error loading reset password page', error);
        return res.render('reset-password', { error: 'Unable to load reset page.', success: null, userId: null });
    }
};

const handleResetPasswordController = async (req, res) => {
    const { userId, password, confirmPassword } = req.body;

    if (!userId || !password || !confirmPassword) {
        return res.render('reset-password', { error: 'All fields are required.', success: null, userId });
    }

    if (password !== confirmPassword) {
        return res.render('reset-password', { error: 'New password and confirm password do not match.', success: null, userId });
    }

    if (password.length < 6) {
        return res.render('reset-password', { error: 'Password must be at least 6 characters long.', success: null, userId });
    }

    try {
        const user = await User.findById(userId).exec();
        if (!user) {
            return res.render('reset-password', { error: 'Invalid user.', success: null, userId: null });
        }

        user.password = await bcrypt.hash(password, SALT_ROUNDS);
        await user.save();

        return res.redirect('/auth/login');
    } catch (error) {
        console.error('Error resetting password', error);
        return res.render('reset-password', { error: 'Unable to reset password. Please try again.', success: null, userId });
    }
};

const handleChangePasswordController = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.render('changePassowrd', { error: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
        return res.render('changePassowrd', { error: 'New password and confirm password do not match' });
    }

    try {
        const user = await User.findById(req.user._id).exec();
        if (!user) {
            return res.redirect('/auth/login');
        }

        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            return res.render('changePassowrd', { error: 'Old password does not match current password' });
        }

        user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await user.save();
        console.log('Password changed successfully for user:', user.email);
        return res.redirect('/auth/logout');
    } catch (error) {
        console.error('Error changing password', error);
        return res.render('changePassowrd', { error: 'Unable to change password. Please try again.' });
    }
};

const loginController = (req, res) => {
    console.log('Login Page Loaded Successfully!');
    res.render('login');
};

module.exports = {
    registerController,
    loginController,
    signInController,
    signUpController,
    logoutController,
    changePasswordController,
    handleChangePasswordController,
    forgotPasswordController,
    handleForgotPasswordController,
    resetPasswordController,
    handleResetPasswordController
};
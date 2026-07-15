const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT, 10) || 587,
        secure: parseInt(process.env.EMAIL_PORT, 10) === 465, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

const sendEmail = async ({ to, subject, html, text }) => {
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
            text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to} [Message ID: ${info.messageId}]`);
        return info;
    } catch (error) {
        console.error(`[Email Service Warning] Failed to send email to ${to}:`, error.message);
        console.log('NOTE: If you are using placeholder credentials in .env, please configure your real SMTP credentials (e.g. Gmail App Password) to deliver real emails.');
        return null;
    }
};

const getWelcomeEmailTemplate = (name = 'User') => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to adminHMD</title>
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0; color: #1e293b; }
        .email-container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0; }
        .email-header { background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 40px 30px; text-align: center; color: #ffffff; }
        .email-header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
        .email-header p { margin: 8px 0 0; font-size: 16px; opacity: 0.9; }
        .email-body { padding: 40px 30px; }
        .email-body h2 { font-size: 22px; color: #0f172a; margin-top: 0; margin-bottom: 16px; }
        .email-body p { font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
        .feature-list { background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 30px; border-left: 4px solid #4f46e5; }
        .feature-item { margin-bottom: 12px; font-size: 15px; color: #334155; }
        .feature-item strong { color: #0f172a; }
        .cta-button { display: inline-block; background: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); transition: background 0.3s; }
        .email-footer { background: #f8fafc; padding: 24px 30px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>adminHMD</h1>
            <p>Admin Dashboard & Management Portal</p>
        </div>
        <div class="email-body">
            <h2>Welcome aboard, ${name}! 🎉</h2>
            <p>We are thrilled to have you join <strong>adminHMD</strong>. Your account has been created successfully and you now have full access to our powerful admin dashboard, product catalog CRUD tools, and secure session management.</p>
            <div class="feature-list">
                <div class="feature-item">✓ <strong>Secure Authentication:</strong> Industry-standard bcrypt password hashing & session management.</div>
                <div class="feature-item">✓ <strong>Product & Category CRUD:</strong> Seamlessly organize, edit, and upload product assets.</div>
                <div class="feature-item">✓ <strong>OTP Verification:</strong> Robust recovery flow keeping your account safe.</div>
            </div>
            <div style="text-align: center; margin: 35px 0;">
                <a href="http://localhost:3001/auth/login" class="cta-button">Access Your Dashboard</a>
            </div>
            <p>If you have any questions or need support while exploring the dashboard, simply reply to this email.</p>
            <p style="margin-bottom: 0;">Best regards,<br><strong>The adminHMD Team</strong></p>
        </div>
        <div class="email-footer">
            &copy; ${new Date().getFullYear()} adminHMD. All rights reserved.<br>
            You received this email because you registered an account on our platform.
        </div>
    </div>
</body>
</html>
    `.trim();
};

const getOtpResetEmailTemplate = (name = 'User', otp) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP - adminHMD</title>
    <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0; color: #1e293b; }
        .email-container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0; }
        .email-header { background: linear-gradient(135deg, #ef4444 0%, #f97316 100%); padding: 40px 30px; text-align: center; color: #ffffff; }
        .email-header h1 { margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
        .email-header p { margin: 8px 0 0; font-size: 16px; opacity: 0.9; }
        .email-body { padding: 40px 30px; }
        .email-body h2 { font-size: 22px; color: #0f172a; margin-top: 0; margin-bottom: 16px; }
        .email-body p { font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
        .otp-box { background: #fef2f2; border: 2px dashed #f87171; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0; }
        .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #dc2626; font-family: monospace; }
        .otp-expires { font-size: 14px; color: #991b1b; margin-top: 10px; font-weight: 500; }
        .security-notice { background: #f8fafc; border-radius: 10px; padding: 18px; font-size: 14px; color: #64748b; margin-top: 30px; border-left: 4px solid #cbd5e1; }
        .email-footer { background: #f8fafc; padding: 24px 30px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>adminHMD</h1>
            <p>Security & Verification</p>
        </div>
        <div class="email-body">
            <h2>Password Reset Request 🔐</h2>
            <p>Hello ${name},<br>We received a request to reset the password for your <strong>adminHMD</strong> account. Please use the one-time verification code below to proceed with resetting your password:</p>
            <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <div class="otp-expires">⏱️ Code expires in <strong>10 minutes</strong></div>
            </div>
            <p>Enter this 6-digit verification code on the verification screen to unlock the password reset page.</p>
            <div class="security-notice">
                <strong>Security Alert:</strong> If you did not request a password reset, please ignore this email immediately or update your account password if you suspect unauthorized activity.
            </div>
            <p style="margin-top: 30px; margin-bottom: 0;">Stay secure,<br><strong>The adminHMD Team</strong></p>
        </div>
        <div class="email-footer">
            &copy; ${new Date().getFullYear()} adminHMD. All rights reserved.<br>
            This is an automated security notification. Please do not share your OTP with anyone.
        </div>
    </div>
</body>
</html>
    `.trim();
};

module.exports = {
    sendEmail,
    getWelcomeEmailTemplate,
    getOtpResetEmailTemplate
};

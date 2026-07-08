# Admin Panel With Password Hashing

A Node.js admin panel application built with Express, MongoDB, EJS, Passport, and bcrypt. It includes user registration/login, password hashing, session-based authentication, profile management, password reset/change, and blog management features.

## Features

- User registration and login
- Password hashing with bcrypt
- Local authentication using Passport.js
- Session-based auth with cookie support
- Admin dashboard UI
- Blog CRUD operations
- Image upload support for blog posts
- Change password for authenticated users
- Forgot password / reset password flow

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- EJS templates
- Passport.js + Passport Local Strategy
- bcrypt
- Multer

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- npm installed
- MongoDB running locally

The app connects to MongoDB at:

- mongodb://127.0.0.1:27017/adminPanel

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start MongoDB locally
4. Run the application:

```bash
npm start
```

The server will start on:

- http://localhost:3001

## Usage

- Visit `http://localhost:3001/auth/register` to create an account
- Visit `http://localhost:3001/auth/login` to sign in
- Visit `http://localhost:3001/auth/forgot-password` to begin a password reset
- Use `http://localhost:3001/auth/reset-password/:id` to set a new password after a valid reset request
- Authenticated users can change their password at `http://localhost:3001/auth/changePassword`
- After login, access the dashboard and blog management pages

## Project Structure

```bash
config/          # Database and app configuration
controller/      # Route handlers/controllers
middleware/      # Passport auth middleware
models/          # Mongoose models
public/          # Static assets (CSS, JS, images)
routes/          # Express routes
views/           # EJS templates
index.js         # Main server entry point
```

## Notes

- Passwords are securely hashed before being stored in the database.
- Protected routes require authentication.
- The forgot password flow validates registered users before allowing password reset.
- If you add email delivery later, the reset page can be updated to email reset links instead of redirecting by user ID.

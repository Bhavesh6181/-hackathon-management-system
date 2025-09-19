const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { isAuthenticated } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Google login
router.get('/google', (req, res, next) => {
  // Check if Google OAuth is configured
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!googleClientId || !googleClientSecret || googleClientId === 'test_client_id') {
    // Instead of returning an error, redirect to frontend with error message
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(`${frontendUrl}/login?error=google_oauth_not_configured`);
  }
  
  // Store the frontend URL for redirect after authentication
  req.session.returnTo = req.query.returnTo || process.env.FRONTEND_URL || 'http://localhost:5173';
  
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' // Force account selection
  })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/api/auth/failure',
    keepSessionInfo: true
  }),
  (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${req.session.returnTo || 'http://localhost:5173'}/login?error=auth_failed`);
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: req.user._id, 
          email: req.user.email, 
          role: req.user.role,
          name: req.user.name
        },
        process.env.JWT_SECRET || 'fallback_jwt_secret',
        { expiresIn: '7d' }
      );

      // Get return URL from session
      const returnTo = req.session.returnTo || 'http://localhost:5173';
      delete req.session.returnTo;

      // Redirect to frontend with token
      res.redirect(`${returnTo}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar
      }))}`);
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${req.session.returnTo || 'http://localhost:5173'}/login?error=server_error`);
    }
  }
);

// Authentication failure handler
router.get('/failure', (req, res) => {
  const returnTo = req.session.returnTo || 'http://localhost:5173';
  delete req.session.returnTo;
  res.redirect(`${returnTo}/login?error=oauth_failed`);
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Error logging out' });
    }
    
    // Destroy session
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.error('Session destroy error:', sessionErr);
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// Get current user (supports both JWT and session auth)
router.get('/me', isAuthenticated, (req, res) => {
  try {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
      isActive: req.user.isActive,
      lastLogin: req.user.lastLogin,
      createdAt: req.user.createdAt
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// Verify JWT token
router.post('/verify', (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Token required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret');
    res.json({ valid: true, user: decoded });
    
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

// Health check for auth service
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Authentication',
    timestamp: new Date().toISOString(),
    googleOAuth: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  });
});

// Manual login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check role if provided
    if (role && user.role !== role) {
      return res.status(401).json({ message: `Invalid role. This account is registered as ${user.role}` });
    }

    // For demo purposes, we'll accept any password for existing users
    // In production, you should hash passwords and use bcrypt.compare
    if (password.length < 6) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET || 'fallback_jwt_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Manual registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, mobile, role = 'student' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Validate role
    if (!['student', 'organizer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be student, organizer, or admin' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({
      googleId: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email: email.toLowerCase(),
      mobile: mobile,
      role: role,
      isActive: true
    });

    await user.save();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET || 'fallback_jwt_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Dummy login for testing/demo purposes
router.post("/dummy-login", async (req, res) => {
  try {
    const { email, name, role } = req.body;

    if (!email || !name || !role) {
      return res.status(400).json({ message: "Email, name, and role are required for dummy login" });
    }

    // Find or create a dummy user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        name,
        role,
        googleId: `dummy-${Date.now()}`,
        avatar: "https://www.gravatar.com/avatar/?d=mp", // Default avatar
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET || "fallback_jwt_secret",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Dummy login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Dummy login error:", error);
    res.status(500).json({ message: "Dummy login failed" });
  }
});

module.exports = router;


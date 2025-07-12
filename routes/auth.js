const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const adminEmails = require('../config/admins');
const auth = require('../middleware/auth'); // Added auth middleware

router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'No token provided' });

    // Get user info from Google using access token
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!userInfoResponse.ok) {
      const errorText = await userInfoResponse.text();
      return res.status(401).json({ error: 'Failed to get user info from Google', details: errorText });
    }

    const userInfo = await userInfoResponse.json();

    // Check if user is admin
    const isAdmin = adminEmails.includes(userInfo.email);

    // Find or create user
    let user = await User.findOne({ email: userInfo.email });
    if (!user) {
      user = await User.create({
        googleId: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        role: isAdmin ? 'admin' : 'user'
      });
    } else {
      // Update existing user's role if they are admin
      if (isAdmin && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture
      },
      redirectTo: isAdmin ? '/admin' : '/'
    });
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

router.get('/me', auth, (req, res) => {
  res.json(req.user); // req.user diisi oleh middleware auth
});

module.exports = router; 
const express = require('express');
const Feedback = require('./models/Feedback');
const { optionalAuth } = require('./middleware/auth');
const connectDB = require('./lib/db');

const router = express.Router();

// Connect to database on each request
router.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Submit feedback
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { name, email, subject, message, rating } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'Name, email, subject, and message are required' 
      });
    }

    const feedback = new Feedback({
      name,
      email,
      subject,
      message,
      rating: rating || 5,
      userId: req.user ? req.user.id : null,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    await feedback.save();

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: {
        id: feedback._id,
        name: feedback.name,
        email: feedback.email,
        subject: feedback.subject,
        message: feedback.message,
        rating: feedback.rating,
        createdAt: feedback.createdAt
      }
    });

  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
});

// Get all feedback (admin only - for future implementation)
router.get('/', async (req, res) => {
  try {
    // This would require admin authentication in a real implementation
    const { page = 1, limit = 10 } = req.query;
    
    const feedback = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Feedback.countDocuments();
    
    res.json({
      feedback,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ message: 'Failed to retrieve feedback' });
  }
});

module.exports = router;

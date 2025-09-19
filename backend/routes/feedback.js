const express = require('express');
const Feedback = require('../models/Feedback');
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const router = express.Router();

// Submit feedback (public endpoint)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, category } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject, and message are required' });
    }
    
    const feedback = new Feedback({
      name,
      email,
      subject,
      message,
      category: category || 'general'
    });
    
    await feedback.save();
    
    res.status(201).json({ 
      message: 'Feedback submitted successfully',
      id: feedback._id
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all feedback (admin only)
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { status, priority, category, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    
    const feedback = await Feedback.find(query)
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Feedback.countDocuments(query);
    
    res.json({
      feedback,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get feedback by ID (admin only)
router.get('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('resolvedBy', 'name email');
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update feedback status (admin only)
router.put('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { status, priority, adminNotes } = req.body;
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    if (status) feedback.status = status;
    if (priority) feedback.priority = priority;
    if (adminNotes) feedback.adminNotes = adminNotes;
    
    // If marking as resolved, set resolved fields
    if (status === 'resolved' && feedback.status !== 'resolved') {
      feedback.resolvedBy = req.user._id;
      feedback.resolvedAt = new Date();
    }
    
    await feedback.save();
    await feedback.populate('resolvedBy', 'name email');
    
    res.json(feedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete feedback (admin only)
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    await feedback.deleteOne();
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get feedback statistics (admin only)
router.get('/stats/summary', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const priorityStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const categoryStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const total = await Feedback.countDocuments();
    
    res.json({
      total,
      byStatus: stats,
      byPriority: priorityStats,
      byCategory: categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


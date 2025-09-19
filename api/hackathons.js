const express = require('express');
const Hackathon = require('./models/Hackathon');
const { optionalAuth, isAuthenticated, isOrganizerOrAdmin, isAdmin } = require('./middleware/auth');
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

// Get all hackathons (public with optional auth)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10, all } = req.query;
    let query = {};
    // Only admins can fetch all hackathons (including unapproved)
    if (all === 'true' && req.user && req.user.role === 'admin') {
      // No isApproved filter for admin
    } else {
      // For public access or non-admin users, only show approved hackathons
      query.isApproved = true;
    }
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    const hackathons = await Hackathon.find(query)
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Hackathon.countDocuments(query);
    res.json({
      hackathons,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get hackathons error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get hackathon by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('participants', 'name email');
    
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    
    // Only show unapproved hackathons to admins or organizers
    if (!hackathon.isApproved && (!req.user || (req.user.role !== 'admin' && hackathon.organizer._id.toString() !== req.user._id))) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    
    res.json(hackathon);
  } catch (error) {
    console.error('Get hackathon by ID error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create new hackathon (organizers only)
router.post('/', isAuthenticated, isOrganizerOrAdmin, async (req, res) => {
  try {
    const hackathon = new Hackathon({
      ...req.body,
      organizer: req.user.id
    });
    
    await hackathon.save();
    await hackathon.populate('organizer', 'name email');
    
    res.status(201).json(hackathon);
  } catch (error) {
    console.error('Create hackathon error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update hackathon (organizer or admin only)
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    
    // Check if user is organizer of this hackathon or admin
    if (hackathon.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    Object.assign(hackathon, req.body);
    await hackathon.save();
    await hackathon.populate('organizer', 'name email');
    
    res.json(hackathon);
  } catch (error) {
    console.error('Update hackathon error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete hackathon (organizer or admin only)
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    
    // Check if user is organizer of this hackathon or admin
    if (hackathon.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await hackathon.deleteOne();
    res.json({ message: 'Hackathon deleted successfully' });
  } catch (error) {
    console.error('Delete hackathon error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Register for hackathon (students only)
router.post('/:id/register', isAuthenticated, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    
    if (hackathon.participants.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already registered for this hackathon' });
    }
    
    if (hackathon.participants.length >= hackathon.maxParticipants) {
      return res.status(400).json({ message: 'Hackathon is full' });
    }
    
    if (new Date() > hackathon.registrationDeadline) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }
    
    hackathon.participants.push(req.user.id);
    await hackathon.save();
    
    res.json({ message: 'Successfully registered for hackathon' });
  } catch (error) {
    console.error('Register for hackathon error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Unregister from hackathon
router.post('/:id/unregister', isAuthenticated, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    
    hackathon.participants = hackathon.participants.filter(
      participant => participant.toString() !== req.user.id
    );
    
    await hackathon.save();
    res.json({ message: 'Successfully unregistered from hackathon' });
  } catch (error) {
    console.error('Unregister from hackathon error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user's hackathons
router.get('/user/my-hackathons', isAuthenticated, async (req, res) => {
  try {
    let hackathons;
    
    if (req.user.role === 'organizer' || req.user.role === 'admin') {
      // Get hackathons organized by user
      hackathons = await Hackathon.find({ organizer: req.user.id })
        .populate('organizer', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // Get hackathons user is registered for
      hackathons = await Hackathon.find({ participants: req.user.id })
        .populate('organizer', 'name email')
        .sort({ createdAt: -1 });
    }
    
    res.json(hackathons);
  } catch (error) {
    console.error('Get user hackathons error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Approve hackathon (admin only)
router.post('/:id/approve', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    
    hackathon.isApproved = true;
    await hackathon.save();
    
    res.json({ message: 'Hackathon approved successfully' });
  } catch (error) {
    console.error('Approve hackathon error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

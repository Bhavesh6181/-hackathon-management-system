const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  registrationDeadline: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value <= this.startDate;
      },
      message: 'Registration deadline must be before or on start date'
    }
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 1,
    max: 10000
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  teams: [{
    teamName: {
      type: String,
      required: true,
      trim: true
    },
    members: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      college: {
        type: String,
        required: true
      },
      year: {
        type: String,
        required: true
      },
      skills: [String],
      role: {
        type: String,
        enum: ['leader', 'member'],
        default: 'member'
      }
    }],
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  teamSize: {
    min: {
      type: Number,
      default: 3
    },
    max: {
      type: Number,
      default: 4
    }
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  prizes: [{
    position: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    },
    description: String
  }],
  requirements: {
    type: String,
    maxlength: 1000
  },
  rules: {
    type: String,
    maxlength: 2000
  },
  contactEmail: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  website: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Website must be a valid URL'
    }
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Image URL must be a valid URL'
    }
  }
}, {
  timestamps: true
});

// Index for search functionality
hackathonSchema.index({ title: 'text', description: 'text' });
hackathonSchema.index({ status: 1, isApproved: 1 });
hackathonSchema.index({ organizer: 1 });
hackathonSchema.index({ participants: 1 });

// Virtual for participant count
hackathonSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Virtual for spots remaining
hackathonSchema.virtual('spotsRemaining').get(function() {
  return this.maxParticipants - this.participants.length;
});

// Method to check if registration is open
hackathonSchema.methods.isRegistrationOpen = function() {
  const now = new Date();
  return now <= this.registrationDeadline && 
         this.participants.length < this.maxParticipants &&
         this.status === 'upcoming' &&
         this.isApproved;
};

// Method to check if user is registered
hackathonSchema.methods.isUserRegistered = function(userId) {
  return this.participants.some(participant => 
    participant.toString() === userId.toString()
  );
};

// Method to check if user is in any team
hackathonSchema.methods.isUserInTeam = function(userId) {
  return this.teams.some(team => 
    team.members.some(member => 
      member.user.toString() === userId.toString()
    )
  );
};

// Method to get team by user ID
hackathonSchema.methods.getTeamByUserId = function(userId) {
  return this.teams.find(team => 
    team.members.some(member => 
      member.user.toString() === userId.toString()
    )
  );
};

// Method to validate team size
hackathonSchema.methods.isValidTeamSize = function(teamSize) {
  return teamSize >= this.teamSize.min && teamSize <= this.teamSize.max;
};

// Method to get total team participants count
hackathonSchema.methods.getTotalTeamParticipants = function() {
  return this.teams.reduce((total, team) => total + team.members.length, 0);
};

// Pre-save middleware to update status based on dates
hackathonSchema.pre('save', function(next) {
  const now = new Date();
  
  if (this.status !== 'cancelled') {
    if (now < this.startDate) {
      this.status = 'upcoming';
    } else if (now >= this.startDate && now <= this.endDate) {
      this.status = 'ongoing';
    } else if (now > this.endDate) {
      this.status = 'completed';
    }
  }
  
  next();
});

// Ensure virtuals are included in JSON output
hackathonSchema.set('toJSON', { virtuals: true });
hackathonSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Hackathon', hackathonSchema);


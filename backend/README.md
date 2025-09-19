# Hackathon Management Backend

A robust Node.js/Express backend API for managing hackathons with Google OAuth authentication.

## Features

- 🔐 **Google OAuth 2.0 Authentication** - Secure login with Google accounts
- 👥 **User Management** - Role-based access control (Student, Organizer, Admin)
- 🏆 **Hackathon Management** - Create, manage, and participate in hackathons
- 💬 **Feedback System** - Collect and manage user feedback
- 🔒 **JWT Token Support** - Stateless authentication for API access
- 📊 **Session Management** - Persistent sessions with MongoDB storage
- 🌐 **CORS Support** - Cross-origin resource sharing for frontend integration
- 🛡️ **Security Features** - Input validation, error handling, and secure headers

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Google Cloud Console project with OAuth 2.0 credentials

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/hackathon_management
   
   # Secrets (generate strong secrets for production!)
   SESSION_SECRET=your_super_secret_session_key
   JWT_SECRET=your_super_secret_jwt_key
   
   # Google OAuth (get from Google Cloud Console)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

3. **Set up Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback` (development)
     - `https://yourdomain.com/api/auth/google/callback` (production)

4. **Start the server:**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/health` - Auth service health check

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT /api/users/:id/role` - Update user role (admin only)
- `PUT /api/users/:id/toggle-status` - Toggle user active status (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `PUT /api/users/profile` - Update own profile

### Hackathons
- `GET /api/hackathons` - Get all hackathons
- `POST /api/hackathons` - Create hackathon (organizer/admin)
- `GET /api/hackathons/:id` - Get hackathon details
- `PUT /api/hackathons/:id` - Update hackathon (owner/admin)
- `DELETE /api/hackathons/:id` - Delete hackathon (owner/admin)

### Feedback
- `GET /api/feedback` - Get all feedback (admin only)
- `POST /api/feedback` - Submit feedback
- `DELETE /api/feedback/:id` - Delete feedback (admin only)

### General
- `GET /api/health` - API health check
- `GET /` - API information

## Authentication Flow

### Google OAuth Flow
1. Frontend redirects to `/api/auth/google`
2. User authenticates with Google
3. Google redirects to `/api/auth/google/callback`
4. Backend creates/updates user and generates JWT
5. Backend redirects to frontend with JWT token
6. Frontend stores JWT and uses it for API requests

### JWT Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## User Roles

- **Student** - Can view and participate in hackathons
- **Organizer** - Can create and manage hackathons
- **Admin** - Full access to all features and user management

## Error Handling

The API returns consistent error responses:
```json
{
  "message": "Error description",
  "errors": ["Detailed error messages"] // For validation errors
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- **CORS Protection** - Configurable allowed origins
- **Session Security** - HTTP-only cookies, secure in production
- **Input Validation** - Mongoose schema validation
- **Error Sanitization** - No sensitive data in error responses
- **Rate Limiting** - Can be added with express-rate-limit
- **Helmet** - Can be added for security headers

## Production Deployment

### Environment Variables
Set these for production:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hackathon_management
SESSION_SECRET=generate_strong_secret_key
JWT_SECRET=generate_strong_jwt_secret
GOOGLE_CLIENT_ID=production_google_client_id
GOOGLE_CLIENT_SECRET=production_google_client_secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
FRONTEND_URL=https://yourdomain.com
```

### Security Checklist
- [ ] Use strong, unique secrets for SESSION_SECRET and JWT_SECRET
- [ ] Enable HTTPS in production
- [ ] Use MongoDB Atlas or secure MongoDB instance
- [ ] Configure proper CORS origins
- [ ] Set up proper Google OAuth redirect URIs
- [ ] Enable request logging and monitoring
- [ ] Set up backup strategy for database

## Development

### Project Structure
```
backend/
├── config/
│   └── passport.js          # Passport OAuth configuration
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   └── User.js              # User data model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User management routes
│   ├── hackathons.js        # Hackathon routes
│   └── feedback.js          # Feedback routes
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
├── server.js                # Main server file
└── README.md                # This file
```

### Adding New Features
1. Create model in `models/` if needed
2. Add routes in `routes/`
3. Add middleware in `middleware/` if needed
4. Update this README

## Troubleshooting

### Common Issues

**OAuth Infinite Loop:**
- Check Google OAuth credentials
- Verify callback URL matches Google Console
- Ensure frontend handles auth callback properly

**Database Connection:**
- Verify MongoDB is running
- Check MONGODB_URI format
- Ensure network connectivity

**CORS Errors:**
- Add frontend URL to CORS origins
- Check protocol (http vs https)
- Verify credentials: true in frontend requests

**Session Issues:**
- Check SESSION_SECRET is set
- Verify MongoDB session store connection
- Clear browser cookies if needed

### Logs
The server logs all requests and errors. Check console output for debugging information.

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

ISC License - see package.json for details.


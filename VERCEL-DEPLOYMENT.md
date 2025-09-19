# 🚀 Deploy Full-Stack Hackathon Management System on Vercel

## ✅ **Complete Vercel Functions Deployment Guide**

This guide will help you deploy your **entire hackathon management system** on Vercel using **Vercel Functions** (serverless API routes).

## 🎯 **What We've Set Up**

### **Project Structure:**
```
hackathon-management-full-stack/
├── api/                    # Vercel Functions (Backend)
│   ├── index.js           # Main API entry point
│   ├── auth.js            # Authentication routes
│   ├── hackathons.js      # Hackathon routes
│   ├── users.js           # User management routes
│   ├── feedback.js        # Feedback routes
│   ├── models/            # Database models
│   ├── middleware/        # Authentication middleware
│   └── lib/               # Utilities (database connection)
├── frontend/              # React Frontend
│   ├── src/
│   ├── package.json
│   └── vercel.json
├── backend/               # Original backend (kept for reference)
├── vercel.json           # Main Vercel configuration
└── package.json          # Root package.json
```

## 🚀 **Quick Deployment Steps**

### **Step 1: Prepare Your Repository**

1. **Commit all changes to Git:**
   ```bash
   git add .
   git commit -m "Setup Vercel Functions deployment"
   git push origin main
   ```

### **Step 2: Deploy to Vercel**

1. **Go to [vercel.com](https://vercel.com) and sign in**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Vercel will auto-detect the configuration from `vercel.json`**

### **Step 3: Configure Environment Variables**

In your Vercel dashboard, add these environment variables:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hackathon_management

# Security
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
SESSION_SECRET=your-super-secret-session-key-minimum-32-characters-long

# Frontend URL (will be auto-set by Vercel)
FRONTEND_URL=https://your-app.vercel.app

# Environment
NODE_ENV=production
```

### **Step 4: Deploy**

1. **Click "Deploy"**
2. **Wait for deployment to complete**
3. **Your app will be live at `https://your-app.vercel.app`**

## 🗄️ **Database Setup (MongoDB Atlas)**

1. **Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)**
2. **Create a free cluster**
3. **Create a database user**
4. **Whitelist all IP addresses (0.0.0.0/0)**
5. **Get your connection string**
6. **Use it as `MONGODB_URI` in Vercel**

## 🌐 **Your Deployed URLs**

After deployment:
- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://your-app.vercel.app/api`
- **Health Check**: `https://your-app.vercel.app/api/health`

## 🧪 **Testing Your Deployment**

### **1. Test API Endpoints:**
```bash
# Health check
curl https://your-app.vercel.app/api/health

# Register a user
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "mobile": "+919876543210",
    "role": "student"
  }'
```

### **2. Test Frontend:**
1. **Visit your frontend URL**
2. **Try registering a new user**
3. **Create a hackathon as an organizer**
4. **Login as admin and approve hackathons**
5. **Browse and register for hackathons as a student**

## 🔧 **Local Development with Vercel**

### **Install Vercel CLI:**
```bash
npm install -g vercel
```

### **Run Locally:**
```bash
# Install dependencies
npm run install:all

# Start local development
vercel dev
```

This will run both frontend and API locally with Vercel's development environment.

## 📋 **Environment Variables Reference**

### **Required Variables:**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hackathon_management
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
SESSION_SECRET=your-super-secret-session-key-minimum-32-characters
NODE_ENV=production
```

### **Optional Variables:**
```bash
FRONTEND_URL=https://your-app.vercel.app  # Auto-set by Vercel
```

## 🎯 **API Endpoints Available**

### **Authentication (`/api/auth`):**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/dummy-login` - Demo login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### **Hackathons (`/api/hackathons`):**
- `GET /api/hackathons` - Get all hackathons
- `GET /api/hackathons/:id` - Get hackathon by ID
- `POST /api/hackathons` - Create hackathon (organizer)
- `PUT /api/hackathons/:id` - Update hackathon
- `DELETE /api/hackathons/:id` - Delete hackathon
- `POST /api/hackathons/:id/register` - Register for hackathon
- `POST /api/hackathons/:id/approve` - Approve hackathon (admin)

### **Users (`/api/users`):**
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id/role` - Update user role (admin)
- `PUT /api/users/profile` - Update user profile

### **Feedback (`/api/feedback`):**
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get all feedback

## 🔍 **Monitoring & Debugging**

### **Vercel Dashboard:**
1. **Go to your project dashboard**
2. **Check "Functions" tab for API logs**
3. **Check "Analytics" for usage statistics**

### **API Logs:**
- View real-time logs in Vercel dashboard
- Check for database connection issues
- Monitor API response times

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **Database Connection Errors:**
   - Verify `MONGODB_URI` is correct
   - Check MongoDB Atlas IP whitelist
   - Ensure database user has proper permissions

2. **CORS Errors:**
   - Check if `FRONTEND_URL` is set correctly
   - Verify frontend URL in CORS configuration

3. **Build Failures:**
   - Check Vercel build logs
   - Verify all dependencies are in package.json
   - Ensure Node.js version compatibility

4. **API Not Working:**
   - Check function logs in Vercel dashboard
   - Verify environment variables are set
   - Test API endpoints with curl/Postman

### **Debug Commands:**
```bash
# Check Vercel CLI version
vercel --version

# View deployment logs
vercel logs

# Check function status
vercel ls
```

## 💡 **Pro Tips**

1. **Use MongoDB Atlas** for production database
2. **Set strong JWT secrets** (minimum 32 characters)
3. **Monitor your Vercel usage** (free tier has limits)
4. **Use custom domains** for production
5. **Enable Vercel Analytics** for insights
6. **Set up Vercel Notifications** for deployment alerts

## 🎉 **You're Done!**

Your **complete hackathon management system** is now live on Vercel with:

- ✅ **Frontend** served as static files
- ✅ **Backend API** as serverless functions
- ✅ **Database** connected to MongoDB Atlas
- ✅ **Authentication** system working
- ✅ **Hackathon management** workflow
- ✅ **Indian localization** (₹ currency, mobile validation)
- ✅ **Responsive design**
- ✅ **Production-ready** with proper error handling

## 🌍 **Global Access**

Your application is now accessible worldwide with:
- **Automatic HTTPS**
- **Global CDN**
- **Serverless scaling**
- **Zero server management**

**Congratulations! Your hackathon management system is live! 🚀**

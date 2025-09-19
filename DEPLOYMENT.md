# 🚀 Deployment Guide for Hackathon Management System

## 📋 **Deployment Strategy**

This full-stack application requires both frontend and backend deployment. Here are the recommended approaches:

## 🎯 **Option 1: Vercel (Frontend) + Railway (Backend) - RECOMMENDED**

### **Frontend Deployment on Vercel:**

1. **Connect your GitHub repository to Vercel**
2. **Configure build settings:**
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

### **Backend Deployment on Railway:**

1. **Connect your GitHub repository to Railway**
2. **Configure build settings:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hackathon_management
   JWT_SECRET=your-super-secret-jwt-key
   SESSION_SECRET=your-super-secret-session-key
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

## 🎯 **Option 2: Vercel Functions (Full-Stack on Vercel)**

For this option, we need to restructure the backend as Vercel serverless functions.

### **Steps:**

1. **Create `api/` directory in the root**
2. **Move backend routes to `api/` directory**
3. **Update package.json scripts**
4. **Deploy everything to Vercel**

## 🎯 **Option 3: Railway (Full-Stack)**

Deploy both frontend and backend on Railway:

1. **Frontend**: Build and serve static files from backend
2. **Backend**: Serve both API and static frontend files

## 📦 **Pre-Deployment Checklist**

### **Backend:**
- [ ] Update CORS settings for production
- [ ] Set up MongoDB Atlas
- [ ] Configure environment variables
- [ ] Test all API endpoints

### **Frontend:**
- [ ] Update API base URL
- [ ] Test build process
- [ ] Verify all features work with production API

## 🔧 **Quick Setup Commands**

### **For Railway (Backend):**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### **For Vercel (Frontend):**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

## 🌐 **Production URLs**

After deployment, your URLs will be:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`

## ⚠️ **Important Notes**

1. **Database**: Use MongoDB Atlas for production
2. **Environment Variables**: Set all required env vars
3. **CORS**: Update CORS settings for production domains
4. **Security**: Use strong JWT secrets
5. **Google OAuth**: Update OAuth redirect URLs

## 🐛 **Troubleshooting**

- Check build logs in deployment platform
- Verify environment variables are set
- Test API endpoints with Postman
- Check browser console for errors

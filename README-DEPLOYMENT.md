# 🚀 Deploy Hackathon Management System to Vercel

## ✅ **Yes, you can deploy this project on Vercel!**

This guide will help you deploy your hackathon management system with the **recommended approach**: Frontend on Vercel + Backend on Railway.

## 🎯 **Quick Start (5 minutes)**

### **Step 1: Prepare for Deployment**
```bash
# Clone your repository
git clone <your-repo-url>
cd hackathon-management-full-stack

# Install dependencies
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### **Step 2: Deploy Frontend to Vercel**

1. **Go to [vercel.com](https://vercel.com) and sign in**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure build settings:**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variable:**
   ```
   VITE_API_URL = https://your-backend-url.railway.app/api
   ```

6. **Click "Deploy"**

### **Step 3: Deploy Backend to Railway**

1. **Go to [railway.app](https://railway.app) and sign in**
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose your repository**
5. **Configure settings:**
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

6. **Add Environment Variables:**
   ```
   NODE_ENV = production
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/hackathon_management
   JWT_SECRET = your-super-secret-jwt-key-here
   SESSION_SECRET = your-super-secret-session-key-here
   FRONTEND_URL = https://your-frontend.vercel.app
   ```

7. **Click "Deploy"**

## 🛠️ **Alternative: Automated Deployment**

### **Windows:**
```cmd
# Run the deployment script
deploy.bat
```

### **Linux/Mac:**
```bash
# Make script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

## 📋 **Environment Variables Setup**

### **Frontend (Vercel):**
```
VITE_API_URL = https://your-backend.railway.app/api
```

### **Backend (Railway):**
```
NODE_ENV = production
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/hackathon_management
JWT_SECRET = your-super-secret-jwt-key-minimum-32-characters
SESSION_SECRET = your-super-secret-session-key-minimum-32-characters
FRONTEND_URL = https://your-frontend.vercel.app
```

## 🗄️ **Database Setup (MongoDB Atlas)**

1. **Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)**
2. **Create a free cluster**
3. **Create a database user**
4. **Whitelist all IP addresses (0.0.0.0/0)**
5. **Get your connection string**
6. **Use it as MONGODB_URI in Railway**

## 🌐 **After Deployment**

Your URLs will be:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`
- **API**: `https://your-app.railway.app/api`

## 🧪 **Testing Your Deployment**

1. **Visit your frontend URL**
2. **Try registering a new user**
3. **Create a hackathon as an organizer**
4. **Login as admin and approve the hackathon**
5. **Browse hackathons as a student**

## 🔧 **Troubleshooting**

### **Frontend Issues:**
- Check if `VITE_API_URL` is set correctly
- Verify the API URL is accessible
- Check browser console for errors

### **Backend Issues:**
- Verify all environment variables are set
- Check Railway logs for errors
- Ensure MongoDB connection is working

### **Common Problems:**

1. **CORS Errors:**
   - Make sure `FRONTEND_URL` is set in backend
   - Check if frontend URL is correct

2. **Database Connection:**
   - Verify MongoDB Atlas connection string
   - Check if IP is whitelisted

3. **Build Failures:**
   - Check if all dependencies are in package.json
   - Verify Node.js version compatibility

## 💡 **Pro Tips**

1. **Use MongoDB Atlas** for production database
2. **Set strong JWT secrets** (minimum 32 characters)
3. **Monitor your deployments** in both Vercel and Railway dashboards
4. **Use custom domains** for production
5. **Enable HTTPS** (automatic on Vercel/Railway)

## 🆘 **Need Help?**

- Check the logs in Vercel/Railway dashboards
- Test API endpoints with Postman
- Verify environment variables are set correctly
- Check the browser console for frontend errors

## 🎉 **You're Done!**

Your hackathon management system is now live and accessible worldwide! 🌍

The system includes:
- ✅ User registration with Indian mobile numbers
- ✅ Hackathon creation and approval workflow
- ✅ Student registration system
- ✅ Admin moderation dashboard
- ✅ Indian currency and localization
- ✅ Responsive design

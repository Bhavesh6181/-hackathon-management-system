#!/bin/bash

# 🚀 Vercel Full-Stack Deployment Script

echo "🚀 Starting Vercel Full-Stack Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
print_status "Checking requirements..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "Requirements check passed!"

# Install dependencies
print_status "Installing dependencies..."

print_status "Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    print_error "Root dependency installation failed!"
    exit 1
fi

print_status "Installing API dependencies..."
cd api
npm install
if [ $? -ne 0 ]; then
    print_error "API dependency installation failed!"
    exit 1
fi
cd ..

print_status "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    print_error "Frontend dependency installation failed!"
    exit 1
fi

print_status "Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Frontend build failed!"
    exit 1
fi
cd ..

print_success "Build completed successfully!"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        print_error "Failed to install Vercel CLI!"
        exit 1
    fi
fi

echo ""
echo "🎯 Vercel Full-Stack Deployment"
echo "=============================="
echo ""
echo "Your project is now ready for Vercel deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Run: vercel login"
echo "2. Run: vercel --prod"
echo "3. Set environment variables in Vercel dashboard:"
echo "   - MONGODB_URI"
echo "   - JWT_SECRET"
echo "   - SESSION_SECRET"
echo "   - NODE_ENV=production"
echo ""
echo "📚 For detailed instructions, see VERCEL-DEPLOYMENT.md"
echo ""

read -p "Do you want to deploy now? (y/n): " choice

if [[ $choice == "y" || $choice == "Y" ]]; then
    print_status "Starting Vercel deployment..."
    vercel --prod
    if [ $? -ne 0 ]; then
        print_error "Vercel deployment failed!"
        exit 1
    fi
    print_success "🎉 Deployment completed!"
else
    print_status "Deployment skipped. You can run 'vercel --prod' when ready."
fi

echo ""
echo "📋 Environment Variables to set in Vercel:"
echo "=========================================="
echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hackathon_management"
echo "JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters"
echo "SESSION_SECRET=your-super-secret-session-key-minimum-32-characters"
echo "NODE_ENV=production"
echo ""
echo "🌐 Your app will be available at: https://your-app.vercel.app"
echo ""

exit 0

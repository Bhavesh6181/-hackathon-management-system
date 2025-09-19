#!/bin/bash

# 🚀 Hackathon Management System Deployment Script

echo "🚀 Starting deployment process..."

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

# Check if required tools are installed
check_requirements() {
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
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Build for production
    print_status "Building frontend for production..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Frontend build completed successfully!"
    else
        print_error "Frontend build failed!"
        exit 1
    fi
    
    cd ..
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying frontend to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    cd frontend
    
    # Deploy to Vercel
    vercel --prod
    
    if [ $? -eq 0 ]; then
        print_success "Frontend deployed to Vercel successfully!"
    else
        print_error "Vercel deployment failed!"
        exit 1
    fi
    
    cd ..
}

# Deploy to Railway
deploy_railway() {
    print_status "Deploying backend to Railway..."
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not found. Installing..."
        npm install -g @railway/cli
    fi
    
    cd backend
    
    # Deploy to Railway
    railway up
    
    if [ $? -eq 0 ]; then
        print_success "Backend deployed to Railway successfully!"
    else
        print_error "Railway deployment failed!"
        exit 1
    fi
    
    cd ..
}

# Main deployment function
main() {
    echo "🎯 Hackathon Management System Deployment"
    echo "========================================"
    
    check_requirements
    build_frontend
    
    echo ""
    echo "Choose deployment option:"
    echo "1) Deploy frontend to Vercel only"
    echo "2) Deploy backend to Railway only"
    echo "3) Deploy both (recommended)"
    echo "4) Exit"
    
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            deploy_vercel
            ;;
        2)
            deploy_railway
            ;;
        3)
            deploy_vercel
            deploy_railway
            ;;
        4)
            print_status "Deployment cancelled."
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
    
    echo ""
    print_success "🎉 Deployment completed!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Set environment variables in your deployment platform"
    echo "2. Update CORS settings with your frontend URL"
    echo "3. Test your deployed application"
    echo ""
    echo "📚 For detailed instructions, see DEPLOYMENT.md"
}

# Run main function
main

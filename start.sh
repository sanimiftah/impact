#!/bin/bash

# Impact Platform - Quick Start Script
echo "🚀 Starting Impact Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Start API server in background
echo "🔧 Starting API server..."
cd api
if [ ! -d "node_modules" ]; then
    echo "📦 Installing API dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "⚙️ Creating environment file..."
    cp .env.example .env
fi

echo "🌐 Starting API server on port 3001..."
npm start &
API_PID=$!

# Wait for API to start
sleep 3

# Start frontend server
echo "💻 Starting frontend server..."
cd ..

# Check if we have a simple HTTP server available
if command -v python3 &> /dev/null; then
    echo "🐍 Using Python HTTP server on port 8000..."
    cd public
    python3 -m http.server 8000 &
    FRONTEND_PID=$!
elif command -v php &> /dev/null; then
    echo "🐘 Using PHP development server on port 8000..."
    cd public
    php -S localhost:8000 &
    FRONTEND_PID=$!
else
    echo "📁 No HTTP server available. Please open public/index.html in your browser."
    FRONTEND_PID=""
fi

echo ""
echo "✅ Impact Platform is now running!"
echo "┌─────────────────────────────────────────┐"
echo "│  🌐 Frontend: http://localhost:8000     │"
echo "│  🔌 API: http://localhost:3001          │"
echo "│  ❤️ Health: http://localhost:3001/health│"
echo "│  📚 API Docs: http://localhost:3001/api │"
echo "└─────────────────────────────────────────┘"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    if [ ! -z "$API_PID" ]; then
        kill $API_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    echo "👋 Goodbye!"
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Keep script running
wait

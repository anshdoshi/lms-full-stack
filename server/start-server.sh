#!/bin/bash

# Yunay-CA Academy Server Startup Script
# This script ensures the server starts on port 5001 to avoid macOS port conflicts

echo "🚀 Starting Yunay-CA Academy Server..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "📝 Please create a .env file with required environment variables."
    echo "   See .env.example for reference."
    echo ""
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Kill any process using port 5001
echo "🔍 Checking for processes on port 5001..."
if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 5001 is in use. Attempting to free it..."
    lsof -ti:5001 | xargs kill -9 2>/dev/null
    sleep 2
    echo "✅ Port 5001 freed"
fi

# Start the server on port 5001
echo "🎯 Starting server on port 5001..."
echo ""
PORT=5001 npm run server

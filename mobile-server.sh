#!/bin/bash

echo "🌐 IMPACT Mobile Web Server"
echo "=========================="
echo ""

# Kill any existing server on port 8000
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

# Change to the public directory where your HTML files are
cd "$(dirname "$0")/public"

# Get your Mac's IP address
IP=$(ifconfig en0 | grep 'inet ' | awk '{print $2}')
if [ -z "$IP" ]; then
    IP=$(ifconfig en1 | grep 'inet ' | awk '{print $2}')
fi

echo "📱 Your Mac's IP: $IP"
echo ""
echo "🔗 Open these URLs on your phone's browser:"
echo "   Main Page: http://$IP:8000/test-index.html"
echo "   Dashboard: http://$IP:8000/dashboard.html"
echo "   Seedboard: http://$IP:8000/seedboard.html"
echo ""
echo "📋 IMPORTANT - Make sure:"
echo "   ✅ Your phone is connected to the SAME WiFi network"
echo "   ✅ Open Safari/Chrome on your phone"
echo "   ✅ Type the URL exactly (don't try to open HTML files)"
echo "   ✅ If it doesn't work, turn off Mac firewall temporarily"
echo ""
echo "⏹️  Press Ctrl+C to stop the server"
echo "🚀 Starting web server..."
echo ""

# Start the Python web server that binds to all network interfaces
python3 -m http.server 8000 --bind 0.0.0.0

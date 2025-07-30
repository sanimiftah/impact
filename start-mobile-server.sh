#!/bin/bash

echo "🚀 Starting IMPACT Mobile Preview Server..."
echo ""

# Kill any existing server on port 8000
echo "🔄 Stopping any existing server on port 8000..."
pkill -f "python3 -m http.server 8000" 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

# Get local IP address (try multiple interfaces)
IP=""
for interface in en0 en1 wlan0 eth0; do
    IP=$(ifconfig $interface 2>/dev/null | grep 'inet ' | awk '{print $2}' | head -1)
    if [ ! -z "$IP" ] && [ "$IP" != "127.0.0.1" ]; then
        break
    fi
done

if [ -z "$IP" ]; then
    echo "❌ Could not find IP address. Using localhost..."
    IP="localhost"
fi

echo "📱 Your local IP address: $IP"
echo "🌐 Access your project on mobile at: http://$IP:8000"
echo ""
echo "📋 Quick Access URLs:"
echo "   • Main Page: http://$IP:8000/test-index.html"
echo "   • Seedboard: http://$IP:8000/seedboard.html"
echo "   • Dashboard: http://$IP:8000/dashboard_enhanced.html"
echo ""
echo "💡 TROUBLESHOOTING TIPS:"
echo "   1. Make sure your phone is on the same WiFi network!"
echo "   2. Try turning off Mac firewall temporarily"
echo "   3. If IP doesn't work, try: http://192.168.1.XXX:8000"
echo "   4. On iPhone: Settings > WiFi > (i) > Check IP range"
echo ""
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

# Change to public directory and start server with binding to all interfaces
cd public
echo "🌍 Starting server on all interfaces..."
python3 -m http.server 8000 --bind 0.0.0.0

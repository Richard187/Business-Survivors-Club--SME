#!/bin/bash

# SME Connect SMS System Deployment Script
# This script helps deploy the SMS API to a production server

echo "🚀 SME Connect SMS System Deployment"
echo "====================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create data directory
echo "📁 Creating data directory..."
mkdir -p sms-data

# Set permissions
chmod 755 sms-data

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Create PM2 ecosystem file
echo "⚙️ Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'sme-sms-api',
    script: 'sms-api.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
EOF

echo "✅ PM2 configuration created"

# Start the application
echo "🚀 Starting SMS API server..."
pm2 start ecosystem.config.js --env production

if [ $? -eq 0 ]; then
    echo "✅ SMS API server started successfully"
    echo ""
    echo "📋 Deployment Summary:"
    echo "- API running on port 3001"
    echo "- PM2 process: sme-sms-api"
    echo "- Data directory: ./sms-data"
    echo ""
    echo "🔧 Useful Commands:"
    echo "- View logs: pm2 logs sme-sms-api"
    echo "- Restart: pm2 restart sme-sms-api"
    echo "- Stop: pm2 stop sme-sms-api"
    echo "- Status: pm2 status"
    echo ""
    echo "🌐 Test the API:"
    echo "- Health check: curl http://localhost:3001/health"
    echo "- Webhook: http://localhost:3001/webhook/sms"
    echo ""
    echo "📱 Next Steps:"
    echo "1. Configure FrontlineSMS webhook to: http://your-domain.com:3001/webhook/sms"
    echo "2. Update SMS number in index.html"
    echo "3. Test the system with: node test-sms.js"
    echo "4. Access admin dashboard at: http://your-domain.com?admin=1"
else
    echo "❌ Failed to start SMS API server"
    exit 1
fi

echo ""
echo "🎉 Deployment completed successfully!" 
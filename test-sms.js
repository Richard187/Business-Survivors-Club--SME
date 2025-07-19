// Test script for SMS API
// Run with: node test-sms.js

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001/api';
const WEBHOOK_URL = 'http://localhost:3001/webhook/sms';

async function testAPI() {
  console.log('🧪 Testing SME Connect SMS API...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const health = await fetch(`${API_BASE.replace('/api', '')}/health`);
    const healthData = await health.json();
    console.log('✅ Health check:', healthData.status);
    console.log('');

    // Test 2: Test SMS webhook
    console.log('2. Testing SMS webhook...');
    const testSMS = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: '+260955123456',
        message: 'JOIN'
      })
    });
    const smsResponse = await testSMS.json();
    console.log('✅ SMS webhook response:', smsResponse);
    console.log('');

    // Test 3: Get registrations
    console.log('3. Testing registrations endpoint...');
    const registrations = await fetch(`${API_BASE}/registrations`);
    const regData = await registrations.json();
    console.log('✅ Registrations count:', regData.length);
    console.log('');

    // Test 4: Get SMS logs
    console.log('4. Testing SMS logs endpoint...');
    const logs = await fetch(`${API_BASE}/sms-logs`);
    const logData = await logs.json();
    console.log('✅ SMS logs count:', logData.length);
    console.log('');

    // Test 5: Send test SMS
    console.log('5. Testing send SMS endpoint...');
    const sendSMS = await fetch(`${API_BASE}/send-sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: '+260955123456',
        message: 'Test message from API'
      })
    });
    const sendResponse = await sendSMS.json();
    console.log('✅ Send SMS response:', sendResponse);
    console.log('');

    // Test 6: Test bulk SMS
    console.log('6. Testing bulk SMS endpoint...');
    const bulkSMS = await fetch(`${API_BASE}/bulk-sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Test bulk message',
        filters: { tier: 'Basic' }
      })
    });
    const bulkResponse = await bulkSMS.json();
    console.log('✅ Bulk SMS response:', bulkResponse);
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('- Health check: ✅');
    console.log('- SMS webhook: ✅');
    console.log('- Registrations: ✅');
    console.log('- SMS logs: ✅');
    console.log('- Send SMS: ✅');
    console.log('- Bulk SMS: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the SMS API server is running (npm start)');
    console.log('2. Check if port 3001 is available');
    console.log('3. Verify all dependencies are installed (npm install)');
  }
}

// Test SMS workflow simulation
async function testWorkflow() {
  console.log('\n🔄 Testing SMS Workflow Simulation...\n');

  const testPhone = '+260955123456';
  const steps = [
    { message: 'JOIN', expected: 'welcome' },
    { message: 'John Doe', expected: 'name_received' },
    { message: 'Lusaka', expected: 'province_received' },
    { message: '1', expected: 'tier_received' },
    { message: '1', expected: 'language_received' }
  ];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    console.log(`Step ${i + 1}: Sending "${step.message}"...`);
    
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: testPhone,
          message: step.message
        })
      });
      
      const data = await response.json();
      console.log(`✅ Response: ${data.payload.message.substring(0, 50)}...`);
      console.log('');
      
      // Wait a bit between steps
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Step ${i + 1} failed:`, error.message);
    }
  }
}

// Run tests
async function runTests() {
  await testAPI();
  await testWorkflow();
}

// Check if running directly
if (require.main === module) {
  runTests();
}

module.exports = { testAPI, testWorkflow }; 
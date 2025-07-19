// Frontline SMS API for SME Connect
// This handles SMS registration, responses, and workflow management

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Data storage (in production, use a proper database)
const DATA_DIR = './sms-data';
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');
const SMS_LOGS_FILE = path.join(DATA_DIR, 'sms-logs.json');
const WORKFLOW_FILE = path.join(DATA_DIR, 'workflow.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Load data from files
async function loadData(filename, defaultData = []) {
  try {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch {
    return defaultData;
  }
}

// Save data to files
async function saveData(filename, data) {
  await ensureDataDir();
  await fs.writeFile(filename, JSON.stringify(data, null, 2));
}

// SMS Workflow States
const WORKFLOW_STATES = {
  INITIAL: 'initial',
  AWAITING_NAME: 'awaiting_name',
  AWAITING_PROVINCE: 'awaiting_province',
  AWAITING_TIER: 'awaiting_tier',
  AWAITING_LANGUAGE: 'awaiting_language',
  COMPLETED: 'completed'
};

// Language responses
const RESPONSES = {
  English: {
    welcome: "Welcome to SME Connect! Reply with your FULL NAME to register.",
    name_received: "Great! Now reply with your PROVINCE (e.g., Lusaka, Copperbelt, Southern).",
    province_received: "Perfect! Choose your membership tier:\n1. Basic (Free)\n2. Silver (Alumni)\n3. Gold (Finalists)\n4. Institutional (Partner)\nReply 1, 2, 3, or 4",
    tier_received: "Excellent! Choose your preferred language:\n1. English\n2. Bemba\n3. Nyanja\n4. Lozi\n5. Tonga\n6. Kaonde\n7. Luvale\n8. Lunda\nReply 1-8",
    language_received: "Registration complete! Welcome to SME Connect. You'll receive updates about events, mentorship, and opportunities. Reply STOP to unsubscribe.",
    invalid_input: "Invalid input. Please try again.",
    help: "SME Connect - Reply JOIN to register, HELP for assistance, STOP to unsubscribe.",
    events: "Upcoming events:\n- Bootcamp (July-August)\n- SME Summit (November)\n- Business Expo (November)\nReply INFO for details.",
    mentorship: "Mentorship available! Reply CALL to schedule a session, or ask for a specific mentor.",
    stop: "You have been unsubscribed from SME Connect. Reply JOIN to re-register."
  },
  Bemba: {
    welcome: "Mukwai ku SME Connect! Landa FULL NAME yobe ukuti ulembwe.",
    name_received: "Nacilungama! Landa PROVINCE yobe (e.g., Lusaka, Copperbelt, Southern).",
    province_received: "Nacilungama! Sosa membership tier yobe:\n1. Basic (Free)\n2. Silver (Alumni)\n3. Gold (Finalists)\n4. Institutional (Partner)\nLanda 1, 2, 3, kapena 4",
    tier_received: "Nacilungama! Sosa language yobe:\n1. English\n2. Bemba\n3. Nyanja\n4. Lozi\n5. Tonga\n6. Kaonde\n7. Luvale\n8. Lunda\nLanda 1-8",
    language_received: "Registration nacilungama! Mukwai ku SME Connect. Mulefwaya updates pa events, mentorship, na opportunities. Landa STOP ukuti ulembwe.",
    invalid_input: "Invalid input. Landa nakabili.",
    help: "SME Connect - Landa JOIN ukuti ulembwe, HELP pa assistance, STOP ukuti ulembwe.",
    events: "Ifintu ifyakweba:\n- Bootcamp (July-August)\n- SME Summit (November)\n- Business Expo (November)\nLanda INFO pa details.",
    mentorship: "Mentorship ili! Landa CALL ukuti ulembwe session, kapena funsa mentor.",
    stop: "Mulembwe ku SME Connect. Landa JOIN ukuti ulembwe nakabili."
  },
  Nyanja: {
    welcome: "Takulandilani ku SME Connect! Tumizani DZINA LANU LONSE kulembetsa.",
    name_received: "Zabwino! Tsopano tumizani PROVINCE yanu (e.g., Lusaka, Copperbelt, Southern).",
    province_received: "Zabwino! Sankhani membership tier yanu:\n1. Basic (Free)\n2. Silver (Alumni)\n3. Gold (Finalists)\n4. Institutional (Partner)\nTumizani 1, 2, 3, kapena 4",
    tier_received: "Zabwino! Sankhani language yanu:\n1. English\n2. Bemba\n3. Nyanja\n4. Lozi\n5. Tonga\n6. Kaonde\n7. Luvale\n8. Lunda\nTumizani 1-8",
    language_received: "Kulembetsa kwatha! Takulandilani ku SME Connect. Muzalandira updates pa events, mentorship, na opportunities. Tumizani STOP kulekana.",
    invalid_input: "Invalid input. Yesani nakali.",
    help: "SME Connect - Tumizani JOIN kulembetsa, HELP pa assistance, STOP kulekana.",
    events: "Zochitika zikubwera:\n- Bootcamp (July-August)\n- SME Summit (November)\n- Business Expo (November)\nTumizani INFO pa details.",
    mentorship: "Mentorship ilipo! Tumizani CALL kusonkha session, kapena funsani mentor.",
    stop: "Mulekana ku SME Connect. Tumizani JOIN kulembetsa nakali."
  }
};

// Get response in user's language
function getResponse(language, key) {
  const lang = RESPONSES[language] || RESPONSES.English;
  return lang[key] || RESPONSES.English[key] || "Invalid response key.";
}

// Process incoming SMS
async function processSMS(from, message) {
  const logs = await loadData(SMS_LOGS_FILE, []);
  const registrations = await loadData(REGISTRATIONS_FILE, []);
  const workflow = await loadData(WORKFLOW_FILE, {});
  
  const timestamp = new Date().toISOString();
  const cleanMessage = message.trim().toUpperCase();
  
  // Log the incoming SMS
  logs.push({
    from,
    message: cleanMessage,
    timestamp,
    direction: 'inbound'
  });
  
  let response = '';
  let userState = workflow[from] || WORKFLOW_STATES.INITIAL;
  let userLanguage = 'English';
  
  // Check if user is already registered
  const existingUser = registrations.find(r => r.phone === from);
  if (existingUser) {
    userLanguage = existingUser.language || 'English';
  }
  
  // Handle special commands
  if (cleanMessage === 'STOP') {
    response = getResponse(userLanguage, 'stop');
    delete workflow[from];
    await saveData(WORKFLOW_FILE, workflow);
  } else if (cleanMessage === 'HELP') {
    response = getResponse(userLanguage, 'help');
  } else if (cleanMessage === 'EVENTS') {
    response = getResponse(userLanguage, 'events');
  } else if (cleanMessage === 'MENTOR') {
    response = getResponse(userLanguage, 'mentorship');
  } else if (cleanMessage === 'JOIN' || userState === WORKFLOW_STATES.INITIAL) {
    // Start registration process
    response = getResponse(userLanguage, 'welcome');
    workflow[from] = WORKFLOW_STATES.AWAITING_NAME;
  } else {
    // Continue registration workflow
    switch (userState) {
      case WORKFLOW_STATES.AWAITING_NAME:
        if (cleanMessage.length > 2) {
          workflow[from] = WORKFLOW_STATES.AWAITING_PROVINCE;
          workflow[`${from}_name`] = message.trim();
          response = getResponse(userLanguage, 'name_received');
        } else {
          response = getResponse(userLanguage, 'invalid_input');
        }
        break;
        
      case WORKFLOW_STATES.AWAITING_PROVINCE:
        if (cleanMessage.length > 2) {
          workflow[from] = WORKFLOW_STATES.AWAITING_TIER;
          workflow[`${from}_province`] = message.trim();
          response = getResponse(userLanguage, 'province_received');
        } else {
          response = getResponse(userLanguage, 'invalid_input');
        }
        break;
        
      case WORKFLOW_STATES.AWAITING_TIER:
        const tierMap = { '1': 'Basic', '2': 'Silver', '3': 'Gold', '4': 'Institutional' };
        if (tierMap[cleanMessage]) {
          workflow[from] = WORKFLOW_STATES.AWAITING_LANGUAGE;
          workflow[`${from}_tier`] = tierMap[cleanMessage];
          response = getResponse(userLanguage, 'tier_received');
        } else {
          response = getResponse(userLanguage, 'invalid_input');
        }
        break;
        
      case WORKFLOW_STATES.AWAITING_LANGUAGE:
        const langMap = {
          '1': 'English', '2': 'Bemba', '3': 'Nyanja', '4': 'Lozi',
          '5': 'Tonga', '6': 'Kaonde', '7': 'Luvale', '8': 'Lunda'
        };
        if (langMap[cleanMessage]) {
          // Complete registration
          const registration = {
            phone: from,
            name: workflow[`${from}_name`],
            province: workflow[`${from}_province`],
            tier: workflow[`${from}_tier`],
            language: langMap[cleanMessage],
            registrationDate: timestamp,
            source: 'SMS'
          };
          
          registrations.push(registration);
          workflow[from] = WORKFLOW_STATES.COMPLETED;
          
          // Clean up workflow data
          delete workflow[`${from}_name`];
          delete workflow[`${from}_province`];
          delete workflow[`${from}_tier`];
          
          response = getResponse(langMap[cleanMessage], 'language_received');
        } else {
          response = getResponse(userLanguage, 'invalid_input');
        }
        break;
        
      default:
        response = getResponse(userLanguage, 'help');
    }
  }
  
  // Save updated data
  await saveData(SMS_LOGS_FILE, logs);
  await saveData(REGISTRATIONS_FILE, registrations);
  await saveData(WORKFLOW_FILE, workflow);
  
  // Log the response
  logs.push({
    to: from,
    message: response,
    timestamp,
    direction: 'outbound'
  });
  await saveData(SMS_LOGS_FILE, logs);
  
  return response;
}

// API Routes

// FrontlineSMS webhook endpoint
app.post('/webhook/sms', async (req, res) => {
  try {
    const { from, message } = req.body;
    
    if (!from || !message) {
      return res.status(400).json({ error: 'Missing from or message' });
    }
    
    const response = await processSMS(from, message);
    
    // Return response for FrontlineSMS
    res.json({
      payload: {
        message: response
      }
    });
  } catch (error) {
    console.error('SMS webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all registrations
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await loadData(REGISTRATIONS_FILE, []);
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load registrations' });
  }
});

// Get SMS logs
app.get('/api/sms-logs', async (req, res) => {
  try {
    const logs = await loadData(SMS_LOGS_FILE, []);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load SMS logs' });
  }
});

// Get workflow status
app.get('/api/workflow', async (req, res) => {
  try {
    const workflow = await loadData(WORKFLOW_FILE, {});
    res.json(workflow);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load workflow' });
  }
});

// Send SMS to user
app.post('/api/send-sms', async (req, res) => {
  try {
    const { to, message } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({ error: 'Missing to or message' });
    }
    
    const logs = await loadData(SMS_LOGS_FILE, []);
    logs.push({
      to,
      message,
      timestamp: new Date().toISOString(),
      direction: 'outbound',
      source: 'admin'
    });
    await saveData(SMS_LOGS_FILE, logs);
    
    // In production, integrate with actual SMS gateway here
    console.log(`SMS to ${to}: ${message}`);
    
    res.json({ success: true, message: 'SMS queued for delivery' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

// Bulk SMS campaign
app.post('/api/bulk-sms', async (req, res) => {
  try {
    const { message, filters } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Missing message' });
    }
    
    const registrations = await loadData(REGISTRATIONS_FILE, []);
    let recipients = registrations;
    
    // Apply filters
    if (filters) {
      if (filters.tier) {
        recipients = recipients.filter(r => r.tier === filters.tier);
      }
      if (filters.province) {
        recipients = recipients.filter(r => r.province === filters.province);
      }
      if (filters.language) {
        recipients = recipients.filter(r => r.language === filters.language);
      }
    }
    
    const logs = await loadData(SMS_LOGS_FILE, []);
    const timestamp = new Date().toISOString();
    
    // Queue SMS for each recipient
    recipients.forEach(recipient => {
      logs.push({
        to: recipient.phone,
        message,
        timestamp,
        direction: 'outbound',
        source: 'bulk_campaign'
      });
    });
    
    await saveData(SMS_LOGS_FILE, logs);
    
    res.json({
      success: true,
      message: `Bulk SMS queued for ${recipients.length} recipients`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send bulk SMS' });
  }
});

// Export data as CSV
app.get('/api/export/:type', async (req, res) => {
  try {
    const { type } = req.params;
    let data = [];
    let filename = '';
    
    switch (type) {
      case 'registrations':
        data = await loadData(REGISTRATIONS_FILE, []);
        filename = 'sme-registrations.csv';
        break;
      case 'sms-logs':
        data = await loadData(SMS_LOGS_FILE, []);
        filename = 'sms-logs.csv';
        break;
      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }
    
    if (!data.length) {
      return res.status(404).json({ error: 'No data to export' });
    }
    
    // Convert to CSV
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`SME Connect SMS API running on port ${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook/sms`);
});

module.exports = app; 
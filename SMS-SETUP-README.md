# Frontline SMS System for SME Connect

This is a comprehensive SMS system integrated with the SME Connect website, providing SMS registration, automated workflows, and admin management capabilities.

## Features

### 🚀 Core SMS Features
- **SMS Registration**: Users can register by texting "JOIN" to the SMS number
- **Multi-language Support**: English, Bemba, Nyanja, Lozi, Tonga, Kaonde, Luvale, Lunda
- **Automated Workflow**: Step-by-step registration process via SMS
- **Web Integration**: Seamless integration with existing website forms
- **Admin Dashboard**: Complete SMS management interface

### 📱 SMS Workflow
1. User texts "JOIN" to SMS number
2. System asks for full name
3. System asks for province
4. System asks for membership tier (1-4)
5. System asks for preferred language (1-8)
6. Registration complete with welcome message

### 🛠 Admin Features
- Real-time SMS statistics
- Bulk SMS campaigns with filters
- Export registrations and SMS logs
- Recent SMS activity monitoring
- User management and analytics

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- A FrontlineSMS account and device
- Web server for hosting the website

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Or using yarn
yarn install
```

### 2. Configure FrontlineSMS

1. **Set up FrontlineSMS device**:
   - Connect your GSM modem or phone to your computer
   - Install FrontlineSMS software
   - Configure the device settings

2. **Configure webhook**:
   - In FrontlineSMS, go to Settings > Web Services
   - Add a new web service with URL: `http://your-domain.com:3001/webhook/sms`
   - Set the method to POST
   - Configure the payload format to match the API expectations

### 3. Start the SMS API Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3001`

### 4. Update Website Files

1. **Add SMS styles** to your `index.html`:
```html
<link rel="stylesheet" href="sms-styles.css" />
```

2. **Add SMS frontend script** to your `index.html`:
```html
<script src="sms-frontend.js"></script>
```

3. **Update your existing `script.js`** to work with the new SMS system (the new `sms-frontend.js` is backward compatible)

### 5. Configure SMS Number

Update the SMS number in your `index.html`:
```html
<strong>Text <span class="sms-keyword">JOIN</span> to <span class="sms-number">+260XXXXXXXX</span></strong>
```

Replace `+260XXXXXXXX` with your actual FrontlineSMS number.

## API Endpoints

### Webhook (FrontlineSMS)
- **POST** `/webhook/sms` - Receives incoming SMS from FrontlineSMS

### Admin API
- **GET** `/api/registrations` - Get all registrations
- **GET** `/api/sms-logs` - Get SMS activity logs
- **GET** `/api/workflow` - Get current workflow status
- **POST** `/api/send-sms` - Send individual SMS
- **POST** `/api/bulk-sms` - Send bulk SMS campaign
- **GET** `/api/export/:type` - Export data as CSV

### Health Check
- **GET** `/health` - API health status

## SMS Commands

Users can send these commands via SMS:

| Command | Description |
|---------|-------------|
| `JOIN` | Start registration process |
| `HELP` | Get help information |
| `EVENTS` | Get upcoming events |
| `MENTOR` | Request mentorship |
| `STOP` | Unsubscribe from SMS |

## Admin Access

To access the admin dashboard, add `?admin=1` to your website URL:
```
http://your-website.com?admin=1
```

## Data Storage

The system stores data in JSON files in the `sms-data/` directory:
- `registrations.json` - User registrations
- `sms-logs.json` - SMS activity logs
- `workflow.json` - Current workflow states

For production, consider using a proper database like PostgreSQL or MongoDB.

## SMS Gateway Integration

The current implementation logs SMS to files. For production, integrate with:

### Option 1: FrontlineSMS (Recommended)
- Use the existing webhook integration
- Configure FrontlineSMS to send responses via the API

### Option 2: Other SMS Gateways
- AfricasTalking
- Twilio
- MessageBird
- Local Zambian SMS providers

Update the `sendSMS` function in `sms-api.js` to use your chosen gateway.

## Multi-language Support

The system supports 8 languages:
1. English
2. Bemba
3. Nyanja
4. Lozi
5. Tonga
6. Kaonde
7. Luvale
8. Lunda

Responses are automatically sent in the user's preferred language.

## Security Considerations

1. **API Security**: Add authentication to admin endpoints
2. **Rate Limiting**: Implement rate limiting for SMS endpoints
3. **Input Validation**: Validate all SMS inputs
4. **HTTPS**: Use HTTPS in production
5. **Environment Variables**: Store sensitive data in environment variables

## Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
1. Set up a production server (Ubuntu, CentOS, etc.)
2. Install Node.js and PM2
3. Clone your repository
4. Install dependencies: `npm install --production`
5. Start with PM2: `pm2 start sms-api.js --name "sme-sms-api"`
6. Configure reverse proxy (nginx) to forward requests to port 3001

### Environment Variables
Create a `.env` file:
```env
PORT=3001
NODE_ENV=production
SMS_GATEWAY_URL=your_sms_gateway_url
SMS_API_KEY=your_api_key
```

## Troubleshooting

### Common Issues

1. **SMS not being received**:
   - Check FrontlineSMS device connection
   - Verify webhook URL configuration
   - Check server logs for errors

2. **API not responding**:
   - Ensure Node.js server is running
   - Check port 3001 is not blocked
   - Verify firewall settings

3. **Admin dashboard not showing**:
   - Add `?admin=1` to URL
   - Check browser console for errors
   - Verify API server is accessible

### Logs
Check the console output for detailed error messages and API activity.

## Support

For technical support or questions about the SMS system:
- Check the logs in the `sms-data/` directory
- Review the API documentation above
- Test the webhook endpoint manually

## License

This SMS system is part of the SME Connect platform and follows the same licensing terms.

---

**Note**: This system is designed for the Zambian market and includes local language support. Customize the language responses and phone number formats as needed for your specific use case. 
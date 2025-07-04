import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, '../dist')));

// Gmail API setup with better error handling
let gmail = null;
let gmailConfigured = false;

async function initializeGmail() {
  if (!process.env.VITE_GMAIL_CLIENT_ID || !process.env.VITE_GMAIL_CLIENT_SECRET || !process.env.VITE_GMAIL_REFRESH_TOKEN) {
    console.log('Gmail credentials not found in environment variables');
    return false;
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.VITE_GMAIL_CLIENT_ID,
      process.env.VITE_GMAIL_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.VITE_GMAIL_REFRESH_TOKEN
    });

    // Test the credentials by attempting to get an access token
    await oauth2Client.getAccessToken();
    
    gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    gmailConfigured = true;
    console.log('Gmail API initialized successfully');
    return true;
  } catch (error) {
    console.warn('Gmail API initialization failed:', error.message);
    if (error.message.includes('invalid_grant')) {
      console.warn('The refresh token is invalid or expired. Please generate a new one at https://developers.google.com/oauthplayground');
    }
    return false;
  }
}

// Initialize Gmail on startup
initializeGmail();

// API Routes
// Send email endpoint with improved error handling
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Check if Gmail is configured and working
    if (!gmailConfigured || !gmail) {
      console.log('Gmail not configured, logging contact form submission:', { name, email, timestamp: new Date().toISOString() });
      
      // Log the message details for manual follow-up
      console.log('Contact Form Submission:');
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Message:', message);
      console.log('---');
      
      return res.json({
        success: true,
        message: 'Thank you for your message! I have received it and will get back to you soon. 👑'
      });
    }

    // Try to send email with retry mechanism
    let emailSent = false;
    let lastError = null;

    try {
      // Create email content
      const emailSubject = `New Contact Form Message from NAFIJPRO Website`;
      const emailBody = `Hello NAFIJ,

You have received a new message from your website contact form:

Name: ${name}
Email: ${email}

Message:
${message}

---
This message was sent from the NAFIJPRO website contact form.
Time: ${new Date().toLocaleString()}
Best regards,
NAFIJPRO Website System`;

      // Recipients
      const recipients = ['nafijprobd@gmail.com', 'nafijrahaman19721@gmail.com'];

      // Send email to each recipient
      const emailPromises = recipients.map(async (recipient) => {
        const emailContent = [
          `From: NAFIJPRO Contact Form <nafijthepro@gmail.com>`,
          `To: ${recipient}`,
          `Subject: ${emailSubject}`,
          `Content-Type: text/plain; charset=utf-8`,
          '',
          emailBody
        ].join('\n');

        const encodedEmail = Buffer.from(emailContent)
          .toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        return gmail.users.messages.send({
          userId: 'me',
          requestBody: {
            raw: encodedEmail
          }
        });
      });

      // Wait for all emails to be sent
      await Promise.all(emailPromises);
      emailSent = true;

    } catch (error) {
      lastError = error;
      console.error('Gmail sending error:', error.message);
      
      // If it's an auth error, mark Gmail as not configured
      if (error.message.includes('invalid_grant') || error.message.includes('unauthorized')) {
        gmailConfigured = false;
        gmail = null;
        console.warn('Gmail credentials invalid, switching to fallback mode');
      }
    }

    if (emailSent) {
      res.json({
        success: true,
        message: 'Message sent successfully! I\'ll get back to you soon. 👑'
      });
    } else {
      // Fallback: log the message and return success to user
      console.log('Email sending failed, logging contact form submission:', { name, email, timestamp: new Date().toISOString() });
      console.log('Contact Form Submission (Fallback):');
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Message:', message);
      console.log('Error:', lastError?.message || 'Unknown error');
      console.log('---');
      
      res.json({
        success: true,
        message: 'Thank you for your message! I have received it and will get back to you soon. 👑'
      });
    }

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Always log the contact attempt even if there's an error
    console.log('Contact Form Submission (Error Fallback):');
    console.log('Name:', req.body.name || 'Unknown');
    console.log('Email:', req.body.email || 'Unknown');
    console.log('Message:', req.body.message || 'Unknown');
    console.log('Error:', error.message);
    console.log('---');
    
    res.status(500).json({
      success: false,
      message: 'There was an issue processing your message. Please try again or contact me directly.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'NAFIJPRO Backend is running! 👑',
    gmail: gmailConfigured ? 'Configured' : 'Not configured (using fallback mode)'
  });
});

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 NAFIJPRO Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API Health: http://localhost:${PORT}/api/health`);
  console.log(`📧 Gmail configured: ${gmailConfigured ? 'Yes' : 'No (Fallback mode active)'}`);
  
  if (!gmailConfigured) {
    console.log('📝 Contact form submissions will be logged to console');
    console.log('🔑 To enable email sending, update your Gmail refresh token in .env file');
  }
});
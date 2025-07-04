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

// Gmail API setup - only if credentials are available
let gmail = null;
if (process.env.VITE_GMAIL_CLIENT_ID && process.env.VITE_GMAIL_CLIENT_SECRET && process.env.VITE_GMAIL_REFRESH_TOKEN) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.VITE_GMAIL_CLIENT_ID,
      process.env.VITE_GMAIL_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.VITE_GMAIL_REFRESH_TOKEN
    });

    gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  } catch (error) {
    console.warn('Gmail API setup failed:', error.message);
  }
}

// API Routes
// Send email endpoint
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

    // Check if Gmail is configured
    if (!gmail) {
      console.log('Gmail not configured, simulating email send for:', { name, email });
      return res.json({
        success: true,
        message: 'Message received! I\'ll get back to you soon. 👑 (Demo mode - Gmail not configured)'
      });
    }

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

    res.json({
      success: true,
      message: 'Message sent successfully! I\'ll get back to you soon. 👑'
    });

  } catch (error) {
    console.error('Gmail API Error:', error);
    
    // Return proper JSON error response
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'NAFIJPRO Backend is running! 👑' });
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
  console.log(`📧 Gmail configured: ${gmail ? 'Yes' : 'No (Demo mode)'}`);
});
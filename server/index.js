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

// Gmail API setup
const oauth2Client = new google.auth.OAuth2(
  process.env.VITE_GMAIL_CLIENT_ID,
  process.env.VITE_GMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: process.env.VITE_GMAIL_REFRESH_TOKEN
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// API Routes
// Send email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
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

app.listen(PORT, () => {
  console.log(`🚀 NAFIJPRO Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API Health: http://localhost:${PORT}/api/health`);
});
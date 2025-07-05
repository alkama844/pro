import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS configuration for Render deployment
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://localhost:5173',
    // Add your Render frontend URL here when you get it
    /\.render\.com$/,
    /\.onrender\.com$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Gmail OAuth2 setup with nodemailer
let gmailConfigured = false;
let gmailError = null;
let oAuth2Client = null;

async function initializeGmail() {
  // Check for required environment variables
  if (!process.env.VITE_GMAIL_CLIENT_ID) {
    gmailError = 'Gmail Client ID is missing from environment variables';
    console.log('❌ Gmail Error:', gmailError);
    return false;
  }

  if (!process.env.VITE_GMAIL_CLIENT_SECRET) {
    gmailError = 'Gmail Client Secret is missing from environment variables';
    console.log('❌ Gmail Error:', gmailError);
    return false;
  }

  if (!process.env.VITE_GMAIL_REFRESH_TOKEN) {
    gmailError = 'Gmail Refresh Token is missing from environment variables';
    console.log('❌ Gmail Error:', gmailError);
    return false;
  }

  try {
    oAuth2Client = new google.auth.OAuth2(
      process.env.VITE_GMAIL_CLIENT_ID,
      process.env.VITE_GMAIL_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    oAuth2Client.setCredentials({
      refresh_token: process.env.VITE_GMAIL_REFRESH_TOKEN
    });

    // Test the credentials by attempting to get an access token
    const { credentials } = await oAuth2Client.refreshAccessToken();
    
    if (!credentials.access_token) {
      throw new Error('Failed to obtain access token');
    }
    
    gmailConfigured = true;
    gmailError = null;
    console.log('✅ Gmail OAuth2 initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Gmail OAuth2 initialization failed:', error.message);
    
    if (error.message.includes('invalid_grant')) {
      gmailError = 'Gmail Refresh Token is invalid or expired. Please generate a new refresh token using the OAuth2 playground';
    } else if (error.message.includes('invalid_client')) {
      gmailError = 'Gmail Client ID or Client Secret is invalid. Please check your OAuth2 credentials';
    } else if (error.message.includes('unauthorized')) {
      gmailError = 'Gmail API access is unauthorized. Please check your OAuth2 setup and scopes';
    } else {
      gmailError = `Gmail OAuth2 Error: ${error.message}`;
    }
    
    console.log('❌ Gmail Error Details:', gmailError);
    return false;
  }
}

// Send email via Gmail using nodemailer
async function sendViaGmail(name, email, message) {
  if (!gmailConfigured || !oAuth2Client) {
    throw new Error('Gmail is not configured');
  }

  try {
    const accessToken = await oAuth2Client.getAccessToken();
    
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'nafijthepro@gmail.com',
        clientId: process.env.VITE_GMAIL_CLIENT_ID,
        clientSecret: process.env.VITE_GMAIL_CLIENT_SECRET,
        refreshToken: process.env.VITE_GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const emailSubject = `New Contact Form Message from NAFIJPRO Website - ${name}`;
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
      const mailOptions = {
        from: 'NAFIJPRO Contact Form <nafijthepro@gmail.com>',
        to: recipient,
        subject: emailSubject,
        text: emailBody,
      };

      return transporter.sendMail(mailOptions);
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);
    console.log('✅ Email sent successfully via Gmail (nodemailer)');
    return true;

  } catch (error) {
    console.error('❌ Gmail sending error:', error.message);
    throw error;
  }
}

// Web3Forms function
async function sendViaWeb3Forms(name, email, message) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY || 'badf4ca6-e440-43be-abbf-e0e6c4b7663b';
  
  if (!accessKey) {
    throw new Error('Web3Forms access key is missing from environment variables');
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: name,
        email: email,
        message: message,
        subject: `New Contact Form Message from NAFIJPRO Website - ${name}`,
        from_name: 'NAFIJPRO Website',
        to: 'nafijthepro@gmail.com',
        cc: 'nafijprobd@gmail.com,nafijrahaman19721@gmail.com'
      })
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Web3Forms submission failed');
    }

    return result;
  } catch (error) {
    console.error('Web3Forms Error:', error.message);
    throw error;
  }
}

// Initialize Gmail on startup
initializeGmail();

// Health check endpoint (should be before static files)
app.get('/api/health', (req, res) => {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY || 'badf4ca6-e440-43be-abbf-e0e6c4b7663b';
  
  const status = {
    status: 'OK',
    message: 'NAFIJPRO Backend is running! 👑',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    services: {
      gmail: {
        configured: gmailConfigured,
        status: gmailConfigured ? 'Active' : 'Inactive',
        error: gmailError,
        method: 'nodemailer + OAuth2'
      },
      web3forms: {
        configured: !!accessKey,
        status: accessKey ? 'Active' : 'Not configured'
      }
    }
  };

  res.json(status);
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the dist directory
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Log static file serving
  console.log('📁 Serving static files from:', path.join(__dirname, '../dist'));
}

// API Routes
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

    let emailSent = false;
    let primaryMethod = '';
    let backupMethod = '';
    let errors = [];

    // Try Gmail first if configured
    if (gmailConfigured && oAuth2Client) {
      try {
        console.log('📧 Attempting to send via Gmail (nodemailer)...');
        await sendViaGmail(name, email, message);
        emailSent = true;
        primaryMethod = 'Gmail';
        console.log('✅ Email sent successfully via Gmail');

      } catch (error) {
        console.error('❌ Gmail sending error:', error.message);
        errors.push(`Gmail: ${error.message}`);
        
        // Update Gmail status if it's an auth error
        if (error.message.includes('invalid_grant') || error.message.includes('unauthorized') || error.message.includes('invalid_client')) {
          gmailConfigured = false;
          oAuth2Client = null;
          if (error.message.includes('invalid_grant')) {
            gmailError = 'Gmail Refresh Token is invalid or expired';
          } else if (error.message.includes('invalid_client')) {
            gmailError = 'Gmail Client ID or Client Secret is invalid';
          } else {
            gmailError = 'Gmail API access is unauthorized';
          }
          console.warn('⚠️ Gmail credentials invalid, switching to backup method');
        }
      }
    } else {
      errors.push(`Gmail: ${gmailError || 'Not configured'}`);
      console.log('⚠️ Gmail not available, trying backup method...');
    }

    // Try Web3Forms as backup if Gmail failed
    if (!emailSent) {
      try {
        console.log('📧 Attempting to send via Web3Forms...');
        await sendViaWeb3Forms(name, email, message);
        emailSent = true;
        backupMethod = 'Web3Forms';
        console.log('✅ Email sent successfully via Web3Forms');
      } catch (error) {
        console.error('❌ Web3Forms error:', error.message);
        errors.push(`Web3Forms: ${error.message}`);
      }
    }

    if (emailSent) {
      const method = primaryMethod || backupMethod;
      res.json({
        success: true,
        message: `Message sent successfully via ${method}! I'll get back to you soon. 👑`
      });
    } else {
      // Log the message for manual follow-up
      console.log('📝 Logging contact form submission for manual follow-up:');
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Message:', message);
      console.log('Timestamp:', new Date().toISOString());
      console.log('Errors:', errors);
      console.log('---');
      
      // Return detailed error information
      const errorDetails = errors.length > 0 ? ` Errors: ${errors.join(', ')}` : '';
      
      res.status(500).json({
        success: false,
        message: `Failed to send message through all available methods.${errorDetails} Your message has been logged and I'll respond manually.`
      });
    }

  } catch (error) {
    console.error('❌ Contact form error:', error);
    
    // Always log the contact attempt even if there's an error
    console.log('📝 Contact Form Submission (Error Fallback):');
    console.log('Name:', req.body.name || 'Unknown');
    console.log('Email:', req.body.email || 'Unknown');
    console.log('Message:', req.body.message || 'Unknown');
    console.log('Error:', error.message);
    console.log('Timestamp:', new Date().toISOString());
    console.log('---');
    
    res.status(500).json({
      success: false,
      message: 'There was an issue processing your message. Please try again or contact me directly.'
    });
  }
});

// Catch all handler for React app (must be last)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 NAFIJPRO Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📱 Server URL: http://localhost:${PORT}`);
  console.log(`🔧 API Health: http://localhost:${PORT}/api/health`);
  
  // Email service status
  console.log('\n📧 Email Service Status:');
  console.log(`Gmail (nodemailer): ${gmailConfigured ? '✅ Active' : '❌ Inactive'}`);
  if (gmailError) {
    console.log(`Gmail Error: ${gmailError}`);
  }
  
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY || 'badf4ca6-e440-43be-abbf-e0e6c4b7663b';
  console.log(`Web3Forms: ${accessKey ? '✅ Active' : '❌ Not configured'}`);
  
  if (!gmailConfigured && !accessKey) {
    console.log('\n⚠️  WARNING: No email services are configured!');
    console.log('Contact form submissions will only be logged to console.');
    console.log('\nTo fix this:');
    console.log('1. For Gmail: Update your OAuth2 credentials in .env file');
    console.log('2. For Web3Forms: Add WEB3FORMS_ACCESS_KEY to .env file');
  }
  
  if (process.env.NODE_ENV === 'production') {
    console.log('\n📁 Serving React app from /dist directory');
  }
  
  console.log('\n📝 Contact form submissions will be logged to console for manual follow-up');
  console.log('\n💡 To generate Gmail refresh token, use the OAuth2 playground:');
  console.log('   https://developers.google.com/oauthplayground');
  console.log('\n🎯 Ready for Render deployment!');
});
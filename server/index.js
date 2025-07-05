import express from 'express';
import cors from 'cors';
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

    // Send via Web3Forms
    try {
      console.log('📧 Sending via Web3Forms...');
      await sendViaWeb3Forms(name, email, message);
      console.log('✅ Email sent successfully via Web3Forms');
      
      res.json({
        success: true,
        message: 'Message sent successfully! I\'ll get back to you soon. 👑'
      });
    } catch (error) {
      console.error('❌ Web3Forms error:', error.message);
      
      // Log the message for manual follow-up
      console.log('📝 Logging contact form submission for manual follow-up:');
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Message:', message);
      console.log('Timestamp:', new Date().toISOString());
      console.log('Error:', error.message);
      console.log('---');
      
      res.status(500).json({
        success: false,
        message: 'Failed to send message. Your message has been logged and I\'ll respond manually.'
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
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY || 'badf4ca6-e440-43be-abbf-e0e6c4b7663b';
  console.log(`Web3Forms: ${accessKey ? '✅ Active' : '❌ Not configured'}`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log('\n📁 Serving React app from /dist directory');
  }
  
  console.log('\n📝 Contact form submissions will be logged to console for manual follow-up');
  console.log('\n🎯 Ready for Render deployment!');
});
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

// Middleware
app.use(cors());
app.use(express.json());

// Only serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Web3Forms backup function
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
// Send email endpoint with Web3Forms
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY || 'badf4ca6-e440-43be-abbf-e0e6c4b7663b';
  
  const status = {
    status: 'OK',
    message: 'NAFIJPRO Backend is running! 👑',
    timestamp: new Date().toISOString(),
    services: {
      web3forms: {
        configured: !!accessKey,
        status: accessKey ? 'Active' : 'Not configured'
      }
    }
  };

  res.json(status);
});

// Only serve React app in production
if (process.env.NODE_ENV === 'production') {
  // Catch all handler: send back React's index.html file for any non-API routes
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

app.listen(PORT, () => {
  console.log(`🚀 NAFIJPRO Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API Health: http://localhost:${PORT}/api/health`);
  
  // Email service status
  console.log('\n📧 Email Service Status:');
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY || 'badf4ca6-e440-43be-abbf-e0e6c4b7663b';
  console.log(`Web3Forms: ${accessKey ? '✅ Active' : '❌ Not configured'}`);
  
  console.log('\n📝 Contact form submissions will be logged to console for manual follow-up');
});
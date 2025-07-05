interface EmailData {
  name: string;
  email: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
}

export const sendContactMessage = async (emailData: EmailData): Promise<ContactResponse> => {
  try {
    // Detect environment
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isWebContainer = window.location.hostname.includes('webcontainer') || 
                          window.location.hostname.includes('stackblitz') ||
                          window.location.hostname.includes('bolt.new');
    const isRender = window.location.hostname.includes('render.com') || 
                    window.location.hostname.includes('onrender.com');
    
    console.log('Environment detection:', { isLocalhost, isWebContainer, isRender });

    // For Render deployment or production, use the same domain for API calls
    if (isRender || (!isLocalhost && !isWebContainer)) {
      console.log('Using same-domain API for production/Render...');
      
      try {
        const apiUrl = `${window.location.origin}/api/send-email`;
        console.log('API URL:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API failed: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        return result;
        
      } catch (apiError) {
        console.log('API failed, falling back to Web3Forms...', apiError);
        
        // Fallback to Web3Forms
        return await sendDirectWeb3Forms(emailData);
      }
    }
    
    // For WebContainer environments, use Web3Forms directly
    else if (isWebContainer) {
      console.log('Using Web3Forms directly for WebContainer...');
      return await sendDirectWeb3Forms(emailData);
    }
    
    // For local development, try backend API first
    else if (isLocalhost) {
      console.log('Trying local backend API...');
      
      try {
        const apiUrl = `http://localhost:3001/api/send-email`;
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });

        if (!response.ok) {
          throw new Error(`Backend API failed: ${response.status}`);
        }

        const result = await response.json();
        return result;
        
      } catch (backendError) {
        console.log('Backend API failed, falling back to Web3Forms...', backendError);
        return await sendDirectWeb3Forms(emailData);
      }
    }
    
    // Default fallback
    else {
      console.log('Using Web3Forms as default...');
      return await sendDirectWeb3Forms(emailData);
    }

  } catch (error) {
    console.error('Contact API Error:', error);
    
    // Handle different types of errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
      };
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
    };
  }
};

// Direct Web3Forms function
async function sendDirectWeb3Forms(emailData: EmailData): Promise<ContactResponse> {
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      access_key: 'badf4ca6-e440-43be-abbf-e0e6c4b7663b',
      name: emailData.name,
      email: emailData.email,
      message: emailData.message,
      subject: `New Contact Form Message from NAFIJPRO Website - ${emailData.name}`,
      from_name: 'NAFIJPRO Website',
      to: 'nafijthepro@gmail.com',
      cc: 'nafijprobd@gmail.com,nafijrahaman19721@gmail.com'
    })
  });

  const result = await response.json();
  
  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Failed to send message');
  }

  return {
    success: true,
    message: 'Message sent successfully! I\'ll get back to you soon. 👑'
  };
}
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
    // Check if we're in a WebContainer environment (like StackBlitz)
    const isWebContainer = window.location.hostname.includes('webcontainer') || 
                          window.location.hostname.includes('stackblitz') ||
                          window.location.hostname.includes('bolt.new');
    
    // For WebContainer or deployed environments, use Web3Forms directly
    if (isWebContainer || (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1'))) {
      console.log('Using Web3Forms directly...');
      
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
        message: 'Message sent successfully via Web3Forms! I\'ll get back to you soon. 👑'
      };
    } else {
      // For local development, try backend API first, then fallback to Web3Forms
      console.log('Trying backend API...');
      
      try {
        const apiUrl = window.location.origin.replace(':5173', ':3001') + '/api/send-email';
        
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
        
        // Fallback to Web3Forms
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
          message: 'Message sent successfully via Web3Forms! I\'ll get back to you soon. 👑'
        };
      }
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
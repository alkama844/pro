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
    // For deployed version, use Web3Forms directly since we don't have a backend server
    const isDeployed = window.location.hostname !== 'localhost' && !window.location.hostname.includes('webcontainer');
    
    if (isDeployed) {
      // Use Web3Forms directly for deployed version
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
      // For local development, use the backend API
      const apiUrl = window.location.origin + '/api/send-email';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      // Check if response is ok first
      if (!response.ok) {
        // Try to parse error response, but handle cases where it's not JSON
        let errorMessage = 'Failed to send message. Please try again later.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Parse successful response
      const result = await response.json();
      return result;
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
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
    // Use relative URL for production deployment
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
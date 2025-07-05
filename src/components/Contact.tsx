import React, { useState } from 'react';
import { Send, Mail, Phone, MapPin, Crown, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { sendContactMessage } from '../utils/contactApi';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ type: null, message: '' });

    try {
      const result = await sendContactMessage(formData);
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: result.message
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setNotification({
          type: 'error',
          message: result.message
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setNotification({
        type: 'error',
        message: 'An unexpected error occurred. Please try again later.'
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setNotification({ type: null, message: '' });
      }, 8000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 flex-shrink-0" />;
      case 'info':
        return <Info className="w-5 h-5 flex-shrink-0" />;
      default:
        return null;
    }
  };

  const getNotificationStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800';
      case 'info':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
      default:
        return '';
    }
  };

  // Check if we're in WebContainer or deployed environment
  const isWebContainer = window.location.hostname.includes('webcontainer') || 
                        window.location.hostname.includes('stackblitz') ||
                        window.location.hostname.includes('bolt.new');
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:via-black dark:to-gray-900"></div>
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1),transparent_50%)] animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-orbitron font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              CONTACT
            </span>
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-300 font-space text-base sm:text-lg mt-4 sm:mt-6 max-w-2xl mx-auto px-4">
            Ready to build the future together? Let's connect! 👑
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-orbitron font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Get In Touch
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-space text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                Whether you have a groundbreaking project idea, need technical consultation, 
                or just want to discuss the future of technology, I'm here to help bring 
                your vision to life.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center space-x-4 group">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full group-hover:from-yellow-400 group-hover:to-orange-500 transition-all duration-300 flex-shrink-0">
                  <Mail className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-gray-900 dark:text-white font-space font-medium text-sm sm:text-base">Email</div>
                  <div className="text-yellow-600 dark:text-yellow-400 font-space text-sm sm:text-base break-all">nafijthepro@gmail.com</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full group-hover:from-orange-400 group-hover:to-red-400 transition-all duration-300 flex-shrink-0">
                  <Phone className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-gray-900 dark:text-white font-space font-medium text-sm sm:text-base">Phone</div>
                  <div className="text-yellow-600 dark:text-yellow-400 font-space text-sm sm:text-base">+880 1234-567890</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 group">
                <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full group-hover:from-red-400 group-hover:to-pink-400 transition-all duration-300 flex-shrink-0">
                  <MapPin className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-gray-900 dark:text-white font-space font-medium text-sm sm:text-base">Location</div>
                  <div className="text-yellow-600 dark:text-yellow-400 font-space text-sm sm:text-base">Dhaka, Bangladesh</div>
                </div>
              </div>
            </div>

            {/* Email Service Info */}
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-space font-semibold text-blue-800 dark:text-blue-300 mb-1">
                    {isWebContainer ? 'Web3Forms Direct Delivery' : 'Dual Delivery System'}
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-400 font-space">
                    {isWebContainer 
                      ? 'Your message will be sent directly via Web3Forms to ensure reliable delivery.'
                      : isLocalhost
                      ? 'Your message will be sent via Gmail (if configured) with Web3Forms as backup to ensure delivery.'
                      : 'Your message will be sent via our backend API with multiple delivery methods for maximum reliability.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="relative">
            <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-yellow-500/50 dark:hover:border-yellow-500/50 transition-all duration-300 shadow-lg">
              {/* Notification */}
              {notification.type && (
                <div className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${getNotificationStyles()}`}>
                  {getNotificationIcon()}
                  <div className="flex-1">
                    <span className="text-sm font-space leading-relaxed">{notification.message}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-space font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white font-space placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 disabled:opacity-50"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-space font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white font-space placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 disabled:opacity-50"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-space font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white font-space placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 resize-none disabled:opacity-50"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-space font-bold py-3 sm:py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 flex items-center justify-center space-x-2 disabled:transform-none disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      <span>Send Message</span>
                      <Crown className="w-4 sm:w-5 h-4 sm:h-5 animate-pulse" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-4 sm:w-6 h-4 sm:h-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
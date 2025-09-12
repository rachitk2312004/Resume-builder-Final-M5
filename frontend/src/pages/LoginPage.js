import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Eye, EyeOff, MessageCircle, Mail } from 'lucide-react';

const LoginPage = () => {
  const { login, chatLogin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'bot',
      message: "Hi! I'm here to help you log in. What's your email address?"
    }
  ]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessage = {
      type: 'user',
      message: chatMessage
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');

    // Simulate AI processing
    setTimeout(async () => {
      if (chatMessages.length === 1) {
        // First message - asking for email
        const botResponse = {
          type: 'bot',
          message: "Great! Now what's your password?"
        };
        setChatMessages(prev => [...prev, botResponse]);
      } else if (chatMessages.length === 3) {
        // Second message - asking for password
        const botResponse = {
          type: 'bot',
          message: "Perfect! Let me log you in..."
        };
        setChatMessages(prev => [...prev, botResponse]);

        // Attempt login
        try {
          const result = await chatLogin({
            email: chatMessages[1].message,
            password: chatMessage
          });
          if (result.success) {
            navigate('/dashboard');
          }
        } catch (error) {
          const errorResponse = {
            type: 'bot',
            message: "Sorry, those credentials don't match. Let's try again. What's your email?"
          };
          setChatMessages(prev => [...prev, errorResponse]);
        }
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex min-h-screen">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                {isChatMode ? 'Chat Login' : 'Sign in to your account'}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {isChatMode 
                  ? 'Login through our AI assistant' 
                  : 'Or start a new journey with us'
                }
              </p>
            </div>

            {!isChatMode ? (
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="input-field pr-10"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              <div className="mt-8">
                <div className="bg-white rounded-lg border border-gray-200 h-64 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.type === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
                
                <form onSubmit={handleChatSubmit} className="mt-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type your response..."
                      className="flex-1 input-field"
                    />
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsChatMode(!isChatMode)}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {isChatMode ? 'Email Login' : 'Chat Login'}
                </button>
                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <Mail className="w-5 h-5 mr-2" />
                  Google
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image/Illustration */}
        <div className="hidden lg:block relative w-0 flex-1">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-64 h-64 bg-primary-200 rounded-full flex items-center justify-center mb-8 mx-auto">
                <MessageCircle className="w-32 h-32 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome Back!
              </h3>
              <p className="text-lg text-gray-600 max-w-md">
                Continue building your professional presence with our AI-powered tools
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;

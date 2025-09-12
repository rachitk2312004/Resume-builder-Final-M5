import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Zap, 
  Shield, 
  FileText, 
  Briefcase,
  MessageCircle,
  Mail,
  X
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'bot',
      message: "Hi! I'm your AI assistant. I can help you build your resume and portfolio. What's your name?"
    }
  ]);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessage = {
      type: 'user',
      message: chatMessage
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        message: "Great! I'd love to help you create an amazing resume. Would you like to start by creating an account?"
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-primary-600" />,
      title: "AI-Powered",
      description: "Leverage advanced AI to generate professional content and optimize your resume"
    },
    {
      icon: <FileText className="w-8 h-8 text-primary-600" />,
      title: "Multiple Templates",
      description: "Choose from a variety of professionally designed templates"
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: "Privacy First",
      description: "Your data is secure with enterprise-grade encryption"
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: "Collaborative",
      description: "Share and collaborate with mentors or career advisors"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      content: "ResumeAI helped me land my dream job at Google. The AI suggestions were spot-on!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      content: "The portfolio builder is incredible. I got 3x more interview requests after using it.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      content: "Finally, a tool that understands what makes a resume stand out. Highly recommended!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Build Your Resume in{' '}
              <span className="text-primary-600">Chat</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create professional resumes and portfolios with the power of AI. 
              Our intelligent chat interface makes resume building effortless and fun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button
                onClick={() => setIsChatOpen(true)}
                className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Try Chat Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ResumeAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine cutting-edge AI technology with user-friendly design 
              to help you create resumes that get noticed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in minutes with our simple 3-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                1. Chat with AI
              </h3>
              <p className="text-gray-600">
                Start a conversation with our AI assistant to gather your information
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                2. Customize Design
              </h3>
              <p className="text-gray-600">
                Choose from professional templates and customize to your liking
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                3. Download & Apply
              </h3>
              <p className="text-gray-600">
                Download your professional resume and start applying to jobs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of professionals who've landed their dream jobs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Build Your Resume?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've already created stunning resumes with ResumeAI
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center"
          >
            {isAuthenticated ? "Go to Dashboard" : "Start Building Now"}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md h-96 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">AI Assistant</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
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
            
            <form onSubmit={handleChatSubmit} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
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
        </div>
      )}
    </div>
  );
};

export default LandingPage;

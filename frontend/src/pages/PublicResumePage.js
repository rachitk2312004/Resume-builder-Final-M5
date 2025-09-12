import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Download, Share2, Eye } from 'lucide-react';
import { resumeAPI } from '../services/api';
import toast from 'react-hot-toast';

const PublicResumePage = () => {
  const { publicLink } = useParams();
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchResume();
  }, [publicLink]);

  const fetchResume = async () => {
    try {
      const response = await resumeAPI.getPublicResume(publicLink);
      setResume(response.data);
    } catch (error) {
      console.error('Error fetching resume:', error);
      toast.error('Resume not found');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    toast.success('Download feature coming soon!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Resume Not Found</h1>
            <p className="text-gray-600">The resume you're looking for doesn't exist or is private.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Resume Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{resume.title}</h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownload}
                className="btn-secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                onClick={handleShare}
                className="btn-primary"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Eye className="w-4 h-4 mr-2" />
            <span>Public Resume</span>
            <span className="mx-2">•</span>
            <span>Last updated: {new Date(resume.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Resume Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {resume.jsonContent ? (
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: resume.jsonContent }} />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Resume Content</h3>
              <p className="text-gray-600">The resume content will be displayed here.</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-primary-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Create Your Own Professional Resume
          </h3>
          <p className="text-gray-600 mb-4">
            Join thousands of professionals who've created stunning resumes with ResumeAI
          </p>
          <a
            href="/register"
            className="btn-primary"
          >
            Get Started Free
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PublicResumePage;

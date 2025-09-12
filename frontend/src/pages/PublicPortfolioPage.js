import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { portfolioAPI } from '../services/api';
import { getPortfolioTemplateById } from '../components/templates/PortfolioTemplateRegistry';
import toast from 'react-hot-toast';

const PublicPortfolioPage = () => {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPortfolio();
  }, [slug]);

  const fetchPortfolio = async () => {
    try {
      const response = await portfolioAPI.getPortfolioBySlug(slug);
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setError('Portfolio not found');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-8">The portfolio you're looking for doesn't exist or is private.</p>
          <a
            href="/"
            className="btn-primary"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const TemplateComponent = getPortfolioTemplateById(portfolio.templateId).component;
  const portfolioData = portfolio.jsonContent ? JSON.parse(portfolio.jsonContent) : {};

  return (
    <div className="min-h-screen">
      <TemplateComponent data={portfolioData} isPreview={false} />
    </div>
  );
};

export default PublicPortfolioPage;
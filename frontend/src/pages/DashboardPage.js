import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAutoSave } from '../contexts/AutoSaveContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  Plus, 
  FileText, 
  Briefcase, 
  MoreVertical, 
  Edit, 
  Copy, 
  Trash2, 
  Share2, 
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { resumeAPI, portfolioAPI } from '../services/api';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const { lastSaved, isSaving } = useAutoSave();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resumes');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resumesResponse, portfoliosResponse] = await Promise.all([
        resumeAPI.getResumes(),
        portfolioAPI.getPortfolios()
      ]);
      
      setResumes(resumesResponse.data);
      setPortfolios(portfoliosResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateResume = async () => {
    try {
      const response = await resumeAPI.createResume({ title: 'New Resume' });
      navigate(`/resume-builder/${response.data.id}`);
    } catch (error) {
      console.error('Error creating resume:', error);
      toast.error('Failed to create resume');
    }
  };

  const handleCreatePortfolio = async () => {
    try {
      const response = await portfolioAPI.createPortfolio({ title: 'New Portfolio' });
      navigate(`/portfolio-builder/${response.data.id}`);
    } catch (error) {
      console.error('Error creating portfolio:', error);
      toast.error('Failed to create portfolio');
    }
  };

  const handleDuplicateResume = async (id) => {
    try {
      await resumeAPI.duplicateResume(id);
      toast.success('Resume duplicated successfully');
      fetchData();
    } catch (error) {
      console.error('Error duplicating resume:', error);
      toast.error('Failed to duplicate resume');
    }
  };

  const handleDuplicatePortfolio = async (id) => {
    try {
      await portfolioAPI.duplicatePortfolio(id);
      toast.success('Portfolio duplicated successfully');
      fetchData();
    } catch (error) {
      console.error('Error duplicating portfolio:', error);
      toast.error('Failed to duplicate portfolio');
    }
  };

  const handleDeleteResume = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await resumeAPI.deleteResume(id);
        toast.success('Resume deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Error deleting resume:', error);
        toast.error('Failed to delete resume');
      }
    }
  };

  const handleDeletePortfolio = async (id) => {
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      try {
        await portfolioAPI.deletePortfolio(id);
        toast.success('Portfolio deleted successfully');
        fetchData();
      } catch (error) {
        console.error('Error deleting portfolio:', error);
        toast.error('Failed to delete portfolio');
      }
    }
  };

  const handleTogglePublic = async (type, id, isPublic) => {
    try {
      if (type === 'resume') {
        await resumeAPI.updateResume(id, { isPublic: !isPublic });
      } else {
        await portfolioAPI.updatePortfolio(id, { isPublic: !isPublic });
      }
      toast.success(`Made ${type} ${!isPublic ? 'public' : 'private'}`);
      fetchData();
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      toast.error(`Failed to update ${type}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'IN_PROGRESS':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'Completed';
      case 'IN_PROGRESS':
        return 'In Progress';
      default:
        return 'Draft';
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your resumes and portfolios
            {isSaving && (
              <span className="ml-2 text-sm text-primary-600">
                (Auto-saving...)
              </span>
            )}
            {lastSaved && (
              <span className="ml-2 text-sm text-gray-500">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={handleCreateResume}
            className="card-hover group"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Create Resume</h3>
                <p className="text-gray-600">Start building your professional resume</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleCreatePortfolio}
            className="card-hover group"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
                <Briefcase className="w-6 h-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Create Portfolio</h3>
                <p className="text-gray-600">Showcase your work and projects</p>
              </div>
            </div>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('resumes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'resumes'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Resumes ({resumes.length})
            </button>
            <button
              onClick={() => setActiveTab('portfolios')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'portfolios'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Portfolios ({portfolios.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'resumes' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
                <p className="text-gray-600 mb-4">Create your first resume to get started</p>
                <button onClick={handleCreateResume} className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Resume
                </button>
              </div>
            ) : (
              resumes.map((resume) => (
                <div key={resume.id} className="card group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {getStatusIcon(resume.status)}
                      <span className="ml-2 text-sm text-gray-600">
                        {getStatusText(resume.status)}
                      </span>
                    </div>
                    <div className="relative">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {/* Dropdown menu would go here */}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {resume.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Updated {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Link
                        to={`/resume-builder/${resume.id}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDuplicateResume(resume.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteResume(resume.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTogglePublic('resume', resume.id, resume.isPublic)}
                        className={`text-sm px-2 py-1 rounded ${
                          resume.isPublic
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {resume.isPublic ? 'Public' : 'Private'}
                      </button>
                      {resume.isPublic && (
                        <button
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/resume/${resume.publicLink}`)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolios yet</h3>
                <p className="text-gray-600 mb-4">Create your first portfolio to get started</p>
                <button onClick={handleCreatePortfolio} className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Portfolio
                </button>
              </div>
            ) : (
              portfolios.map((portfolio) => (
                <div key={portfolio.id} className="card group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {getStatusIcon(portfolio.status)}
                      <span className="ml-2 text-sm text-gray-600">
                        {getStatusText(portfolio.status)}
                      </span>
                    </div>
                    <div className="relative">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {portfolio.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Updated {new Date(portfolio.updatedAt).toLocaleDateString()}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Link
                        to={`/portfolio-builder/${portfolio.id}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDuplicatePortfolio(portfolio.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePortfolio(portfolio.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTogglePublic('portfolio', portfolio.id, portfolio.isPublic)}
                        className={`text-sm px-2 py-1 rounded ${
                          portfolio.isPublic
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {portfolio.isPublic ? 'Public' : 'Private'}
                      </button>
                      {portfolio.isPublic && (
                        <button
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/portfolio/${portfolio.publicLink}`)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;

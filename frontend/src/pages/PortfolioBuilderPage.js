import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAutoSave } from '../contexts/AutoSaveContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import { 
  Save, 
  Eye, 
  Download, 
  Share2, 
  ArrowLeft, 
  Settings, 
  Palette, 
  Upload,
  Plus,
  Trash2,
  Edit3,
  Globe,
  BarChart3,
  MessageSquare,
  FileText,
  User,
  Briefcase,
  Code,
  Award,
  ExternalLink,
  GripVertical
} from 'lucide-react';
import { portfolioAPI, portfolioTemplateAPI, resumeAPI } from '../services/api';
import { PORTFOLIO_TEMPLATE_REGISTRY, getPortfolioTemplateById } from '../components/templates/PortfolioTemplateRegistry';
import toast from 'react-hot-toast';

const PortfolioBuilderPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { savePortfolio, isSaving } = useAutoSave();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showResumeImport, setShowResumeImport] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [sections, setSections] = useState([]);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [showExpModal, setShowExpModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [expForm, setExpForm] = useState({ title: '', company: '', startDate: '', endDate: '', description: '', responsibilities: [] });
  const [projectForm, setProjectForm] = useState({ name: '', description: '', technologies: '', demo: '', github: '' });
  const [skillForm, setSkillForm] = useState({ name: '', level: 85 });
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    templateId: 'modern',
    jsonContent: '',
    status: 'IN_PROGRESS',
    isPublic: false,
    seoTitle: '',
    seoDescription: '',
    seoImageUrl: ''
  });
  const [portfolioData, setPortfolioData] = useState({
    name: '',
    title: '',
    about: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    experience: [],
    projects: [],
    skills: [],
    education: [],
    certifications: []
  });

  useEffect(() => {
    if (id) {
      fetchPortfolio();
    } else {
      setIsLoading(false);
    }
    fetchTemplates();
    fetchResumes();
  }, [id]);

  useEffect(() => {
    if (portfolio) {
      setFormData({
        title: portfolio.title || '',
        slug: portfolio.slug || '',
        templateId: portfolio.templateId || 'modern',
        jsonContent: portfolio.jsonContent || '',
        status: portfolio.status || 'IN_PROGRESS',
        isPublic: portfolio.isPublic || false,
        seoTitle: portfolio.seoTitle || '',
        seoDescription: portfolio.seoDescription || '',
        seoImageUrl: portfolio.seoImageUrl || ''
      });
      
      // Parse portfolio data
      try {
        const data = portfolio.jsonContent ? JSON.parse(portfolio.jsonContent) : {};
        setPortfolioData({
          name: data.name || '',
          title: data.title || '',
          about: data.about || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          website: data.website || '',
          github: data.github || '',
          linkedin: data.linkedin || '',
          experience: data.experience || [],
          projects: data.projects || [],
          skills: data.skills || [],
          education: data.education || [],
          certifications: data.certifications || []
        });
      } catch (error) {
        console.error('Error parsing portfolio data:', error);
      }
    }
  }, [portfolio]);

  // Auto-save functionality
  useEffect(() => {
    if (id && formData.jsonContent) {
      const timeoutId = setTimeout(() => {
        savePortfolio(id, formData);
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [formData, id, savePortfolio]);

  // Update JSON content when portfolio data changes
  useEffect(() => {
    const jsonContent = JSON.stringify(portfolioData, null, 2);
    setFormData(prev => ({ ...prev, jsonContent }));
  }, [portfolioData]);

  const fetchPortfolio = async () => {
    try {
      const response = await portfolioAPI.getPortfolio(id);
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast.error('Failed to load portfolio');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await portfolioTemplateAPI.getTemplates();
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchResumes = async () => {
    try {
      const response = await resumeAPI.getResumes();
      setResumes(response.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Auto-save when form data changes
    if (id) {
      const updatedFormData = {
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      };
      savePortfolio(id, updatedFormData);
    }
  };

  const handlePortfolioDataChange = (field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      [field]: value
    }));
    // Auto-save when portfolio data changes
    if (id) {
      const updatedData = { ...portfolioData, [field]: value };
      const updatedFormData = {
        ...formData,
        jsonContent: JSON.stringify(updatedData)
      };
      savePortfolio(id, updatedFormData);
    }
  };

  const handleTemplateChange = (templateId) => {
    setFormData(prev => ({ ...prev, templateId }));
    setShowTemplateSelector(false);
    toast.success('Template updated successfully');
  };

  const handleResumeImport = async (resumeId) => {
    try {
      const response = await portfolioAPI.createFromResume({
        resumeId,
        title: formData.title || 'Portfolio from Resume',
        templateId: formData.templateId
      });
      
      navigate(`/portfolio-builder/${response.data.id}`);
      toast.success('Portfolio created from resume successfully');
    } catch (error) {
      console.error('Error importing resume:', error);
      toast.error('Failed to import resume');
    }
  };

  const handlePublish = async () => {
    try {
      await portfolioAPI.publish(id);
      setFormData(prev => ({ ...prev, isPublic: true, status: 'COMPLETED' }));
      toast.success('Portfolio published successfully');
    } catch (error) {
      console.error('Error publishing portfolio:', error);
      toast.error('Failed to publish portfolio');
    }
  };

  const handleUnpublish = async () => {
    try {
      await portfolioAPI.unpublish(id);
      setFormData(prev => ({ ...prev, isPublic: false }));
      toast.success('Portfolio unpublished successfully');
    } catch (error) {
      console.error('Error unpublishing portfolio:', error);
      toast.error('Failed to unpublish portfolio');
    }
  };

  const handleSave = async () => {
    try {
      if (id) {
        await portfolioAPI.updatePortfolio(id, formData);
        toast.success('Portfolio saved successfully');
      } else {
        const response = await portfolioAPI.createPortfolio(formData);
        navigate(`/portfolio-builder/${response.data.id}`);
        toast.success('Portfolio created successfully');
      }
    } catch (error) {
      console.error('Error saving portfolio:', error);
      toast.error('Failed to save portfolio');
    }
  };

  const handlePreview = () => {
    // Open preview in modal
    setIsPreviewOpen(true);
  };

  const handleDownload = () => {
    // Implement PDF download functionality
    toast.success('Download feature coming soon!');
  };

  const handleShare = () => {
    if (portfolio?.publicLink) {
      navigator.clipboard.writeText(`${window.location.origin}/portfolio/${portfolio.publicLink}`);
      toast.success('Share link copied to clipboard');
    } else {
      toast.error('Please make the portfolio public first');
    }
  };

  const openExpModal = (index = null) => {
    if (index !== null) {
      const exp = portfolioData.experience[index];
      setExpForm({
        title: exp.title || exp.position || '',
        company: exp.company || exp.organization || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: exp.description || '',
        responsibilities: exp.responsibilities || []
      });
      setEditingIndex(index);
    } else {
      setExpForm({ title: '', company: '', startDate: '', endDate: '', description: '', responsibilities: [] });
      setEditingIndex(null);
    }
    setShowExpModal(true);
  };

  const saveExperience = () => {
    const experiences = [...portfolioData.experience];
    const newExp = {
      title: expForm.title,
      company: expForm.company,
      startDate: expForm.startDate,
      endDate: expForm.endDate,
      description: expForm.description,
      responsibilities: expForm.responsibilities
    };
    
    if (editingIndex !== null) {
      experiences[editingIndex] = newExp;
    } else {
      experiences.push(newExp);
    }
    
    const updatedData = { ...portfolioData, experience: experiences };
    setPortfolioData(updatedData);
    
    if (id) {
      const updatedFormData = { ...formData, jsonContent: JSON.stringify(updatedData) };
      savePortfolio(id, updatedFormData);
    }
    
    setShowExpModal(false);
    toast.success(`Experience ${editingIndex !== null ? 'updated' : 'added'} successfully`);
  };

  const deleteExperience = (index) => {
    const experiences = portfolioData.experience.filter((_, i) => i !== index);
    const updatedData = { ...portfolioData, experience: experiences };
    setPortfolioData(updatedData);
    
    if (id) {
      const updatedFormData = { ...formData, jsonContent: JSON.stringify(updatedData) };
      savePortfolio(id, updatedFormData);
    }
    
    toast.success('Experience deleted successfully');
  };

  const openProjectModal = (index = null) => {
    if (index !== null) {
      const project = portfolioData.projects[index];
      setProjectForm({
        name: project.name || project.title || '',
        description: project.description || '',
        technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
        demo: project.demo || '',
        github: project.github || ''
      });
      setEditingIndex(index);
    } else {
      setProjectForm({ name: '', description: '', technologies: '', demo: '', github: '' });
      setEditingIndex(null);
    }
    setShowProjectModal(true);
  };

  const saveProject = () => {
    const projects = [...portfolioData.projects];
    const techArray = projectForm.technologies.split(',').map(t => t.trim()).filter(t => t);
    const newProject = {
      name: projectForm.name,
      title: projectForm.name,
      description: projectForm.description,
      technologies: techArray,
      demo: projectForm.demo,
      github: projectForm.github
    };
    
    if (editingIndex !== null) {
      projects[editingIndex] = newProject;
    } else {
      projects.push(newProject);
    }
    
    const updatedData = { ...portfolioData, projects };
    setPortfolioData(updatedData);
    
    if (id) {
      const updatedFormData = { ...formData, jsonContent: JSON.stringify(updatedData) };
      savePortfolio(id, updatedFormData);
    }
    
    setShowProjectModal(false);
    toast.success(`Project ${editingIndex !== null ? 'updated' : 'added'} successfully`);
  };

  const deleteProject = (index) => {
    const projects = portfolioData.projects.filter((_, i) => i !== index);
    const updatedData = { ...portfolioData, projects };
    setPortfolioData(updatedData);
    
    if (id) {
      const updatedFormData = { ...formData, jsonContent: JSON.stringify(updatedData) };
      savePortfolio(id, updatedFormData);
    }
    
    toast.success('Project deleted successfully');
  };

  const openSkillModal = (index = null) => {
    if (index !== null) {
      const skill = portfolioData.skills[index];
      setSkillForm({
        name: skill.name || skill || '',
        level: skill.level || 85
      });
      setEditingIndex(index);
    } else {
      setSkillForm({ name: '', level: 85 });
      setEditingIndex(null);
    }
    setShowSkillModal(true);
  };

  const saveSkill = () => {
    const skills = [...portfolioData.skills];
    const newSkill = { name: skillForm.name, level: skillForm.level };
    
    if (editingIndex !== null) {
      skills[editingIndex] = newSkill;
    } else {
      skills.push(newSkill);
    }
    
    const updatedData = { ...portfolioData, skills };
    setPortfolioData(updatedData);
    
    if (id) {
      const updatedFormData = { ...formData, jsonContent: JSON.stringify(updatedData) };
      savePortfolio(id, updatedFormData);
    }
    
    setShowSkillModal(false);
    toast.success(`Skill ${editingIndex !== null ? 'updated' : 'added'} successfully`);
  };

  const deleteSkill = (index) => {
    const skills = portfolioData.skills.filter((_, i) => i !== index);
    const updatedData = { ...portfolioData, skills };
    setPortfolioData(updatedData);
    
    if (id) {
      const updatedFormData = { ...formData, jsonContent: JSON.stringify(updatedData) };
      savePortfolio(id, updatedFormData);
    }
    
    toast.success('Skill deleted successfully');
  };

  const addSection = (sectionType) => {
    if (sectionType === 'experience') {
      openExpModal();
    } else if (sectionType === 'projects') {
      openProjectModal();
    } else if (sectionType === 'skills') {
      openSkillModal();
    } else {
      const newSection = {
        id: Date.now().toString(),
        type: sectionType,
        title: sectionType.charAt(0).toUpperCase() + sectionType.slice(1),
        items: [],
        isFixed: sectionType === 'personal'
      };
      
      setSections(prev => [...prev, newSection]);
      
      // Update portfolio data
      const updatedData = { ...portfolioData };
      if (!updatedData[sectionType]) {
        updatedData[sectionType] = [];
      }
      setPortfolioData(updatedData);
      
      // Auto-save
      if (id) {
        const updatedFormData = {
          ...formData,
          jsonContent: JSON.stringify(updatedData)
        };
        savePortfolio(id, updatedFormData);
      }
      
      toast.success(`${sectionType} section added successfully`);
    }
  };

  const addCustomSection = () => {
    if (!newSectionName.trim()) {
      toast.error('Please enter a section name');
      return;
    }
    
    const newSection = {
      id: Date.now().toString(),
      type: 'custom',
      title: newSectionName.trim(),
      items: [],
      isFixed: false
    };
    
    setSections(prev => [...prev, newSection]);
    setNewSectionName('');
    setShowAddSection(false);
    
    toast.success('Custom section added successfully');
  };

  const removeSection = (sectionId) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
    toast.success('Section removed successfully');
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

  const TemplateComponent = getPortfolioTemplateById(formData.templateId).component;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portfolio Builder</h1>
              <p className="text-gray-600">
                {isSaving ? 'Auto-saving...' : 'Build your professional portfolio'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="btn-secondary"
            >
              <Palette className="w-4 h-4 mr-2" />
              Templates
            </button>
            <button
              onClick={() => setShowResumeImport(true)}
              className="btn-secondary"
            >
              <FileText className="w-4 h-4 mr-2" />
              Import Resume
            </button>
            <button
              onClick={() => setShowChat(true)}
              className="btn-secondary"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              AI Chat
            </button>
            <button
              onClick={handleSave}
              className="btn-secondary"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
            <button
              onClick={handlePreview}
              className="btn-secondary"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
            {formData.isPublic ? (
              <button
                onClick={handleUnpublish}
                className="btn-secondary"
              >
                <Globe className="w-4 h-4 mr-2" />
                Unpublish
              </button>
            ) : (
              <button
                onClick={handlePublish}
                className="btn-primary"
              >
                <Globe className="w-4 h-4 mr-2" />
                Publish
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    activeTab === 'content' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Content
                </button>
                <button
                  onClick={() => setActiveTab('experience')}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    activeTab === 'experience' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Experience
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    activeTab === 'projects' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Code className="w-4 h-4 inline mr-2" />
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    activeTab === 'skills' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Award className="w-4 h-4 inline mr-2" />
                  Skills
                </button>
                
                {/* Add Section Button */}
                <button
                  onClick={() => setShowAddSection(true)}
                  className="w-full text-left px-3 py-2 rounded-lg text-blue-600 hover:bg-blue-50 border border-blue-200 border-dashed"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add Section
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    activeTab === 'settings' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  Settings
                </button>
              </div>
            </div>

            {/* Analytics */}
            {portfolio && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Analytics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Views</span>
                    <span className="font-semibold">{portfolio.viewsCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      formData.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {formData.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                  {formData.isPublic && (
                    <div className="pt-3 border-t">
                      <a
                        href={`/portfolio/${portfolio.slug || portfolio.publicLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Live Portfolio
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Content and Preview Container */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Content Section */}
              <div>
            {activeTab === 'content' && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Portfolio Content</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="input-field"
                      placeholder="Enter portfolio title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={portfolioData.name}
                      onChange={(e) => handlePortfolioDataChange('name', e.target.value)}
                      className="input-field"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={portfolioData.title}
                      onChange={(e) => handlePortfolioDataChange('title', e.target.value)}
                      className="input-field"
                      placeholder="e.g., Software Engineer, Designer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      About You
                    </label>
                    <textarea
                      value={portfolioData.about}
                      onChange={(e) => handlePortfolioDataChange('about', e.target.value)}
                      rows={4}
                      className="input-field"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={portfolioData.email}
                        onChange={(e) => handlePortfolioDataChange('email', e.target.value)}
                        className="input-field"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={portfolioData.phone}
                        onChange={(e) => handlePortfolioDataChange('phone', e.target.value)}
                        className="input-field"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={portfolioData.location}
                      onChange={(e) => handlePortfolioDataChange('location', e.target.value)}
                      className="input-field"
                      placeholder="City, State, Country"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={portfolioData.website}
                        onChange={(e) => handlePortfolioDataChange('website', e.target.value)}
                        className="input-field"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub
                      </label>
                      <input
                        type="url"
                        value={portfolioData.github}
                        onChange={(e) => handlePortfolioDataChange('github', e.target.value)}
                        className="input-field"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={portfolioData.linkedin}
                        onChange={(e) => handlePortfolioDataChange('linkedin', e.target.value)}
                        className="input-field"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Experience</h2>
                  <button 
                    onClick={() => addSection('experience')}
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </button>
                </div>
                
                <div className="space-y-4">
                  {portfolioData.experience.map((exp, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{exp.title || exp.position}</h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openExpModal(index)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteExperience(index)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{exp.company || exp.organization}</p>
                      <p className="text-sm text-gray-500 mb-2">{exp.period || `${exp.startDate} - ${exp.endDate}`}</p>
                      {exp.description && <p className="text-gray-600 text-sm">{exp.description}</p>}
                    </div>
                  ))}
                  
                  {portfolioData.experience.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No experience added yet</p>
                      <p className="text-sm">Click "Add Experience" to get started</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
                  <button 
                    onClick={() => addSection('projects')}
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </button>
                </div>
                
                <div className="space-y-4">
                  {portfolioData.projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{project.name || project.title}</h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openProjectModal(index)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteProject(index)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{project.description}</p>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {portfolioData.projects.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Code className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No projects added yet</p>
                      <p className="text-sm">Click "Add Project" to get started</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                  <button 
                    onClick={() => addSection('skills')}
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </button>
                </div>
                
                <div className="space-y-4">
                  {portfolioData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{skill.name || skill}</span>
                        {skill.level && (
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button 
                          onClick={() => openSkillModal(index)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteSkill(index)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {portfolioData.skills.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No skills added yet</p>
                      <p className="text-sm">Click "Add Skill" to get started</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Portfolio Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom URL Slug
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        yoursite.com/u/
                      </span>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        className="flex-1 input-field rounded-l-none"
                        placeholder="your-custom-slug"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                      className="input-field"
                      placeholder="SEO optimized title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Description
                    </label>
                    <textarea
                      value={formData.seoDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                      rows={3}
                      className="input-field"
                      placeholder="SEO description for search engines"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.seoImageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, seoImageUrl: e.target.value }))}
                      className="input-field"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Make this portfolio public
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
              </div>

              {/* Preview Section */}
              <div>
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                <button 
                  onClick={handlePreview}
                  className="btn-primary flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Full Preview
                </button>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[500px]">
                <div className="transform scale-90 origin-top-left w-[111%] h-[111%] overflow-hidden">
                  <TemplateComponent data={portfolioData} isPreview={true} />
                </div>
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Choose a Template</h3>
              <button
                onClick={() => setShowTemplateSelector(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(PORTFOLIO_TEMPLATE_REGISTRY).map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateChange(template.id)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    formData.templateId === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {template.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Resume Import Modal */}
      {showResumeImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Import from Resume</h3>
              <button
                onClick={() => setShowResumeImport(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">Select a resume to import data from:</p>
              
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  onClick={() => handleResumeImport(resume.id)}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-300 transition-colors"
                >
                  <h4 className="font-semibold text-gray-900">{resume.title}</h4>
                  <p className="text-sm text-gray-600">Status: {resume.status}</p>
                </div>
              ))}
              
              {resumes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No resumes found</p>
                  <p className="text-sm">Create a resume first to import data</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">AI Assistant</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">Ask me to help you with your portfolio:</p>
              
              <div className="space-y-2">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  "Add a new project with React and Node.js"
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  "Improve my about section"
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  "Suggest skills for a frontend developer"
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  "Change theme to dark mode"
                </button>
              </div>
              
              <div className="mt-6">
                <textarea
                  placeholder="Type your request here..."
                  className="w-full p-3 border border-gray-200 rounded-lg"
                  rows={3}
                />
                <button className="mt-2 btn-primary">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      <Modal
        open={showAddSection}
        onClose={() => setShowAddSection(false)}
        title="Add New Section"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Name
            </label>
            <input
              type="text"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              className="input-field"
              placeholder="Enter section name (e.g., Education, Certifications)"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAddSection(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={addCustomSection}
              className="btn-primary"
            >
              Add Section
            </button>
          </div>
        </div>
      </Modal>

      {/* Experience Modal */}
      <Modal
        open={showExpModal}
        onClose={() => setShowExpModal(false)}
        title={editingIndex !== null ? 'Edit Experience' : 'Add Experience'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <input
              type="text"
              value={expForm.title}
              onChange={(e) => setExpForm(prev => ({ ...prev, title: e.target.value }))}
              className="input-field"
              placeholder="Software Engineer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <input
              type="text"
              value={expForm.company}
              onChange={(e) => setExpForm(prev => ({ ...prev, company: e.target.value }))}
              className="input-field"
              placeholder="Company Name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="month"
                value={expForm.startDate}
                onChange={(e) => setExpForm(prev => ({ ...prev, startDate: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="month"
                value={expForm.endDate}
                onChange={(e) => setExpForm(prev => ({ ...prev, endDate: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={expForm.description}
              onChange={(e) => setExpForm(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="input-field"
              placeholder="Describe your role and achievements..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button onClick={() => setShowExpModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={saveExperience} className="btn-primary">Save</button>
          </div>
        </div>
      </Modal>

      {/* Project Modal */}
      <Modal
        open={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        title={editingIndex !== null ? 'Edit Project' : 'Add Project'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
            <input
              type="text"
              value={projectForm.name}
              onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
              className="input-field"
              placeholder="My Awesome Project"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={projectForm.description}
              onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="input-field"
              placeholder="Describe your project..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
            <input
              type="text"
              value={projectForm.technologies}
              onChange={(e) => setProjectForm(prev => ({ ...prev, technologies: e.target.value }))}
              className="input-field"
              placeholder="React, Node.js, MongoDB (comma separated)"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
              <input
                type="url"
                value={projectForm.github}
                onChange={(e) => setProjectForm(prev => ({ ...prev, github: e.target.value }))}
                className="input-field"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Demo URL</label>
              <input
                type="url"
                value={projectForm.demo}
                onChange={(e) => setProjectForm(prev => ({ ...prev, demo: e.target.value }))}
                className="input-field"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button onClick={() => setShowProjectModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={saveProject} className="btn-primary">Save</button>
          </div>
        </div>
      </Modal>

      {/* Skill Modal */}
      <Modal
        open={showSkillModal}
        onClose={() => setShowSkillModal(false)}
        title={editingIndex !== null ? 'Edit Skill' : 'Add Skill'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
            <input
              type="text"
              value={skillForm.name}
              onChange={(e) => setSkillForm(prev => ({ ...prev, name: e.target.value }))}
              className="input-field"
              placeholder="JavaScript"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proficiency Level: {skillForm.level}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={skillForm.level}
              onChange={(e) => setSkillForm(prev => ({ ...prev, level: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button onClick={() => setShowSkillModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={saveSkill} className="btn-primary">Save</button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Portfolio Preview"
        fullscreen
      >
        <div className="h-[calc(100vh-120px)] overflow-y-auto">
          <div className="w-full h-full min-h-[800px]">
            <TemplateComponent data={portfolioData} isPreview={true} />
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default PortfolioBuilderPage;

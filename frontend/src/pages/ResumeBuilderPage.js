import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAutoSave } from '../contexts/AutoSaveContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Save, Eye, Download, Share2, ArrowLeft } from 'lucide-react';
import { resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import SectionManager from '../components/SectionManager';
import AIBar from '../components/AIBar';
import JobUpload from '../components/JobUpload';
import AIFeaturesPanel from '../components/AIFeaturesPanel';
import { templates, getDefaultData } from '../components/templates/TemplateRegistry';
import { exportAPIEnhanced } from '../services/api';
import { saveAs } from 'file-saver';
import Modal from '../components/Modal';

const ResumeBuilderPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { saveResume, isSaving } = useAutoSave();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    templateId: 1,
    status: 'IN_PROGRESS',
    isPublic: false,
    data: { name: '', title: '', sections: [] }
  });
  const [previewHtml, setPreviewHtml] = useState('');
  const [versions, setVersions] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const ensurePersonalInformation = (data) => {
    const sections = Array.isArray(data.sections) ? data.sections.slice() : [];
    const idx = sections.findIndex(s => (s.title || '').toLowerCase() === 'personal information');
    if (idx === -1) {
      sections.unshift({
        id: 'personal-information',
        title: 'Personal Information',
        items: [{
          name: data.name || 'John Doe',
          title: data.title || 'Software Engineer',
          email: data.email || 'john.doe@email.com',
          phone: data.phone || '+1 555-123-4567',
          location: data.location || 'San Francisco, CA',
          extras: []
        }]
      });
    }
    return { ...data, sections };
  };

  useEffect(() => {
    if (id) {
      fetchResume();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (resume) {
      let data = {};
      try { data = resume.jsonContent ? JSON.parse(resume.jsonContent) : {}; } catch {}
      const hasSections = data.sections && data.sections.length > 0;
      const nextData = hasSections ? { name: data.name || '', title: data.title || '', photoUrl: data.photoUrl, email: data.email, phone: data.phone, location: data.location, sections: data.sections }
                                   : getDefaultData(resume.templateId || 1);
      setFormData(prev => ({
        ...prev,
        title: resume.title || '',
        templateId: resume.templateId || 1,
        status: resume.status || 'IN_PROGRESS',
        isPublic: resume.isPublic || false,
        data: ensurePersonalInformation(nextData)
      }));
    }
  }, [resume]);

  // Auto-save functionality
  useEffect(() => {
    if (id && formData.data && formData.data.sections && formData.data.sections.length > 0) {
      const timeoutId = setTimeout(() => {
        try {
          // Validate that we have valid data before saving
          const jsonContent = JSON.stringify(formData.data);
          if (!jsonContent || jsonContent === '{}' || jsonContent === '{"sections":[]}') {
            return; // Don't save empty data
          }

          const payload = {
            title: formData.title || 'New Resume',
            templateId: formData.templateId || 1,
            jsonContent: jsonContent,
            status: formData.status || 'IN_PROGRESS',
            isPublic: formData.isPublic || false,
          };
          saveResume(id, payload);
        } catch (error) {
          console.error('Error preparing autosave payload:', error);
        }
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [formData, id, saveResume]);

  const fetchResume = async () => {
    try {
      const response = await resumeAPI.getResume(id);
      setResume(response.data);
    } catch (error) {
      console.error('Error fetching resume:', error);
      toast.error('Failed to load resume');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      if (id) {
        const payload = {
          title: formData.title,
          templateId: formData.templateId,
          jsonContent: JSON.stringify(formData.data),
          status: formData.status,
          isPublic: formData.isPublic,
        };
        await resumeAPI.updateResume(id, payload);
        toast.success('Resume saved successfully');
      } else {
        const response = await resumeAPI.createResume({ title: formData.title });
        navigate(`/resume-builder/${response.data.id}`);
        toast.success('Resume created successfully');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Failed to save resume');
    }
  };

  const updatePreview = () => {
    const html = templates[formData.templateId]?.render(formData.data) || '';
    setPreviewHtml(html);
  };

  useEffect(() => { updatePreview(); }, [formData]);

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const handleDownload = async () => {
    if (!id) { 
      toast.error('Save resume first'); 
      return; 
    }
    
    // Generate HTML from current form data
    let htmlToExport = previewHtml;
    if (!htmlToExport || htmlToExport.trim() === '') {
      // Generate HTML on-demand if preview is empty
      htmlToExport = templates[formData.templateId]?.render(formData.data) || '';
    }
    
    if (!htmlToExport || htmlToExport.trim() === '') {
      toast.error('No content to export. Please add some content to your resume first.');
      return;
    }
    
    try {
      setIsExporting(true);
      const pdfRes = await exportAPIEnhanced.pdf(id, htmlToExport);
      
      // Check response status
      if (pdfRes.status >= 200 && pdfRes.status < 300) {
        // Success - create and download the PDF
        const blob = pdfRes.data instanceof Blob 
          ? pdfRes.data 
          : new Blob([pdfRes.data], { type: 'application/pdf' });
        saveAs(blob, `resume-${id}.pdf`);
        toast.success('PDF exported successfully');
      } else {
        toast.error('Export failed: Invalid response from server');
      }
    } catch (e) {
      console.error('Export error:', e);
      let errorMsg = 'Export failed';
      
      // Handle error response - the interceptor should have converted blob errors to JSON
      if (e.response) {
        if (e.response.data?.error) {
          errorMsg = e.response.data.error;
        } else if (typeof e.response.data === 'string') {
          try {
            const errorData = JSON.parse(e.response.data);
            errorMsg = errorData.error || errorMsg;
          } catch (parseError) {
            errorMsg = e.response.data || errorMsg;
          }
        } else {
          errorMsg = `HTTP ${e.response.status}: ${e.response.statusText || 'Export failed'}`;
        }
      } else if (e.message) {
        errorMsg = e.message;
      }
      
      toast.error(errorMsg);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = () => {
    if (resume?.publicLink) {
      navigator.clipboard.writeText(`${window.location.origin}/resume/${resume.publicLink}`);
      toast.success('Share link copied to clipboard');
    } else {
      toast.error('Please make the resume public first');
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
      
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-8">
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
              <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
              <p className="text-gray-600">
                {isSaving ? 'Auto-saving...' : 'Build your professional resume'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
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
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="btn-secondary disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Download'}
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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Resume Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                    placeholder="Enter resume title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                  <select
                    className="input-field"
                    value={formData.templateId}
                    onChange={(e) => setFormData(prev => ({ ...prev, templateId: Number(e.target.value), data: getDefaultData(Number(e.target.value)) }))}
                  >
                    {Object.entries(templates).map(([id, t]) => (
                      <option key={id} value={Number(id)}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <SectionManager
                  sections={formData.data.sections}
                  setSections={(sections) => setFormData(prev => ({ ...prev, data: { ...prev.data, sections } }))}
                />

                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Make this resume public
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.status === 'COMPLETED'}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        status: e.target.checked ? 'COMPLETED' : 'IN_PROGRESS'
                      }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Mark as completed
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <AIBar
              resumeData={formData.data}
              onApplyAI={(type, res) => {
                if (type === 'summary') {
                  const summary = res.summary || res;
                  const exists = formData.data.sections.find(s => s.title.toLowerCase() === 'summary');
                  const sections = exists ? formData.data.sections.map(s => s.title.toLowerCase() === 'summary' ? { ...s, items: [summary] } : s)
                                          : [{ id: 'summary', title: 'Summary', items: [summary] }, ...formData.data.sections];
                  setFormData(prev => ({ ...prev, data: { ...prev.data, sections } }));
                }
                if (type === 'skills') {
                  const skills = res.skills || res;
                  const sections = formData.data.sections.map(s => s.title.toLowerCase() === 'skills' ? { ...s, items: [skills] } : s);
                  setFormData(prev => ({ ...prev, data: { ...prev.data, sections } }));
                }
                if (type === 'ats') {
                  // naive append optimized text
                  const sections = formData.data.sections.map(s => ({ ...s, items: [...(s.items||[]), res.optimized || res] }));
                  setFormData(prev => ({ ...prev, data: { ...prev.data, sections } }));
                }
                if (type === 'ocr') {
                  const text = res.parsedText;
                  const sections = [{ id: 'job', title: 'Job Description', items: [text] }, ...formData.data.sections];
                  setFormData(prev => ({ ...prev, data: { ...prev.data, sections } }));
                }
              }}
            />

            <div className="mt-4 space-y-4">
              <JobUpload onParsed={(res) => {
                const text = res.parsedText;
                const sections = [{ id: 'job', title: 'Job Description', items: [text] }, ...formData.data.sections];
                setFormData(prev => ({ ...prev, data: { ...prev.data, sections } }));
              }} />
              <AIFeaturesPanel
                resumeText={JSON.stringify(formData.data)}
                jobText={(formData.data.sections.find(s => (s.title||'').toLowerCase()==='job description')?.items?.[0]) || ''}
                bullets={(formData.data.sections.find(s => (s.title||'').toLowerCase()==='experience')?.items) || []}
                onAcceptSummary={(text) => {
                  const exists = formData.data.sections.find(s => s.title.toLowerCase() === 'summary');
                  const sections = exists ? formData.data.sections.map(s => s.title.toLowerCase() === 'summary' ? { ...s, items: [text] } : s)
                                          : [{ id: 'summary', title: 'Summary', items: [text] }, ...formData.data.sections];
                  setFormData(prev => ({ ...prev, data: { ...prev.data, sections } }));
                }}
                onAcceptBullets={(index, text) => {
                  const sections = formData.data.sections.map(s => (s.title||'').toLowerCase() === 'experience' ? { ...s, items: s.items.map((b, i) => i===index ? text : b) } : s);
                  setFormData(prev => ({ ...prev, data: { ...prev.data, sections } }));
                }}
                onAddSkills={(arr) => {
                  const exists = formData.data.sections.find(s => (s.title||'').toLowerCase() === 'skills');
                  const sections = exists ? formData.data.sections.map(s => (s.title||'').toLowerCase() === 'skills' ? { ...s, items: [...(s.items||[]), ...arr] } : s)
                                          : [{ id: 'skills', title: 'Skills', items: arr }, ...formData.data.sections];
                  setFormData(prev => ({ ...prev, data: { ...prev.data, sections } }));
                }}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-3">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-96">
                <iframe title="preview" className="w-full h-[1000px]" srcDoc={previewHtml} />
              </div>
            </div>

            {/* Version History */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Version History</h3>
              <div className="flex items-center gap-2">
                <button className="btn-secondary" onClick={async () => { await resumeAPI.saveVersion(id); toast.success('Snapshot saved'); }}>
                  Save Snapshot
                </button>
                <button className="btn-secondary" onClick={async () => { const res = await resumeAPI.listVersions(id); setVersions(res.data); }}>
                  Refresh List
                </button>
              </div>
              <ul className="mt-4 space-y-2">
                {versions.map(v => (
                  <li key={v.id} className="flex items-center justify-between bg-white rounded border px-3 py-2">
                    <span className="text-sm text-gray-700">{new Date(v.createdAt).toLocaleString()}</span>
                    <button className="btn-secondary" onClick={async () => { await resumeAPI.restoreVersion(id, v.id); toast.success('Restored'); }}>
                      Restore
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Preview Modal */}
      <Modal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Resume Preview"
        fullscreen
      >
        <div className="h-[calc(100vh-120px)] overflow-y-auto">
          <iframe title="preview-modal" className="w-full h-full min-h-[800px]" srcDoc={previewHtml} />
        </div>
      </Modal>
    </div>
  );
};

export default ResumeBuilderPage;

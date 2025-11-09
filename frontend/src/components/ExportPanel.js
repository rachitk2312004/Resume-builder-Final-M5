import React, { useState } from 'react';
import { Download, Mail, Link2, FileText, File, FileCode } from 'lucide-react';
import { exportAPIEnhanced } from '../services/api';
import toast from 'react-hot-toast';
import { saveAs } from 'file-saver';

export default function ExportPanel({ resumeId, htmlContent }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [exportType, setExportType] = useState('PDF');

  const handleExport = async (type) => {
    if (!resumeId) {
      toast.error('Please save your resume first');
      return;
    }
    
    if (!htmlContent) {
      toast.error('No content to export');
      return;
    }

    try {
      setLoading(true);
      let response;
      let fileName;
      let blob;

      if (type === 'PDF') {
        response = await exportAPIEnhanced.pdf(resumeId, htmlContent);
        blob = new Blob([response.data], { type: 'application/pdf' });
        fileName = `resume-${resumeId}.pdf`;
      } else if (type === 'DOCX') {
        response = await exportAPIEnhanced.docx(resumeId, htmlContent);
        blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        fileName = `resume-${resumeId}.docx`;
      } else if (type === 'TEXT') {
        response = await exportAPIEnhanced.text(resumeId, htmlContent);
        // TEXT endpoint returns String, not blob
        const textContent = typeof response.data === 'string' ? response.data : response.data.toString();
        blob = new Blob([textContent], { type: 'text/plain' });
        fileName = `resume-${resumeId}.txt`;
      }

      if (!blob) {
        toast.error('Failed to generate export file');
        return;
      }

      saveAs(blob, fileName);
      toast.success(`${type} exported successfully`);
    } catch (e) {
      console.error(e);
      toast.error(`Failed to export ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailExport = async () => {
    if (!resumeId) {
      toast.error('Please save your resume first');
      return;
    }
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (!htmlContent) {
      toast.error('No content to export');
      return;
    }

    try {
      setLoading(true);
      await exportAPIEnhanced.email(resumeId, htmlContent, exportType, email);
      toast.success(`Export sent to ${email}`);
      setShowEmailModal(false);
      setEmail('');
    } catch (e) {
      console.error(e);
      toast.error('Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!resumeId) {
      toast.error('Please save your resume first');
      return;
    }
    
    try {
      setLoading(true);
      const res = await exportAPIEnhanced.share(resumeId);
      const shareUrl = res.data?.shareLink 
        ? `${window.location.origin}/resume/${res.data.shareLink}`
        : res.data?.url 
        ? `${window.location.origin}${res.data.url}`
        : `${window.location.origin}/resume/${resumeId}`;
      
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to create share link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          disabled={loading}
          onClick={() => handleExport('PDF')}
          className="btn-secondary disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <File className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
        <button
          disabled={loading}
          onClick={() => handleExport('DOCX')}
          className="btn-secondary disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <FileText className="w-4 h-4" />
          <span>Download DOCX</span>
        </button>
        <button
          disabled={loading}
          onClick={() => handleExport('TEXT')}
          className="btn-secondary disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <FileCode className="w-4 h-4" />
          <span>Download Text</span>
        </button>
        <button
          disabled={loading}
          onClick={() => setShowEmailModal(true)}
          className="btn-secondary disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <Mail className="w-4 h-4" />
          <span>Email Export</span>
        </button>
      </div>

      <button
        disabled={loading}
        onClick={handleShare}
        className="btn-primary w-full disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        <Link2 className="w-4 h-4" />
        <span>Create Share Link</span>
      </button>

      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold mb-4">Email Export</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                <select
                  value={exportType}
                  onChange={(e) => setExportType(e.target.value)}
                  className="input-field"
                >
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                  <option value="TEXT">Plain Text</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="recipient@example.com"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleEmailExport}
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  Send
                </button>
                <button
                  onClick={() => {
                    setShowEmailModal(false);
                    setEmail('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


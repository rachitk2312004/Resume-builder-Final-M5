import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowLeft, Download, FileText, BarChart3 } from 'lucide-react';
import { aiLogsAPI, atsHistoryAPI } from '../services/api';
import toast from 'react-hot-toast';

const LogsViewerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ai-logs');
  const [aiLogs, setAiLogs] = useState([]);
  const [atsScores, setAtsScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLogsPage, setAiLogsPage] = useState(0);
  const [atsPage, setAtsPage] = useState(0);
  const [aiLogsTotalPages, setAiLogsTotalPages] = useState(0);
  const [atsTotalPages, setAtsTotalPages] = useState(0);

  useEffect(() => {
    if (activeTab === 'ai-logs') {
      fetchAiLogs();
    } else {
      fetchAtsHistory();
    }
  }, [activeTab, aiLogsPage, atsPage]);

  const fetchAiLogs = async () => {
    try {
      setLoading(true);
      const res = await aiLogsAPI.getLogs(aiLogsPage, 20);
      setAiLogs(res.data.logs || []);
      setAiLogsTotalPages(res.data.totalPages || 0);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load AI logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchAtsHistory = async () => {
    try {
      setLoading(true);
      const res = await atsHistoryAPI.getHistory(atsPage, 20);
      setAtsScores(res.data.scores || []);
      setAtsTotalPages(res.data.totalPages || 0);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load ATS history');
    } finally {
      setLoading(false);
    }
  };

  const exportAiLogs = async () => {
    try {
      const res = await aiLogsAPI.exportLogs();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ai_logs.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('AI logs exported');
    } catch (e) {
      console.error(e);
      toast.error('Failed to export logs');
    }
  };

  const exportAtsHistory = async () => {
    try {
      const res = await atsHistoryAPI.exportHistory();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ats_history.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('ATS history exported');
    } catch (e) {
      console.error(e);
      toast.error('Failed to export history');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/settings')}
              className="text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Usage & Logs</h1>
              <p className="text-gray-600 mt-2">View and export your AI usage logs and ATS history</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('ai-logs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ai-logs'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>AI Usage Logs</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('ats-history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ats-history'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>ATS History</span>
                </div>
              </button>
            </nav>
          </div>

          {activeTab === 'ai-logs' && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={exportAiLogs}
                  className="btn-secondary flex items-center space-x-2"
                  disabled={loading}
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Endpoint
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Model
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tokens Used
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : aiLogs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          No logs found
                        </td>
                      </tr>
                    ) : (
                      aiLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.endpoint}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.model || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.tokensUsed || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              log.success
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {log.success ? 'Success' : 'Failed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(log.createdAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {aiLogsTotalPages > 1 && (
                <div className="mt-4 flex justify-center space-x-2">
                  <button
                    onClick={() => setAiLogsPage(Math.max(0, aiLogsPage - 1))}
                    disabled={aiLogsPage === 0}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {aiLogsPage + 1} of {aiLogsTotalPages}
                  </span>
                  <button
                    onClick={() => setAiLogsPage(Math.min(aiLogsTotalPages - 1, aiLogsPage + 1))}
                    disabled={aiLogsPage >= aiLogsTotalPages - 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ats-history' && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={exportAtsHistory}
                  className="btn-secondary flex items-center space-x-2"
                  disabled={loading}
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resume ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Keywords
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : atsScores.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                          No ATS scores found
                        </td>
                      </tr>
                    ) : (
                      atsScores.map((score) => (
                        <tr key={score.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {score.resumeId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              score.score >= 80
                                ? 'bg-green-100 text-green-800'
                                : score.score >= 50
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {score.score}/100
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {score.keywords || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(score.createdAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {atsTotalPages > 1 && (
                <div className="mt-4 flex justify-center space-x-2">
                  <button
                    onClick={() => setAtsPage(Math.max(0, atsPage - 1))}
                    disabled={atsPage === 0}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {atsPage + 1} of {atsTotalPages}
                  </span>
                  <button
                    onClick={() => setAtsPage(Math.min(atsTotalPages - 1, atsPage + 1))}
                    disabled={atsPage >= atsTotalPages - 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LogsViewerPage;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { AutoSaveProvider } from './contexts/AutoSaveContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import PortfolioBuilderPage from './pages/PortfolioBuilderPage';
import SettingsPage from './pages/SettingsPage';
import LogsViewerPage from './pages/LogsViewerPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicResumePage from './pages/PublicResumePage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';

function App() {
  return (
    <AuthProvider>
      <AutoSaveProvider>
        <Router>
          <div className="App">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/resume/:publicLink" element={<PublicResumePage />} />
              <Route path="/portfolio/:publicLink" element={<PublicPortfolioPage />} />
              <Route path="/u/:slug" element={<PublicPortfolioPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resume-builder/:id?" 
                element={
                  <ProtectedRoute>
                    <ResumeBuilderPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/portfolio-builder/:id?" 
                element={
                  <ProtectedRoute>
                    <PortfolioBuilderPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings/logs" 
                element={
                  <ProtectedRoute>
                    <LogsViewerPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </AutoSaveProvider>
    </AuthProvider>
  );
}

export default App;

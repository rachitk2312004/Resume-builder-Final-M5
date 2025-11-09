import React, { createContext, useContext, useState, useCallback } from 'react';
import { resumeAPI, portfolioAPI } from '../services/api';
import toast from 'react-hot-toast';

const AutoSaveContext = createContext();

export const useAutoSave = () => {
  const context = useContext(AutoSaveContext);
  if (!context) {
    throw new Error('useAutoSave must be used within an AutoSaveProvider');
  }
  return context;
};

export const AutoSaveProvider = ({ children }) => {
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const saveResume = useCallback(async (id, data) => {
    if (!autoSaveEnabled || !id) return;

    setIsSaving(true);
    try {
      // Validate data before sending
      if (!data || !data.jsonContent) {
        console.warn('Autosave skipped: missing data');
        return;
      }

      await resumeAPI.updateResume(id, data);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Auto-save failed';
      // Only show error toast if it's a real error (not validation)
      if (error.response?.status !== 400) {
        toast.error(`Auto-save failed: ${errorMsg}`, { duration: 3000 });
      }
    } finally {
      setIsSaving(false);
    }
  }, [autoSaveEnabled]);

  const savePortfolio = useCallback(async (id, data) => {
    if (!autoSaveEnabled || !id) return;

    setIsSaving(true);
    try {
      // Validate data before sending
      if (!data || !data.jsonContent) {
        console.warn('Autosave skipped: missing data');
        return;
      }

      await portfolioAPI.updatePortfolio(id, data);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Auto-save failed';
      // Only show error toast if it's a real error (not validation)
      if (error.response?.status !== 400) {
        toast.error(`Auto-save failed: ${errorMsg}`, { duration: 3000 });
      }
    } finally {
      setIsSaving(false);
    }
  }, [autoSaveEnabled]);

  const toggleAutoSave = useCallback(() => {
    setAutoSaveEnabled(prev => !prev);
    toast.success(`Auto-save ${!autoSaveEnabled ? 'enabled' : 'disabled'}`);
  }, [autoSaveEnabled]);

  const value = {
    autoSaveEnabled,
    lastSaved,
    isSaving,
    saveResume,
    savePortfolio,
    toggleAutoSave,
  };

  return (
    <AutoSaveContext.Provider value={value}>
      {children}
    </AutoSaveContext.Provider>
  );
};

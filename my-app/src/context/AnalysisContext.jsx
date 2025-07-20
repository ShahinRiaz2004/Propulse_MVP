import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchAnalysisHistory } from '../utils/api';

const AnalysisContext = createContext();

export const useAnalysis = () => useContext(AnalysisContext);

export const AnalysisProvider = ({ children }) => {
  const [analyses, setAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const history = await fetchAnalysisHistory();
      setAnalyses(history);
      setError(null);
    } catch (err) {
      setError('Failed to load analysis history');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addAnalysis = (newAnalysis) => {
    setAnalyses(prev => [newAnalysis, ...prev]);
  };

  const value = {
    analyses,
    isLoading,
    error,
    addAnalysis,
    refreshHistory: loadHistory
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};
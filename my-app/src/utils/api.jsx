// API utility functions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const fetchPropertyData = async (address) => {
  const response = await fetch(`${API_BASE_URL}/property`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch property data');
  }
  
  return response.json();
};

export const analyzeProperty = async (propertyData, t12File, rentRollFile) => {
  const formData = new FormData();
  formData.append('property', JSON.stringify(propertyData));
  formData.append('t12', t12File);
  formData.append('rentRoll', rentRollFile);
  
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Analysis failed');
  }
  
  return response.json();
};

export const fetchAnalysisHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/history`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }
  
  return response.json();
};
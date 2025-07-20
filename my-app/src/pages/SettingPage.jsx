import React, { useState, useEffect } from 'react';

// In a real app, you would fetch and save these settings via a context or API.
// For now, we use localStorage to persist them on the user's browser.
const getInitialSettings = () => {
  try {
    const savedSettings = localStorage.getItem('userAnalysisSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  } catch (error) {
    console.error("Failed to parse settings from localStorage", error);
  }
  // Default settings if nothing is saved
  return {
    minCashOnCash: 7.0,
    minYearBuilt: 1980,
    maxCrimeScore: 5, // Example: 1 (low) to 10 (high)
    requireValueAdd: true,
  };
};

const SettingsPage = () => {
  const [settings, setSettings] = useState(getInitialSettings);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseFloat(value) || 0,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('userAnalysisSettings', JSON.stringify(settings));
      setIsSaved(true);
      // Hide the confirmation message after 3 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
      // Here you would show an error message to the user
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis Settings</h1>
          <p className="text-gray-600">
            Customize your investment criteria (your "Buy Box") to filter deals that match your strategy.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSave}>
            <div className="space-y-6">
              {/* Minimum Cash on Cash Return */}
              <div>
                <label htmlFor="minCashOnCash" className="block text-sm font-medium text-gray-700">
                  Minimum Cash on Cash Return (%)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="minCashOnCash"
                    id="minCashOnCash"
                    step="0.1"
                    value={settings.minCashOnCash}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., 7.5"
                  />
                </div>
              </div>

              {/* Minimum Year Built */}
              <div>
                <label htmlFor="minYearBuilt" className="block text-sm font-medium text-gray-700">
                  Minimum Year Built
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="minYearBuilt"
                    id="minYearBuilt"
                    value={settings.minYearBuilt}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., 1980"
                  />
                </div>
              </div>
               {/* Maximum Crime Score */}
              <div>
                <label htmlFor="maxCrimeScore" className="block text-sm font-medium text-gray-700">
                  Maximum Crime Score (1-10)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="maxCrimeScore"
                    id="maxCrimeScore"
                    min="1"
                    max="10"
                    value={settings.maxCrimeScore}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., 5"
                  />
                </div>
              </div>

              {/* Require Value-Add */}
              <div className="flex items-center">
                <input
                  id="requireValueAdd"
                  name="requireValueAdd"
                  type="checkbox"
                  checked={settings.requireValueAdd}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="requireValueAdd" className="ml-2 block text-sm text-gray-900">
                  Must have value-add potential
                </label>
              </div>
            </div>

            <div className="mt-8 pt-5">
              <div className="flex justify-end items-center">
                {isSaved && (
                  <span className="text-green-600 mr-4">Settings saved successfully!</span>
                )}
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

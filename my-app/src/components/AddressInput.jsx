import React, { useState } from 'react';

const AddressInput = ({ onSubmit }) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [propertyData, setPropertyData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to fetch property data
    try {
      // In a real app, you would call your backend API here
      const mockPropertyData = {
        address,
        yearBuilt: 1998,
        unitCount: 48,
        marketCapRate: 7.2,
        neighborhoodRating: 'A-',
        askingPrice: 3500000,
        pricePerUnit: 72916,
        areaIncome: 85000,
        crimeScore: 24
      };
      
      setPropertyData(mockPropertyData);
      onSubmit(mockPropertyData);
    } catch (error) {
      console.error('Error fetching property data:', error);
      alert('Failed to fetch property data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Property Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter full property address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            We'll fetch property details from CoStar, Zillow, and other sources
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading || !address}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
            loading || !address ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fetching property data...
            </span>
          ) : (
            'Fetch Property Data'
          )}
        </button>
      </form>
      
      {propertyData && (
        <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
          <h3 className="font-medium text-indigo-800 mb-2">Property Details Found</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-600">Year Built</p>
              <p className="font-medium">{propertyData.yearBuilt}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Units</p>
              <p className="font-medium">{propertyData.unitCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Market Cap Rate</p>
              <p className="font-medium">{propertyData.marketCapRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Neighborhood Rating</p>
              <p className="font-medium">{propertyData.neighborhoodRating}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressInput;
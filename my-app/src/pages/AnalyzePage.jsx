import React, { useState } from 'react';
import AddressInput from '../components/AddressInput';
import FileUploader from '../components/FileUploader';
import ResultsView from '../components/ResultsView';

const AnalyzePage = () => {
  const [step, setStep] = useState(1); // 1: Address, 2: File Upload, 3: Results
  const [propertyData, setPropertyData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAddressSubmit = (data) => {
    setPropertyData(data);
    setStep(2);
  };

  const handleFileUpload = (result) => {
    setAnalysisResult(result);
    setStep(3);
  };

  const resetProcess = () => {
    setStep(1);
    setPropertyData(null);
    setAnalysisResult(null);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Analysis</h1>
          <p className="text-gray-600">
            Analyze commercial properties in seconds with AI-powered insights
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex mb-6">
            <div className={`flex-1 text-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span>Enter Address</span>
            </div>
            <div className={`flex-1 text-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span>Upload Documents</span>
            </div>
            <div className={`flex-1 text-center ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span>Get Results</span>
            </div>
          </div>

          {step === 1 && <AddressInput onSubmit={handleAddressSubmit} />}
          {step === 2 && <FileUploader onUpload={handleFileUpload} propertyData={propertyData} />}
          {step === 3 && <ResultsView analysis={analysisResult} onReset={resetProcess} />} 
        </div>
      </div>
    </div>
  );
};

export default AnalyzePage;
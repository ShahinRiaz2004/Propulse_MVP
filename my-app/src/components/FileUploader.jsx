import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
// رفع خطای اول: مسیر فایل به صورت دقیق‌تر نوشته شد
import { analyzeProperty } from '../utils/api.jsx'; 

// کامپوننت‌های آیکون به صورت SVG داخلی برای رفع خطای دوم
const FileUploadIcon = () => (
  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" />
  </svg>
);

const PdfIcon = () => (
  <svg className="w-6 h-6 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H4zm6 0v6h6V2h-6zM8 11a1 1 0 112 0v4a1 1 0 11-2 0v-4zm-3-1a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const ExcelIcon = () => (
  <svg className="w-6 h-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H4zm6 0v6h6V2h-6zM6.707 11.707a1 1 0 010-1.414l2-2a1 1 0 011.414 0l2 2a1 1 0 01-1.414 1.414L11 10.414V14a1 1 0 11-2 0v-3.586l-.293.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const SpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


// این کامپوننت باید پراپ‌ها را از AnalyzePage دریافت کند
const FileUploader = ({ propertyData, onUpload, onBack }) => {
  const [t12File, setT12File] = useState(null);
  const [rentRollFile, setRentRollFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles, fileRejection, field) => {
    if (acceptedFiles.length > 0) {
      if (field === 't12') {
        setT12File(acceptedFiles[0]);
      } else if (field === 'rentRoll') {
        setRentRollFile(acceptedFiles[0]);
      }
    }
  }, []);

  const { getRootProps: getT12RootProps, getInputProps: getT12InputProps } = useDropzone({
    onDrop: (files, rejections) => onDrop(files, rejections, 't12'),
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
  });

  const { getRootProps: getRentRollRootProps, getInputProps: getRentRollInputProps } = useDropzone({
    onDrop: (files, rejections) => onDrop(files, rejections, 'rentRoll'),
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    if (!t12File || !rentRollFile) {
      setError('Please provide both T12 and Rent Roll files.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // در یک اپلیکیشن واقعی، تنظیمات را از SettingsContext می‌خوانیم
      const userSettings = JSON.parse(localStorage.getItem('userAnalysisSettings')) || {};

      // فراخوانی تابع api از utils
      const result = await analyzeProperty(propertyData, t12File, rentRollFile, userSettings);
      
      // ارسال نتیجه به کامپوننت والد (AnalyzePage)
      onUpload(result); 
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const FileDropzone = ({ file, rootProps, inputProps, label }) => (
    <div {...rootProps} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 bg-gray-50">
      <input {...inputProps} />
      {file ? (
        <div className="flex items-center justify-center text-gray-700">
           {file.type.includes('pdf') ? <PdfIcon /> : <ExcelIcon />}
           <span>{file.name}</span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <FileUploadIcon />
          <p className="font-medium">{label}</p>
          <p className="text-sm">Drag & drop or click to select a file</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold">Upload Financial Documents</h2>
        <p className="text-gray-500">Provide the T12 and Rent Roll for <span className="font-medium text-indigo-600">{propertyData.address}</span>.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileDropzone file={t12File} rootProps={getT12RootProps()} inputProps={getT12InputProps()} label="T12 Financials" />
        <FileDropzone file={rentRollFile} rootProps={getRentRollRootProps()} inputProps={getRentRollInputProps()} label="Rent Roll" />
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Back
        </button>
        <button 
          onClick={handleAnalyze}
          disabled={isLoading || !t12File || !rentRollFile}
          className="w-48 px-6 py-3 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 flex items-center justify-center"
        >
          {isLoading ? <SpinnerIcon /> : 'Analyze Property'}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;

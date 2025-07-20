// ResultsView.js
import React from 'react';

const ResultsView = ({ analysis, onReset }) => {
  if (!analysis) return <div>Loading analysis...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className={`p-4 mb-4 rounded ${
        analysis.pass_fail ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
      }`}>
        <h2 className="text-xl font-bold">
          {analysis.pass_fail ? '✅ Deal Passed' : '❌ Deal Failed'}
        </h2>
        <p className="mt-2">
          {analysis.pass_fail 
            ? 'This property meets your investment criteria' 
            : 'This property does not meet your investment criteria'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="font-bold text-gray-700">Cash on Cash</h3>
          <p className="text-2xl font-semibold">{analysis.cash_on_cash}%</p>
        </div>
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="font-bold text-gray-700">Cap Rate</h3>
          <p className="text-2xl font-semibold">{analysis.cap_rate}%</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">Recommendations</h3>
        <p className="text-gray-700 whitespace-pre-line">{analysis.recommendations}</p>
      </div>
      
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2">Executive Summary</h3>
        <p className="text-gray-700 whitespace-pre-line">{analysis.executive_summary}</p>
      </div>
      
      <div className="flex space-x-4 mt-6">
        <button onClick={onReset} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Export PDF Report
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Export Excel Model
        </button>
      </div>
    </div>
  );
};

export default ResultsView;
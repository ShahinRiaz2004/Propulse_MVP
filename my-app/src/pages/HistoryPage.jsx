// src/pages/HistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import { format } from 'date-fns';
import { FaSort, FaFilter, FaSearch, FaChartLine, FaFilePdf, FaFileExcel } from 'react-icons/fa';

const HistoryPage = () => {
  const { analyses, isLoading, error } = useAnalysis();
  const [filteredAnalyses, setFilteredAnalyses] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    search: ''
  });
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [stats, setStats] = useState({ total: 0, passed: 0, failed: 0, avgCash: 0 });

  useEffect(() => {
    if (analyses.length > 0) {
      // Calculate stats
      const total = analyses.length;
      const passed = analyses.filter(a => a.result.pass_fail).length;
      const failed = total - passed;
      const avgCash = analyses.reduce((sum, a) => sum + a.result.cash_on_cash, 0) / total;
      
      setStats({ total, passed, failed, avgCash });
      
      // Apply filters and sorting
      applyFiltersAndSorting();
    }
  }, [analyses, filters, sortConfig]);

  const applyFiltersAndSorting = () => {
    let result = [...analyses];
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(analysis => 
        analysis.address.toLowerCase().includes(searchTerm) ||
        (analysis.result.executive_summary && analysis.result.executive_summary.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(analysis => 
        filters.status === 'passed' ? analysis.result.pass_fail : !analysis.result.pass_fail
      );
    }
    
    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      result = result.filter(analysis => {
        const analysisDate = new Date(analysis.date);
        const diffDays = Math.floor((now - analysisDate) / (1000 * 60 * 60 * 24));
        
        switch(filters.dateRange) {
          case 'today': return diffDays === 0;
          case 'week': return diffDays <= 7;
          case 'month': return diffDays <= 30;
          default: return true;
        }
      });
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = sortConfig.key === 'date' ? new Date(a.date) : a.result[sortConfig.key];
        const bValue = sortConfig.key === 'date' ? new Date(b.date) : b.result[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredAnalyses(result);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '↑' : '↓';
    }
    return <FaSort className="inline ml-1 text-gray-400" />;
  };

  const renderAnalysesList = () => {
    if (filteredAnalyses.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No analyses found</div>
          <p className="text-gray-400 mt-2">Try changing your filters</p>
        </div>
      );
    }

    return filteredAnalyses.map((analysis) => (
      <div 
        key={analysis.id} 
        className={`border rounded-lg p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow ${
          analysis.result.pass_fail ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}
        onClick={() => setSelectedAnalysis(analysis)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{analysis.address}</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(analysis.date), 'MMM dd, yyyy hh:mm a')}
            </p>
          </div>
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-full text-xs ${
              analysis.result.pass_fail 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {analysis.result.pass_fail ? 'Passed' : 'Failed'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-3">
          <div className="text-center">
            <p className="text-xs text-gray-500">Cash on Cash</p>
            <p className="font-semibold">{analysis.result.cash_on_cash}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Cap Rate</p>
            <p className="font-semibold">{analysis.result.cap_rate}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Units</p>
            <p className="font-semibold">{analysis.propertyData?.unitCount || 'N/A'}</p>
          </div>
        </div>
      </div>
    ));
  };

  const renderAnalysesGrid = () => {
    if (filteredAnalyses.length === 0) {
      return (
        <div className="text-center py-12 col-span-3">
          <div className="text-gray-500 text-lg">No analyses found</div>
          <p className="text-gray-400 mt-2">Try changing your filters</p>
        </div>
      );
    }

    return filteredAnalyses.map((analysis) => (
      <div 
        key={analysis.id} 
        className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${
          analysis.result.pass_fail ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}
        onClick={() => setSelectedAnalysis(analysis)}
      >
        <h3 className="font-medium text-gray-900 truncate">{analysis.address}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {format(new Date(analysis.date), 'MMM dd, yyyy')}
        </p>
        
        <div className="flex justify-between items-center mb-2">
          <span className={`px-2 py-1 rounded-full text-xs ${
            analysis.result.pass_fail 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {analysis.result.pass_fail ? 'Passed' : 'Failed'}
          </span>
          
          <div className="text-right">
            <p className="text-xs text-gray-500">CoC</p>
            <p className="font-semibold text-sm">{analysis.result.cash_on_cash}%</p>
          </div>
        </div>
      </div>
    ));
  };

  const renderAnalysisDetail = () => {
    if (!selectedAnalysis) return null;
    
    const analysis = selectedAnalysis;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{analysis.address}</h2>
                <p className="text-gray-500">
                  Analyzed on {format(new Date(analysis.date), 'MMM dd, yyyy hh:mm a')}
                </p>
              </div>
              <button 
                onClick={() => setSelectedAnalysis(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className={`p-4 rounded-lg mt-4 ${
              analysis.result.pass_fail ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">
                    {analysis.result.pass_fail ? '✅ Deal Passed' : '❌ Deal Failed'}
                  </h3>
                  <p className="text-gray-600">
                    {analysis.result.pass_fail 
                      ? 'This property meets your investment criteria' 
                      : 'This property does not meet your investment criteria'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Cash on Cash</p>
                  <p className="text-2xl font-bold">{analysis.result.cash_on_cash}%</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Property Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Year Built</p>
                      <p className="font-medium">{analysis.propertyData?.yearBuilt || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Units</p>
                      <p className="font-medium">{analysis.propertyData?.unitCount || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Market Cap Rate</p>
                      <p className="font-medium">{analysis.propertyData?.marketCapRate || 'N/A'}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Neighborhood Rating</p>
                      <p className="font-medium">{analysis.propertyData?.neighborhoodRating || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-2">Financial Metrics</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Cash on Cash</p>
                      <p className="font-medium">{analysis.result.cash_on_cash}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Cap Rate</p>
                      <p className="font-medium">{analysis.result.cap_rate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Net Operating Income</p>
                      <p className="font-medium">${analysis.result.noi?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Investment</p>
                      <p className="font-medium">${analysis.result.total_investment?.toLocaleString() || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-bold text-lg mb-2">Recommendations</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{analysis.result.recommendations}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-bold text-lg mb-2">Executive Summary</h3>
              <div className="bg-white border p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{analysis.result.executive_summary}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                <FaFilePdf className="mr-2" /> Export PDF
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                <FaFileExcel className="mr-2" /> Export Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis History</h1>
        <p className="text-gray-600">
          Review your past property analyses and track your investment decisions
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="text-gray-500">Total Analyses</div>
          <div className="text-3xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="text-gray-500">Passed</div>
          <div className="text-3xl font-bold text-green-600">{stats.passed}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="text-gray-500">Failed</div>
          <div className="text-3xl font-bold text-red-600">{stats.failed}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="text-gray-500">Avg. Cash on Cash</div>
          <div className="text-3xl font-bold">{stats.avgCash ? stats.avgCash.toFixed(1) : '0.0'}%</div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex space-x-2">
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
              </select>
              <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
              <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search addresses or summaries..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full md:w-64 pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg ${
                viewMode === 'list' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg ${
                viewMode === 'grid' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Grid View
            </button>
          </div>
        </div>
        
        {/* Sorting Controls */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button 
            onClick={() => handleSort('date')}
            className={`px-3 py-1 rounded-lg flex items-center ${
              sortConfig.key === 'date' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Date {getSortIndicator('date')}
          </button>
          <button 
            onClick={() => handleSort('cash_on_cash')}
            className={`px-3 py-1 rounded-lg flex items-center ${
              sortConfig.key === 'cash_on_cash' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cash on Cash {getSortIndicator('cash_on_cash')}
          </button>
          <button 
            onClick={() => handleSort('cap_rate')}
            className={`px-3 py-1 rounded-lg flex items-center ${
              sortConfig.key === 'cap_rate' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cap Rate {getSortIndicator('cap_rate')}
          </button>
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading your analysis history...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-700 font-medium">Error loading history</p>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      )}

      {/* Analyses List */}
      {!isLoading && !error && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              Showing {filteredAnalyses.length} of {analyses.length} analyses
            </p>
            <p className="text-sm text-gray-500">
              Click any analysis to view details
            </p>
          </div>
          
          {viewMode === 'list' ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="hidden md:grid grid-cols-12 bg-gray-50 border-b text-gray-500 text-sm font-medium px-4 py-3">
                <div className="col-span-4">Property Address</div>
                <div className="col-span-2 text-center">Date</div>
                <div className="col-span-2 text-center">Cash on Cash</div>
                <div className="col-span-2 text-center">Cap Rate</div>
                <div className="col-span-2 text-center">Status</div>
              </div>
              
              <div className="divide-y">
                {filteredAnalyses.length > 0 ? (
                  filteredAnalyses.map(analysis => (
                    <div 
                      key={analysis.id} 
                      className="grid grid-cols-1 md:grid-cols-12 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedAnalysis(analysis)}
                    >
                      <div className="col-span-4 mb-2 md:mb-0">
                        <div className="font-medium text-gray-900">{analysis.address}</div>
                      </div>
                      <div className="col-span-2 text-gray-500 text-center mb-2 md:mb-0">
                        {format(new Date(analysis.date), 'MMM dd, yyyy')}
                      </div>
                      <div className="col-span-2 text-center font-medium mb-2 md:mb-0">
                        {analysis.result.cash_on_cash}%
                      </div>
                      <div className="col-span-2 text-center text-gray-500 mb-2 md:mb-0">
                        {analysis.result.cap_rate}%
                      </div>
                      <div className="col-span-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          analysis.result.pass_fail 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {analysis.result.pass_fail ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    No analyses match your filters
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderAnalysesGrid()}
            </div>
          )}
        </div>
      )}

      {/* Analysis Detail Modal */}
      {renderAnalysisDetail()}
    </div>
  );
};

export default HistoryPage;
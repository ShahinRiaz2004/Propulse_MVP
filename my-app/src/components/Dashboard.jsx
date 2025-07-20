// Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [analyses, setAnalyses] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/analyses');
        setAnalyses(response.data);
        
        // محاسبه آمار
        const total = response.data.length;
        const passed = response.data.filter(a => a.analysisResult.pass_fail).length;
        const avgCash = response.data.reduce((sum, a) => 
          sum + a.analysisResult.cash_on_cash, 0) / total;
        
        setStats({
          total,
          passRate: (passed / total) * 100,
          avgCashOnCash: avgCash
        });
      } catch (error) {
        console.error('Failed to fetch analyses:', error);
      }
    };
    
    fetchData();
  }, []);

  if (!stats) return <div>Loading dashboard...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Property Analysis Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Analyses</h2>
          <p className="text-3xl">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Pass Rate</h2>
          <p className="text-3xl">{stats.passRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Avg. Cash on Cash</h2>
          <p className="text-3xl">{stats.avgCashOnCash.toFixed(1)}%</p>
        </div>
      </div>
      
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cash on Cash</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {analyses.map((analysis) => (
              <tr key={analysis._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{analysis.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    analysis.analysisResult.pass_fail 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {analysis.analysisResult.pass_fail ? 'Passed' : 'Failed'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {analysis.analysisResult.cash_on_cash}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(analysis.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
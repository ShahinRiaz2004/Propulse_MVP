import React from 'react';
// 1. Import Link here
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AnalyzePage from './pages/AnalyzePage';
import HistoryPage from './pages/HistoryPage';
import { AnalysisProvider } from './context/AnalysisContext';

function App() {
  return (
    <AnalysisProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-indigo-700">Tyler's Property AI</h1>
              <nav>
                <ul className="flex space-x-4">
                  <li>
                    {/* 2. Use Link instead of a */}
                    <Link to="/" className="text-indigo-600 hover:text-indigo-900 font-medium">
                      Analyze
                    </Link>
                  </li>
                  <li>
                    {/* 2. Use Link instead of a */}
                    <Link to="/history" className="text-gray-500 hover:text-gray-900 font-medium">
                      History
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          
          <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<AnalyzePage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AnalysisProvider>
  );
}

export default App;
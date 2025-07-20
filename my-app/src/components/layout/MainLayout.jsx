import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaChartLine, FaHistory, FaCog } from 'react-icons/fa';

const MainLayout = () => {
  // Style for active NavLink
  const activeLinkStyle = {
    backgroundColor: '#4f46e5', // indigo-600
    color: 'white',
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">PropPulls AI</h1>
        </div>
        <nav className="mt-6 px-4">
          <NavLink
            to="/"
            end
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <FaChartLine className="mr-3" />
            New Analysis
          </NavLink>
          <NavLink
            to="/history"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="mt-2 flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <FaHistory className="mr-3" />
            History
          </NavLink>
          <NavLink
            to="/settings"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="mt-2 flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <FaCog className="mr-3" />
            Settings
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* This will render the matched child route component */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

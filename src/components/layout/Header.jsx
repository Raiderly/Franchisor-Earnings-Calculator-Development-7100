import React from "react";
import * as FiIcons from "react-icons/fi";
import SafeIcon from "../common/SafeIcon";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiIcons.FiTrendingUp} className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-xl font-bold text-white">
                Franchise Calculator Pro
              </h1>
              <p className="text-blue-100 text-sm">
                Professional Earnings Projections
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <SafeIcon icon={FiIcons.FiBarChart2} className="w-6 h-6 text-blue-200" />
            <span className="text-blue-100 text-sm font-medium">
              Advanced Analytics
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
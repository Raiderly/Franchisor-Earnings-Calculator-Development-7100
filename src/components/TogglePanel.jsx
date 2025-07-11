import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { motion } from 'framer-motion';

const TogglePanel = ({ toggles, onToggle }) => {
  // Define toggle options with descriptions and icons
  const toggleOptions = [
    {
      key: 'masterFranchise',
      label: 'Master Franchise Model',
      description: 'Include revenue from master franchise territories',
      icon: FiIcons.FiGlobe
    },
    {
      key: 'supplyChain',
      label: 'Supply Chain Margin',
      description: 'Include revenue from supply chain operations',
      icon: FiIcons.FiTruck
    },
    {
      key: 'marketingIncome',
      label: 'Marketing Levy as Income',
      description: 'Count marketing fees as franchisor revenue',
      icon: FiIcons.FiBarChart2
    },
    {
      key: 'includeCosts',
      label: 'Include Costs / Show Net Profit',
      description: 'Show operating costs and calculate net profit',
      icon: FiIcons.FiDollarSign
    }
  ];

  const handleToggle = (key) => {
    onToggle({
      ...toggles,
      [key]: !toggles[key],
    });
  };

  return (
    <div className="afi-card p-5 mb-6">
      <div className="flex items-center mb-4">
        <SafeIcon icon={FiIcons.FiToggleRight} className="w-5 h-5 mr-2 text-[#1a2c43]" />
        <h2 className="text-xl font-bold text-[#1a2c43]">Revenue Model Options</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {toggleOptions.map(({ key, label, description, icon }) => (
          <div 
            key={key}
            className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
              toggles[key] 
                ? 'bg-[#1a2c43] bg-opacity-10 border border-[#1a2c43] border-opacity-20' 
                : 'bg-gray-100 hover:bg-gray-200 border border-transparent'
            }`}
          >
            <div className="flex items-center">
              <SafeIcon 
                icon={icon} 
                className={`w-5 h-5 mr-3 ${toggles[key] ? 'text-[#1a2c43]' : 'text-gray-500'}`} 
              />
              <div>
                <p className={`font-medium ${toggles[key] ? 'text-[#1a2c43]' : 'text-gray-700'}`}>
                  {label}
                </p>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={toggles[key] || false}
                onChange={() => handleToggle(key)}
              />
              <div className={`
                w-11 h-6 rounded-full transition-colors duration-200 ease-in-out 
                ${toggles[key] ? 'bg-[#c0392b]' : 'bg-gray-300'}
              `}>
                <motion.div 
                  className="w-5 h-5 rounded-full bg-white shadow-md" 
                  initial={false}
                  animate={{ 
                    x: toggles[key] ? 24 : 2,
                    y: 2
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TogglePanel;
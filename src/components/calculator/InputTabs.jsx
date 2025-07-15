import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiInfo, FiDollarSign, FiSettings, FiTrendingDown } from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCalculator } from '../../context/CalculatorContext';
import { theme } from '../../styles/theme';

const TabItem = ({ id, label, icon, active, onClick }) => (
  <motion.button
    onClick={() => onClick(id)}
    className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
      active 
        ? 'text-primary border-b-2 border-primary'
        : 'text-gray-500 hover:text-primary hover:border-b-2 hover:border-primary'
    }`}
    whileHover={{ y: -1 }}
  >
    <SafeIcon icon={icon} className="w-4 h-4 mr-2" />
    {label}
  </motion.button>
);

const InputField = ({ label, name, value, onChange, type = "number", tooltip, prefix, suffix }) => {
  const inputId = `input-${name}`;
  const tooltipId = `tooltip-${name}`;
  
  return (
    <div className="space-y-2">
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 flex items-center"
      >
        {label}
        {tooltip && (
          <div className="group relative ml-2">
            <SafeIcon 
              icon={FiInfo} 
              className="w-4 h-4 text-gray-400"
            />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {tooltip}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        )}
      </label>
      
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">{prefix}</span>
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          className={`
            block w-full rounded-md border-gray-300 shadow-sm
            focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50
            ${prefix ? 'pl-7' : ''}
            ${suffix ? 'pr-12' : ''}
          `}
        />
        
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Rest of the InputTabs component implementation...
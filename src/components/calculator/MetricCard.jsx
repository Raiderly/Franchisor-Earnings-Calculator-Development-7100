import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';

const MetricCard = ({ icon, title, value, subtitle, trend }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
              <SafeIcon icon={icon} className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              {title}
            </h3>
          </div>
          
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900">
              {value}
            </div>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
          
          {trend && (
            <div className="mt-4 flex items-center">
              <SafeIcon
                icon={trend.direction === 'up' ? 'ArrowUp' : 'ArrowDown'}
                className={`w-4 h-4 ${
                  trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
                }`}
              />
              <span className={`ml-1 text-sm ${
                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;
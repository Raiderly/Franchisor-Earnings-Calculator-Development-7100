import React from "react";
import SafeIcon from "../common/SafeIcon";
import { motion } from "framer-motion";

const MetricCard = ({ title, value, icon, color = "blue", subtitle, primary = false }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow max-w-full overflow-hidden ${
        primary 
          ? 'bg-gradient-to-br from-afi-primary to-afi-primary/90' 
          : 'bg-gradient-to-br from-white to-gray-50'
      }`}
    >
      <div className="flex items-center justify-between min-w-0">
        <div className="flex-1 min-w-0 overflow-hidden">
          <p className={`text-xs uppercase tracking-wide font-semibold mb-1 ${
            primary ? 'text-gray-200' : 'text-afi-textSecondary'
          }`}>
            {title}
          </p>
          <div className="max-w-full overflow-hidden">
            <p className={`text-lg md:text-xl lg:text-2xl font-bold truncate whitespace-nowrap ${
              primary ? 'text-white' : 'text-afi-primary'
            }`}>
              {value}
            </p>
          </div>
          {subtitle && (
            <div className="max-w-full overflow-hidden mt-1">
              <p className={`text-xs truncate ${
                primary ? 'text-gray-200' : 'text-afi-textSecondary'
              }`}>
                {subtitle}
              </p>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ml-3 flex-shrink-0 ${
          primary 
            ? 'bg-white bg-opacity-20' 
            : `bg-gradient-to-br ${colorClasses[color]}`
        }`}>
          <SafeIcon 
            icon={icon} 
            className={`w-5 h-5 md:w-6 md:h-6 ${
              primary ? 'text-afi-secondary' : 'text-white'
            }`} 
          />
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;
import React from "react";
import { useCalculator } from "../../context/CalculatorContext";
import { motion } from "framer-motion";

const Toggle = ({ label, field, description }) => {
  const { inputs, updateField } = useCalculator();
  const isChecked = inputs[field];

  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700 cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      
      <label className="relative inline-flex items-center cursor-pointer ml-4">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => updateField(field, e.target.checked)}
          className="sr-only"
        />
        <div className={`
          w-11 h-6 rounded-full transition-colors duration-200 ease-in-out
          ${isChecked ? 'bg-blue-600' : 'bg-gray-300'}
        `}>
          <motion.div 
            className="w-5 h-5 rounded-full bg-white shadow-md"
            initial={false}
            animate={{ 
              x: isChecked ? 24 : 2,
              y: 2
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>
      </label>
    </div>
  );
};

export default Toggle;
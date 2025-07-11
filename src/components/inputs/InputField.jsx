import React from "react";
import { useCalculator } from "../../context/CalculatorContext";
import * as FiIcons from "react-icons/fi";
import SafeIcon from "../common/SafeIcon";

const InputField = ({ 
  label, 
  field, 
  type = "number", 
  prefix, 
  suffix, 
  step = "1",
  min = "0",
  max,
  tooltip 
}) => {
  const { inputs, updateField } = useCalculator();

  const handleChange = (e) => {
    const value = type === "checkbox" ? e.target.checked : 
                  type === "number" ? parseFloat(e.target.value) || 0 : 
                  e.target.value;
    updateField(field, value);
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 flex items-center">
        {label}
        {tooltip && (
          <div className="relative group ml-2">
            <SafeIcon icon={FiIcons.FiHelpCircle} className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
              {tooltip}
            </div>
          </div>
        )}
      </label>
      
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        
        <input
          type={type}
          value={type === "checkbox" ? undefined : inputs[field]}
          checked={type === "checkbox" ? inputs[field] : undefined}
          onChange={handleChange}
          step={step}
          min={min}
          max={max}
          className={`
            block w-full rounded-lg border-gray-300 shadow-sm 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${prefix ? 'pl-8' : 'pl-3'}
            ${suffix ? 'pr-16' : 'pr-3'}
            py-2 text-sm
            ${type === "checkbox" ? 'w-4 h-4' : ''}
          `}
        />
        
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
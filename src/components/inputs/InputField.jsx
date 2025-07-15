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
    const value = type === "checkbox" 
      ? e.target.checked 
      : type === "number" 
        ? parseFloat(e.target.value) || 0 
        : e.target.value;
    
    updateField(field, value);
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-afi-textPrimary flex items-center">
        {label}
        {tooltip && (
          <div className="relative group ml-2">
            <SafeIcon 
              icon={FiIcons.FiHelpCircle} 
              className="w-4 h-4 text-afi-textSecondary cursor-help" 
            />
            <div className="absolute top-[calc(100%+6px)] left-1/2 transform -translate-x-1/2 bg-afi-primary text-white text-xs rounded py-1.5 px-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-40 whitespace-nowrap shadow-lg pointer-events-none">
              {tooltip}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-afi-primary rotate-45"></div>
            </div>
          </div>
        )}
      </label>
      
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-afi-textSecondary font-medium">{prefix}</span>
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
            afi-input 
            ${prefix ? 'pl-8' : ''} 
            ${suffix ? 'pr-16' : ''} 
            ${type === "checkbox" ? 'w-4 h-4' : ''} 
            focus:border-afi-primary focus:ring-afi-primary
          `}
        />
        
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-afi-textSecondary font-medium">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
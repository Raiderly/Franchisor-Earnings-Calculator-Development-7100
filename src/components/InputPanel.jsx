import React, { useState } from "react";
import { useCalculator } from "../context/CalculatorContext";
import InputField from "./inputs/InputField";
import Toggle from "./inputs/Toggle";
import InputSection from "./inputs/InputSection";
import * as FiIcons from "react-icons/fi";
import SafeIcon from "./common/SafeIcon";
import { motion, AnimatePresence } from "framer-motion";

const InputPanel = () => {
  const { inputs, updateField } = useCalculator();
  const [activeSection, setActiveSection] = useState('basic');

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: FiIcons.FiInfo },
    { id: 'fees', label: 'Fees', icon: FiIcons.FiDollarSign },
    { id: 'advanced', label: 'Advanced', icon: FiIcons.FiSettings },
    { id: 'costs', label: 'Costs', icon: FiIcons.FiMinusCircle }
  ];

  const tabVariants = {
    inactive: { color: "#6b7280" },
    active: { color: "#ffffff", backgroundColor: "#262262" }
  };

  return (
    <div className="afi-card">
      <div className="bg-afi-primary text-white p-5 rounded-t-xl">
        <h2 className="text-xl font-semibold flex items-center">
          <SafeIcon icon={FiIcons.FiSliders} className="w-5 h-5 mr-2 text-afi-secondary" />
          Calculator Inputs
        </h2>
        <p className="text-sm text-gray-300 mt-1">Configure your franchise parameters below</p>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-gray-200 bg-white overflow-x-auto">
        {sections.map((section) => (
          <motion.button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex-1 py-4 px-2 text-sm font-medium flex flex-col items-center justify-center space-y-1 relative
              ${activeSection === section.id ? 'text-white bg-afi-primary' : 'text-afi-textSecondary hover:bg-gray-50'}`}
            variants={tabVariants}
            animate={activeSection === section.id ? "active" : "inactive"}
            whileHover={{ backgroundColor: activeSection === section.id ? "#262262" : "#f9fafb" }}
            transition={{ duration: 0.2 }}
          >
            <SafeIcon
              icon={section.icon}
              className={`w-5 h-5 ${activeSection === section.id ? 'text-afi-secondary' : 'text-afi-primary'}`}
            />
            <span className="hidden sm:inline">{section.label}</span>
            
            {/* Active indicator bar */}
            {activeSection === section.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-afi-secondary"
                layoutId="activeTab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      <div className="p-6 max-h-[450px] overflow-y-auto bg-white rounded-b-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {activeSection === 'basic' && (
              <InputSection title="Basic Franchise Information">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField 
                    label="Current Units" 
                    field="units" 
                    tooltip="Number of existing franchise units" 
                  />
                  <InputField 
                    label="Average Unit Sales" 
                    field="avgSales" 
                    prefix="$" 
                    tooltip="Annual gross sales per franchise unit" 
                  />
                  <InputField 
                    label="Royalty Rate" 
                    field="royaltyRate" 
                    suffix="%" 
                    step="0.1" 
                    tooltip="Percentage of gross sales paid as royalty" 
                  />
                  <InputField 
                    label="Marketing Levy" 
                    field="marketingLevy" 
                    suffix="%" 
                    step="0.1" 
                    tooltip="Percentage for marketing fund" 
                  />
                  <InputField 
                    label="Growth Rate" 
                    field="growthRate" 
                    suffix="%" 
                    tooltip="Expected annual growth rate" 
                  />
                  <InputField 
                    label="Churn Rate" 
                    field="churnRate" 
                    suffix="%" 
                    tooltip="Annual franchisee attrition rate" 
                  />
                  <InputField 
                    label="New Units/Year" 
                    field="newUnitsPerYear" 
                    tooltip="New franchise units added annually" 
                  />
                  <InputField 
                    label="Franchise Term" 
                    field="franchiseeTerm" 
                    suffix="years" 
                    tooltip="Length of franchise agreement" 
                  />
                </div>
              </InputSection>
            )}

            {activeSection === 'fees' && (
              <InputSection title="Franchise Fees">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField 
                    label="Initial Franchise Fee" 
                    field="franchiseFee" 
                    prefix="$" 
                    tooltip="One-time fee for new franchisees" 
                  />
                  <InputField 
                    label="Renewal Fee" 
                    field="renewalFee" 
                    prefix="$" 
                    tooltip="Fee for renewing franchise agreement" 
                  />
                  <InputField 
                    label="Transfer Fee" 
                    field="transferFee" 
                    prefix="$" 
                    tooltip="Fee for transferring franchise ownership" 
                  />
                  <InputField 
                    label="Training Fee" 
                    field="trainingFee" 
                    prefix="$" 
                    tooltip="Initial training fee per franchisee" 
                  />
                  <InputField 
                    label="Technology Fee" 
                    field="techFee" 
                    prefix="$" 
                    suffix="/month" 
                    tooltip="Monthly technology/software fee" 
                  />
                  <InputField 
                    label="Support Fee" 
                    field="supportFee" 
                    prefix="$" 
                    suffix="/month" 
                    tooltip="Monthly ongoing support fee" 
                  />
                </div>
              </InputSection>
            )}

            {activeSection === 'advanced' && (
              <InputSection title="Advanced Options">
                <div className="space-y-6">
                  <Toggle 
                    label="Supply Chain Revenue" 
                    field="useSupply" 
                    description="Include revenue from supply chain operations" 
                  />
                  
                  {inputs.useSupply && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ml-6 p-4 bg-afi-muted rounded-lg border-l-4 border-afi-secondary">
                      <InputField 
                        label="Annual Supply Spend" 
                        field="supplySpend" 
                        prefix="$" 
                        tooltip="Annual spending per unit on supplies" 
                      />
                      <InputField 
                        label="Supply Margin" 
                        field="supplyMargin" 
                        suffix="%" 
                        step="0.1" 
                        tooltip="Profit margin on supply sales" 
                      />
                    </div>
                  )}
                  
                  <Toggle 
                    label="Management Service Provider" 
                    field="useMSP" 
                    description="Include MSP revenue streams" 
                  />
                  
                  {inputs.useMSP && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ml-6 p-4 bg-afi-muted rounded-lg border-l-4 border-afi-secondary">
                      <InputField 
                        label="MSP Monthly Fee" 
                        field="mspFee" 
                        prefix="$" 
                        suffix="/month" 
                        tooltip="Monthly MSP fee per unit" 
                      />
                      <InputField 
                        label="MSP Services" 
                        field="mspServices" 
                        prefix="$" 
                        tooltip="Annual MSP services revenue per unit" 
                      />
                    </div>
                  )}
                  
                  <Toggle 
                    label="Master Franchise Model" 
                    field="useMasterFranchise" 
                    description="Include master franchise revenue sharing" 
                  />
                  
                  {inputs.useMasterFranchise && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ml-6 p-4 bg-afi-muted rounded-lg border-l-4 border-afi-secondary">
                      <InputField 
                        label="Franchisor Share" 
                        field="masterSplit" 
                        suffix="%" 
                        tooltip="Percentage retained by franchisor" 
                      />
                      <InputField 
                        label="Master Franchise Fee" 
                        field="masterFee" 
                        prefix="$" 
                        tooltip="Initial fee for master franchise rights" 
                      />
                      <InputField 
                        label="Master Territories" 
                        field="masterTerritories" 
                        tooltip="Number of master franchise territories" 
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
                    <InputField 
                      label="Projection Years" 
                      field="projectionYears" 
                      tooltip="Number of years to project" 
                      min="1" 
                      max="10" 
                    />
                    <div className="flex items-center">
                      <Toggle 
                        label="Include Operating Costs" 
                        field="includeCosts" 
                        description="Show net profit calculations" 
                      />
                    </div>
                  </div>
                </div>
              </InputSection>
            )}

            {activeSection === 'costs' && inputs.includeCosts && (
              <InputSection title="Operating Costs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField 
                    label="Staff Costs" 
                    field="staffCosts" 
                    prefix="$" 
                    suffix="/year" 
                    tooltip="Annual staff and salary costs" 
                  />
                  <InputField 
                    label="Recruitment Cost" 
                    field="recruitmentCost" 
                    prefix="$" 
                    suffix="/unit" 
                    tooltip="Cost to recruit each new franchisee" 
                  />
                  <InputField 
                    label="Training Costs" 
                    field="trainingCost" 
                    prefix="$" 
                    suffix="/unit" 
                    tooltip="Cost to train each new franchisee" 
                  />
                  <InputField 
                    label="Technology Costs" 
                    field="techCosts" 
                    prefix="$" 
                    suffix="/year" 
                    tooltip="Annual technology and software costs" 
                  />
                  <InputField 
                    label="Legal & Compliance" 
                    field="legalCosts" 
                    prefix="$" 
                    suffix="/year" 
                    tooltip="Annual legal and compliance costs" 
                  />
                  <InputField 
                    label="Marketing Admin" 
                    field="marketingAdminCosts" 
                    prefix="$" 
                    suffix="/year" 
                    tooltip="Marketing fund administration costs" 
                  />
                </div>
              </InputSection>
            )}

            {activeSection === 'costs' && !inputs.includeCosts && (
              <div className="text-center py-8 text-afi-textSecondary">
                <SafeIcon icon={FiIcons.FiInfo} className="w-12 h-12 mx-auto mb-3 text-afi-primary opacity-30" />
                <p>Enable "Include Operating Costs" in Advanced section to configure cost inputs.</p>
                <button 
                  onClick={() => setActiveSection('advanced')} 
                  className="mt-4 text-sm text-afi-primary hover:text-afi-secondary font-medium"
                >
                  Go to Advanced Settings
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InputPanel;
import React, { useState } from "react";
import { useCalculator } from "../context/CalculatorContext";
import InputField from "./inputs/InputField";
import Toggle from "./inputs/Toggle";
import InputSection from "./inputs/InputSection";
import * as FiIcons from "react-icons/fi";
import SafeIcon from "./common/SafeIcon";
import { motion } from "framer-motion";

const InputPanel = () => {
  const { inputs } = useCalculator();
  const [activeSection, setActiveSection] = useState('basic');

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: FiIcons.FiInfo },
    { id: 'fees', label: 'Fees', icon: FiIcons.FiDollarSign },
    { id: 'advanced', label: 'Advanced', icon: FiIcons.FiSettings },
    { id: 'costs', label: 'Costs', icon: FiIcons.FiMinusCircle }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <SafeIcon icon={FiIcons.FiSliders} className="w-5 h-5 mr-2" />
          Calculator Inputs
        </h2>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex-1 py-3 px-2 text-sm font-medium flex items-center justify-center space-x-1 transition-colors ${
              activeSection === section.id
                ? 'bg-blue-500 text-white border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <SafeIcon icon={section.icon} className="w-4 h-4" />
            <span className="hidden sm:inline">{section.label}</span>
          </button>
        ))}
      </div>

      <div className="p-6 max-h-96 overflow-y-auto">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'basic' && (
            <InputSection title="Basic Franchise Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="space-y-4">
                <Toggle 
                  label="Supply Chain Revenue" 
                  field="useSupply"
                  description="Include revenue from supply chain operations"
                />
                {inputs.useSupply && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-6 p-4 bg-blue-50 rounded-lg">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-6 p-4 bg-green-50 rounded-lg">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-6 p-4 bg-purple-50 rounded-lg">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="text-center py-8 text-gray-500">
              <SafeIcon icon={FiIcons.FiInfo} className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Enable "Include Operating Costs" in Advanced section to configure cost inputs.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InputPanel;
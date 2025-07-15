import React, { useState } from 'react';
import { useCalculator } from '../context/CalculatorContext';

const InputField = ({ label, field, type = 'number', prefix, suffix, tooltip }) => {
  const { inputs, updateInput } = useCalculator();

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-afi-text mb-1">
        {label}
        {tooltip && (
          <div className="tooltip-container ml-1">
            <span className="tooltip-trigger">ℹ️</span>
            <div className="tooltip-content">
              {tooltip}
            </div>
          </div>
        )}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-afi-text-light">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={inputs[field]}
          onChange={(e) => updateInput(field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
          className={`afi-input ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-12' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-afi-text-light">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

const Toggle = ({ label, field, description }) => {
  const { inputs, updateInput } = useCalculator();

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <div className="font-medium text-afi-text">{label}</div>
        {description && (
          <div className="text-sm text-afi-text-light">{description}</div>
        )}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={inputs[field]}
          onChange={(e) => updateInput(field, e.target.checked)}
          className="sr-only"
        />
        <div className={`w-11 h-6 rounded-full transition-colors ${
          inputs[field] ? 'bg-afi-primary' : 'bg-gray-300'
        }`}>
          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
            inputs[field] ? 'translate-x-5' : 'translate-x-0'
          } mt-0.5 ml-0.5`}></div>
        </div>
      </label>
    </div>
  );
};

const InputTabs = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const { inputs } = useCalculator();

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'fees', label: 'Fees' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'costs', label: 'Costs' },
  ];

  return (
    <div className="afi-card">
      <div className="afi-card-header">
        <h2 className="text-lg font-semibold">Calculator Inputs</h2>
      </div>

      <div className="afi-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`afi-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="afi-card-body scrollable-content">
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-afi-primary border-b border-afi-border pb-2">
              Network Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                tooltip="Percentage of gross sales paid as royalty"
              />
              <InputField
                label="Marketing Levy"
                field="marketingLevy"
                suffix="%"
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
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-afi-primary border-b border-afi-border pb-2">
              Franchise Fees
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-afi-primary border-b border-afi-border pb-2">
              Advanced Options
            </h3>
            
            <Toggle
              label="Supply Chain Revenue"
              field="useSupply"
              description="Include revenue from supply chain operations"
            />
            
            {inputs.useSupply && (
              <div className="ml-4 p-4 bg-blue-50 rounded-lg border-l-4 border-afi-secondary">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    tooltip="Profit margin on supply sales"
                  />
                </div>
              </div>
            )}

            <Toggle
              label="Management Service Provider"
              field="useMSP"
              description="Include MSP revenue streams"
            />
            
            {inputs.useMSP && (
              <div className="ml-4 p-4 bg-blue-50 rounded-lg border-l-4 border-afi-secondary">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            )}

            <Toggle
              label="Master Franchise Model"
              field="useMasterFranchise"
              description="Include master franchise revenue sharing"
            />
            
            {inputs.useMasterFranchise && (
              <div className="ml-4 p-4 bg-blue-50 rounded-lg border-l-4 border-afi-secondary">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            )}

            <div className="border-t border-afi-border pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Projection Years"
                  field="projectionYears"
                  tooltip="Number of years to project"
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
          </div>
        )}

        {activeTab === 'costs' && (
          <div className="space-y-4">
            {inputs.includeCosts ? (
              <>
                <h3 className="font-semibold text-afi-primary border-b border-afi-border pb-2">
                  Operating Costs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💰</div>
                <p className="text-afi-text-light">
                  Enable "Include Operating Costs" in Advanced section to configure cost inputs.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputTabs;
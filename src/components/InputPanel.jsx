import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiInfo, FiToggleLeft, FiToggleRight } = FiIcons;

const InputPanel = ({ inputs, toggles, updateInput, updateToggle }) => {
  const Toggle = ({ label, value, onChange, tooltip }) => (
    <div className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-lg mb-3 border border-gray-200">
      <div className="flex items-center space-x-2">
        <span className="font-medium text-[#1a2c43]">{label}</span>
        {tooltip && (
          <div className="tooltip">
            <SafeIcon icon={FiInfo} className="w-4 h-4 text-[#c0392b] cursor-help" />
            <div className="tooltip-text">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <label className="afi-toggle">
        <input
          type="checkbox"
          checked={value}
          onChange={() => onChange(!value)}
        />
        <span className="afi-toggle-slider"></span>
      </label>
    </div>
  );

  const InputField = ({ label, value, onChange, type = 'number', prefix = '', suffix = '', tooltip }) => (
    <div className="space-y-2 mb-4">
      <div className="flex items-center space-x-2">
        <label className="afi-input-label">{label}</label>
        {tooltip && (
          <div className="tooltip">
            <SafeIcon icon={FiInfo} className="w-4 h-4 text-[#c0392b] cursor-help" />
            <div className="tooltip-text">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`w-full px-3 py-2 afi-input ${
            prefix ? 'pl-8' : ''
          } ${suffix ? 'pr-12' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );

  const Section = ({ title, children, className = '' }) => (
    <div className={`afi-card p-6 mb-6 ${className}`}>
      <h3 className="afi-section-title">{title}</h3>
      <div>
        {children}
      </div>
    </div>
  );

  return (
    <div>
      {/* Toggles */}
      <Section title="CALCULATION OPTIONS">
        <Toggle
          label="Master Franchise Model"
          value={toggles.masterFranchise}
          onChange={(value) => updateToggle('masterFranchise', value)}
          tooltip="Enable if you plan to sell master franchise territories"
        />
        <Toggle
          label="Supply Chain Margin"
          value={toggles.supplyChain}
          onChange={(value) => updateToggle('supplyChain', value)}
          tooltip="Include revenue from supply chain margins"
        />
        <Toggle
          label="Marketing Levy as Income"
          value={toggles.marketingIncome}
          onChange={(value) => updateToggle('marketingIncome', value)}
          tooltip="Count marketing levies as franchisor income (vs. pass-through)"
        />
        <Toggle
          label="Include Costs / Show Net Profit"
          value={toggles.includeCosts}
          onChange={(value) => updateToggle('includeCosts', value)}
          tooltip="Include operational costs to calculate net profit"
        />
      </Section>

      {/* Franchise Network Profile */}
      <Section title="FRANCHISE NETWORK PROFILE">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Current Franchise Units"
            value={inputs.units}
            onChange={(value) => updateInput('units', value)}
            tooltip="Number of franchise units currently operating"
          />
          <InputField
            label="New Units Per Year"
            value={inputs.newUnitsPerYear}
            onChange={(value) => updateInput('newUnitsPerYear', value)}
            tooltip="Expected new franchise units to be added annually"
          />
          <InputField
            label="Average Franchise Term"
            value={inputs.termYears}
            onChange={(value) => updateInput('termYears', value)}
            suffix="years"
            tooltip="Average length of franchise agreements"
          />
          <InputField
            label="Growth Rate"
            value={inputs.growthRate}
            onChange={(value) => updateInput('growthRate', value)}
            suffix="%"
            tooltip="Annual growth rate of existing units"
          />
          <InputField
            label="Churn Rate"
            value={inputs.churnRate}
            onChange={(value) => updateInput('churnRate', value)}
            suffix="%"
            tooltip="Percentage of units that exit the system annually"
          />
          <InputField
            label="Projection Duration"
            value={inputs.projectionYears}
            onChange={(value) => updateInput('projectionYears', value)}
            suffix="years"
            tooltip="Number of years to project forward"
          />
        </div>
      </Section>

      {/* Financial Inputs */}
      <Section title="FINANCIAL INPUTS">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Average Gross Sales per Unit"
            value={inputs.avgSales}
            onChange={(value) => updateInput('avgSales', value)}
            prefix="$"
            tooltip="Annual gross sales per franchise unit"
          />
          <InputField
            label="Royalty Percentage"
            value={inputs.royaltyPct}
            onChange={(value) => updateInput('royaltyPct', value)}
            suffix="%"
            tooltip="Percentage of gross sales paid as royalties"
          />
          <InputField
            label="Marketing Levy"
            value={inputs.marketingPct}
            onChange={(value) => updateInput('marketingPct', value)}
            suffix="%"
            tooltip="Percentage of gross sales for marketing fund"
          />
          <InputField
            label="Initial Franchise Fee"
            value={inputs.franchiseFee}
            onChange={(value) => updateInput('franchiseFee', value)}
            prefix="$"
            tooltip="One-time fee paid by new franchisees"
          />
          <InputField
            label="Renewal Fee"
            value={inputs.renewalFee}
            onChange={(value) => updateInput('renewalFee', value)}
            prefix="$"
            tooltip="Fee paid when franchise agreement is renewed"
          />
          <InputField
            label="Transfer Fee"
            value={inputs.transferFee}
            onChange={(value) => updateInput('transferFee', value)}
            prefix="$"
            tooltip="Fee paid when franchise is sold to new owner"
          />
          <InputField
            label="Resale Frequency"
            value={inputs.resaleFreq}
            onChange={(value) => updateInput('resaleFreq', value)}
            suffix="years"
            tooltip="Average years before a franchise is sold"
          />
          <InputField
            label="Training Fee (Initial)"
            value={inputs.trainingFee}
            onChange={(value) => updateInput('trainingFee', value)}
            prefix="$"
            tooltip="One-time training fee for new franchisees"
          />
          <InputField
            label="Recurring Training Fee"
            value={inputs.trainingAnnualFee}
            onChange={(value) => updateInput('trainingAnnualFee', value)}
            prefix="$"
            tooltip="Annual training fee per franchise unit"
          />
          <InputField
            label="Technology Fee (Monthly)"
            value={inputs.techFee}
            onChange={(value) => updateInput('techFee', value)}
            prefix="$"
            tooltip="Monthly technology fee per franchise unit"
          />
          <InputField
            label="Admin/Support Fee (Monthly)"
            value={inputs.supportFee}
            onChange={(value) => updateInput('supportFee', value)}
            prefix="$"
            tooltip="Monthly administrative support fee per unit"
          />
        </div>
        
        <AnimatePresence>
          {toggles.supplyChain && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200"
            >
              <InputField
                label="Annual Supply Chain Spend per Unit"
                value={inputs.supplySpend}
                onChange={(value) => updateInput('supplySpend', value)}
                prefix="$"
                tooltip="Average annual spend per unit on supply chain"
              />
              <InputField
                label="Supply Chain Margin"
                value={inputs.supplyMarginPct}
                onChange={(value) => updateInput('supplyMarginPct', value)}
                suffix="%"
                tooltip="Franchisor margin on supply chain sales"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Section>

      {/* Master Franchise Section */}
      <AnimatePresence>
        {toggles.masterFranchise && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Section title="MASTER FRANCHISE MODELLING">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Number of Master Territories"
                  value={inputs.masterTerritories}
                  onChange={(value) => updateInput('masterTerritories', value)}
                  tooltip="Number of master franchise territories"
                />
                <InputField
                  label="Franchisor Share of Royalty"
                  value={inputs.masterRoyaltyPct}
                  onChange={(value) => updateInput('masterRoyaltyPct', value)}
                  suffix="%"
                  tooltip="Percentage of royalties retained by franchisor"
                />
                <InputField
                  label="Franchisor Share of Initial Fees"
                  value={inputs.masterInitPct}
                  onChange={(value) => updateInput('masterInitPct', value)}
                  suffix="%"
                  tooltip="Percentage of initial fees retained by franchisor"
                />
                <InputField
                  label="Master Franchise Fee"
                  value={inputs.masterFee}
                  onChange={(value) => updateInput('masterFee', value)}
                  prefix="$"
                  tooltip="One-time fee for master franchise territory"
                />
                <InputField
                  label="Master Ongoing Override"
                  value={inputs.masterOngoingPct}
                  onChange={(value) => updateInput('masterOngoingPct', value)}
                  suffix="%"
                  tooltip="Ongoing percentage override from master territories"
                />
              </div>
            </Section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Costs Section */}
      <AnimatePresence>
        {toggles.includeCosts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Section title="COST MODELLING">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Staff Costs (Annual)"
                  value={inputs.costStaff}
                  onChange={(value) => updateInput('costStaff', value)}
                  prefix="$"
                  tooltip="Total annual staff costs"
                />
                <InputField
                  label="Recruitment Cost per New Franchisee"
                  value={inputs.costRecruitment}
                  onChange={(value) => updateInput('costRecruitment', value)}
                  prefix="$"
                  tooltip="Cost to recruit each new franchisee"
                />
                <InputField
                  label="Training Delivery Cost"
                  value={inputs.costTraining}
                  onChange={(value) => updateInput('costTraining', value)}
                  prefix="$"
                  tooltip="Cost to deliver training per new franchisee"
                />
                <InputField
                  label="Tech Licensing Cost per Unit"
                  value={inputs.costTech}
                  onChange={(value) => updateInput('costTech', value)}
                  prefix="$"
                  tooltip="Monthly tech licensing cost per unit"
                />
                <InputField
                  label="Legal & Compliance Costs"
                  value={inputs.costLegal}
                  onChange={(value) => updateInput('costLegal', value)}
                  prefix="$"
                  tooltip="Annual legal and compliance costs"
                />
                <InputField
                  label="Marketing Fund Admin Overhead"
                  value={inputs.costMarketingAdmin}
                  onChange={(value) => updateInput('costMarketingAdmin', value)}
                  prefix="$"
                  tooltip="Annual cost to administer marketing fund"
                />
              </div>
            </Section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputPanel;
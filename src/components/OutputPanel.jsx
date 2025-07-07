import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ProjectionChart from './ProjectionChart';
import { formatCurrency, formatNumber } from '../utils/formatters';
import ExportOptions from './export/ExportOptions';
import EmailModal from './export/EmailModal';

const { FiDollarSign, FiTrendingUp, FiUsers, FiBarChart2, FiDownload, FiPieChart, FiMail, FiFileText } = FiIcons;

const OutputPanel = ({ projections, toggles, inputs }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const currentYear = projections[0];
  const totalRevenue = currentYear.grossRevenue;
  const netProfit = currentYear.netProfit;
  const revenuePerUnit = totalRevenue / currentYear.units;

  const MetricCard = ({ icon, title, value, subtitle, color = 'blue' }) => (
    <div className="afi-card p-5">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-[#1a2c43] bg-opacity-10 mr-4`}>
          <SafeIcon icon={icon} className={`w-6 h-6 text-[#1a2c43]`} />
        </div>
        <div>
          <p className="afi-metric-label">{title}</p>
          <p className="afi-metric-value">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const RevenueStreamCard = ({ title, amount, percentage }) => (
    <div className="afi-card p-4 border-l-4 border-[#1a2c43]">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-medium text-[#1a2c43]">{title}</h4>
        <span className="text-sm text-[#c0392b] font-semibold">{percentage.toFixed(1)}%</span>
      </div>
      <p className="text-lg font-bold text-[#1a2c43]">{formatCurrency(amount)}</p>
    </div>
  );

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`afi-tab ${isActive ? 'afi-tab-active' : 'afi-tab-inactive'}`}
    >
      {label}
    </button>
  );

  const ProjectionTable = () => (
    <div className="afi-card overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-bold text-[#1a2c43]">
          {inputs.projectionYears}-Year Financial Projections
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1a2c43] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Units
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Gross Revenue
              </th>
              {toggles.includeCosts && (
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                  Total Costs
                </th>
              )}
              {toggles.includeCosts && (
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                  Net Profit
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Revenue/Unit
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projections.map((year, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-[#f8f9fa]'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#1a2c43]">
                  Year {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatNumber(year.units)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1a2c43]">
                  {formatCurrency(year.grossRevenue)}
                </td>
                {toggles.includeCosts && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatCurrency(year.totalCosts)}
                  </td>
                )}
                {toggles.includeCosts && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={year.netProfit >= 0 ? 'text-green-600' : 'text-[#c0392b]'}>
                      {formatCurrency(year.netProfit)}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatCurrency(year.grossRevenue / year.units)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const revenueStreams = [
    { title: 'Royalty Income', amount: currentYear.royaltyIncome, key: 'royaltyIncome' },
    { title: 'Initial Franchise Fees', amount: currentYear.initialFees, key: 'initialFees' },
    { title: 'Renewal Fees', amount: currentYear.renewalFees, key: 'renewalFees' },
    {
      title: 'Training Fees',
      amount: currentYear.trainingIncome + currentYear.trainingRecurringIncome,
      key: 'training'
    },
    { title: 'Technology Fees', amount: currentYear.techIncome, key: 'techIncome' },
    { title: 'Admin/Support Fees', amount: currentYear.supportIncome, key: 'supportIncome' },
    { title: 'Transfer Fees', amount: currentYear.transferIncome, key: 'transferIncome' },
  ];

  if (toggles.supplyChain) {
    revenueStreams.push({
      title: 'Supply Chain Margin',
      amount: currentYear.supplyChainIncome,
      key: 'supplyChainIncome'
    });
  }

  if (toggles.marketingIncome) {
    revenueStreams.push({
      title: 'Marketing Levy Income',
      amount: currentYear.marketingIncome,
      key: 'marketingIncome'
    });
  }

  if (toggles.masterFranchise) {
    revenueStreams.push({
      title: 'Master Franchise Fees',
      amount: currentYear.masterFranchiseFees,
      key: 'masterFranchiseFees'
    });
    revenueStreams.push({
      title: 'Master Override Income',
      amount: currentYear.masterOverrideIncome,
      key: 'masterOverrideIncome'
    });
  }

  return (
    <div className="space-y-6">
      {/* Export Button - Top Right */}
      <div className="flex justify-end">
        <ExportOptions 
          inputs={inputs}
          projections={projections}
          toggles={toggles}
          openEmailModal={() => setIsEmailModalOpen(true)}
        />
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          icon={FiDollarSign}
          title="TOTAL ANNUAL REVENUE"
          value={formatCurrency(totalRevenue)}
          subtitle="Current Year"
        />
        <MetricCard
          icon={FiUsers}
          title="REVENUE PER UNIT"
          value={formatCurrency(revenuePerUnit)}
          subtitle="Annual Average"
        />
        {toggles.includeCosts && (
          <>
            <MetricCard
              icon={FiTrendingUp}
              title="NET PROFIT"
              value={formatCurrency(netProfit)}
              subtitle={`${((netProfit / totalRevenue) * 100).toFixed(1)}% margin`}
            />
            <MetricCard
              icon={FiBarChart2}
              title="TOTAL COSTS"
              value={formatCurrency(currentYear.totalCosts)}
              subtitle="Annual Operating Costs"
            />
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="afi-card p-6">
        <div className="flex space-x-2 mb-6 border-b border-gray-200 pb-3">
          <TabButton
            id="overview"
            label="Revenue Streams"
            isActive={activeTab === 'overview'}
            onClick={setActiveTab}
          />
          <TabButton
            id="projections"
            label="Projections"
            isActive={activeTab === 'projections'}
            onClick={setActiveTab}
          />
          <TabButton
            id="chart"
            label="Growth Chart"
            isActive={activeTab === 'chart'}
            onClick={setActiveTab}
          />
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <SafeIcon icon={FiPieChart} className="text-[#1a2c43] w-5 h-5 mr-2" />
                <h3 className="text-lg font-bold text-[#1a2c43]">
                  Revenue Breakdown - Year 1
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {revenueStreams.map((stream) => (
                  <RevenueStreamCard
                    key={stream.key}
                    title={stream.title}
                    amount={stream.amount}
                    percentage={(stream.amount / totalRevenue) * 100}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projections' && <ProjectionTable />}

          {activeTab === 'chart' && (
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <SafeIcon icon={FiBarChart2} className="text-[#1a2c43] w-5 h-5 mr-2" />
                <h3 className="text-lg font-bold text-[#1a2c43]">
                  Revenue Growth Projection
                </h3>
              </div>
              <ProjectionChart projections={projections} toggles={toggles} />
            </div>
          )}
        </motion.div>
      </div>

      {/* Summary Stats */}
      <div className="afi-card p-6">
        <div className="flex items-center mb-4">
          <SafeIcon icon={FiTrendingUp} className="text-[#1a2c43] w-5 h-5 mr-2" />
          <h3 className="text-lg font-bold text-[#1a2c43]">
            {inputs.projectionYears}-YEAR SUMMARY
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-[#1a2c43] bg-opacity-5 rounded-lg">
            <p className="text-sm font-semibold text-[#1a2c43] uppercase mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-[#1a2c43]">
              {formatCurrency(projections.reduce((sum, year) => sum + year.grossRevenue, 0))}
            </p>
          </div>
          {toggles.includeCosts && (
            <div className="text-center p-4 bg-[#1a2c43] bg-opacity-5 rounded-lg">
              <p className="text-sm font-semibold text-[#1a2c43] uppercase mb-1">Total Net Profit</p>
              <p className="text-2xl font-bold text-[#1a2c43]">
                {formatCurrency(projections.reduce((sum, year) => sum + year.netProfit, 0))}
              </p>
            </div>
          )}
          <div className="text-center p-4 bg-[#1a2c43] bg-opacity-5 rounded-lg">
            <p className="text-sm font-semibold text-[#1a2c43] uppercase mb-1">Final Year Units</p>
            <p className="text-2xl font-bold text-[#1a2c43]">
              {formatNumber(projections[projections.length - 1].units)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Email Modal */}
      <EmailModal 
        isOpen={isEmailModalOpen} 
        onClose={() => setIsEmailModalOpen(false)}
        inputs={inputs}
        projections={projections}
        toggles={toggles}
      />
    </div>
  );
};

export default OutputPanel;
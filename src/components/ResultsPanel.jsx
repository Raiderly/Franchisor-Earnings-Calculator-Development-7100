import React, { useState } from "react";
import { useCalculator } from "../context/CalculatorContext";
import * as FiIcons from "react-icons/fi";
import SafeIcon from "./common/SafeIcon";
import ProjectionChart from "./ProjectionChart";
import RevenuePieChart from "./charts/RevenuePieChart";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, formatNumber } from "../utils/formatters";

const ResultsPanel = () => {
  const { calculatedResults, inputs } = useCalculator();
  const [activeTab, setActiveTab] = useState('overview');

  if (!calculatedResults) {
    return (
      <div className="afi-card p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-afi-muted flex items-center justify-center animate-pulse">
          <SafeIcon icon={FiIcons.FiBarChart2} className="w-8 h-8 text-afi-primary opacity-50" />
        </div>
        <h3 className="text-xl font-semibold text-afi-primary mb-2">Awaiting Calculation</h3>
        <p className="text-afi-textSecondary">Complete the calculator inputs to generate your franchise earnings projections.</p>
      </div>
    );
  }

  const { projections, summary } = calculatedResults;
  const currentYear = projections[0];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiIcons.FiGrid },
    { id: 'charts', label: 'Charts', icon: FiIcons.FiPieChart },
    { id: 'projections', label: 'Projections', icon: FiIcons.FiList }
  ];

  const MetricCard = ({ icon, title, value, subtitle, primary = false }) => (
    <div className={`p-4 rounded-xl shadow-sm max-w-full overflow-hidden ${primary ? 'bg-afi-primary text-white' : 'bg-white'}`}>
      <div className="flex items-center min-w-0">
        <div className={`p-3 rounded-full mr-3 flex-shrink-0 ${primary ? 'bg-white bg-opacity-20' : 'bg-afi-primary bg-opacity-10'}`}>
          <SafeIcon icon={icon} className={`w-5 h-5 md:w-6 md:h-6 ${primary ? 'text-afi-secondary' : 'text-afi-primary'}`} />
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <p className={`text-xs uppercase tracking-wide font-semibold mb-1 ${primary ? 'text-gray-200' : 'text-afi-textSecondary'}`}>
            {title}
          </p>
          <div className="max-w-full overflow-hidden">
            <p className={`text-lg md:text-xl lg:text-2xl font-bold truncate whitespace-nowrap ${primary ? 'text-white' : 'text-afi-primary'}`}>
              {value}
            </p>
          </div>
          {subtitle && (
            <div className="max-w-full overflow-hidden mt-1">
              <p className={`text-xs truncate ${primary ? 'text-gray-200' : 'text-afi-textSecondary'}`}>
                {subtitle}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const TabButton = ({ tab, isActive, onClick }) => (
    <button
      onClick={() => onClick(tab.id)}
      className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-lg transition-all ${
        isActive ? 'bg-afi-primary text-white' : 'text-afi-textSecondary hover:text-afi-primary hover:bg-gray-50'
      }`}
    >
      <SafeIcon icon={tab.icon} className="w-4 h-4" />
      <span className="font-medium">{tab.label}</span>
    </button>
  );

  // Calculate growth from first to last year
  const firstYearRevenue = projections[0].grossRevenue;
  const lastYearRevenue = projections[projections.length - 1].grossRevenue;
  const growthPercentage = ((lastYearRevenue - firstYearRevenue) / firstYearRevenue * 100).toFixed(1);

  // Get revenue streams for overview
  const revenueStreams = [
    { name: 'Royalty Income', amount: currentYear.royaltyIncome },
    { name: 'Initial Franchise Fees', amount: currentYear.initialFees },
    { name: 'Renewal Fees', amount: currentYear.renewalFees },
    { name: 'Technology Fees', amount: currentYear.techIncome },
    { name: 'Training Fees', amount: currentYear.trainingIncome + (currentYear.trainingRecurringIncome || 0) },
    { name: 'Support Fees', amount: currentYear.supportIncome },
    { name: 'Transfer Fees', amount: currentYear.transferIncome }
  ];

  if (inputs.useSupply) {
    revenueStreams.push({ name: 'Supply Chain Revenue', amount: currentYear.supplyChainIncome || 0 });
  }

  if (inputs.useMSP) {
    revenueStreams.push({ name: 'MSP Income', amount: currentYear.mspIncome || 0 });
  }

  if (inputs.useMasterFranchise) {
    revenueStreams.push({ name: 'Master Franchise Fees', amount: currentYear.masterFranchiseFees || 0 });
    revenueStreams.push({ name: 'Master Override', amount: currentYear.masterOverrideIncome || 0 });
  }

  // Sort by amount descending and filter out zero values
  const sortedStreams = revenueStreams
    .filter(stream => stream.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4); // Top 4 for the overview

  const ProjectionsTable = () => (
    <div className="overflow-x-auto pb-2">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-afi-primary text-white px-4 py-3 text-left text-sm font-semibold rounded-tl-lg">
              Year
            </th>
            <th className="bg-afi-primary text-white px-4 py-3 text-left text-sm font-semibold">
              Units
            </th>
            <th className="bg-afi-primary text-white px-4 py-3 text-left text-sm font-semibold">
              Gross Revenue
            </th>
            {inputs.includeCosts && (
              <th className="bg-afi-primary text-white px-4 py-3 text-left text-sm font-semibold">
                Costs
              </th>
            )}
            {inputs.includeCosts && (
              <th className="bg-afi-primary text-white px-4 py-3 text-left text-sm font-semibold">
                Net Profit
              </th>
            )}
            <th className="bg-afi-primary text-white px-4 py-3 text-left text-sm font-semibold rounded-tr-lg">
              Revenue/Unit
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {projections.map((year, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-afi-muted'}>
              <td className="px-4 py-3 text-sm font-semibold text-afi-primary">
                Year {index + 1}
              </td>
              <td className="px-4 py-3 text-sm text-afi-textPrimary">
                {formatNumber(year.units)}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-afi-primary max-w-[120px]">
                <div className="truncate" title={formatCurrency(year.grossRevenue)}>
                  {formatCurrency(year.grossRevenue)}
                </div>
              </td>
              {inputs.includeCosts && (
                <td className="px-4 py-3 text-sm text-afi-textPrimary max-w-[120px]">
                  <div className="truncate" title={formatCurrency(year.totalCosts)}>
                    {formatCurrency(year.totalCosts)}
                  </div>
                </td>
              )}
              {inputs.includeCosts && (
                <td className="px-4 py-3 text-sm font-medium max-w-[120px]">
                  <div
                    className={`truncate ${year.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    title={formatCurrency(year.netProfit)}
                  >
                    {formatCurrency(year.netProfit)}
                  </div>
                </td>
              )}
              <td className="px-4 py-3 text-sm text-afi-textPrimary max-w-[120px]">
                <div className="truncate" title={formatCurrency(year.grossRevenue / year.units)}>
                  {formatCurrency(year.grossRevenue / year.units)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="afi-card overflow-hidden">
      <div className="bg-afi-primary text-white p-5 rounded-t-xl">
        <h2 className="text-xl font-semibold flex items-center">
          <SafeIcon icon={FiIcons.FiTrendingUp} className="w-5 h-5 mr-2 text-afi-secondary" />
          Financial Projections
        </h2>
        <p className="text-sm text-gray-300 mt-1">{inputs.projectionYears}-year franchise earnings forecast</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-afi-muted">
        <MetricCard
          icon={FiIcons.FiDollarSign}
          title="Year 1 Revenue"
          value={formatCurrency(currentYear.grossRevenue)}
          primary={true}
        />
        <MetricCard
          icon={FiIcons.FiUsers}
          title="Revenue Per Unit"
          value={formatCurrency(currentYear.grossRevenue / currentYear.units)}
          subtitle="Annual Average"
        />
        {inputs.includeCosts ? (
          <MetricCard
            icon={FiIcons.FiPieChart}
            title="Year 1 Profit"
            value={formatCurrency(currentYear.netProfit)}
            subtitle={`${((currentYear.netProfit / currentYear.grossRevenue) * 100).toFixed(1)}% margin`}
          />
        ) : (
          <MetricCard
            icon={FiIcons.FiTrendingUp}
            title="Revenue Growth"
            value={`${growthPercentage}%`}
            subtitle={`Over ${inputs.projectionYears} years`}
          />
        )}
        <MetricCard
          icon={FiIcons.FiMapPin}
          title="Network Size"
          value={formatNumber(currentYear.units)}
          subtitle={`+${formatNumber(projections[projections.length-1].units - currentYear.units)} in ${inputs.projectionYears} years`}
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-4 pt-4 bg-white overflow-x-auto">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={setActiveTab}
          />
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5 bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[300px]"
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Top Revenue Sources */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-afi-primary flex items-center">
                      <SafeIcon icon={FiIcons.FiTrendingUp} className="w-4 h-4 mr-2 text-afi-secondary" />
                      Top Revenue Streams
                    </h3>
                    <div className="space-y-3">
                      {sortedStreams.map((stream, index) => {
                        const percentage = (stream.amount / currentYear.grossRevenue) * 100;
                        return (
                          <div key={index} className="flex items-center p-3 rounded-lg bg-afi-muted max-w-full overflow-hidden">
                            <div className="w-1 h-12 bg-afi-secondary rounded-full mr-3 flex-shrink-0"></div>
                            <div className="flex-1 min-w-0 overflow-hidden">
                              <p className="text-sm font-medium text-afi-textPrimary truncate">{stream.name}</p>
                              <p className="text-xs text-afi-textSecondary">{percentage.toFixed(1)}% of revenue</p>
                            </div>
                            <div className="ml-2 flex-shrink-0 max-w-[100px] overflow-hidden">
                              <p 
                                className="text-sm font-bold text-afi-primary truncate" 
                                title={formatCurrency(stream.amount)}
                              >
                                {formatCurrency(stream.amount)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-afi-primary flex items-center">
                      <SafeIcon icon={FiIcons.FiBarChart2} className="w-4 h-4 mr-2 text-afi-secondary" />
                      {inputs.projectionYears}-Year Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-lg bg-afi-muted max-w-full overflow-hidden">
                        <p className="text-xs font-semibold text-afi-textSecondary uppercase">Total Revenue</p>
                        <div className="max-w-full overflow-hidden mt-1">
                          <p 
                            className="text-lg font-bold text-afi-primary truncate whitespace-nowrap" 
                            title={formatCurrency(summary.totalGrossRevenue)}
                          >
                            {formatCurrency(summary.totalGrossRevenue)}
                          </p>
                        </div>
                      </div>
                      
                      {inputs.includeCosts ? (
                        <div className="p-4 rounded-lg bg-afi-muted max-w-full overflow-hidden">
                          <p className="text-xs font-semibold text-afi-textSecondary uppercase">Total Profit</p>
                          <div className="max-w-full overflow-hidden mt-1">
                            <p 
                              className="text-lg font-bold text-afi-primary truncate whitespace-nowrap" 
                              title={formatCurrency(summary.totalNetProfit)}
                            >
                              {formatCurrency(summary.totalNetProfit)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-lg bg-afi-muted max-w-full overflow-hidden">
                          <p className="text-xs font-semibold text-afi-textSecondary uppercase">Avg Growth/Year</p>
                          <div className="max-w-full overflow-hidden mt-1">
                            <p className="text-lg font-bold text-afi-primary truncate whitespace-nowrap">
                              {summary.avgAnnualGrowth}%
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-4 rounded-lg bg-afi-muted max-w-full overflow-hidden">
                        <p className="text-xs font-semibold text-afi-textSecondary uppercase">Final Revenue</p>
                        <div className="max-w-full overflow-hidden mt-1">
                          <p 
                            className="text-lg font-bold text-afi-primary truncate whitespace-nowrap" 
                            title={formatCurrency(projections[projections.length-1].grossRevenue)}
                          >
                            {formatCurrency(projections[projections.length-1].grossRevenue)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-afi-muted max-w-full overflow-hidden">
                        <p className="text-xs font-semibold text-afi-textSecondary uppercase">Final Units</p>
                        <div className="max-w-full overflow-hidden mt-1">
                          <p className="text-lg font-bold text-afi-primary truncate whitespace-nowrap">
                            {formatNumber(summary.finalYearUnits)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="p-4 rounded-lg bg-afi-primary text-white">
                      <h4 className="text-sm font-semibold flex items-center">
                        <SafeIcon icon={FiIcons.FiZap} className="w-4 h-4 mr-1.5 text-afi-secondary" />
                        Quick Stats
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm">
                        <div className="flex justify-between min-w-0">
                          <span className="text-gray-300">Avg Revenue/Unit:</span>
                          <span 
                            className="font-semibold truncate ml-2 max-w-[80px]" 
                            title={formatCurrency(summary.avgRevenuePerUnit)}
                          >
                            {formatCurrency(summary.avgRevenuePerUnit)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">New Units/Year:</span>
                          <span className="font-semibold">{inputs.newUnitsPerYear}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Royalty Rate:</span>
                          <span className="font-semibold">{inputs.royaltyRate}%</span>
                        </div>
                        <div className="flex justify-between min-w-0">
                          <span className="text-gray-300">Initial Fee:</span>
                          <span 
                            className="font-semibold truncate ml-2 max-w-[80px]" 
                            title={formatCurrency(inputs.franchiseFee)}
                          >
                            {formatCurrency(inputs.franchiseFee)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'charts' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-afi-primary">Revenue Growth</h3>
                    <div className="h-80 bg-white rounded-lg border border-gray-200">
                      <ProjectionChart projections={projections} toggles={inputs} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-afi-primary">Revenue Distribution</h3>
                    <div className="h-80 bg-white rounded-lg border border-gray-200">
                      <RevenuePieChart projections={projections} toggles={inputs} />
                    </div>
                  </div>
                </div>

                {/* Revenue Breakdown */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-afi-primary mb-4">Revenue Streams - Year 1</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {revenueStreams
                      .filter(stream => stream.amount > 0)
                      .map((stream, index) => {
                        const percentage = (stream.amount / currentYear.grossRevenue) * 100;
                        return (
                          <div key={index} className="p-3 bg-afi-muted rounded-lg max-w-full overflow-hidden">
                            <div className="flex justify-between items-start mb-1 min-w-0">
                              <p className="text-sm font-medium text-afi-textPrimary truncate flex-1 mr-2">
                                {stream.name}
                              </p>
                              <span className="text-xs font-semibold text-afi-secondary bg-white px-1.5 py-0.5 rounded flex-shrink-0">
                                {percentage.toFixed(1)}%
                              </span>
                            </div>
                            <div className="max-w-full overflow-hidden">
                              <p 
                                className="text-lg font-bold text-afi-primary truncate whitespace-nowrap" 
                                title={formatCurrency(stream.amount)}
                              >
                                {formatCurrency(stream.amount)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projections' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-afi-primary">
                    {inputs.projectionYears}-Year Financial Projections
                  </h3>
                </div>
                <ProjectionsTable />
                <div className="bg-afi-muted p-4 rounded-lg mt-4">
                  <h4 className="text-sm font-semibold text-afi-primary mb-2 flex items-center">
                    <SafeIcon icon={FiIcons.FiInfo} className="w-4 h-4 mr-1.5 text-afi-secondary" />
                    Projection Methodology
                  </h4>
                  <p className="text-sm text-afi-textSecondary">
                    These projections are based on your input parameters and assume consistent growth and market conditions. 
                    The model calculates revenue streams from multiple sources including royalties, fees, and other income 
                    based on your franchise structure.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResultsPanel;
import React from "react";
import * as FiIcons from "react-icons/fi";
import SafeIcon from "../common/SafeIcon";

const SummaryStats = ({ summary, projections, includeCosts }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const currentYear = projections[0];
  
  // Revenue breakdown for current year
  const revenueStreams = [
    { label: 'Royalty Income', amount: currentYear.royaltyIncome },
    { label: 'Initial Fees', amount: currentYear.initialFees },
    { label: 'Tech Fees', amount: currentYear.techIncome },
    { label: 'Support Fees', amount: currentYear.supportIncome },
    { label: 'Training Income', amount: currentYear.trainingIncome },
    { label: 'Renewal Fees', amount: currentYear.renewalFees },
    { label: 'Transfer Fees', amount: currentYear.transferFees },
  ];

  // Add optional streams
  if (currentYear.supplyChainIncome > 0) {
    revenueStreams.push({ label: 'Supply Chain', amount: currentYear.supplyChainIncome });
  }
  if (currentYear.mspIncome > 0) {
    revenueStreams.push({ label: 'MSP Income', amount: currentYear.mspIncome });
  }
  if (currentYear.masterFranchiseFees > 0) {
    revenueStreams.push({ label: 'Master Franchise', amount: currentYear.masterFranchiseFees });
  }

  // Sort by amount descending
  revenueStreams.sort((a, b) => b.amount - a.amount);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Summary Statistics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <SafeIcon icon={FiIcons.FiBarChart} className="w-5 h-5 mr-2 text-blue-600" />
          {projections.length}-Year Summary
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-700 uppercase tracking-wide">
              Total Revenue
            </p>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(summary.totalGrossRevenue)}
            </p>
          </div>
          
          {includeCosts && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
              <p className="text-sm font-medium text-green-700 uppercase tracking-wide">
                Total Profit
              </p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(summary.totalNetProfit)}
              </p>
            </div>
          )}
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <p className="text-sm font-medium text-purple-700 uppercase tracking-wide">
              Avg Growth
            </p>
            <p className="text-2xl font-bold text-purple-900">
              {summary.avgAnnualGrowth}%
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <p className="text-sm font-medium text-orange-700 uppercase tracking-wide">
              Final Units
            </p>
            <p className="text-2xl font-bold text-orange-900">
              {summary.finalYearUnits.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <SafeIcon icon={FiIcons.FiPieChart} className="w-5 h-5 mr-2 text-green-600" />
          Year 1 Revenue Streams
        </h3>
        
        <div className="space-y-2">
          {revenueStreams.map((stream, index) => {
            const percentage = (stream.amount / currentYear.grossRevenue) * 100;
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{stream.label}</p>
                  <p className="text-xs text-gray-500">{percentage.toFixed(1)}% of total</p>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {formatCurrency(stream.amount)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;
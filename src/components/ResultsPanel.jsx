import React, { useState } from "react";
import { useCalculator } from "../context/CalculatorContext";
import MetricCard from "./results/MetricCard";
import ProjectionsTable from "./results/ProjectionsTable";
import RevenueChart from "./results/RevenueChart";
import SummaryStats from "./results/SummaryStats";
import * as FiIcons from "react-icons/fi";
import SafeIcon from "./common/SafeIcon";
import { motion } from "framer-motion";

const ResultsPanel = () => {
  const { calculatedResults, inputs } = useCalculator();
  const [activeTab, setActiveTab] = useState('overview');

  if (!calculatedResults) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <SafeIcon icon={FiIcons.FiLoader} className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
        <p className="text-gray-500">Calculating projections...</p>
      </div>
    );
  }

  const { projections, summary } = calculatedResults;
  const currentYear = projections[0];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiIcons.FiBarChart2 },
    { id: 'projections', label: 'Projections', icon: FiIcons.FiTable },
    { id: 'charts', label: 'Charts', icon: FiIcons.FiTrendingUp }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <SafeIcon icon={FiIcons.FiTrendingUp} className="w-5 h-5 mr-2" />
          Financial Projections
        </h2>
      </div>

      {/* Key Metrics */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Year 1 Revenue"
            value={formatCurrency(currentYear.grossRevenue)}
            icon={FiIcons.FiDollarSign}
            color="blue"
          />
          <MetricCard
            title="Revenue/Unit"
            value={formatCurrency(currentYear.revenuePerUnit)}
            icon={FiIcons.FiUsers}
            color="green"
          />
          {inputs.includeCosts && (
            <MetricCard
              title="Year 1 Profit"
              value={formatCurrency(currentYear.netProfit)}
              icon={FiIcons.FiTrendingUp}
              color={currentYear.netProfit >= 0 ? "green" : "red"}
            />
          )}
          <MetricCard
            title="Total Units"
            value={currentYear.units.toLocaleString()}
            icon={FiIcons.FiMapPin}
            color="purple"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <SafeIcon icon={tab.icon} className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <SummaryStats 
                summary={summary} 
                projections={projections}
                includeCosts={inputs.includeCosts}
              />
            </div>
          )}

          {activeTab === 'projections' && (
            <ProjectionsTable 
              projections={projections} 
              includeCosts={inputs.includeCosts}
            />
          )}

          {activeTab === 'charts' && (
            <RevenueChart 
              projections={projections}
              includeCosts={inputs.includeCosts}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPanel;
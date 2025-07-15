import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave } from 'react-icons/fi';
import InputTabs from '../components/calculator/InputTabs';
import MetricCards from '../components/calculator/MetricCards';
import RevenueChart from '../components/calculator/RevenueChart';
import RevenuePieChart from '../components/calculator/RevenuePieChart';
import ProjectionsTable from '../components/calculator/ProjectionsTable';
import LoadScenarioButton from '../components/calculator/LoadScenarioButton';
import SaveScenarioModal from '../components/calculator/SaveScenarioModal';
import { useCalculator } from '../context/CalculatorContext';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../components/common/SafeIcon';

const Calculator = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const { inputs, toggles, projections } = useCalculator();
  const { session } = useAuth();
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'charts', label: 'Charts' },
    { id: 'projections', label: 'Projections' },
  ];
  
  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Franchise Financial Calculator
        </h1>
        <p className="text-gray-600">
          Project your franchise's financial performance with our comprehensive calculator
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Inputs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5"
        >
          <InputTabs />
          
          <div className="mt-6 flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            {session && (
              <button
                onClick={() => setIsSaveModalOpen(true)}
                className="btn-primary flex items-center justify-center"
              >
                <SafeIcon icon={FiSave} className="mr-2" />
                Save Scenario
              </button>
            )}
            
            <LoadScenarioButton />
          </div>
        </motion.div>
        
        {/* Right Column - Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-7"
        >
          {projections && projections.length > 0 ? (
            <>
              <MetricCards projections={projections} />
              
              <div className="card mb-6">
                <div className="tab-nav">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                <div className="card-body">
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-md font-medium text-gray-700">Revenue Breakdown</h4>
                          <div className="h-64">
                            <RevenuePieChart projections={projections} toggles={toggles} />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-md font-medium text-gray-700">Growth Projection</h4>
                          <div className="h-64">
                            <RevenueChart 
                              projections={projections} 
                              includeCosts={toggles.includeCosts} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'charts' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">Financial Charts</h3>
                      <div className="mb-8">
                        <h4 className="text-md font-medium text-gray-700 mb-4">Revenue Growth</h4>
                        <div className="h-80">
                          <RevenueChart 
                            projections={projections} 
                            includeCosts={toggles.includeCosts} 
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-4">Revenue Distribution</h4>
                        <div className="h-80">
                          <RevenuePieChart projections={projections} toggles={toggles} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'projections' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {inputs.projectionYears}-Year Financial Projections
                      </h3>
                      <ProjectionsTable 
                        projections={projections} 
                        includeCosts={toggles.includeCosts} 
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800">
                  <strong>Disclaimer:</strong> These projections are estimates based on the inputs provided 
                  and are for planning purposes only. Actual results may vary significantly based on 
                  market conditions, location, management effectiveness, and other factors.
                </p>
              </div>
            </>
          ) : (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <SafeIcon icon="Calculator" className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Yet</h3>
              <p className="text-gray-500 mb-6">
                Adjust the calculator inputs to generate financial projections.
              </p>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Save Scenario Modal */}
      <SaveScenarioModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        inputs={inputs}
        toggles={toggles}
        projections={projections}
      />
    </div>
  );
};

export default Calculator;
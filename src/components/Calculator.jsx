import React, { useState } from 'react';
import { useCalculator } from '../context/CalculatorContext';
import InputTabs from './InputTabs';
import MetricCards from './MetricCards';
import Charts from './Charts';
import ProjectionsTable from './ProjectionsTable';
import ScenarioManager from './ScenarioManager';

const Calculator = () => {
  const { projections } = useCalculator();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'charts', label: 'Charts' },
    { id: 'projections', label: 'Projections' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-afi-text mb-2">
          Franchise Financial Calculator
        </h1>
        <p className="text-afi-text-light">
          Project your franchise's financial performance with professional accuracy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <InputTabs />
          <div className="mt-6">
            <ScenarioManager />
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {projections.length > 0 ? (
            <>
              <MetricCards />
              
              <div className="afi-card mt-6">
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

                <div className="afi-card-body">
                  {activeTab === 'overview' && <Charts />}
                  {activeTab === 'charts' && <Charts />}
                  {activeTab === 'projections' && <ProjectionsTable />}
                </div>
              </div>
            </>
          ) : (
            <div className="afi-card text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-afi-text mb-2">
                Ready to Calculate
              </h3>
              <p className="text-afi-text-light">
                Configure your franchise parameters to generate projections
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
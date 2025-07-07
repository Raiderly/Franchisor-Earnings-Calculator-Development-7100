import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InputPanel from './InputPanel';
import OutputPanel from './OutputPanel';
import { calculateProjections } from '../utils/calculations';

const FranchisorCalculator = () => {
  const [inputs, setInputs] = useState({
    // Franchise Network Profile
    units: 50,
    newUnitsPerYear: 12,
    termYears: 10,
    growthRate: 15,
    churnRate: 8,
    
    // Financial Inputs
    avgSales: 500000,
    royaltyPct: 6,
    marketingPct: 2,
    franchiseFee: 45000,
    renewalFee: 15000,
    transferFee: 25000,
    resaleFreq: 7,
    trainingFee: 8000,
    trainingAnnualFee: 2000,
    techFee: 299,
    supportFee: 199,
    supplySpend: 50000,
    supplyMarginPct: 15,
    
    // Master Franchise
    masterTerritories: 3,
    masterRoyaltyPct: 50,
    masterInitPct: 40,
    masterFee: 150000,
    masterOngoingPct: 2,
    
    // Costs
    costStaff: 250000,
    costRecruitment: 5000,
    costTraining: 2000,
    costTech: 50,
    costLegal: 75000,
    costMarketingAdmin: 25000,
    
    // Projection Settings
    projectionYears: 5
  });

  const [toggles, setToggles] = useState({
    masterFranchise: false,
    supplyChain: true,
    marketingIncome: false,
    includeCosts: true
  });

  const updateInput = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const updateToggle = (key, value) => {
    setToggles(prev => ({ ...prev, [key]: value }));
  };

  const projections = useMemo(() => {
    return calculateProjections(inputs, toggles);
  }, [inputs, toggles]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-[#1a2c43] mb-2">
          Franchisor Earnings Calculator
        </h1>
        <p className="text-lg text-gray-600">
          Accurately model your franchise business potential
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <InputPanel
            inputs={inputs}
            toggles={toggles}
            updateInput={updateInput}
            updateToggle={updateToggle}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <OutputPanel
            projections={projections}
            toggles={toggles}
            inputs={inputs}
          />
        </motion.div>
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-12 pb-8">
        © {new Date().getFullYear()} Accurate Franchising, Inc. All rights reserved.
      </div>
    </div>
  );
};

export default FranchisorCalculator;
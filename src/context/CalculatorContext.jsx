import React, { createContext, useContext, useState, useEffect } from 'react';

const CalculatorContext = createContext();

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};

export const CalculatorProvider = ({ children }) => {
  const [inputs, setInputs] = useState({
    // Basic Info
    units: 25,
    avgSales: 500000,
    royaltyRate: 6,
    marketingLevy: 2,
    growthRate: 15,
    churnRate: 8,
    newUnitsPerYear: 10,
    franchiseeTerm: 10,
    
    // Fees
    franchiseFee: 45000,
    renewalFee: 15000,
    transferFee: 25000,
    trainingFee: 8000,
    techFee: 299,
    supportFee: 199,
    
    // Advanced
    useSupply: true,
    supplySpend: 50000,
    supplyMargin: 15,
    useMSP: false,
    mspFee: 199,
    mspServices: 5000,
    useMasterFranchise: false,
    masterSplit: 40,
    masterFee: 150000,
    masterTerritories: 3,
    
    // Settings
    projectionYears: 5,
    includeCosts: true,
    
    // Costs
    staffCosts: 250000,
    recruitmentCost: 5000,
    trainingCost: 2000,
    techCosts: 50000,
    legalCosts: 75000,
    marketingAdminCosts: 25000,
  });

  const [projections, setProjections] = useState([]);

  const updateInput = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateMultipleInputs = (updates) => {
    setInputs(prev => ({
      ...prev,
      ...updates
    }));
  };

  const calculateProjections = () => {
    const results = [];
    
    for (let year = 0; year < inputs.projectionYears; year++) {
      let units = inputs.units;
      
      // Calculate units for this year
      if (year > 0) {
        const previousYear = results[year - 1];
        units = previousYear.units;
        // Apply growth and churn
        units = units * (1 + inputs.growthRate / 100) - (units * inputs.churnRate / 100);
        // Add new units
        units += inputs.newUnitsPerYear;
      } else {
        // First year - add new units
        units += inputs.newUnitsPerYear;
      }
      
      units = Math.max(0, Math.round(units));
      
      // Calculate revenue streams
      const royaltyIncome = units * inputs.avgSales * (inputs.royaltyRate / 100);
      const initialFees = inputs.newUnitsPerYear * inputs.franchiseFee;
      const renewalFees = (units / inputs.franchiseeTerm) * inputs.renewalFee;
      const trainingIncome = inputs.newUnitsPerYear * inputs.trainingFee;
      const techIncome = units * inputs.techFee * 12;
      const supportIncome = units * inputs.supportFee * 12;
      const transferIncome = (units / 10) * inputs.transferFee; // 10% transfer rate
      
      // Optional revenue streams
      const supplyChainIncome = inputs.useSupply ? 
        units * inputs.supplySpend * (inputs.supplyMargin / 100) : 0;
      const mspIncome = inputs.useMSP ? 
        (units * inputs.mspFee * 12) + (units * inputs.mspServices) : 0;
      
      // Master franchise calculations
      let masterFranchiseFees = 0;
      let masterOverrideIncome = 0;
      let adjustedRoyaltyIncome = royaltyIncome;
      let adjustedInitialFees = initialFees;
      
      if (inputs.useMasterFranchise) {
        if (year === 0) {
          masterFranchiseFees = inputs.masterTerritories * inputs.masterFee;
        }
        masterOverrideIncome = (units * inputs.avgSales) * (0.5 / 100);
        adjustedRoyaltyIncome = royaltyIncome * (inputs.masterSplit / 100);
        adjustedInitialFees = initialFees * (inputs.masterSplit / 100);
      }
      
      // Calculate gross revenue
      const grossRevenue = adjustedRoyaltyIncome + adjustedInitialFees + renewalFees + 
        trainingIncome + techIncome + supportIncome + transferIncome + 
        supplyChainIncome + mspIncome + masterFranchiseFees + masterOverrideIncome;
      
      // Calculate costs
      const totalCosts = inputs.includeCosts ? 
        inputs.staffCosts + 
        (inputs.newUnitsPerYear * inputs.recruitmentCost) + 
        (inputs.newUnitsPerYear * inputs.trainingCost) + 
        inputs.techCosts + 
        inputs.legalCosts + 
        inputs.marketingAdminCosts : 0;
      
      const netProfit = grossRevenue - totalCosts;
      
      results.push({
        year: year + 1,
        units,
        royaltyIncome: adjustedRoyaltyIncome,
        initialFees: adjustedInitialFees,
        renewalFees,
        trainingIncome,
        techIncome,
        supportIncome,
        transferIncome,
        supplyChainIncome,
        mspIncome,
        masterFranchiseFees,
        masterOverrideIncome,
        grossRevenue,
        totalCosts,
        netProfit,
        revenuePerUnit: grossRevenue / units
      });
    }
    
    return results;
  };

  // Recalculate projections when inputs change
  useEffect(() => {
    const results = calculateProjections();
    setProjections(results);
  }, [inputs]);

  const value = {
    inputs,
    projections,
    updateInput,
    updateMultipleInputs,
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};
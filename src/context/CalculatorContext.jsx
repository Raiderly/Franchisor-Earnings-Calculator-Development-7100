import React, { createContext, useContext, useState, useEffect } from "react";

const CalculatorContext = createContext();

export const CalculatorProvider = ({ children }) => {
  const [inputs, setInputs] = useState({
    // Basic Franchise Data
    units: 25,
    avgSales: 500000,
    royaltyRate: 6.5,
    marketingLevy: 2.0,
    
    // Growth & Operations
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
    
    // Supply Chain
    useSupply: true,
    supplySpend: 50000,
    supplyMargin: 12,
    
    // Master Service Provider (MSP)
    useMSP: false,
    mspFee: 150,
    mspServices: 3000,
    
    // Master Franchise
    useMasterFranchise: false,
    masterSplit: 40,
    masterFee: 150000,
    masterTerritories: 3,
    
    // Advanced Settings
    projectionYears: 5,
    includeCosts: true,
    
    // Operational Costs
    staffCosts: 250000,
    recruitmentCost: 5000,
    trainingCost: 2000,
    techCosts: 50000,
    legalCosts: 75000,
    marketingAdminCosts: 25000
  });

  const [calculatedResults, setCalculatedResults] = useState(null);

  const updateField = (field, value) => {
    setInputs(prev => {
      const updated = { ...prev, [field]: value };
      return updated;
    });
  };

  const updateMultipleFields = (updates) => {
    setInputs(prev => ({ ...prev, ...updates }));
  };

  // Calculate results whenever inputs change
  useEffect(() => {
    const results = calculateProjections(inputs);
    setCalculatedResults(results);
  }, [inputs]);

  return (
    <CalculatorContext.Provider value={{ 
      inputs, 
      updateField, 
      updateMultipleFields,
      calculatedResults 
    }}>
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};

// Enhanced calculation function
const calculateProjections = (inputs) => {
  const {
    units, avgSales, royaltyRate, marketingLevy, growthRate, churnRate,
    newUnitsPerYear, franchiseeTerm, franchiseFee, renewalFee, transferFee,
    trainingFee, techFee, supportFee, useSupply, supplySpend, supplyMargin,
    useMSP, mspFee, mspServices, useMasterFranchise, masterSplit, masterFee,
    masterTerritories, projectionYears, includeCosts, staffCosts,
    recruitmentCost, trainingCost, techCosts, legalCosts, marketingAdminCosts
  } = inputs;

  const projections = [];
  let currentUnits = units;

  for (let year = 0; year < projectionYears; year++) {
    // Unit calculations
    if (year > 0) {
      // Apply growth and churn
      currentUnits = currentUnits * (1 + growthRate / 100) - (currentUnits * churnRate / 100);
      currentUnits += newUnitsPerYear;
    } else {
      currentUnits += newUnitsPerYear;
    }
    currentUnits = Math.max(0, Math.round(currentUnits));

    // Revenue calculations
    const totalSales = currentUnits * avgSales;
    const royaltyIncome = totalSales * (royaltyRate / 100);
    const marketingIncome = totalSales * (marketingLevy / 100);
    
    // Fees
    const initialFees = newUnitsPerYear * franchiseFee;
    const renewalFees = (currentUnits / franchiseeTerm) * renewalFee;
    const transferFees = (currentUnits * 0.1) * transferFee; // Assume 10% transfer annually
    const trainingIncome = newUnitsPerYear * trainingFee;
    const techIncome = currentUnits * techFee * 12;
    const supportIncome = currentUnits * supportFee * 12;
    
    // Optional revenue streams
    const supplyChainIncome = useSupply ? currentUnits * supplySpend * (supplyMargin / 100) : 0;
    const mspIncome = useMSP ? (currentUnits * mspFee * 12) + (currentUnits * mspServices) : 0;
    
    // Master franchise
    let masterFranchiseFees = 0;
    let adjustedRoyalty = royaltyIncome;
    let adjustedInitialFees = initialFees;
    
    if (useMasterFranchise) {
      if (year === 0) {
        masterFranchiseFees = masterTerritories * masterFee;
      }
      // Adjust for master franchise split
      adjustedRoyalty = royaltyIncome * (masterSplit / 100);
      adjustedInitialFees = initialFees * (masterSplit / 100);
    }
    
    // Total revenue
    const grossRevenue = adjustedRoyalty + adjustedInitialFees + renewalFees + 
      transferFees + trainingIncome + techIncome + supportIncome + 
      supplyChainIncome + mspIncome + masterFranchiseFees;
    
    // Costs
    const totalCosts = includeCosts ? 
      staffCosts + 
      (newUnitsPerYear * recruitmentCost) + 
      (newUnitsPerYear * trainingCost) + 
      techCosts + 
      legalCosts + 
      marketingAdminCosts : 0;
    
    const netProfit = grossRevenue - totalCosts;
    
    projections.push({
      year: year + 1,
      units: currentUnits,
      totalSales,
      royaltyIncome: adjustedRoyalty,
      marketingIncome,
      initialFees: adjustedInitialFees,
      renewalFees,
      transferFees,
      trainingIncome,
      techIncome,
      supportIncome,
      supplyChainIncome,
      mspIncome,
      masterFranchiseFees,
      grossRevenue,
      totalCosts,
      netProfit,
      revenuePerUnit: grossRevenue / currentUnits
    });
  }

  // Calculate summary metrics
  const totalGrossRevenue = projections.reduce((sum, year) => sum + year.grossRevenue, 0);
  const totalNetProfit = projections.reduce((sum, year) => sum + year.netProfit, 0);
  const avgAnnualGrowth = projections.length > 1 ? 
    ((projections[projections.length - 1].grossRevenue / projections[0].grossRevenue) ** (1 / (projections.length - 1)) - 1) * 100 : 0;

  return {
    projections,
    summary: {
      totalGrossRevenue,
      totalNetProfit,
      avgAnnualGrowth: avgAnnualGrowth.toFixed(1),
      finalYearUnits: projections[projections.length - 1]?.units || 0,
      avgRevenuePerUnit: totalGrossRevenue / projections.reduce((sum, year) => sum + year.units, 0)
    }
  };
};
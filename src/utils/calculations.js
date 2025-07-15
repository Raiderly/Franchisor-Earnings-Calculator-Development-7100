/**
 * Calculate financial projections for a franchise business
 * @param {Object} inputs - Input parameters for calculations
 * @param {Object} toggles - Toggle switches for optional calculations
 * @returns {Array} - Array of yearly projection objects
 */
export const calculateProjections = (inputs, toggles) => {
  const projections = [];
  
  for (let year = 0; year < inputs.projectionYears; year++) {
    let units = inputs.units;
    
    // Calculate units for this year
    if (year > 0) {
      const previousYear = projections[year - 1];
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
    const trainingRecurringIncome = 0; // Not included in inputs but could be added
    const techIncome = units * inputs.techFee * 12;
    const supportIncome = units * inputs.supportFee * 12;
    const transferIncome = (units / 10) * inputs.transferFee; // Assume 10% transfer rate
    
    // Optional revenue streams
    const supplyChainIncome = toggles.supplyChain 
      ? units * inputs.supplySpend * (inputs.supplyMargin / 100) 
      : 0;
      
    const marketingIncome = toggles.marketingIncome 
      ? units * inputs.avgSales * (inputs.marketingLevy / 100) 
      : 0;
    
    // Master franchise calculations
    let masterFranchiseFees = 0;
    let masterOverrideIncome = 0;
    let adjustedRoyaltyIncome = royaltyIncome;
    let adjustedInitialFees = initialFees;
    
    if (toggles.masterFranchise) {
      if (year === 0) {
        masterFranchiseFees = inputs.masterTerritories * inputs.masterFee;
      }
      
      masterOverrideIncome = (units * inputs.avgSales) * (0.5 / 100); // Assume 0.5% override
      
      // Adjust royalty and initial fees for master franchise share
      adjustedRoyaltyIncome = royaltyIncome * (inputs.masterSplit / 100);
      adjustedInitialFees = initialFees * (inputs.masterSplit / 100);
    }
    
    // Calculate gross revenue
    const grossRevenue = adjustedRoyaltyIncome + 
                         adjustedInitialFees + 
                         renewalFees + 
                         trainingIncome + 
                         trainingRecurringIncome + 
                         techIncome + 
                         supportIncome + 
                         transferIncome + 
                         supplyChainIncome + 
                         marketingIncome + 
                         masterFranchiseFees + 
                         masterOverrideIncome;
    
    // Calculate costs
    const totalCosts = toggles.includeCosts 
      ? inputs.staffCosts + 
        (inputs.newUnitsPerYear * inputs.recruitmentCost) + 
        (inputs.newUnitsPerYear * inputs.trainingCost) + 
        inputs.techCosts + 
        inputs.legalCosts + 
        inputs.marketingAdminCosts
      : 0;
      
    const netProfit = grossRevenue - totalCosts;
    
    projections.push({
      year: year + 1,
      units,
      royaltyIncome: adjustedRoyaltyIncome,
      initialFees: adjustedInitialFees,
      renewalFees,
      trainingIncome,
      trainingRecurringIncome,
      techIncome,
      supportIncome,
      transferIncome,
      supplyChainIncome,
      marketingIncome,
      masterFranchiseFees,
      masterOverrideIncome,
      grossRevenue,
      totalCosts,
      netProfit
    });
  }
  
  return projections;
};
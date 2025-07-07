import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { formatDate } from './formatters';

export const exportToCsv = async (inputs, projections, toggles) => {
  // Create data arrays for CSV
  const inputData = formatInputsForCsv(inputs, toggles);
  const projectionData = formatProjectionsForCsv(projections, toggles);
  
  // Combine all data
  const allData = [
    // Header row
    ['FRANCHISOR EARNINGS CALCULATOR - ACCURATE FRANCHISING INC.'],
    ['Generated on', new Date().toLocaleDateString()],
    [''],
    
    // Input data section
    ['INPUTS'],
    ...inputData,
    [''],
    
    // Projections section
    ['PROJECTIONS'],
    ...projectionData
  ];
  
  // Convert to CSV
  const csv = Papa.unparse(allData);
  
  // Create blob and trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `franchisor_earnings_report_${formatDate(new Date())}.csv`);
};

const formatInputsForCsv = (inputs, toggles) => {
  const data = [
    // Network Profile
    ['Franchise Network Profile'],
    ['Current Franchise Units', inputs.units],
    ['New Units Per Year', inputs.newUnitsPerYear],
    ['Average Franchise Term (years)', inputs.termYears],
    ['Growth Rate (%)', inputs.growthRate],
    ['Churn Rate (%)', inputs.churnRate],
    ['Projection Duration (years)', inputs.projectionYears],
    [''],
    
    // Financial Inputs
    ['Financial Inputs'],
    ['Average Gross Sales per Unit', inputs.avgSales],
    ['Royalty Percentage (%)', inputs.royaltyPct],
    ['Marketing Levy (%)', inputs.marketingPct],
    ['Initial Franchise Fee', inputs.franchiseFee],
    ['Renewal Fee', inputs.renewalFee],
    ['Transfer Fee', inputs.transferFee],
    ['Resale Frequency (years)', inputs.resaleFreq],
    ['Training Fee (Initial)', inputs.trainingFee],
    ['Recurring Training Fee', inputs.trainingAnnualFee],
    ['Technology Fee (Monthly)', inputs.techFee],
    ['Admin/Support Fee (Monthly)', inputs.supportFee],
  ];
  
  // Add Supply Chain data if enabled
  if (toggles.supplyChain) {
    data.push(['']);
    data.push(['Supply Chain']);
    data.push(['Annual Supply Chain Spend per Unit', inputs.supplySpend]);
    data.push(['Supply Chain Margin (%)', inputs.supplyMarginPct]);
  }
  
  // Add Master Franchise data if enabled
  if (toggles.masterFranchise) {
    data.push(['']);
    data.push(['Master Franchise']);
    data.push(['Number of Master Territories', inputs.masterTerritories]);
    data.push(['Franchisor Share of Royalty (%)', inputs.masterRoyaltyPct]);
    data.push(['Franchisor Share of Initial Fees (%)', inputs.masterInitPct]);
    data.push(['Master Franchise Fee', inputs.masterFee]);
    data.push(['Master Ongoing Override (%)', inputs.masterOngoingPct]);
  }
  
  // Add Cost data if enabled
  if (toggles.includeCosts) {
    data.push(['']);
    data.push(['Costs']);
    data.push(['Staff Costs (Annual)', inputs.costStaff]);
    data.push(['Recruitment Cost per New Franchisee', inputs.costRecruitment]);
    data.push(['Training Delivery Cost', inputs.costTraining]);
    data.push(['Tech Licensing Cost per Unit', inputs.costTech]);
    data.push(['Legal & Compliance Costs', inputs.costLegal]);
    data.push(['Marketing Fund Admin Overhead', inputs.costMarketingAdmin]);
  }
  
  return data;
};

const formatProjectionsForCsv = (projections, toggles) => {
  // Create header row
  const headers = ['Year', 'Units', 'Gross Revenue'];
  
  // Add cost columns if costs are included
  if (toggles.includeCosts) {
    headers.push('Total Costs', 'Net Profit');
  }
  
  // Add revenue stream columns
  headers.push(
    'Royalty Income',
    'Initial Franchise Fees',
    'Renewal Fees',
    'Training Fees',
    'Technology Fees',
    'Admin/Support Fees',
    'Transfer Fees'
  );
  
  // Add optional revenue streams
  if (toggles.supplyChain) {
    headers.push('Supply Chain Income');
  }
  
  if (toggles.marketingIncome) {
    headers.push('Marketing Levy Income');
  }
  
  if (toggles.masterFranchise) {
    headers.push('Master Franchise Fees', 'Master Override Income');
  }
  
  // Add Revenue Per Unit
  headers.push('Revenue Per Unit');
  
  // Create data rows
  const data = [headers];
  
  // Add projection data for each year
  projections.forEach((year, index) => {
    const row = [
      `Year ${index + 1}`,
      year.units,
      year.grossRevenue
    ];
    
    // Add cost data if included
    if (toggles.includeCosts) {
      row.push(year.totalCosts, year.netProfit);
    }
    
    // Add revenue streams
    row.push(
      year.royaltyIncome,
      year.initialFees,
      year.renewalFees,
      year.trainingIncome + year.trainingRecurringIncome,
      year.techIncome,
      year.supportIncome,
      year.transferIncome
    );
    
    // Add optional revenue streams
    if (toggles.supplyChain) {
      row.push(year.supplyChainIncome);
    }
    
    if (toggles.marketingIncome) {
      row.push(year.marketingIncome);
    }
    
    if (toggles.masterFranchise) {
      row.push(year.masterFranchiseFees, year.masterOverrideIncome);
    }
    
    // Add Revenue Per Unit
    row.push(year.grossRevenue / year.units);
    
    data.push(row);
  });
  
  return data;
};
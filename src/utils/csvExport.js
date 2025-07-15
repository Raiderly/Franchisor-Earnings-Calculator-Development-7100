import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { formatDate } from './formatters';

/**
 * Export calculator data to CSV file
 * @param {Object} inputs - Calculator inputs
 * @param {Array} projections - Calculated projections
 * @param {Object} toggles - Feature toggles
 * @returns {Promise} - Promise resolving when CSV is created and downloaded
 */
export const exportToCsv = async (inputs, projections, toggles) => {
  // Create data arrays for CSV
  const inputData = formatInputsForCsv(inputs, toggles);
  const projectionData = formatProjectionsForCsv(projections, toggles);

  // Combine all data
  const allData = [
    // Header row with AFI branding
    ['ACCURATE FRANCHISING INC. - FRANCHISE EARNINGS CALCULATOR'],
    ['Professional Franchise Revenue Projection'],
    ['Generated on', new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})],
    [''],

    // Input data section
    ['INPUT PARAMETERS'],
    ...inputData,
    [''],

    // Projections section
    ['FINANCIAL PROJECTIONS'],
    ...projectionData,
    [''],

    // Footer with contact info
    ['FOR MORE INFORMATION'],
    ['Website:', 'https://www.accuratefranchising.com'],
    ['Contact:', 'info@accuratefranchising.com'],
    ['Phone:', '(800) 300-3181'],
  ];

  // Convert to CSV
  const csv = Papa.unparse(allData);

  // Create blob and trigger download
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
  saveAs(blob, `AFI-Franchise-Earnings-Report-${formatDate(new Date())}.csv`);
};

const formatInputsForCsv = (inputs, toggles) => {
  const data = [
    // Network Profile
    ['Franchise Network Profile'],
    ['Current Franchise Units', inputs.units],
    ['New Units Per Year', inputs.newUnitsPerYear],
    ['Average Franchise Term (years)', inputs.franchiseeTerm || inputs.termYears],
    ['Growth Rate (%)', inputs.growthRate],
    ['Churn Rate (%)', inputs.churnRate],
    ['Projection Duration (years)', inputs.projectionYears],
    [''],

    // Financial Inputs
    ['Financial Parameters'],
    ['Average Gross Sales per Unit', inputs.avgSales],
    ['Royalty Percentage (%)', inputs.royaltyRate],
    ['Marketing Levy (%)', inputs.marketingLevy],
    ['Initial Franchise Fee', inputs.franchiseFee],
    ['Renewal Fee', inputs.renewalFee],
    ['Transfer Fee', inputs.transferFee],
    ['Technology Fee (Monthly)', inputs.techFee],
    ['Support Fee (Monthly)', inputs.supportFee],
    ['Training Fee (Initial)', inputs.trainingFee],
  ];

  // Add Supply Chain data if enabled
  if (toggles.supplyChain) {
    data.push(['']);
    data.push(['Supply Chain']);
    data.push(['Annual Supply Chain Spend per Unit', inputs.supplySpend]);
    data.push(['Supply Chain Margin (%)', inputs.supplyMargin]);
  }

  // Add Master Franchise data if enabled
  if (toggles.masterFranchise) {
    data.push(['']);
    data.push(['Master Franchise']);
    data.push(['Number of Master Territories', inputs.masterTerritories]);
    data.push(['Franchisor Share of Royalty (%)', inputs.masterSplit]);
    data.push(['Master Franchise Fee', inputs.masterFee]);
  }

  // Add Cost data if enabled
  if (toggles.includeCosts) {
    data.push(['']);
    data.push(['Operating Costs']);
    data.push(['Staff Costs (Annual)', inputs.staffCosts]);
    data.push(['Recruitment Cost per New Franchisee', inputs.recruitmentCost]);
    data.push(['Training Delivery Cost', inputs.trainingCost]);
    data.push(['Technology Costs (Annual)', inputs.techCosts]);
    data.push(['Legal & Compliance Costs', inputs.legalCosts]);
    data.push(['Marketing Fund Admin Overhead', inputs.marketingAdminCosts]);
  }

  return data;
};

const formatProjectionsForCsv = (projections, toggles) => {
  // Create header row
  const headers = ['Year', 'Units', 'Total Annual Revenue'];

  // Add cost columns if costs are included
  if (toggles.includeCosts) {
    headers.push('Operating Costs', 'Net Profit', 'Profit Margin (%)');
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
      const profitMargin = (year.netProfit / year.grossRevenue) * 100;
      row.push(
        year.totalCosts, 
        year.netProfit,
        profitMargin.toFixed(1) + '%'
      );
    }

    // Add revenue streams
    row.push(
      year.royaltyIncome,
      year.initialFees,
      year.renewalFees,
      year.trainingIncome + (year.trainingRecurringIncome || 0),
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
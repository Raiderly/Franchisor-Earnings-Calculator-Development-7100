import html2pdf from 'html2pdf.js';

/**
 * Enhanced PDF Export Module for Franchise Earnings Calculator
 * Professional formatting with embedded logos and charts
 */

// Base64 encoded AFI logo
const AFI_LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB14AAAP1CAIAAABOuNoKAAAgAElEQVR4AeydB1wUR///j6ixJL/nef7Pk2jyxChEYwc0UUNUNLFGY40FsAuIXbGXGDv2RhMFGxoLdkVFEVBBAelwDe6QdggiReoBx93N/9kbHderC3fgoV9e9+I1Ozs7O9/3zM7Mfva7s6yvv/7a0cEOfkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEg8JEQ+Prrr1lff/21SMiHHxAA';

/**
 * Main PDF export function with professional formatting
 */
export const exportToPdf = async (inputs, projections, toggles, returnBlob = false) => {
  try {
    if (!projections || projections.length === 0) {
      throw new Error('No projection data available');
    }

    console.log('🚀 Starting professional PDF export...');

    // Create professional PDF container
    const element = document.createElement('div');
    element.id = 'pdf-content';
    element.style.cssText = `
      font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
      background: white;
      color: #2c3e50;
      line-height: 1.6;
      font-size: 12px;
      margin: 0;
      padding: 0;
    `;

    // Get chart images
    const { lineChartImage, pieChartImage } = await captureChartImages();

    // Generate professional PDF content
    element.innerHTML = generateProfessionalPDF(inputs, projections, toggles, lineChartImage, pieChartImage);

    // Add to DOM temporarily
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.top = '-9999px';
    document.body.appendChild(element);

    // Add professional styles
    const style = document.createElement('style');
    style.textContent = getProfessionalStyles();
    document.head.appendChild(style);

    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate PDF with enhanced options
    const pdfOptions = {
      margin: [0.75, 0.75, 0.75, 0.75],
      filename: `AFI-Franchise-Earnings-Report-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after'
      }
    };

    if (returnBlob) {
      const pdfBlob = await html2pdf().set(pdfOptions).from(element).outputPdf('blob');
      return pdfBlob;
    } else {
      await html2pdf().set(pdfOptions).from(element).save();
    }

    console.log('✅ Professional PDF exported successfully');

    // Cleanup
    document.body.removeChild(element);
    document.head.removeChild(style);

    return true;

  } catch (error) {
    console.error('❌ PDF export failed:', error);
    throw error;
  }
};

/**
 * Capture chart images for PDF inclusion
 */
const captureChartImages = async () => {
  let lineChartImage = null;
  let pieChartImage = null;

  try {
    // Capture line chart
    const lineChartCanvas = document.querySelector('.echarts-for-react canvas');
    if (lineChartCanvas) {
      lineChartImage = lineChartCanvas.toDataURL('image/png', 1.0);
    }

    // Capture pie chart
    const pieChartCanvas = document.querySelector('#revenue-pie-chart canvas');
    if (pieChartCanvas) {
      pieChartImage = pieChartCanvas.toDataURL('image/png', 1.0);
    }
  } catch (error) {
    console.warn('Could not capture chart images:', error);
  }

  return { lineChartImage, pieChartImage };
};

/**
 * Generate professional PDF HTML content
 */
const generateProfessionalPDF = (inputs, projections, toggles, lineChartImage, pieChartImage) => {
  const currentYear = projections[0];
  const totalRevenue = currentYear.grossRevenue;
  const netProfit = currentYear.netProfit;
  const units = currentYear.units;
  const revenuePerUnit = units > 0 ? totalRevenue / units : 0;

  return `
    <!-- Cover Page -->
    <div class="pdf-page cover-page">
      <div class="header-section">
        <img src="${AFI_LOGO_BASE64}" alt="AFI Logo" class="company-logo" />
        <div class="cover-title">
          <h1>Franchisor Earnings Report</h1>
          <h2>Financial Projections & Analysis</h2>
        </div>
      </div>
      
      <div class="cover-metrics">
        <div class="metric-grid">
          <div class="metric-card primary">
            <div class="metric-icon">💰</div>
            <div class="metric-content">
              <h3>Total Annual Revenue</h3>
              <p class="metric-value">${formatCurrency(totalRevenue)}</p>
              <span class="metric-label">Year 1 Projection</span>
            </div>
          </div>
          <div class="metric-card secondary">
            <div class="metric-icon">📈</div>
            <div class="metric-content">
              <h3>Revenue Per Unit</h3>
              <p class="metric-value">${formatCurrency(revenuePerUnit)}</p>
              <span class="metric-label">Annual Average</span>
            </div>
          </div>
          ${toggles.includeCosts ? `
          <div class="metric-card success">
            <div class="metric-icon">💵</div>
            <div class="metric-content">
              <h3>Net Profit</h3>
              <p class="metric-value">${formatCurrency(netProfit)}</p>
              <span class="metric-label">${((netProfit / totalRevenue) * 100).toFixed(1)}% Margin</span>
            </div>
          </div>
          ` : ''}
          <div class="metric-card info">
            <div class="metric-icon">🏢</div>
            <div class="metric-content">
              <h3>Franchise Units</h3>
              <p class="metric-value">${units.toLocaleString()}</p>
              <span class="metric-label">Current Network</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="cover-footer">
        <p class="report-date">Generated on ${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
        <p class="confidential">CONFIDENTIAL BUSINESS ANALYSIS</p>
      </div>
    </div>

    <!-- Executive Summary -->
    <div class="pdf-page page-break-before">
      <div class="page-header">
        <h1>Executive Summary</h1>
        <div class="header-line"></div>
      </div>
      
      <div class="summary-content">
        <div class="summary-section">
          <h3>Financial Overview</h3>
          <p>This comprehensive analysis projects the financial performance of your franchise operation over a ${inputs.projectionYears}-year period. Based on your current network of ${units} units and planned growth strategy, the projections indicate strong revenue potential.</p>
        </div>
        
        <div class="key-findings">
          <h3>Key Findings</h3>
          <ul class="findings-list">
            <li><strong>Total Projected Revenue:</strong> ${formatCurrency(projections.reduce((sum, year) => sum + year.grossRevenue, 0))} over ${inputs.projectionYears} years</li>
            <li><strong>Average Annual Growth:</strong> ${calculateAverageGrowth(projections)}% revenue increase</li>
            <li><strong>Revenue Diversification:</strong> ${getRevenueStreams(currentYear, toggles).length} active revenue streams</li>
            ${toggles.includeCosts ? `<li><strong>Profitability:</strong> ${((netProfit / totalRevenue) * 100).toFixed(1)}% net profit margin in Year 1</li>` : ''}
          </ul>
        </div>
      </div>
    </div>

    <!-- Revenue Analysis -->
    <div class="pdf-page page-break-before">
      <div class="page-header">
        <h1>Revenue Stream Analysis</h1>
        <div class="header-line"></div>
      </div>
      
      <div class="revenue-analysis">
        ${pieChartImage ? `
        <div class="chart-container">
          <h3>Revenue Distribution - Year 1</h3>
          <img src="${pieChartImage}" alt="Revenue Distribution Chart" class="chart-image" />
        </div>
        ` : ''}
        
        <div class="revenue-breakdown">
          <h3>Detailed Revenue Breakdown</h3>
          ${generateRevenueTable(currentYear, toggles)}
        </div>
      </div>
    </div>

    <!-- Financial Projections -->
    <div class="pdf-page page-break-before">
      <div class="page-header">
        <h1>Financial Projections</h1>
        <div class="header-line"></div>
      </div>
      
      <div class="projections-content">
        ${lineChartImage ? `
        <div class="chart-container">
          <h3>Revenue Growth Trajectory</h3>
          <img src="${lineChartImage}" alt="Revenue Growth Chart" class="chart-image" />
        </div>
        ` : ''}
        
        <div class="projections-table">
          <h3>${inputs.projectionYears}-Year Financial Forecast</h3>
          ${generateProjectionsTable(projections, toggles)}
        </div>
      </div>
    </div>

    <!-- Input Parameters -->
    <div class="pdf-page page-break-before">
      <div class="page-header">
        <h1>Model Parameters</h1>
        <div class="header-line"></div>
      </div>
      
      <div class="parameters-content">
        ${generateParametersSection(inputs, toggles)}
      </div>
    </div>

    <!-- Footer -->
    <div class="pdf-footer">
      <div class="footer-content">
        <p><strong>© ${new Date().getFullYear()} Accurate Franchising Inc.</strong> | Professional Franchise Consulting</p>
        <p>This report is confidential and prepared exclusively for franchise planning purposes.</p>
      </div>
    </div>
  `;
};

/**
 * Professional CSS styles for PDF
 */
const getProfessionalStyles = () => `
  .pdf-page {
    width: 8.5in;
    min-height: 11in;
    margin: 0 auto;
    padding: 0.75in;
    background: white;
    box-sizing: border-box;
    position: relative;
  }

  .cover-page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  }

  .company-logo {
    width: 200px;
    height: auto;
    margin: 0 auto 30px;
  }

  .cover-title h1 {
    font-size: 36px;
    color: #1a2c43;
    margin: 0 0 10px;
    font-weight: 700;
  }

  .cover-title h2 {
    font-size: 24px;
    color: #6c757d;
    margin: 0 0 40px;
    font-weight: 400;
  }

  .metric-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin: 40px 0;
  }

  .metric-card {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .metric-card.primary { border-left: 5px solid #1a2c43; }
  .metric-card.secondary { border-left: 5px solid #c0392b; }
  .metric-card.success { border-left: 5px solid #28a745; }
  .metric-card.info { border-left: 5px solid #17a2b8; }

  .metric-icon {
    font-size: 32px;
    width: 50px;
    text-align: center;
  }

  .metric-content h3 {
    font-size: 14px;
    color: #6c757d;
    margin: 0 0 8px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .metric-value {
    font-size: 24px;
    font-weight: 700;
    color: #1a2c43;
    margin: 0 0 5px;
  }

  .metric-label {
    font-size: 12px;
    color: #6c757d;
  }

  .cover-footer {
    margin-top: 40px;
  }

  .report-date {
    font-size: 16px;
    color: #1a2c43;
    margin: 0 0 10px;
    font-weight: 600;
  }

  .confidential {
    font-size: 12px;
    color: #c0392b;
    margin: 0;
    font-weight: 600;
    letter-spacing: 1px;
  }

  .page-header {
    margin-bottom: 30px;
  }

  .page-header h1 {
    font-size: 28px;
    color: #1a2c43;
    margin: 0 0 15px;
    font-weight: 700;
  }

  .header-line {
    height: 3px;
    background: linear-gradient(to right, #1a2c43, #c0392b);
    border-radius: 2px;
  }

  .summary-content, .revenue-analysis, .projections-content, .parameters-content {
    line-height: 1.7;
  }

  .summary-section, .key-findings {
    margin-bottom: 25px;
  }

  .summary-section h3, .key-findings h3 {
    font-size: 18px;
    color: #1a2c43;
    margin: 0 0 15px;
    font-weight: 600;
  }

  .findings-list {
    list-style: none;
    padding: 0;
  }

  .findings-list li {
    padding: 8px 0;
    border-bottom: 1px solid #e9ecef;
  }

  .findings-list li:last-child {
    border-bottom: none;
  }

  .chart-container {
    margin: 20px 0;
    text-align: center;
  }

  .chart-container h3 {
    font-size: 16px;
    color: #1a2c43;
    margin: 0 0 15px;
    font-weight: 600;
  }

  .chart-image {
    max-width: 100%;
    height: auto;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .professional-table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 11px;
  }

  .professional-table th {
    background: #1a2c43;
    color: white;
    padding: 12px 8px;
    text-align: left;
    font-weight: 600;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .professional-table td {
    padding: 10px 8px;
    border-bottom: 1px solid #e9ecef;
  }

  .professional-table tbody tr:nth-child(even) {
    background: #f8f9fa;
  }

  .professional-table tbody tr:hover {
    background: #e9ecef;
  }

  .parameters-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin: 20px 0;
  }

  .parameter-section {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #1a2c43;
  }

  .parameter-section h4 {
    font-size: 16px;
    color: #1a2c43;
    margin: 0 0 15px;
    font-weight: 600;
  }

  .parameter-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .parameter-list li {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px solid #e9ecef;
  }

  .parameter-list li:last-child {
    border-bottom: none;
  }

  .parameter-list .label {
    font-weight: 500;
    color: #495057;
  }

  .parameter-list .value {
    font-weight: 600;
    color: #1a2c43;
  }

  .pdf-footer {
    position: fixed;
    bottom: 0.5in;
    left: 0.75in;
    right: 0.75in;
    text-align: center;
    font-size: 10px;
    color: #6c757d;
    border-top: 1px solid #e9ecef;
    padding-top: 10px;
  }

  .page-break-before {
    page-break-before: always;
  }

  .page-break-after {
    page-break-after: always;
  }

  @media print {
    .pdf-page {
      page-break-after: always;
    }
    
    .pdf-page:last-child {
      page-break-after: avoid;
    }
  }
`;

/**
 * Helper functions
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const calculateAverageGrowth = (projections) => {
  if (projections.length < 2) return 0;
  const firstYear = projections[0].grossRevenue;
  const lastYear = projections[projections.length - 1].grossRevenue;
  // Fixed syntax error in the line below
  return ((Math.pow(lastYear / firstYear, 1 / (projections.length - 1)) - 1) * 100).toFixed(1);
};

const getRevenueStreams = (currentYear, toggles) => {
  const streams = [
    { name: 'Royalty Income', amount: currentYear.royaltyIncome },
    { name: 'Initial Franchise Fees', amount: currentYear.initialFees },
    { name: 'Renewal Fees', amount: currentYear.renewalFees },
    { name: 'Training Fees', amount: currentYear.trainingIncome + currentYear.trainingRecurringIncome },
    { name: 'Technology Fees', amount: currentYear.techIncome },
    { name: 'Admin/Support Fees', amount: currentYear.supportIncome },
    { name: 'Transfer Fees', amount: currentYear.transferIncome },
  ];

  if (toggles.supplyChain) {
    streams.push({ name: 'Supply Chain Margin', amount: currentYear.supplyChainIncome });
  }

  if (toggles.marketingIncome) {
    streams.push({ name: 'Marketing Levy Income', amount: currentYear.marketingIncome });
  }

  if (toggles.masterFranchise) {
    streams.push({ name: 'Master Franchise Fees', amount: currentYear.masterFranchiseFees });
    streams.push({ name: 'Master Override Income', amount: currentYear.masterOverrideIncome });
  }

  return streams.filter(stream => stream.amount > 0);
};

const generateRevenueTable = (currentYear, toggles) => {
  const streams = getRevenueStreams(currentYear, toggles);
  const total = currentYear.grossRevenue;

  let tableHTML = `
    <table class="professional-table">
      <thead>
        <tr>
          <th>Revenue Stream</th>
          <th style="text-align: right;">Amount</th>
          <th style="text-align: center;">% of Total</th>
        </tr>
      </thead>
      <tbody>
  `;

  streams.forEach(stream => {
    const percentage = ((stream.amount / total) * 100).toFixed(1);
    tableHTML += `
      <tr>
        <td>${stream.name}</td>
        <td style="text-align: right; font-weight: 600;">${formatCurrency(stream.amount)}</td>
        <td style="text-align: center;">${percentage}%</td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  return tableHTML;
};

const generateProjectionsTable = (projections, toggles) => {
  let tableHTML = `
    <table class="professional-table">
      <thead>
        <tr>
          <th>Year</th>
          <th style="text-align: right;">Units</th>
          <th style="text-align: right;">Revenue</th>
          ${toggles.includeCosts ? '<th style="text-align: right;">Costs</th>' : ''}
          ${toggles.includeCosts ? '<th style="text-align: right;">Net Profit</th>' : ''}
          <th style="text-align: right;">Revenue/Unit</th>
        </tr>
      </thead>
      <tbody>
  `;

  projections.forEach((year, index) => {
    const revPerUnit = year.units > 0 ? year.grossRevenue / year.units : 0;
    tableHTML += `
      <tr>
        <td style="font-weight: 600;">Year ${index + 1}</td>
        <td style="text-align: right;">${Math.round(year.units).toLocaleString()}</td>
        <td style="text-align: right; font-weight: 600;">${formatCurrency(year.grossRevenue)}</td>
        ${toggles.includeCosts ? `<td style="text-align: right;">${formatCurrency(year.totalCosts)}</td>` : ''}
        ${toggles.includeCosts ? `<td style="text-align: right; font-weight: 600; color: ${year.netProfit >= 0 ? '#28a745' : '#c0392b'};">${formatCurrency(year.netProfit)}</td>` : ''}
        <td style="text-align: right;">${formatCurrency(revPerUnit)}</td>
      </tr>
    `;
  });

  tableHTML += `
      </tbody>
    </table>
  `;

  return tableHTML;
};

const generateParametersSection = (inputs, toggles) => {
  return `
    <div class="parameters-grid">
      <div class="parameter-section">
        <h4>Network Profile</h4>
        <ul class="parameter-list">
          <li><span class="label">Current Units:</span> <span class="value">${inputs.units}</span></li>
          <li><span class="label">New Units/Year:</span> <span class="value">${inputs.newUnitsPerYear}</span></li>
          <li><span class="label">Growth Rate:</span> <span class="value">${inputs.growthRate}%</span></li>
          <li><span class="label">Churn Rate:</span> <span class="value">${inputs.churnRate}%</span></li>
          <li><span class="label">Franchise Term:</span> <span class="value">${inputs.termYears} years</span></li>
        </ul>
      </div>
      
      <div class="parameter-section">
        <h4>Financial Structure</h4>
        <ul class="parameter-list">
          <li><span class="label">Avg. Sales/Unit:</span> <span class="value">${formatCurrency(inputs.avgSales)}</span></li>
          <li><span class="label">Royalty Rate:</span> <span class="value">${inputs.royaltyPct}%</span></li>
          <li><span class="label">Marketing Levy:</span> <span class="value">${inputs.marketingPct}%</span></li>
          <li><span class="label">Franchise Fee:</span> <span class="value">${formatCurrency(inputs.franchiseFee)}</span></li>
          <li><span class="label">Tech Fee:</span> <span class="value">${formatCurrency(inputs.techFee)}/mo</span></li>
        </ul>
      </div>
      
      ${toggles.supplyChain ? `
      <div class="parameter-section">
        <h4>Supply Chain</h4>
        <ul class="parameter-list">
          <li><span class="label">Annual Spend/Unit:</span> <span class="value">${formatCurrency(inputs.supplySpend)}</span></li>
          <li><span class="label">Margin:</span> <span class="value">${inputs.supplyMarginPct}%</span></li>
        </ul>
      </div>
      ` : ''}
      
      ${toggles.includeCosts ? `
      <div class="parameter-section">
        <h4>Operating Costs</h4>
        <ul class="parameter-list">
          <li><span class="label">Staff Costs:</span> <span class="value">${formatCurrency(inputs.costStaff)}/yr</span></li>
          <li><span class="label">Recruitment:</span> <span class="value">${formatCurrency(inputs.costRecruitment)}/unit</span></li>
          <li><span class="label">Legal/Compliance:</span> <span class="value">${formatCurrency(inputs.costLegal)}/yr</span></li>
        </ul>
      </div>
      ` : ''}
    </div>
  `;
};
import html2pdf from 'html2pdf.js';
import { formatCurrency, formatNumber, formatDate } from './formatters';

/**
 * Exports calculator data to a PDF file
 * 
 * @param {Object} inputs - User input values
 * @param {Array} projections - Calculated projection data
 * @param {Object} toggles - Feature toggle settings
 * @param {boolean} returnBlob - Whether to return the blob instead of triggering download
 * @returns {Promise<Blob|void>} - Returns the PDF blob if returnBlob is true
 */
export const exportToPdf = async (inputs, projections, toggles, returnBlob = false) => {
  try {
    // Create a temporary container for the PDF content
    const container = document.createElement('div');
    container.className = 'pdf-export-container';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '8.27in'; // A4 width
    container.style.opacity = '1';
    container.style.visibility = 'visible';
    container.style.display = 'block';
    document.body.appendChild(container);
    
    // Generate and add PDF content
    container.innerHTML = generatePdfContent(inputs, projections, toggles);
    
    // Create an array to track image loading promises
    const imageLoadPromises = [];
    
    // Find all images in the container and create promises for their loading
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      if (!img.complete) {
        const promise = new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve; // Resolve even on error to prevent hanging
        });
        imageLoadPromises.push(promise);
      }
    });
    
    // Wait for all images to load
    await Promise.all(imageLoadPromises);
    
    // Wait for browser to render the content
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Configure PDF options
    const options = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `franchisor_earnings_report_${formatDate(new Date())}.pdf`,
      image: { 
        type: 'jpeg', 
        quality: 1.0 
      },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after'
      }
    };
    
    console.log('Generating PDF with content size:', container.offsetHeight);
    
    // Generate PDF
    const pdf = await html2pdf()
      .from(container)
      .set(options)
      .toPdf()
      .get('pdf')
      .then(pdf => {
        console.log('PDF generated successfully with', pdf.getNumberOfPages(), 'pages');
        return pdf;
      })
      .outputPdf('blob');
    
    // Clean up the temporary container
    document.body.removeChild(container);
    
    if (returnBlob) {
      return pdf;
    } else {
      // Create download link and trigger download
      const url = URL.createObjectURL(pdf);
      const link = document.createElement('a');
      link.href = url;
      link.download = options.filename;
      document.body.appendChild(link);
      
      // Use a timeout to ensure the link is in the DOM
      setTimeout(() => {
        link.click();
        
        // Clean up
        setTimeout(() => {
          URL.revokeObjectURL(url);
          document.body.removeChild(link);
        }, 100);
      }, 0);
    }
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error(`PDF export failed: ${error.message}`);
  }
};

/**
 * Generates the HTML content for the PDF export
 * 
 * @param {Object} inputs - User input values
 * @param {Array} projections - Calculated projection data
 * @param {Object} toggles - Feature toggle settings
 * @returns {string} - HTML content for PDF
 */
const generatePdfContent = (inputs, projections, toggles) => {
  const currentYear = projections[0];
  const totalRevenue = currentYear.grossRevenue;
  const netProfit = currentYear.netProfit;
  
  // Calculate revenue streams for pie chart data
  const revenueStreams = [
    { title: 'Royalty Income', amount: currentYear.royaltyIncome },
    { title: 'Initial Franchise Fees', amount: currentYear.initialFees },
    { title: 'Renewal Fees', amount: currentYear.renewalFees },
    { title: 'Training Fees', amount: currentYear.trainingIncome + currentYear.trainingRecurringIncome },
    { title: 'Technology Fees', amount: currentYear.techIncome },
    { title: 'Admin/Support Fees', amount: currentYear.supportIncome },
    { title: 'Transfer Fees', amount: currentYear.transferIncome },
  ];

  if (toggles.supplyChain) {
    revenueStreams.push({ title: 'Supply Chain Margin', amount: currentYear.supplyChainIncome });
  }

  if (toggles.marketingIncome) {
    revenueStreams.push({ title: 'Marketing Levy Income', amount: currentYear.marketingIncome });
  }

  if (toggles.masterFranchise) {
    revenueStreams.push({ title: 'Master Franchise Fees', amount: currentYear.masterFranchiseFees });
    revenueStreams.push({ title: 'Master Override Income', amount: currentYear.masterOverrideIncome });
  }

  return `
    <div class="pdf-container" style="font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.5; max-width: 100%; width: 100%;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0;">
        <img 
          src="https://app1.sharemyimage.com/2025/07/07/Accurate-Franchising-Logo-1.webp" 
          alt="Accurate Franchising Inc. Logo" 
          style="max-width: 200px; height: auto; margin-bottom: 10px;"
          crossorigin="anonymous"
        />
        <h1 style="color: #1a2c43; font-size: 24px; margin: 10px 0;">Franchisor Earnings Report</h1>
        <p style="color: #6c757d; font-size: 14px;">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <!-- Key Metrics -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1a2c43; font-size: 18px; border-bottom: 2px solid #1a2c43; padding-bottom: 5px; margin-bottom: 15px;">KEY METRICS</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: space-between;">
          <div style="flex: 1; min-width: 200px; background-color: #f8f9fa; padding: 15px; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <p style="font-size: 14px; color: #6c757d; margin-bottom: 5px;">TOTAL ANNUAL REVENUE</p>
            <p style="font-size: 18px; font-weight: bold; color: #1a2c43; margin: 0;">${formatCurrency(totalRevenue)}</p>
          </div>
          <div style="flex: 1; min-width: 200px; background-color: #f8f9fa; padding: 15px; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <p style="font-size: 14px; color: #6c757d; margin-bottom: 5px;">REVENUE PER UNIT</p>
            <p style="font-size: 18px; font-weight: bold; color: #1a2c43; margin: 0;">${formatCurrency(totalRevenue / currentYear.units)}</p>
          </div>
          ${toggles.includeCosts ? `
          <div style="flex: 1; min-width: 200px; background-color: #f8f9fa; padding: 15px; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <p style="font-size: 14px; color: #6c757d; margin-bottom: 5px;">NET PROFIT</p>
            <p style="font-size: 18px; font-weight: bold; color: #1a2c43; margin: 0;">${formatCurrency(netProfit)}</p>
          </div>
          ` : ''}
        </div>
      </div>
      
      <!-- Inputs Summary -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1a2c43; font-size: 18px; border-bottom: 2px solid #1a2c43; padding-bottom: 5px; margin-bottom: 15px;">FRANCHISE NETWORK PROFILE</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
          <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
            <p style="font-size: 12px; color: #6c757d; margin-bottom: 3px;">Current Franchise Units</p>
            <p style="font-size: 16px; font-weight: bold; color: #1a2c43; margin: 0;">${formatNumber(inputs.units)}</p>
          </div>
          <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
            <p style="font-size: 12px; color: #6c757d; margin-bottom: 3px;">New Units Per Year</p>
            <p style="font-size: 16px; font-weight: bold; color: #1a2c43; margin: 0;">${formatNumber(inputs.newUnitsPerYear)}</p>
          </div>
          <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
            <p style="font-size: 12px; color: #6c757d; margin-bottom: 3px;">Average Franchise Term</p>
            <p style="font-size: 16px; font-weight: bold; color: #1a2c43; margin: 0;">${inputs.termYears} years</p>
          </div>
          <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
            <p style="font-size: 12px; color: #6c757d; margin-bottom: 3px;">Growth Rate</p>
            <p style="font-size: 16px; font-weight: bold; color: #1a2c43; margin: 0;">${inputs.growthRate}%</p>
          </div>
          <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
            <p style="font-size: 12px; color: #6c757d; margin-bottom: 3px;">Churn Rate</p>
            <p style="font-size: 16px; font-weight: bold; color: #1a2c43; margin: 0;">${inputs.churnRate}%</p>
          </div>
          <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
            <p style="font-size: 12px; color: #6c757d; margin-bottom: 3px;">Projection Duration</p>
            <p style="font-size: 16px; font-weight: bold; color: #1a2c43; margin: 0;">${inputs.projectionYears} years</p>
          </div>
        </div>
      </div>
      
      <!-- Financial Inputs -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1a2c43; font-size: 18px; border-bottom: 2px solid #1a2c43; padding-bottom: 5px; margin-bottom: 15px;">FINANCIAL INPUTS</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
          <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
            <p style="font-size: 12px; color: #6c757d; margin-bottom: 3px;">Average Gross Sales per Unit</p>
            <p style="font-size: 16px; font-weight: bold; color: #1a2c43; margin: 0;">${formatCurrency(inputs.avgSales)}</p>
          </div>
          <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
            <p style="font-size: 12px; color: #6c757d; margin-bottom: 3px;">Royalty Percentage</p>
            <p style="font-size: 16px; font-weight: bold; color: #1a2c43; margin: 0;">${inputs.royaltyPct}%</p>
          </div>
          <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
            <p style="font-size: 12px; color: #6c757d; margin-bottom: 3px;">Marketing Levy</p>
            <p style="font-size: 16px; font-weight: bold; color: #1a2c43; margin: 0;">${inputs.marketingPct}%</p>
          </div>
          <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
            <p style="font-size: 12px; color: #6c757d; margin-bottom: 3px;">Initial Franchise Fee</p>
            <p style="font-size: 16px; font-weight: bold; color: #1a2c43; margin: 0;">${formatCurrency(inputs.franchiseFee)}</p>
          </div>
        </div>
      </div>
      
      <!-- Page Break -->
      <div class="page-break-after" style="page-break-after: always;"></div>
      
      <!-- Revenue Streams Breakdown -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1a2c43; font-size: 18px; border-bottom: 2px solid #1a2c43; padding-bottom: 5px; margin-bottom: 15px;">REVENUE BREAKDOWN - YEAR 1</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
          ${revenueStreams.map(stream => `
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 10px; border-left: 4px solid #1a2c43;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <p style="font-size: 14px; font-weight: 500; color: #1a2c43; margin: 0;">${stream.title}</p>
                <span style="font-size: 12px; color: #c0392b; font-weight: 600;">${((stream.amount / totalRevenue) * 100).toFixed(1)}%</span>
              </div>
              <p style="font-size: 16px; font-weight: bold; color: #1a2c43; margin: 0;">${formatCurrency(stream.amount)}</p>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Projections Table -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1a2c43; font-size: 18px; border-bottom: 2px solid #1a2c43; padding-bottom: 5px; margin-bottom: 15px;">${inputs.projectionYears}-YEAR FINANCIAL PROJECTIONS</h2>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="background-color: #1a2c43; color: white;">
                <th style="padding: 10px; text-align: left; font-weight: 600;">Year</th>
                <th style="padding: 10px; text-align: left; font-weight: 600;">Units</th>
                <th style="padding: 10px; text-align: left; font-weight: 600;">Gross Revenue</th>
                ${toggles.includeCosts ? `<th style="padding: 10px; text-align: left; font-weight: 600;">Total Costs</th>` : ''}
                ${toggles.includeCosts ? `<th style="padding: 10px; text-align: left; font-weight: 600;">Net Profit</th>` : ''}
                <th style="padding: 10px; text-align: left; font-weight: 600;">Revenue/Unit</th>
              </tr>
            </thead>
            <tbody>
              ${projections.map((year, index) => `
                <tr style="background-color: ${index % 2 === 0 ? 'white' : '#f8f9fa'}; border-bottom: 1px solid #e0e0e0;">
                  <td style="padding: 10px; font-weight: 600; color: #1a2c43;">Year ${index + 1}</td>
                  <td style="padding: 10px;">${formatNumber(year.units)}</td>
                  <td style="padding: 10px; font-weight: 500; color: #1a2c43;">${formatCurrency(year.grossRevenue)}</td>
                  ${toggles.includeCosts ? `<td style="padding: 10px;">${formatCurrency(year.totalCosts)}</td>` : ''}
                  ${toggles.includeCosts ? `<td style="padding: 10px; color: ${year.netProfit >= 0 ? '#2ecc71' : '#c0392b'}; font-weight: 500;">${formatCurrency(year.netProfit)}</td>` : ''}
                  <td style="padding: 10px;">${formatCurrency(year.grossRevenue / year.units)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Summary -->
      <div style="margin-top: 30px;">
        <h2 style="color: #1a2c43; font-size: 18px; border-bottom: 2px solid #1a2c43; padding-bottom: 5px; margin-bottom: 15px;">${inputs.projectionYears}-YEAR SUMMARY</h2>
        <div style="display: flex; gap: 15px; justify-content: space-between; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 30%; background-color: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
            <p style="font-size: 14px; color: #6c757d; text-transform: uppercase; margin-bottom: 5px;">Total Revenue</p>
            <p style="font-size: 20px; font-weight: bold; color: #1a2c43; margin: 0;">
              ${formatCurrency(projections.reduce((sum, year) => sum + year.grossRevenue, 0))}
            </p>
          </div>
          
          ${toggles.includeCosts ? `
          <div style="flex: 1; min-width: 30%; background-color: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
            <p style="font-size: 14px; color: #6c757d; text-transform: uppercase; margin-bottom: 5px;">Total Net Profit</p>
            <p style="font-size: 20px; font-weight: bold; color: #1a2c43; margin: 0;">
              ${formatCurrency(projections.reduce((sum, year) => sum + year.netProfit, 0))}
            </p>
          </div>
          ` : ''}
          
          <div style="flex: 1; min-width: 30%; background-color: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
            <p style="font-size: 14px; color: #6c757d; text-transform: uppercase; margin-bottom: 5px;">Final Year Units</p>
            <p style="font-size: 20px; font-weight: bold; color: #1a2c43; margin: 0;">
              ${formatNumber(projections[projections.length - 1].units)}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #e0e0e0; padding-top: 20px;">
        <p>© ${new Date().getFullYear()} Accurate Franchising, Inc. All rights reserved.</p>
        <p style="margin-top: 5px;">This report was generated on ${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>
    </div>
  `;
};
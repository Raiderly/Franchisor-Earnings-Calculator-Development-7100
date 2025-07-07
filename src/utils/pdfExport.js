import html2pdf from 'html2pdf.js';

/**
 * PDF Export Module for Franchise Earnings Calculator
 * Handles logo embedding, chart rendering, and PDF generation
 */

// Base64 encoded AFI logo - already embedded to avoid any external dependencies
const AFI_LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB14AAAP1CAIAAABOuNoKAAAgAElEQVR4AeydB1wUR///j6ixJL/nef7Pk2jyxChEYwc0UUNUNLFGY40FsAuIXbGXGDv2RhMFGxoLdkVFEVBBAelwDe6QdggiReoBx93N/9kbHderC3fgoV9e9+I1Ozs7O9/3zM7Mfva7s6yvv/7a0cEOfkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEg8JEQ+Prrr1lff/21SMiHHxAA';

/**
 * Ensures all images are loaded before PDF generation
 * @param {HTMLElement} container - The container element
 * @returns {Promise} - Resolves when all images are loaded
 */
const ensureImagesLoaded = (container) => {
  const images = container.querySelectorAll('img');
  return Promise.all(
    Array.from(images).map(
      (img) => new Promise((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = resolve;
          img.onerror = resolve;
          // Fallback timeout
          setTimeout(resolve, 2000);
        }
      })
    )
  );
};

/**
 * Converts chart canvas to image for PDF rendering
 * @param {HTMLCanvasElement} canvas - The canvas element to convert
 * @returns {HTMLImageElement} - The image element created from canvas
 */
const convertChartToImage = (canvas) => {
  try {
    const chartImage = canvas.toDataURL('image/png', 1.0);
    const img = document.createElement('img');
    img.src = chartImage;
    img.style.cssText = `
      max-width: 100%;
      height: auto;
      display: block;
      margin: 20px auto;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
    return img;
  } catch (error) {
    console.error('Failed to convert chart to image:', error);
    return null;
  }
};

/**
 * Main PDF export function
 * @param {Object} options - Custom options for PDF generation
 * @returns {Promise} - Resolves when PDF is generated
 */
export const exportPDF = async (options = {}) => {
  try {
    console.log('🚀 Starting PDF export process...');
    
    // Get container element
    const container = document.getElementById('pdf-content');
    if (!container) {
      throw new Error('PDF content container not found');
    }
    
    // Setup: Inject logo if not already present
    const logoContainer = document.getElementById('afi-logo');
    if (logoContainer && !logoContainer.innerHTML.trim()) {
      console.log('🖼️ Injecting AFI logo...');
      logoContainer.innerHTML = `<img src="${AFI_LOGO_BASE64}" alt="Accurate Franchising Inc. Logo" style="width: 140px; margin-bottom: 20px;" />`;
    }
    
    // Setup: Convert chart to image if exists
    const chartCanvas = document.getElementById('revenueChart');
    const chartContainer = document.getElementById('chartImageContainer');
    
    if (chartCanvas && chartContainer) {
      console.log('📊 Converting chart to image...');
      // Wait a moment for chart to fully render
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const chartImg = convertChartToImage(chartCanvas);
      if (chartImg) {
        // Clear container first
        chartContainer.innerHTML = '';
        chartContainer.appendChild(chartImg);
        
        // Hide original canvas
        chartCanvas.style.display = 'none';
      }
    }
    
    // Wait for DOM to settle and images to load
    console.log('⏳ Waiting for content to settle...');
    await new Promise(resolve => setTimeout(resolve, 800));
    await ensureImagesLoaded(container);
    
    // PDF generation options
    const pdfOptions = {
      margin: 0.5,
      filename: options.filename || 'AFI-Franchise-Earnings.pdf',
      image: { 
        type: 'jpeg', 
        quality: 0.98 
      },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      ...options
    };
    
    console.log('📄 Generating PDF...');
    
    // Generate PDF
    await html2pdf().set(pdfOptions).from(container).save();
    
    console.log('✅ PDF generated successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ PDF export failed:', error);
    throw new Error(`PDF export failed: ${error.message}`);
  }
};

/**
 * Enhanced PDF export with metrics and revenue streams
 * @param {Object} metrics - Key metrics for the report
 * @param {Array} revenueStreams - Revenue streams data
 * @returns {Promise} - Resolves when PDF is generated
 */
export const exportPDFWithData = async (metrics, revenueStreams) => {
  try {
    // Create temporary container
    const element = document.createElement('div');
    element.id = 'pdf-content';
    element.style.cssText = `
      font-family: Arial, sans-serif;
      padding: 40px;
      background: white;
      color: #333;
      line-height: 1.6;
    `;
    
    // Get chart image if available
    let chartImageHTML = '';
    const canvas = document.getElementById('revenueChart');
    if (canvas) {
      try {
        const chartImage = canvas.toDataURL('image/png', 1.0);
        chartImageHTML = `
          <h2 style="color: #1a2c43; margin-bottom: 20px;">Revenue Breakdown</h2>
          <div style="text-align: center; margin: 20px 0;">
            <img src="${chartImage}" style="max-width: 100%; height: auto;" />
          </div>
        `;
      } catch (e) {
        console.warn('Could not convert chart to image:', e);
      }
    }
    
    // Generate revenue streams table rows
    const revenueStreamRows = revenueStreams
      ? revenueStreams.map(stream => `
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd;">${stream.label}</td>
            <td style="padding: 12px; border: 1px solid #ddd; text-align: right;">$${stream.amount.toLocaleString()}</td>
            <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${stream.percent}%</td>
          </tr>
        `).join('')
      : '';
    
    // Generate HTML content
    element.innerHTML = `
      <div id="afi-logo" style="text-align: center; margin-bottom: 30px;">
        <img src="${AFI_LOGO_BASE64}" alt="AFI Logo" style="width: 140px; margin-bottom: 24px;" />
        <h1 style="color: #1a2c43; font-size: 28px; margin: 0;">Franchisor Earnings Report</h1>
        <p style="color: #6c757d; margin: 10px 0;">Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      
      <h2 style="color: #1a2c43; margin-bottom: 20px;">Key Metrics</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr><td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Total Revenue</td><td style="padding: 12px; border: 1px solid #ddd;">$${metrics.totalRevenue.toLocaleString()}</td></tr>
        <tr><td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Net Profit</td><td style="padding: 12px; border: 1px solid #ddd;">$${metrics.netProfit.toLocaleString()}</td></tr>
        <tr><td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Units</td><td style="padding: 12px; border: 1px solid #ddd;">${metrics.units}</td></tr>
        <tr><td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Revenue per Unit</td><td style="padding: 12px; border: 1px solid #ddd;">$${metrics.revenuePerUnit.toLocaleString()}</td></tr>
      </table>
      
      ${revenueStreams ? `
        <h2 style="color: #1a2c43; margin-bottom: 20px;">Revenue Streams</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #1a2c43; color: white;">
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Stream</th>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: right;">Amount</th>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">%</th>
            </tr>
          </thead>
          <tbody>
            ${revenueStreamRows}
          </tbody>
        </table>
      ` : ''}
      
      ${chartImageHTML}
      
      <div style="margin-top: 50px; text-align: center; padding-top: 20px; border-top: 2px solid #e9ecef;">
        <p style="color: #6c757d; font-size: 12px; margin: 0; line-height: 1.4;">
          <strong>© ${new Date().getFullYear()} Accurate Franchising Inc. All rights reserved.</strong><br>
          This report was generated using the Franchisor Earnings Calculator<br>
          For questions about this report, contact the Accurate Franchising team.
        </p>
      </div>
    `;
    
    // Temporarily add to DOM
    document.body.appendChild(element);
    
    // Wait for content to settle
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Generate PDF
    await exportPDF({
      filename: 'AFI-Franchise-Earnings.pdf'
    });
    
    // Clean up
    document.body.removeChild(element);
    
  } catch (error) {
    console.error('PDF export with data failed:', error);
    throw error;
  }
};

/**
 * Exports PDF with data from the current calculator state
 * @param {Object} inputs - Calculator inputs
 * @param {Array} projections - Projection data
 * @param {Object} toggles - Feature toggles
 * @returns {Promise<Blob|undefined>} - PDF blob or undefined if not returning blob
 */
export const exportToPdf = async (inputs, projections, toggles, returnBlob = false) => {
  try {
    // Get the first year projection
    const currentYear = projections?.[0] || {};
    const totalRevenue = currentYear.grossRevenue || 0;
    
    // Create metrics object
    const metrics = {
      totalRevenue,
      netProfit: currentYear.netProfit || 0,
      units: currentYear.units || 0,
      revenuePerUnit: currentYear.units ? totalRevenue / currentYear.units : 0
    };
    
    // Create revenue streams array
    const revenueStreams = [
      { 
        label: 'Royalty Income', 
        amount: currentYear.royaltyIncome || 0, 
        percent: totalRevenue ? ((currentYear.royaltyIncome || 0) / totalRevenue * 100).toFixed(1) : 0 
      },
      { 
        label: 'Initial Franchise Fees', 
        amount: currentYear.initialFees || 0, 
        percent: totalRevenue ? ((currentYear.initialFees || 0) / totalRevenue * 100).toFixed(1) : 0 
      },
      // Add other revenue streams as needed
    ];
    
    // If returning blob, use a different approach
    if (returnBlob) {
      // Implementation for returning blob
      console.log('Returning PDF as blob - not implemented yet');
      return new Blob(['PDF data'], { type: 'application/pdf' });
    } else {
      // Export PDF with data
      await exportPDFWithData(metrics, revenueStreams);
      return undefined;
    }
    
  } catch (error) {
    console.error('Failed to export PDF:', error);
    throw error;
  }
};
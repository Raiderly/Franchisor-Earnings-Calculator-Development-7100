import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { exportToPdf } from '../../utils/pdfExport';
import { exportToCsv } from '../../utils/csvExport';
import { formatDate } from '../../utils/formatters';

const { FiDownload, FiFilePlus, FiFileText, FiMail, FiPrinter, FiEye } = FiIcons;

const ExportOptions = ({ inputs, projections, toggles, openEmailModal }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handlePdfExport = async () => {
    setIsExporting(true);
    setExportError(null);
    
    try {
      // Ensure all data is available
      if (!projections || projections.length === 0) {
        throw new Error('Projection data is not available');
      }
      
      console.log('Starting PDF export process...');
      await exportToPdf(inputs, projections, toggles);
      console.log('PDF export completed successfully');
      setIsExporting(false);
    } catch (error) {
      console.error('PDF export failed:', error);
      setExportError('PDF export failed. Try email delivery instead.');
      setIsExporting(false);
    }
  };

  const handleCsvExport = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      await exportToCsv(inputs, projections, toggles);
      setIsExporting(false);
    } catch (error) {
      console.error('CSV export failed:', error);
      setExportError('CSV export failed. Try another option.');
      setIsExporting(false);
    }
  };

  const handlePrintView = () => {
    window.print();
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative print:hidden">
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 overflow-auto" onClick={togglePreview}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#1a2c43]">Export Preview</h3>
              <button onClick={togglePreview} className="text-gray-500 hover:text-gray-700">
                <SafeIcon icon={FiIcons.FiX} className="w-6 h-6" />
              </button>
            </div>
            <div className="preview-content" dangerouslySetInnerHTML={{ 
              __html: `
                <div style="font-family: 'Montserrat', sans-serif;">
                  <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px solid #e0e0e0; padding-bottom: 20px;">
                    <img src="https://app1.sharemyimage.com/2025/07/07/Accurate-Franchising-Logo-1.webp" style="max-width: 200px; margin: 0 auto;" />
                    <h1 style="color: #1a2c43; font-size: 24px; margin: 10px 0;">Franchisor Earnings Report</h1>
                    <p style="color: #6c757d; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
                  </div>
                  <div style="text-align: center; color: #1a2c43; padding: 30px 0;">
                    <p style="font-size: 16px; margin-bottom: 15px;">Your report will include:</p>
                    <ul style="list-style: none; padding: 0; margin: 0 auto; max-width: 400px; text-align: left;">
                      <li style="padding: 8px 0; border-bottom: 1px solid #eee;">✓ Complete financial projections</li>
                      <li style="padding: 8px 0; border-bottom: 1px solid #eee;">✓ Revenue breakdown by stream</li>
                      <li style="padding: 8px 0; border-bottom: 1px solid #eee;">✓ ${projections.length}-year financial forecast</li>
                      <li style="padding: 8px 0; border-bottom: 1px solid #eee;">✓ Unit growth projections</li>
                      <li style="padding: 8px 0;">✓ All input parameters</li>
                    </ul>
                    <div style="margin-top: 30px;">
                      <button 
                        style="background-color: #c0392b; color: white; border: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; cursor: pointer;"
                        onclick="document.querySelector('.preview-content').parentNode.parentNode.parentNode.click()"
                      >
                        Close Preview
                      </button>
                    </div>
                  </div>
                </div>
              `
            }} />
            <div className="flex justify-center mt-4 space-x-4">
              <button 
                onClick={handlePdfExport}
                className="afi-btn flex items-center"
              >
                <SafeIcon icon={FiDownload} className="mr-2" />
                Download PDF
              </button>
              <button 
                onClick={handleCsvExport}
                className="afi-btn bg-[#1a2c43] flex items-center"
              >
                <SafeIcon icon={FiFileText} className="mr-2" />
                Download CSV
              </button>
              <button 
                onClick={openEmailModal}
                className="afi-btn bg-gray-600 flex items-center"
              >
                <SafeIcon icon={FiMail} className="mr-2" />
                Email Report
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex space-x-2">
        <button 
          onClick={handlePdfExport}
          disabled={isExporting}
          className="afi-btn flex items-center"
        >
          {isExporting ? (
            <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <SafeIcon icon={FiDownload} className="mr-2" />
          )}
          Download Full Report as PDF
        </button>
        
        <div className="relative">
          <button 
            onClick={toggleDropdown}
            className="afi-btn bg-[#1a2c43] flex items-center"
          >
            <SafeIcon icon={FiFilePlus} className="mr-1" />
            <span className="sr-only md:not-sr-only md:inline">More Options</span>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white z-10">
              <div className="py-1">
                <button 
                  onClick={togglePreview}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <SafeIcon icon={FiEye} className="mr-2 text-[#1a2c43]" />
                  Preview Report
                </button>
                <button 
                  onClick={handleCsvExport}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <SafeIcon icon={FiFileText} className="mr-2 text-[#1a2c43]" />
                  Download as CSV
                </button>
                <button 
                  onClick={openEmailModal}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <SafeIcon icon={FiMail} className="mr-2 text-[#1a2c43]" />
                  Email Report to Me
                </button>
                <button 
                  onClick={handlePrintView}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <SafeIcon icon={FiPrinter} className="mr-2 text-[#1a2c43]" />
                  Print-Friendly View
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {exportError && (
        <div className="mt-2 text-[#c0392b] text-sm">
          {exportError} 
          <button 
            onClick={openEmailModal}
            className="ml-1 underline font-medium"
          >
            Try email delivery
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportOptions;
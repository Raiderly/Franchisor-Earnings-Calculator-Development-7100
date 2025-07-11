import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { exportToCsv } from '../../utils/csvExport';

const { FiDownload, FiFilePlus, FiFileText, FiPrinter, FiEye } = FiIcons;

const ExportOptions = ({ inputs, projections, toggles }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleCsvExport = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      await exportToCsv(inputs, projections, toggles);
      setIsExporting(false);
    } catch (error) {
      console.error('CSV export failed:', error);
      setExportError('CSV export failed. Please try another option.');
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

  // Check if we have valid data to export
  const hasValidData = projections && projections.length > 0 && inputs && inputs.units;

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
            <div className="text-center py-8">
              <div className="mb-6">
                <img 
                  src="https://app1.sharemyimage.com/2025/07/07/Accurate-Franchising-Logo-1.webp" 
                  alt="Accurate Franchising Inc." 
                  className="max-w-[200px] mx-auto mb-4" 
                />
                <h1 className="text-2xl font-bold text-[#1a2c43] mb-2">Franchisor Earnings Report</h1>
                <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-[#1a2c43] mb-4">Available export options:</h3>
                <ul className="text-left max-w-md mx-auto space-y-2">
                  <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Download as CSV spreadsheet</li>
                  <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Print-friendly view</li>
                  <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> {projections.length}-year financial forecast</li>
                  <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> All input parameters</li>
                </ul>
              </div>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={handleCsvExport}
                  disabled={!hasValidData}
                  className="afi-btn bg-[#1a2c43] flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SafeIcon icon={FiFileText} className="mr-2" />
                  Download CSV
                </button>
                <button 
                  onClick={handlePrintView}
                  className="afi-btn flex items-center"
                >
                  <SafeIcon icon={FiPrinter} className="mr-2" />
                  Print View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <button 
          onClick={handleCsvExport}
          disabled={isExporting || !hasValidData}
          className="afi-btn flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <SafeIcon icon={FiDownload} className="mr-2" />
          )}
          {isExporting ? 'Exporting...' : 'Download CSV Report'}
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
                  disabled={!hasValidData}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SafeIcon icon={FiFileText} className="mr-2 text-[#1a2c43]" />
                  Download as CSV
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

      {!hasValidData && (
        <div className="mt-2 text-amber-600 text-sm">
          Please complete the calculator inputs to enable export options.
        </div>
      )}

      {exportError && (
        <div className="mt-2 text-[#c0392b] text-sm">
          {exportError}
        </div>
      )}
    </div>
  );
};

export default ExportOptions;
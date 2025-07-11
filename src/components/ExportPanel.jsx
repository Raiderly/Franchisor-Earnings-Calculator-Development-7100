import React, { useState } from "react";
import { useCalculator } from "../context/CalculatorContext";
import * as FiIcons from "react-icons/fi";
import SafeIcon from "./common/SafeIcon";
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

const ExportPanel = () => {
  const { calculatedResults, inputs } = useCalculator();
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = async () => {
    if (!calculatedResults) return;
    
    setIsExporting(true);
    
    try {
      const { projections } = calculatedResults;
      
      // Prepare data for CSV
      const csvData = [
        // Header
        ['Franchise Earnings Calculator - Export'],
        ['Generated on', new Date().toLocaleDateString()],
        [''],
        
        // Input Summary
        ['INPUT PARAMETERS'],
        ['Current Units', inputs.units],
        ['Average Sales per Unit', inputs.avgSales],
        ['Royalty Rate (%)', inputs.royaltyRate],
        ['Growth Rate (%)', inputs.growthRate],
        ['Projection Years', inputs.projectionYears],
        [''],
        
        // Projections Header
        ['FINANCIAL PROJECTIONS'],
        ['Year', 'Units', 'Total Sales', 'Gross Revenue', 'Total Costs', 'Net Profit', 'Revenue per Unit'],
        
        // Projections Data
        ...projections.map(year => [
          year.year,
          year.units,
          year.totalSales,
          year.grossRevenue,
          year.totalCosts,
          year.netProfit,
          year.revenuePerUnit
        ])
      ];
      
      // Convert to CSV
      const csv = Papa.unparse(csvData);
      
      // Download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `franchise-earnings-projection-${new Date().toISOString().split('T')[0]}.csv`);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = () => {
    // Simple print functionality - in a real app you'd use a PDF library
    window.print();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <SafeIcon icon={FiIcons.FiDownload} className="w-5 h-5 mr-2" />
          Export Results
        </h2>
      </div>

      <div className="p-6 space-y-4">
        <p className="text-gray-600 text-sm">
          Export your financial projections for further analysis or reporting.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={exportToCSV}
            disabled={!calculatedResults || isExporting}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            {isExporting ? (
              <SafeIcon icon={FiIcons.FiLoader} className="w-4 h-4 animate-spin" />
            ) : (
              <SafeIcon icon={FiIcons.FiFileText} className="w-4 h-4" />
            )}
            <span>{isExporting ? 'Exporting...' : 'Export to CSV'}</span>
          </button>

          <button
            onClick={exportToPDF}
            disabled={!calculatedResults}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            <SafeIcon icon={FiIcons.FiPrinter} className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>

        {calculatedResults && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Export includes:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• All input parameters</li>
              <li>• {inputs.projectionYears}-year financial projections</li>
              <li>• Revenue breakdown by stream</li>
              <li>• Unit growth and sales data</li>
              {inputs.includeCosts && <li>• Cost analysis and profit margins</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportPanel;
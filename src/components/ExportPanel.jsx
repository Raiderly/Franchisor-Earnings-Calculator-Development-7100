import React, { useState } from "react";
import { useCalculator } from "../context/CalculatorContext";
import * as FiIcons from "react-icons/fi";
import SafeIcon from "./common/SafeIcon";
import { exportToCsv } from "../utils/csvExport";
import { motion } from "framer-motion";

const ExportPanel = () => {
  const { calculatedResults, inputs } = useCalculator();
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleCsvExport = async () => {
    if (!calculatedResults) return;
    
    setIsExporting(true);
    try {
      await exportToCsv(
        inputs, 
        calculatedResults.projections, 
        {
          includeCosts: inputs.includeCosts,
          supplyChain: inputs.useSupply,
          marketingIncome: inputs.marketingLevy > 0,
          masterFranchise: inputs.useMasterFranchise
        }
      );
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintView = () => {
    window.print();
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="afi-card print:hidden">
      <div className="bg-afi-primary text-white p-5 rounded-t-xl">
        <h2 className="text-xl font-semibold flex items-center">
          <SafeIcon icon={FiIcons.FiDownload} className="w-5 h-5 mr-2 text-afi-secondary" />
          Export & Share
        </h2>
        <p className="text-sm text-gray-300 mt-1">Save your franchise projections for future reference</p>
      </div>

      <div className="p-6 space-y-5 bg-white rounded-b-xl">
        {/* Export Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleCsvExport}
            disabled={!calculatedResults || isExporting}
            className="afi-btn group max-w-full overflow-hidden"
          >
            {isExporting ? (
              <>
                <span className="inline-block w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span className="truncate">Generating Export...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiIcons.FiDownload} className="w-5 h-5 mr-2 group-hover:animate-bounce flex-shrink-0" />
                <span className="truncate">Download CSV Report</span>
              </>
            )}
          </button>

          <button
            onClick={toggleOptions}
            className="afi-btn-outline max-w-full overflow-hidden"
          >
            <SafeIcon icon={FiIcons.FiMoreHorizontal} className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="truncate">More Options</span>
          </button>
        </div>

        {/* Export Options */}
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 pt-4 border-t border-gray-200"
          >
            <h3 className="text-sm font-semibold text-afi-primary flex items-center">
              <SafeIcon icon={FiIcons.FiSettings} className="w-4 h-4 mr-2 text-afi-secondary" />
              Additional Export Options
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handlePrintView}
                className="flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-afi-primary px-4 py-2.5 rounded-lg font-medium transition-colors max-w-full overflow-hidden"
              >
                <SafeIcon icon={FiIcons.FiPrinter} className="w-5 h-5 mr-2 text-afi-secondary flex-shrink-0" />
                <span className="truncate">Print-Friendly View</span>
              </button>

              <button
                onClick={() => window.open('mailto:?subject=Franchise%20Earnings%20Projection&body=Here%20are%20my%20franchise%20projections%20from%20Accurate%20Franchising%20Inc.')}
                className="flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-afi-primary px-4 py-2.5 rounded-lg font-medium transition-colors max-w-full overflow-hidden"
              >
                <SafeIcon icon={FiIcons.FiMail} className="w-5 h-5 mr-2 text-afi-secondary flex-shrink-0" />
                <span className="truncate">Email Results</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Export Info */}
        {calculatedResults && (
          <div className="p-4 bg-afi-muted rounded-lg">
            <h4 className="text-sm font-semibold text-afi-primary mb-2 flex items-center">
              <SafeIcon icon={FiIcons.FiInfo} className="w-4 h-4 mr-2 text-afi-secondary" />
              Export Information
            </h4>

            <ul className="space-y-2">
              <li className="flex items-start text-sm text-afi-textSecondary">
                <SafeIcon icon={FiIcons.FiCheck} className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Complete {inputs.projectionYears}-year franchise financial projection</span>
              </li>
              <li className="flex items-start text-sm text-afi-textSecondary">
                <SafeIcon icon={FiIcons.FiCheck} className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Detailed revenue breakdown by income stream</span>
              </li>
              <li className="flex items-start text-sm text-afi-textSecondary">
                <SafeIcon icon={FiIcons.FiCheck} className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Franchise unit growth and revenue per unit calculations</span>
              </li>
              {inputs.includeCosts && (
                <li className="flex items-start text-sm text-afi-textSecondary">
                  <SafeIcon icon={FiIcons.FiCheck} className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Operating costs and profit margin analysis</span>
                </li>
              )}
            </ul>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <a
                href="https://www.accuratefranchising.com/contact-us/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-afi-primary hover:text-afi-secondary font-medium inline-flex items-center max-w-full overflow-hidden"
              >
                <SafeIcon icon={FiIcons.FiMessageSquare} className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span className="truncate">Get expert interpretation of your results from AFI</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportPanel;
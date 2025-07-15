import React from 'react';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const ProjectionsTable = ({ projections, includeCosts }) => {
  if (!projections || projections.length === 0) {
    return null;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b">Year</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b">Units</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b">Gross Revenue</th>
            {includeCosts && (
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b">Costs</th>
            )}
            {includeCosts && (
              <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b">Net Profit</th>
            )}
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-b">Revenue/Unit</th>
          </tr>
        </thead>
        <tbody>
          {projections.map((year, index) => (
            <tr 
              key={index} 
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">
                Year {index + 1}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 border-b">
                {formatNumber(year.units)}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">
                {formatCurrency(year.grossRevenue)}
              </td>
              {includeCosts && (
                <td className="px-4 py-3 text-sm text-gray-700 border-b">
                  {formatCurrency(year.totalCosts)}
                </td>
              )}
              {includeCosts && (
                <td className="px-4 py-3 text-sm font-medium border-b">
                  <span className={year.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(year.netProfit)}
                  </span>
                </td>
              )}
              <td className="px-4 py-3 text-sm text-gray-700 border-b">
                {formatCurrency(year.grossRevenue / year.units)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectionsTable;
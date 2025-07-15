import React from 'react';
import { useCalculator } from '../context/CalculatorContext';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(Math.round(number));
};

const ProjectionsTable = () => {
  const { projections, inputs } = useCalculator();

  if (!projections.length) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-afi-text">
        {inputs.projectionYears}-Year Financial Projections
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="bg-afi-primary text-white">
              <th className="px-4 py-3 text-left text-sm font-semibold">Year</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Units</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Gross Revenue</th>
              {inputs.includeCosts && (
                <th className="px-4 py-3 text-left text-sm font-semibold">Total Costs</th>
              )}
              {inputs.includeCosts && (
                <th className="px-4 py-3 text-left text-sm font-semibold">Net Profit</th>
              )}
              <th className="px-4 py-3 text-left text-sm font-semibold">Revenue/Unit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projections.map((year, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm font-medium text-afi-text">
                  Year {index + 1}
                </td>
                <td className="px-4 py-3 text-sm text-afi-text">
                  {formatNumber(year.units)}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-afi-primary">
                  {formatCurrency(year.grossRevenue)}
                </td>
                {inputs.includeCosts && (
                  <td className="px-4 py-3 text-sm text-afi-text">
                    {formatCurrency(year.totalCosts)}
                  </td>
                )}
                {inputs.includeCosts && (
                  <td className="px-4 py-3 text-sm font-medium">
                    <span className={year.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(year.netProfit)}
                    </span>
                  </td>
                )}
                <td className="px-4 py-3 text-sm text-afi-text">
                  {formatCurrency(year.revenuePerUnit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-afi-text-light">Total Revenue</div>
          <div className="text-lg font-bold text-afi-primary">
            {formatCurrency(projections.reduce((sum, year) => sum + year.grossRevenue, 0))}
          </div>
        </div>
        
        {inputs.includeCosts && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-afi-text-light">Total Profit</div>
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(projections.reduce((sum, year) => sum + year.netProfit, 0))}
            </div>
          </div>
        )}
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-afi-text-light">Final Network Size</div>
          <div className="text-lg font-bold text-afi-primary">
            {formatNumber(projections[projections.length - 1].units)} Units
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectionsTable;
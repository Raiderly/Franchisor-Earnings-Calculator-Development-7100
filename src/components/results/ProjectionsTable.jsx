import React from "react";

const ProjectionsTable = ({ projections, includeCosts }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Year
            </th>
            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Units
            </th>
            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Total Sales
            </th>
            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Gross Revenue
            </th>
            {includeCosts && (
              <>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Costs
                </th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Net Profit
                </th>
              </>
            )}
            <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Revenue/Unit
            </th>
          </tr>
        </thead>
        <tbody>
          {projections.map((year, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                Year {year.year}
              </td>
              <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                {year.units.toLocaleString()}
              </td>
              <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                {formatCurrency(year.totalSales)}
              </td>
              <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-blue-600">
                {formatCurrency(year.grossRevenue)}
              </td>
              {includeCosts && (
                <>
                  <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                    {formatCurrency(year.totalCosts)}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-sm font-medium">
                    <span className={year.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(year.netProfit)}
                    </span>
                  </td>
                </>
              )}
              <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                {formatCurrency(year.revenuePerUnit)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectionsTable;
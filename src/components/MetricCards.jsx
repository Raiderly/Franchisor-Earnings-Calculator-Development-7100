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

const MetricCards = () => {
  const { projections, inputs } = useCalculator();

  if (!projections.length) return null;

  const currentYear = projections[0];
  const finalYear = projections[projections.length - 1];

  const metrics = [
    {
      title: 'Year 1 Revenue',
      value: formatCurrency(currentYear.grossRevenue),
      subtitle: 'Total Annual Revenue',
      icon: '💰',
      className: 'primary'
    },
    {
      title: 'Revenue Per Unit',
      value: formatCurrency(currentYear.revenuePerUnit),
      subtitle: 'Annual Average',
      icon: '📊',
      className: 'secondary'
    },
    {
      title: inputs.includeCosts ? 'Year 1 Profit' : 'Network Growth',
      value: inputs.includeCosts 
        ? formatCurrency(currentYear.netProfit)
        : `${((finalYear.units - currentYear.units) / currentYear.units * 100).toFixed(1)}%`,
      subtitle: inputs.includeCosts 
        ? `${((currentYear.netProfit / currentYear.grossRevenue) * 100).toFixed(1)}% Margin`
        : `Over ${inputs.projectionYears} Years`,
      icon: inputs.includeCosts ? '📈' : '🚀',
      className: 'accent'
    },
    {
      title: 'Network Size',
      value: formatNumber(finalYear.units),
      subtitle: `After ${inputs.projectionYears} Years`,
      icon: '🏢',
      className: ''
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div key={index} className={`afi-metric-card ${metric.className}`}>
          <div className="afi-metric-icon">
            <span className="text-2xl">{metric.icon}</span>
          </div>
          <div className="afi-metric-title">{metric.title}</div>
          <div className="afi-metric-value">{metric.value}</div>
          <div className="afi-metric-subtitle">{metric.subtitle}</div>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;
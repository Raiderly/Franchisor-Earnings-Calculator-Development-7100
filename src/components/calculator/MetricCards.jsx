import React from 'react';
import { 
  FiDollarSign, 
  FiUsers, 
  FiTrendingUp, 
  FiBarChart2 
} from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const MetricCards = ({ projections }) => {
  if (!projections || projections.length === 0) {
    return null;
  }
  
  const currentYear = projections[0];
  const finalYear = projections[projections.length - 1];
  const totalRevenue = currentYear.grossRevenue;
  const netProfit = currentYear.netProfit;
  const units = currentYear.units;
  const revenuePerUnit = units > 0 ? totalRevenue / units : 0;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="metric-card">
        <div className="metric-icon revenue">
          <SafeIcon icon={FiDollarSign} className="w-5 h-5" />
        </div>
        <h3 className="metric-title">Year 1 Revenue</h3>
        <div className="metric-value">{formatCurrency(totalRevenue)}</div>
        <div className="metric-subtitle">Total Annual Revenue</div>
      </div>
      
      <div className="metric-card">
        <div className="metric-icon per-unit">
          <SafeIcon icon={FiBarChart2} className="w-5 h-5" />
        </div>
        <h3 className="metric-title">Revenue Per Unit</h3>
        <div className="metric-value">{formatCurrency(revenuePerUnit)}</div>
        <div className="metric-subtitle">Annual Average</div>
      </div>
      
      <div className="metric-card">
        <div className="metric-icon profit">
          <SafeIcon icon={FiTrendingUp} className="w-5 h-5" />
        </div>
        <h3 className="metric-title">Year 1 Profit</h3>
        <div className="metric-value">{formatCurrency(netProfit)}</div>
        <div className="metric-subtitle">
          {((netProfit / totalRevenue) * 100).toFixed(1)}% Margin
        </div>
      </div>
      
      <div className="metric-card">
        <div className="metric-icon units">
          <SafeIcon icon={FiUsers} className="w-5 h-5" />
        </div>
        <h3 className="metric-title">Network Size</h3>
        <div className="metric-value">{formatNumber(finalYear.units)}</div>
        <div className="metric-subtitle">
          After {projections.length} Years
        </div>
      </div>
    </div>
  );
};

export default MetricCards;
import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatCurrency } from '../../utils/formatters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RevenueChart = ({ projections, includeCosts }) => {
  if (!projections || projections.length === 0) {
    return null;
  }
  
  const labels = projections.map((_, index) => `Year ${index + 1}`);
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${formatCurrency(value)}`;
          }
        }
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };
  
  const datasets = [
    {
      label: 'Gross Revenue',
      data: projections.map(year => year.grossRevenue),
      borderColor: '#3498db',
      backgroundColor: 'rgba(52, 152, 219, 0.1)',
      fill: true,
      tension: 0.4,
    }
  ];
  
  if (includeCosts) {
    datasets.push({
      label: 'Net Profit',
      data: projections.map(year => year.netProfit),
      borderColor: '#27ae60',
      backgroundColor: 'rgba(39, 174, 96, 0.1)',
      fill: true,
      tension: 0.4,
    });
  }
  
  const data = {
    labels,
    datasets,
  };
  
  return (
    <div className="h-80">
      <Line options={options} data={data} />
    </div>
  );
};

export default RevenueChart;
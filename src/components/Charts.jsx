import React from 'react';
import { useCalculator } from '../context/CalculatorContext';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const LineChart = ({ projections, includeCosts }) => {
  const labels = projections.map((_, index) => `Year ${index + 1}`);
  const grossRevenueData = projections.map(year => year.grossRevenue);
  const netProfitData = projections.map(year => year.netProfit);

  const data = {
    labels,
    datasets: [
      {
        label: 'Gross Revenue',
        data: grossRevenueData,
        borderColor: '#5E2D91',
        backgroundColor: 'rgba(94, 45, 145, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
      ...(includeCosts ? [{
        label: 'Net Profit',
        data: netProfitData,
        borderColor: '#00B6C4',
        backgroundColor: 'rgba(0, 182, 196, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      }] : [])
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Open Sans',
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    }
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

const PieChart = ({ projections, inputs }) => {
  const currentYear = projections[0];

  // Revenue streams with consistent colors
  const revenueStreams = [
    { name: 'Royalty Income', amount: currentYear.royaltyIncome, color: '#5E2D91' },
    { name: 'Initial Fees', amount: currentYear.initialFees, color: '#00B6C4' },
    { name: 'Technology Fees', amount: currentYear.techIncome, color: '#F26B38' },
    { name: 'Support Fees', amount: currentYear.supportIncome, color: '#8B5CF6' },
    { name: 'Training Fees', amount: currentYear.trainingIncome, color: '#10B981' },
    { name: 'Renewal Fees', amount: currentYear.renewalFees, color: '#F59E0B' },
    { name: 'Transfer Fees', amount: currentYear.transferIncome, color: '#EF4444' },
  ];

  // Add optional streams
  if (inputs.useSupply && currentYear.supplyChainIncome > 0) {
    revenueStreams.push({
      name: 'Supply Chain',
      amount: currentYear.supplyChainIncome,
      color: '#06B6D4'
    });
  }

  if (inputs.useMSP && currentYear.mspIncome > 0) {
    revenueStreams.push({
      name: 'MSP Income',
      amount: currentYear.mspIncome,
      color: '#8B5CF6'
    });
  }

  if (inputs.useMasterFranchise) {
    if (currentYear.masterFranchiseFees > 0) {
      revenueStreams.push({
        name: 'Master Franchise Fees',
        amount: currentYear.masterFranchiseFees,
        color: '#7C3AED'
      });
    }
    if (currentYear.masterOverrideIncome > 0) {
      revenueStreams.push({
        name: 'Master Override',
        amount: currentYear.masterOverrideIncome,
        color: '#A855F7'
      });
    }
  }

  // Filter out zero values
  const validStreams = revenueStreams.filter(stream => stream.amount > 0);
  const total = validStreams.reduce((sum, stream) => sum + stream.amount, 0);

  const data = {
    labels: validStreams.map(stream => stream.name),
    datasets: [{
      data: validStreams.map(stream => stream.amount),
      backgroundColor: validStreams.map(stream => stream.color),
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            family: 'Open Sans',
            size: 11
          },
          generateLabels: function(chart) {
            const data = chart.data;
            return data.labels.map((label, i) => {
              const value = data.datasets[0].data[i];
              const percentage = ((value / total) * 100).toFixed(1);
              return {
                text: `${label} (${percentage}%)`,
                fillStyle: data.datasets[0].backgroundColor[i],
                hidden: false,
                index: i
              };
            });
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Doughnut data={data} options={options} />
    </div>
  );
};

const Charts = () => {
  const { projections, inputs } = useCalculator();

  if (!projections.length) return null;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-afi-text mb-4">Revenue Growth Projection</h3>
        <LineChart projections={projections} includeCosts={inputs.includeCosts} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-afi-text mb-4">Revenue Distribution - Year 1</h3>
        <PieChart projections={projections} inputs={inputs} />
      </div>
    </div>
  );
};

export default Charts;
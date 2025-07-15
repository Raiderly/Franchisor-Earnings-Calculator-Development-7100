import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { theme } from '../../styles/theme';

const RevenuePieChart = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            family: theme.fonts.body,
            size: 12
          },
          padding: 20,
          usePointStyle: true,
          generateLabels: (chart) => {
            const data = chart.data;
            return data.labels.map((label, i) => ({
              text: `${label} (${((data.datasets[0].data[i] / data.datasets[0].data.reduce((a, b) => a + b)) * 100).toFixed(1)}%)`,
              fillStyle: data.datasets[0].backgroundColor[i],
              hidden: false,
              index: i
            }));
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: theme.colors.text.primary,
        bodyColor: theme.colors.text.primary,
        borderColor: theme.colors.primary,
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="h-[400px] w-full">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default RevenuePieChart;
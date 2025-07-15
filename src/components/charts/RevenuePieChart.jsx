import React from 'react';
import ReactECharts from 'echarts-for-react';
import { formatCurrency } from '../../utils/formatters';

const RevenuePieChart = ({ projections, toggles }) => {
  if (!projections || projections.length === 0) {
    return <div className="text-center text-gray-500 py-8">No data available for chart</div>;
  }

  const currentYear = projections[0];
  const totalRevenue = currentYear.grossRevenue;

  // Define all possible revenue streams
  const allStreams = [
    { name: 'Royalty Income', value: currentYear.royaltyIncome || 0, color: '#262262' }, // Primary AFI navy
    { name: 'Initial Franchise Fees', value: currentYear.initialFees || 0, color: '#caa74d' }, // AFI gold
    { name: 'Renewal Fees', value: currentYear.renewalFees || 0, color: '#6366f1' }, // Indigo
    { name: 'Training Fees', value: (currentYear.trainingIncome || 0) + (currentYear.trainingRecurringIncome || 0), color: '#0ea5e9' // Sky blue
    },
    { name: 'Technology Fees', value: currentYear.techIncome || 0, color: '#10b981' }, // Emerald
    { name: 'Admin/Support Fees', value: currentYear.supportIncome || 0, color: '#8b5cf6' }, // Violet
    { name: 'Transfer Fees', value: currentYear.transferIncome || 0, color: '#f59e0b' }, // Amber
  ];

  // Add conditional revenue streams
  if (toggles.supplyChain) {
    allStreams.push({ 
      name: 'Supply Chain Margin', 
      value: currentYear.supplyChainIncome || 0, 
      color: '#14b8a6' // Teal
    });
  }

  if (toggles.marketingIncome) {
    allStreams.push({ 
      name: 'Marketing Levy Income', 
      value: currentYear.marketingIncome || 0, 
      color: '#ec4899' // Pink
    });
  }

  if (toggles.masterFranchise) {
    allStreams.push({ 
      name: 'Master Franchise Fees', 
      value: currentYear.masterFranchiseFees || 0, 
      color: '#6d28d9' // Purple
    });
    allStreams.push({ 
      name: 'Master Override Income', 
      value: currentYear.masterOverrideIncome || 0, 
      color: '#7c3aed' // Violet
    });
  }

  // Filter out zero values and format data
  const chartData = allStreams
    .filter(stream => stream.value > 0)
    .map(stream => ({
      name: stream.name,
      value: stream.value,
      percentage: ((stream.value / totalRevenue) * 100).toFixed(1),
      itemStyle: { color: stream.color }
    }));

  const option = {
    title: {
      text: 'Revenue Distribution',
      subtext: 'Year 1 Breakdown',
      left: 'center',
      top: 20,
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'DM Sans',
        color: '#262262'
      },
      subtextStyle: {
        fontSize: 14,
        fontFamily: 'DM Sans',
        color: '#6b7280'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        const percentage = params.percent;
        const value = formatCurrency(params.value);
        return `<strong>${params.name}</strong><br/> ${value}<br/> ${percentage}% of total revenue`;
      },
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#262262',
        fontSize: 12,
        fontFamily: 'DM Sans'
      },
      extraCssText: 'box-shadow: 0 2px 10px rgba(0,0,0,0.1);'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 'center',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 10,
      textStyle: {
        fontSize: 11,
        color: '#262262',
        fontFamily: 'DM Sans'
      },
      formatter: function(name) {
        const item = chartData.find(d => d.name === name);
        return item ? `${name} (${item.percentage}%)` : name;
      },
      icon: 'circle'
    },
    series: [
      {
        name: 'Revenue Streams',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0,0,0,0.2)'
          },
          label: {
            show: false
          }
        },
        labelLine: {
          show: false
        },
        label: {
          show: false
        },
        data: chartData
      }
    ],
    animation: true,
    animationType: 'scale',
    animationEasing: 'elasticOut',
    animationDelay: function (idx) {
      return Math.random() * 200;
    }
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
      id="revenue-pie-chart"
      className="py-2"
    />
  );
};

export default RevenuePieChart;
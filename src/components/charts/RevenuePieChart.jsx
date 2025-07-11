import React from 'react';
import ReactECharts from 'echarts-for-react';

const RevenuePieChart = ({ projections, toggles }) => {
  if (!projections || projections.length === 0) {
    return <div className="text-center text-gray-500 py-8">No data available for chart</div>;
  }

  const currentYear = projections[0];
  const totalRevenue = currentYear.grossRevenue;

  // Define all possible revenue streams
  const allStreams = [
    { name: 'Royalty Income', value: currentYear.royaltyIncome || 0, color: '#1a2c43' },
    { name: 'Initial Franchise Fees', value: currentYear.initialFees || 0, color: '#c0392b' },
    { name: 'Renewal Fees', value: currentYear.renewalFees || 0, color: '#28a745' },
    { 
      name: 'Training Fees', 
      value: (currentYear.trainingIncome || 0) + (currentYear.trainingRecurringIncome || 0), 
      color: '#17a2b8' 
    },
    { name: 'Technology Fees', value: currentYear.techIncome || 0, color: '#ffc107' },
    { name: 'Admin/Support Fees', value: currentYear.supportIncome || 0, color: '#6f42c1' },
    { name: 'Transfer Fees', value: currentYear.transferIncome || 0, color: '#fd7e14' },
  ];

  // Add conditional revenue streams
  if (toggles.supplyChain) {
    allStreams.push({ 
      name: 'Supply Chain Margin', 
      value: currentYear.supplyChainIncome || 0, 
      color: '#20c997' 
    });
  }

  if (toggles.marketingIncome) {
    allStreams.push({ 
      name: 'Marketing Levy Income', 
      value: currentYear.marketingIncome || 0, 
      color: '#e83e8c' 
    });
  }

  if (toggles.masterFranchise) {
    allStreams.push({ 
      name: 'Master Franchise Fees', 
      value: currentYear.masterFranchiseFees || 0, 
      color: '#6610f2' 
    });
    allStreams.push({ 
      name: 'Master Override Income', 
      value: currentYear.masterOverrideIncome || 0, 
      color: '#795548' 
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a2c43'
      },
      subtextStyle: {
        fontSize: 14,
        color: '#6c757d'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        const percentage = params.percent;
        const value = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(params.value);
        return `<strong>${params.name}</strong><br/>
                ${value}<br/>
                ${percentage}% of total revenue`;
      },
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderColor: '#1a2c43',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 12
      }
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 20,
      top: 'middle',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: {
        fontSize: 11,
        color: '#495057'
      },
      formatter: function(name) {
        const item = chartData.find(d => d.name === name);
        return item ? `${name} (${item.percentage}%)` : name;
      }
    },
    series: [
      {
        name: 'Revenue Streams',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
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
    <div className="w-full h-96 afi-card p-4">
      <ReactECharts 
        option={option} 
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'canvas' }}
        id="revenue-pie-chart"
      />
    </div>
  );
};

export default RevenuePieChart;
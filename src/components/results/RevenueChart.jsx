import React from "react";
import ReactECharts from "echarts-for-react";

const RevenueChart = ({ projections, includeCosts }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter: function (params) {
        let tooltip = `<strong>Year ${params[0].dataIndex + 1}</strong><br/>`;
        params.forEach(param => {
          tooltip += `${param.seriesName}: ${formatCurrency(param.value)}<br/>`;
        });
        return tooltip;
      }
    },
    legend: {
      data: includeCosts ? ['Gross Revenue', 'Net Profit', 'Total Sales'] : ['Gross Revenue', 'Total Sales'],
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: projections.map((_, index) => `Year ${index + 1}`)
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value) {
          return formatCurrency(value);
        }
      }
    },
    series: [
      {
        name: 'Gross Revenue',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#3b82f6'
        },
        areaStyle: {
          opacity: 0.2,
          color: '#3b82f6'
        },
        data: projections.map(year => year.grossRevenue),
        symbolSize: 8
      },
      {
        name: 'Total Sales',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2,
          color: '#10b981'
        },
        data: projections.map(year => year.totalSales),
        symbolSize: 6
      },
      ...(includeCosts ? [{
        name: 'Net Profit',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#f59e0b'
        },
        areaStyle: {
          opacity: 0.1,
          color: '#f59e0b'
        },
        data: projections.map(year => year.netProfit),
        symbolSize: 8
      }] : [])
    ]
  };

  return (
    <div className="w-full h-96">
      <ReactECharts 
        option={option} 
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default RevenueChart;
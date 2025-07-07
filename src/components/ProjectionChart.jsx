import React from 'react';
import ReactECharts from 'echarts-for-react';
import { formatCurrency } from '../utils/formatters';

const ProjectionChart = ({ projections, toggles }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#1a2c43'
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
      data: toggles.includeCosts ? ['Gross Revenue', 'Net Profit'] : ['Gross Revenue'],
      top: 10,
      textStyle: {
        color: '#1a2c43'
      }
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
      data: projections.map((_, index) => `Year ${index + 1}`),
      axisLine: {
        lineStyle: {
          color: '#1a2c43'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value) {
          return formatCurrency(value);
        }
      },
      axisLine: {
        lineStyle: {
          color: '#1a2c43'
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
          color: '#1a2c43'
        },
        areaStyle: {
          opacity: 0.2,
          color: '#1a2c43'
        },
        emphasis: {
          focus: 'series'
        },
        data: projections.map(year => year.grossRevenue),
        symbolSize: 8
      },
      ...(toggles.includeCosts ? [{
        name: 'Net Profit',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#c0392b'
        },
        areaStyle: {
          opacity: 0.1,
          color: '#c0392b'
        },
        emphasis: {
          focus: 'series'
        },
        data: projections.map(year => year.netProfit),
        symbolSize: 8
      }] : [])
    ]
  };

  return (
    <div className="w-full h-96 afi-card p-1">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default ProjectionChart;
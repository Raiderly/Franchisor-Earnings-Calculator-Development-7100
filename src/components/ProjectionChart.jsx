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
          backgroundColor: '#262262'
        }
      },
      formatter: function (params) {
        let tooltip = `<strong>Year ${params[0].dataIndex + 1}</strong><br/>`;
        params.forEach(param => {
          tooltip += `${param.seriesName}: ${formatCurrency(param.value)}<br/>`;
        });
        return tooltip;
      },
      textStyle: {
        fontFamily: 'DM Sans'
      }
    },
    legend: {
      data: toggles.includeCosts ? ['Gross Revenue', 'Net Profit'] : ['Gross Revenue'],
      top: 10,
      textStyle: {
        color: '#262262',
        fontFamily: 'DM Sans'
      },
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 8
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
          color: '#262262'
        }
      },
      axisLabel: {
        fontFamily: 'DM Sans',
        color: '#6b7280'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value) {
          return formatCurrency(value);
        },
        fontFamily: 'DM Sans',
        color: '#6b7280'
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#e5e7eb'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f3f4f6'
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
          color: '#262262'
        },
        areaStyle: {
          opacity: 0.2,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#262262'
              },
              {
                offset: 1,
                color: 'rgba(38,34,98,0.1)'
              }
            ]
          }
        },
        emphasis: {
          focus: 'series'
        },
        data: projections.map(year => year.grossRevenue),
        symbolSize: 8,
        symbol: 'circle'
      },
      ...(toggles.includeCosts ? [{
        name: 'Net Profit',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#caa74d'
        },
        areaStyle: {
          opacity: 0.1,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#caa74d'
              },
              {
                offset: 1,
                color: 'rgba(202,167,77,0.1)'
              }
            ]
          }
        },
        emphasis: {
          focus: 'series'
        },
        data: projections.map(year => year.netProfit),
        symbolSize: 8,
        symbol: 'circle'
      }] : [])
    ]
  };

  return (
    <ReactECharts 
      option={option} 
      style={{ height: '100%', width: '100%' }} 
      opts={{ renderer: 'canvas' }}
      className="py-2" 
    />
  );
};

export default ProjectionChart;
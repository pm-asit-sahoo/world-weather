import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../../styles/Charts.css';

const SeaLevelChart = ({ data, simplified = false }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || !chartRef.current) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    // Prepare data for the chart
    const years = data.map(item => item.year);
    const riseValues = data.map(item => item.rise);
    
    // Create gradient for background
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(54, 162, 235, 0.7)');
    gradient.addColorStop(1, 'rgba(54, 162, 235, 0)');

    // Create the chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Sea Level Rise (mm)',
            data: riseValues,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: gradient,
            borderWidth: 2,
            pointRadius: simplified ? 0 : 3,
            pointBackgroundColor: 'rgb(54, 162, 235)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 5,
            bottom: 5
          }
        },
        plugins: {
          legend: {
            display: !simplified,
            position: 'top',
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return `Rise: ${context.parsed.y.toFixed(1)} mm`;
              }
            }
          },
          title: {
            display: !simplified,
            text: 'Global Mean Sea Level Rise',
            font: {
              size: 16
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: !simplified,
              text: 'Year'
            },
            ticks: {
              maxTicksLimit: simplified ? 5 : 10
            }
          },
          y: {
            display: true,
            title: {
              display: !simplified,
              text: 'Sea Level Rise (mm)'
            },
            suggestedMin: -150,
            suggestedMax: 120
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, simplified]);

  return (
    <div className="chart-wrapper">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default SeaLevelChart;

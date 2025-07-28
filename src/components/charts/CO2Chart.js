import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../../styles/Charts.css';

const CO2Chart = ({ data, simplified = false }) => {
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
    const ppmValues = data.map(item => item.ppm);
    
    // Create gradient for background
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(75, 192, 192, 0.7)');
    gradient.addColorStop(1, 'rgba(75, 192, 192, 0)');

    // Create the chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'CO2 Concentration (ppm)',
            data: ppmValues,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: gradient,
            borderWidth: 2,
            pointRadius: simplified ? 0 : 3,
            pointBackgroundColor: 'rgb(75, 192, 192)',
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
                return `CO2: ${context.parsed.y.toFixed(2)} ppm`;
              }
            }
          },
          title: {
            display: !simplified,
            text: 'Atmospheric CO2 Concentration',
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
              text: 'CO2 Concentration (ppm)'
            },
            suggestedMin: 300,
            suggestedMax: 420
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

export default CO2Chart;

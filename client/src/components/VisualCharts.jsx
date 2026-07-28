import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function VisualCharts({ summaryData, mode = 'all' }) {
  const { categoryBreakdown = {}, chartData = {} } = summaryData || {};

  const pieColors = [
    '#6366f1', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b',
    '#06b6d4', '#ec4899', '#3b82f6', '#14b8a6', '#a855f7'
  ];

  const categoryLabels = Object.keys(categoryBreakdown);
  const categoryValues = Object.values(categoryBreakdown);

  const doughnutData = {
    labels: categoryLabels.length > 0 ? categoryLabels : ['No Expenses Yet'],
    datasets: [
      {
        data: categoryValues.length > 0 ? categoryValues : [1],
        backgroundColor: categoryLabels.length > 0 ? pieColors.slice(0, categoryLabels.length) : ['#334155'],
        borderColor: '#0f172a',
        borderWidth: 3,
        hoverOffset: 6
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const val = context.raw || 0;
            return ` ₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
          }
        }
      }
    }
  };

  const barData = {
    labels: chartData.labels || ['Jul 26'],
    datasets: [
      {
        label: 'Income',
        data: chartData.income || [0],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 8
      },
      {
        label: 'Expenses',
        data: chartData.expense || [0],
        backgroundColor: 'rgba(244, 63, 94, 0.8)',
        borderRadius: 8
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } } }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' } }
    }
  };

  const lineData = {
    labels: chartData.labels || ['Jul 26'],
    datasets: [
      {
        fill: true,
        label: 'Monthly Expenses',
        data: chartData.expense || [0],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#818cf8'
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' } }
    }
  };

  if (mode === 'category') {
    return (
      <div style={{ height: '280px', position: 'relative' }}>
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
    );
  }

  if (mode === 'trend') {
    return (
      <div style={{ height: '280px', position: 'relative' }}>
        <Line data={lineData} options={lineOptions} />
      </div>
    );
  }

  return (
    <div className="charts-all-grid">
      <div className="glass-card">
        <div className="section-title">
          <h2>Category Breakdown</h2>
        </div>
        <div style={{ height: '300px', position: 'relative' }}>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      <div className="glass-card">
        <div className="section-title">
          <h2>Income vs Expense Comparison</h2>
        </div>
        <div style={{ height: '300px', position: 'relative' }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="glass-card charts-full-row">
        <div className="section-title">
          <h2>Cash Flow Spending Trajectory</h2>
        </div>
        <div style={{ height: '300px', position: 'relative' }}>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
}

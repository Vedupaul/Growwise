import React from 'react';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend,
    CategoryScale, LinearScale, BarElement, PointElement,
    LineElement, Title, Filler
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    ArcElement, Tooltip, Legend, CategoryScale, LinearScale,
    BarElement, PointElement, LineElement, Title, Filler
);

const fontConfig = { family: 'Inter', size: 11 };
const gridColor = 'rgba(255,255,255,0.04)';
const tickColor = '#64748b';

export const DonutChart = ({ data, labels }) => {
    const chartData = {
        labels,
        datasets: [{
            data,
            backgroundColor: [
                'rgba(168, 85, 247, 0.85)',
                'rgba(99, 102, 241, 0.75)',
                'rgba(236, 72, 153, 0.7)',
                'rgba(14, 165, 233, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(34, 197, 94, 0.7)',
            ],
            borderColor: 'transparent',
            hoverOffset: 8,
            borderRadius: 4,
            spacing: 2,
        }],
    };
    return (
        <Doughnut data={chartData} options={{
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: tickColor, font: fontConfig, padding: 16, usePointStyle: true, pointStyleWidth: 8 },
                },
                tooltip: {
                    backgroundColor: '#1e1e2e',
                    titleFont: fontConfig,
                    bodyFont: fontConfig,
                    padding: 12,
                    cornerRadius: 10,
                    borderColor: 'rgba(168,85,247,0.3)',
                    borderWidth: 1,
                    callbacks: {
                        label: (ctx) => ` ₹${ctx.parsed.toLocaleString('en-IN')}`,
                    },
                },
            },
            cutout: '72%',
            maintainAspectRatio: false,
        }} />
    );
};

/**
 * Helper: groups expenses by month and returns the last N months of data.
 * Returns { labels: ['Jan', 'Feb', ...], data: [0, 0, ...] }
 */
const getMonthlyTotals = (expenses, months = 7) => {
    const now = new Date();
    const labels = [];
    const totals = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(monthNames[d.getMonth()]);
        totals.push(0);
    }

    expenses.forEach((e) => {
        const expDate = e.dueDate ? new Date(e.dueDate) : (e.createdAt ? new Date(e.createdAt) : null);
        if (!expDate) return;

        for (let i = months - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            if (expDate.getMonth() === d.getMonth() && expDate.getFullYear() === d.getFullYear()) {
                totals[months - 1 - i] += e.amount;
                break;
            }
        }
    });

    return { labels, data: totals };
};

export const SpendingBarChart = ({ expenses = [] }) => {
    const { labels, data } = getMonthlyTotals(expenses);

    const chartData = {
        labels,
        datasets: [{
            label: 'Monthly Spending',
            data,
            backgroundColor: (ctx) => {
                const chart = ctx.chart;
                const { ctx: c, chartArea } = chart;
                if (!chartArea) return 'rgba(168,85,247,0.6)';
                const grad = c.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                grad.addColorStop(0, 'rgba(168,85,247,0.3)');
                grad.addColorStop(1, 'rgba(168,85,247,0.8)');
                return grad;
            },
            borderRadius: 6,
            borderSkipped: false,
            maxBarThickness: 40,
        }],
    };
    return (
        <Bar data={chartData} options={{
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e1e2e',
                    titleFont: fontConfig,
                    bodyFont: fontConfig,
                    padding: 12,
                    cornerRadius: 10,
                    borderColor: 'rgba(168,85,247,0.3)',
                    borderWidth: 1,
                    callbacks: {
                        label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString('en-IN')}`,
                    },
                },
            },
            scales: {
                y: {
                    grid: { color: gridColor },
                    ticks: { color: tickColor, font: fontConfig, callback: (v) => v >= 1000 ? `${v / 1000}k` : v },
                    border: { dash: [4, 4] },
                    beginAtZero: true,
                },
                x: {
                    grid: { display: false },
                    ticks: { color: tickColor, font: fontConfig },
                },
            },
            maintainAspectRatio: false,
        }} />
    );
};

export const TrendLineChart = ({ expenses = [] }) => {
    const { labels, data } = getMonthlyTotals(expenses, 6);

    const chartData = {
        labels,
        datasets: [{
            label: 'Trend',
            data,
            borderColor: '#a855f7',
            backgroundColor: (ctx) => {
                const chart = ctx.chart;
                const { ctx: c, chartArea } = chart;
                if (!chartArea) return 'rgba(168,85,247,0.1)';
                const grad = c.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                grad.addColorStop(0, 'rgba(168,85,247,0)');
                grad.addColorStop(1, 'rgba(168,85,247,0.2)');
                return grad;
            },
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#a855f7',
            pointBorderColor: '#1e1e2e',
            pointBorderWidth: 2,
            pointHoverRadius: 6,
            borderWidth: 2.5,
        }],
    };
    return (
        <Line data={chartData} options={{
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e1e2e',
                    titleFont: fontConfig,
                    bodyFont: fontConfig,
                    padding: 12,
                    cornerRadius: 10,
                    borderColor: 'rgba(168,85,247,0.3)',
                    borderWidth: 1,
                    callbacks: {
                        label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString('en-IN')}`,
                    },
                },
            },
            scales: {
                y: {
                    grid: { color: gridColor },
                    ticks: { color: tickColor, font: fontConfig, callback: (v) => v >= 1000 ? `${v / 1000}k` : v },
                    border: { dash: [4, 4] },
                    beginAtZero: true,
                },
                x: {
                    grid: { display: false },
                    ticks: { color: tickColor, font: fontConfig },
                },
            },
            maintainAspectRatio: false,
        }} />
    );
};

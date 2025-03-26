import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const BarChart = ({ solved, pending, unsolved }) => {
    const chartData = {
        labels: ['Solved', 'Pending', 'Unsolved'],
        datasets: [
            {
                label: 'Queries',
                data: [solved, pending, unsolved],
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
            }
        ]
    };

    return <Bar data={chartData} />;
};

export default BarChart;

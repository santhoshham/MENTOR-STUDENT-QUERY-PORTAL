import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data = [] }) => {
    if (!data || data.length === 0) {
        return <p>No data available</p>;
    }

    const chartData = {
        labels: data.map((item) => item.category),
        datasets: [
            {
                label: 'Query Distribution',
                data: data.map((item) => item.count),
                backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0']
            }
        ]
    };

    return <Pie data={chartData} />;
};

export default PieChart;

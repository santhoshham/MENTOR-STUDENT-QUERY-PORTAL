import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatisticsCard from '../components/StatisticsCard.jsx';
import PieChart from '../components/PieChart.jsx';
import BarChart from '../components/BarChart.jsx';
import { motion } from 'framer-motion';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [statistics, setStatistics] = useState({
        totalQueries: 0,
        solvedQueries: 0,
        pendingQueries: 0,
        unsolvedQueries: 0,
        totalDepartments: 0,
        totalStudents: 0
    });
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                console.log('Dashboard Stats:', response.data);
                
                const { queries, totalDepartments, totalStudents } = response.data.data;
                
                setStatistics({
                    totalQueries: queries.total || 0,
                    solvedQueries: queries.solved || 0,
                    pendingQueries: queries.pending || 0,
                    unsolvedQueries: (queries.total - queries.solved) || 0,
                    totalDepartments: totalDepartments || 0,
                    totalStudents: totalStudents || 0
                });
                
                // Simulate a slight delay to show shimmer effect
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Failed to fetch statistics:', error.response?.data || error.message);
                setLoading(false);
            }
        };
        
        fetchStatistics();
    }, []);

    const getPercentage = (value) => {
        return statistics.totalQueries > 0 ? ((value / statistics.totalQueries) * 100).toFixed(2) : '0.00';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="admin-dashboard">
            <motion.h1 
                className="dashboard-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Admin Dashboard
            </motion.h1>
            
            <motion.div 
                className="statistics-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {loading ? (
                    // Shimmer loading UI for statistics cards
                    Array(6).fill(0).map((_, index) => (
                        <div key={index} className="shimmer-card">
                            <div className="shimmer-title"></div>
                            <div className="shimmer-value"></div>
                            <div className="shimmer-percentage"></div>
                        </div>
                    ))
                ) : (
                    <>
                        <motion.div variants={itemVariants}>
                            <StatisticsCard 
                                title="Total Queries" 
                                count={statistics.totalQueries} 
                                icon="query"
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <StatisticsCard 
                                title="Solved Queries" 
                                count={statistics.solvedQueries} 
                                percentage={getPercentage(statistics.solvedQueries)} 
                                icon="solved"
                                status="success"
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <StatisticsCard 
                                title="Pending Queries" 
                                count={statistics.pendingQueries} 
                                percentage={getPercentage(statistics.pendingQueries)} 
                                icon="pending"
                                status="warning"
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <StatisticsCard 
                                title="Unsolved Queries" 
                                count={statistics.unsolvedQueries} 
                                percentage={getPercentage(statistics.unsolvedQueries)} 
                                icon="unsolved"
                                status="danger"
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <StatisticsCard 
                                title="Total Departments" 
                                count={statistics.totalDepartments} 
                                icon="department"
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <StatisticsCard 
                                title="Total Students" 
                                count={statistics.totalStudents} 
                                icon="student"
                            />
                        </motion.div>
                    </>
                )}
            </motion.div>
            
            <motion.div 
                className="charts-container"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                <div className="chart-card">
                    <h2>Query Status Overview</h2>
                    {loading ? (
                        <div className="shimmer-chart"></div>
                    ) : (
                        <BarChart
                            solved={statistics.solvedQueries}
                            pending={statistics.pendingQueries}
                            unsolved={statistics.unsolvedQueries}
                        />
                    )}
                </div>
                
                <div className="chart-card">
                    <h2>Query Distribution</h2>
                    {loading ? (
                        <div className="shimmer-chart round"></div>
                    ) : (
                        <PieChart
                            solved={statistics.solvedQueries}
                            pending={statistics.pendingQueries}
                            unsolved={statistics.unsolvedQueries}
                        />
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
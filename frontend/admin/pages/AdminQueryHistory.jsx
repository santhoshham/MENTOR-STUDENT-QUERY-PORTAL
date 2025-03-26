import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/NewQueries.css';

const AdminQueryHistory = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Unauthorized: No token found.');
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:5000/api/admin/all-queries', {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            setQueries(data.data);
            setError(null);
        } catch (error) {
            console.error('Failed to fetch query history:', error);
            setError('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="table-container">
            <h1>Query History</h1>

            {loading ? (
                <p>Loading queries...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <table className="query-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queries.length > 0 ? (
                            queries.map((query) => (
                                <tr key={query._id}>
                                    <td>{query.studentId?.name || 'Unknown'}</td>
                                    <td>{query.title || 'No Title'}</td>
                                    <td>{query.description || 'No description available'}</td>
                                    <td>{query.status ? query.status.charAt(0).toUpperCase() + query.status.slice(1) : 'N/A'}</td>
                                    <td>{query.priority || 'N/A'}</td>
                                    <td>{query.departmentName || 'Not Assigned'}</td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No query history available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminQueryHistory;

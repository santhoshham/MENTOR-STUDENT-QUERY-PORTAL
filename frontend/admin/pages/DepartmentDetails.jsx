import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Detail.css';

const DepartmentDetails = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [departmentQueries, setDepartmentQueries] = useState([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            const token = localStorage.getItem('token'); 

            if (!token) {
                console.error('Unauthorized: No token found. Please log in.');
                return;
            }

            try {
                const { data } = await axios.get('http://localhost:5000/api/admin/departments', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setDepartments(data.data);
            } catch (error) {
                console.error('Failed to fetch departments:', error);
            }
        };
        fetchDepartments();
    }, []);

    const handleViewDetails = async (departmentName) => {
        try {
            const token = localStorage.getItem('token'); 
            if (!token) {
                console.error('Unauthorized: No token found.');
                return;
            }

            const { data } = await axios.get(`http://localhost:5000/api/admin/queries?department=${departmentName}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setDepartmentQueries(data.data || []);
            const department = departments.find(dep => dep.name === departmentName);
            setSelectedDepartment(department);
        } catch (error) {
            console.error('Failed to fetch department queries:', error);
        }
    };

    return (
        <div className="table-container">
            <h1>Department Details</h1>

            <table className="query-table">
                <thead>
                    <tr>
                        <th>Department Name</th>
                        <th>Description</th>

                    </tr>
                </thead>
                <tbody>
                    {departments.length > 0 ? (
                        departments.map((department) => (
                            <tr key={department.name}>
                                <td>{department.name}</td>
                                <td>{department.description}</td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No departments available.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {selectedDepartment && (
                <div className="query-details">
                    <h2>{selectedDepartment.name} - Queries</h2>
                    {departmentQueries.length > 0 ? (
                        <ul>
                            {departmentQueries.map((query) => (
                                <li key={query._id}>
                                    <strong>Title:</strong> {query.title} <br />
                                    <strong>Status:</strong> {query.status} <br />
                                    <strong>Submitted By:</strong> {query.studentId?.name || "Unknown"}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No queries assigned to this department.</p>
                    )}

                    <button
                        className="btn-cancel"
                        onClick={() => setSelectedDepartment(null)}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default DepartmentDetails;

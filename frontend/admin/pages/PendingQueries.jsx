import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/NewQueries.css";

const PendingQueries = () => {
    const [pendingQueries, setPendingQueries] = useState([]);
    const [selectedQuery, setSelectedQuery] = useState(null);

    useEffect(() => {
        const fetchPendingQueries = async () => {
            try {
                const token = localStorage.getItem("token"); // Ensure authentication
                if (!token) {
                    console.error("No token found.");
                    return;
                }

                const { data } = await axios.get(
                    "http://localhost:5000/api/admin/pending-queries",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                setPendingQueries(data.data); // Ensure correct data extraction
            } catch (error) {
                console.error("Failed to fetch pending queries:", error);
            }
        };

        fetchPendingQueries();
    }, []);

    const handleView = (query) => {
        setSelectedQuery(query);
        window.scrollTo(window.scrollX, window.scrollY); // Prevent scrolling
    };

    return (
        <div className="queries-wrapper">
            <div className="table-container">
                <h1>Pending Queries</h1>

                <table className="query-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Time</th>
                            <th>Assigned Department</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingQueries.length > 0 ? (
                            pendingQueries.map((query) => (
                                <tr key={query._id}>
                                    <td>{query.studentId?.name || "Unknown"}</td>
                                    <td>{query.title}</td>
                                    <td>{query.departmentName || "N/A"}</td>
                                    <td>{new Date(query.createdAt).toLocaleString()}</td>
                                    <td>{query.departmentName || "N/A"}</td>
                                    <td>
                                        <button
                                            className="btn-view"
                                            onClick={() => handleView(query)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-data">
                                    No pending queries available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedQuery && (
                <div className="query-details-container">
                    <div className="query-details">
                        <h2>Query Details</h2>
                        <div className="details-content">
                            <div className="details-row">
                                <strong>Title:</strong>
                                <span>{selectedQuery.title}</span>
                            </div>
                            <div className="details-row">
                                <strong>Description:</strong>
                                <div className="description-box">{selectedQuery.description}</div>
                            </div>
                            <div className="details-row">
                                <strong>Submitted By:</strong>
                                <span>{selectedQuery.studentId?.name || "Unknown"}</span>
                            </div>
                            <div className="details-row">
                                <strong>Assigned Department:</strong>
                                <span>{selectedQuery.departmentName || "N/A"}</span>
                            </div>
                        </div>

                        <div className="actions-row">
                            <button className="btn-cancel" onClick={() => setSelectedQuery(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingQueries;

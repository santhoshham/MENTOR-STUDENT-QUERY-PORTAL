import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/NewQueries.css';

const UnsolvedQueries = () => {
    const [unsolvedQueries, setUnsolvedQueries] = useState([]);
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [response, setResponse] = useState('');
    
    // Get Token from Local Storage
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUnsolvedQueries = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/admin/unsolved-queries', {
                    headers: { Authorization: `Bearer ${token}` } // ✅ Add Authorization Header
                });
                setUnsolvedQueries(data);
            } catch (error) {
                console.error('Failed to fetch unsolved queries:', error.response?.data?.error || error.message);
            }
        };
        fetchUnsolvedQueries();
    }, [token]);

    const handleView = (query) => {
        setSelectedQuery(query);
    };

    const handleResponseChange = (e) => {
        setResponse(e.target.value);
    };

    const handleSendResponse = async () => {
        try {
            await axios.post(
                `http://localhost:5000/api/admin/respond-query/${selectedQuery._id}`, 
                { response },
                { headers: { Authorization: `Bearer ${token}` } } // ✅ Add Authorization Header
            );
            alert('Response sent successfully!');
            setResponse('');
            setSelectedQuery(null);
        } catch (error) {
            console.error('Failed to send response:', error.response?.data?.error || error.message);
            alert('Failed to send response. Please try again.');
        }
    };

    const handleMarkAsSolved = async (queryId) => {
        try {
            await axios.put(
                `http://localhost:5000/api/admin/mark-solved/${queryId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } } // ✅ Add Authorization Header
            );
            alert('Query marked as solved!');
            setUnsolvedQueries(unsolvedQueries.filter((query) => query._id !== queryId));
        } catch (error) {
            console.error('Failed to mark query as solved:', error.response?.data?.error || error.message);
            alert('Failed to mark as solved. Please try again.');
        }
    };

    return (
        <div className="table-container">
            <h1>Unsolved Queries</h1>

            <table className="query-table">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
    {unsolvedQueries.length > 0 ? (
        unsolvedQueries.map((query) => (
            <tr key={query._id}>
                <td>{query.studentName || "Unknown Student"}</td> {/* Handle missing studentName */}
                <td>{query.title || "No Title"}</td> {/* Handle missing title */}
                <td>{query.category || "Uncategorized"}</td> {/* Handle missing category */}
                <td>{query.createdAt ? new Date(query.createdAt).toLocaleString() : "N/A"}</td> {/* Handle missing date */}
                <td>
                    <button className="btn-view" onClick={() => handleView(query)}>View</button>
                    <button className="btn-solved" onClick={() => handleMarkAsSolved(query._id)}>Mark as Solved</button>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="5">No unsolved queries available.</td>
        </tr>
    )}
</tbody>

            </table>

            {selectedQuery && (
                <div className="query-details">
                    <h2>Query Details</h2>
                    <p><strong>Title:</strong> {selectedQuery.title}</p>
                    <p><strong>Description:</strong> {selectedQuery.description}</p>
                    <p><strong>Submitted By:</strong> {selectedQuery.studentId?.name}</p>

                    <div className="response-section">
                        <textarea
                            value={response}
                            onChange={handleResponseChange}
                            placeholder="Enter your response here..."
                            rows="4"
                        />
                        <button className="btn-send" onClick={handleSendResponse}>
                            Send Response
                        </button>
                    </div>

                    <button className="btn-cancel" onClick={() => setSelectedQuery(null)}>
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default UnsolvedQueries;

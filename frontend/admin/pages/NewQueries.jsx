import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/NewQueries.css'; // Import the dedicated CSS file

const NewQueries = () => {
    const [queries, setQueries] = useState([]);
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [department, setDepartment] = useState('');
    const [priority, setPriority] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);

    const token = localStorage.getItem('token');

    // List of departments to avoid duplication
    const departments = [
        "Academics", "BIP Portal", "COE", "Fees", "Hostel", "Mess", "Moodle",
        "Non-Academics (Sports/NSS/Clubs)", "Others", "Personal", "Personalized Skill",
        "Skill / Reward Points", "Special Lab", "Student affairs", "TAC",
        "Training and Placement", "Transport"
    ];

    useEffect(() => {
        fetchNewQueries();
    }, []);

    const fetchNewQueries = async () => {
        setLoading(true);
        try {
            if (!token) {
                setError('Authentication required. Please login again.');
                setLoading(false);
                return;
            }

            const { data } = await axios.get('http://localhost:5000/api/admin/new-queries', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setQueries(data.data);
            setError('');
        } catch (error) {
            console.error('Failed to fetch new queries:', error);
            setError('Failed to load queries. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewAssign = (query) => {
        setSelectedQuery(query);
        setDepartment(query.category || '');
        setPriority(query.priority || '');
        setError('');
        setSuccess('');
        // Prevent scrolling
        window.scrollTo(window.scrollX, window.scrollY);
    };

    const handleAssign = async () => {
        if (!department || !priority) {
            setError('Please select a department and priority before assigning.');
            return;
        }

        setAssigning(true);
        try {
            await axios.put(
                `http://localhost:5000/api/admin/queries/${selectedQuery._id}`,
                { department, priority, status: "pending" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSuccess('Query assigned successfully!');
            setQueries(queries.filter(q => q._id !== selectedQuery._id));
            
            // Close details after a short delay to show success message
            setTimeout(() => {
                setSelectedQuery(null);
                setSuccess('');
            }, 2000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to assign query. Try again.';
            setError(errorMsg);
        } finally {
            setAssigning(false);
        }
    };

    const renderLoadingState = () => (
        <div className="loading-queries">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="loading-row"></div>
            ))}
        </div>
    );

    return (
        <div className="queries-wrapper">
            <div className="table-container">
                <h1>New Queries</h1>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                {loading ? (
                    renderLoadingState()
                ) : (
                    <table className="query-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Title</th>
                                <th>Department</th>
                                <th>Time</th>
                                <th>Priority</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {queries.length > 0 ? (
                                queries.map((query) => (
                                    <tr key={query._id} className={selectedQuery?._id === query._id ? 'active-row' : ''}>
                                        <td>{query.studentId?.name || 'Unknown'}</td>
                                        <td>{query.title}</td>
                                        <td>{query.departmentName || 'N/A'}</td>
                                        <td>{new Date(query.createdAt).toLocaleString()}</td>
                                        <td>
                                            <span className={`priority-badge ${query.priority || 'none'}`}>
                                                {query.priority || 'N/A'}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className="btn-view" 
                                                onClick={() => handleViewAssign(query)}
                                            >
                                                View/Assign
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="no-data">No new queries available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
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
                                <span>{selectedQuery.studentId?.name || 'Unknown'}</span>
                            </div>
                            
                            <div className="details-row">
                                <strong>Submission Date:</strong> 
                                <span>{new Date(selectedQuery.createdAt).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Department <span className="required">*</span></label>
                            <select 
                                value={department} 
                                onChange={(e) => setDepartment(e.target.value)}
                                className={!department ? 'input-error' : ''}
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Priority <span className="required">*</span></label>
                            <select 
                                value={priority} 
                                onChange={(e) => setPriority(e.target.value)}
                                className={!priority ? 'input-error' : ''}
                            >
                                <option value="">Select Priority</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>

                        <div className="actions-row">
                            <button 
                                className={`btn-assign ${assigning ? 'loading' : ''}`} 
                                onClick={handleAssign}
                                disabled={assigning}
                            >
                                {assigning ? 'Assigning...' : 'Assign'}
                            </button>
                            <button 
                                className="btn-cancel" 
                                onClick={() => setSelectedQuery(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewQueries;
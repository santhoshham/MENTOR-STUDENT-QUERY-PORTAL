import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiSearchLine } from 'react-icons/ri';
import '../styles/MentorsList.css';

function MentorsList() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/student/departments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
  
      const data = await response.json();
      console.log('Fetched data:', data); // Inspect data structure
      setDepartments(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const filteredDepartments = departments.filter(dept =>
    (dept.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to display N/A for null or undefined values
  const displayValue = (value) => {
    return value !== null && value !== undefined ? value : 'N/A';
  };

  if (loading) {
    return <div className="loading">Loading departments...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="mentors-list">
      <div className="mentors-header">
        <h1>Department Directory</h1>
        <div className="search-filters">
          <div className="search-bar">
            <RiSearchLine />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mentors-grid">
        {filteredDepartments.map(dept => (
          <div key={dept._id} className="mentor-card">
            <div className="mentor-header">
              <h3>{displayValue(dept.name)}</h3>
            </div>

            <div className="mentor-description">
              <p>{displayValue(dept.description)}</p>
            </div>

            <div className="mentor-stats">
              <div className="stat">
                <span className="stat-label">Email:</span>
                <span className="stat-value">{displayValue(dept.contactEmail)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Phone:</span>
                <span className="stat-value">{displayValue(dept.contactPhone)}</span>
              </div>

            </div>
          </div>
        ))}
      </div>

      {filteredDepartments.length === 0 && !loading && (
        <div className="no-results">
          <p>No departments found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}

export default MentorsList;
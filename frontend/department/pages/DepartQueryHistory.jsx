import React, { useEffect, useState } from "react";
import axios from "axios";

const DepartQueryHistory = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/department/queries", {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("API Response:", response.data);

        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          // Filter only solved queries from the data array
          const solvedQueries = response.data.data.filter(q => q.status.toLowerCase() === "solved");
          setQueries(solvedQueries);
        } else {
          setError("Unexpected API response format");
        }
      } catch (error) {
        console.error("Error fetching query history:", error);
        setError("Failed to fetch query history");
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, [token]);

  // Format date for better readability
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Get response summary (first response or indicator if multiple)
  const getResponseSummary = (responses) => {
    if (!responses || responses.length === 0) return "No responses";
    if (responses.length === 1) return responses[0].content;
    return `${responses[0].content.substring(0, 20)}... (${responses.length} responses)`;
  };

  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRowExpansion = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (loading) return <div style={styles.loading}>Loading query history...</div>;
  if (error) return <div style={styles.error}>{error}</div>;
  if (queries.length === 0) return <div style={styles.noData}>No solved queries found</div>;

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes highlight {
            0% { background-color: rgba(255, 255, 0, 0.3); }
            100% { background-color: transparent; }
          }
          
          @keyframes expand {
            from { max-height: 0; opacity: 0; }
            to { max-height: 500px; opacity: 1; }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          .table-row {
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .table-row:hover {
            background-color: rgba(0, 123, 255, 0.05);
            transform: translateX(5px);
          }
          
          .row-enter {
            animation: fadeIn 0.5s ease forwards;
          }
          
          .row-expanded {
            animation: highlight 2s ease;
          }
          
          .detail-panel {
            overflow: hidden;
            transition: all 0.5s ease-in-out;
            animation: expand 0.5s ease-in-out;
          }
          
          .priority-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            transition: all 0.3s ease;
          }
          
          .priority-badge:hover {
            transform: scale(1.1);
            animation: pulse 1s infinite;
          }
          
          .priority-high {
            background-color: #ffece6;
            color: #d9534f;
          }
          
          .priority-medium {
            background-color: #fff9e6;
            color: #f0ad4e;
          }
          
          .priority-low {
            background-color: #e6f7ff;
            color: #5bc0de;
          }
        `}
      </style>

      <h2 style={styles.heading}>Query History</h2>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Student</th>
              <th style={styles.th}>Priority</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Resolved</th>
              <th style={styles.th}>Response</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((query, index) => (
              <React.Fragment key={query._id}>
                <tr 
                  className={`table-row row-enter`} 
                  style={{...styles.tr, animationDelay: `${index * 0.1}s`}}
                  onClick={() => toggleRowExpansion(query._id)}
                >
                  <td style={styles.td}>{query.title}</td>
                  <td style={styles.td}>{query.studentId.name}</td>
                  <td style={styles.td}>
                    <span className={`priority-badge priority-${query.priority}`}>
                      {query.priority}
                    </span>
                  </td>
                  <td style={styles.td}>{formatDate(query.createdAt)}</td>
                  <td style={styles.td}>{formatDate(query.resolvedAt)}</td>
                  <td style={styles.td}>{getResponseSummary(query.responses)}</td>
                </tr>
                {expandedRow === query._id && (
                  <tr>
                    <td colSpan="6" style={styles.expandedCell}>
                      <div className="detail-panel" style={styles.detailPanel}>
                        <h3 style={styles.detailHeading}>Query Details</h3>
                        <div style={styles.detailContent}>
                          <p><strong>Description:</strong> {query.description}</p>
                          <p><strong>Department:</strong> {query.departmentName}</p>
                          <p><strong>Student Email:</strong> {query.studentId.email}</p>
                          <p><strong>Status:</strong> {query.status}</p>
                          
                          {query.responses && query.responses.length > 0 && (
                            <div style={styles.responsesSection}>
                              <h4 style={styles.responsesHeading}>Responses:</h4>
                              {query.responses.map((response, idx) => (
                                <div key={response._id} style={styles.responseItem}>
                                  <p style={styles.responseContent}>
                                    <strong>{response.responderId.name}:</strong> {response.content}
                                  </p>
                                  <p style={styles.responseDate}>
                                    {formatDate(response.createdAt)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Internal styles
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    marginBottom: '20px',
    color: '#333',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px',
  },
  tableContainer: {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
  },
  th: {
    backgroundColor: '#f8f9fa',
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '2px solid #dee2e6',
    position: 'sticky',
    top: 0,
  },
  tr: {
    borderBottom: '1px solid #dee2e6',
  },
  td: {
    padding: '12px 15px',
    textAlign: 'left',
    verticalAlign: 'middle',
  },
  expandedCell: {
    padding: '0',
    backgroundColor: '#f8f9fa',
  },
  detailPanel: {
    padding: '20px',
  },
  detailHeading: {
    marginTop: '0',
    marginBottom: '15px',
    color: '#007bff',
    borderBottom: '1px solid #dee2e6',
    paddingBottom: '10px',
  },
  detailContent: {
    lineHeight: '1.6',
  },
  responsesSection: {
    marginTop: '15px',
  },
  responsesHeading: {
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  responseItem: {
    backgroundColor: '#fff',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #dee2e6',
  },
  responseContent: {
    margin: '0 0 5px 0',
  },
  responseDate: {
    margin: '0',
    fontSize: '12px',
    color: '#6c757d',
    textAlign: 'right',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#d9534f',
  },
  noData: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#666',
  },
};

export default DepartQueryHistory;
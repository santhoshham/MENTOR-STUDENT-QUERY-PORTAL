import React, { useState, useEffect, useMemo } from "react";
import { RiSearchLine } from "react-icons/ri";
import axios from "axios";
import "../styles/QueryHistory.css";

function QueryHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Queries from API
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/student/all-queries",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (Array.isArray(response.data.data)) {
          setQueries(response.data.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setQueries([]);
        }
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError("Failed to fetch query history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  // Filter Queries Based on Search & Status
  const filteredQueries = useMemo(() => {
    return queries.filter((query) => {
      const matchesSearch =
        (query?.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (query?.departmentName?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        );
      const matchesStatus =
        statusFilter === "all" || query?.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [queries, searchTerm, statusFilter]);

  if (loading) return <div className="loading-spinner">Loading queries...</div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="query-history-container">
      <h2>Query History</h2>

      {/* Search & Filter Section */}
      <div className="search-filter">
        <div className="search-bar">
          <RiSearchLine className="search-icon" />
          <input
            type="text"
            placeholder="Search by title or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="solved">Solved</option>
        </select>
      </div>

      {/* Queries List */}
      <div className="query-list">
        {filteredQueries.length > 0 ? (
          filteredQueries.map((query, index) => (
            <div key={query._id || index} className="query-item">
              {/* TITLE SECTION - Title and Department */}
              <div className="query-title-row">
                <h3 className="query-title">{(query.title || "N/A").toUpperCase()}</h3>
           
              </div>
              
              {/* MAIN CONTENT - New two-row layout */}
              <div className="query-content-wrapper">
                {/* ROW 1: Description, Priority, Created At */}
                <div className="query-row">
                  <div className="query-field">
                    <span className="label">Description:</span>
                    <span className="value">{query.description || "N/A"}</span>
                  </div>
                  
                  <div className="query-field">
                    <span className="label">Priority:</span>
                    <span className="value">
                      {query.priority ? (
                        <span className={`priority ${query.priority}`}>
                          {query.priority}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </span>
                  </div>
                  
                  <div className="query-field">
                    <span className="label">Created:</span>
                    <span className="value">
                      {query.createdAt 
                        ? new Date(query.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
                
                {/* ROW 2: Response, Solved By, Resolved At, Status */}
                <div className="query-row">
                  <div className="query-field">
                    <span className="label">Latest Response:</span>
                    <span className="value">
                      {query.responses && query.responses.length > 0
                        ? query.responses[query.responses.length - 1].content
                        : "N/A"}
                    </span>
                  </div>
                  
                  <div className="query-field">
                    <span className="label">Assigned to:</span>
                    <span className="value">
                      {query.departmentName || "N/A"}
                    </span>
                  </div>
                  
                  <div className="query-field">
                    <span className="label">Resolved:</span>
                    <span className="value">
                      {query.resolvedAt 
                        ? new Date(query.resolvedAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  
                  <div className="query-field">
                    <span className="label">Status:</span>
                    <span className="value">
                      {query.status ? (
                        <span
                          className={`status-badge ${
                            query.status === "solved" ? "resolved" : "pending"
                          }`}
                        >
                          {query.status}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No queries found.</p>
        )}
      </div>
    </div>
  );
}

export default QueryHistory;
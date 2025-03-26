import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const QueryTable = ({ queries = [], setQueries, isLoading = false }) => {
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState({});

  const handleInputChange = (queryId, value) => {
    setResponses((prev) => ({ ...prev, [queryId]: value }));
  };

  const handleSubmit = async (queryId) => {
    if (!responses[queryId] || responses[queryId].trim().length === 0) {
      alert("Please add response content");
      return;
    }

    setLoading((prev) => ({ ...prev, [queryId]: true }));

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/department/queries/${queryId}/respond`,
        { response: responses[queryId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update query status and remove it from the table
      setQueries((prev) => prev.filter((query) => query._id !== queryId));

      // Clear input field
      setResponses((prev) => ({ ...prev, [queryId]: "" }));
    } catch (error) {
      console.error("Error submitting response:", error.response?.data || error.message);
    } finally {
      setLoading((prev) => ({ ...prev, [queryId]: false }));
    }
  };

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: 20, 
      transition: { duration: 0.2 } 
    }
  };

  // Helper to render status badges
  const renderStatusBadge = (status) => {
    const statusMap = {
      pending: "status-pending",
      "in-progress": "status-in-progress",
      solved: "status-solved"
    };
    
    const className = `status-badge ${statusMap[status] || "status-pending"}`;
    return <span className={className}>{status}</span>;
  };

  // Helper to render priority badges
  const renderPriorityBadge = (priority) => {
    const priorityMap = {
      high: "priority-high",
      medium: "priority-medium",
      low: "priority-low"
    };
    
    const className = `priority-badge ${priorityMap[priority] || "priority-medium"}`;
    return <span className={className}>{priority}</span>;
  };

  if (isLoading) {
    return (
      <div className="shimmer-container">
        <div className="shimmer shimmer-table-header"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="shimmer shimmer-row"></div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={tableVariants}
      initial="hidden"
      animate="visible"
      className="table-container"
    >
      <table className="query-table">
        <thead>
          <tr>
            <th>Query Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Response</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {queries.length > 0 ? (
              queries.map((query, index) => (
                <motion.tr 
                  key={query._id}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={index}
                  layout
                >
                  <td>{query.title}</td>
                  <td>{renderStatusBadge(query.status)}</td>
                  <td>{renderPriorityBadge(query.priority)}</td>
                  <td>
                    <textarea
                      value={responses[query._id] || ""}
                      onChange={(e) => handleInputChange(query._id, e.target.value)}
                      placeholder="Enter response..."
                    />
                  </td>
                  <td>
                    <button
                      className="send-btn"
                      onClick={() => handleSubmit(query._id)}
                      disabled={loading[query._id]}
                    >
                      {loading[query._id] ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                            <path d="M12 6v6l4 2"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 2L11 13"></path>
                            <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                          </svg>
                          Send
                        </>
                      )}
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <motion.tr variants={rowVariants}>
                <td colSpan="5" style={{ textAlign: "center", padding: "30px 0" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 10px", display: "block" }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <path d="M8 12h8"></path>
                  </svg>
                  No queries available
                </td>
              </motion.tr>
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  );
};

export default QueryTable;
import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";

const usePagination = (items, itemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  return {
    currentItems,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
  };
};

function Dashboard() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const queriesPerPage = 5;

  useEffect(() => {
    const fetchQueriesAndResponses = async () => {
      try {
        // Use the all-queries endpoint which already includes responses
        const queryResponse = await fetch(
          "http://localhost:5000/api/student/all-queries",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!queryResponse.ok) throw new Error("Failed to fetch queries");
        const queryData = await queryResponse.json();

        // Filter active queries (not solved)
        // Include "in-progress" in the valid statuses
        const activeQueries = queryData.data.filter(
          (query) => !query.status || ["unsolved", "new", "pending", "in-progress"].includes(query.status)
        );
        
        setQueries(activeQueries);
        console.log("Active queries:", activeQueries); // Debug log
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load queries and responses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQueriesAndResponses();
  }, []);

  const handleFeedbackSubmit = async (queryId, feedbackType) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/student/queries/${queryId}/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            feedback: feedbackType,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit feedback");
      }

      const data = await response.json();
      console.log("Feedback submitted:", data); // Debug log
      
      // Update the queries state to reflect changes
      if (feedbackType === "satisfied") {
        // Remove satisfied queries from UI
        setQueries((prevQueries) => 
          prevQueries.filter((q) => q._id !== queryId)
        );
      } else {
        // Update the feedback status for not satisfied queries
        setQueries((prevQueries) =>
          prevQueries.map((q) =>
            q._id === queryId ? { ...q, feedback: feedbackType } : q
          )
        );
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("Failed to submit feedback. Please try again.");
    }
  };

  const {
    currentItems,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(queries, queriesPerPage);

  return (
    <div className="dashboard">
      <h2>QUERIES</h2>

      {loading ? (
        <div className="shimmer-container">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="shimmer-card">
              <div className="shimmer-title"></div>
              <div className="shimmer-details">
                <div className="shimmer-description"></div>
                <div className="shimmer-resolved"></div>
              </div>
              <div className="shimmer-solution"></div>
              <div className="shimmer-feedback"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : currentItems.length === 0 ? (
        <div className="empty-state">No queries found.</div>
      ) : (
        <>
          <div className="queries-grid">
            {currentItems.map((query) => {
              const latestResponse =
                query.responses && query.responses.length > 0
                  ? query.responses[query.responses.length - 1]
                  : null;
              
              const hasResponse = latestResponse !== null;
              const hasFeedback = query.feedback !== undefined && query.feedback !== null;

              return (
                <div key={query._id} className="query-card">
                  <div className="card-row title-row">
                    <h3>{query.title ? query.title.toUpperCase() : "UNTITLED QUERY"}</h3>
                  </div>
                  
                  <div className="card-row details-row">
                    <div className="description">
                      <span className="label">Description:</span>
                      <span className="content">{query.description}</span>
                    </div>
                    <div className="resolved-by">
                      <span className="label">Resolved By:</span>
                      <span className="content">
                        {hasResponse 
                          ? (latestResponse.responderId?.name || "Unknown") 
                          : "Not assigned yet"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-row solution-row">
                    <div className="solution">
                      <span className="label">Solution:</span>
                      <div className="solution-content">
                        {hasResponse 
                          ? latestResponse.content 
                          : "Waiting for response..."}
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-row feedback-row">
                    <div className="feedback-status">
                      {hasFeedback ? (
                        <span className={`feedback-badge ${query.feedback === "satisfied" ? "satisfied" : "not-satisfied"}`}>
                          {query.feedback === "satisfied" 
                            ? "Satisfied" 
                            : "Not Satisfied"}
                        </span>
                      ) : hasResponse ? (
                        <span className="feedback-badge pending">
                          Feedback Pending
                        </span>
                      ) : null}
                    </div>
                    
                    {!hasFeedback && hasResponse && (
                      <div className="feedback-buttons">
                        <button
                          className="feedback-btn satisfied"
                          onClick={() => handleFeedbackSubmit(query._id, "satisfied")}
                        >
                          Satisfied
                        </button>
                        <button
                          className="feedback-btn not-satisfied"
                          onClick={() => handleFeedbackSubmit(query._id, "not_satisfied")}
                        >
                          Not Satisfied
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={goToPreviousPage}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={goToNextPage}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
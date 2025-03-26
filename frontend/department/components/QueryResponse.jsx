import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/queryResponse.css";

const QueryResponse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(null);
  const [responses, setResponses] = useState([]);
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueryDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const response = await axios.get(
          `http://localhost:5000/api/department/queries/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setQuery(response.data.query);
        setResponses(response.data.responses || []);
      } catch (error) {
        console.error("Error fetching query details:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQueryDetails();
  }, [id, navigate]);

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) return alert("Response cannot be empty!");
    
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/department/queries/${id}/respond`,
        { response: responseText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh responses
      setResponses([...responses, { content: responseText, createdAt: new Date().toISOString() }]);
      setResponseText("");
      alert("Response submitted successfully!");
    } catch (error) {
      console.error("Error submitting response:", error.response?.data || error.message);
    }
  };

  return (
    <div className="query-response-container">
      {loading ? (
        <div className="loading-indicator">Loading query details...</div>
      ) : query ? (
        <>
          <div className="query-header">
            <h2 className="query-title">{query.title}</h2>
            <div className="query-meta">
              <span className="query-status">Status: {query.status}</span>
              <span className="query-priority">Priority: {query.priority}</span>
            </div>
          </div>
          
          <div className="query-details">
            <p>{query.description}</p>
          </div>
          
          <div className="responses-section">
            <h3 className="responses-title">Responses</h3>
            {responses.length > 0 ? (
              <div className="responses-list">
                {responses.map((res, index) => (
                  <div key={index} className="response-item">
                    <div className="response-meta">
                      {new Date(res.createdAt).toLocaleString()}
                    </div>
                    <div className="response-text">{res.content}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-responses">No responses yet.</p>
            )}
          </div>
          
          <div className="response-form">
            <label htmlFor="response-input" className="response-label">
              Your Response
            </label>
            <textarea
              id="response-input"
              className="response-input"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Write your response..."
              rows={6}
            />
            <button 
              className="submit-response-btn"
              onClick={handleSubmitResponse}
            >
              Submit Response
            </button>
          </div>
        </>
      ) : (
        <div className="error-message">Could not load query details</div>
      )}
    </div>
  );
};

export default QueryResponse;
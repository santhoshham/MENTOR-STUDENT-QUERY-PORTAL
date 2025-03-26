import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/department.css";

const DepartQueryDetails = ({ match }) => {
  const [query, setQuery] = useState(null);
  const [response, setResponse] = useState("");
  const token = localStorage.getItem("token");
  const queryId = match.params.id;
  
  useEffect(() => {
    const fetchQuery = async () => {
      try {
        const queryResponse = await axios.get(`http://localhost:5000/api/student/queries/${queryId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuery(queryResponse.data);
        
        // If the query has a response, set it
        if (queryResponse.data.response) {
          setResponse(queryResponse.data.response);
        }
      } catch (error) {
        console.error("Error fetching query details:", error);
      }
    };
    fetchQuery();
  }, [queryId, token]);
  
  return query ? (
    <div className="query-details">
      <h2>{query.title}</h2>
      <p>{query.description}</p>
      <div className="response-container">
        <div className="response-box">
          {response ? (
            <p>{response}</p>
          ) : (
            <p>No response yet.</p>
          )}
        </div>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default DepartQueryDetails;
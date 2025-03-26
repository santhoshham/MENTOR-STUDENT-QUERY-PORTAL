import React, { useState } from "react";
import axios from "axios";

const ResponseBox = ({ queryId, token, refreshData }) => {
  const [response, setResponse] = useState("");

  const submitResponse = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/department/queries/${queryId}/respond`,
        { response },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Response submitted successfully!");
      refreshData();
    } catch (error) {
      console.error("Error submitting response:", error);
      alert("Failed to submit response.");
    }
  };

  return (
    <div className="response-box">
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Enter your response..."
      />
      <button onClick={submitResponse}>Submit Response</button>
    </div>
  );
};

export default ResponseBox;

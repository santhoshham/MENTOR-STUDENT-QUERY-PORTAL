import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/modal.css";

const ResponseModal = ({ query, onClose, onResponseSubmit }) => {
  const [responses, setResponses] = useState([]);
  const [newResponse, setNewResponse] = useState("");

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/department/queries/${query._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResponses(res.data.responses);
      } catch (error) {
        console.error("Error fetching responses:", error.response?.data || error.message);
      }
    };

    fetchResponses();
  }, [query]);

  const handleSubmitResponse = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/department/queries/${query._id}/respond`,
        { response: newResponse },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update query status to "solved"
      await axios.put(
        `http://localhost:5000/api/department/queries/${query._id}`,
        { status: "solved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onResponseSubmit();
      onClose();
    } catch (error) {
      console.error("Error submitting response:", error.response?.data || error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Responses for {query.title}</h3>
        <ul>
          {responses.map((res, index) => (
            <li key={index}>{res.content}</li>
          ))}
        </ul>

        <textarea
          value={newResponse}
          onChange={(e) => setNewResponse(e.target.value)}
          placeholder="Type your response here..."
        />

        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
          <button onClick={handleSubmitResponse} disabled={!newResponse.trim()}>
            Submit Response
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponseModal;

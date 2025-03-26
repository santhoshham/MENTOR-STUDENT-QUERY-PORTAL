import React, { useState, useRef } from 'react';
import { RiSendPlaneFill } from 'react-icons/ri';
import axios from 'axios';
import '../styles/QueryForm.css';

function QueryForm() {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    departmentName: '',
    priority: 'medium'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Also scroll to the form itself in case it's not at the top of the page
    if (formRef.current) {
      formRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Client-side validation - check title first (most common error)
    if (!formData.title || !formData.title.trim()) {
      setError("Title is required and cannot be empty.");
      setLoading(false);
      return;
    }

    // Check other required fields
    if (!formData.description || !formData.departmentName) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("You must be logged in to submit a query.");
        setLoading(false);
        return;
      }

      // Log the token (for debugging purposes)
      console.log("Token available:", token ? "Yes" : "No");
      
      // Use JSON for request
      const requestData = {
        title: formData.title.trim(),
        description: formData.description,
        departmentName: formData.departmentName,
        priority: formData.priority
      };
      
      console.log("🚀 Form Data Sent (JSON):", requestData);
      
      const response = await axios.post(
        "http://localhost:5000/api/student/queries",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("✅ Query Created:", response.data);
      setSuccess("Query submitted successfully!");
      setFormData({ title: "", description: "", departmentName: "", priority: "medium" });
      
      // Scroll to top after successful submission
      scrollToTop();
      
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error.message);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
        // Optional: Redirect to login page
        // window.location.href = "/login";
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Failed to submit query. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="student-query-form" ref={formRef}>
      <h2>Create New Query</h2>
      {error && <p className="student-query-error-message">{error}</p>}
      {success && <p className="student-query-success-message">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="student-query-form-row">
          <label htmlFor="title">Query Title <span className="student-query-required">*</span></label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="student-query-form-row">
          <label htmlFor="description">Description <span className="student-query-required">*</span></label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="student-query-form-row">
          <label htmlFor="priority">Priority <span className="student-query-required">*</span></label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="student-query-form-row">
          <label htmlFor="departmentName">Category <span className="student-query-required">*</span></label>
          <select
            id="departmentName"
            name="departmentName"
            value={formData.departmentName}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Academics">Academics</option>
            <option value="BIP Portal">BIP Portal</option>
            <option value="C0E">C0E</option>
            <option value="Fees">Fees</option>
            <option value="Hostel">Hostel</option>
            <option value="Mess">Mess</option>
            <option value="Moodle">Moodle</option>
            <option value="Non-Academics (Sports/NSS/Clubs)">Non-Academics (Sports/NSS/Clubs)</option>
            <option value="Others">Others</option>
            <option value="Personal">Personal</option>
            <option value="Personalized Skill">Personalized Skill</option>
            <option value="Skill / Reward Points">Skill / Reward Points</option>
            <option value="Special Lab">Special Lab</option>
            <option value="Student affairs">Student affairs</option>
            <option value="TAC">TAC</option>
            <option value="Training and Placement">Training and Placement</option>
            <option value="Transport">Transport</option>
          </select>
        </div>

        <button type="submit" className="student-query-submit-btn" disabled={loading}>
          <RiSendPlaneFill />
          {loading ? 'Submitting...' : 'Submit Query'}
        </button>
      </form>
    </div>
  );
}

export default QueryForm;
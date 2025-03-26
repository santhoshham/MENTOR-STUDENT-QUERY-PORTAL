import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  RiBuildingLine, 
  RiMailLine, 
  RiPhoneLine,
  RiFileTextLine,
  RiCheckLine,
  RiErrorWarningLine
} from 'react-icons/ri';
import '../styles/AddDepartment.css';

const AddDepartment = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        contactEmail: '',
        contactPhone: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [customDepartment, setCustomDepartment] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customName, setCustomName] = useState('');
    const [isFormDirty, setIsFormDirty] = useState(false);

    const departmentOptions = [
        "Academics", "BIP Portal", "COE", "Fees", "Hostel", "Mess", "Moodle",
        "Non-Academics (Sports/NSS/Clubs)", "Personal", "Personalized Skill",
        "Skill / Reward Points", "Special Lab", "Student Affairs", "TAC",
        "Training and Placement", "Transport", "Others"
    ];

    // Clear messages after 5 seconds
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess('');
                setError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setIsFormDirty(true);
        
        if (name === "name") {
            if (value === "Others") {
                setCustomDepartment(true);
                // Don't update form data yet for "Others"
            } else {
                setCustomDepartment(false);
                setFormData({ ...formData, [name]: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
        
        setError('');
        setSuccess('');
    };

    const handleCustomNameChange = (e) => {
        setCustomName(e.target.value);
        setFormData({ ...formData, name: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.name || !formData.description) {
            setError('Please fill in all required fields.');
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            setError('Unauthorized: No token found. Please log in.');
            return;
        }

        setLoading(true);

        try {
            const { data } = await axios.post(
                'http://localhost:5000/api/admin/departments',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setSuccess(data.message || 'Department added successfully!');
            setFormData({ name: '', description: '', contactEmail: '', contactPhone: '' });
            setCustomDepartment(false);
            setCustomName('');
            setIsFormDirty(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add department. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h1 className="form-title">Add Department</h1>

            <div className="form-header">
                <div>
                    <p className="form-subtitle">Create a new department in the system</p>
                </div>
                <RiBuildingLine size={24} color="#3b82f6" />
            </div>

            {error && (
                <div className="alert alert-error">
                    <RiErrorWarningLine className="alert-icon" />
                    {error}
                </div>
            )}
            
            {success && (
                <div className="alert alert-success">
                    <RiCheckLine className="alert-icon" />
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Department Name */}
                <div className="form-group">
                    <label>
                        Department Name
                        <span className="required">*</span>
                    </label>
                    <select
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Department</option>
                        {departmentOptions.map((dept, index) => (
                            <option key={index} value={dept}>{dept}</option>
                        ))}
                    </select>
                    
                    {customDepartment && (
                        <div className="custom-input-container">
                            <input
                                type="text"
                                className="form-control"
                                value={customName}
                                onChange={handleCustomNameChange}
                                placeholder="Enter custom department name"
                                required
                            />
                        </div>
                    )}
                </div>

                {/* Contact Email */}
                <div className="form-group">
                    <label>
                        Contact Email
                    </label>
                    <div className="input-with-icon">
                        <input
                            type="email"
                            className="form-control"
                            name="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleChange}
                            placeholder="Enter contact email"
                        />
                    </div>
                </div>

                {/* Description - Now placed below department and email */}
                <div className="form-group">
                    <label>
                        Description
                        <span className="required">*</span>
                    </label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter department description"
                        required
                    />
                </div>

                {/* Contact Phone */}
                <div className="form-group">
                    <label>
                        Contact Phone
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        placeholder="Enter contact phone"
                    />
                </div>

                <button 
                    type="submit" 
                    className={`btn btn-primary ${loading ? 'shimmer' : ''}`}
                    disabled={loading || !isFormDirty}
                >
                    {loading ? 'Adding Department...' : 'Add Department'}
                </button>
            </form>
        </div>
    );
};

export default AddDepartment;
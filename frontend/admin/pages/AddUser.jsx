import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiUserAddLine, RiCheckLine, RiErrorWarningLine } from 'react-icons/ri';
import '../styles/\AddUser.css'; // Assume you'll save the CSS as addUser.css

const AddUser = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFormDirty, setIsFormDirty] = useState(false);

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

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setIsFormDirty(true);
        setError('');
        setSuccess('');
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all required fields.');
            return;
        }
    
        setLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Unauthorized: No token found. Please log in.');
                setLoading(false);
                return;
            }
            
            const { data } = await axios.post(
                'http://localhost:5000/api/admin/users',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            setSuccess(data.message || 'User added successfully!');
            setFormData({ name: '', email: '', password: '', role: 'student' });
            setIsFormDirty(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add user. Try again.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="form-container">
            <div className="form-header">
                <div>
                    <h1 className="form-title">Add User/Student</h1>
                    <p className="form-subtitle">Create a new user in the system</p>
                </div>
                <RiUserAddLine size={24} color="#3b82f6" />
            </div>
            
            {error && (
                <div className="error-message">
                    <RiErrorWarningLine className="alert-icon" />
                    {error}
                </div>
            )}
            
            {success && (
                <div className="success-message">
                    <RiCheckLine className="alert-icon" />
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        Name
                        <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>
                        Email
                        <span className="required">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>
                        Password
                        <span className="required">*</span>
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>
                        Role
                        <span className="required">*</span>
                    </label>
                    <select 
                        name="role" 
                        value={formData.role} 
                        onChange={handleChange}
                    >
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                        <option value="department">Department</option>
                    </select>
                </div>

                <button 
                    type="submit"
                    className={`btn-save ${loading ? 'loading' : ''}`}
                    disabled={loading || !isFormDirty}
                >
                    {loading ? 'Adding User...' : 'Add User'}
                </button>
            </form>
        </div>
    );
};

export default AddUser;
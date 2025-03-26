import React, { useState } from 'react';
import axios from 'axios';

const DepartmentForm = () => {
    const [departmentData, setDepartmentData] = useState({
        name: '',
        description: '',
        head: ''
    });

    const handleChange = (e) => {
        setDepartmentData({ ...departmentData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/add-department', departmentData);
            alert('Department added successfully!');
            setDepartmentData({ name: '', description: '', head: '' });
        } catch (error) {
            console.error('Error adding department:', error);
            alert('Failed to add department.');
        }
    };

    return (
        <form className="department-form" onSubmit={handleSubmit}>
            <label>Department Name:</label>
            <input 
                type="text" 
                name="name" 
                value={departmentData.name} 
                onChange={handleChange} 
                required 
            />

            <label>Description:</label>
            <textarea 
                name="description" 
                value={departmentData.description} 
                onChange={handleChange} 
                required 
            />

            <label>Department Head:</label>
            <input 
                type="text" 
                name="head" 
                value={departmentData.head} 
                onChange={handleChange} 
                required 
            />

            <button type="submit">Add Department</button>
        </form>
    );
};

export default DepartmentForm;

import React, { useState } from 'react';
import axios from 'axios';

const UserForm = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        department: '',
        studentId: ''
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/add-user', userData);
            alert('User added successfully!');
            setUserData({
                name: '',
                email: '',
                password: '',
                role: '',
                department: '',
                studentId: ''
            });
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Failed to add user.');
        }
    };

    return (
        <form className="user-form" onSubmit={handleSubmit}>
            <label>Name:</label>
            <input 
                type="text" 
                name="name" 
                value={userData.name} 
                onChange={handleChange} 
                required 
            />

            <label>Email:</label>
            <input 
                type="email" 
                name="email" 
                value={userData.email} 
                onChange={handleChange} 
                required 
            />

            <label>Password:</label>
            <input 
                type="password" 
                name="password" 
                value={userData.password} 
                onChange={handleChange} 
                required 
            />

            <label>Role:</label>
            <select name="role" value={userData.role} onChange={handleChange} required>
                <option value="">Select Role</option>
                <option value="Student">Student</option>
                <option value="Admin">Admin</option>
            </select>

            {userData.role === 'Student' && (
                <>
                    <label>Department:</label>
                    <input 
                        type="text" 
                        name="department" 
                        value={userData.department} 
                        onChange={handleChange} 
                    />

                    <label>Student ID:</label>
                    <input 
                        type="text" 
                        name="studentId" 
                        value={userData.studentId} 
                        onChange={handleChange} 
                    />
                </>
            )}

            <button type="submit">Add User</button>
        </form>
    );
};

export default UserForm;

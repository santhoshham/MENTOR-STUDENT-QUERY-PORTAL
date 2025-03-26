import React, { useState } from 'react';
import '../styles/Login.css';
import { RiUserLine, RiLockPasswordLine } from 'react-icons/ri';

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // ✅ Show loading indicator

    // ✅ Basic Input Validation
    if (!credentials.email.includes('@') || credentials.password.length < 6) {
      setError('Invalid email or password. Ensure password is at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        console.log("Token:", data.token);  // Debugging log
        console.log("Role:", data.role);   
        onLogin(data);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Error connecting to server. Please try again.');
    } finally {
      setLoading(false); // ✅ Hide loading indicator
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="lform-group">
            <div className="linput-icon">
              <RiUserLine />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={credentials.email}
                onChange={handleChange}
                required
                aria-label="Enter your email"
              />
            </div>
          </div>

          <div className="lform-group">
            <div className="linput-icon">
              <RiLockPasswordLine />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                required
                aria-label="Enter your password"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}  // ✅ Prevent multiple submissions
          >
            {loading ? 'Logging in...' : 'Login'} {/* ✅ Loading Indicator */}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

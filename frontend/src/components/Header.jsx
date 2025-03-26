import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';
import ProfileMenu from './ProfileMenu';
import '../styles/Header.css';

function Header({ isCollapsed }) {
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        console.log("API response:", response.data); // Debugging log

        if (response.data.success) {
          setUser(response.data.data);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError("Failed to load profile.");
      }
    };

    fetchUserData();
  }, []);

  console.log("Header userData:", user?.name); // Debugging log

  return (
    <div className={`header ${isCollapsed ? 'nav-collapsed' : ''}`}>
      <div className="header-content">
        {/* Right Side - Controls (Welcome text near Bell) */}
        <h2 className="welcome-text">
          <span className="user-name">Welcome, {user?.name || 'Guest'}</span>
        </h2>
        <NotificationBell aria-label="Notifications" />
        <ThemeToggle aria-label="Toggle Theme" />
        <ProfileMenu userType="student" userData={user} />
      </div>
    </div>
  );
}

export default Header;

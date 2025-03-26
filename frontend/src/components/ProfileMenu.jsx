import React, { useState, useEffect } from 'react';
import { RiUserLine, RiSettings4Line, RiLogoutBoxRLine } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProfileMenu.css';

function ProfileMenu({ userType = 'student' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    console.log("Logging out..."); 
    localStorage.clear();
    navigate('/login', { replace: true });
    navigate(0); // Refresh the page after logout
  };

  if (error) return <div className="error-message">{error}</div>;

  if (!user) {
    return (
      <div className="profile-menu">
        <div className="lloading-spinner"></div> {/* Spinner Animation */}
      </div>
    );
  }

  return (
    <div className="profile-menu">
      <button 
        className="profile-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title={user?.name ?? 'User'}
      >
        <div className="avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <span>{user?.name?.charAt(0).toUpperCase() ?? 'U'}</span>  
          )}
        </div>
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <div className="avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{user?.name?.charAt(0).toUpperCase() ?? 'U'}</span>
              )}
            </div>
            <div className="user-info">
              <h4>{user?.name ?? 'Unknown User'}</h4>
              <p>{user?.email ?? 'No email available'}</p>
              <span className="user-role">{user?.role ?? 'N/A'}</span>
            </div>
          </div>
          
          <div className="profile-links">
            <button className="profile-link logout" onClick={handleLogout}>
              <RiLogoutBoxRLine />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;

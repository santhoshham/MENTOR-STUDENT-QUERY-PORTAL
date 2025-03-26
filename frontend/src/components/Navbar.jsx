import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';
import { 
  RiDashboardLine, 
  RiQuestionLine, 
  RiTeamLine, 
  RiHistoryLine, 
  RiMenuFoldLine, 
  RiMenuUnfoldLine 
} from 'react-icons/ri';

function Navbar({ isCollapsed, setIsCollapsed }) {
  const [isMobile, setIsMobile] = useState(false);
  
  // Check screen width on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial load
    
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsCollapsed]);

  const navItems = [
    { 
      id: 'dashboard', 
      icon: <RiDashboardLine />, 
      label: 'Dashboard', 
      path: '/student' 
    },
    { 
      id: 'queryForm', 
      icon: <RiQuestionLine />, 
      label: 'Query Form', 
      path: '/student/query' 
    },
    { 
      id: 'mentors', 
      icon: <RiTeamLine />, 
      label: 'Mentors List', 
      path: '/student/mentors' 
    },
    { 
      id: 'history', 
      icon: <RiHistoryLine />, 
      label: 'Query History', 
      path: '/student/history' 
    },
  ];
  
  return (
    <nav className={`navbar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="nav-brand">
        <button 
          className="toggle-btn" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <RiMenuUnfoldLine /> : <RiMenuFoldLine />}
        </button>
        <span>Student Dashboard</span>
      </div>
      
      <div className="nav-links">
        {navItems.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
    RiDashboardLine,
    RiBuildingLine,
    RiUserAddLine,
    RiQuestionLine,
    RiTimeLine,
    RiFileListLine,
    RiFeedbackLine,
    RiHistoryLine,
    RiMenuFoldLine,
    RiMenuUnfoldLine
} from 'react-icons/ri';

// Inline CSS for smooth transitions
const styles = `
.navbar {
  background-color: #1e293b;
  height: 100vh;
  width: 260px;
  position: fixed;
  left: 0;
  top: 0;
  color: #f8fafc;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow-x: hidden;
}

.navbar.collapsed {
  width: 70px;
}

.nav-brand {
  padding: 0 1.5rem;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
}

.toggle-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border-radius: 6px;
  margin-right: 0.5rem;
}

.toggle-btn:hover {
  background-color: rgba(148, 163, 184, 0.1);
  color: #f8fafc;
}

.toggle-btn:active {
  transform: scale(0.95);
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 0 0.75rem;
  overflow-y: auto;
}

.nav-link {
  text-decoration: none;
  color: #94a3b8;
  padding: 0.875rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  text-align: left;
  border-radius: 8px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
}

.nav-link:hover {
  background-color: rgba(148, 163, 184, 0.1);
  color: #f8fafc;
}

.nav-link.active {
  background-color: #3b82f6;
  color: #f8fafc;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
}

.nav-icon {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  transition: transform 0.3s ease;
}

.navbar.collapsed .nav-brand span {
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.navbar:not(.collapsed) .nav-brand span {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s;
}

.navbar.collapsed .nav-link {
  justify-content: center;
  padding: 0.875rem;
}

.navbar.collapsed .nav-label {
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.navbar:not(.collapsed) .nav-label {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s;
}

/* Tooltip for collapsed state */
.navbar.collapsed .nav-link:hover::after {
  content: attr(title);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background-color: #1e293b;
  color: #f8fafc;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  margin-left: 10px;
  white-space: nowrap;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 101;
  opacity: 1;
  transition: opacity 0.4s ease 0.1s;
}

/* Arrow for tooltip */
.navbar.collapsed .nav-link:hover::before {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: transparent #1e293b transparent transparent;
  margin-left: -2px;
  z-index: 102;
}
`;

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
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
    }, []);

    const navItems = [
        { icon: <RiDashboardLine />, label: 'Dashboard', path: '/admin' },
        { icon: <RiQuestionLine />, label: 'New Queries', path: '/admin/new-queries' },
        { icon: <RiTimeLine />, label: 'Pending Queries', path: '/admin/pending-queries' },
        { icon: <RiFileListLine />, label: 'Unsolved Queries', path: '/admin/unsolved-queries' },
        { icon: <RiBuildingLine />, label: 'Add Department', path: '/admin/add-department' },
        { icon: <RiUserAddLine />, label: 'Add User/Student', path: '/admin/add-user' },
        { icon: <RiBuildingLine />, label: 'Department Details', path: '/admin/department-details' },
        { icon: <RiHistoryLine />, label: 'Query History', path: '/admin/query-history' },
    ];

    return (
        <>
            {/* Inject the CSS styles */}
            <style>{styles}</style>
            
            <nav className={`navbar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="nav-brand">
                    <button 
                        className="toggle-btn" 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <RiMenuUnfoldLine /> : <RiMenuFoldLine />}
                    </button>
                    <span>Admin Panel</span>
                </div>

                <div className="nav-links">
                    {navItems.map(item => (
                        <NavLink
                            key={item.label}
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
        </>
    );
};

export default Sidebar;
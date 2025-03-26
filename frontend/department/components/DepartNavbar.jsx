import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, History, ChevronLeft, ChevronRight, Menu } from "lucide-react";

const DepartNavbar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname.includes(path);
  };
  
  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };
  
  return (
    <nav className={`dd-navbar ${collapsed ? 'dd-collapsed' : ''}`}>
      <div className="dd-nav-brand">
        <button className="dd-toggle-btn" onClick={toggleNavbar}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <span>Department Panel</span>
      </div>
      
      <div className="dd-nav-links">
        <Link
          to="/department/dashboard"
          className={`dd-nav-link ${isActive("/department/dashboard") ? "dd-active" : ""}`}
          title="Dashboard"
        >
          <div className="dd-nav-icon">
            <LayoutDashboard size={20} />
          </div>
          <span className="dd-nav-label">Dashboard</span>
        </Link>
        
        <Link
          to="/department/query-history"
          className={`dd-nav-link ${isActive("/department/query-history") ? "dd-active" : ""}`}
          title="Query History"
        >
          <div className="dd-nav-icon">
            <History size={20} />
          </div>
          <span className="dd-nav-label">Query History</span>
        </Link>
      </div>
      
      <style jsx>{`
        .dd-navbar {
          width: 250px;
          background: #1e293b;
          color: white;
          height: 100vh; /* Changed to 100vh */
          position: fixed;
          top: 0; /* Changed from 70px to 0 */
          left: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          z-index: 100;
          overflow-y: auto; /* Added to ensure scrollability */
        }
        
        .dd-collapsed {
          width: 70px;
        }
        
        .dd-nav-brand {
          display: flex;
          align-items: center;
          padding: 20px 15px; /* Adjusted padding */
          position: relative;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .dd-nav-brand span {
          font-weight: 600;
          font-size: 16px;
          white-space: nowrap;
          overflow: hidden;
          opacity: 1;
          transition: all 0.3s ease;
        }
        
        .dd-collapsed .dd-nav-brand span {
          opacity: 0;
          width: 0;
        }
        
        .dd-toggle-btn {
          background: rgba(255, 255, 255, 0.15);
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          margin-right: 10px;
          transition: all 0.3s ease;
        }
        
        .dd-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.25);
        }
        
        .dd-nav-links {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow-y: auto;
        }
        
        .dd-nav-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.8);
          padding: 12px 15px;
          margin: 5px 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .dd-nav-link:hover {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }
        
        .dd-active {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border-left: 4px solid white;
        }
        
        .dd-nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
        }
        
        .dd-nav-label {
          margin-left: 12px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .dd-collapsed .dd-nav-label {
          opacity: 0;
          width: 0;
          margin-left: 0;
        }
        
        /* If you have a header on top, use this style to adjust navbar position */
        .has-header .dd-navbar {
          top: 70px;
          height: calc(100vh - 70px);
        }
        
        @media (max-width: 768px) {
          .dd-navbar {
            width: 200px;
          }
          
          .dd-collapsed {
            width: 60px;
          }
        }
        
        @media (max-width: 576px) {
          .dd-navbar {
            width: 100%;
            height: auto;
            position: relative;
            min-height: 60px;
            flex-direction: row;
            padding: 10px;
          }
          
          .dd-collapsed {
            width: 100%;
          }
          
          .dd-nav-brand {
            padding: 0 10px;
            margin-bottom: 0;
            border-bottom: none;
          }
          
          .dd-nav-links {
            flex-direction: row;
            overflow-x: auto;
            padding-left: 10px;
          }
          
          .dd-nav-link {
            margin: 0 5px;
          }
          
          .dd-collapsed .dd-nav-label {
            opacity: 1;
            width: auto;
            margin-left: 12px;
          }
        }
      `}</style>
    </nav>
  );
};

export default DepartNavbar;
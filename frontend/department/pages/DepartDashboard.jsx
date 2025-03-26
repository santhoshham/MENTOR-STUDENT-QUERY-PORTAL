import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StatsCard from "../components/StatsCard";
import QueryTable from "../components/QueryTable";
import "../styles/department.css";

const DepartDashboard = () => {
  const [queries, setQueries] = useState([]);
  const [stats, setStats] = useState({ solved: 0, pending: 0, inProgress: 0, total: 0 });
  const [departmentName, setDepartmentName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartmentDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, redirecting to login...");
          return navigate("/login");
        }

        // Fetch user profile to get department name
        const userRes = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userRes.data.success && userRes.data.user.role === "department") {
          setDepartmentName(userRes.data.user.departmentName);
        } else {
          console.warn("User is not a department, redirecting...");
          return navigate("/login");
        }

        // Fetch department-specific queries
// In the DepartDashboard component:
const queryRes = await axios.get("http://localhost:5000/api/department/pending", {
  headers: { Authorization: `Bearer ${token}` },
});

console.log("Query response structure:", queryRes.data);

// Use the stats directly from the response
if (queryRes.data.stats) {
  setStats(queryRes.data.stats);
} else {
  // Fallback to calculating stats from the data if stats aren't provided
  const queriesData = queryRes.data.data || [];
  
  const solved = queriesData.filter((q) => q.status === "solved").length;
  const pending = queriesData.filter((q) => q.status === "pending").length;
  const inProgress = queriesData.filter((q) => q.status === "in-progress").length;
  const total = queriesData.length;
  
  setStats({ solved, pending, inProgress, total });
}

// Set the queries for the table
setQueries(queryRes.data.data || []);
      } catch (error) {
        console.error("Error fetching department details:", error.response?.data || error.message);
      } finally {
        // Set loading to false after data is fetched
        setIsLoading(false);
      }
    };

    fetchDepartmentDetails();
    
    // Setup refresh interval
    const intervalId = setInterval(() => {
      fetchDepartmentDetails();
    }, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId);
  }, [navigate]);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const titleVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="dashboard-container"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <motion.h2 
        className="dashboard-title"
        variants={titleVariants}
      >
        {isLoading ? (
          <div className="shimmer" style={{ width: "300px", height: "36px" }}></div>
        ) : (
          `${departmentName} Department Dashboard`
        )}
      </motion.h2>

      <div className="stats-container">
        {isLoading ? (
          <>
            <div className="shimmer shimmer-card"></div>
            <div className="shimmer shimmer-card"></div>
            <div className="shimmer shimmer-card"></div>
            <div className="shimmer shimmer-card"></div>
          </>
        ) : (
          <>
            <StatsCard 
              title="Total Queries" 
              count={stats.total} 
              color="primary"
              index={0}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              }
            />
            <StatsCard 
              title="Pending Queries" 
              count={stats.pending} 
              color="warning"
              index={1}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12" y2="16"></line>
                </svg>
              }
            />
            <StatsCard 
              title="In Progress" 
              count={stats.inProgress} 
              color="success"
              index={2}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4"></path>
                  <path d="M12 18v4"></path>
                  <path d="M4.93 4.93l2.83 2.83"></path>
                  <path d="M16.24 16.24l2.83 2.83"></path>
                  <path d="M2 12h4"></path>
                  <path d="M18 12h4"></path>
                  <path d="M4.93 19.07l2.83-2.83"></path>
                  <path d="M16.24 7.76l2.83-2.83"></path>
                </svg>
              }
            />
            <StatsCard 
              title="Solved Queries" 
              count={stats.solved} 
              color="danger"
              index={3}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              }
            />
          </>
        )}
      </div>

      <QueryTable 
        queries={queries} 
        setQueries={setQueries} 
        isLoading={isLoading} 
      />
    </motion.div>
  );
};

export default DepartDashboard;
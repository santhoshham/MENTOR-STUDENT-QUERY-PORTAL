import { Outlet, Navigate } from "react-router-dom";
import Header from '../src/components/Header';
import DepartNavbar from "./components/DepartNavbar";
import React from "react";
import "./styles/department.css";

const DepartApp = () => {
  const isDepartmentUser = localStorage.getItem("role") === "department";

  return isDepartmentUser ? (
    <div className="department-container">
      <Header />
      <div className="department-layout">
        <DepartNavbar />
        <main className="department-content">
          <Outlet />
        </main>
      </div>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default DepartApp;
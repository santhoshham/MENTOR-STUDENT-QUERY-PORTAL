import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from '../src/components/Header';
import Sidebar from './components/Sidebar';
import './styles/AdminApp.css';

const AdminApp = () => {
    const isAdmin = localStorage.getItem('role') === 'admin';
    
    if (!isAdmin) {
        return <Navigate to="/login" replace />;
    }
    
    return (
        <div className="admin-layout-container">
            <Header />
            <div className="admin-main-content">
                <Sidebar />
                <main className="admin-content-area">
                    <Outlet /> {/* This will render the nested routes */}
                </main>
            </div>
        </div>
    );
};

export default AdminApp;
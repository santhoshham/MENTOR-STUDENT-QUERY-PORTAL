import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import QueryForm from './components/QueryForm';
import Login from './components/Login';
import AdminApp from '../admin/AdminApp';
import Header from './components/Header';
import MentorsList from './components/MentorsList';
import MentorProfile from './components/MentorProfile';
import QueryHistory from './components/QueryHistory';
import socketService from './services/socket';
import useThemeStore from './store/themeStore';
import AddDepartment from '../admin/pages/AddDepartment';
import AddUser from '../admin/pages/AddUser';
import NewQueries from '../admin/pages/NewQueries';
import PendingQueries from '../admin/pages/PendingQueries';
import UnsolvedQueries from '../admin/pages/UnsolvedQueries';
import DepartmentDetails from '../admin/pages/DepartmentDetails';
import AdminQueryHistory from '../admin/pages/AdminQueryHistory';
import AdminDashboard from '../admin/pages/AdminDashboard';
import './styles/theme.css';
import DepartApp from '../department/DepartApp';
import DepartQueryDetails from '../department/pages/DepartQueryDetails';
import DepartDashboard from '../department/pages/DepartDashboard';
import DepartQueryHistory from '../department/pages/DepartQueryHistory';
import QueryResponse from '../department/components/QueryResponse';
import './App.css';
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { transports: ["websocket", "polling"] });

socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const isDarkMode = useThemeStore(state => state.isDarkMode);
  
  const navigate = useNavigate(); // ✅ Moved inside App component

  // Apply theme mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Check authentication state on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    console.log("Token:", token);  // Debugging log
    console.log("Role:", role);    // Debugging log
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    } else {
      setIsAuthenticated(false);
      setUserRole('');
    }

    setIsLoading(false); // Finished checking authentication
  }, []);

  // Handle login
  const handleLogin = (userData) => {
    const role = userData.user?.role; // Correctly extract role
    const token = userData.token;
  
    if (role && token) {
      localStorage.clear();
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
  
      setIsAuthenticated(true);
      setUserRole(role);
  
      socketService.connect(userData.user.id, role); // Use `id` instead of `_id`
  
      navigate(
        role === 'admin' ? '/admin' :
        role === 'student' ? '/student' : 
        role === 'department' ?'/depart':
        '/login', 
        { replace: true }
      );
    } else {
      console.error("Error: Role or token missing in API response.");
    }
  };
  
  const getRedirectPath = (role) => {
    if (!role) return "/login"; // Ensure it redirects to login if no role is found
    switch (role) {
       case 'admin': return '/admin';
       case 'student': return '/student';
       case 'department': return '/department'; // Ensure this is correct
       default: return '/login';
    }
 };
 
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    setIsAuthenticated(false);
    setUserRole('');

    socketService.disconnect();

    navigate('/login', { replace: true }); // ✅ Correct usage inside component
  };

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Layout for authenticated users
  const AuthenticatedLayout = ({ children }) => (
    <div className="app">
      <Navbar isCollapsed={isNavCollapsed} setIsCollapsed={setIsNavCollapsed} onLogout={handleLogout} />
      <Header isCollapsed={isNavCollapsed} />
      <main className={`main-content ${isNavCollapsed ? 'content-expanded' : ''}`}>
        {children}
      </main>
    </div>
  );

  // **Prevent rendering routes until auth check is done**
  if (isLoading) {
    return <div>Loading...</div>; // Placeholder until auth check completes
  }

  return (
    <Routes>
      {/* Root route: Redirect based on authentication */}
      <Route path="/" element={<Navigate to={getRedirectPath(userRole)} replace />} />
<Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to={getRedirectPath(userRole)} replace />} />



      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Dashboard />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/student/query" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <QueryForm />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/mentors" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <MentorsList />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/mentors/:mentorId" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <MentorProfile />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/student/history" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <QueryHistory />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />


      {/* Profile Routes */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <div>Profile Page (Coming Soon)</div>
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <div>Settings Page (Coming Soon)</div>
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />

<Route path="/admin" element={
  <ProtectedRoute allowedRoles={['admin']}>
      <AdminApp />
  </ProtectedRoute>
}>
  <Route index element={<AdminDashboard />} />
  <Route path="add-department" element={<AddDepartment />} />
  <Route path="add-user" element={<AddUser />} />
  <Route path="new-queries" element={<NewQueries />} />
  <Route path="pending-queries" element={<PendingQueries />} />
  <Route path="unsolved-queries" element={<UnsolvedQueries />} />
  <Route path="department-details" element={<DepartmentDetails />} />
  <Route path="query-history" element={<AdminQueryHistory />} />
</Route>

<Route path="/department" element={<ProtectedRoute allowedRoles={['department']}><DepartApp /></ProtectedRoute>}>
  <Route index element={<DepartDashboard />} />
  <Route path="query-history" element={<DepartQueryHistory />} />
  <Route path="/department/query/:id" element={<QueryResponse />} />

</Route>


      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

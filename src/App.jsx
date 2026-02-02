// src/App.jsx
// Simple app with login and register routes only for testing
// Add this entire file to replace your current App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';      
import Register from './pages/Register'; 
import Dashboard from './pages/Dashboard';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="p-4">
        <Routes>
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
  <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />

  {/* Protected dashboard - CHANGE THIS LINE (was probably missing or placeholder) */}
  <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />

  {/* Redirect root and everything else */}
  <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
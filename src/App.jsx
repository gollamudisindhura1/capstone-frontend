import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
 const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="p-4">
        <Routes>
          {/* Public routes - use real components */}
          <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />

          {/* Protected placeholder for dashboard */}
          <Route path="/dashboard" element={token ? <div className="text-center py-5">
            <h1>Dashboard</h1>
            <p>Projects list will come here (next step)</p>
          </div> : <Navigate to="/login" />} />

          {/* Redirect everything else to login */}
          <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;